import express from 'express';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { prisma } from '../utils/prisma.util.js';
import { Prisma } from '@prisma/client';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import bcrypt from 'bcrypt';
import { HASH_SALT_ROUNDS } from '../constants/auth.constant.js';
import {
  profileUpdateValidator,
  passwordUpdateValidator,
} from '../middlewares/validators/user-profile-validator.middleware.js';

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

//패스워드 수정 API
userRouter.patch(
  '/password',
  passwordUpdateValidator,
  requireAccessToken,
  async (req, res, next) => {
    const user = req.user;
    const { updatePassword, repeat_password, password } = req.body;
    const prevPassword = await prisma.user.findUnique({
      where: {
        userId: user.userId,
      },
      select: {
        password: true,
      },
    });

    const passwordMatched =
      prevPassword && bcrypt.compareSync(password, prevPassword.password);
    if (!passwordMatched) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: res.statusCode,
        message: MESSAGES.AUTH.COMMON.REPEAT_PASSWORD.NOT_MATCHED,
      });
    }

    const hashedPassword = bcrypt.hashSync(updatePassword, HASH_SALT_ROUNDS);
    const newPassword = await prisma.user.update({
      where: {
        userId: user.userId,
      },
      data: {
        password: hashedPassword,
      },
    });
    return res.status(HTTP_STATUS.OK).json({
      status: res.statusCode,
      message: MESSAGES.USRES.PASSWORD.UPDATE.SUCCEED,
    });
  },
);

// 프로필 수정, 로그 기록 API
userRouter.patch(
  '/profile',
  requireAccessToken,
  profileUpdateValidator,
  async (req, res, next) => {
    try {
      const user = req.user;
      const {
        showLog,
        introduce,
        profile_img_url,
        maxweight,
        weight,
        height,
        muscleweight,
        fat,
        metabolic,
      } = req.body;

      const updateData = {
        ...(introduce && { introduce }),
        ...(profile_img_url && { profile_img_url }),
        ...(maxweight && { maxweight }),
        ...(weight && { weight }),
        ...(height && { height }),
        ...(muscleweight && { muscleweight }),
        ...(fat && { fat }),
        ...(metabolic && { metabolic }),
      };
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
              ...updateData,
              showLog,
            },
          });
          // 로그 데이터 추가
          for (let key in updateData) {
            if (prevProfile[key] !== updateData[key]) {
              await tx.log.create({
                data: {
                  profileId: profileData.profileId,
                  changeField: key,
                  oldValue: String(prevProfile[key]),
                  newValue: String(updateData[key]),
                },
              });
            }
          }
          return res.status(HTTP_STATUS.OK).json({
            status: res.statusCode,
            message: MESSAGES.USRES.UPDATE.SUCCEED,
            profileData,
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
      );
    } catch (error) {
      next(error);
    }
  },
);

export { userRouter };
