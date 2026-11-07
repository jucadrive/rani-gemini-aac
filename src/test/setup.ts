/**
 * @description Vitest + React Testing Library 초기 환경 설정 파일
 * Ant Design 반응형 컴포넌트가 의존하는 window.matchMedia와 Web Speech API(speechSynthesis)를
 * jsdom 테스트 환경에서 안전하게 사용할 수 있도록 폴리필(Mock)을 주입합니다.
 */
import '@testing-library/jest-dom';
import { vi } from 'vitest';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

if (typeof window.speechSynthesis === 'undefined') {
  Object.defineProperty(window, 'speechSynthesis', {
    writable: true,
    value: {
      speak: vi.fn(),
      cancel: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      getVoices: vi.fn().mockReturnValue([]),
      onvoiceschanged: null,
      speaking: false,
      pending: false,
      paused: false,
    },
  });
}

