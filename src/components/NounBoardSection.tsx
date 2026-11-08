import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Space, Tag, Typography } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { AacCard, NounCategory, NounCategoryId, NounDisplayLimit } from '../types/aac';
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
  /** 현재 카테고리에 속한 전체 명사 카드 배열 */
  readonly nounCards: readonly AacCard[];
  /** 한 화면에 제시할 최대 명사 개수 (세팅에서 2/4/6/8/전체 조절) */
  readonly displayLimit: NounDisplayLimit;
  /** 현재 문장 조합 바에 선택된 카드 ID 집합 */
  readonly selectedCardIds: ReadonlySet<string>;
  /** 현재 TTS가 발화 중인지 여부 */
  readonly isSpeaking?: boolean;
  /** 카테고리 탭 변경 콜백 */
  readonly onSelectCategory: (categoryId: NounCategoryId) => void;
  /** 명사 카드 탭 콜백 */
  readonly onSelectCard: (card: AacCard) => void;
  /** 커스텀 명사 카드 삭제 콜백 */
  readonly onDeleteCustomCard?: (cardId: string) => void;
}

/**
 * @description [HR-01, HR-03, HR-05] 1단계 '명사(무엇을?)' 선택 전용 보드 컴포넌트
 * - 자폐 아동의 시각적 과부하를 줄이기 위해 세팅된 개수(displayLimit)만큼만 큼직하게 제시합니다.
 * - 명사를 선택하면 선택한 명사만 활성화되고 나머지 명사는 배경으로 흐려집니다(전경·배경 분리).
 * @param {NounBoardSectionProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 명사 보드 섹션 엘리먼트
 */
export function NounBoardSection({
  categories,
  activeCategory,
  nounCards,
  displayLimit,
  selectedCardIds,
  isSpeaking = false,
  onSelectCategory,
  onSelectCard,
  onDeleteCustomCard,
}: NounBoardSectionProps): React.ReactElement {
  const [pageIndex, setPageIndex] = useState<number>(0);

  // 카테고리나 표시 개수 설정이 바뀌면 첫 페이지로 리셋
  useEffect(() => {
    setPageIndex(0);
  }, [activeCategory, displayLimit]);

  const totalPages = Math.max(1, Math.ceil(nounCards.length / displayLimit));
  const safePage = Math.min(pageIndex, totalPages - 1);
  const visibleNouns = nounCards.slice(
    safePage * displayLimit,
    safePage * displayLimit + displayLimit
  );

  const hasSelectedNoun = nounCards.some((c) => selectedCardIds.has(c.id));
  // 표시 개수가 2개면 2열(12), 4개면 4열(6) 등으로 카드 크기를 큼직하게 자동 조절
  const colSpanLg = displayLimit === 2 ? 12 : displayLimit === 4 ? 6 : 6;

  return (
    <section
      aria-label="명사 어휘 보드"
      style={{
        backgroundColor: WARM_PASTEL_COLORS.NOUN_SECTION_BG,
        borderRadius: TOUCH_METRICS.CARD_BORDER_RADIUS,
        padding: 18,
        border: `2px solid ${WARM_PASTEL_COLORS.NOUN_CARD_BORDER}`,
        height: '100%',
      }}
    >
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
            1단계: 명사 먼저 고르기 (무엇을?)
          </Title>
          <Text style={{ fontSize: 14, color: WARM_PASTEL_COLORS.TEXT_SECONDARY }}>
            원하는 그림 1개를 누르면 선택한 그림만 움직이고 동사 선택 화면이 열려요!
          </Text>
        </div>

        {/* 페이지네이션 컨트롤 (명사 개수 제한 시 다음 카드로 넘기기) */}
        {totalPages > 1 && (
          <Space size="small">
            <Button
              icon={<LeftOutlined />}
              disabled={safePage === 0}
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            >
              이전
            </Button>
            <Tag color="orange" style={{ fontSize: 14, fontWeight: 700, padding: '4px 10px' }}>
              {safePage + 1} / {totalPages} 페이지 (한 화면 {displayLimit}개)
            </Tag>
            <Button
              icon={<RightOutlined />}
              disabled={safePage >= totalPages - 1}
              onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
            >
              다음 그림
            </Button>
          </Space>
        )}
      </div>

      {/* 5대 명사 카테고리 알약 탭 */}
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

      {/* 제한된 개수(displayLimit)만큼만 보여주는 명사 카드 그리드 */}
      <Row gutter={[16, 16]}>
        {visibleNouns.map((card) => {
          const isSelected = selectedCardIds.has(card.id);
          return (
            <Col key={card.id} xs={12} sm={displayLimit === 2 ? 12 : 8} lg={colSpanLg}>
              <AacWordCard
                card={card}
                isSelected={isSelected}
                isDimmed={hasSelectedNoun && !isSelected}
                isSpeaking={isSpeaking}
                onSelect={onSelectCard}
                onDeleteCustom={onDeleteCustomCard}
              />
            </Col>
          );
        })}
      </Row>
    </section>
  );
}
