import React from 'react';
import { Button, Card, Space, Tag, Typography } from 'antd';
import { ClearOutlined, SoundFilled } from '@ant-design/icons';
import { AacCard } from '../types/aac';
import { TOUCH_METRICS, WARM_PASTEL_COLORS } from '../utils/constants';
import { AnimatedVerbGraphic } from './AnimatedVerbGraphic';

const { Text } = Typography;

/**
 * @description SentenceStripBar 컴포넌트의 Props 인터페이스
 */
export interface SentenceStripBarProps {
  /** 현재 문장 조합 바에 선택된 카드 배열 */
  readonly selectedCards: readonly AacCard[];
  /** 조합 완성된 전체 문장 문자열 (예: '빵 주세요') */
  readonly sentenceText: string;
  /** 현재 TTS가 발화 중인지 여부 */
  readonly isSpeaking: boolean;
  /** 현재 발화 중인 텍스트 */
  readonly speakingText: string;
  /** 전체 문장 읽기 버튼 클릭 콜백 */
  readonly onSpeakSentence: () => void;
  /** 특정 인덱스의 선택된 카드를 제거하는 콜백 */
  readonly onRemoveCardAt: (index: number) => void;
  /** 문장 조합 바 전체 비우기 콜백 */
  readonly onClearAll: () => void;
}

/**
 * @description [HR-01, HR-03, HR-05] 상단 문장 조합 바(Sentence Strip) 프레젠테이셔널 컴포넌트
 * 아동이 탭한 명사('빵')와 움직이는 동사('주세요')가 순서대로 결합되는 과정을 시각적으로 보여주며,
 * 완성된 문장('빵 주세요')을 크게 표시하고 다시 읽기/지우기 기능을 제공합니다.
 * @param {SentenceStripBarProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 상단 문장 조합 바 엘리먼트
 */
export function SentenceStripBar({
  selectedCards,
  sentenceText,
  isSpeaking,
  speakingText,
  onSpeakSentence,
  onRemoveCardAt,
  onClearAll,
}: SentenceStripBarProps): React.ReactElement {
  const hasCards = selectedCards.length > 0;

  return (
    <Card
      aria-label="문장 조합 바"
      styles={{ body: { padding: '12px 18px' } }}
      style={{
        minHeight: TOUCH_METRICS.SENTENCE_BAR_HEIGHT,
        backgroundColor: WARM_PASTEL_COLORS.BG_SENTENCE_BAR,
        borderRadius: TOUCH_METRICS.CARD_BORDER_RADIUS,
        border: `3px solid ${
          isSpeaking ? WARM_PASTEL_COLORS.PRIMARY_BRAND : WARM_PASTEL_COLORS.NOUN_CARD_BORDER
        }`,
        boxShadow: '0 6px 18px rgba(247, 136, 47, 0.08)',
        marginBottom: 16,
        transition: 'border-color 0.25s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {/* 좌측: 선택된 카드 칩 나열 및 완성 문장 미리보기 */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10, flex: 1 }}>
          {!hasCards ? (
            <Text style={{ fontSize: 18, color: WARM_PASTEL_COLORS.TEXT_SECONDARY }}>
              👈 왼쪽에서 <b>명사(빵)</b>를 누르고, 👉 오른쪽에서 <b>움직이는 동사(주세요)</b>를 눌러보세요!
            </Text>
          ) : (
            <>
              {selectedCards.map((card, index) => (
                <React.Fragment key={`${card.id}-${index}`}>
                  {index > 0 && (
                    <Text strong style={{ fontSize: 22, color: WARM_PASTEL_COLORS.NOUN_ACCENT }}>
                      +
                    </Text>
                  )}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`선택된 카드 ${card.label} 제거`}
                    onClick={() => onRemoveCardAt(index)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') onRemoveCardAt(index);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 14px',
                      borderRadius: 18,
                      backgroundColor: '#FFFFFF',
                      border: `2px solid ${
                        card.partOfSpeech === 'noun'
                          ? WARM_PASTEL_COLORS.NOUN_ACCENT
                          : WARM_PASTEL_COLORS.VERB_ACCENT
                      }`,
                      cursor: 'pointer',
                    }}
                  >
                    {card.partOfSpeech === 'verb' ? (
                      <AnimatedVerbGraphic
                        emoji={card.emoji}
                        label={card.label}
                        motionType={card.motionType}
                        customImageUrl={card.customImageUrl}
                        size={30}
                      />
                    ) : (
                      <span style={{ fontSize: 26 }}>{card.emoji}</span>
                    )}
                    <Text strong style={{ fontSize: 20 }}>
                      {card.label}
                    </Text>
                  </div>
                </React.Fragment>
              ))}

              {/* 완성된 한국어 문장 강조 배지 */}
              <Tag
                color="orange"
                style={{
                  marginLeft: 8,
                  padding: '6px 16px',
                  fontSize: 20,
                  fontWeight: 700,
                  borderRadius: 16,
                }}
              >
                “{sentenceText}”
              </Tag>
            </>
          )}

          {isSpeaking && (
            <Tag
              color="volcano"
              style={{
                padding: '4px 12px',
                fontSize: 15,
                borderRadius: 14,
                animation: 'gentlePulse 0.9s infinite',
              }}
            >
              🔊 읽는 중: {speakingText}
            </Tag>
          )}
        </div>

        {/* 우측: 문장 전체 읽기 및 지우기 액션 버튼 */}
        <Space size="middle">
          <Button
            type="primary"
            size="large"
            icon={<SoundFilled />}
            disabled={!hasCards}
            onClick={onSpeakSentence}
            style={{
              minHeight: TOUCH_METRICS.MIN_TARGET_SIZE,
              padding: '0 22px',
              fontSize: 18,
              fontWeight: 700,
              borderRadius: 16,
            }}
          >
            문장 읽기
          </Button>
          <Button
            size="large"
            icon={<ClearOutlined />}
            disabled={!hasCards}
            onClick={onClearAll}
            style={{
              minHeight: TOUCH_METRICS.MIN_TARGET_SIZE,
              fontSize: 16,
              borderRadius: 16,
            }}
          >
            지우기
          </Button>
        </Space>
      </div>
    </Card>
  );
}
