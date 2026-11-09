import { useCallback, useEffect, useRef, useState } from 'react';
import {
  abortAudioRecordingSession, ActiveRecordingSession, playAudioDataUrl,
  processAudioFile, startAudioRecordingSession, stopAudioElement, stopAudioRecordingSession,
} from '../services/audioRecordService';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../services/storageService';
import { VOICE_RECORD_CONFIG } from '../utils/constants';

/**
 * @description useVoiceRecorder 커스텀 훅의 반환 인터페이스
 */
export interface UseVoiceRecorderReturn {
  /** 현재 마이크 녹음 진행 중 여부 */
  readonly isRecording: boolean;
  /** 현재 녹음된 아동 음성 재생 중 여부 */
  readonly isPlayingRecordedVoice: boolean;
  /** 마이크 권한 또는 녹음 처리 에러 메시지 */
  readonly recordError: string | null;
  /** 특정 문장에 녹음된 아동 음성이 존재하는지 확인하는 함수 */
  readonly hasRecordedVoice: (sentenceText: string) => boolean;
  /** 특정 문장에 대한 아동 음성 녹음을 시작하는 함수 */
  readonly startRecording: (sentenceText: string, onSaved?: () => void) => Promise<void>;
  /** 진행 중인 녹음을 완료하고 해당 문장에 저장하는 함수 */
  readonly stopRecordingAndSave: (sentenceText: string, onSaved?: () => void) => Promise<void>;
  /** 오디오 파일(또는 기기 기본 녹음기 파일)을 문장 음성으로 등록하는 함수 */
  readonly handleAudioFile: (sentenceText: string, file: File | undefined, onSaved?: () => void) => Promise<void>;
  /** 특정 문장에 저장된 아동 음성을 재생하는 함수 (녹음본이 있어 재생 시 true 반환) */
  readonly playRecordedVoice: (sentenceText: string) => boolean;
  /** 특정 문장에 저장된 아동 음성을 삭제하는 함수 */
  readonly deleteRecordedVoice: (sentenceText: string) => void;
  /** 녹음 및 재생을 모두 즉시 중단하는 함수 */
  readonly stopVoiceAll: () => void;
}

/**
 * @description [HR-01, HR-03, HR-05] 문장별 아동 음성 녹음·저장 및 '하나로 합쳐진 실제 동작 그림' 재생을 제어하는 커스텀 훅
 * @returns {UseVoiceRecorderReturn} 아동 음성 녹음 상태 및 제어 함수 객체
 */
export function useVoiceRecorder(): UseVoiceRecorderReturn {
  const [recordedMap, setRecordedMap] = useState<Record<string, string>>(() => {
    const loaded = loadFromStorage<Record<string, string>>(STORAGE_KEYS.RECORDED_VOICES, {});
    return loaded.ok ? loaded.data : {};
  });
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPlayingRecordedVoice, setIsPlayingRecordedVoice] = useState<boolean>(false);
  const [recordError, setRecordError] = useState<string | null>(null);

  const recordedMapRef = useRef<Record<string, string>>(recordedMap);
  recordedMapRef.current = recordedMap;

  const sessionRef = useRef<ActiveRecordingSession | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const maxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearMaxTimer = (): void => {
    if (maxTimerRef.current) {
      clearTimeout(maxTimerRef.current);
      maxTimerRef.current = null;
    }
  };

  /** 녹음 및 오디오 재생을 모두 안전하게 정지 */
  const stopVoiceAll = useCallback((): void => {
    clearMaxTimer();
    abortAudioRecordingSession(sessionRef.current);
    sessionRef.current = null;
    stopAudioElement(audioRef.current);
    audioRef.current = null;
    setIsRecording(false);
    setIsPlayingRecordedVoice(false);
  }, []);

  useEffect(() => () => stopVoiceAll(), [stopVoiceAll]);

  /** 특정 문장에 녹음된 아동 음성이 있는지 여부 반환 */
  const hasRecordedVoice = useCallback(
    (sentenceText: string): boolean => Boolean(sentenceText && recordedMap[sentenceText]),
    [recordedMap]
  );

  /** 특정 문장에 저장된 아동 음성을 단독 재생 */
  const playRecordedVoice = useCallback((sentenceText: string): boolean => {
    const dataUrl = recordedMapRef.current[sentenceText];
    if (!dataUrl) return false;

    stopAudioElement(audioRef.current);
    setIsPlayingRecordedVoice(true);

    const res = playAudioDataUrl(dataUrl, () => setIsPlayingRecordedVoice(false));
    if (!res.ok) {
      setIsPlayingRecordedVoice(false);
      setRecordError(res.error.message);
      return false;
    }
    audioRef.current = res.data;
    return true;
  }, []);

  /** 변환된 Data URL을 스토리지에 저장하고 즉시 재생하는 내부 헬퍼 */
  const saveAndPlayDataUrl = useCallback(
    (sentenceText: string, dataUrl: string, onSaved?: () => void): void => {
      const next = { ...recordedMapRef.current, [sentenceText]: dataUrl };
      recordedMapRef.current = next;
      saveToStorage(STORAGE_KEYS.RECORDED_VOICES, next);
      setRecordedMap(next);

      onSaved?.();
      stopAudioElement(audioRef.current);
      setIsPlayingRecordedVoice(true);
      const playRes = playAudioDataUrl(dataUrl, () => setIsPlayingRecordedVoice(false));
      if (playRes.ok) audioRef.current = playRes.data;
    },
    []
  );

  /** 진행 중인 녹음을 종료하고 문장 키로 저장한 뒤 즉시 재생 */
  const stopRecordingAndSave = useCallback(
    async (sentenceText: string, onSaved?: () => void): Promise<void> => {
      clearMaxTimer();
      const activeSession = sessionRef.current;
      sessionRef.current = null;
      if (!activeSession || !sentenceText) {
        setIsRecording(false);
        return;
      }

      const res = await stopAudioRecordingSession(activeSession);
      setIsRecording(false);
      if (!res.ok) {
        setRecordError(res.error.message);
        return;
      }
      saveAndPlayDataUrl(sentenceText, res.data, onSaved);
    },
    [saveAndPlayDataUrl]
  );

  /** 아동 음성 녹음 시작 (최대 6초 후 자동 완료 보호 타이머 포함) */
  const startRecording = useCallback(
    async (sentenceText: string, onSaved?: () => void): Promise<void> => {
      stopVoiceAll();
      setRecordError(null);

      const res = await startAudioRecordingSession();
      if (!res.ok) {
        setRecordError(res.error.message);
        return;
      }

      sessionRef.current = res.data;
      setIsRecording(true);
      maxTimerRef.current = setTimeout(() => {
        void stopRecordingAndSave(sentenceText, onSaved);
      }, VOICE_RECORD_CONFIG.MAX_DURATION_MS);
    },
    [stopRecordingAndSave, stopVoiceAll]
  );

  /** 오디오 파일 또는 기기 녹음기 앱으로 녹음한 파일 등록 */
  const handleAudioFile = useCallback(
    async (sentenceText: string, file: File | undefined, onSaved?: () => void): Promise<void> => {
      if (!file || !sentenceText) return;
      stopVoiceAll();
      setRecordError(null);
      const res = await processAudioFile(file);
      if (!res.ok) {
        setRecordError(res.error.message);
        return;
      }
      saveAndPlayDataUrl(sentenceText, res.data, onSaved);
    },
    [saveAndPlayDataUrl, stopVoiceAll]
  );

  /** 특정 문장에 저장된 아동 음성 삭제 */
  const deleteRecordedVoice = useCallback((sentenceText: string): void => {
    stopAudioElement(audioRef.current);
    setIsPlayingRecordedVoice(false);
    const next = { ...recordedMapRef.current };
    delete next[sentenceText];
    recordedMapRef.current = next;
    saveToStorage(STORAGE_KEYS.RECORDED_VOICES, next);
    setRecordedMap(next);
  }, []);

  return {
    isRecording, isPlayingRecordedVoice, recordError, hasRecordedVoice,
    startRecording, stopRecordingAndSave, handleAudioFile, playRecordedVoice,
    deleteRecordedVoice, stopVoiceAll,
  };
}
