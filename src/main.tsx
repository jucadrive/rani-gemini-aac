import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './assets/global.css';

/**
 * @description React 18 애플리케이션 진입점
 * StrictMode로 마운트하여 부수 효과(Side-effect)와 라이프사이클 안정성을 검증합니다.
 */
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('루트 DOM 엘리먼트(#root)를 찾을 수 없습니다.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

