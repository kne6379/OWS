import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';

export const signupValidator = async (req, res, next) => {
  try {
    const joiSchema = Joi.object({
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required()
        .messages({
          'string.email': MESSAGES.AUTH.COMMON.EMAIL.INVALID_FORMAT,
          'any.required': MESSAGES.AUTH.COMMON.EMAIL.REQUIRED,
        }),
      nickName: Joi.string().required().messages({
        'string.base': '별명을 문자열로 입력해주세요.',
        'any.required': MESSAGES.AUTH.COMMON.NICKNAME.REQUIRED,
      }),
      password: Joi.string().required().min(6).max(12).messages({
        'any.required': MESSAGES.AUTH.COMMON.PASSWORD.REQUIRED,
        'string.base': '패스워드는 문자열이어야 합니다.',
        'string.min': MESSAGES.AUTH.COMMON.PASSWORD.MIN_LENGTH,
        'string.max': '패스워드가 너무 깁니다.',
      }),
      repeat_password: Joi.string()
        .required()
        .valid(Joi.ref('password'))
        .messages({
          'any.required': MESSAGES.AUTH.COMMON.REPEAT_PASSWORD.REQUIRED,
          'any.only': MESSAGES.AUTH.COMMON.REPEAT_PASSWORD.NOT_MATCHED,
        }),
      introduce: Joi.string().messages({
        'string.base': '자기소개를 문자열로 입력해주세요.',
      }),
      maxweight: Joi.number().integer().messages({
        'number.base': '3대 중량을 숫자로 입력해주세요',
        'number.integer': '3대 중량을 정수로 입력해주세요.',
      }),
      weight: Joi.number().precision(1).messages({
        'number.base': '본인의 몸무게를 숫자로 입력해주세요',
        'number.precision': '몸무게는 소수점 첫번째 자리까지만 입력해주세요.',
      }),
      height: Joi.number().precision(1).messages({
        'number.base': '본인의 키를 숫자로 입력해주세요',
        'number.precision': '키는 소수점 첫번째 자리까지만 입력해주세요.',
      }),
      fat: Joi.number().precision(1).messages({
        'number.base': '체지방률을 숫자로 입력해주세요',
        'number.precision': '체지방률은 소수점 첫번째 자리까지만 입력해주세요.',
      }),
      metabolic: Joi.number().integer().messages({
        'number.base': '기초대사량을 숫자로 입력해주세요',
        'number.integer': '기초대사량을 정수로 입력해주세요.',
      }),
      muscleweight: Joi.number().precision(1).messages({
        'number.base': '골격근량을 숫자로 입력해주세요',
        'number.precision': '골격근량을 소수점 첫번째 자리까지만 입력해주세요.',
      }),
      profile_img_url: Joi.number().precision(1).messages({
        'string.base': '프로필 URL을 문자열로 입력해주세요.',
      }),
      showLog: Joi.boolean().messages({
        'boolean.base': '프로필 공개정보를 입력해주세요',
      }),
    });
    await joiSchema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
