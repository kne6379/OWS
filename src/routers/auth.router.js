import express from 'express';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { signupValidator } from '../middlewares/validators/sign-up-validator.middleware.js';
import { prisma } from '../utils/prisma.util.js';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import {
  ACCESS_TOKEN_EXPIRES,
  HASH_SALT_ROUNDS,
  REFRESH_TOKEN_EXPIRES,
} from '../constants/auth.constant.js';
import jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from '../constants/env.constant.js';
import { signInValidator } from '../middlewares/validators/sign-in-validator.middleware.js';
import { requireRefreshToken } from '../middlewares/require-refresh-token.middleware.js';

const authRouter = express.Router();

authRouter.post('/sign-up', signupValidator, async (req, res, next) => {
  try {
    const {
      email,
      password,
      repeat_password,
      nickName,
      introduce,
      maxweight,
      weight,
      height,
      fat,
      showLog,
      metabolic,
      muscleweight,
      profile_img_url,
    } = req.body;

    const existedUser = await prisma.user.findUnique({ where: { email } });

    // 이메일 중복처리
    if (existedUser) {
      return res
        .status(HTTP_STATUS.CONFLICT)
        .json({ message: MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED });
    }
    const hashedPassword = bcrypt.hashSync(password, HASH_SALT_ROUNDS);

    // 유저 테이블과 유저 정보 테이블을 한번에 생성하는 트랜잭션
    const [userData, profileData] = await prisma.$transaction(
      async (tx) => {
        const userData = await tx.user.create({
          data: { email, password: hashedPassword, nickName },
        });

        userData.password = undefined;

        const profileData = await tx.profile.create({
          data: {
            introduce,
            maxweight,
            weight,
            height,
            fat,
            metabolic,
            muscleweight,
            profile_img_url,
            showLog,
            nickName: userData.nickName,
            userId: userData.userId,
          },
        });
        return [userData, profileData];
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
    );
    return res.status(HTTP_STATUS.CREATED).json({
      message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
      userData,
      profileData,
    });
  } catch (error) {
    next(error);
  }
});

// login API
authRouter.post('/sign-in', signInValidator, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    const passwordMatch = user && bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: res.statusCode,
        message: MESSAGES.AUTH.SIGN_IN.UNAUTHORIZED,
      });
    }

    const payload = { id: user.userId };
    const data = await generateAuthTokens(payload);

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.AUTH.SIGN_IN.SUCCEED,
      data,
    });
  } catch (error) {
    next(error);
  }
});

// 토큰 재발급 API
authRouter.post('/token', requireRefreshToken, async (req, res, next) => {
  try {
    const user = req.user;
    const payload = { id: user.userId };

    const data = await generateAuthTokens(payload);

    return res.status(HTTP_STATUS.OK).json({
      status: res.statusCode,
      message: MESSAGES.AUTH.SIGN_IN.TOKEN,
      data,
    });
  } catch (error) {
    next(error);
  }
});

//로그아웃 API
authRouter.post('/sign-out', requireRefreshToken, async (req, res, next) => {
  try {
    const user = req.user;

    await prisma.user.update({
      where: { userId: user.userId },
      data: {
        refreshToken: null,
      },
    });

    return res.status(HTTP_STATUS.OK).json({
      message: MESSAGES.AUTH.SIGN_OUT.SUCCEED,
      data: { id: user.userId },
    });
  } catch (error) {
    next(error);
  }
});

const generateAuthTokens = async (payload) => {
  const userId = payload.id;
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES,
  });
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES,
  });

  const hashedRefreshToken = bcrypt.hashSync(refreshToken, HASH_SALT_ROUNDS);

  await prisma.user.update({
    where: {
      userId,
    },
    data: {
      refreshToken: hashedRefreshToken,
    },
  });

  return { accessToken, refreshToken };
};

export { authRouter };
