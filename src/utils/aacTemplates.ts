import { AacCard, FavoriteSentence, NounCategory, VerbMotionType } from '../types/aac';

/**
 * @description 커스텀 카드 추가 모달에서 제공하는 빠른 선택용 친근한 이모지 목록
 */
export const CUSTOM_CARD_SAMPLE_EMOJIS: readonly string[] = [
  '🍓', '🧀', '🍌', '🍗', '🍦', '🚂', '🦖', '🎨', '🎹', '🐶', '🐱', '🤗',
] as const;

/**
 * @description 동사 커스텀 카드 생성 시 선택할 수 있는 17가지 실제 동작 모션 옵션 목록
 */
export const VERB_MOTION_OPTIONS: { value: VerbMotionType; label: string }[] = [
  { value: 'begging', label: '🤲 주세요 (두 손 모아 받기)' },
  { value: 'eating', label: '🥄 먹어요 (입 벌려 먹기)' },
  { value: 'drinking', label: '🥤 마셔요 (컵 기울여 마시기)' },
  { value: 'riding', label: '🚗 타요 (탈것에 올라타 달리기)' },
  { value: 'takingOut', label: '📤 꺼내요 (상자/가방에서 꺼내기)' },
  { value: 'tearing', label: '🍬 뜯어요 (포장지 양옆으로 뜯기)' },
  { value: 'going', label: '🚶 가요 (목적지를 향해 걸어가기)' },
  { value: 'opening', label: '🚪 열어요 (뚜껑/문 활짝 열기)' },
  { value: 'puttingIn', label: '📥 넣어요 (상자/바구니 안에 넣기)' },
  { value: 'wearing', label: '👕 입어요·신어요 (옷/신발 착용하기)' },
  { value: 'washing', label: '🫧 씻어요 (비누거품으로 씻기)' },
  { value: 'watching', label: '👀 봐요 (집중해서 바라보기)' },
  { value: 'playing', label: '🎈 하고 싶어요·놀아요 (점프하며 놀기)' },
  { value: 'more', label: '➕ 더 주세요 (하나 더 추가하기)' },
  { value: 'helping', label: '🤝 도와주세요 (두 손 맞잡기)' },
  { value: 'refusing', label: '🙅 싫어요 (고개 저으며 거절)' },
  { value: 'greeting', label: '👋 안녕하세요 (손 흔들며 인사)' },
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
 * @description 좌측 보드에 카테고리별로 표시될 기본 명사(무엇을?) 어휘 템플릿 32종
 */
export const DEFAULT_NOUN_CARDS: readonly AacCard[] = [
  // 1. 간식·음식 (food)
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
 * @description 언어재활 현장의 고빈도 동사·서술어 18종 (타다, 꺼내다, 뜯다, 가다, 열다, 넣다, 입다, 씻다, 보다 포함!)
 */
export const DEFAULT_VERB_CARDS: readonly AacCard[] = [
  // 1페이지: 최우선 핵심 고빈도 동사 9종 (주세요, 먹어요, 마셔요, 타요, 꺼내요, 뜯어요, 가요, 열어요, 더 주세요)
  { id: 'verb-give', label: '주세요', speechText: '주세요', partOfSpeech: 'verb', emoji: '🤲', motionType: 'begging' },
  { id: 'verb-eat', label: '먹어요', speechText: '먹어요', partOfSpeech: 'verb', emoji: '🥄', motionType: 'eating' },
  { id: 'verb-drink', label: '마셔요', speechText: '마셔요', partOfSpeech: 'verb', emoji: '🥤', motionType: 'drinking' },
  { id: 'verb-ride', label: '타요', speechText: '타요', partOfSpeech: 'verb', emoji: '🚗', motionType: 'riding' },
  { id: 'verb-takeout', label: '꺼내요', speechText: '꺼내요', partOfSpeech: 'verb', emoji: '📤', motionType: 'takingOut' },
  { id: 'verb-tear', label: '뜯어요', speechText: '뜯어요', partOfSpeech: 'verb', emoji: '🍬', motionType: 'tearing' },
  { id: 'verb-go', label: '가요', speechText: '가요', partOfSpeech: 'verb', emoji: '🚶', motionType: 'going' },
  { id: 'verb-open', label: '열어요', speechText: '열어요', partOfSpeech: 'verb', emoji: '🚪', motionType: 'opening' },
  { id: 'verb-more', label: '더 주세요', speechText: '더 주세요', partOfSpeech: 'verb', emoji: '➕', motionType: 'more' },

  // 2페이지: 확장 고빈도 동사 9종 (넣어요, 입어요, 신어요, 씻어요, 봐요, 하고 싶어요, 도와주세요, 싫어요, 안녕하세요)
  { id: 'verb-putin', label: '넣어요', speechText: '넣어요', partOfSpeech: 'verb', emoji: '📥', motionType: 'puttingIn' },
  { id: 'verb-wear', label: '입어요', speechText: '입어요', partOfSpeech: 'verb', emoji: '👕', motionType: 'wearing' },
  { id: 'verb-shoes-on', label: '신어요', speechText: '신어요', partOfSpeech: 'verb', emoji: '👟', motionType: 'wearing' },
  { id: 'verb-wash', label: '씻어요', speechText: '씻어요', partOfSpeech: 'verb', emoji: '🫧', motionType: 'washing' },
  { id: 'verb-watch', label: '봐요', speechText: '봐요', partOfSpeech: 'verb', emoji: '👀', motionType: 'watching' },
  { id: 'verb-play', label: '하고 싶어요', speechText: '하고 싶어요', partOfSpeech: 'verb', emoji: '🎈', motionType: 'playing' },
  { id: 'verb-help', label: '도와주세요', speechText: '도와주세요', partOfSpeech: 'verb', emoji: '🤝', motionType: 'helping' },
  { id: 'verb-refuse', label: '싫어요', speechText: '싫어요', partOfSpeech: 'verb', emoji: '🙅', motionType: 'refusing' },
  { id: 'verb-greet', label: '안녕하세요', speechText: '안녕하세요', partOfSpeech: 'verb', emoji: '👋', motionType: 'greeting' },
] as const;

/**
 * @description 즐겨찾기 챕터에 기본으로 탑재되는 자주 쓰는 핵심 표현 샘플 2종
 */
export const DEFAULT_FAVORITE_SENTENCES: readonly FavoriteSentence[] = [
  {
    id: 'fav-bread-give',
    sentenceText: '빵 주세요',
    cards: [DEFAULT_NOUN_CARDS[0], DEFAULT_VERB_CARDS[0]],
  },
  {
    id: 'fav-water-drink',
    sentenceText: '물 마셔요',
    cards: [DEFAULT_NOUN_CARDS[2], DEFAULT_VERB_CARDS[2]],
  },
] as const;
