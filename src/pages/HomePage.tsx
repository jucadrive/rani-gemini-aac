import React, { useMemo } from 'react';
import { Col, Row, Switch, Tag, Typography } from 'antd';
import { SmileOutlined, SoundOutlined } from '@ant-design/icons';
import { NounBoardSection } from '../components/NounBoardSection';
import { SentenceStripBar } from '../components/SentenceStripBar';
import { VerbBoardSection } from '../components/VerbBoardSection';
import { useTTS } from '../hooks/useTTS';
import { getVisibleCards, useAacStore } from '../store/useAacStore';
import { AacCard } from '../types/aac';
import { NOUN_CATEGORIES } from '../utils/aacTemplates';
import { APP_META, WARM_PASTEL_COLORS } from '../utils/constants';

const { Title, Text } = Typography;

/**
 * @description [HR-01, HR-03, HR-05] AAC 의사소통 보드 메인 컨테이너 페이지
 * useAacStore(도메인 상태)와 useTTS(음성 합성 훅)를 조합하여 하위 순수 프레젠테이셔널 컴포넌트에 주입합니다.
 * - 명사('빵') 탭 -> '빵' 즉시 발화
 * - 동사('주세요') 탭 -> '주세요' 발화 후 '빵 주세요' 전체 문장 연속 발화
 * @returns {React.ReactElement} 메인 홈 페이지 엘리먼트
 */
export function HomePage(): React.ReactElement {
  const {
    activeCategory,
    selectedCards,
    customCards,
    ttsSettings,
    setActiveCategory,
    selectCard,
    removeSelectedCardAt,
    clearSentence,
    getSentenceText,
    deleteCustomCard,
    updateTtsSettings,
  } = useAacStore();

  const { isSpeaking, speakingText, speak, speakWithSentence, stop } = useTTS(ttsSettings);

  const { nouns, verbs } = useMemo(
    () => getVisibleCards(activeCategory, customCards),
    [activeCategory, customCards]
  );

  const selectedCardIds = useMemo(
    () => new Set(selectedCards.map((c) => c.id)),
    [selectedCards]
  );

  const sentenceText = getSentenceText();

  /**
   * 명사 또는 동사 카드를 탭했을 때 문장 조합 및 음성 발화를 트리거하는 핸들러
   * @param card 사용자가 탭한 AAC 카드
   */
  const handleSelectCard = (card: AacCard): void => {
    const { wordSpeech, completedSentenceSpeech } = selectCard(card);
    if (completedSentenceSpeech) {
      speakWithSentence(wordSpeech, completedSentenceSpeech);
    } else {
      speak(wordSpeech);
    }
  };

  /**
   * 상단 문장 조합 바를 모두 비우고 진행 중인 발화를 멈추는 핸들러
   */
  const handleClearAll = (): void => {
    stop();
    clearSentence();
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: WARM_PASTEL_COLORS.BG_MAIN,
        padding: '14px 20px 24px',
      }}
    >
      {/* 상단 앱 타이틀 및 자동 문장 이어읽기 토글 바 */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <SmileOutlined style={{ fontSize: 28, color: WARM_PASTEL_COLORS.PRIMARY_BRAND }} />
          <Title level={3} style={{ margin: 0, color: WARM_PASTEL_COLORS.TEXT_PRIMARY }}>
            {APP_META.TITLE}
          </Title>
          <Tag color="orange" style={{ borderRadius: 12, fontWeight: 600, fontSize: 13 }}>
            {APP_META.SUBTITLE}
          </Tag>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <SoundOutlined style={{ color: WARM_PASTEL_COLORS.VERB_ACCENT, fontSize: 18 }} />
          <Text strong style={{ fontSize: 14 }}>
            동사 탭 시 문장 자동 완성 읽기
          </Text>
          <Switch
            aria-label="문장 자동 완성 읽기 스위치"
            checked={ttsSettings.autoReadCompletedSentence}
            onChange={(checked) => updateTtsSettings({ autoReadCompletedSentence: checked })}
          />
        </div>
      </header>

      {/* 상단 문장 조합 바 (Sentence Strip) */}
      <SentenceStripBar
        selectedCards={selectedCards}
        sentenceText={sentenceText}
        isSpeaking={isSpeaking}
        speakingText={speakingText}
        onSpeakSentence={() => speak(sentenceText)}
        onRemoveCardAt={removeSelectedCardAt}
        onClearAll={handleClearAll}
      />

      {/* 중단: 좌측 명사 칸(58%) vs 우측 움직이는 동사 칸(42%) 분리 레이아웃 */}
      <Row gutter={[16, 16]} align="stretch">
        <Col xs={24} lg={14}>
          <NounBoardSection
            categories={NOUN_CATEGORIES}
            activeCategory={activeCategory}
            nounCards={nouns}
            selectedCardIds={selectedCardIds}
            onSelectCategory={setActiveCategory}
            onSelectCard={handleSelectCard}
            onDeleteCustomCard={deleteCustomCard}
          />
        </Col>

        <Col xs={24} lg={10}>
          <VerbBoardSection
            verbCards={verbs}
            selectedCardIds={selectedCardIds}
            onSelectCard={handleSelectCard}
            onDeleteCustomCard={deleteCustomCard}
          />
        </Col>
      </Row>
    </main>
  );
}
