import express from 'express';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { prisma } from '../utils/prisma.util.js';

const likeRouter = express.Router();

function likePost(a, b) {
  const checkData = JSON.parse(a);
  checkData.includes(+b)
    ? checkData.splice(checkData.indexOf(+b), 1)
    : checkData.push(+b);
  a = JSON.stringify(checkData);
  return a;
}

likeRouter.post(
  '/:feedId/feedlike',
  requireAccessToken,
  async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { feedId } = req.params;

      const userData = await prisma.user.findUnique({
        where: { userId: userId },
      });
      const feedData = await prisma.feed.findUnique({
        where: { feedId: +feedId },
      });
      const userArr = userData.likedFeedsId;
      const feedArr = feedData.likedUsersId;

      const isLiked = JSON.parse(userArr);

      const changedUser = likePost(userArr, feedId);
      const changedFeed = likePost(feedArr, userId);

      await prisma.user.update({
        where: {
          userId: userId,
        },
        data: {
          likedFeedsId: changedUser,
        },
      });

      await prisma.feed.update({
        where: {
          feedId: +feedId,
        },
        data: {
          likedUsersId: changedFeed,
        },
      });

      const afterLiked = JSON.parse(changedUser);
      const likedNumber = afterLiked.length;

      if (isLiked.length > afterLiked.length) {
        return res.status(HTTP_STATUS.OK).json({
          message: '좋아요 취소 되었습니다',
        });
      } else {
        return res.status(HTTP_STATUS.OK).json({
          message: '좋아요 처리 되었습니다',
          data: { likedNumber },
        });
      }
    } catch (error) {
      next(error);
    }
  },
);

likeRouter.post(
  '/:feedId/comments/:commentId/commentlike',
  requireAccessToken,
  async (req, res, next) => {
    try {
      const { userId } = req.user;
      const commentId = req.params.commentId;
      const userData = await prisma.user.findUnique({
        where: { userId: userId },
      });
      const commentData = await prisma.comment.findUnique({
        where: { commentId: +commentId },
      });
      const userArr = userData.likedCommentsId;
      const commentArr = commentData.likedUsersId;

      const isLiked = JSON.parse(userArr);

      const changedUser = likePost(userArr, commentId);
      const changedComment = likePost(commentArr, userId);

      await prisma.user.update({
        where: {
          userId: userId,
        },
        data: {
          likedCommentsId: changedUser,
        },
      });

      await prisma.comment.update({
        where: {
          commentId: +commentId,
        },
        data: {
          likedUsersId: changedComment,
        },
      });

      const afterLiked = JSON.parse(changedUser);
      const likedNumber = afterLiked.length;

      if (isLiked.length > afterLiked.length) {
        return res.status(HTTP_STATUS.OK).json({
          message: '좋아요 취소 되었습니다',
        });
      } else {
        return res.status(HTTP_STATUS.OK).json({
          message: '좋아요 처리 되었습니다',
          data: { likedNumber },
        });
      }
    } catch (error) {
      next(error);
    }
  },
);

export { likeRouter };
