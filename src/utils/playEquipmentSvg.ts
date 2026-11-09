/**
 * @description [HR-01, HR-05] 유니코드 기본 이모지에 없는 놀이터 '그네(Swing)'와
 * 점프 놀이기구 '트램폴린(방방이)'을 아동이 직관적으로 인지할 수 있도록 제작한 전용 SVG Data URL 상수
 */

/**
 * @description 놀이터 그네(Swing) SVG Data URL
 * 상단 철봉 프레임에 두 줄로 매달린 그네 의자가 앞뒤로 흔들리는(swing) 모습을 직관적으로 표현합니다.
 */
const SWING_SVG_RAW = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="22" fill="#EBF8FF"/>
  <ellipse cx="50" cy="88" rx="38" ry="6" fill="#BDE0FE"/>
  <!-- 놀이터 그네 양쪽 지지대 및 상단 가로봉 -->
  <path d="M16 86 L28 16 M84 86 L72 16" stroke="#FF9F43" stroke-width="6" stroke-linecap="round"/>
  <line x1="22" y1="16" x2="78" y2="16" stroke="#EE5253" stroke-width="7" stroke-linecap="round"/>
  <!-- 앞뒤로 왔다 갔다 흔들리는 그네 줄 + 그네 안장 + 탑승한 아이 -->
  <g>
    <animateTransform attributeName="transform" type="rotate" values="-16 50 16; 16 50 16; -16 50 16" dur="1.4s" repeatCount="indefinite"/>
    <line x1="38" y1="18" x2="38" y2="66" stroke="#576574" stroke-width="3"/>
    <line x1="62" y1="18" x2="62" y2="66" stroke="#576574" stroke-width="3"/>
    <circle cx="50" cy="44" r="10" fill="#FFE0BD"/>
    <circle cx="47" cy="42" r="1.8" fill="#3D352E"/>
    <circle cx="53" cy="42" r="1.8" fill="#3D352E"/>
    <path d="M46 47 Q50 51 54 47" stroke="#E05A47" stroke-width="2" fill="none"/>
    <path d="M41 54 L59 54 L57 65 L43 65 Z" fill="#54A0FF"/>
    <rect x="32" y="64" width="36" height="7" rx="3.5" fill="#FF6B6B" stroke="#C92A2A" stroke-width="1.5"/>
  </g>
  <!-- 앞뒤 스윙 방향 화살표 -->
  <path d="M22 52 Q15 62 24 72" stroke="#2E86DE" stroke-width="2.5" fill="none" stroke-dasharray="3 2"/>
  <path d="M78 52 Q85 62 76 72" stroke="#2E86DE" stroke-width="2.5" fill="none" stroke-dasharray="3 2"/>
</svg>`;

/**
 * @description 트램폴린(일명 방방이) SVG Data URL
 * 다리가 달린 둥근 탄성 매트 위에서 아이가 위아래로 방방 점프하는 놀이기구를 직관적으로 표현합니다.
 */
const TRAMPOLINE_SVG_RAW = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="22" fill="#FFF4E6"/>
  <!-- 트램폴린(방방이) 지지대 다리 3개 -->
  <line x1="24" y1="70" x2="20" y2="88" stroke="#576574" stroke-width="5" stroke-linecap="round"/>
  <line x1="50" y1="74" x2="50" y2="90" stroke="#576574" stroke-width="5" stroke-linecap="round"/>
  <line x1="76" y1="70" x2="80" y2="88" stroke="#576574" stroke-width="5" stroke-linecap="round"/>
  <!-- 둥근 트램폴린 파란 테두리 패드와 검정 탄성 점프 매트 -->
  <ellipse cx="50" cy="68" rx="36" ry="11" fill="#2E86DE" stroke="#1B4F72" stroke-width="2.5"/>
  <ellipse cx="50" cy="68" rx="26" ry="7" fill="#2C3E50" stroke="#FECA57" stroke-width="2" stroke-dasharray="4 2"/>
  <!-- 방방이 위에서 신나게 위아래로 점프하는 아이와 반동 표시 -->
  <g>
    <animateTransform attributeName="transform" type="translate" values="0,2; 0,-16; 0,2" dur="0.85s" repeatCount="indefinite"/>
    <circle cx="50" cy="30" r="10" fill="#FFE0BD"/>
    <circle cx="47" cy="28" r="1.8" fill="#3D352E"/>
    <circle cx="53" cy="28" r="1.8" fill="#3D352E"/>
    <path d="M46 33 Q50 37 54 33" stroke="#E05A47" stroke-width="2" fill="none"/>
    <path d="M40 32 L30 22 M60 32 L70 22" stroke="#FFE0BD" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M42 40 L58 40 L56 53 L44 53 Z" fill="#10B981"/>
    <path d="M45 53 L39 62 M55 53 L61 62" stroke="#3D352E" stroke-width="4" stroke-linecap="round"/>
  </g>
  <!-- 점프 탄성 화살표 -->
  <path d="M18 46 L18 26 M14 31 L18 25 L22 31" stroke="#FF9F43" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M82 46 L82 26 M78 31 L82 25 L86 31" stroke="#FF9F43" stroke-width="2.5" stroke-linecap="round" fill="none"/>
</svg>`;

/** 놀이터 그네(Swing) 카드 이미지 Data URL */
export const SWING_SVG_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(SWING_SVG_RAW)}`;

/** 트램폴린(방방이) 카드 이미지 Data URL */
export const TRAMPOLINE_SVG_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(TRAMPOLINE_SVG_RAW)}`;

