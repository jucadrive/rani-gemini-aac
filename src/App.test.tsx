import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';
import { ok, err } from './types/common';

/**
 * @description Phase 1 하네스 파이프라인 및 기본 레이아웃(명사/동사 분리) 검증 테스트
 */
describe('마음톡톡 AAC 초기 아키텍처 및 레이아웃 검증', () => {
  it('앱 타이틀과 상단 문장 조합 바, 명사 보드, 동사 보드가 분리되어 렌더링되어야 한다', () => {
    render(<App />);

    expect(screen.getByText('마음톡톡 AAC')).toBeInTheDocument();
    expect(screen.getByLabelText('문장 조합 바')).toBeInTheDocument();
    expect(screen.getByLabelText('명사 어휘 보드')).toBeInTheDocument();
    expect(screen.getByLabelText('동사 동작 보드')).toBeInTheDocument();
  });

  it('[HR-04] Result<T, E> 헬퍼 함수 ok와 err가 정확한 판별 유니온을 반환해야 한다', () => {
    const successResult = ok('빵 주세요');
    expect(successResult.ok).toBe(true);
    if (successResult.ok) {
      expect(successResult.data).toBe('빵 주세요');
    }

    const errorResult = err('TTS_ERROR', '음성 합성을 사용할 수 없습니다.');
    expect(errorResult.ok).toBe(false);
    if (!errorResult.ok) {
      expect(errorResult.error.code).toBe('TTS_ERROR');
    }
  });
});

