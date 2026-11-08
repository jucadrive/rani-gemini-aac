import React, { useRef } from 'react';
import { Alert, Button, Space, Typography } from 'antd';
import { CameraOutlined, DeleteOutlined, MobileOutlined, PictureOutlined, RetweetOutlined } from '@ant-design/icons';
import { TOUCH_METRICS, WARM_PASTEL_COLORS } from '../utils/constants';

const { Text } = Typography;

/**
 * @description PhotoCaptureControl 컴포넌트의 Props 인터페이스
 */
export interface PhotoCaptureControlProps {
  /** 현재 선택되거나 촬영된 커스텀 사진/GIF Data URL */
  readonly customImageUrl: string;
  /** 실시간 카메라 뷰파인더 열림 여부 */
  readonly isCameraOpen: boolean;
  /** 카메라 스트림 로딩 중 여부 */
  readonly isLoadingCamera: boolean;
  /** 현재 카메라 렌즈 방향 ('environment': 후면, 'user': 전면) */
  readonly facingMode: 'environment' | 'user';
  /** 카메라/파일 처리 에러 메시지 */
  readonly cameraError: string | null;
  /** 비디오 DOM Ref */
  readonly videoRef: React.RefObject<HTMLVideoElement>;
  /** 실시간 카메라 열기 콜백 */
  readonly onOpenCamera: () => void;
  /** 실시간 카메라 닫기 콜백 */
  readonly onCloseCamera: () => void;
  /** 전면/후면 카메라 전환 콜백 */
  readonly onToggleFacingMode: () => void;
  /** 현재 실시간 카메라 화면 촬영 콜백 */
  readonly onCapturePhoto: () => void;
  /** 사진첩 또는 태블릿 카메라 파일 선택 콜백 */
  readonly onSelectFile: (file: File | undefined) => void;
  /** 등록된 사진 제거 콜백 */
  readonly onClearPhoto: () => void;
}

/**
 * @description [HR-01, HR-03, HR-05] 사진첩(갤러리) 이미지 업로드 및 실시간 카메라 촬영 UI를 제공하는 순수 프레젠테이셔널 컴포넌트
 * @param {PhotoCaptureControlProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 사진첩 및 카메라 촬영 컨트롤 엘리먼트
 */
export function PhotoCaptureControl({
  customImageUrl,
  isCameraOpen,
  isLoadingCamera,
  facingMode,
  cameraError,
  videoRef,
  onOpenCamera,
  onCloseCamera,
  onToggleFacingMode,
  onCapturePhoto,
  onSelectFile,
  onClearPhoto,
}: PhotoCaptureControlProps): React.ReactElement {
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div
      style={{
        padding: 12,
        borderRadius: 16,
        backgroundColor: '#FFFDF8',
        border: `1.5px dashed ${WARM_PASTEL_COLORS.NOUN_CARD_BORDER}`,
      }}
    >
      {/* 1. 사진첩 선택 / 실시간 카메라 / 태블릿 카메라 앱 버튼 영역 */}
      <Space wrap size="small">
        <Button
          icon={<PictureOutlined />}
          onClick={() => galleryInputRef.current?.click()}
          style={{ minHeight: 42, borderRadius: 12, fontWeight: 600 }}
        >
          사진첩에서 사진·GIF 고르기
        </Button>

        <Button
          type={isCameraOpen ? 'primary' : 'default'}
          icon={<CameraOutlined />}
          loading={isLoadingCamera}
          onClick={() => (isCameraOpen ? onCloseCamera() : onOpenCamera())}
          style={{ minHeight: 42, borderRadius: 12, fontWeight: 600 }}
        >
          {isCameraOpen ? '실시간 카메라 닫기' : '실시간 카메라로 찍기'}
        </Button>

        <Button
          icon={<MobileOutlined />}
          onClick={() => nativeCameraInputRef.current?.click()}
          style={{ minHeight: 42, borderRadius: 12 }}
        >
          기기 카메라 앱 열기
        </Button>
      </Space>

      {/* 숨겨진 파일 입력 (1: 갤러리 일반 사진/움짤, 2: 태블릿 후면 카메라 직접 실행) */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*,.gif"
        aria-label="사진첩에서 사진 선택 파일 입력"
        onChange={(e) => { onSelectFile(e.target.files?.[0]); e.target.value = ''; }}
        style={{ display: 'none' }}
      />
      <input
        ref={nativeCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        aria-label="기기 카메라 직접 촬영 입력"
        onChange={(e) => { onSelectFile(e.target.files?.[0]); e.target.value = ''; }}
        style={{ display: 'none' }}
      />

      {/* 2. 카메라 권한/파일 오류 안내 */}
      {cameraError && <Alert type="warning" showIcon message={cameraError} style={{ marginTop: 10, borderRadius: 12 }} />}

      {/* 3. 실시간 카메라 뷰파인더 화면 */}
      {isCameraOpen && (
        <div
          aria-label="실시간 카메라 촬영 화면"
          style={{ marginTop: 12, padding: 12, borderRadius: 16, backgroundColor: '#1F2937', textAlign: 'center' }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              maxWidth: 260,
              height: 220,
              objectFit: 'cover',
              borderRadius: 14,
              border: '3px solid #FFFFFF',
              transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
              backgroundColor: '#111827',
            }}
          />
          <div style={{ marginTop: 10 }}>
            <Space wrap>
              <Button
                type="primary"
                size="large"
                icon={<CameraOutlined />}
                onClick={onCapturePhoto}
                style={{ minHeight: TOUCH_METRICS.MIN_TARGET_SIZE, borderRadius: 14, fontWeight: 700 }}
              >
                찰칵! 사진 찍기
              </Button>
              <Button icon={<RetweetOutlined />} onClick={onToggleFacingMode} style={{ minHeight: 44, borderRadius: 14 }}>
                {facingMode === 'environment' ? '전면 카메라로 전환' : '후면 카메라로 전환'}
              </Button>
            </Space>
          </div>
        </div>
      )}

      {/* 4. 촬영 완료 또는 사진첩에서 선택된 사진 미리보기 */}
      {customImageUrl && (
        <div
          aria-label="선택된 사진 미리보기"
          style={{
            marginTop: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '10px 14px',
            borderRadius: 14,
            backgroundColor: '#FFFFFF',
            border: `2px solid ${WARM_PASTEL_COLORS.VERB_ACCENT}`,
          }}
        >
          <img
            src={customImageUrl}
            alt="등록할 카드 사진 미리보기"
            style={{ width: 68, height: 68, objectFit: 'cover', borderRadius: 12 }}
          />
          <div style={{ flex: 1 }}>
            <Text strong style={{ color: WARM_PASTEL_COLORS.VERB_ACCENT, display: 'block' }}>
              ✓ 실제 사진/움짤이 카드에 적용되었어요!
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              이 사진이 단어 보드와 통합 동작 애니메이션에 표시됩니다.
            </Text>
          </div>
          <Button danger size="small" icon={<DeleteOutlined />} onClick={onClearPhoto}>
            사진 지우기
          </Button>
        </div>
      )}
    </div>
  );
}
