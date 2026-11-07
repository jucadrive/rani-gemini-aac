import { beforeEach, describe, expect, it } from 'vitest';
import { getVisibleCards, useAacStore } from './useAacStore';
import { DEFAULT_NOUN_CARDS, DEFAULT_VERB_CARDS } from '../utils/aacTemplates';
import { AacCard } from '../types/aac';

describe('Phase 3: AAC 문장 조합 스토어(빵 + 주세요 = 빵 주세요) 및 템플릿 검증', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useAacStore.setState({
      activeCategory: 'food',
      selectedCards: [],
      customCards: [],
    });
  });

  it('명사 "빵"을 누른 뒤 동사 "주세요"를 누르면 "빵 주세요" 완성 문장이 반환되어야 한다', () => {
    const breadCard = DEFAULT_NOUN_CARDS.find((c) => c.id === 'noun-bread')!;
    const giveCard = DEFAULT_VERB_CARDS.find((c) => c.id === 'verb-give')!;

    // 1. '빵' 탭
    const step1 = useAacStore.getState().selectCard(breadCard);
    expect(step1.wordSpeech).toBe('빵');
    expect(step1.completedSentenceSpeech).toBeNull();
    expect(useAacStore.getState().getSentenceText()).toBe('빵');

    // 2. '주세요' 탭 -> '주세요' 단어 발화 + '빵 주세요' 완성 문장 반환
    const step2 = useAacStore.getState().selectCard(giveCard);
    expect(step2.wordSpeech).toBe('주세요');
    expect(step2.completedSentenceSpeech).toBe('빵 주세요');
    expect(useAacStore.getState().getSentenceText()).toBe('빵 주세요');
  });

  it('"빵 주세요" 완성 후 새로운 명사 "우유"를 누르면 새 문장("우유")으로 깔끔하게 시작해야 한다', () => {
    const breadCard = DEFAULT_NOUN_CARDS.find((c) => c.id === 'noun-bread')!;
    const giveCard = DEFAULT_VERB_CARDS.find((c) => c.id === 'verb-give')!;
    const milkCard = DEFAULT_NOUN_CARDS.find((c) => c.id === 'noun-milk')!;

    useAacStore.getState().selectCard(breadCard);
    useAacStore.getState().selectCard(giveCard);
    expect(useAacStore.getState().getSentenceText()).toBe('빵 주세요');

    // 새 명사 '우유' 탭
    useAacStore.getState().selectCard(milkCard);
    expect(useAacStore.getState().getSentenceText()).toBe('우유');
  });

  it('치료사가 커스텀 카드를 추가하고 삭제하면 카테고리 목록에 즉시 반영되어야 한다', () => {
    const customSnack: AacCard = {
      id: 'custom-strawberry',
      label: '딸기',
      speechText: '딸기',
      partOfSpeech: 'noun',
      categoryId: 'food',
      emoji: '🍓',
      isCustom: true,
    };

    useAacStore.getState().addCustomCard(customSnack);
    const visibleAfterAdd = getVisibleCards('food', useAacStore.getState().customCards);
    expect(visibleAfterAdd.nouns.some((c) => c.id === 'custom-strawberry')).toBe(true);

    useAacStore.getState().deleteCustomCard('custom-strawberry');
    const visibleAfterDelete = getVisibleCards('food', useAacStore.getState().customCards);
    expect(visibleAfterDelete.nouns.some((c) => c.id === 'custom-strawberry')).toBe(false);
  });
});
