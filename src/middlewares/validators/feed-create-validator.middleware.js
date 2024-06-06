import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';

// joi 게시물 작성 유효성 검사
const schema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': MESSAGES.FEED.COMMON.REQUIRED.TITLE,
  }),
  content: Joi.string().min(10).required().messages({
    'any.required': MESSAGES.FEED.COMMON.REQUIRED.CONTENT,
    'string.min': MESSAGES.FEED.COMMON.MIN.CONTENT,
  }),
  feed_img_url: Joi.string().uri().messages({
    'string.uri': MESSAGES.FEED.COMMON.NOT.IMG_URL,
  }),
});

export const feedCreateValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
