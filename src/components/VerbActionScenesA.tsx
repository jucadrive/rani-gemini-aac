import React from 'react';

/**
 * @description 일상 요구·섭취·놀이 동사 5종(주세요, 더 주세요, 먹어요, 마셔요, 하고 싶어요)의
 * 실제 행동 과정을 멀티-파트 SVG 애니메이션으로 보여주는 순수 프레젠테이셔널 컴포넌트 모음
 */

/** 1. '주세요' (begging): 두 손을 모아 내밀고 선물이 손안으로 내려오는 리얼 동작 */
export function BeggingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="주세요 실제 동작">
      <circle cx="40" cy="40" r="36" fill="#E8F8F0" />
      {/* 웃는 아이 얼굴 */}
      <circle cx="40" cy="24" r="12" fill="#FFE0BD" />
      <circle cx="36" cy="22" r="1.8" fill="#3D352E" />
      <circle cx="44" cy="22" r="1.8" fill="#3D352E" />
      <path d="M36 27 Q40 31 44 27" stroke="#E06D53" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {/* 위에서 두 손으로 내려오는 반짝이는 선물/하트 */}
      <g style={{ animation: 'itemDropToHands 1.2s ease-in-out infinite', transformOrigin: '40px 42px' }}>
        <rect x="32" y="34" width="16" height="13" rx="3" fill="#FF7657" />
        <path d="M40 34 V47 M32 40 H48" stroke="#FFF3E0" strokeWidth="2.5" />
      </g>
      {/* 공손히 모아 위아래로 움직이는 두 손바닥 */}
      <g style={{ animation: 'handsGiveAndTake 1.2s ease-in-out infinite' }}>
        <path
          d="M20 56 C22 48, 32 48, 38 55 L38 62 C30 62, 22 60, 20 56 Z"
          fill="#FFCC99"
          stroke="#E5A970"
          strokeWidth="1.5"
        />
        <path
          d="M60 56 C58 48, 48 48, 42 55 L42 62 C50 62, 58 60, 60 56 Z"
          fill="#FFCC99"
          stroke="#E5A970"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
}

/** 2. '더 주세요' (more): 접시 위의 간식에 손이 새 간식을 하나 더 추가(+1)하는 동작 */
export function MoreScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="더 주세요 실제 동작">
      <circle cx="40" cy="40" r="36" fill="#E8F8F0" />
      {/* 접시와 기존 쿠키 1개 */}
      <ellipse cx="40" cy="58" rx="26" ry="7" fill="#FFFFFF" stroke="#B2E2C8" strokeWidth="2.5" />
      <circle cx="31" cy="53" r="8" fill="#F5A65B" stroke="#C87A28" strokeWidth="1.5" />
      <circle cx="29" cy="51" r="1.3" fill="#6E471B" />
      <circle cx="33" cy="54" r="1.3" fill="#6E471B" />
      {/* 위에서 손이 내려와 두 번째 쿠키를 더 놓는 애니메이션 */}
      <g style={{ animation: 'addMoreItem 1.4s ease-in-out infinite' }}>
        <circle cx="49" cy="52" r="8" fill="#F5A65B" stroke="#C87A28" strokeWidth="1.5" />
        <circle cx="47" cy="50" r="1.3" fill="#6E471B" />
        <circle cx="51" cy="53" r="1.3" fill="#6E471B" />
        {/* 건네주는 손과 +1 표시 */}
        <path d="M52 26 L48 42 L58 40 L62 28 Z" fill="#FFCC99" />
        <circle cx="26" cy="26" r="11" fill="#2E9E6B" />
        <path d="M26 20 V32 M20 26 H32" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** 3. '먹어요' (eating): 아이가 입을 아~ 벌리고 음식이 담긴 숟가락이 입안으로 들어가는 동작 */
export function EatingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="먹어요 실제 동작">
      <circle cx="40" cy="40" r="36" fill="#FFF4E6" />
      {/* 아이 얼굴 */}
      <circle cx="36" cy="40" r="20" fill="#FFE0BD" />
      <circle cx="29" cy="34" r="2.2" fill="#3D352E" />
      <circle cx="42" cy="34" r="2.2" fill="#3D352E" />
      <circle cx="24" cy="41" r="3.5" fill="#FFAAA5" opacity="0.6" />
      {/* 아~ 벌어졌다 다물어지는 입 */}
      <ellipse
        cx="36"
        cy="46"
        rx="6.5"
        ry="5.5"
        fill="#E05A47"
        style={{ animation: 'mouthOpenClose 1.2s ease-in-out infinite', transformOrigin: '36px 46px' }}
      />
      {/* 음식이 담긴 숟가락이 입으로 쏙 들어가는 모션 */}
      <g style={{ animation: 'spoonToMouth 1.2s ease-in-out infinite', transformOrigin: '48px 50px' }}>
        <ellipse cx="44" cy="47" rx="6.5" ry="4" fill="#A0AAB2" />
        <circle cx="44" cy="45" r="4" fill="#FF9F43" />
        <path d="M49 48 L68 58" stroke="#A0AAB2" strokeWidth="4" strokeLinecap="round" />
        <circle cx="62" cy="55" r="5.5" fill="#FFCC99" />
      </g>
    </svg>
  );
}

/** 4. '마셔요' (drinking): 컵이 아이 입 쪽으로 기울어지며 물을 꿀꺽 마시는 동작 */
export function DrinkingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="마셔요 실제 동작">
      <circle cx="40" cy="40" r="36" fill="#EBF8FF" />
      {/* 아이 옆모습/얼굴 */}
      <circle cx="32" cy="40" r="19" fill="#FFE0BD" />
      <circle cx="27" cy="34" r="2.2" fill="#3D352E" />
      <circle cx="38" cy="34" r="2.2" fill="#3D352E" />
      <circle cx="36" cy="45" r="4" fill="#E05A47" />
      {/* 기울어지는 물컵과 빨대 */}
      <g style={{ animation: 'cupTiltToMouth 1.3s ease-in-out infinite', transformOrigin: '44px 46px' }}>
        <path d="M44 45 L37 44" stroke="#FF7657" strokeWidth="3" strokeLinecap="round" />
        <rect x="44" y="38" width="16" height="22" rx="3" fill="#FFFFFF" stroke="#48DBFB" strokeWidth="2.5" />
        <rect x="46" y="45" width="12" height="13" rx="1.5" fill="#48DBFB" />
        <circle cx="59" cy="50" r="5" fill="#FFCC99" />
      </g>
    </svg>
  );
}

/** 5. '하고 싶어요' (playing): 아이가 양팔을 벌려 신나게 점프하고 옆의 공이 함께 튀는 동작 */
export function PlayingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="하고 싶어요 실제 동작">
      <circle cx="40" cy="40" r="36" fill="#FFF8EC" />
      {/* 점프하는 아이 캐릭터 */}
      <g style={{ animation: 'childJumpJoy 0.95s ease-in-out infinite' }}>
        <circle cx="32" cy="28" r="11" fill="#FFE0BD" />
        <circle cx="28" cy="26" r="1.8" fill="#3D352E" />
        <circle cx="36" cy="26" r="1.8" fill="#3D352E" />
        <path d="M28 31 Q32 35 36 31" stroke="#E05A47" strokeWidth="2" fill="none" />
        <path d="M22 42 L32 39 L42 42 L39 58 L25 58 Z" fill="#FF8E6E" />
        <path d="M24 41 L14 31 M40 41 L50 31" stroke="#FFE0BD" strokeWidth="4.5" strokeLinecap="round" />
      </g>
      {/* 함께 통통 튀어 오르는 놀이 공 */}
      <g style={{ animation: 'ballBounceJoy 0.95s ease-in-out infinite', transformOrigin: '58px 54px' }}>
        <circle cx="58" cy="48" r="10" fill="#54A0FF" stroke="#2E86DE" strokeWidth="2" />
        <path d="M50 48 Q58 42 66 48" stroke="#FFFFFF" strokeWidth="2" fill="none" />
      </g>
    </svg>
  );
}

