export const HTTP_STATUS = {
  OK: 200, // 호출 성공
  CREATED: 201, // 생성 성공
  BAD_REQUEST: 400, // 사용자의 잘못으로 인한 실패
  UNAUTHORIZED: 401, // 인증 실패 (입력 정보가 틀렸을 때)
  FORBIDDEN: 403, // 인가 실패 (접근 권한이 없을 때)
  NOT_FOUND: 404, // 해당 데이터가 존재하지 않음
  CONFLICT: 409, // 충돌 발생
  INTERNAL_SERVER_ERROR: 500, // 예상치 못한 에러
};
