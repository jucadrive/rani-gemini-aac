import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './App';
import { useAacStore } from './store/useAacStore';
import { ok, err } from './types/common';
import { DEFAULT_FAVORITE_SENTENCES } from './utils/aacTemplates';

/**
 * @description Phase 7 & 결합 동작 스테이지:
 * 1) 명사 단독 제시 -> 2) 동사 활성화 -> 3) [빵+먹어요 카드 조합] 제시 후 [실제로 빵을 먹는 하나의 통합 동작 그림] 제시 검증
 */
describe('마음톡톡 AAC 의사소통 보드 단계별 집중 UI 및 통합 동작 그림 검증', () => {
  beforeEach(() => {
    useAacStore.setState({
      activeChapter: 'food',
      activeCategory: 'food',
      selectedCards: [],
      customCards: [],
      favoriteSentences: [...DEFAULT_FAVORITE_SENTENCES],
    });
  });

  it('초기 1단계에서는 전경·배경 분리를 위해 명사 보드만 단독 제시되고 동사 보드는 숨겨져 있어야 한다', () => {
    render(<App />);

    expect(screen.getByText('마음톡톡 AAC')).toBeInTheDocument();
    expect(screen.getByLabelText('문장 조합 바')).toBeInTheDocument();
    expect(screen.getByLabelText('명사 어휘 보드')).toBeInTheDocument();
    expect(screen.queryByLabelText('동사 동작 보드')).not.toBeInTheDocument();
  });

  it('명사 "빵" 선택 후 동사 "먹어요" 선택 시 ① 카드 조합 제시 후 ② 실제로 빵을 먹는 하나의 동작 그림이 제시되어야 한다', () => {
    render(<App />);

    // 1. 명사 '빵' 선택 -> 선택한 명사만 활성화되고 동사 보드 등장
    fireEvent.click(screen.getByLabelText('빵 카드'));
    expect(screen.getByLabelText('동사 동작 보드')).toBeInTheDocument();

    // 1페이지 고빈도 동사(타요, 꺼내요, 뜯어요, 가요, 열어요) 확인
    expect(screen.getByLabelText('타요 카드')).toBeInTheDocument();
    expect(screen.getByLabelText('꺼내요 카드')).toBeInTheDocument();
    expect(screen.getByLabelText('뜯어요 카드')).toBeInTheDocument();
    expect(screen.getByLabelText('가요 카드')).toBeInTheDocument();
    expect(screen.getByLabelText('열어요 카드')).toBeInTheDocument();

    // 2. 동사 '먹어요' 선택 -> 결합 학습 스테이지 및 아동 음성 녹음 컨트롤 바 등장 (1차: 두 카드 조합 제시 화면)
    fireEvent.click(screen.getByLabelText('먹어요 카드'));
    expect(screen.getByLabelText('명사 동사 결합 학습 스테이지')).toBeInTheDocument();
    expect(screen.getByLabelText('두 카드 조합 제시 화면')).toBeInTheDocument();
    expect(screen.getByLabelText('아동 음성 녹음 컨트롤 바')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /아동 음성 녹음하기/i })).toBeInTheDocument();

    // 3. 2차: 하나로 합쳐진 실제 동작 그림('빵 먹어요 통합 동작 그림') 화면 제시 확인
    const mergedStageBtn = screen.getByRole('button', { name: /하나로 합쳐진 실제 동작 그림/i });
    fireEvent.click(mergedStageBtn);
    expect(screen.getByLabelText('하나로 결합된 실제 동작 화면')).toBeInTheDocument();
    expect(screen.getByLabelText('빵 먹어요 통합 동작 그림')).toBeInTheDocument();
  });

  it('즐겨찾기 챕터로 전환하면 저장된 자주 쓰는 표현을 모아 보고 즉시 실행할 수 있어야 한다', () => {
    render(<App />);

    const favChapterBtn = screen.getByRole('button', { name: /즐겨찾기 챕터/i });
    fireEvent.click(favChapterBtn);

    expect(screen.getByLabelText('즐겨찾기 표현 보드')).toBeInTheDocument();
    expect(screen.getByLabelText('즐겨찾기 표현 빵 주세요')).toBeInTheDocument();
  });

  it('놀이·장난감 카테고리에 그네, 트램폴린, 자전거, 노래가 제시되고 동사 페이지에 틀어주세요, 만지지 마세요, 좋아요, 맛있어요, 재밌어요가 제시되어야 한다', () => {
    useAacStore.setState({ activeChapter: 'play', activeCategory: 'play', selectedCards: [] });
    render(<App />);

    expect(screen.getByLabelText('그네 카드')).toBeInTheDocument();
    expect(screen.getByLabelText('트램폴린 카드')).toBeInTheDocument();
    expect(screen.getByLabelText('자전거 카드')).toBeInTheDocument();
    expect(screen.getByLabelText('노래 카드')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('노래 카드'));
    fireEvent.click(screen.getByRole('button', { name: /다음 동사/i }));
    fireEvent.click(screen.getByRole('button', { name: /다음 동사/i }));

    expect(screen.getByLabelText('틀어주세요 카드')).toBeInTheDocument();
    expect(screen.getByLabelText('만지지 마세요 카드')).toBeInTheDocument();
    expect(screen.getByLabelText('좋아요 카드')).toBeInTheDocument();
    expect(screen.getByLabelText('맛있어요 카드')).toBeInTheDocument();
    expect(screen.getByLabelText('재밌어요 카드')).toBeInTheDocument();
  });

  it('치료사용 "새 카드 만들기" 모달에서 사진첩 선택 및 실시간 카메라 촬영 버튼을 제공하고 "명사 개수·음성 설정" 모달이 열려야 한다', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /새 카드 만들기/i }));
    expect(screen.getByText(/아동 맞춤형 새 어휘·동작 카드 만들기/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /사진첩에서 사진·GIF 고르기/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /실시간 카메라로 찍기/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /기기 카메라 앱 열기/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /명사 개수·음성 설정/i }));
    expect(screen.getByText(/한 화면에 제시할 명사 카드 개수/i)).toBeInTheDocument();
  });

  it('[HR-04] Result<T, E> 헬퍼 함수 ok와 err가 정확한 판별 유니온을 반환해야 한다', () => {
    expect(ok('빵 주세요').ok).toBe(true);
    expect(err('TTS_ERROR', '오류').ok).toBe(false);
  });
});
