import React from 'react';
import { Button, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { AacCard } from '../types/aac';
import { TOUCH_METRICS, WARM_PASTEL_COLORS } from '../utils/constants';
import { AnimatedVerbGraphic } from './AnimatedVerbGraphic';

const { Text } = Typography;

/**
 * @description AacWordCard 컴포넌트의 Props 인터페이스
 */
export interface AacWordCardProps {
  /** 렌더링할 AAC 명사 또는 동사 카드 데이터 */
  readonly card: AacCard;
  /** 현재 문장 조합 바에 선택되어 있는지 여부 */
  readonly isSelected: boolean;
  /** 카드를 탭했을 때 실행할 콜백 */
  readonly onSelect: (card: AacCard) => void;
  /** 커스텀 카드일 경우 삭제 버튼 클릭 콜백 (선택) */
  readonly onDeleteCustom?: (cardId: string) => void;
}

/**
 * @description [HR-01, HR-03, HR-05] 갤럭시 탭 S4 터치에 최적화된 개별 AAC 어휘/동작 카드 컴포넌트
 * - 명사(noun)는 따뜻한 크림/피치 테두리와 선명한 사물 일러스트를 표시합니다.
 * - 동사(verb)는 세이지 그린 테두리와 움직이는 GIF/모션 그래픽(AnimatedVerbGraphic)을 표시합니다.
 * @param {AacWordCardProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 터치 가능한 AAC 카드 엘리먼트
 */
export function AacWordCard({
  card,
  isSelected,
  onSelect,
  onDeleteCustom,
}: AacWordCardProps): React.ReactElement {
  const isVerb = card.partOfSpeech === 'verb';
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
      onClick={() => onSelect(card)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(card);
        }
      }}
      style={{
        position: 'relative',
        minHeight: TOUCH_METRICS.CARD_MIN_HEIGHT,
        backgroundColor: isSelected ? '#FFF9F2' : '#FFFFFF',
        borderRadius: TOUCH_METRICS.CARD_BORDER_RADIUS,
        border: `${isSelected ? 3 : 2}px solid ${borderColor}`,
        boxShadow: isSelected
          ? '0 8px 18px rgba(255, 142, 110, 0.25)'
          : '0 4px 10px rgba(61, 53, 46, 0.05)',
        padding: '12px 8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
        transform: isSelected ? 'scale(1.03)' : 'scale(1)',
      }}
    >
      {/* 치료사가 직접 추가한 커스텀 카드 삭제 버튼 */}
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

      {/* 동사일 경우 움직이는 GIF 모션 배지 표시 */}
      {isVerb && (
        <span
          style={{
            position: 'absolute',
            top: 6,
            left: 8,
            fontSize: 11,
            fontWeight: 700,
            padding: '2px 7px',
            borderRadius: 10,
            backgroundColor: badgeBgColor,
            color: badgeTextColor,
          }}
        >
          GIF 동작
        </span>
      )}

      {/* 중앙 시각 심볼: 동사는 움직이는 GIF/모션 그래픽, 명사는 사물 이미지/이모지 */}
      <div style={{ minHeight: 68, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isVerb ? (
          <AnimatedVerbGraphic
            emoji={card.emoji}
            label={card.label}
            motionType={card.motionType}
            customImageUrl={card.customImageUrl}
            size={54}
          />
        ) : card.customImageUrl ? (
          <img
            src={card.customImageUrl}
            alt={card.label}
            style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 14 }}
          />
        ) : (
          <span style={{ fontSize: 48, lineHeight: 1 }}>{card.emoji}</span>
        )}
      </div>

      {/* 하단 한글 어휘 라벨 */}
      <Text
        strong
        style={{
          fontSize: 19,
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

