import express from 'express';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { prisma } from '../utils/prisma.util.js';
import { Prisma } from '@prisma/client';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';

const userRouter = express.Router();

// 유저 프로필 조회 API
userRouter.get('/:profileId', async (req, res, next) => {
  const { profileId } = req.params;
  let userProfile = await prisma.profile.findUnique({
    where: {
      profileId: +profileId,
    },
  });
  if (!userProfile.showLog) {
    userProfile = {
      nickName: userProfile.nickName,
      userId: userProfile.userId,
      createdAt: userProfile.createdAt,
    };
  }
  return res.status(HTTP_STATUS.OK).json({
    userProfile,
    status: res.statusCode,
    message: MESSAGES.USRES.READ.SUCCEED,
  });
});

userRouter.patch('/profile', requireAccessToken, async (req, res, next) => {
  try {
    const user = req.user;
    console.log(user);
    const updateProfileData = req.body;
    const prevProfile = await prisma.profile.findUnique({
      where: {
        userId: user.userId,
      },
    });
    await prisma.$transaction(
      async (tx) => {
        // 프로필 데이터 수정
        const profileData = await tx.profile.update({
          where: { userId: user.userId },
          data: {
            ...updateProfileData,
          },
        });
        // 로그 데이터 추가
        for (let key in updateProfileData) {
          if (prevProfile[key] !== updateProfileData[key]) {
            await tx.log.create({
              data: {
                profileId: profileData.profileId,
                changeField: key,
                oldValue: String(prevProfile[key]),
                newValue: String(updateProfileData[key]),
              },
            });
          }
        }
        return res.status(HTTP_STATUS.OK).json({
          status: res.statusCode,
          message: MESSAGES.USRES.READ.SUCCEED,
          profileData,
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
    );
  } catch (error) {
    next(error);
  }
});

export { userRouter };
