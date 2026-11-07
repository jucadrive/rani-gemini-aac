import { AppError, err, ok, Result } from '../types/common';

/**
 * @description 로컬 스토리지 키 상수 정의
 */
export const STORAGE_KEYS = {
  TTS_SETTINGS: 'aac_app_tts_settings_v1',
  CUSTOM_CARDS: 'aac_app_custom_cards_v1',
} as const;

/**
 * @description [HR-03, HR-04] 브라우저 localStorage에서 안전하게 데이터를 읽어 파싱하는 함수
 * 시크릿 모드 접근 제한이나 손상된 JSON 데이터로 인한 런타임 크래시를 방지합니다.
 * @param key 조회할 스토리지 키
 * @param fallback 데이터가 없거나 파싱 실패 시 반환할 기본값
 * @returns {Result<T, AppError>} 파싱된 데이터 또는 에러를 담은 Result 객체
 */
export function loadFromStorage<T>(key: string, fallback: T): Result<T, AppError> {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return ok(fallback);
    }

    const rawValue = window.localStorage.getItem(key);
    if (rawValue === null) {
      return ok(fallback);
    }

    const parsed = JSON.parse(rawValue) as T;
    return ok(parsed);
  } catch (cause) {
    return err(
      'STORAGE_READ_ERROR',
      `로컬 저장소(${key})에서 데이터를 불러오는 중 오류가 발생했습니다.`,
      cause
    );
  }
}

/**
 * @description [HR-03, HR-04] 브라우저 localStorage에 데이터를 안전하게 직렬화하여 저장하는 함수
 * @param key 저장할 스토리지 키
 * @param value 저장할 데이터 객체
 * @returns {Result<boolean, AppError>} 저장 성공 여부 또는 에러를 담은 Result 객체
 */
export function saveToStorage<T>(key: string, value: T): Result<boolean, AppError> {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return err('STORAGE_UNAVAILABLE', '현재 브라우저 환경에서 로컬 저장소를 사용할 수 없습니다.');
    }

    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
    return ok(true);
  } catch (cause) {
    return err(
      'STORAGE_WRITE_ERROR',
      `로컬 저장소(${key})에 데이터를 저장하는 중 오류가 발생했습니다.`,
      cause
    );
  }
}

/**
 * @description 특정 로컬 스토리지 키의 데이터를 안전하게 삭제하는 함수
 * @param key 삭제할 스토리지 키
 * @returns {Result<boolean, AppError>} 삭제 성공 여부를 담은 Result 객체
 */
export function removeFromStorage(key: string): Result<boolean, AppError> {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
    return ok(true);
  } catch (cause) {
    return err('STORAGE_REMOVE_ERROR', `로컬 저장소(${key}) 항목 삭제에 실패했습니다.`, cause);
  }
}
