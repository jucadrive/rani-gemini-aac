import React from 'react';
import { AacCard } from '../types/aac';
import '../assets/verbMotions.css';

/**
 * @description CombinedActionScene 컴포넌트의 Props 인터페이스
 */
export interface CombinedActionSceneProps {
  /** 아동이 선택한 명사 카드 (예: '빵', '자동차', '과자', '화장실') */
  readonly nounCard: AacCard;
  /** 아동이 선택한 동사 카드 (예: '먹어요', '타요', '꺼내요', '뜯어요', '가요', '열어요') */
  readonly verbCard: AacCard;
  /** 통합 동작 그림 크기 (px, 기본값 190) */
  readonly size?: number;
}

/**
 * @description [HR-01, HR-03, HR-05] 선택한 '명사'와 '고빈도 동사(먹다/타다/꺼내다/뜯다/가다/열다 등)'가
 * 하나의 장면으로 완전히 결합되어 실행되는 단일 통합 동작 애니메이션 컴포넌트
 * @param {CombinedActionSceneProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 명사+동사 결합 단일 동작 일러스트 엘리먼트
 */
export function CombinedActionScene({
  nounCard,
  verbCard,
  size = 190,
}: CombinedActionSceneProps): React.ReactElement {
  const motion = verbCard.motionType ?? 'begging';
  const combinedLabel = `${nounCard.label} ${verbCard.label} 통합 동작 그림`;

  /** SVG 내부의 지정 좌표(x, y)에 선택된 명사 그림을 렌더링하는 헬퍼 */
  const renderNoun = (x: number, y: number, fontSize = 30): React.ReactElement => {
    if (nounCard.customImageUrl) {
      return (
        <image
          href={nounCard.customImageUrl}
          x={x - fontSize / 2}
          y={y - fontSize / 2}
          width={fontSize}
          height={fontSize}
        />
      );
    }
    return (
      <text x={x} y={y} fontSize={fontSize} textAnchor="middle" dominantBaseline="central">
        {nounCard.emoji}
      </text>
    );
  };

  return (
    <div
      aria-label={combinedLabel}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        borderRadius: '50%',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 10px 28px rgba(247, 136, 47, 0.22)',
      }}
    >
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="56" fill="#FFF8EC" stroke="#FFD8A8" strokeWidth="3" />

        {/* 1. 먹어요 (eating): 선택한 명사(빵/과자/밥)가 아이의 벌어지는 입으로 들어가는 동작 */}
        {motion === 'eating' && (
          <g>
            <circle cx="48" cy="62" r="26" fill="#FFE0BD" />
            <circle cx="39" cy="53" r="3" fill="#3D352E" />
            <circle cx="56" cy="53" r="3" fill="#3D352E" />
            <ellipse cx="48" cy="71" rx="9.5" ry="8" fill="#E05A47" style={{ animation: 'mouthOpenClose 1.15s ease-in-out infinite', transformOrigin: '48px 71px' }} />
            <g style={{ animation: 'spoonToMouth 1.15s ease-in-out infinite', transformOrigin: '72px 76px' }}>
              <path d="M68 76 L96 90" stroke="#A0AAB2" strokeWidth="6" strokeLinecap="round" />
              <circle cx="86" cy="84" r="8" fill="#FFCC99" />
              {renderNoun(62, 68, 30)}
            </g>
          </g>
        )}

        {/* 2. 마셔요 (drinking): 선택한 음료(우유/물/주스)가 입으로 기울어지는 동작 */}
        {motion === 'drinking' && (
          <g>
            <circle cx="46" cy="62" r="26" fill="#FFE0BD" />
            <circle cx="38" cy="53" r="3" fill="#3D352E" />
            <circle cx="54" cy="53" r="3" fill="#3D352E" />
            <circle cx="52" cy="70" r="6" fill="#E05A47" />
            <g style={{ animation: 'cupTiltToMouth 1.25s ease-in-out infinite', transformOrigin: '66px 70px' }}>
              <circle cx="84" cy="74" r="8" fill="#FFCC99" />
              {renderNoun(70, 64, 32)}
            </g>
          </g>
        )}

        {/* 3. 주세요 (begging): 두 손바닥 위로 선택한 명사가 내려와 안기는 동작 */}
        {motion === 'begging' && (
          <g>
            <circle cx="60" cy="34" r="17" fill="#FFE0BD" />
            <circle cx="54" cy="31" r="2.5" fill="#3D352E" />
            <circle cx="66" cy="31" r="2.5" fill="#3D352E" />
            <path d="M54 38 Q60 44 66 38" stroke="#E05A47" strokeWidth="2.5" fill="none" />
            <g style={{ animation: 'itemDropToHands 1.15s ease-in-out infinite', transformOrigin: '60px 64px' }}>
              {renderNoun(60, 62, 34)}
            </g>
            <g style={{ animation: 'handsGiveAndTake 1.15s ease-in-out infinite' }}>
              <path d="M28 84 C32 72, 46 72, 57 82 L57 92 C44 92, 32 89, 28 84 Z" fill="#FFCC99" />
              <path d="M92 84 C88 72, 74 72, 63 82 L63 92 C76 92, 88 89, 92 84 Z" fill="#FFCC99" />
            </g>
          </g>
        )}

        {/* 4. 더 주세요 (more): 기존 명사 옆에 똑같은 명사 1개를 더 추가하는 동작 */}
        {motion === 'more' && (
          <g>
            <ellipse cx="60" cy="86" rx="38" ry="10" fill="#FFFFFF" stroke="#B2E2C8" strokeWidth="3" />
            {renderNoun(44, 74, 28)}
            <g style={{ animation: 'addMoreItem 1.3s ease-in-out infinite' }}>
              {renderNoun(76, 72, 28)}
              <circle cx="36" cy="36" r="13" fill="#2E9E6B" />
              <path d="M36 29 V43 M29 36 H43" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            </g>
          </g>
        )}

        {/* 5. 타요 (riding): 선택한 탈것/사물(자동차 등)에 아이가 올라타 신나게 달리는 동작 */}
        {motion === 'riding' && (
          <g style={{ animation: 'rideMove 0.95s ease-in-out infinite' }}>
            <circle cx="56" cy="38" r="15" fill="#FFE0BD" />
            <circle cx="61" cy="35" r="2.2" fill="#3D352E" />
            <path d="M55 42 Q60 46 65 42" stroke="#E05A47" strokeWidth="2.2" fill="none" />
            <rect x="34" y="54" width="52" height="24" rx="10" fill="#D0EBFF" stroke="#54A0FF" strokeWidth="2.5" />
            {renderNoun(60, 68, 38)}
          </g>
        )}

        {/* 6. 꺼내요 / 열어요 (takingOut | opening): 상자가 열리며 선택한 명사가 위로 쏙 나오는 동작 */}
        {(motion === 'takingOut' || motion === 'opening') && (
          <g>
            <rect x="30" y="64" width="60" height="32" rx="4" fill="#F5A65B" stroke="#C87A28" strokeWidth="2" />
            <g style={{ animation: 'takeOutUp 1.3s ease-in-out infinite' }}>
              <path d="M60 18 L52 28 H57 V38 H63 V28 H68 Z" fill="#2E9E6B" />
              {renderNoun(60, 52, 34)}
            </g>
            <rect x="30" y="74" width="60" height="22" rx="3" fill="#FFBE76" stroke="#C87A28" strokeWidth="2" />
          </g>
        )}

        {/* 7. 뜯어요 (tearing): 포장지가 좌우로 쫙 뜯어지며 안에서 선택한 명사(과자/빵)가 나오는 동작 */}
        {motion === 'tearing' && (
          <g>
            {renderNoun(60, 62, 36)}
            <g style={{ animation: 'tearLeft 1.25s ease-in-out infinite', transformOrigin: '56px 76px' }}>
              <path d="M30 40 L57 44 L56 82 L30 82 Z" fill="#FF8E6E" opacity="0.88" />
              <circle cx="28" cy="60" r="8" fill="#FFCC99" />
            </g>
            <g style={{ animation: 'tearRight 1.25s ease-in-out infinite', transformOrigin: '64px 76px' }}>
              <path d="M63 44 L90 40 L90 82 L64 82 Z" fill="#FF8E6E" opacity="0.88" />
              <circle cx="92" cy="60" r="8" fill="#FFCC99" />
            </g>
          </g>
        )}

        {/* 8. 가요 (going): 오른쪽에 선택한 장소(화장실/집/학교)가 있고 아이가 그곳으로 걸어가는 동작 */}
        {motion === 'going' && (
          <g>
            {renderNoun(86, 58, 36)}
            <g style={{ animation: 'walkForward 1.3s linear infinite' }}>
              <circle cx="38" cy="44" r="14" fill="#FFE0BD" />
              <circle cx="43" cy="42" r="2" fill="#3D352E" />
              <path d="M30 58 L46 58 L44 78 L32 78 Z" fill="#2E9E6B" />
              <path d="M34 78 L28 92 M42 78 L48 92" stroke="#3D352E" strokeWidth="4" strokeLinecap="round" />
            </g>
          </g>
        )}

        {/* 9. 넣어요 / 그 외 동사(puttingIn, wearing, washing, watching, playing, helping, refusing, greeting) */}
        {!['eating', 'drinking', 'begging', 'more', 'riding', 'takingOut', 'opening', 'tearing', 'going'].includes(motion) && (
          <g>
            <rect x="30" y="70" width="60" height="26" rx="6" fill="#E3F2FD" stroke="#54A0FF" strokeWidth="2" />
            <g style={{ animation: motion === 'puttingIn' ? 'putInDown 1.3s ease-in-out infinite' : 'childJumpJoy 1s ease-in-out infinite' }}>
              {renderNoun(60, 54, 38)}
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
