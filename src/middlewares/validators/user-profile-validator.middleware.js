import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';

export const profileUpdateValidator = async (req, res, next) => {
  try {
    const joiSchema = Joi.object({
      introduce: Joi.string().messages({
        'string.base': MESSAGES.AUTH.COMMON.INTRODUCE.NO_STRING,
      }),
      maxweight: Joi.number().integer().messages({
        'number.base': MESSAGES.AUTH.COMMON.MAX_WEIGHT.NO_NUMBER,
        'number.integer': MESSAGES.AUTH.COMMON.MAX_WEIGHT.NO_NUMBER,
      }),
      weight: Joi.number().precision(1).messages({
        'number.base': MESSAGES.AUTH.COMMON.WEIGHT.NO_NUMBER,
        'number.precision': MESSAGES.AUTH.COMMON.WEIGHT.PRECISION,
      }),
      height: Joi.number().precision(1).messages({
        'number.base': MESSAGES.AUTH.COMMON.HEIGHT.NO_NUMBER,
        'number.precision': MESSAGES.AUTH.COMMON.HEIGHT.PRECISION,
      }),
      fat: Joi.number().precision(1).messages({
        'number.base': MESSAGES.AUTH.COMMON.FAT.NO_NUMBER,
        'number.precision': MESSAGES.AUTH.COMMON.FAT.PRECISION,
      }),
      metabolic: Joi.number().integer().messages({
        'number.base': MESSAGES.AUTH.COMMON.METABOLIC.NO_NUMBER,
        'number.integer': MESSAGES.AUTH.COMMON.METABOLIC.NO_NUMBER,
      }),
      muscleweight: Joi.number().precision(1).messages({
        'number.base': MESSAGES.AUTH.COMMON.MUSCLEWEIGHT.NO_NUMBER,
        'number.precision': MESSAGES.AUTH.COMMON.MUSCLEWEIGHT.PRECISION,
      }),
      profile_img_url: Joi.number().precision(1).messages({
        'string.base': MESSAGES.AUTH.COMMON.PROFILE_IMG_URL,
      }),
      showLog: Joi.boolean().messages({
        'boolean.base': MESSAGES.AUTH.COMMON.SHOWLOG.NO_BOOLEAN,
      }),
    });
    await joiSchema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const passwordUpdateValidator = async (req, res, next) => {
  try {
    const joiSchema = Joi.object({
      password: Joi.string().required().messages({
        'any.required': MESSAGES.AUTH.COMMON.PASSWORD.REQUIRED,
        'string.base': MESSAGES.AUTH.COMMON.PASSWORD.NO_STRING,
      }),
      repeat_password: Joi.string()
        .required()
        .valid(Joi.ref('updatePassword'))
        .messages({
          'any.required': MESSAGES.AUTH.COMMON.REPEAT_PASSWORD.REQUIRED,
          'any.only': MESSAGES.AUTH.COMMON.REPEAT_PASSWORD.NOT_MATCHED,
        }),
      updatePassword: Joi.string().required().min(6).max(12).messages({
        'any.required': MESSAGES.USRES.PASSWORD.UPDATE.REQUIRED,
        'string.base': MESSAGES.AUTH.COMMON.PASSWORD.NO_STRING,
        'string.min': MESSAGES.AUTH.COMMON.PASSWORD.LENGTH,
        'string.max': MESSAGES.AUTH.COMMON.PASSWORD.LENGTH,
      }),
    });
    await joiSchema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
