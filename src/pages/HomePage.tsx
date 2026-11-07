import React, { useMemo, useState } from 'react';
import { Button, Col, Row, Space, Tag, Typography } from 'antd';
import { PlusCircleOutlined, SettingOutlined, SmileOutlined } from '@ant-design/icons';
import { AddCustomCardModal } from '../components/AddCustomCardModal';
import { NounBoardSection } from '../components/NounBoardSection';
import { SentenceStripBar } from '../components/SentenceStripBar';
import { TtsSettingsModal } from '../components/TtsSettingsModal';
import { VerbBoardSection } from '../components/VerbBoardSection';
import { useTTS } from '../hooks/useTTS';
import { getVisibleCards, useAacStore } from '../store/useAacStore';
import { AacCard } from '../types/aac';
import { NOUN_CATEGORIES } from '../utils/aacTemplates';
import { APP_META, WARM_PASTEL_COLORS } from '../utils/constants';

const { Title } = Typography;

/**
 * @description [HR-01, HR-03, HR-05] AAC 의사소통 보드 메인 컨테이너 페이지
 * useAacStore와 useTTS를 조합하여 명사 보드, 움직이는 동사 보드, 문장 조합 바 및 치료사용 모달을 제어합니다.
 * @returns {React.ReactElement} 메인 홈 페이지 엘리먼트
 */
export function HomePage(): React.ReactElement {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isTtsModalOpen, setIsTtsModalOpen] = useState<boolean>(false);

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
    addCustomCard,
    deleteCustomCard,
    updateTtsSettings,
  } = useAacStore();

  const { isSpeaking, speakingText, koreanVoices, speak, speakWithSentence, stop } =
    useTTS(ttsSettings);

  const { nouns, verbs } = useMemo(
    () => getVisibleCards(activeCategory, customCards),
    [activeCategory, customCards]
  );

  const selectedCardIds = useMemo(
    () => new Set(selectedCards.map((c) => c.id)),
    [selectedCards]
  );

  const sentenceText = getSentenceText();

  /** 명사 또는 움직이는 동사 카드 탭 시 문장 조합 및 음성 발화 처리 */
  const handleSelectCard = (card: AacCard): void => {
    const { wordSpeech, completedSentenceSpeech } = selectCard(card);
    if (completedSentenceSpeech) {
      speakWithSentence(wordSpeech, completedSentenceSpeech);
    } else {
      speak(wordSpeech);
    }
  };

  /** 상단 문장 바 전체 비우기 및 발화 중지 */
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
      {/* 상단 앱 헤더 및 치료사용 도구 버튼 (새 카드 만들기 / 음성 설정) */}
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

        <Space size="small" wrap>
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => setIsAddModalOpen(true)}
            style={{ borderRadius: 14, fontWeight: 600 }}
          >
            새 카드 만들기
          </Button>
          <Button
            icon={<SettingOutlined />}
            onClick={() => setIsTtsModalOpen(true)}
            style={{ borderRadius: 14, fontWeight: 600 }}
          >
            음성·속도 설정
          </Button>
        </Space>
      </header>

      {/* 상단 문장 조합 바 */}
      <SentenceStripBar
        selectedCards={selectedCards}
        sentenceText={sentenceText}
        isSpeaking={isSpeaking}
        speakingText={speakingText}
        onSpeakSentence={() => speak(sentenceText)}
        onRemoveCardAt={removeSelectedCardAt}
        onClearAll={handleClearAll}
      />

      {/* 중단: 좌측 명사 칸 vs 우측 움직이는 동사 칸 분리 레이아웃 */}
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

      {/* 치료사용 커스텀 카드(사진/GIF) 추가 모달 */}
      <AddCustomCardModal
        open={isAddModalOpen}
        categories={NOUN_CATEGORIES}
        defaultCategoryId={activeCategory}
        onClose={() => setIsAddModalOpen(false)}
        onAddCard={addCustomCard}
      />

      {/* 고품질 TTS 음성·속도 설정 모달 */}
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
