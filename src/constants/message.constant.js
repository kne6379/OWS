export const MESSAGES = {
  AUTH: {
    COMMON: {
      EMAIL: {
        REQUIRED: '이메일을 입력해 주세요.',
        INVALID_FORMAT: '이메일 형태가 올바르지 않습니다.',
        DUPLICATED: '이미 가입된 사용자입니다.',
      },
      PASSWORD: {
        REQUIRED: '비밀번호를 입력해 주세요.',
        MIN_LENGTH: '비밀번호는 6자리 이상이어야 합니다.'
      },
      REPEAT_PASSWORD:{
        REQUIRED: '비밀번호 확인을 입력해 주세요.',
        NOT_MATCHED: '비밀번호가 일치하지 않습니다.',
      },
      NICKNAME:{
        REQUIRED: '별명을 입력해주세요.',
      },
    },
    JWT: {
      NO_TOKEN: '인증 정보가 없습니다.',
      NOT_SUPPORTED_TYPE: '지원하지 않는 인증 방식입니다.',
      EXPIRED: '인증 정보가 만료되었습니다.',
      NO_USER: '인증 정보와 일치하는 사용자가 없습니다.',
      INVALID: '인증 정보가 유효하지 않습니다.'
    },
    SIGN_UP:{
      SUCCEED: '회원가입에 성공했습니다.'
    },
    SIGN_IN:{
      SUCCEED: '로그인에 성공했습니다.',
      UNAUTHORIZED: '인증에 실패했습니다.',
      TOKEN: '토근 재발급에 성공했습니다.'
    },
    SIGN_OUT:{
      SUCCEED: '로그아웃에 성공했습니다.'
    }
  },
};
