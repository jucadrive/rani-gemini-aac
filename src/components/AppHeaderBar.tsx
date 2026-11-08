import React from 'react';
import { Button, Space, Tag, Typography } from 'antd';
import {
  AppstoreOutlined,
  PlusCircleOutlined,
  SettingOutlined,
  SmileOutlined,
  StarFilled,
} from '@ant-design/icons';
import { APP_META, WARM_PASTEL_COLORS } from '../utils/constants';

const { Title } = Typography;

/**
 * @description AppHeaderBar 컴포넌트의 Props 인터페이스
 */
export interface AppHeaderBarProps {
  /** 현재 명사가 선택되어 2단계(동사 선택)가 활성화되었는지 여부 */
  readonly hasSelectedNoun: boolean;
  /** 현재 즐겨찾기 챕터가 열려 있는지 여부 */
  readonly isFavoritesOpen: boolean;
  /** 저장된 즐겨찾기 표현 개수 */
  readonly favoritesCount: number;
  /** 즐겨찾기 챕터 토글 콜백 */
  readonly onToggleFavorites: () => void;
  /** 새 카드 만들기 모달 열기 콜백 */
  readonly onOpenAddModal: () => void;
  /** 명사 개수·음성 설정 모달 열기 콜백 */
  readonly onOpenSettingsModal: () => void;
}

/**
 * @description [HR-01, HR-03, HR-05] 상단 앱 타이틀, 현재 단계 안내 배지, 즐겨찾기 챕터 및 설정 버튼을 렌더링하는 순수 헤더 컴포넌트
 * @param {AppHeaderBarProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 상단 헤더 바 엘리먼트
 */
export function AppHeaderBar({
  hasSelectedNoun,
  isFavoritesOpen,
  favoritesCount,
  onToggleFavorites,
  onOpenAddModal,
  onOpenSettingsModal,
}: AppHeaderBarProps): React.ReactElement {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <SmileOutlined style={{ fontSize: 28, color: WARM_PASTEL_COLORS.PRIMARY_BRAND }} />
        <Title level={3} style={{ margin: 0, color: WARM_PASTEL_COLORS.TEXT_PRIMARY }}>
          {APP_META.TITLE}
        </Title>
        <Tag color={hasSelectedNoun ? 'green' : 'orange'} style={{ borderRadius: 12, fontWeight: 700, fontSize: 13 }}>
          {hasSelectedNoun ? '2단계: 동사 선택 활성화됨' : '1단계: 명사 집중 선택 모드'}
        </Tag>
      </div>

      <Space size="small" wrap>
        <Button
          type={isFavoritesOpen ? 'primary' : 'default'}
          icon={isFavoritesOpen ? <AppstoreOutlined /> : <StarFilled style={{ color: '#F59E0B' }} />}
          onClick={onToggleFavorites}
          style={{ borderRadius: 14, fontWeight: 700 }}
        >
          {isFavoritesOpen ? '명사·동사 보드로 돌아가기' : `즐겨찾기 챕터 (${favoritesCount})`}
        </Button>
        <Button
          icon={<PlusCircleOutlined />}
          onClick={onOpenAddModal}
          style={{ borderRadius: 14, fontWeight: 600 }}
        >
          새 카드 만들기
        </Button>
        <Button
          icon={<SettingOutlined />}
          onClick={onOpenSettingsModal}
          style={{ borderRadius: 14, fontWeight: 600 }}
        >
          명사 개수·음성 설정
        </Button>
      </Space>
    </header>
  );
}

