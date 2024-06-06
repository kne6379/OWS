import express from 'express';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { prisma } from '../utils/prisma.util.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { createCommentValidator } from '../middlewares/validators/create-comment-validator.middleware.js';
import { updateCommentValidator } from '../middlewares/validators/update-comment-validator.middleware.js';

const commentRouter = express.Router({ mergeParams: true });

// 댓글 작성
commentRouter.post(
  '/',
  requireAccessToken,
  createCommentValidator,
  async (req, res, next) => {
    try {
      const user = req.user;
      const userId = user.userId;
      const { feedId } = req.params;
      const { comment } = req.body;

      const feedIdInt = parseInt(feedId, 10);

      if (isNaN(feedIdInt)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          status: HTTP_STATUS.BAD_REQUEST,
          message: 'Invalid feedId',
        });
      }

      const data = await prisma.comment.create({
        data: {
          userId: userId,
          feedId: feedIdInt,
          comment: comment,
        },
      });

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.COMMENTS.CREATE.SUCCEED,
        data,
      });
    } catch (error) {
      next(error);
    }
  },
);

// 댓글 목록 조회
commentRouter.get('/', async (req, res, next) => {
  try {
    const { feedId } = req.params;

    let { sort } = req.query;

    sort = sort?.toLowerCase();

    if (sort !== 'desc' && sort !== 'asc') {
      sort = 'desc';
    }

    let data = await prisma.comment.findMany({
      where: { feedId: +feedId },
      orderBy: {
        createdAt: sort,
      },
      // include: {
      //   user: true,
      // },
    });

    if (!data.length) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.COMMENTS.COMMON.NOT_FOUND,
      });
    }

    data = data.map((comment) => {
      return {
        userId: comment.userId,
        feedId: comment.feedId,
        commentId: comment.commentId,
        content: comment.comment,
        updatedAt: comment.updatedAt,
      };
    });

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.COMMENTS.READ_LIST.SUCCEED,
      data,
    });
  } catch (error) {
    next(error);
  }
});

// 댓글 수정
commentRouter.patch(
  '/:commentId',
  requireAccessToken,
  updateCommentValidator,
  async (req, res, next) => {
    try {
      const user = req.user;
      const userId = user.userId;
      // const { feedId } = req.params;
      const { commentId } = req.params;
      const { comment } = req.body;

      let existedComment = await prisma.comment.findUnique({
        where: { userId, commentId: +commentId },
      });

      if (!existedComment) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          status: HTTP_STATUS.NOT_FOUND,
          message: MESSAGES.COMMENTS.COMMON.NOT_FOUND,
        });
      }

      if (existedComment.userId !== userId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: MESSAGES.COMMENTS.UPDATE.NO_AUTH,
        });
      }

      const data = await prisma.comment.update({
        where: { userId, commentId: +commentId },
        data: {
          ...(comment && { comment }),
        },
      });

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.COMMENTS.UPDATE.SUCCEED,
        data,
      });
    } catch (error) {
      next(error);
    }
  },
);

// 댓글 삭제
commentRouter.delete(
  '/:commentId',
  requireAccessToken,
  async (req, res, next) => {
    try {
      const user = req.user;
      const userId = user.userId;
      // const { feedId } = req.params;
      const { commentId } = req.params;

      let existedComment = await prisma.comment.findUnique({
        where: { userId, commentId: +commentId },
      });

      if (!existedComment) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          status: HTTP_STATUS.NOT_FOUND,
          message: MESSAGES.COMMENTS.COMMON.NOT_FOUND,
        });
      }

      if (existedComment.userId !== userId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: MESSAGES.COMMENTS.DELETE.NO_AUTH,
        });
      }

      const data = await prisma.comment.delete({
        where: { userId, commentId: +commentId },
      });

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.COMMENTS.DELETE.SUCCEED,
        data,
      });
    } catch (error) {
      next(error);
    }
  },
);

export { commentRouter };
