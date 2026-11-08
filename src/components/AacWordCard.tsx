import React from 'react';
import { Button, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { AacCard } from '../types/aac';
import { TOUCH_METRICS, WARM_PASTEL_COLORS } from '../utils/constants';
import { AnimatedVerbGraphic } from './AnimatedVerbGraphic';
import '../assets/verbMotions.css';

const { Text } = Typography;

/**
 * @description AacWordCard 컴포넌트의 Props 인터페이스
 */
export interface AacWordCardProps {
  /** 렌더링할 AAC 명사 또는 동사 카드 데이터 */
  readonly card: AacCard;
  /** 현재 문장 조합 바에 선택되어 있는지 여부 (선택된 카드만 시각적으로 활성화!) */
  readonly isSelected: boolean;
  /**
   * 전경·배경 분리(Figure-Ground Separation)를 위해,
   * 다른 카드가 선택되었을 때 선택되지 않은 이 카드를 배경으로 흐리게(Dim) 처리할지 여부
   */
  readonly isDimmed?: boolean;
  /** 현재 TTS가 단어 또는 완성된 전체 문장을 읽고 있는지 여부 */
  readonly isSpeaking?: boolean;
  /** 카드를 탭했을 때 실행할 콜백 */
  readonly onSelect: (card: AacCard) => void;
  /** 커스텀 카드일 경우 삭제 버튼 클릭 콜백 (선택) */
  readonly onDeleteCustom?: (cardId: string) => void;
}

/**
 * @description [HR-01, HR-03, HR-05] 자폐성 장애 아동의 전경·배경 분리를 돕는 AAC 어휘/동작 카드 컴포넌트
 * - 선택된 카드(isSelected === true)만 선명하게 확대되며 애니메이션(명사 모션 / 동사 실제 동작)이 작동합니다.
 * - 선택되지 않은 카드들은 정지 상태로 차분히 대기하며, 다른 카드가 선택되면 배경으로 흐려집니다(isDimmed).
 * @param {AacWordCardProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 터치 가능한 AAC 카드 엘리먼트
 */
export function AacWordCard({
  card,
  isSelected,
  isDimmed = false,
  isSpeaking = false,
  onSelect,
  onDeleteCustom,
}: AacWordCardProps): React.ReactElement {
  const isVerb = card.partOfSpeech === 'verb';
  const isNounAnimating = !isVerb && isSelected;
  // 동사도 선택되었을 때(또는 문장 발화 중일 때)만 실제 동작 애니메이션 활성화!
  const isVerbAnimating = isVerb && isSelected;

  const borderColor = isSelected
    ? WARM_PASTEL_COLORS.PRIMARY_BRAND
    : isVerb
      ? WARM_PASTEL_COLORS.VERB_CARD_BORDER
      : WARM_PASTEL_COLORS.NOUN_CARD_BORDER;

  const badgeBgColor = isVerb ? '#E3F6EC' : '#FFF3E0';
  const badgeTextColor = isVerb ? WARM_PASTEL_COLORS.VERB_ACCENT : WARM_PASTEL_COLORS.NOUN_ACCENT;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${card.label} 카드`}
      aria-pressed={isSelected}
      data-dimmed={isDimmed ? 'true' : 'false'}
      onClick={() => onSelect(card)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(card);
        }
      }}
      style={{
        position: 'relative',
        minHeight: TOUCH_METRICS.CARD_MIN_HEIGHT + 8,
        backgroundColor: isSelected ? '#FFF9F2' : '#FFFFFF',
        borderRadius: TOUCH_METRICS.CARD_BORDER_RADIUS,
        border: `${isSelected ? 4 : 2}px solid ${borderColor}`,
        boxShadow: isSelected
          ? '0 10px 24px rgba(255, 142, 110, 0.32)'
          : '0 4px 10px rgba(61, 53, 46, 0.05)',
        padding: '14px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        cursor: 'pointer',
        opacity: isDimmed ? 0.36 : 1,
        filter: isDimmed ? 'grayscale(30%)' : 'none',
        transition: 'all 0.2s ease',
        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      {card.isCustom && onDeleteCustom && (
        <Button
          type="text"
          size="small"
          danger
          aria-label={`${card.label} 커스텀 카드 삭제`}
          icon={<DeleteOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onDeleteCustom(card.id);
          }}
          style={{ position: 'absolute', top: 4, right: 4, zIndex: 2 }}
        />
      )}

      {isSelected && (
        <span
          style={{
            position: 'absolute',
            top: 6,
            left: 8,
            fontSize: 11,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 10,
            backgroundColor: badgeBgColor,
            color: badgeTextColor,
          }}
        >
          {isSpeaking ? '🔊 발화 중' : '✨ 선택됨'}
        </span>
      )}

      {/* 중앙 시각 영역: 선택된 카드만 모션이 활성화되어 아동의 주의 집중 유도 */}
      <div style={{ minHeight: 74, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isVerb ? (
          <AnimatedVerbGraphic
            emoji={card.emoji}
            label={card.label}
            motionType={card.motionType}
            customImageUrl={card.customImageUrl}
            size={68}
            isActive={isVerbAnimating}
          />
        ) : card.customImageUrl ? (
          <img
            src={card.customImageUrl}
            alt={card.label}
            className={isNounAnimating ? 'noun-active-motion' : undefined}
            style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 14 }}
          />
        ) : (
          <span
            data-testid={`noun-symbol-${card.id}`}
            className={isNounAnimating ? 'noun-active-motion' : undefined}
            style={{ fontSize: 52, lineHeight: 1 }}
          >
            {card.emoji}
          </span>
        )}
      </div>

      <Text
        strong
        style={{
          fontSize: 20,
          color: WARM_PASTEL_COLORS.TEXT_PRIMARY,
          textAlign: 'center',
          wordBreak: 'keep-all',
        }}
      >
        {card.label}
      </Text>
    </div>
  );
}
