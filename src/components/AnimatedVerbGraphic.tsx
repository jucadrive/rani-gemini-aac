import React from 'react';
import { VerbMotionType } from '../types/aac';
import {
  BeggingScene,
  DrinkingScene,
  EatingScene,
  MoreScene,
  PlayingScene,
} from './VerbActionScenesA';
import {
  DeliciousScene,
  DontTouchScene,
  FunScene,
  GreetingScene,
  HelpingScene,
  LikingScene,
  OpeningScene,
  RefusingScene,
  TurningOnScene,
} from './VerbActionScenesB';
import {
  GoingScene,
  PuttingInScene,
  RidingScene,
  TakingOutScene,
  TearingScene,
  WashingScene,
  WatchingScene,
  WearingScene,
} from './VerbActionScenesC';
import '../assets/verbMotions.css';

/**
 * @description AnimatedVerbGraphic 컴포넌트의 Props 인터페이스
 */
export interface AnimatedVerbGraphicProps {
  /** 카드 대표 이모지 심볼 (폴백용) */
  readonly emoji: string;
  /** 카드 한글 라벨 (대체 텍스트용) */
  readonly label: string;
  /** 동사 모션 타입 (미지정 시 기본 begging 적용) */
  readonly motionType?: VerbMotionType;
  /** 치료사가 등록한 커스텀 GIF/이미지 URL (선택) */
  readonly customImageUrl?: string;
  /** 그래픽 크기 (px, 기본값 68) */
  readonly size?: number;
  /** 현재 이 동사가 선택(활성화)되었는지 여부 */
  readonly isActive?: boolean;
}

/**
 * @description [HR-01, HR-03, HR-05] 17종의 고빈도 동사(주세요, 먹어요, 타요, 꺼내요, 뜯어요, 가요, 열어요 등)를
 * 실제 행동 과정 일러스트로 렌더링하며, 선택된 동사(isActive === true)만 애니메이션을 동작시키는 컴포넌트
 * @param {AnimatedVerbGraphicProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 리얼 동사 동작 그래픽 엘리먼트
 */
export function AnimatedVerbGraphic({
  label,
  motionType = 'begging',
  customImageUrl,
  size = 68,
  isActive = true,
}: AnimatedVerbGraphicProps): React.ReactElement {
  if (customImageUrl) {
    return (
      <div
        aria-label={`${label} 동작 애니메이션`}
        style={{
          width: size,
          height: size,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isActive ? 1 : 0.85,
        }}
      >
        <img
          src={customImageUrl}
          alt={`${label} 움직이는 GIF`}
          style={{ width: '100%', height: '100%', borderRadius: 16, objectFit: 'cover' }}
        />
      </div>
    );
  }

  /** motionType에 따른 17종의 리얼 동작 장면(Multi-part Action Scene) 매핑 */
  const renderScene = (): React.ReactElement => {
    switch (motionType) {
      case 'begging':
        return <BeggingScene size={size} />;
      case 'more':
        return <MoreScene size={size} />;
      case 'eating':
        return <EatingScene size={size} />;
      case 'drinking':
        return <DrinkingScene size={size} />;
      case 'playing':
        return <PlayingScene size={size} />;
      case 'opening':
        return <OpeningScene size={size} />;
      case 'helping':
        return <HelpingScene size={size} />;
      case 'refusing':
        return <RefusingScene size={size} />;
      case 'greeting':
        return <GreetingScene size={size} />;
      case 'riding':
        return <RidingScene size={size} />;
      case 'takingOut':
        return <TakingOutScene size={size} />;
      case 'tearing':
        return <TearingScene size={size} />;
      case 'going':
        return <GoingScene size={size} />;
      case 'puttingIn':
        return <PuttingInScene size={size} />;
      case 'wearing':
        return <WearingScene size={size} />;
      case 'washing':
        return <WashingScene size={size} />;
      case 'watching':
        return <WatchingScene size={size} />;
      case 'turningOn':
        return <TurningOnScene size={size} />;
      case 'dontTouch':
        return <DontTouchScene size={size} />;
      case 'liking':
        return <LikingScene size={size} />;
      case 'delicious':
        return <DeliciousScene size={size} />;
      case 'fun':
        return <FunScene size={size} />;
      default:
        return <BeggingScene size={size} />;
    }
  };

  return (
    <div
      aria-label={`${label} 동작 애니메이션`}
      data-active={isActive ? 'true' : 'false'}
      className={isActive ? 'verb-graphic-active' : 'verb-graphic-paused'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.2s ease',
        transform: isActive ? 'scale(1.08)' : 'scale(1)',
      }}
    >
      {renderScene()}
    </div>
  );
}
