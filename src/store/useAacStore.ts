import { create } from 'zustand';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../services/storageService';
import { AacCard, NounCategoryId, TtsSettings } from '../types/aac';
import { DEFAULT_NOUN_CARDS, DEFAULT_VERB_CARDS } from '../utils/aacTemplates';
import { DEFAULT_TTS_CONFIG } from '../utils/constants';

/**
 * @description AAC 의사소통 보드 전역 스토어 상태 및 액션 인터페이스
 */
export interface AacStoreState {
  /** 현재 선택된 좌측 명사 보드 카테고리 */
  readonly activeCategory: NounCategoryId;
  /** 상단 문장 조합 바(Sentence Strip)에 담긴 카드 배열 */
  readonly selectedCards: AacCard[];
  /** 치료사가 추가한 커스텀 카드 목록 */
  readonly customCards: AacCard[];
  /** TTS 음성 출력 설정 */
  readonly ttsSettings: TtsSettings;
  /** 카테고리 탭 변경 액션 */
  readonly setActiveCategory: (category: NounCategoryId) => void;
  /**
   * 카드를 탭했을 때 문장 조합 바를 업데이트하고,
   * 방금 탭한 단어와 완성된 문장(동사 결합 시)을 반환하는 핵심 액션
   */
  readonly selectCard: (card: AacCard) => {
    readonly wordSpeech: string;
    readonly completedSentenceSpeech: string | null;
  };
  /** 문장 조합 바에서 특정 인덱스의 카드를 제거하는 액션 */
  readonly removeSelectedCardAt: (index: number) => void;
  /** 문장 조합 바를 모두 비우는 액션 */
  readonly clearSentence: () => void;
  /** 현재 문장 조합 바의 전체 한국어 문장 텍스트를 반환하는 셀렉터 */
  readonly getSentenceText: () => string;
  /** 커스텀 명사/동사 카드를 추가하고 로컬 스토리지에 영속화하는 액션 */
  readonly addCustomCard: (card: AacCard) => void;
  /** 커스텀 카드를 삭제하는 액션 */
  readonly deleteCustomCard: (cardId: string) => void;
  /** TTS 설정을 변경하고 로컬 스토리지에 영속화하는 액션 */
  readonly updateTtsSettings: (partial: Partial<TtsSettings>) => void;
}

const DEFAULT_SETTINGS: TtsSettings = {
  rate: DEFAULT_TTS_CONFIG.DEFAULT_RATE,
  pitch: DEFAULT_TTS_CONFIG.DEFAULT_PITCH,
  volume: DEFAULT_TTS_CONFIG.DEFAULT_VOLUME,
  autoReadCompletedSentence: true,
};

/**
 * @description [HR-01, HR-05] 명사+동사 문장 조합('빵' + '주세요' -> '빵 주세요') 및 카드/TTS 설정을 관리하는 Zustand 스토어
 */
export const useAacStore = create<AacStoreState>((set, get) => {
  const savedSettingsRes = loadFromStorage<TtsSettings>(
    STORAGE_KEYS.TTS_SETTINGS,
    DEFAULT_SETTINGS
  );
  const savedCustomCardsRes = loadFromStorage<AacCard[]>(STORAGE_KEYS.CUSTOM_CARDS, []);

  return {
    activeCategory: 'food',
    selectedCards: [],
    customCards: savedCustomCardsRes.ok ? savedCustomCardsRes.data : [],
    ttsSettings: savedSettingsRes.ok ? savedSettingsRes.data : DEFAULT_SETTINGS,

    setActiveCategory: (category: NounCategoryId): void => {
      set({ activeCategory: category });
    },

    selectCard: (card: AacCard) => {
      const current = get().selectedCards;
      const hasVerbAlready = current.some((c) => c.partOfSpeech === 'verb');
      let nextCards: AacCard[];

      if (card.partOfSpeech === 'noun') {
        // 이미 '빵 주세요'처럼 동사까지 완성된 뒤 새 명사를 누르면 새 문장으로 시작하거나 명사를 교체
        if (hasVerbAlready) {
          nextCards = [card];
        } else {
          // 아직 동사를 누르기 전이면 마지막 명사를 교체(최대 2개 명사까지 허용하되 동일 카드 중복 방지)
          const filtered = current.filter((c) => c.id !== card.id);
          nextCards = [...filtered.slice(-1), card];
        }
      } else {
        // 동사('주세요')를 누른 경우: 앞선 명사들을 유지하고 마지막 동사를 현재 동사로 설정
        const nounsOnly = current.filter((c) => c.partOfSpeech === 'noun');
        nextCards = [...nounsOnly, card];
      }

      set({ selectedCards: nextCards });

      const fullSentence = nextCards.map((c) => c.speechText).join(' ');
      const isSentenceCompletedWithNounAndVerb =
        card.partOfSpeech === 'verb' && nextCards.length >= 2;

      return {
        wordSpeech: card.speechText,
        completedSentenceSpeech: isSentenceCompletedWithNounAndVerb ? fullSentence : null,
      };
    },

    removeSelectedCardAt: (index: number): void => {
      set((state) => ({
        selectedCards: state.selectedCards.filter((_, idx) => idx !== index),
      }));
    },

    clearSentence: (): void => {
      set({ selectedCards: [] });
    },

    getSentenceText: (): string => {
      return get()
        .selectedCards.map((c) => c.speechText)
        .join(' ');
    },

    addCustomCard: (card: AacCard): void => {
      const updated = [...get().customCards, card];
      saveToStorage(STORAGE_KEYS.CUSTOM_CARDS, updated);
      set({ customCards: updated });
    },

    deleteCustomCard: (cardId: string): void => {
      const updated = get().customCards.filter((c) => c.id !== cardId);
      saveToStorage(STORAGE_KEYS.CUSTOM_CARDS, updated);
      set((state) => ({
        customCards: updated,
        selectedCards: state.selectedCards.filter((c) => c.id !== cardId),
      }));
    },

    updateTtsSettings: (partial: Partial<TtsSettings>): void => {
      const updated = { ...get().ttsSettings, ...partial };
      saveToStorage(STORAGE_KEYS.TTS_SETTINGS, updated);
      set({ ttsSettings: updated });
    },
  };
});

/**
 * @description 기본 카드와 커스텀 카드를 합쳐 현재 카테고리의 명사 목록과 고정 동사 목록을 반환하는 순수 헬퍼
 * @param activeCategory 현재 선택된 명사 카테고리 ID
 * @param customCards 사용자가 추가한 커스텀 카드 배열
 * @returns {{ nouns: AacCard[]; verbs: AacCard[] }} 필터링된 명사 및 동사 카드 배열
 */
export function getVisibleCards(
  activeCategory: NounCategoryId,
  customCards: readonly AacCard[]
): { readonly nouns: AacCard[]; readonly verbs: AacCard[] } {
  const allNouns = [...DEFAULT_NOUN_CARDS, ...customCards.filter((c) => c.partOfSpeech === 'noun')];
  const allVerbs = [...DEFAULT_VERB_CARDS, ...customCards.filter((c) => c.partOfSpeech === 'verb')];

  return {
    nouns: allNouns.filter((c) => c.categoryId === activeCategory),
    verbs: allVerbs,
  };
}
