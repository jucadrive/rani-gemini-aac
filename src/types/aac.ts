import { PartOfSpeech } from './common';

/**
 * @description 명사(사물/어휘) 보드의 카테고리 식별자 타입
 * - food: 음식·간식 (빵, 우유, 물, 과자, 사과, 밥 등)
 * - play: 놀이·장난감 (공, 블록, 자동차, 그림책, 비눗방울, 인형 등)
 * - daily: 일상·생활용품 (화장실, 손씻기, 옷, 신발, 가방, 휴지 등)
 * - people: 사람·장소 (엄마, 아빠, 선생님, 집, 학교, 병원 등)
 * - feeling: 감정·상태 (좋아요, 아파요, 배고파요, 졸려요, 무서워요 등)
 */
export type NounCategoryId = 'food' | 'play' | 'daily' | 'people' | 'feeling';

/**
 * @description 동사(동작) 카드에 적용할 루프 GIF/애니메이션 모션 식별자 타입
 * - begging: 두 손을 모아 공손히 달라고 흔드는 동작 ("주세요")
 * - more: 손가락/손바닥으로 하나 더 추가하는 동작 ("더 주세요")
 * - eating: 숟가락/음식을 입으로 가져가 오물오물 먹는 동작 ("먹어요")
 * - drinking: 컵을 기울여 꿀꺽 마시는 동작 ("마셔요")
 * - playing: 신나게 통통 튀며 놀이하는 동작 ("하고 싶어요 / 놀아요")
 * - opening: 뚜껑이나 문을 양옆으로 여는 동작 ("열어 주세요")
 * - helping: 손을 내밀어 도움을 요청하는 동작 ("도와주세요")
 * - refusing: 손을 가로저으며 거절 의사 표현 ("싫어요 / 그만")
 * - greeting: 손을 좌우로 흔들며 인사하는 동작 ("안녕하세요 / 바이바이")
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
  | 'greeting';

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
  /** TTS가 실제로 발음할 텍스트 (발음 보정이 필요한 경우 활용, 기본은 label과 동일) */
  readonly speechText: string;
  /** 품사 구분 ('noun': 좌측 명사 보드, 'verb': 우측 고정 동사 보드) */
  readonly partOfSpeech: PartOfSpeech;
  /** 명사일 경우 소속된 카테고리 ID */
  readonly categoryId?: NounCategoryId;
  /** 카드에 표시할 친근한 대표 일러스트/이모지 심볼 */
  readonly emoji: string;
  /** 동사일 경우 적용할 반복 모션 애니메이션 종류 */
  readonly motionType?: VerbMotionType;
  /** 치료사가 직접 등록한 외부 이미지 또는 움직이는 GIF URL (Data URL 포함) */
  readonly customImageUrl?: string;
  /** 카드 배경 보조 파스텔 컬러 (선택) */
  readonly accentColor?: string;
  /** 치료사가 직접 추가한 커스텀 카드 여부 */
  readonly isCustom?: boolean;
}

/**
 * @description 고품질 TTS(음성 합성) 세부 설정 인터페이스
 */
export interface TtsSettings {
  /** 말하기 속도 (0.6 ~ 1.3, 기본값 0.92) */
  readonly rate: number;
  /** 음높이 (0.8 ~ 1.3, 기본값 1.05) */
  readonly pitch: number;
  /** 음량 (0.0 ~ 1.0, 기본값 1.0) */
  readonly volume: number;
  /** 사용자가 지정한 선호 한국어 보이스 URI (미지정 시 최적 보이스 자동 선택) */
  readonly preferredVoiceURI?: string;
  /** 동사 탭으로 문장이 완성되었을 때 전체 문장("빵 주세요")을 자동으로 이어 읽을지 여부 */
  readonly autoReadCompletedSentence: boolean;
}

/**
 * @description TTS 발화 진행 상태 이벤트 리스너 타입
 */
export type TtsStatusListener = (state: {
  readonly isSpeaking: boolean;
  readonly speakingText: string;
}) => void;
