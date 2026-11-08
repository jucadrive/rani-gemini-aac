import React from 'react';
import { Button, Col, Empty, Row, Tag, Typography } from 'antd';
import { DeleteOutlined, SoundFilled, StarFilled } from '@ant-design/icons';
import { FavoriteSentence } from '../types/aac';
import { TOUCH_METRICS, WARM_PASTEL_COLORS } from '../utils/constants';
import { AnimatedVerbGraphic } from './AnimatedVerbGraphic';
import '../assets/verbMotions.css';

const { Title, Text } = Typography;

/**
 * @description FavoriteChapterSection 컴포넌트의 Props 인터페이스
 */
export interface FavoriteChapterSectionProps {
  /** 저장된 즐겨찾기 문장 배열 */
  readonly favorites: readonly FavoriteSentence[];
  /** 현재 활성화된(방금 선택된) 문장 텍스트 */
  readonly activeSentenceText: string;
  /** 즐겨찾기 문장 카드를 탭했을 때 실행할 콜백 */
  readonly onSelectFavorite: (favorite: FavoriteSentence) => void;
  /** 즐겨찾기 문장 삭제 콜백 */
  readonly onRemoveFavorite: (favoriteId: string) => void;
}

/**
 * @description [HR-01, HR-03, HR-05] 자주 쓰는 표현을 모아둔 '⭐ 즐겨찾기 챕터' 전용 보드 컴포넌트
 * 치료 회기에서 반복 훈련하는 핵심 문장('빵 주세요', '물 마셔요' 등)을 한눈에 보여주고,
 * 탭 시 선택된 표현의 명사와 동사를 동시에 시각적으로 활성화하며 음성을 출력합니다.
 * @param {FavoriteChapterSectionProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 즐겨찾기 챕터 섹션 엘리먼트
 */
export function FavoriteChapterSection({
  favorites,
  activeSentenceText,
  onSelectFavorite,
  onRemoveFavorite,
}: FavoriteChapterSectionProps): React.ReactElement {
  const hasAnyActive = activeSentenceText.trim().length > 0;

  return (
    <section
      aria-label="즐겨찾기 표현 보드"
      style={{
        backgroundColor: '#FFF9EB',
        borderRadius: TOUCH_METRICS.CARD_BORDER_RADIUS,
        padding: 18,
        border: '2px solid #FFD166',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0, color: '#D97706' }}>
            <StarFilled style={{ marginRight: 8, color: '#F59E0B' }} />
            즐겨찾기 챕터 (자주 쓰는 표현)
          </Title>
          <Text style={{ fontSize: 14, color: WARM_PASTEL_COLORS.TEXT_SECONDARY }}>
            저장해 둔 문장 카드를 누르면 명사와 동사가 함께 움직이며 문장을 읽어줘요!
          </Text>
        </div>
        <Tag color="gold" style={{ fontSize: 14, fontWeight: 700, padding: '4px 12px', borderRadius: 12 }}>
          저장된 표현 {favorites.length}개
        </Tag>
      </div>

      {favorites.length === 0 ? (
        <Empty description="아직 저장된 즐겨찾기 표현이 없습니다. 문장을 완성한 뒤 상단의 [⭐ 표현 저장]을 눌러보세요!" />
      ) : (
        <Row gutter={[16, 16]}>
          {favorites.map((fav) => {
            const isSelected = activeSentenceText === fav.sentenceText;
            const isDimmed = hasAnyActive && !isSelected;

            return (
              <Col key={fav.id} xs={24} sm={12} md={8}>
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`즐겨찾기 표현 ${fav.sentenceText}`}
                  onClick={() => onSelectFavorite(fav)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') onSelectFavorite(fav);
                  }}
                  style={{
                    position: 'relative',
                    backgroundColor: '#FFFFFF',
                    borderRadius: TOUCH_METRICS.CARD_BORDER_RADIUS,
                    border: `${isSelected ? 3 : 2}px solid ${isSelected ? '#F59E0B' : '#FDE68A'}`,
                    padding: '16px 14px',
                    cursor: 'pointer',
                    opacity: isDimmed ? 0.42 : 1,
                    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected
                      ? '0 8px 20px rgba(245, 158, 11, 0.22)'
                      : '0 4px 10px rgba(0, 0, 0, 0.04)',
                  }}
                >
                  <Button
                    type="text"
                    size="small"
                    danger
                    aria-label={`${fav.sentenceText} 즐겨찾기 삭제`}
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(fav.id);
                    }}
                    style={{ position: 'absolute', top: 8, right: 8 }}
                  />

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 74 }}>
                    {fav.cards.map((card, idx) => (
                      <React.Fragment key={`${fav.id}-${card.id}-${idx}`}>
                        {idx > 0 && <Text strong style={{ fontSize: 20, color: '#F59E0B' }}>+</Text>}
                        {card.partOfSpeech === 'verb' ? (
                          <AnimatedVerbGraphic
                            emoji={card.emoji}
                            label={card.label}
                            motionType={card.motionType}
                            customImageUrl={card.customImageUrl}
                            size={54}
                            isActive={isSelected}
                          />
                        ) : card.customImageUrl ? (
                          <img
                            src={card.customImageUrl}
                            alt={card.label}
                            className={isSelected ? 'noun-active-motion' : undefined}
                            style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 12 }}
                          />
                        ) : (
                          <span
                            className={isSelected ? 'noun-active-motion' : undefined}
                            style={{ fontSize: 42, lineHeight: 1 }}
                          >
                            {card.emoji}
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <div style={{ textAlign: 'center', marginTop: 10 }}>
                    <Tag color="orange" icon={<SoundFilled />} style={{ fontSize: 18, fontWeight: 700, padding: '4px 14px', borderRadius: 14 }}>
                      {fav.sentenceText}
                    </Tag>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      )}
    </section>
  );
}

