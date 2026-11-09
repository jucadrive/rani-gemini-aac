import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  scoreKoreanVoiceQuality,
  selectBestKoreanVoice,
  speakText,
  speakWordThenSentence,
  stopSpeaking,
} from './ttsService';
import { loadFromStorage, removeFromStorage, saveToStorage } from './storageService';

/**
 * @description 테스트를 위한 Mock SpeechSynthesisUtterance 클래스 정의
 */
class MockUtterance {
  public text: string;
  public lang = 'ko-KR';
  public rate = 1;
  public pitch = 1;
  public volume = 1;
  public voice: SpeechSynthesisVoice | null = null;
  public onstart: (() => void) | null = null;
  public onend: (() => void) | null = null;
  public onerror: (() => void) | null = null;

  constructor(text: string) {
    this.text = text;
  }
}

describe('Phase 2: 고품질 한국어 TTS 서비스 및 로컬 스토리지 검증', () => {
  let spokenUtterances: MockUtterance[] = [];

  beforeEach(() => {
    spokenUtterances = [];
    vi.useFakeTimers();

    vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance);

    const mockVoices: SpeechSynthesisVoice[] = [
      {
        name: 'English Default',
        lang: 'en-US',
        voiceURI: 'en-us-basic',
        localService: true,
        default: true,
      },
      {
        name: 'Samsung Korean Basic',
        lang: 'ko-KR',
        voiceURI: 'samsung-ko',
        localService: true,
        default: false,
      },
      {
        name: 'Microsoft SunHi Online (Natural) - Korean',
        lang: 'ko-KR',
        voiceURI: 'ms-sunhi-natural',
        localService: false,
        default: false,
      },
    ];

    Object.defineProperty(window, 'speechSynthesis', {
      writable: true,
      value: {
        speak: vi.fn((utterance: MockUtterance) => {
          spokenUtterances.push(utterance);
          if (utterance.onstart) utterance.onstart();
        }),
        cancel: vi.fn(),
        getVoices: vi.fn().mockReturnValue(mockVoices),
        onvoiceschanged: null,
      },
    });
  });

  afterEach(() => {
    stopSpeaking();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('한국어 음성 중 신경망(Natural/Neural) 고품질 음성을 최우선으로 선택해야 한다', () => {
    const bestVoice = selectBestKoreanVoice();
    expect(bestVoice).not.toBeNull();
    expect(bestVoice?.voiceURI).toBe('ms-sunhi-natural');

    const englishScore = scoreKoreanVoiceQuality({
      name: 'English',
      lang: 'en-US',
      voiceURI: 'en',
      localService: true,
      default: false,
    });
    expect(englishScore).toBe(-1);
  });

  it('단일 어휘("빵")를 탭하면 즉시 해당 어휘를 발화해야 한다', () => {
    const result = speakText('빵');
    expect(result.ok).toBe(true);
    expect(spokenUtterances).toHaveLength(1);
    expect(spokenUtterances[0].text).toBe('빵');
  });

  it('동사("주세요") 탭 시 "주세요" 발화 완료 후 "빵 주세요" 전체 문장을 연속 발화해야 한다', () => {
    const result = speakWordThenSentence('주세요', '빵 주세요', {
      autoReadCompletedSentence: true,
    });

    expect(result.ok).toBe(true);
    expect(spokenUtterances).toHaveLength(1);
    expect(spokenUtterances[0].text).toBe('주세요');

    // 첫 번째 단어("주세요") 발화 완료 이벤트 시뮬레이션
    if (spokenUtterances[0].onend) {
      spokenUtterances[0].onend();
    }

    // 호흡 간격(450ms) 경과 시뮬레이션
    vi.advanceTimersByTime(500);

    expect(spokenUtterances).toHaveLength(2);
    expect(spokenUtterances[1].text).toBe('빵 주세요');
  });

  it('연속 다시 보기(동일 문장 전달) 시 1단계에서 명사+동사 전체 문장을 발화한 뒤 2단계 통합 동작 전환 콜백을 호출해야 한다', () => {
    const onMerged = vi.fn();
    speakWordThenSentence('비눗방울 하고 싶어요', '비눗방울 하고 싶어요', { autoReadCompletedSentence: true }, onMerged);

    expect(spokenUtterances).toHaveLength(1);
    expect(spokenUtterances[0].text).toBe('비눗방울 하고 싶어요');

    if (spokenUtterances[0].onend) spokenUtterances[0].onend();
    vi.advanceTimersByTime(700);

    expect(onMerged).toHaveBeenCalledTimes(1);
  });

  it('storageService가 데이터를 안전하게 저장, 조회, 삭제하고 Result 객체를 반환해야 한다', () => {
    const testKey = 'aac_test_key';
    const saveRes = saveToStorage(testKey, { rate: 0.9 });
    expect(saveRes.ok).toBe(true);

    const loadRes = loadFromStorage(testKey, { rate: 1.0 });
    expect(loadRes.ok).toBe(true);
    if (loadRes.ok) {
      expect(loadRes.data.rate).toBe(0.9);
    }

    const removeRes = removeFromStorage(testKey);
    expect(removeRes.ok).toBe(true);
  });
});
