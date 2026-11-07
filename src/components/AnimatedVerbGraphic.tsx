import React from 'react';
import { VerbMotionType } from '../types/aac';
import '../assets/verbMotions.css';

/**
 * @description AnimatedVerbGraphic 컴포넌트의 Props 인터페이스
 */
export interface AnimatedVerbGraphicProps {
  /** 카드 대표 이모지 심볼 */
  readonly emoji: string;
  /** 카드 한글 라벨 (대체 텍스트용) */
  readonly label: string;
  /** 동사 모션 타입 (미지정 시 기본 begging 적용) */
  readonly motionType?: VerbMotionType;
  /** 치료사가 등록한 커스텀 GIF/이미지 URL (선택) */
  readonly customImageUrl?: string;
  /** 그래픽 크기 (px, 기본값 56) */
  readonly size?: number;
}

/**
 * 모션 타입별 보조 동작 힌트 아이콘 매핑
 */
const MOTION_SUB_BADGE: Record<VerbMotionType, string> = {
  begging: '✨',
  more: '➕',
  eating: '😋',
  drinking: '💧',
  playing: '🎵',
  opening: '🔓',
  helping: '💛',
  refusing: '✋',
  greeting: '😊',
};

/**
 * @description [HR-01, HR-03, HR-05] 동사(동작) 카드를 움직이는 GIF + 루프 모션으로 렌더링하는 순수 컴포넌트
 * 생성된 실제 .gif 애니메이션 배경 링과 부드러운 60fps 모션 심볼을 결합하여
 * 아동이 동사의 움직임('주세요', '먹어요', '마셔요' 등)을 직관적으로 인지하도록 돕습니다.
 * @param {AnimatedVerbGraphicProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 움직이는 동사 그래픽 엘리먼트
 */
export function AnimatedVerbGraphic({
  emoji,
  label,
  motionType = 'begging',
  customImageUrl,
  size = 56,
}: AnimatedVerbGraphicProps): React.ReactElement {
  const gifSrc = customImageUrl || `/gifs/${motionType}.gif`;
  const motionClass = `verb-motion-${motionType}`;
  const subBadge = MOTION_SUB_BADGE[motionType];

  return (
    <div
      aria-label={`${label} 동작 애니메이션`}
      style={{
        position: 'relative',
        width: size + 18,
        height: size + 18,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* 실제 멀티프레임 루프 .gif 배경 오라(Aura) 레이어 */}
      <img
        src={gifSrc}
        alt={`${label} 움직이는 GIF`}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          objectFit: 'cover',
          opacity: customImageUrl ? 1 : 0.38,
          pointerEvents: 'none',
        }}
      />

      {/* 커스텀 GIF가 없을 때 고해상도 벡터/심볼 모션을 전면에 표시 */}
      {!customImageUrl && (
        <div
          className={motionClass}
          style={{
            position: 'relative',
            zIndex: 1,
            fontSize: size * 0.72,
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: 'drop-shadow(0 3px 6px rgba(46, 158, 107, 0.18))',
          }}
        >
          <span>{emoji}</span>
          <span
            style={{
              position: 'absolute',
              top: -6,
              right: -10,
              fontSize: size * 0.3,
            }}
          >
            {subBadge}
          </span>
        </div>
      )}
    </div>
  );
}

