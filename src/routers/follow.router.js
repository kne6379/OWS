import express from 'express';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { prisma } from '../utils/prisma.util.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';

const followRouter = express.Router();

followRouter.post('/:followId', requireAccessToken, async (req, res, next) => {
  try {
    const user = req.user;
    const { followId } = req.params;

    // 자기 자신 팔로우시 정지
    if (user.userId == followId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: res.statusCode,
        message: '자기 자신은 팔로우 할 수 없습니다.',
      });
    }

    // 중복 팔로우 검사
    const existedfollow = await prisma.follows.findUnique({
      where: {
        followingid_followedbyid: {
          followedbyid: user.userId,
          followingid: +followId,
        },
      },
    });

    // 팔로우하려는 유저가 존재하는지 확인
    const userfollowcheck = await prisma.user.findUnique({
      where: {
        userId: +followId,
      },
    });
    if (!userfollowcheck) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: res.statusCode,
        message: '존재하지 않는 유저입니다.',
      });
    }

    // 중복 팔로우 시 팔로우 데이터 삭제
    if (existedfollow) {
      const deleteFollow = await prisma.follows.delete({
        where: {
          followingid_followedbyid: {
            followedbyid: user.userId,
            followingid: +followId,
          },
        },
      });

      return res.status(HTTP_STATUS.OK).json({
        status: res.statusCode,
        message: '팔로우가 해제되었습니다.',
        deleteFollow,
      });
    }

    // 팔로잉 데이터 생성
    const follow = await prisma.follows.create({
      data: {
        followedbyid: user.userId,
        followingid: +followId,
      },
    });
    return res.status(HTTP_STATUS.OK).json({
      status: res.statusCode,
      message: '해당 유저를 팔로우 하였습니다.',
      follow,
    });
  } catch (error) {
    next(error);
  }
});

// 팔로우 목록조회
followRouter.get('/', requireAccessToken, async (req, res, next) => {
  try {
    const user = req.user;
    const followList = await prisma.user.findMany({
      where: {
        userId: user.userId,
      },
      select: {
        nickName: true,
        userId: true,
        followedby: true,
        following: true,
      },
    });
    return res
      .status(HTTP_STATUS.OK)
      .json({
        status: res.statusCode,
        message: '팔로우 목록 조회에 성공하였습니다.',
        followList,
      });
  } catch (error) {
    next(error);
  }
});

export { followRouter };
