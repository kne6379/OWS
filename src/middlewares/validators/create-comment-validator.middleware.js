import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
import { MIN_COMMENT_LENGTH } from '../../constants/comment.constant.js';

const schema = Joi.object({
  comment: Joi.string().required().min(MIN_COMMENT_LENGTH).messages({
    'any.required': MESSAGES.COMMENTS.COMMON.COMMENT.REQUIRED,
    'string.min': MESSAGES.COMMENTS.COMMON.COMMENT.MIN_LENGTH,
  }),
});

export const createCommentValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
