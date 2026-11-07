/**
 * @description [HR-04] 서비스 및 비동기/브라우저 API 호출의 안전한 예외 처리를 위한 Result 타입 정의
 * 에러를 throw하여 앱이 크래시되는 것을 방지하고, 호출부에서 성공(ok: true)과 실패(ok: false)를 명시적으로 분기하게 합니다.
 */
export type Result<T, E = AppError> =
  | { readonly ok: true; readonly data: T }
  | { readonly ok: false; readonly error: E };

/**
 * @description 애플리케이션 전반에서 사용하는 표준화된 에러 인터페이스
 */
export interface AppError {
  /** 에러 식별 코드 (예: 'TTS_NOT_SUPPORTED', 'STORAGE_READ_FAILED') */
  readonly code: string;
  /** 사용자 또는 치료사에게 안내할 친절한 한국어 메시지 */
  readonly message: string;
  /** 디버깅을 위한 원본 에러 객체 또는 상세 정보 (선택) */
  readonly cause?: unknown;
}

/**
 * @description 품사 및 카드의 역할 구분 타입
 * - noun: 사물, 음식, 사람, 장소 등 '명사' (좌측 보드 배치)
 * - verb: 동작, 요구, 상태 표현 등 움직이는 '동사/서술어' (우측 고정 보드 배치)
 */
export type PartOfSpeech = 'noun' | 'verb';

/**
 * @description 성공 Result 객체를 생성하는 순수 헬퍼 함수
 * @param data 성공 시 반환할 데이터 페이로드
 * @returns 성공 상태를 나타내는 Result 객체
 */
export function ok<T>(data: T): Result<T, never> {
  return { ok: true, data };
}

/**
 * @description 실패 Result 객체를 생성하는 순수 헬퍼 함수
 * @param code 에러 식별 코드
 * @param message 한국어 에러 설명 메시지
 * @param cause 원본 에러 객체 (선택)
 * @returns 실패 상태를 나타내는 Result 객체
 */
export function err(code: string, message: string, cause?: unknown): Result<never, AppError> {
  return {
    ok: false,
    error: { code, message, cause },
  };
}

