import express from 'express';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { prisma } from '../utils/prisma.util.js';
import { createCommentValidator } from '../middlewares/validators/create-comment-validator.middleware.js';
import { updateCommentValidator } from '../middlewares/validators/update-comment-validator.middleware.js';

const commentRouter = express.Router();

// 댓글 작성
commentRouter.post('/', createCommentValidator, async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user.userId;
    const { feedId } = req.params;
    const { comment } = req.body;

    const data = await prisma.comment.create({
      data: {
        // (작성자 ID, 게시물 ID), 댓글 내용
        userId,
        feedId,
        comment,
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
});

// 댓글 목록 조회
commentRouter.get('/', async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user.userId;
    const { feedId } = req.params;

    let { sort } = req.query;

    sort = sort?.toLowerCase();

    if (sort !== 'desc' && sort !== 'asc') {
      sort = 'desc';
    }

    let data = await prisma.comment.findMany({
      where: { userId, feedId: +feedId },
      orderBy: {
        createdAt: sort,
      },
      // include: {
      //   feed: true,
      // },
    });

    if (!data) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.COMMENTS.COMMON.NOT_FOUND,
      });
    }

    data = {
      // (작성자 ID, 게시물 ID), 댓글 ID, 닉네임, 댓글 내용, 수정일시
      userId: data.userId,
      feedId: data.feedId,
      commentId: data.commentId,
      nickName: data.user.nickName,
      content: data.feed.content,
      updatedAt: data.updatedAt,
    };

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
  updateCommentValidator,
  async (req, res, next) => {
    try {
      const user = req.user;
      const userId = user.userId;
      const { feedId } = req.params;
      const { commentId } = req.params;
      const { comment } = req.body;

      let existedComment = await prisma.comment.findUnique({
        where: { userId, feedId: +feedId, commentId: +commentId },
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
        where: { userId, feedId: +feedId, commentId: +commentId },
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
commentRouter.delete('/:commentId', async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user.userId;
    const { feedId } = req.params;
    const { commentId } = req.params;

    let existedComment = await prisma.comment.findUnique({
      where: { userId, feedId: +feedId, commentId: +commentId },
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
      where: { userId, feedId: +feedId, commentId: +commentId },
    });

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.COMMENTS.DELETE.SUCCEED,
      data,
    });
  } catch (error) {
    next(error);
  }
});

export { commentRouter };
