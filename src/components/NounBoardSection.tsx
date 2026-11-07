import React from 'react';
import { Button, Col, Row, Space, Typography } from 'antd';
import { AacCard, NounCategory, NounCategoryId } from '../types/aac';
import { TOUCH_METRICS, WARM_PASTEL_COLORS } from '../utils/constants';
import { AacWordCard } from './AacWordCard';

const { Title, Text } = Typography;

/**
 * @description NounBoardSection 컴포넌트의 Props 인터페이스
 */
export interface NounBoardSectionProps {
  /** 명사 카테고리 목록 */
  readonly categories: readonly NounCategory[];
  /** 현재 활성화된 명사 카테고리 ID */
  readonly activeCategory: NounCategoryId;
  /** 현재 카테고리에 속한 명사 카드 배열 */
  readonly nounCards: readonly AacCard[];
  /** 현재 문장 조합 바에 선택된 카드 ID 집합 */
  readonly selectedCardIds: ReadonlySet<string>;
  /** 카테고리 탭 변경 콜백 */
  readonly onSelectCategory: (categoryId: NounCategoryId) => void;
  /** 명사 카드 탭 콜백 */
  readonly onSelectCard: (card: AacCard) => void;
  /** 커스텀 명사 카드 삭제 콜백 */
  readonly onDeleteCustomCard?: (cardId: string) => void;
}

/**
 * @description [HR-01, HR-03, HR-05] 좌측 '명사(무엇을?)' 전용 보드 섹션 컴포넌트
 * 상단에는 아이들이 쉽게 구분할 수 있는 파스텔 카테고리 탭을 배치하고,
 * 하단에는 해당 카테고리의 명사 어휘 카드(빵, 우유, 공 등)를 반응형 그리드로 나열합니다.
 * @param {NounBoardSectionProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 좌측 명사 보드 섹션 엘리먼트
 */
export function NounBoardSection({
  categories,
  activeCategory,
  nounCards,
  selectedCardIds,
  onSelectCategory,
  onSelectCard,
  onDeleteCustomCard,
}: NounBoardSectionProps): React.ReactElement {
  return (
    <section
      aria-label="명사 어휘 보드"
      style={{
        backgroundColor: WARM_PASTEL_COLORS.NOUN_SECTION_BG,
        borderRadius: TOUCH_METRICS.CARD_BORDER_RADIUS,
        padding: 16,
        border: `2px solid ${WARM_PASTEL_COLORS.NOUN_CARD_BORDER}`,
        height: '100%',
      }}
    >
      {/* 섹션 헤더 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0, color: WARM_PASTEL_COLORS.NOUN_ACCENT }}>
            1. 명사 고르기 (무엇을?)
          </Title>
          <Text style={{ fontSize: 14, color: WARM_PASTEL_COLORS.TEXT_SECONDARY }}>
            원하는 음식·장난감·사람 그림을 먼저 눌러보세요
          </Text>
        </div>
      </div>

      {/* 5대 명사 카테고리 알약(Pill) 탭 버튼 */}
      <Space wrap size={[8, 8]} style={{ marginBottom: 16, width: '100%' }}>
        {categories.map((cat) => {
          const isActive = cat.id === activeCategory;
          return (
            <Button
              key={cat.id}
              type={isActive ? 'primary' : 'default'}
              size="large"
              onClick={() => onSelectCategory(cat.id)}
              style={{
                minHeight: 48,
                borderRadius: 20,
                fontWeight: 700,
                fontSize: 16,
                backgroundColor: isActive ? cat.badgeColor : '#FFFFFF',
                borderColor: isActive ? cat.badgeColor : WARM_PASTEL_COLORS.NOUN_CARD_BORDER,
                color: isActive ? '#FFFFFF' : WARM_PASTEL_COLORS.TEXT_PRIMARY,
              }}
            >
              <span style={{ marginRight: 6, fontSize: 18 }}>{cat.iconEmoji}</span>
              {cat.label}
            </Button>
          );
        })}
      </Space>

      {/* 명사 카드 그리드 (갤럭시 탭 가로모드 기준 4열 배치) */}
      <Row gutter={[12, 12]}>
        {nounCards.map((card) => (
          <Col key={card.id} xs={12} sm={8} md={8} lg={6}>
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
