import { TtsSettings, TtsStatusListener } from '../types/aac';
import { AppError, err, ok, Result } from '../types/common';
import { DEFAULT_TTS_CONFIG } from '../utils/constants';

/** 현재 등록된 발화 상태 구독자 집합 */
const listeners = new Set<TtsStatusListener>();
/** 연속 문장 발화("빵" + "주세요" -> "빵 주세요") 예약 타이머 ID */
let sentenceTimerId: ReturnType<typeof setTimeout> | null = null;

/**
 * @description 발화 상태 변경을 모든 구독자(UI 컴포넌트)에게 브로드캐스트합니다.
 * @param isSpeaking 현재 음성 출력 중인지 여부
 * @param speakingText 현재 읽고 있는 한국어 텍스트
 */
function notifyStatus(isSpeaking: boolean, speakingText: string): void {
  listeners.forEach((listener) => {
    listener({ isSpeaking, speakingText });
  });
}

/**
 * @description 한국어 TTS 보이스의 자연스러움(품질) 점수를 계산하는 순수 함수
 * 신경망(Natural/Neural), 온라인 고품질 음성, 삼성/구글 한국어 기본 엔진 순으로 가중치를 부여합니다.
 * @param voice 평가할 SpeechSynthesisVoice 객체
 * @returns {number} 품질 점수 (높을수록 고품질)
 */
export function scoreKoreanVoiceQuality(voice: SpeechSynthesisVoice): number {
  const lang = (voice.lang || '').toLowerCase();
  if (!lang.includes('ko')) {
    return -1;
  }

  let score = 10;
  const name = (voice.name || '').toLowerCase();
  const uri = (voice.voiceURI || '').toLowerCase();

  if (name.includes('natural') || name.includes('neural')) score += 50;
  if (name.includes('sunhi') || name.includes('injoon') || name.includes('yuna')) score += 35;
  if (name.includes('google') && lang.includes('ko')) score += 30;
  if (name.includes('samsung') || uri.includes('samsung') || uri.includes('smt')) score += 25;
  if (name.includes('online') || !voice.localService) score += 15;
  if (voice.default) score += 5;

  return score;
}

/**
 * @description 기기에서 사용 가능한 한국어 음성 목록을 품질 점수 내림차순으로 정렬하여 반환합니다.
 * @returns {Result<SpeechSynthesisVoice[], AppError>} 정렬된 한국어 음성 배열
 */
export function getAvailableKoreanVoices(): Result<SpeechSynthesisVoice[], AppError> {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return err('TTS_NOT_SUPPORTED', '이 브라우저는 음성 합성(TTS) 기능을 지원하지 않습니다.');
    }
    const allVoices = window.speechSynthesis.getVoices();
    const koreanVoices = allVoices
      .filter((v) => scoreKoreanVoiceQuality(v) > 0)
      .sort((a, b) => scoreKoreanVoiceQuality(b) - scoreKoreanVoiceQuality(a));

    return ok(koreanVoices);
  } catch (cause) {
    return err('TTS_VOICE_LOAD_ERROR', '음성 목록을 불러오는 중 오류가 발생했습니다.', cause);
  }
}

/**
 * @description 설정된 선호 보이스 또는 최고 품질 점수의 한국어 보이스를 자동 선택합니다.
 * @param preferredURI 사용자가 지정한 보이스 URI (선택)
 * @returns {SpeechSynthesisVoice | null} 선택된 최적 한국어 보이스
 */
export function selectBestKoreanVoice(preferredURI?: string): SpeechSynthesisVoice | null {
  const result = getAvailableKoreanVoices();
  if (!result.ok || result.data.length === 0) {
    return null;
  }
  if (preferredURI) {
    const matched = result.data.find((v) => v.voiceURI === preferredURI);
    if (matched) return matched;
  }
  return result.data[0];
}

/**
 * @description 진행 중인 모든 발화 및 예약된 연속 문장 타이머를 즉시 중단합니다.
 * @returns {Result<boolean, AppError>} 중단 성공 여부
 */
export function stopSpeaking(): Result<boolean, AppError> {
  try {
    if (sentenceTimerId !== null) {
      clearTimeout(sentenceTimerId);
      sentenceTimerId = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    notifyStatus(false, '');
    return ok(true);
  } catch (cause) {
    return err('TTS_CANCEL_ERROR', '음성 출력을 중지하는 중 오류가 발생했습니다.', cause);
  }
}

/**
 * @description 단일 단어 또는 문장을 고품질 한국어 억양으로 즉시 발화합니다.
 * @param text 발화할 한국어 텍스트
 * @param settings TTS 속도·음높이·볼륨 설정
 * @param onFinish 발화가 정상 종료되었을 때 실행할 후속 콜백 (선택)
 * @returns {Result<boolean, AppError>} 발화 요청 성공 여부
 */
export function speakText(
  text: string,
  settings: Partial<TtsSettings> = {},
  onFinish?: () => void
): Result<boolean, AppError> {
  try {
    const trimmed = text.trim();
    if (!trimmed) {
      return err('TTS_EMPTY_TEXT', '읽을 텍스트가 비어 있습니다.');
    }
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return err('TTS_NOT_SUPPORTED', '음성 합성 기능을 지원하지 않는 환경입니다.');
    }

    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(trimmed);
    utterance.lang = DEFAULT_TTS_CONFIG.LANG;
    utterance.rate = settings.rate ?? DEFAULT_TTS_CONFIG.DEFAULT_RATE;
    utterance.pitch = settings.pitch ?? DEFAULT_TTS_CONFIG.DEFAULT_PITCH;
    utterance.volume = settings.volume ?? DEFAULT_TTS_CONFIG.DEFAULT_VOLUME;

    const bestVoice = selectBestKoreanVoice(settings.preferredVoiceURI);
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.onstart = () => notifyStatus(true, trimmed);
    utterance.onend = () => {
      notifyStatus(false, '');
      if (onFinish) onFinish();
    };
    utterance.onerror = () => notifyStatus(false, '');

    window.speechSynthesis.speak(utterance);
    notifyStatus(true, trimmed);
    return ok(true);
  } catch (cause) {
    notifyStatus(false, '');
    return err('TTS_SPEAK_ERROR', '음성을 출력하는 중 오류가 발생했습니다.', cause);
  }
}

/**
 * @description 개별 카드("주세요") 발화 직후 완성된 전체 문장("빵 주세요")을 자연스러운 호흡 간격 뒤 이어서 발화합니다.
 * @param wordText 방금 탭한 카드의 단어 (예: '주세요')
 * @param fullSentenceText 조합 완성된 전체 문장 (예: '빵 주세요')
 * @param settings TTS 설정 객체
 * @returns {Result<boolean, AppError>} 발화 스케줄링 성공 여부
 */
export function speakWordThenSentence(
  wordText: string,
  fullSentenceText: string,
  settings: Partial<TtsSettings> = {}
): Result<boolean, AppError> {
  const shouldAutoRead = settings.autoReadCompletedSentence ?? true;
  const cleanWord = wordText.trim();
  const cleanSentence = fullSentenceText.trim();

  if (!shouldAutoRead || !cleanSentence || cleanWord === cleanSentence) {
    return speakText(cleanWord, settings);
  }

  return speakText(cleanWord, settings, () => {
    sentenceTimerId = setTimeout(() => {
      speakText(cleanSentence, settings);
    }, DEFAULT_TTS_CONFIG.AUTO_SENTENCE_DELAY_MS);
  });
}

/**
 * @description TTS 발화 상태(isSpeaking, speakingText) 변경 리스너를 등록하고 구독 해제 함수를 반환합니다.
 * @param listener 상태 변경 시 호출될 콜백 함수
 * @returns {() => void} 구독 해제(Unsubscribe) 함수
 */
export function subscribeTtsStatus(listener: TtsStatusListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
