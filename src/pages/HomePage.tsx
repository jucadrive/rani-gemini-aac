import React from 'react';
import { Card, Col, Row, Tag, Typography } from 'antd';
import { SoundOutlined, SmileOutlined } from '@ant-design/icons';
import { APP_META, TOUCH_METRICS, WARM_PASTEL_COLORS } from '../utils/constants';

const { Title, Text } = Typography;

/**
 * @description AAC 의사소통 보드 메인 페이지 (Phase 1 아키텍처 검증용 레이아웃 골격)
 * 좌측 '명사(사물/음식)' 영역과 우측 '움직이는 동사(동작)' 영역이 분리된 갤럭시 탭 최적화 구조를 제공합니다.
 * @returns {React.ReactElement} 메인 홈 페이지 컴포넌트
 */
export function HomePage(): React.ReactElement {
  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: WARM_PASTEL_COLORS.BG_MAIN,
        padding: '16px 20px',
      }}
    >
      {/* 상단 헤더 및 문장 조합 바 프리뷰 영역 */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <SmileOutlined style={{ fontSize: 28, color: WARM_PASTEL_COLORS.PRIMARY_BRAND }} />
          <Title level={3} style={{ margin: 0, color: WARM_PASTEL_COLORS.TEXT_PRIMARY }}>
            {APP_META.TITLE}
          </Title>
          <Tag color="orange" style={{ borderRadius: 12, fontWeight: 600 }}>
            {APP_META.SUBTITLE}
          </Tag>
        </div>
      </header>

      {/* 상단 문장 조합 바 (Sentence Strip) */}
      <Card
        aria-label="문장 조합 바"
        style={{
          minHeight: TOUCH_METRICS.SENTENCE_BAR_HEIGHT,
          backgroundColor: WARM_PASTEL_COLORS.BG_SENTENCE_BAR,
          borderRadius: TOUCH_METRICS.CARD_BORDER_RADIUS,
          border: `2px solid ${WARM_PASTEL_COLORS.NOUN_CARD_BORDER}`,
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 18, color: WARM_PASTEL_COLORS.TEXT_SECONDARY }}>
            명사 카드(예: 빵)와 움직이는 동사 카드(예: 주세요)를 차례로 눌러 문장을 완성해 보세요!
          </Text>
          <Tag
            icon={<SoundOutlined />}
            color="volcano"
            style={{ padding: '8px 16px', fontSize: 16, borderRadius: 16 }}
          >
            음성 출력 준비 완료
          </Tag>
        </div>
      </Card>

      {/* 중단: 좌측 명사 칸 vs 우측 동사(모션) 칸 분리 레이아웃 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={14} lg={15}>
          <section
            aria-label="명사 어휘 보드"
            style={{
              backgroundColor: WARM_PASTEL_COLORS.NOUN_SECTION_BG,
              borderRadius: TOUCH_METRICS.CARD_BORDER_RADIUS,
              padding: 16,
              border: `2px solid ${WARM_PASTEL_COLORS.NOUN_CARD_BORDER}`,
              minHeight: 420,
            }}
          >
            <Title level={4} style={{ marginTop: 0, color: WARM_PASTEL_COLORS.NOUN_ACCENT }}>
              명사 보드 (무엇을?)
            </Title>
            <Text>카테고리별 사물·음식·장난감 어휘 카드가 이곳에 나열됩니다.</Text>
          </section>
        </Col>

        <Col xs={24} md={10} lg={9}>
          <section
            aria-label="동사 동작 보드"
            style={{
              backgroundColor: WARM_PASTEL_COLORS.VERB_SECTION_BG,
              borderRadius: TOUCH_METRICS.CARD_BORDER_RADIUS,
              padding: 16,
              border: `2px solid ${WARM_PASTEL_COLORS.VERB_CARD_BORDER}`,
              minHeight: 420,
            }}
          >
            <Title level={4} style={{ marginTop: 0, color: WARM_PASTEL_COLORS.VERB_ACCENT }}>
              동사/동작 보드 (어떻게?)
            </Title>
            <Text>움직이는 GIF/모션 동작 카드(주세요, 먹어요 등)가 이곳에 고정됩니다.</Text>
          </section>
        </Col>
      </Row>
    </main>
  );
}

