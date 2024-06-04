import express from 'express';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { prisma } from '../utils/prisma.util.js';
import { authAccessToken } from '../middlewares/auth-accesstoken.middleware.js';

const userRouter = express.Router();

// 유저 프로필 조회 API
userRouter.get('/:profileId', async (req, res, next) => {
  const { profileId } = req.params;
  let userProfile = await prisma.profile.findUnique({
    where: { profileId },
  });

  if (!userProfile.showLog) {
    userProfile = userProfile.map((profile) => {
      return {
        nickName: profile.nickName,
        userId: profile.userId,
        createdAt: profile.createdAt,
      };
    });
  }
  return res
    .status(HTTP_STATUS.OK)
    .json({ status: res.statusCode, message: MESSAGES.USRES.READ.SUCCEED });
});

userRouter.patch('/profile', authAccessToken, async (req, res, next) => {
  const { userId } = req.user;

  const {
    nickName,
    introduce,
    profile_img_url,
    maxweight,
    weight,
    height,
    mus,
  } = req.body;
});

export { userRouter };
