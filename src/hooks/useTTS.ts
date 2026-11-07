import { useCallback, useEffect, useState } from 'react';
import {
  getAvailableKoreanVoices,
  speakText,
  speakWordThenSentence,
  stopSpeaking,
  subscribeTtsStatus,
} from '../services/ttsService';
import { TtsSettings } from '../types/aac';

/**
 * @description useTTS 커스텀 훅의 반환 인터페이스
 */
export interface UseTtsReturn {
  /** 현재 TTS 음성이 출력 중인지 여부 (파동 애니메이션 표시용) */
  readonly isSpeaking: boolean;
  /** 현재 읽고 있는 한국어 단어 또는 문장 */
  readonly speakingText: string;
  /** 기기에서 감지된 한국어 음성 목록 (고품질 순 정렬) */
  readonly koreanVoices: SpeechSynthesisVoice[];
  /** 단일 어휘 또는 문장을 즉시 발화하는 함수 */
  readonly speak: (text: string) => void;
  /** 방금 누른 동사('주세요') 발화 후 완성된 문장('빵 주세요')을 연속 발화하는 함수 */
  readonly speakWithSentence: (wordText: string, fullSentenceText: string) => void;
  /** 현재 출력 중인 음성을 즉시 중지하는 함수 */
  readonly stop: () => void;
}

/**
 * @description [HR-03, HR-05] 컴포넌트와 ttsService를 연결하는 커스텀 훅
 * 브라우저의 비동기 음성 목록 로드(onvoiceschanged)와 실시간 발화 상태를 안전하게 관리합니다.
 * @param settings 현재 적용할 TTS 속도, 음높이, 선호 목소리 설정
 * @returns {UseTtsReturn} 발화 상태 및 제어 함수 객체
 */
export function useTTS(settings: Partial<TtsSettings> = {}): UseTtsReturn {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingText, setSpeakingText] = useState<string>('');
  const [koreanVoices, setKoreanVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const updateVoices = (): void => {
      const result = getAvailableKoreanVoices();
      if (result.ok) {
        setKoreanVoices(result.data);
      }
    };

    updateVoices();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    const unsubscribe = subscribeTtsStatus((status) => {
      setIsSpeaking(status.isSpeaking);
      setSpeakingText(status.speakingText);
    });

    return () => {
      unsubscribe();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const speak = useCallback(
    (text: string): void => {
      speakText(text, settings);
    },
    [settings]
  );

  const speakWithSentence = useCallback(
    (wordText: string, fullSentenceText: string): void => {
      speakWordThenSentence(wordText, fullSentenceText, settings);
    },
    [settings]
  );

  const stop = useCallback((): void => {
    stopSpeaking();
  }, []);

  return {
    isSpeaking,
    speakingText,
    koreanVoices,
    speak,
    speakWithSentence,
    stop,
  };
}
