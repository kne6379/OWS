import express from 'express';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { prisma } from '../utils/prisma.util.js';
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

// 프로필 수정 API
userRouter.patch('/profile', requireAccessToken, async (req, res, next) => {
  try {
    const user = req.user;
    console.log(user);
    const {
      introduce,
      profile_img_url,
      maxweight,
      weight,
      height,
      muscleweight,
      fat,
      metabolic,
    } = req.body;

    await prisma.$transaction(async (tx) => {
      // 프로필 데이터 수정
      const profileData = await tx.profile.update({
        where: { userId: user.userId },
        data: {
          ...(introduce && { introduce }),
          ...(profile_img_url && { profile_img_url }),
          ...(maxweight && { maxweight }),
          ...(weight && { weight }),
          ...(height && { height }),
          ...(muscleweight && { muscleweight }),
          ...(fat && { fat }),
          ...(metabolic && { metabolic }),
        },
      });

      const logData = await tx.log.create({
        data: {
          profileId: profileData.profileId,
        },
      });
      return res.status(HTTP_STATUS.OK).json({
        status: res.statusCode,
        message: MESSAGES.USRES.READ.SUCCEED,
        profileData,
      });
    });
  } catch (error) {
    next(error);
  }
});

export { userRouter };
