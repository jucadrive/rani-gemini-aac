import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './App';
import { useAacStore } from './store/useAacStore';
import { ok, err } from './types/common';

/**
 * @description Phase 4: 갤럭시 탭 S4 최적화 AAC 의사소통 보드 통합 인터랙션 검증 테스트
 */
describe('마음톡톡 AAC 의사소통 보드 통합 검증', () => {
  beforeEach(() => {
    useAacStore.setState({
      activeCategory: 'food',
      selectedCards: [],
      customCards: [],
    });
  });

  it('앱 타이틀과 상단 문장 조합 바, 명사 보드, 동사 보드가 분리되어 렌더링되어야 한다', () => {
    render(<App />);

    expect(screen.getByText('마음톡톡 AAC')).toBeInTheDocument();
    expect(screen.getByLabelText('문장 조합 바')).toBeInTheDocument();
    expect(screen.getByLabelText('명사 어휘 보드')).toBeInTheDocument();
    expect(screen.getByLabelText('동사 동작 보드')).toBeInTheDocument();
  });

  it('좌측 명사 "빵" 카드를 누르고 우측 동사 "주세요" 카드를 누르면 문장 바에 “빵 주세요”가 완성되어야 한다', () => {
    render(<App />);

    const breadCardButton = screen.getByLabelText('빵 카드');
    const giveCardButton = screen.getByLabelText('주세요 카드');

    // 1. '빵' 카드 탭
    fireEvent.click(breadCardButton);
    expect(screen.getByText('“빵”')).toBeInTheDocument();

    // 2. '주세요' 움직이는 동사 카드 탭
    fireEvent.click(giveCardButton);
    expect(screen.getByText('“빵 주세요”')).toBeInTheDocument();

    // 3. '지우기' 버튼 클릭 시 초기화 확인
    const clearButton = screen.getByRole('button', { name: /지우기/i });
    fireEvent.click(clearButton);
    expect(screen.queryByText('“빵 주세요”')).not.toBeInTheDocument();
  });

  it('카테고리 탭("놀이·장난감")을 누르면 해당 카테고리의 명사 카드("공", "비눗방울")가 표시되어야 한다', () => {
    render(<App />);

    const playTabButton = screen.getByRole('button', { name: /놀이·장난감/i });
    fireEvent.click(playTabButton);

    expect(screen.getByLabelText('공 카드')).toBeInTheDocument();
    expect(screen.getByLabelText('비눗방울 카드')).toBeInTheDocument();
  });

  it('[HR-04] Result<T, E> 헬퍼 함수 ok와 err가 정확한 판별 유니온을 반환해야 한다', () => {
    const successResult = ok('빵 주세요');
    expect(successResult.ok).toBe(true);

    const errorResult = err('TTS_ERROR', '음성 합성을 사용할 수 없습니다.');
    expect(errorResult.ok).toBe(false);
  });
});
