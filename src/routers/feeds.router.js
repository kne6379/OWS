import express from 'express';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { prisma } from '../utils/prisma.util.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { feadCreateValidator } from '../middlewares/validators/fead-create-validator.middleware.js';
import { feadUpdateValidator } from '../middlewares/validators/fead-update-validator.middleware.js';

const feedsRouter = express.Router();

// 게시물 작성 API

feedsRouter.post(
  '/',
  requireAccessToken,
  feadCreateValidator,
  async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { title, content, feed_img_url } = req.body;

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
  },
);

// 게시물 목록 조회 API

feedsRouter.get('/', async (req, res, next) => {
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

feedsRouter.get('/:feedId', async (req, res, next) => {
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
      return res.status(HTTP_STATUS.NOT_FOUND).json({
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

// 게시물 수정 API

feedsRouter.patch(
  '/:feedId',
  requireAccessToken,
  feadUpdateValidator,
  async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { feedId } = req.params;
      const { title, content, feed_img_url } = req.body;
      if (!title && !content && !feed_img_url) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          status: HTTP_STATUS.BAD_REQUEST,
          message: MESSAGES.FEAD.COMMON.REQUIRED.UPDATE,
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
        return res.status(HTTP_STATUS.NOT_FOUND).json({
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
  '/:feedId',
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
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          status: HTTP_STATUS.NOT_FOUND,
          message: MESSAGES.FEAD.COMMON.NO.FEAD,
        });
      }
      await prisma.feed.delete({
        where: {
          feedId: +feedId,
        },
      });
      return res.status(HTTP_STATUS.OK).json({
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
