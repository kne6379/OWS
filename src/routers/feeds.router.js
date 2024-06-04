import express from 'express';
import joi from 'joi';
import { prisma } from '../utils/prisma.util.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { authAccessToken } from '../middlewares/auth-accesstoken.middleware.js';

const feedsRouter = express.Router();

// joi 유효성 검사
const createdFeedsSchema = joi.object({
  title: joi.string().required(),
  content: joi.string().min(150).required(), // 100
  img_url: joi.string().uri(), //feed_img_url
});

// 게시물 작성 API
feedsRouter.post('/', authAccessToken, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const validation = createdFeedsSchema.validateAsync(req.body);
    const { title, content, img_url } = validation;

    const nickName = await prisma.users.findFirst({
      where: { userId },
      select: {
        nickName: true,
      },
    });

    const feed = await prisma.feeds.create({
      data: {
        UserId: userId, // userId
        // FK 외부키로 대문자 U를 하였으나 실제 스키마 적용에따라 수정
        // 현재 ERD 에는 userId 라고 설정되어 있음
        nickName,
        title,
        content,
        img_url, //feed_img_url
      },
      select: {
        feedId: true,
        UserId: true,
        title: true,
        nickName: true,
        content: true,
        img_url: true, //feed_img_url
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

feedsRouter.get('/', async (req, res, next) => {
  const orderBy = req.query.sort ? req.query.sort.toLowerCase() : 'desc';

  // 목록 조회 updatedAt 뿐만이 아닌 createdAt 도 필요 대상아닌지 상의
  const feeds = await prisma.feeds.findMany({
    select: {
      feedId: true,
      title: true,
      nickName: true,
      content: true, //feed_img_url
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

feedsRouter.get('/:feedId', async (req, res, next) => {
  try {
    const feedId = req.params;

    const feed = await prisma.feeds.findFirst({
      where: { feedId: +feedId },
      select: {
        feedId: true,
        nickName: true,
        title: true,
        content: true, //feed_img_url
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

feedsRouter.patch('/:feedId', authAccessToken, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const feedId = req.params;
    const validation = patchFeedSchema.validateAsync(req.body);
    const { title, content, feed_img_url } = validation;
    if (!title && !content && !feed_img_url) {
      throw new Error('수정할 정보를 입력해주세요.');
    }
    const nickName = await prisma.users.findFirst({
      where: { userId },
      celect: {
        nickName: true,
      },
    });

    const feed = await prisma.feeds.findFirst({
      where: {
        userId,
        feedId: +feedId,
      },
    });
    if (!feed) {
      throw new Error('게시물이 존재하지 않습니다.');
    }

    const updatedFeed = await prisma.feeds.update({
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
    return res.status(200).json({
      status: 200,
      message: '게시글 수정에 성공했습니다.',
      data: updatedFeed,
    });
  } catch (error) {
    next(error);
  }
});

export { feedsRouter };
