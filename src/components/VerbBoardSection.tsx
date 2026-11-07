import React from 'react';
import { Col, Row, Tag, Typography } from 'antd';
import { AacCard } from '../types/aac';
import { TOUCH_METRICS, WARM_PASTEL_COLORS } from '../utils/constants';
import { AacWordCard } from './AacWordCard';

const { Title, Text } = Typography;

/**
 * @description VerbBoardSection 컴포넌트의 Props 인터페이스
 */
export interface VerbBoardSectionProps {
  /** 우측 보드에 고정 표시할 움직이는 동사 카드 배열 */
  readonly verbCards: readonly AacCard[];
  /** 현재 문장 조합 바에 선택된 카드 ID 집합 */
  readonly selectedCardIds: ReadonlySet<string>;
  /** 동사 카드 탭 콜백 */
  readonly onSelectCard: (card: AacCard) => void;
  /** 커스텀 동사 카드 삭제 콜백 */
  readonly onDeleteCustomCard?: (cardId: string) => void;
}

/**
 * @description [HR-01, HR-03, HR-05] 우측 '동사/동작(어떻게?)' 고정 보드 섹션 컴포넌트
 * 좌측 명사 카테고리가 바뀌더라도 항상 우측에 고정되어,
 * 아이가 '빵'을 누른 직후 곧바로 움직이는 '주세요', '먹어요' 등을 탭해 문장을 완성할 수 있게 합니다.
 * @param {VerbBoardSectionProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 우측 동사 보드 섹션 엘리먼트
 */
export function VerbBoardSection({
  verbCards,
  selectedCardIds,
  onSelectCard,
  onDeleteCustomCard,
}: VerbBoardSectionProps): React.ReactElement {
  return (
    <section
      aria-label="동사 동작 보드"
      style={{
        backgroundColor: WARM_PASTEL_COLORS.VERB_SECTION_BG,
        borderRadius: TOUCH_METRICS.CARD_BORDER_RADIUS,
        padding: 16,
        border: `2px solid ${WARM_PASTEL_COLORS.VERB_CARD_BORDER}`,
        height: '100%',
      }}
    >
      {/* 섹션 헤더 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0, color: WARM_PASTEL_COLORS.VERB_ACCENT }}>
            2. 움직이는 동사 고르기 (어떻게?)
          </Title>
          <Text style={{ fontSize: 14, color: WARM_PASTEL_COLORS.TEXT_SECONDARY }}>
            움직이는 동작 카드를 누르면 문장이 완성되어 읽어줘요!
          </Text>
        </div>
        <Tag color="green" style={{ borderRadius: 12, fontWeight: 700, padding: '4px 10px' }}>
          ✨ GIF 모션 작동 중
        </Tag>
      </div>

      {/* 움직이는 동사 카드 3열 그리드 */}
      <Row gutter={[12, 12]}>
        {verbCards.map((card) => (
          <Col key={card.id} xs={12} sm={8} md={8} lg={8}>
            <AacWordCard
              card={card}
              isSelected={selectedCardIds.has(card.id)}
              onSelect={onSelectCard}
              onDeleteCustom={onDeleteCustomCard}
            />
          </Col>
        ))}
      </Row>
    </section>
  );
}
