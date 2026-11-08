import React from 'react';

/**
 * @description 상호작용·표현 동사 4종(열어 주세요, 도와주세요, 싫어요, 안녕하세요)의
 * 실제 행동 과정을 멀티-파트 SVG 애니메이션으로 보여주는 순수 프레젠테이셔널 컴포넌트 모음
 */

/** 6. '열어 주세요' (opening): 상자의 양쪽 뚜껑이 실제로 활짝 열리며 안에서 별이 솟아오르는 동작 */
export function OpeningScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="열어 주세요 실제 동작">
      <circle cx="40" cy="40" r="36" fill="#F1F9F1" />
      {/* 상자 안에서 반짝이며 솟아오르는 별 */}
      <g style={{ animation: 'starPopOut 1.4s ease-in-out infinite', transformOrigin: '40px 36px' }}>
        <polygon
          points="40,16 44,25 54,26 46,32 48,42 40,37 32,42 34,32 26,26 36,25"
          fill="#FFC312"
          stroke="#F79F1F"
          strokeWidth="1.5"
        />
      </g>
      {/* 상자 본체 */}
      <rect x="22" y="42" width="36" height="22" rx="3" fill="#F5A65B" stroke="#C87A28" strokeWidth="2" />
      {/* 왼쪽으로 열리는 상자 뚜껑 */}
      <rect
        x="20"
        y="37"
        width="20"
        height="6"
        rx="2"
        fill="#FFBE76"
        stroke="#C87A28"
        strokeWidth="1.8"
        style={{ animation: 'boxLidOpenLeft 1.4s ease-in-out infinite', transformOrigin: '22px 42px' }}
      />
      {/* 오른쪽으로 열리는 상자 뚜껑 */}
      <rect
        x="40"
        y="37"
        width="20"
        height="6"
        rx="2"
        fill="#FFBE76"
        stroke="#C87A28"
        strokeWidth="1.8"
        style={{ animation: 'boxLidOpenRight 1.4s ease-in-out infinite', transformOrigin: '58px 42px' }}
      />
    </svg>
  );
}

/** 7. '도와주세요' (helping): 아래의 작은 손과 위의 큰 손이 서로 다가와 따뜻하게 맞잡는 동작 */
export function HelpingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="도와주세요 실제 동작">
      <circle cx="40" cy="40" r="36" fill="#FFF5F5" />
      {/* 가운데 따뜻한 하트 펄스 */}
      <path
        d="M40 30 C37 25, 29 26, 29 33 C29 39, 40 45, 40 45 C40 45, 51 39, 51 33 C51 26, 43 25, 40 30 Z"
        fill="#FF7675"
        opacity="0.85"
      />
      {/* 아래에서 위로 도움을 청하며 뻗는 아이 손 */}
      <g style={{ animation: 'handReachUp 1.2s ease-in-out infinite' }}>
        <path
          d="M16 62 L32 45 C35 42, 39 45, 36 49 L24 64 Z"
          fill="#FFE0BD"
          stroke="#E5A970"
          strokeWidth="1.8"
        />
      </g>
      {/* 위에서 아래로 내려와 잡아주는 어른/치료사 손 */}
      <g style={{ animation: 'handReachDown 1.2s ease-in-out infinite' }}>
        <path
          d="M64 18 L46 37 C43 40, 39 37, 42 33 L56 16 Z"
          fill="#FFCC99"
          stroke="#D4955A"
          strokeWidth="1.8"
        />
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
        {/* 도리도리 가로젓는 얼굴 */}
        <circle cx="36" cy="36" r="16" fill="#FFE0BD" />
        <path d="M28 31 L33 34 M33 31 L28 34" stroke="#3D352E" strokeWidth="2" strokeLinecap="round" />
        <path d="M39 31 L44 34 M44 31 L39 34" stroke="#3D352E" strokeWidth="2" strokeLinecap="round" />
        <path d="M31 44 Q36 40 41 44" stroke="#E05A47" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        {/* 앞으로 내민 거절 손바닥과 X 배지 */}
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
      {/* 웃는 아이 얼굴과 몸통 */}
      <circle cx="33" cy="38" r="16" fill="#FFE0BD" />
      <circle cx="28" cy="35" r="2" fill="#3D352E" />
      <circle cx="38" cy="35" r="2" fill="#3D352E" />
      <path d="M28 42 Q33 47 38 42" stroke="#E05A47" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M21 64 C21 54, 45 54, 45 64 Z" fill="#48DBFB" />
      {/* 팔꿈치를 축으로 좌우로 활기차게 흔드는 손바닥 */}
      <g style={{ animation: 'wavingArmHand 0.9s ease-in-out infinite', transformOrigin: '48px 54px' }}>
        <path d="M46 54 L56 32" stroke="#FFE0BD" strokeWidth="6" strokeLinecap="round" />
        <circle cx="57" cy="28" r="7" fill="#FFE0BD" stroke="#E5A970" strokeWidth="1.5" />
        <path d="M64 18 Q69 22 67 28" stroke="#FF9F43" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

