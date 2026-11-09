import React from 'react';

/**
 * @description 상호작용·감정·자기옹호 동사 9종(열어요, 도와주세요, 싫어요, 안녕하세요,
 * 틀어주세요, 만지지 마세요, 좋아요, 맛있어요, 재밌어요)의 멀티-파트 SVG 애니메이션 모음
 */

/** 6. '열어 주세요' (opening): 상자의 양쪽 뚜껑이 활짝 열리며 안에서 별이 솟아오르는 동작 */
export function OpeningScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="열어 주세요 실제 동작">
      <circle cx="40" cy="40" r="36" fill="#F1F9F1" />
      <g style={{ animation: 'starPopOut 1.4s ease-in-out infinite', transformOrigin: '40px 36px' }}>
        <polygon points="40,16 44,25 54,26 46,32 48,42 40,37 32,42 34,32 26,26 36,25" fill="#FFC312" stroke="#F79F1F" strokeWidth="1.5" />
      </g>
      <rect x="22" y="42" width="36" height="22" rx="3" fill="#F5A65B" stroke="#C87A28" strokeWidth="2" />
      <rect x="20" y="37" width="20" height="6" rx="2" fill="#FFBE76" stroke="#C87A28" strokeWidth="1.8" style={{ animation: 'boxLidOpenLeft 1.4s ease-in-out infinite', transformOrigin: '22px 42px' }} />
      <rect x="40" y="37" width="20" height="6" rx="2" fill="#FFBE76" stroke="#C87A28" strokeWidth="1.8" style={{ animation: 'boxLidOpenRight 1.4s ease-in-out infinite', transformOrigin: '58px 42px' }} />
    </svg>
  );
}

/** 7. '도와주세요' (helping): 아래의 작은 손과 위의 큰 손이 서로 다가와 따뜻하게 맞잡는 동작 */
export function HelpingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="도와주세요 실제 동작">
      <circle cx="40" cy="40" r="36" fill="#FFF5F5" />
      <path d="M40 30 C37 25, 29 26, 29 33 C29 39, 40 45, 40 45 C40 45, 51 39, 51 33 C51 26, 43 25, 40 30 Z" fill="#FF7675" opacity="0.85" />
      <g style={{ animation: 'handReachUp 1.2s ease-in-out infinite' }}>
        <path d="M16 62 L32 45 C35 42, 39 45, 36 49 L24 64 Z" fill="#FFE0BD" stroke="#E5A970" strokeWidth="1.8" />
      </g>
      <g style={{ animation: 'handReachDown 1.2s ease-in-out infinite' }}>
        <path d="M64 18 L46 37 C43 40, 39 37, 42 33 L56 16 Z" fill="#FFCC99" stroke="#D4955A" strokeWidth="1.8" />
      </g>
    </svg>
  );
}

/** 8. '싫어요' (refusing): 아이가 고개를 좌우로 가로젓고 손바닥과 X 표시로 거절하는 동작 */
export function RefusingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="싫어요 실제 동작">
      <circle cx="40" cy="40" r="36" fill="#FFF0ED" />
      <g style={{ animation: 'headAndHandShakeNo 0.85s ease-in-out infinite', transformOrigin: '40px 45px' }}>
        <circle cx="36" cy="36" r="16" fill="#FFE0BD" />
        <path d="M28 31 L33 34 M33 31 L28 34 M39 31 L44 34 M44 31 L39 34" stroke="#3D352E" strokeWidth="2" strokeLinecap="round" />
        <path d="M31 44 Q36 40 41 44" stroke="#E05A47" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <rect x="48" y="38" width="13" height="17" rx="5" fill="#FFCC99" stroke="#E5A970" strokeWidth="1.5" />
        <circle cx="56" cy="24" r="10" fill="#EB5757" />
        <path d="M52 20 L60 28 M60 20 L52 28" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** 9. '안녕하세요' (greeting): 밝게 웃는 아이가 팔과 손바닥을 좌우로 흔들며 인사하는 동작 */
export function GreetingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="안녕하세요 실제 동작">
      <circle cx="40" cy="40" r="36" fill="#FFFBEB" />
      <circle cx="33" cy="38" r="16" fill="#FFE0BD" />
      <circle cx="28" cy="35" r="2" fill="#3D352E" />
      <circle cx="38" cy="35" r="2" fill="#3D352E" />
      <path d="M28 42 Q33 47 38 42" stroke="#E05A47" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M21 64 C21 54, 45 54, 45 64 Z" fill="#48DBFB" />
      <g style={{ animation: 'wavingArmHand 0.9s ease-in-out infinite', transformOrigin: '48px 54px' }}>
        <path d="M46 54 L56 32" stroke="#FFE0BD" strokeWidth="6" strokeLinecap="round" />
        <circle cx="57" cy="28" r="7" fill="#FFE0BD" stroke="#E5A970" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

/** 18. '틀어주세요' (turningOn): 스피커 버튼을 누르면 신나는 음표(🎵🎶)가 솟아오르는 동작 */
export function TurningOnScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="틀어주세요 실제 동작">
      <circle cx="40" cy="40" r="36" fill="#F3E8FF" />
      <rect x="18" y="34" width="22" height="26" rx="5" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="2" />
      <circle cx="29" cy="49" r="6" fill="#DDD6FE" />
      <polygon points="30,26 42,40 30,40" fill="#FFFFFF" opacity="0.2" />
      <g style={{ animation: 'takeOutUp 1.1s ease-in-out infinite' }}>
        <text x="50" y="34" fontSize="20">🎵</text>
        <text x="61" y="48" fontSize="18">🎶</text>
      </g>
    </svg>
  );
}

/** 19. '만지지 마세요' (dontTouch): 손바닥을 앞으로 뻗어 보호막과 정지 신호를 보내는 자기옹호 동작 */
export function DontTouchScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="만지지 마세요 실제 동작">
      <circle cx="40" cy="40" r="36" fill="#FEE2E2" />
      <g style={{ animation: 'headAndHandShakeNo 0.9s ease-in-out infinite', transformOrigin: '40px 44px' }}>
        <rect x="27" y="28" width="26" height="30" rx="10" fill="#FFCC99" stroke="#D97706" strokeWidth="2" />
        <circle cx="40" cy="40" r="24" fill="none" stroke="#EF4444" strokeWidth="4" />
        <line x1="23" y1="23" x2="57" y2="57" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** 20. '좋아요' (liking): 환하게 웃으며 엄지척과 하트를 띄우는 동작 */
export function LikingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="좋아요 실제 동작">
      <circle cx="40" cy="40" r="36" fill="#FEF3C7" />
      <circle cx="32" cy="44" r="15" fill="#FFE0BD" />
      <path d="M26 41 Q28 38 30 41 M34 41 Q36 38 38 41" stroke="#3D352E" strokeWidth="2" fill="none" />
      <path d="M27 47 Q32 53 37 47" stroke="#E05A47" strokeWidth="2.2" fill="none" />
      <g style={{ animation: 'childJumpJoy 0.95s ease-in-out infinite' }}>
        <text x="54" y="34" fontSize="22" textAnchor="middle">❤️</text>
        <text x="56" y="56" fontSize="22" textAnchor="middle">👍</text>
      </g>
    </svg>
  );
}

/** 21. '맛있어요' (delicious): 두 손으로 볼을 감싸고 입맛을 다시며 행복해하는 동작 */
export function DeliciousScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="맛있어요 실제 동작">
      <circle cx="40" cy="40" r="36" fill="#FFF7ED" />
      <g style={{ animation: 'childJumpJoy 1.05s ease-in-out infinite' }}>
        <circle cx="40" cy="42" r="17" fill="#FFE0BD" />
        <path d="M32 38 Q35 34 38 38 M42 38 Q45 34 48 38" stroke="#3D352E" strokeWidth="2" fill="none" />
        <path d="M33 46 Q40 53 47 46" stroke="#E05A47" strokeWidth="2.2" fill="none" />
        <ellipse cx="44" cy="50" rx="3.5" ry="2.5" fill="#FF7675" />
        <circle cx="24" cy="46" r="5.5" fill="#FFCC99" />
        <circle cx="56" cy="46" r="5.5" fill="#FFCC99" />
        <text x="58" y="24" fontSize="16">✨</text>
      </g>
    </svg>
  );
}

/** 22. '재밌어요' (fun): 두 팔을 번쩍 들고 신나게 점프하며 웃는 동작 */
export function FunScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="재밌어요 실제 동작">
      <circle cx="40" cy="40" r="36" fill="#ECFDF5" />
      <g style={{ animation: 'childJumpJoy 0.8s ease-in-out infinite' }}>
        <circle cx="40" cy="34" r="13" fill="#FFE0BD" />
        <path d="M35 32 L38 34 L35 36 M45 32 L42 34 L45 36" stroke="#3D352E" strokeWidth="2" fill="none" />
        <path d="M35 38 Q40 45 45 38 Z" fill="#E05A47" />
        <path d="M27 36 L18 22 M53 36 L62 22" stroke="#FFE0BD" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M30 47 L50 47 L48 62 L32 62 Z" fill="#10B981" />
        <text x="20" y="20" fontSize="14">🎉</text>
      </g>
    </svg>
  );
}
