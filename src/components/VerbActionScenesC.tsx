import React from 'react';

/**
 * @description 신규 고빈도 동사 8종(타요, 꺼내요, 뜯어요, 가요, 넣어요, 입어요, 씻어요, 봐요)의
 * 실제 행동 과정을 멀티-파트 SVG 애니메이션으로 보여주는 순수 프레젠테이셔널 컴포넌트 모음
 */

/** 10. '타요' (riding): 아이가 바퀴 달린 탈것에 올라타 앞으로 신나게 이동하는 동작 */
export function RidingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="타요 실제 동작">
      <circle cx="40" cy="40" r="36" fill="#EBF8FF" />
      <g style={{ animation: 'rideMove 1s ease-in-out infinite' }}>
        {/* 탑승한 아이 얼굴 */}
        <circle cx="38" cy="26" r="10" fill="#FFE0BD" />
        <circle cx="41" cy="24" r="1.8" fill="#3D352E" />
        <path d="M37 29 Q41 32 44 29" stroke="#E05A47" strokeWidth="2" fill="none" />
        {/* 탈것(자동차) 차체와 바퀴 */}
        <rect x="18" y="36" width="44" height="18" rx="7" fill="#54A0FF" stroke="#2E86DE" strokeWidth="2" />
        <circle cx="28" cy="56" r="7" fill="#3D352E" />
        <circle cx="28" cy="56" r="3" fill="#FFFFFF" />
        <circle cx="52" cy="56" r="7" fill="#3D352E" />
        <circle cx="52" cy="56" r="3" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

/** 11. '꺼내요' (takingOut): 상자 안에서 밖(위쪽)으로 물건을 손으로 쏙 들어 올려 꺼내는 동작 */
export function TakingOutScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="꺼내요 실제 동작">
      <circle cx="40" cy="40" r="36" fill="#FFF8EC" />
      {/* 상자 뒷면 */}
      <rect x="20" y="44" width="40" height="22" rx="3" fill="#F5A65B" stroke="#C87A28" strokeWidth="2" />
      {/* 상자 안에서 위로 쏙 꺼내지는 아이템과 손 + 위쪽 화살표 */}
      <g style={{ animation: 'takeOutUp 1.35s ease-in-out infinite' }}>
        <path d="M40 12 L33 20 H38 V28 H42 V20 H47 Z" fill="#2E9E6B" />
        <circle cx="40" cy="36" r="9" fill="#FF6B6B" stroke="#C92A2A" strokeWidth="1.5" />
        <circle cx="48" cy="38" r="5" fill="#FFCC99" />
      </g>
      {/* 상자 앞면 */}
      <rect x="20" y="50" width="40" height="16" rx="2" fill="#FFBE76" stroke="#C87A28" strokeWidth="2" />
    </svg>
  );
}

/** 12. '뜯어요' (tearing): 양손으로 과자 봉지 양끝을 잡고 좌우로 쫙 뜯어 여는 동작 */
export function TearingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="뜯어요 실제 동작">
      <circle cx="40" cy="40" r="36" fill="#FFF0F6" />
      {/* 봉지가 뜯어지며 가운데서 나타나는 간식 */}
      <circle cx="40" cy="42" r="9" fill="#F5A65B" stroke="#C87A28" strokeWidth="1.5" />
      {/* 왼쪽으로 뜯어지는 포장지 조각과 왼손 */}
      <g style={{ animation: 'tearLeft 1.25s ease-in-out infinite', transformOrigin: '38px 52px' }}>
        <path d="M22 26 L39 30 L38 56 L22 56 Z" fill="#FF8E6E" stroke="#E05A47" strokeWidth="1.8" />
        <circle cx="20" cy="40" r="6" fill="#FFCC99" />
      </g>
      {/* 오른쪽으로 뜯어지는 포장지 조각과 오른손 */}
      <g style={{ animation: 'tearRight 1.25s ease-in-out infinite', transformOrigin: '42px 52px' }}>
        <path d="M41 30 L58 26 L58 56 L42 56 Z" fill="#FF8E6E" stroke="#E05A47" strokeWidth="1.8" />
        <circle cx="60" cy="40" r="6" fill="#FFCC99" />
      </g>
    </svg>
  );
}

/** 13. '가요' (going): 목적지(집/장소)를 향해 아이가 앞으로 씩씩하게 걸어가는 동작 */
export function GoingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="가요 실제 동작">
      <circle cx="40" cy="40" r="36" fill="#E8F8F0" />
      {/* 오른쪽 목적지 작은 집 아이콘 */}
      <polygon points="60,28 50,37 70,37" fill="#FF7657" />
      <rect x="53" y="37" width="14" height="15" fill="#FFFFFF" stroke="#C87A28" strokeWidth="1.5" />
      {/* 앞으로 걸어가는 아이 캐릭터와 이동 화살표 */}
      <g style={{ animation: 'walkForward 1.3s linear infinite' }}>
        <circle cx="28" cy="30" r="9" fill="#FFE0BD" />
        <circle cx="31" cy="29" r="1.5" fill="#3D352E" />
        <path d="M22 40 L34 40 L32 54 L24 54 Z" fill="#2E9E6B" />
        <path d="M25 54 L21 63 M31 54 L35 63" stroke="#3D352E" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** 14. '넣어요' (puttingIn): 위에서 바구니/상자 안으로 물건을 쏙 집어넣는 동작 */
export function PuttingInScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="넣어요 실제 동작">
      <circle cx="40" cy="40" r="36" fill="#F0F4FF" />
      <rect x="20" y="46" width="40" height="20" rx="3" fill="#74B9FF" stroke="#0984E3" strokeWidth="2" />
      <g style={{ animation: 'putInDown 1.35s ease-in-out infinite' }}>
        <path d="M40 28 L34 20 H38 V12 H42 V20 H46 Z" fill="#0984E3" />
        <circle cx="40" cy="36" r="8.5" fill="#FFC312" stroke="#F79F1F" strokeWidth="1.5" />
      </g>
      <rect x="20" y="52" width="40" height="14" rx="2" fill="#A3CBFF" stroke="#0984E3" strokeWidth="2" />
    </svg>
  );
}

/** 15. '입어요' (wearing): 아이 몸쪽으로 옷이 내려오며 착용되는 동작 */
export function WearingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="입어요 실제 동작">
      <circle cx="40" cy="40" r="36" fill="#FFF4E6" />
      <circle cx="40" cy="24" r="10" fill="#FFE0BD" />
      <g style={{ animation: 'putInDown 1.3s ease-in-out infinite' }}>
        <path d="M24 38 L32 34 L48 34 L56 38 L52 46 L48 44 L48 60 L32 60 L32 44 L28 46 Z" fill="#FF8E6E" stroke="#E05A47" strokeWidth="1.8" />
      </g>
    </svg>
  );
}

/** 16. '씻어요' (washing): 두 손 위로 비누거품과 물방울이 보글보글 문질러지는 동작 */
export function WashingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="씻어요 실제 동작">
      <circle cx="40" cy="40" r="36" fill="#EBF8FF" />
      <ellipse cx="40" cy="48" rx="18" ry="11" fill="#FFCC99" stroke="#E5A970" strokeWidth="2" />
      <g style={{ animation: 'washScrub 0.9s ease-in-out infinite' }}>
        <circle cx="32" cy="42" r="7" fill="#FFFFFF" stroke="#74B9FF" strokeWidth="2" />
        <circle cx="45" cy="39" r="8" fill="#FFFFFF" stroke="#74B9FF" strokeWidth="2" />
        <circle cx="39" cy="50" r="6" fill="#FFFFFF" stroke="#74B9FF" strokeWidth="2" />
      </g>
    </svg>
  );
}

/** 17. '봐요' (watching): 아이가 눈앞의 대상을 초롱초롱 바라보는 동작 */
export function WatchingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="봐요 실제 동작">
      <circle cx="40" cy="40" r="36" fill="#FFFBEB" />
      <circle cx="28" cy="42" r="14" fill="#FFE0BD" />
      <circle cx="33" cy="39" r="2.5" fill="#3D352E" />
      <path d="M39 39 L52 35 M39 43 L52 47" stroke="#FF9F43" strokeWidth="2" strokeDasharray="3 2" />
      <rect x="52" y="30" width="14" height="22" rx="2" fill="#54A0FF" stroke="#2E86DE" strokeWidth="1.8" />
    </svg>
  );
}

