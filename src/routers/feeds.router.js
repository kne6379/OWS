import express from 'express';
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
    return res.status(201).json({
      status: 201,
      message: '게시글 생성에 성공했습니다.',
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

  return res.status(200).json({
    status: 200,
    message: '게시물 목록 조회에 성공하였습니다.',
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
      throw new Error('게시물이 존재하지 않습니다.');
    }
    return res.status(200).json({
      status: 200,
      message: '게시물 조회에 성공하였습니다.',
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

feedsRouter.patch('/feeds/:feedId', requireAccessToken, async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { feedId } = req.params;
      const validation = await patchFeedSchema.validateAsync(req.body);
      const { title, content, feed_img_url } = validation;
      if (!title && !content && !feed_img_url) {
        throw new Error('수정할 정보를 입력해주세요.');
      }
      const { nickName } = await prisma.user.findFirst({
        where: { userId },
        select: {
          nickName: true
        },
      });

      const feed = await prisma.feed.findFirst({
        where: {
          userId,
          feedId: +feedId,
        },
      });
      if (!feed) {
        throw new Error('게시물이 존재하지 않습니다.');
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
          feed_img_url: feed_img_url || undefined
        },
        select: {
          feedId: true,
          userId: true,
          nickName: true,
          title: true,
          content: true,
          feed_img_url: true,
          createdAt: true,
          updatedAt: true
        },
      });
      return res.status(200).json({
        status: 200,
        message: '게시글 수정에 성공했습니다.',
        data: updatedFeed,
      });
    } catch (error) {
      next(error);
    }
	
});

// 게시물 삭제 API

feedsRouter.delete('/feeds/:feedId', requireAccessToken, async(req, res, next) => {
	try {
		const { userId } = req.user;
		const { feedId } = req.params;
		const feed = await prisma.feed.findUnique({
			where: {
				userId,
				feedId: +feedId
			}
		});
		if (!feed) {
			throw new Error('게시물이 존재하지 않습니다.')
		}
		await prisma.feed.delete({
			where: {
				feedId: +feedId
			}
		});
		return res.status(200).json({status: 200, message: "게시물 삭제에 성공했습니다.", deletedFeedId: +feedId});
	} catch(error) {
		next(error);
	}

});
export default feedsRouter;
