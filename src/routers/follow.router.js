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
    console.log('여기!!!!', user.userId, followId);
    const follow = await prisma.follows.create({
      data: {
        followedbyid: user.userId,
        followingid: +followId,
      },
    });
    return res.status(HTTP_STATUS.OK).json({ status: res.statusCode, follow });
  } catch (error) {
    next(error);
  }
});

followRouter.get('/', requireAccessToken, async (req, res, next) => {
  try {
    const user = req.user;
    const followList = await prisma.follows.findMany({
      where: {},
    });
  } catch (error) {}
});

export { followRouter };
