import { MIN_COMMENT_LENGTH } from './comment.constant.js';

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
        MIN_LENGTH: '비밀번호는 6자리 이상이어야 합니다.',
      },
      REPEAT_PASSWORD: {
        REQUIRED: '비밀번호 확인을 입력해 주세요.',
        NOT_MATCHED: '비밀번호가 일치하지 않습니다.',
      },
      NICKNAME: {
        REQUIRED: '별명을 입력해주세요.',
      },
    },
    JWT: {
      NO_TOKEN: '인증 정보가 없습니다.',
      NOT_SUPPORTED_TYPE: '지원하지 않는 인증 방식입니다.',
      EXPIRED: '인증 정보가 만료되었습니다.',
      NO_USER: '인증 정보와 일치하는 사용자가 없습니다.',
      INVALID: '인증 정보가 유효하지 않습니다.',
    },
    SIGN_UP: {
      SUCCEED: '회원가입에 성공했습니다.',
    },
    SIGN_IN: {
      SUCCEED: '로그인에 성공했습니다.',

      UNAUTHORIZED: '인증에 실패했습니다.',
      TOKEN: '토근 재발급에 성공했습니다.'
    },
    SIGN_OUT:{
      SUCCEED: '로그아웃에 성공했습니다.'
    },
  },

  USRES: {
    READ: {
      SUCCEED: '프로필 정보 조회에 성공하였습니다.',
    },

  },

  COMMENTS: {
    COMMON: {
      COMMENT: {
        REQUIRED: '내용을 입력해 주세요.',
        MIN_LENGTH: `내용은 ${MIN_COMMENT_LENGTH}자 이상 작성해야 합니다.`,
      },
      NOT_FOUND: '댓글이 존재하지 않습니다.',
    },
    CREATE: {
      SUCCEED: '댓글 작성에 성공했습니다.',
    },
    READ_LIST: {
      SUCCEED: '댓글 조회에 성공했습니다.',
    },
    UPDATE: {
      SUCCEED: '댓글 수정에 성공했습니다.',
      NO_BODY_DATA: '수정할 정보를 입력해 주세요.',
      NO_AUTH: '이 댓글에 대한 수정 권한이 없습니다',
    },
    DELETE: {
      SUCCEED: '댓글 삭제에 성공했습니다.',
      NO_AUTH: '이 댓글에 대한 삭제 권한이 없습니다.',
    },
  },
};
