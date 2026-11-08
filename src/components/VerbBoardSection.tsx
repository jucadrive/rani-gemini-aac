import React, { useState } from 'react';
import { Button, Col, Row, Space, Tag, Typography } from 'antd';
import { ArrowLeftOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { AacCard } from '../types/aac';
import { TOUCH_METRICS, WARM_PASTEL_COLORS } from '../utils/constants';
import { AacWordCard } from './AacWordCard';

const { Title, Text } = Typography;

/**
 * @description VerbBoardSection 컴포넌트의 Props 인터페이스
 */
export interface VerbBoardSectionProps {
  /** 표시할 전체 고빈도 동사 카드 배열 (18종+) */
  readonly verbCards: readonly AacCard[];
  /** 현재 문장 조합 바에 선택된 카드 ID 집합 */
  readonly selectedCardIds: ReadonlySet<string>;
  /** 현재 TTS가 발화 중인지 여부 */
  readonly isSpeaking?: boolean;
  /** 동사 카드 탭 콜백 */
  readonly onSelectCard: (card: AacCard) => void;
  /** 1단계(명사 다시 고르기)로 돌아가는 콜백 */
  readonly onBackToNounStep?: () => void;
  /** 커스텀 동사 카드 삭제 콜백 */
  readonly onDeleteCustomCard?: (cardId: string) => void;
}

/** 한 화면에 표시할 동사 카드 개수 (3x3 그리드 = 9개씩 깔끔하게 제시) */
const VERBS_PER_PAGE = 9;

/**
 * @description [HR-01, HR-03, HR-05] 2단계 '고빈도 동사(어떻게?)' 선택 보드 섹션 컴포넌트
 * - 타요, 꺼내요, 뜯어요, 가요, 열어요, 먹어요, 주세요 등 18종의 고빈도 동사를 페이지별로 깔끔히 제시합니다.
 * - 아동이 동사를 탭하면 선택한 동사만 실제 동작 애니메이션이 시각적으로 활성화됩니다!
 * @param {VerbBoardSectionProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 동사 보드 섹션 엘리먼트
 */
export function VerbBoardSection({
  verbCards,
  selectedCardIds,
  isSpeaking = false,
  onSelectCard,
  onBackToNounStep,
  onDeleteCustomCard,
}: VerbBoardSectionProps): React.ReactElement {
  const [pageIndex, setPageIndex] = useState<number>(0);

  const totalPages = Math.max(1, Math.ceil(verbCards.length / VERBS_PER_PAGE));
  const safePage = Math.min(pageIndex, totalPages - 1);
  const visibleVerbs = verbCards.slice(
    safePage * VERBS_PER_PAGE,
    safePage * VERBS_PER_PAGE + VERBS_PER_PAGE
  );

  const hasSelectedVerb = verbCards.some((c) => selectedCardIds.has(c.id));

  return (
    <section
      aria-label="동사 동작 보드"
      style={{
        backgroundColor: WARM_PASTEL_COLORS.VERB_SECTION_BG,
        borderRadius: TOUCH_METRICS.CARD_BORDER_RADIUS,
        padding: 18,
        border: `3px solid ${WARM_PASTEL_COLORS.VERB_ACCENT}`,
        boxShadow: '0 8px 24px rgba(46, 158, 107, 0.12)',
        height: '100%',
      }}
    >
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
            2단계: 고빈도 동사 고르기 (어떻게 할까요?)
          </Title>
          <Text style={{ fontSize: 14, color: WARM_PASTEL_COLORS.TEXT_SECONDARY }}>
            주세요·먹어요·타요·꺼내요·뜯어요·가요·열어요 등 동작을 선택해 보세요!
          </Text>
        </div>

        <Space wrap size="small">
          {onBackToNounStep && (
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={onBackToNounStep}
              style={{ borderRadius: 14, fontWeight: 600 }}
            >
              명사 다시 고르기
            </Button>
          )}
          {totalPages > 1 && (
            <>
              <Button
                icon={<LeftOutlined />}
                disabled={safePage === 0}
                onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              >
                이전 동사
              </Button>
              <Tag color="green" style={{ fontSize: 13, fontWeight: 700, padding: '4px 10px', borderRadius: 10 }}>
                동사 {safePage + 1} / {totalPages}
              </Tag>
              <Button
                icon={<RightOutlined />}
                disabled={safePage >= totalPages - 1}
                onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
              >
                다음 동사 ({verbCards.length - (safePage + 1) * VERBS_PER_PAGE}개 더보기)
              </Button>
            </>
          )}
        </Space>
      </div>

      {/* 고빈도 동사 카드 3열 그리드 */}
      <Row gutter={[14, 14]}>
        {visibleVerbs.map((card) => {
          const isSelected = selectedCardIds.has(card.id);
          return (
            <Col key={card.id} xs={12} sm={8} md={8} lg={8}>
              <AacWordCard
                card={card}
                isSelected={isSelected}
                isDimmed={hasSelectedVerb && !isSelected}
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
