import React from 'react';
import { ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { TOUCH_METRICS, WARM_PASTEL_COLORS } from './utils/constants';

/**
 * @description 애플리케이션 최상위 루트 컴포넌트
 * Ant Design의 ConfigProvider를 통해 한국어 로케일과 아동 친화적인 온화한 파스텔 테마 토큰,
 * 그리고 태블릿 터치 타겟 최소 치수(HR-06)를 전역으로 주입합니다.
 * @returns {React.ReactElement} 테마 및 라우터가 적용된 루트 엘리먼트
 */
export function App(): React.ReactElement {
  return (
    <ConfigProvider
      locale={koKR}
      theme={{
        token: {
          colorPrimary: WARM_PASTEL_COLORS.PRIMARY_BRAND,
          colorBgBase: WARM_PASTEL_COLORS.BG_MAIN,
          colorTextBase: WARM_PASTEL_COLORS.TEXT_PRIMARY,
          borderRadius: TOUCH_METRICS.CARD_BORDER_RADIUS,
          controlHeight: TOUCH_METRICS.MIN_TARGET_SIZE,
          fontSize: 16,
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;

