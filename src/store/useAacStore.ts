import { create } from 'zustand';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../services/storageService';
import { AacCard, ActiveChapterId, FavoriteSentence, NounCategoryId, TtsSettings } from '../types/aac';
import { DEFAULT_FAVORITE_SENTENCES, DEFAULT_NOUN_CARDS, DEFAULT_VERB_CARDS } from '../utils/aacTemplates';
import { DEFAULT_TTS_CONFIG } from '../utils/constants';

/**
 * @description AAC 의사소통 보드 전역 스토어 상태 및 액션 인터페이스
 */
export interface AacStoreState {
  readonly activeChapter: ActiveChapterId;
  readonly activeCategory: NounCategoryId;
  readonly selectedCards: AacCard[];
  readonly customCards: AacCard[];
  readonly favoriteSentences: FavoriteSentence[];
  readonly ttsSettings: TtsSettings;
  readonly setActiveChapter: (chapter: ActiveChapterId) => void;
  readonly setActiveCategory: (category: NounCategoryId) => void;
  readonly selectCard: (card: AacCard) => {
    readonly wordSpeech: string;
    readonly completedSentenceSpeech: string | null;
  };
  readonly removeSelectedCardAt: (index: number) => void;
  readonly clearSentence: () => void;
  readonly getSentenceText: () => string;
  readonly saveCurrentAsFavorite: () => boolean;
  readonly removeFavoriteSentence: (favoriteId: string) => void;
  readonly applyFavoriteSentence: (favorite: FavoriteSentence) => string;
  readonly addCustomCard: (card: AacCard) => void;
  readonly deleteCustomCard: (cardId: string) => void;
  readonly updateTtsSettings: (partial: Partial<TtsSettings>) => void;
}

const DEFAULT_SETTINGS: TtsSettings = {
  rate: DEFAULT_TTS_CONFIG.DEFAULT_RATE,
  pitch: DEFAULT_TTS_CONFIG.DEFAULT_PITCH,
  volume: DEFAULT_TTS_CONFIG.DEFAULT_VOLUME,
  autoReadCompletedSentence: true,
  nounDisplayLimit: 4,
};

/**
 * @description [HR-01, HR-05] 자폐 아동 맞춤형 단계별 선택(명사 단독 제시 -> 동사 활성화),
 * 명사 노출 개수 조절, 즐겨찾기 챕터 저장을 관리하는 Zustand 스토어
 */
export const useAacStore = create<AacStoreState>((set, get) => {
  const savedSettingsRes = loadFromStorage<TtsSettings>(STORAGE_KEYS.TTS_SETTINGS, DEFAULT_SETTINGS);
  const savedCustomRes = loadFromStorage<AacCard[]>(STORAGE_KEYS.CUSTOM_CARDS, []);
  const savedFavRes = loadFromStorage<FavoriteSentence[]>(
    STORAGE_KEYS.FAVORITE_SENTENCES,
    [...DEFAULT_FAVORITE_SENTENCES]
  );

  const initialSettings: TtsSettings = savedSettingsRes.ok
    ? { ...DEFAULT_SETTINGS, ...savedSettingsRes.data }
    : DEFAULT_SETTINGS;

  return {
    activeChapter: 'food',
    activeCategory: 'food',
    selectedCards: [],
    customCards: savedCustomRes.ok ? savedCustomRes.data : [],
    favoriteSentences: savedFavRes.ok ? savedFavRes.data : [...DEFAULT_FAVORITE_SENTENCES],
    ttsSettings: initialSettings,

    setActiveChapter: (chapter: ActiveChapterId): void => {
      if (chapter === 'favorites') {
        set({ activeChapter: 'favorites' });
      } else {
        set({ activeChapter: chapter, activeCategory: chapter, selectedCards: [] });
      }
    },

    setActiveCategory: (category: NounCategoryId): void => {
      set({ activeChapter: category, activeCategory: category, selectedCards: [] });
    },

    selectCard: (card: AacCard) => {
      const current = get().selectedCards;
      let nextCards: AacCard[];

      if (card.partOfSpeech === 'noun') {
        // 1단계: 명사를 선택하면 오직 선택한 그 명사 1개만 단독 활성화
        nextCards = [card];
      } else {
        // 2단계: 동사를 선택하면 앞서 선택한 명사 뒤에 선택한 동사 1개를 결합하여 활성화
        const selectedNoun = current.find((c) => c.partOfSpeech === 'noun');
        nextCards = selectedNoun ? [selectedNoun, card] : [card];
      }

      set({ selectedCards: nextCards });

      const fullSentence = nextCards.map((c) => c.speechText).join(' ');
      const isCompleted = card.partOfSpeech === 'verb' && nextCards.length >= 2;

      return {
        wordSpeech: card.speechText,
        completedSentenceSpeech: isCompleted ? fullSentence : null,
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
      return get().selectedCards.map((c) => c.speechText).join(' ');
    },

    saveCurrentAsFavorite: (): boolean => {
      const cards = get().selectedCards;
      if (cards.length === 0) return false;
      const sentenceText = cards.map((c) => c.speechText).join(' ');
      const existing = get().favoriteSentences;
      if (existing.some((f) => f.sentenceText === sentenceText)) return false;

      const newFav: FavoriteSentence = { id: `fav-${Date.now()}`, sentenceText, cards: [...cards] };
      const updated = [newFav, ...existing];
      saveToStorage(STORAGE_KEYS.FAVORITE_SENTENCES, updated);
      set({ favoriteSentences: updated });
      return true;
    },

    removeFavoriteSentence: (favoriteId: string): void => {
      const updated = get().favoriteSentences.filter((f) => f.id !== favoriteId);
      saveToStorage(STORAGE_KEYS.FAVORITE_SENTENCES, updated);
      set({ favoriteSentences: updated });
    },

    applyFavoriteSentence: (favorite: FavoriteSentence): string => {
      set({ selectedCards: [...favorite.cards] });
      return favorite.sentenceText;
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
 * @description 기본 카드와 커스텀 카드를 합쳐 현재 카테고리의 명사 목록과 동사 목록을 반환하는 순수 헬퍼
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
