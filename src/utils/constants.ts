/**
 * @description [HR-06] 하드코딩 스타일 및 매직 넘버 방지를 위한 전역 상수 및 테마 토큰 정의
 * 갤럭시 탭 S4 (2560x1600, 16:10 비율, 논리 해상도 1280x800) 및 아동 친화적 온화한 파스텔 톤 디자인 기준값입니다.
 */

/** 애플리케이션 기본 메타데이터 상수 */
export const APP_META = {
  TITLE: '마음톡톡 AAC',
  SUBTITLE: '명사와 움직이는 동사로 배우는 따뜻한 의사소통 보드',
  TARGET_DEVICE: 'Galaxy Tab S4 (10.5", 16:10)',
} as const;

/** 태블릿 터치 접근성 치수 상수 (단위: px) */
export const TOUCH_METRICS = {
  /** [HR-06] 최소 터치 타겟 크기 (48px 이상 보장) */
  MIN_TARGET_SIZE: 52,
  /** AAC 어휘/동작 카드 최소 높이 */
  CARD_MIN_HEIGHT: 136,
  /** 상단 문장 조합 바(Sentence Strip) 높이 */
  SENTENCE_BAR_HEIGHT: 108,
  /** 카드 모서리 둥글기 (아이들이 친근감을 느끼는 부드러운 곡률) */
  CARD_BORDER_RADIUS: 22,
} as const;

/** 아동에게 안정감과 친근감을 주는 온화한 파스텔 컬러 팔레트 */
export const WARM_PASTEL_COLORS = {
  /** 눈의 피로를 줄이는 웜 아이보리 전체 배경 */
  BG_MAIN: '#FFFDF9',
  /** 상단 문장 조합 바 배경 (따뜻한 밀크 크림) */
  BG_SENTENCE_BAR: '#FFF8EC',
  /** 명사(사물/어휘) 구역 배경 및 테두리 (소프트 피치 & 버터 옐로우 계열) */
  NOUN_SECTION_BG: '#FFF6EA',
  NOUN_CARD_BG: '#FFFFFF',
  NOUN_CARD_BORDER: '#FFD8A8',
  NOUN_ACCENT: '#F7882F',
  /** 동사(움직이는 동작) 구역 배경 및 테두리 (온화한 세이지 그린 & 민트 계열) */
  VERB_SECTION_BG: '#EEF8F3',
  VERB_CARD_BG: '#FFFFFF',
  VERB_CARD_BORDER: '#B2E2C8',
  VERB_ACCENT: '#2E9E6B',
  /** 주요 텍스트 컬러 (순수 검정 대신 부드러운 다크 브라운/차콜) */
  TEXT_PRIMARY: '#3D352E',
  TEXT_SECONDARY: '#7A6F66',
  /** 강조 및 음성 출력 중 파동 컬러 */
  PRIMARY_BRAND: '#FF8E6E',
} as const;

/** 고품질 TTS(음성 합성) 기본 운율 설정값 */
export const DEFAULT_TTS_CONFIG = {
  /** 한국어 표준 로케일 */
  LANG: 'ko-KR',
  /** 언어 재활 아동이 또렷하게 듣고 따라할 수 있는 약간 여유로운 속도 */
  DEFAULT_RATE: 0.92,
  /** 따뜻하고 친근한 음높이 */
  DEFAULT_PITCH: 1.05,
  /** 기본 볼륨 (최대) */
  DEFAULT_VOLUME: 1.0,
  /** 명사+동사 탭 후 전체 문장("빵 주세요") 자동 이어읽기 대기 시간 (ms) */
  AUTO_SENTENCE_DELAY_MS: 450,
} as const;

/** 사진첩 이미지 및 실시간 카메라 촬영 썸네일 압축 설정 상수 */
export const PHOTO_CAPTURE_CONFIG = {
  /** 로컬 스토리지 용량 보호를 위한 정사각형 썸네일 최대 해상도 (px) */
  THUMBNAIL_SIZE: 320,
  /** JPEG 압축 품질 (0.0 ~ 1.0) */
  JPEG_QUALITY: 0.85,
} as const;


