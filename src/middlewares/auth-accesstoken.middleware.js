import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.util.js';
import { ACCESS_SECRET_KEY } from '../constants/env.constant.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

export const authAccessToken = async (req, res, next) => {
  try {
    // 인증 정보 파싱
    const authorization = req.headers.authorization;

    // Authorization이 존재하지 않는 경우
    if (!authorization) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ status: res.statusCode, message: MESSAGES.AUTH.JWT.NO_TOKEN });
    }

    const [tokenType, accessToken] = authorization.split(' ');

    // JWT 표준 인증 형태와 일치하지 않는 경우
    if (tokenType !== 'Bearer') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: res.statusCode,
        message: MESSAGES.AUTH.JWT.NOT_SUPPORTED_TYPE,
      });
    }

    // AccessToken이 존재하지 않는 경우
    if (!accessToken) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: res.statusCode,
        message: MESSAGES.AUTH.JWT.NO_TOKEN,
      });
    }
    let payload;
    try {
      payload = jwt.verify(accessToken, ACCESS_SECRET_KEY);
    } catch (error) {
      // 액세스 토큰의 유효기간 검증
      if (error.name === 'TokenExpiredError') {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: res.statusCode,
          message: MESSAGES.AUTH.JWT.EXPIRED,
        });
      }
      // 그 밖의 에러들
      else {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: res.statusCode,
          message: MESSAGES.AUTH.JWT.INVALID,
        });
      }
    }
    const { userId } = payload;
    const user = await prisma.user.findUnique({
      where: { userId },
      omit: { password: true },
    });

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: res.statusCode,
        message: MESSAGES.AUTH.JWT.NO_USER,
      });
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
