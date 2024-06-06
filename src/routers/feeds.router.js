import express from 'express';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { prisma } from '../utils/prisma.util.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { feedCreateValidator } from '../middlewares/validators/feed-create-validator.middleware.js';
import { feedUpdateValidator } from '../middlewares/validators/feed-update-validator.middleware.js';
import { commentRouter } from './comments.router.js';
import { likeRouter } from './like.router.js';

const feedsRouter = express.Router();

// 게시물 작성 API

feedsRouter.post(
  '/',
  requireAccessToken,
  feedCreateValidator,
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
        message: MESSAGES.FEED.COMMON.SUCCEED.CREATED,
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
    orderBy: {
      updatedAt: orderBy,
    },
  });

  return res.status(HTTP_STATUS.OK).json({
    status: HTTP_STATUS.OK,
    message: MESSAGES.FEED.COMMON.SUCCEED.GET_ALL,
    data: feeds,
  });
});

//게시물 팔로우 우선 조회 API

feedsRouter.get('/follow', requireAccessToken, async (req, res, next) => {
  try {
    const user = req.user;
    const feeds = await prisma.feed.findMany({
      where: {
        user: {
          following: {
            some: {
              followedbyid: user.userId,
            },
          },
        },
      },
    });
    return res.status(HTTP_STATUS.OK).json({ feeds });
  } catch (error) {
    next(error);
  }
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
        likedUsersId: true,
        createdAt: true,
        updatedAt: true,
        comment: true,
      },
    });
    if (!feed) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.FEED.COMMON.NO.FEED,
      });
    }
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.FEED.COMMON.SUCCEED.GET,
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
  feedUpdateValidator,
  async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { feedId } = req.params;
      const { title, content, feed_img_url } = req.body;
      if (!title && !content && !feed_img_url) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          status: HTTP_STATUS.BAD_REQUEST,
          message: MESSAGES.FEED.COMMON.REQUIRED.UPDATE,
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
          message: MESSAGES.FEED.COMMON.NO.FEED,
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
        message: MESSAGES.FEED.COMMON.SUCCEED.UPDATED,
        data: updatedFeed,
      });
    } catch (error) {
      next(error);
    }
  },
);

// 게시물 삭제 API

feedsRouter.delete('/:feedId', requireAccessToken, async (req, res, next) => {
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
        message: MESSAGES.FEED.COMMON.NO.FEED,
      });
    }
    await prisma.feed.delete({
      where: {
        feedId: +feedId,
      },
    });
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.FEED.COMMON.SUCCEED.DELETED,
      deletedFeedId: +feedId,
    });
  } catch (error) {
    next(error);
  }
});

feedsRouter.use('/:feedId/comments', commentRouter);

export default feedsRouter;
