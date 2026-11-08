import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Col, Row } from 'antd';
import { AddCustomCardModal } from '../components/AddCustomCardModal';
import { AppHeaderBar } from '../components/AppHeaderBar';
import { CombinedSentenceStage, CombinedStagePhase } from '../components/CombinedSentenceStage';
import { FavoriteChapterSection } from '../components/FavoriteChapterSection';
import { NounBoardSection } from '../components/NounBoardSection';
import { SentenceStripBar } from '../components/SentenceStripBar';
import { TtsSettingsModal } from '../components/TtsSettingsModal';
import { VerbBoardSection } from '../components/VerbBoardSection';
import { useTTS } from '../hooks/useTTS';
import { getVisibleCards, useAacStore } from '../store/useAacStore';
import { AacCard, FavoriteSentence } from '../types/aac';
import { NOUN_CATEGORIES } from '../utils/aacTemplates';
import { WARM_PASTEL_COLORS } from '../utils/constants';

/**
 * @description [HR-01, HR-03, HR-05] 자폐 아동 맞춤형 단계별 화면 제시:
 * 1단계(명사 단독) -> 2단계(동사 선택) -> 3단계(카드 조합 제시 후 하나로 결합된 실제 동작 그림 제시 및 재발화)
 * @returns {React.ReactElement} 메인 홈 페이지 엘리먼트
 */
export function HomePage(): React.ReactElement {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isTtsModalOpen, setIsTtsModalOpen] = useState<boolean>(false);
  const [stagePhase, setStagePhase] = useState<CombinedStagePhase>('combo');
  const mergeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    activeChapter, activeCategory, selectedCards, customCards, favoriteSentences, ttsSettings,
    setActiveChapter, setActiveCategory, selectCard, removeSelectedCardAt, clearSentence,
    getSentenceText, saveCurrentAsFavorite, removeFavoriteSentence, applyFavoriteSentence,
    addCustomCard, deleteCustomCard, updateTtsSettings,
  } = useAacStore();

  const { isSpeaking, speakingText, koreanVoices, speak, speakWithSentence, stop } = useTTS(ttsSettings);
  const { nouns, verbs } = useMemo(() => getVisibleCards(activeCategory, customCards), [activeCategory, customCards]);
  const selectedCardIds = useMemo(() => new Set(selectedCards.map((c) => c.id)), [selectedCards]);
  const selectedNoun = useMemo(() => selectedCards.find((c) => c.partOfSpeech === 'noun'), [selectedCards]);
  const selectedVerb = useMemo(() => selectedCards.find((c) => c.partOfSpeech === 'verb'), [selectedCards]);
  const hasSelectedNoun = Boolean(selectedNoun);
  const sentenceText = getSentenceText();
  const isFavoriteSaved = useMemo(
    () => Boolean(sentenceText) && favoriteSentences.some((f) => f.sentenceText === sentenceText),
    [sentenceText, favoriteSentences]
  );

  useEffect(() => () => { if (mergeTimerRef.current) clearTimeout(mergeTimerRef.current); }, []);

  /** 1차 [명사+동사 카드 조합] 제시 후 -> 2차 [하나로 합쳐진 실제 동작 그림]으로 전환하는 타이머 예약 */
  const scheduleMergeTransition = (): void => {
    if (mergeTimerRef.current) clearTimeout(mergeTimerRef.current);
    setStagePhase('combo');
    mergeTimerRef.current = setTimeout(() => setStagePhase('merged'), 1500);
  };

  /** 명사 또는 동사 카드 탭 시 단계별 활성화 및 2단계 연속 발화 처리 */
  const handleSelectCard = (card: AacCard): void => {
    const { wordSpeech, completedSentenceSpeech } = selectCard(card);
    if (completedSentenceSpeech) {
      scheduleMergeTransition();
      speakWithSentence(wordSpeech, completedSentenceSpeech, () => setStagePhase('merged'));
    } else {
      setStagePhase('combo');
      speak(wordSpeech);
    }
  };

  /** 즐겨찾기 챕터에서 문장 탭 시 즉시 조합 -> 통합 동작 시퀀스 실행 */
  const handleSelectFavorite = (favorite: FavoriteSentence): void => {
    const text = applyFavoriteSentence(favorite);
    scheduleMergeTransition();
    speakWithSentence(text, text, () => setStagePhase('merged'));
  };

  /** 상단 문장 바 전체 비우기 및 1단계 복귀 */
  const handleClearAll = (): void => {
    if (mergeTimerRef.current) clearTimeout(mergeTimerRef.current);
    stop();
    setStagePhase('combo');
    clearSentence();
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: WARM_PASTEL_COLORS.BG_MAIN, padding: '14px 20px 24px' }}>
      <AppHeaderBar
        hasSelectedNoun={hasSelectedNoun}
        isFavoritesOpen={activeChapter === 'favorites'}
        favoritesCount={favoriteSentences.length}
        onToggleFavorites={() => setActiveChapter(activeChapter === 'favorites' ? activeCategory : 'favorites')}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenSettingsModal={() => setIsTtsModalOpen(true)}
      />

      <SentenceStripBar
        selectedCards={selectedCards}
        sentenceText={sentenceText}
        isFavoriteSaved={isFavoriteSaved}
        isSpeaking={isSpeaking}
        speakingText={speakingText}
        onSpeakSentence={() => speak(sentenceText)}
        onSaveFavorite={() => saveCurrentAsFavorite()}
        onRemoveCardAt={removeSelectedCardAt}
        onClearAll={handleClearAll}
      />

      {selectedNoun && selectedVerb && (
        <CombinedSentenceStage
          nounCard={selectedNoun}
          verbCard={selectedVerb}
          sentenceText={sentenceText}
          stagePhase={stagePhase}
          isFavoriteSaved={isFavoriteSaved}
          onChangePhase={(phase) => { setStagePhase(phase); speak(sentenceText); }}
          onReplaySequence={() => {
            scheduleMergeTransition();
            speakWithSentence(selectedVerb.speechText, sentenceText, () => setStagePhase('merged'));
          }}
          onSaveFavorite={() => saveCurrentAsFavorite()}
          onReset={handleClearAll}
        />
      )}

      {activeChapter === 'favorites' ? (
        <FavoriteChapterSection
          favorites={favoriteSentences}
          activeSentenceText={sentenceText}
          onSelectFavorite={handleSelectFavorite}
          onRemoveFavorite={removeFavoriteSentence}
        />
      ) : !hasSelectedNoun ? (
        <NounBoardSection
          categories={NOUN_CATEGORIES}
          activeCategory={activeCategory}
          nounCards={nouns}
          displayLimit={ttsSettings.nounDisplayLimit}
          selectedCardIds={selectedCardIds}
          isSpeaking={isSpeaking}
          onSelectCategory={setActiveCategory}
          onSelectCard={handleSelectCard}
          onDeleteCustomCard={deleteCustomCard}
        />
      ) : (
        <Row gutter={[16, 16]} align="stretch">
          <Col xs={24} lg={10}>
            <NounBoardSection
              categories={NOUN_CATEGORIES}
              activeCategory={activeCategory}
              nounCards={nouns}
              displayLimit={ttsSettings.nounDisplayLimit}
              selectedCardIds={selectedCardIds}
              isSpeaking={isSpeaking}
              onSelectCategory={setActiveCategory}
              onSelectCard={handleSelectCard}
              onDeleteCustomCard={deleteCustomCard}
            />
          </Col>
          <Col xs={24} lg={14}>
            <VerbBoardSection
              verbCards={verbs}
              selectedCardIds={selectedCardIds}
              isSpeaking={isSpeaking}
              onSelectCard={handleSelectCard}
              onBackToNounStep={handleClearAll}
              onDeleteCustomCard={deleteCustomCard}
            />
          </Col>
        </Row>
      )}

      <AddCustomCardModal
        open={isAddModalOpen}
        categories={NOUN_CATEGORIES}
        defaultCategoryId={activeCategory}
        onClose={() => setIsAddModalOpen(false)}
        onAddCard={addCustomCard}
      />

      <TtsSettingsModal
        open={isTtsModalOpen}
        settings={ttsSettings}
        koreanVoices={koreanVoices}
        onUpdateSettings={updateTtsSettings}
        onTestSpeak={speak}
        onClose={() => setIsTtsModalOpen(false)}
      />
    </main>
  );
}
