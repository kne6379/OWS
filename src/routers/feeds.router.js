import express from 'express';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import joi from 'joi';
import { prisma } from '../utils/prisma.util.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';

const feedsRouter = express.Router();

// joi 유효성 검사
const createdFeedsSchema = joi.object({
  title: joi.string().required(),
  content: joi.string().min(100).required(),
  feed_img_url: joi.string().uri(),
});

// 게시물 작성 API
feedsRouter.post('/feeds', requireAccessToken, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const validation = await createdFeedsSchema.validateAsync(req.body);
    const { title, content, feed_img_url } = validation;

    const { nickName } = await prisma.user.findFirst({
      where: { userId },
      select: {
        nickName: true,
      },
    });

    const feed = await prisma.feed.create({
      data: {
        userId,
        nickName,
        title,
        content,
        feed_img_url,
      },
      select: {
        feedId: true,
        userId: true,
        title: true,
        nickName: true,
        content: true,
        feed_img_url: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return res.status(HTTP_STATUS.CREATED).json({
      status: HTTP_STATUS.CREATED,
      message: MESSAGES.FEAD.COMMON.SUCCEED.CREATED,
      data: feed,
    });
  } catch (error) {
    next(error);
  }
});

// 게시물 목록 조회 API

feedsRouter.get('/feeds', async (req, res, next) => {
  const orderBy = req.query.sort ? req.query.sort.toLowerCase() : 'desc';

  const feeds = await prisma.feed.findMany({
    select: {
      feedId: true,
      nickName: true,
      title: true,
      content: true,
      feed_img_url: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: orderBy },
  });

  return res.status(HTTP_STATUS.OK).json({
    status: HTTP_STATUS.OK,
    message: MESSAGES.FEAD.COMMON.SUCCEED.GET_ALL,
    data: feeds,
  });
});

// 게시물 상세 조회 API

feedsRouter.get('/feeds/:feedId', async (req, res, next) => {
  try {
    const { feedId } = req.params;

    const feed = await prisma.feed.findFirst({
      where: { feedId: +feedId },
      select: {
        feedId: true,
        nickName: true,
        title: true,
        content: true,
        feed_img_url: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!feed) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({
          status: HTTP_STATUS.NOT_FOUND,
          message: MESSAGES.FEAD.COMMON.NO.FEAD,
        });
    }
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.FEAD.COMMON.SUCCEED.GET,
      data: feed,
    });
  } catch (error) {
    next(error);
  }
});

// joi 유효성 검사
const patchFeedSchema = joi.object({
  title: joi.string(),
  content: joi.string().min(100),
  feed_img_url: joi.string().uri(),
});

// 게시물 수정 API

feedsRouter.patch(
  '/feeds/:feedId',
  requireAccessToken,
  async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { feedId } = req.params;
      const validation = await patchFeedSchema.validateAsync(req.body);
      const { title, content, feed_img_url } = validation;
      if (!title && !content && !feed_img_url) {
				return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({
          status: HTTP_STATUS.BAD_REQUEST,
          message: MESSAGES.FEAD.COMMON.REQUIRED.UPDATED,
        });
      }
      const { nickName } = await prisma.user.findFirst({
        where: { userId },
        select: {
          nickName: true,
        },
      });

      const feed = await prisma.feed.findFirst({
        where: {
          userId,
          feedId: +feedId,
        },
      });
      if (!feed) {
				return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({
          status: HTTP_STATUS.NOT_FOUND,
          message: MESSAGES.FEAD.COMMON.NO.FEAD,
        });
      }

      const updatedFeed = await prisma.feed.update({
        where: {
          userId,
          feedId: +feedId,
        },
        data: {
          nickName,
          title: title || undefined,
          content: content || undefined,
          feed_img_url: feed_img_url || undefined,
        },
        select: {
          feedId: true,
          userId: true,
          nickName: true,
          title: true,
          content: true,
          feed_img_url: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.FEAD.COMMON.SUCCEED.UPDATED,
        data: updatedFeed,
      });
    } catch (error) {
      next(error);
    }
  },
);

// 게시물 삭제 API

feedsRouter.delete(
  '/feeds/:feedId',
  requireAccessToken,
  async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { feedId } = req.params;
      const feed = await prisma.feed.findUnique({
        where: {
          userId,
          feedId: +feedId,
        },
      });
      if (!feed) {
				return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({
          status: HTTP_STATUS.NOT_FOUND,
          message: MESSAGES.FEAD.COMMON.NO.FEAD,
        });
      }
      await prisma.feed.delete({
        where: {
          feedId: +feedId,
        },
      });
      return res
        .status(HTTP_STATUS.OK)
        .json({
          status: HTTP_STATUS.OK,
          message: MESSAGES.FEAD.COMMON.SUCCEED.DELETED,
          deletedFeedId: +feedId,
        });
    } catch (error) {
      next(error);
    }
  },
);
export default feedsRouter;
