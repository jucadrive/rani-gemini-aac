/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * @description Vite 번들러 및 Vitest 단위 테스트 통합 설정
 * 갤럭시 탭 S4 등 태블릿 배포 및 빠른 컴포넌트 검증을 위해 jsdom 테스트 환경을 함께 구성합니다.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
});

