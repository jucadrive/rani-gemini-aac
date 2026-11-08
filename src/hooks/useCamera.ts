import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  CameraFacingMode,
  captureVideoFrameToDataUrl,
  processGalleryImageFile,
  startCameraStream,
  stopCameraStream,
} from '../services/cameraService';

/**
 * @description useCamera 커스텀 훅의 반환 인터페이스
 */
export interface UseCameraReturn {
  /** 실시간 카메라 뷰파인더 활성화 여부 */
  readonly isCameraOpen: boolean;
  /** 카메라 스트림 로딩 중 여부 */
  readonly isLoadingCamera: boolean;
  /** 현재 카메라 렌즈 방향 ('environment': 후면, 'user': 전면) */
  readonly facingMode: CameraFacingMode;
  /** 카메라/파일 처리 중 발생한 한국어 안내 에러 메시지 */
  readonly cameraError: string | null;
  /** 실시간 비디오 프리뷰를 연결할 DOM Ref 객체 */
  readonly videoRef: React.RefObject<HTMLVideoElement>;
  /** 실시간 카메라 켜기 함수 */
  readonly openCamera: (mode?: CameraFacingMode) => Promise<void>;
  /** 실시간 카메라 끄기 및 스트림 해제 함수 */
  readonly closeCamera: () => void;
  /** 전면/후면 카메라 전환 함수 */
  readonly toggleFacingMode: () => Promise<void>;
  /** 현재 비디오 화면을 캡처하여 Data URL로 전달하는 함수 */
  readonly capturePhoto: (onCaptured: (dataUrl: string) => void) => void;
  /** 사진첩 또는 기기 카메라에서 선택된 이미지 파일을 Data URL로 변환하는 함수 */
  readonly handleGalleryFile: (
    file: File | undefined,
    onLoaded: (dataUrl: string) => void
  ) => Promise<void>;
  /** 에러 메시지 초기화 함수 */
  readonly clearCameraError: () => void;
}

/**
 * @description [HR-01, HR-03, HR-05] 사진첩 이미지 로드 및 실시간 WebRTC 카메라 촬영을 제어하는 커스텀 훅
 * 컴포넌트가 브라우저 미디어 API나 스토리지/캔버스 서비스를 직접 호출하지 않도록 격리합니다.
 * @returns {UseCameraReturn} 카메라 상태 및 사진 촬영·파일 변환 제어 함수 객체
 */
export function useCamera(): UseCameraReturn {
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isLoadingCamera, setIsLoadingCamera] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<CameraFacingMode>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  /** 카메라 스트림을 안전하게 정리하고 뷰파인더를 닫는 함수 */
  const closeCamera = useCallback((): void => {
    stopCameraStream(streamRef.current);
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
    setIsLoadingCamera(false);
  }, []);

  /** 실시간 카메라 스트림을 시작하고 비디오 엘리먼트에 연결하는 함수 */
  const openCamera = useCallback(
    async (mode?: CameraFacingMode): Promise<void> => {
      const targetMode = mode ?? facingMode;
      stopCameraStream(streamRef.current);
      streamRef.current = null;

      setCameraError(null);
      setFacingMode(targetMode);
      setIsCameraOpen(true);
      setIsLoadingCamera(true);

      const result = await startCameraStream(targetMode);
      if (!result.ok) {
        setCameraError(result.error.message);
        setIsCameraOpen(false);
        setIsLoadingCamera(false);
        return;
      }

      streamRef.current = result.data;
      setIsLoadingCamera(false);

      if (videoRef.current) {
        videoRef.current.srcObject = result.data;
      }
    },
    [facingMode]
  );

  /** 비디오 엘리먼트가 마운트된 직후 스트림을 연결하는 동기화 이펙트 */
  useEffect(() => {
    if (isCameraOpen && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraOpen, isLoadingCamera]);

  /** 컴포넌트 언마운트 시 카메라 LED 및 트랙 자동 종료 */
  useEffect(() => {
    return () => {
      stopCameraStream(streamRef.current);
      streamRef.current = null;
    };
  }, []);

  /** 전면/후면 카메라 렌즈 방향 전환 */
  const toggleFacingMode = useCallback(async (): Promise<void> => {
    const nextMode: CameraFacingMode = facingMode === 'environment' ? 'user' : 'environment';
    await openCamera(nextMode);
  }, [facingMode, openCamera]);

  /** 현재 실시간 비디오 화면을 정사각형 썸네일로 캡처 */
  const capturePhoto = useCallback(
    (onCaptured: (dataUrl: string) => void): void => {
      if (!videoRef.current) {
        setCameraError('카메라 화면이 아직 준비되지 않았어요.');
        return;
      }
      const result = captureVideoFrameToDataUrl(videoRef.current);
      if (!result.ok) {
        setCameraError(result.error.message);
        return;
      }
      onCaptured(result.data);
      closeCamera();
    },
    [closeCamera]
  );

  /** 사진첩(갤러리) 또는 기기 기본 카메라 앱에서 선택한 파일 변환 */
  const handleGalleryFile = useCallback(
    async (file: File | undefined, onLoaded: (dataUrl: string) => void): Promise<void> => {
      if (!file) return;
      setCameraError(null);
      const result = await processGalleryImageFile(file);
      if (!result.ok) {
        setCameraError(result.error.message);
        return;
      }
      closeCamera();
      onLoaded(result.data);
    },
    [closeCamera]
  );

  const clearCameraError = useCallback((): void => {
    setCameraError(null);
  }, []);

  return {
    isCameraOpen,
    isLoadingCamera,
    facingMode,
    cameraError,
    videoRef,
    openCamera,
    closeCamera,
    toggleFacingMode,
    capturePhoto,
    handleGalleryFile,
    clearCameraError,
  };
}
