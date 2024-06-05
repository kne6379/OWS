import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';

// joi 게시물 수정 유효성 검사
const schema = Joi.object({
  title: Joi.string(),
  content: Joi.string().min(100).messages({
    'string.min': MESSAGES.FEAD.COMMON.MIN.CONTENT,
  }),
  feed_img_url: Joi.string().uri().messages({
    'string.uri': MESSAGES.FEAD.COMMON.NOT.IMG_URL,
  }),
});

export const feadUpdateValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
