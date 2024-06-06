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
        LENGTH: '비밀번호를 6자리 이상, 12자리 이하로 설정해주세요.',
        NO_STRING: '비밀번호는 문자열로 입력해야합니다.',
      },
      REPEAT_PASSWORD: {
        REQUIRED: '비밀번호 확인을 입력해 주세요.',
        NOT_MATCHED: '비밀번호가 일치하지 않습니다.',
      },
      NICKNAME: {
        REQUIRED: '별명을 입력해주세요.',
        NO_STRING: '별명은 문자열로 입력해야합니다.',
      },
      INTRODUCE: {
        NO_STRING: '자기소개는 문자열로 입력해야합니다.',
      },
      MAX_WEIGHT: {
        NO_NUMBER: '3대 중량을 정수로 입력해주세요.',
      },
      WEIGHT: {
        NO_NUMBER: '본인의 몸무게를 숫자로 입력해주세요.',
        PRECISION: '몸무게는 소수점 첫번째 자리까지만 입력해주세요.',
      },
      HEIGHT: {
        NO_NUMBER: '본인의 키를 숫자로 입력해주세요.',
        PRECISION: '키는 소수점 첫번째 자리까지만 입력해주세요.',
      },
      FAT: {
        NO_NUMBER: '본인의 체지방률을 숫자로 입력해주세요.',
        PRECISION: '체지방률은 소수점 첫번째 자리까지만 입력해주세요.',
      },
      METABOLIC: {
        NO_NUMBER: '기초대사량을 정수로 입력해주세요.',
      },
      MUSCLEWEIGHT: {
        NO_NUMBER: '골격근량을 숫자로 입력해주세요.',
        PRECISION: '골격근량은 소수점 첫번째 자리까지만 입력해주세요.',
      },
      PROFILE_IMG_URL: {
        NO_STRING: '프로필 URL을 문자열로 입력해주세요.',
      },
      SHOWLOG: {
        NO_BOOLEAN: '프로필 공개여부를 true, false로 작성해주세요.',
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
      UNAUTHORIZED: '인증에 실패했습니다',
      TOKEN: '토근 재발급에 성공했습니다.',
    },
    SIGN_OUT: {
      SUCCEED: '로그아웃에 성공했습니다.',
    },
  },

  USRES: {
    READ: {
      SUCCEED: '프로필 정보 조회에 성공하였습니다.',
    },
    UPDATE: {
      SUCCEED: '프로필 정보 수정에 성공하였습니다.',
    },
    PASSWORD: {
      UPDATE: {
        REQUIRED: '변경할 비밀번호를 입력해 주세요.',

        SUCCEED: '패스워드 변경에 성공하였습니다.',
      },
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

  FEAD: {
    COMMON: {
      REQUIRED: {
        TITLE: '제목을 입력해주세요.',
        CONTENT: '내용을 입력해주세요.',
        UPDATE: '수정할 정보를 입력해주세요.',
      },
      NO: {
        FEAD: '게시글이 존재하지 않습니다.',
      },
      NOT: {
        IMG_URL: '이미지 형식이 알맞지 않습니다.',
      },
      MIN: {
        CONTENT: '내용은 100자 이상 작성해야 합니다.',
      },
      SUCCEED: {
        CREATED: '게시글 생성에 성공했습니다.',
        UPDATED: '게시글 수정에 성공했습니다.',
        GET: '게시글 조회에 성공했습니다.',
        GET_ALL: '게시글 목록 조회에 성공했습니다.',
        DELETED: '게시글 삭제에 성공했습니다.',
      },
    },
  },
};
