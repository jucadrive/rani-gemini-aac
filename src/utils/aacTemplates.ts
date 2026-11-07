import { AacCard, NounCategory, VerbMotionType } from '../types/aac';

/**
 * @description 커스텀 카드 추가 모달에서 제공하는 빠른 선택용 친근한 이모지 목록
 */
export const CUSTOM_CARD_SAMPLE_EMOJIS: readonly string[] = [
  '🍓', '🧀', '🍌', '🍗', '🍦', '🚂', '🦖', '🎨', '🎹', '🐶', '🐱', '🤗',
] as const;

/**
 * @description 동사 커스텀 카드 생성 시 선택할 수 있는 9가지 GIF 모션 옵션 목록
 */
export const VERB_MOTION_OPTIONS: { value: VerbMotionType; label: string }[] = [
  { value: 'begging', label: '🤲 두 손 모아 달라고 하기 (주세요)' },
  { value: 'more', label: '➕ 하나 더 요청하기 (더 주세요)' },
  { value: 'eating', label: '🥄 숟가락으로 먹기 (먹어요)' },
  { value: 'drinking', label: '🥤 컵 기울여 마시기 (마셔요)' },
  { value: 'playing', label: '🎈 신나게 통통 튀기 (하고 싶어요)' },
  { value: 'opening', label: '📦 양옆으로 열기 (열어 주세요)' },
  { value: 'helping', label: '🤝 손 내밀어 도움 요청 (도와주세요)' },
  { value: 'refusing', label: '🙅 가로저으며 거절 (싫어요)' },
  { value: 'greeting', label: '👋 손 흔들며 인사 (안녕하세요)' },
];

/**
 * @description 언어재활 치료를 위한 5대 명사(사물·어휘) 카테고리 정의
 */
export const NOUN_CATEGORIES: readonly NounCategory[] = [
  { id: 'food', label: '간식·음식', iconEmoji: '🥐', badgeColor: '#FF9F43' },
  { id: 'play', label: '놀이·장난감', iconEmoji: '🧸', badgeColor: '#54A0FF' },
  { id: 'daily', label: '일상·생활', iconEmoji: '🪥', badgeColor: '#48DBFB' },
  { id: 'people', label: '사람·장소', iconEmoji: '👨‍👩‍👧', badgeColor: '#FF6B6B' },
  { id: 'feeling', label: '감정·상태', iconEmoji: '💛', badgeColor: '#F368E0' },
] as const;

/**
 * @description 좌측 보드에 카테고리별로 표시될 기본 명사(무엇을?) 어휘 템플릿 30종
 */
export const DEFAULT_NOUN_CARDS: readonly AacCard[] = [
  // 1. 간식·음식 (food) - 여자친구분 예시 '빵'을 첫 번째로 배치!
  { id: 'noun-bread', label: '빵', speechText: '빵', partOfSpeech: 'noun', categoryId: 'food', emoji: '🥐' },
  { id: 'noun-milk', label: '우유', speechText: '우유', partOfSpeech: 'noun', categoryId: 'food', emoji: '🥛' },
  { id: 'noun-water', label: '물', speechText: '물', partOfSpeech: 'noun', categoryId: 'food', emoji: '💧' },
  { id: 'noun-snack', label: '과자', speechText: '과자', partOfSpeech: 'noun', categoryId: 'food', emoji: '🍪' },
  { id: 'noun-apple', label: '사과', speechText: '사과', partOfSpeech: 'noun', categoryId: 'food', emoji: '🍎' },
  { id: 'noun-rice', label: '밥', speechText: '밥', partOfSpeech: 'noun', categoryId: 'food', emoji: '🍚' },
  { id: 'noun-juice', label: '주스', speechText: '주스', partOfSpeech: 'noun', categoryId: 'food', emoji: '🧃' },
  { id: 'noun-banana', label: '바나나', speechText: '바나나', partOfSpeech: 'noun', categoryId: 'food', emoji: '🍌' },

  // 2. 놀이·장난감 (play)
  { id: 'noun-ball', label: '공', speechText: '공', partOfSpeech: 'noun', categoryId: 'play', emoji: '⚽' },
  { id: 'noun-block', label: '블록', speechText: '블록', partOfSpeech: 'noun', categoryId: 'play', emoji: '🧱' },
  { id: 'noun-car', label: '자동차', speechText: '자동차', partOfSpeech: 'noun', categoryId: 'play', emoji: '🚗' },
  { id: 'noun-bubble', label: '비눗방울', speechText: '비눗방울', partOfSpeech: 'noun', categoryId: 'play', emoji: '🫧' },
  { id: 'noun-book', label: '그림책', speechText: '그림책', partOfSpeech: 'noun', categoryId: 'play', emoji: '📘' },
  { id: 'noun-doll', label: '인형', speechText: '인형', partOfSpeech: 'noun', categoryId: 'play', emoji: '🧸' },
  { id: 'noun-crayon', label: '색연필', speechText: '색연필', partOfSpeech: 'noun', categoryId: 'play', emoji: '🖍️' },
  { id: 'noun-puzzle', label: '퍼즐', speechText: '퍼즐', partOfSpeech: 'noun', categoryId: 'play', emoji: '🧩' },

  // 3. 일상·생활 (daily)
  { id: 'noun-toilet', label: '화장실', speechText: '화장실', partOfSpeech: 'noun', categoryId: 'daily', emoji: '🚽' },
  { id: 'noun-hands', label: '손', speechText: '손', partOfSpeech: 'noun', categoryId: 'daily', emoji: '🧼' },
  { id: 'noun-clothes', label: '옷', speechText: '옷', partOfSpeech: 'noun', categoryId: 'daily', emoji: '👕' },
  { id: 'noun-shoes', label: '신발', speechText: '신발', partOfSpeech: 'noun', categoryId: 'daily', emoji: '👟' },
  { id: 'noun-bag', label: '가방', speechText: '가방', partOfSpeech: 'noun', categoryId: 'daily', emoji: '🎒' },
  { id: 'noun-tissue', label: '휴지', speechText: '휴지', partOfSpeech: 'noun', categoryId: 'daily', emoji: '🧻' },

  // 4. 사람·장소 (people)
  { id: 'noun-mom', label: '엄마', speechText: '엄마', partOfSpeech: 'noun', categoryId: 'people', emoji: '👩' },
  { id: 'noun-dad', label: '아빠', speechText: '아빠', partOfSpeech: 'noun', categoryId: 'people', emoji: '👨' },
  { id: 'noun-teacher', label: '선생님', speechText: '선생님', partOfSpeech: 'noun', categoryId: 'people', emoji: '👩‍🏫' },
  { id: 'noun-home', label: '집', speechText: '집', partOfSpeech: 'noun', categoryId: 'people', emoji: '🏠' },
  { id: 'noun-school', label: '학교', speechText: '학교', partOfSpeech: 'noun', categoryId: 'people', emoji: '🏫' },
  { id: 'noun-hospital', label: '병원', speechText: '병원', partOfSpeech: 'noun', categoryId: 'people', emoji: '🏥' },

  // 5. 감정·상태 (feeling)
  { id: 'noun-happy', label: '기분 좋아요', speechText: '기분 좋아요', partOfSpeech: 'noun', categoryId: 'feeling', emoji: '😊' },
  { id: 'noun-hungry', label: '배고파요', speechText: '배고파요', partOfSpeech: 'noun', categoryId: 'feeling', emoji: '🍽️' },
  { id: 'noun-sick', label: '아파요', speechText: '아파요', partOfSpeech: 'noun', categoryId: 'feeling', emoji: '🩹' },
  { id: 'noun-sleepy', label: '졸려요', speechText: '졸려요', partOfSpeech: 'noun', categoryId: 'feeling', emoji: '😴' },
] as const;

/**
 * @description 우측 보드에 항상 고정되어 움직이는 GIF/모션으로 표시될 핵심 동사·서술어 9종
 */
export const DEFAULT_VERB_CARDS: readonly AacCard[] = [
  {
    id: 'verb-give',
    label: '주세요',
    speechText: '주세요',
    partOfSpeech: 'verb',
    emoji: '🤲',
    motionType: 'begging',
  },
  {
    id: 'verb-more',
    label: '더 주세요',
    speechText: '더 주세요',
    partOfSpeech: 'verb',
    emoji: '➕',
    motionType: 'more',
  },
  {
    id: 'verb-eat',
    label: '먹어요',
    speechText: '먹어요',
    partOfSpeech: 'verb',
    emoji: '🥄',
    motionType: 'eating',
  },
  {
    id: 'verb-drink',
    label: '마셔요',
    speechText: '마셔요',
    partOfSpeech: 'verb',
    emoji: '🥤',
    motionType: 'drinking',
  },
  {
    id: 'verb-play',
    label: '하고 싶어요',
    speechText: '하고 싶어요',
    partOfSpeech: 'verb',
    emoji: '🎈',
    motionType: 'playing',
  },
  {
    id: 'verb-open',
    label: '열어 주세요',
    speechText: '열어 주세요',
    partOfSpeech: 'verb',
    emoji: '📦',
    motionType: 'opening',
  },
  {
    id: 'verb-help',
    label: '도와주세요',
    speechText: '도와주세요',
    partOfSpeech: 'verb',
    emoji: '🤝',
    motionType: 'helping',
  },
  {
    id: 'verb-refuse',
    label: '싫어요',
    speechText: '싫어요',
    partOfSpeech: 'verb',
    emoji: '🙅',
    motionType: 'refusing',
  },
  {
    id: 'verb-greet',
    label: '안녕하세요',
    speechText: '안녕하세요',
    partOfSpeech: 'verb',
    emoji: '👋',
    motionType: 'greeting',
  },
] as const;
