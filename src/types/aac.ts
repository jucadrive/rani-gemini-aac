import { PartOfSpeech } from './common';

/**
 * @description 명사(사물/어휘) 보드의 카테고리 식별자 타입
 */
export type NounCategoryId = 'food' | 'play' | 'daily' | 'people' | 'feeling';

/**
 * @description 상단 탭에서 선택 가능한 챕터 식별자 ('favorites' 즐겨찾기 챕터 포함)
 */
export type ActiveChapterId = 'favorites' | NounCategoryId;

/**
 * @description 자폐 아동의 시각적 주의 집중 수준에 맞춘 한 화면 명사 노출 개수 옵션
 * - 2: 초기 집중 (2개만 큼직하게 제시)
 * - 4: 기본 권장 (4개 제시)
 * - 6: 확장 단계 (6개 제시)
 * - 8: 심화 단계 (8개 제시)
 * - 99: 전체 한꺼번에 보기
 */
export type NounDisplayLimit = 2 | 4 | 6 | 8 | 99;

/**
 * @description 동사(동작) 카드에 적용할 실제 동작 애니메이션 식별자 타입
 */
export type VerbMotionType =
  | 'begging'
  | 'more'
  | 'eating'
  | 'drinking'
  | 'playing'
  | 'opening'
  | 'helping'
  | 'refusing'
  | 'greeting'
  | 'riding'
  | 'takingOut'
  | 'tearing'
  | 'going'
  | 'puttingIn'
  | 'wearing'
  | 'washing'
  | 'watching';

/**
 * @description 명사 카테고리 메타데이터 인터페이스
 */
export interface NounCategory {
  /** 카테고리 고유 ID */
  readonly id: NounCategoryId;
  /** 화면 탭에 표시할 한글 이름 (예: '간식·음식') */
  readonly label: string;
  /** 카테고리 대표 이모지 또는 아이콘 심볼 */
  readonly iconEmoji: string;
  /** 카테고리 탭 강조 배경색 */
  readonly badgeColor: string;
}

/**
 * @description 개별 AAC 어휘(명사) 또는 동작(동사) 카드 인터페이스
 */
export interface AacCard {
  /** 카드 고유 식별자 (예: 'noun-bread', 'verb-give') */
  readonly id: string;
  /** 화면에 크게 표시할 한글 어휘 (예: '빵', '주세요') */
  readonly label: string;
  /** TTS가 실제로 발음할 텍스트 */
  readonly speechText: string;
  /** 품사 구분 ('noun': 명사, 'verb': 동사/서술어) */
  readonly partOfSpeech: PartOfSpeech;
  /** 명사일 경우 소속된 카테고리 ID */
  readonly categoryId?: NounCategoryId;
  /** 카드에 표시할 친근한 대표 심볼 */
  readonly emoji: string;
  /** 동사일 경우 적용할 리얼 동작 애니메이션 종류 */
  readonly motionType?: VerbMotionType;
  /** 치료사가 직접 등록한 외부 이미지 또는 움직이는 GIF URL */
  readonly customImageUrl?: string;
  /** 카드 배경 보조 파스텔 컬러 (선택) */
  readonly accentColor?: string;
  /** 치료사가 직접 추가한 커스텀 카드 여부 */
  readonly isCustom?: boolean;
}

/**
 * @description 자주 쓰는 표현을 저장하는 '즐겨찾기 문장' 인터페이스
 */
export interface FavoriteSentence {
  /** 즐겨찾기 항목 고유 ID */
  readonly id: string;
  /** 완성된 한국어 문장 텍스트 (예: '빵 주세요') */
  readonly sentenceText: string;
  /** 문장을 구성하는 카드 배열 (예: [빵 카드, 주세요 카드]) */
  readonly cards: readonly AacCard[];
}

/**
 * @description 고품질 TTS(음성 합성) 및 시각 자극량(명사 개수) 치료 환경 설정 인터페이스
 */
export interface TtsSettings {
  /** 말하기 속도 (0.6 ~ 1.3, 기본값 0.92) */
  readonly rate: number;
  /** 음높이 (0.8 ~ 1.3, 기본값 1.05) */
  readonly pitch: number;
  /** 음량 (0.0 ~ 1.0, 기본값 1.0) */
  readonly volume: number;
  /** 사용자가 지정한 선호 한국어 보이스 URI */
  readonly preferredVoiceURI?: string;
  /** 동사 탭으로 문장이 완성되었을 때 전체 문장("빵 주세요")을 자동으로 이어 읽을지 여부 */
  readonly autoReadCompletedSentence: boolean;
  /** 자폐 아동 전경·배경 분리 지원을 위한 한 화면 명사 최대 노출 개수 (기본값 4) */
  readonly nounDisplayLimit: NounDisplayLimit;
}

/**
 * @description TTS 발화 진행 상태 이벤트 리스너 타입
 */
export type TtsStatusListener = (state: {
  readonly isSpeaking: boolean;
  readonly speakingText: string;
}) => void;
