import { AppError, err, ok, Result } from '../types/common';
import { PHOTO_CAPTURE_CONFIG } from '../utils/constants';

/**
 * @description 카메라 렌즈 방향 타입
 * - 'environment': 태블릿 후면 카메라 (사물·음식·장난감 촬영용 기본값)
 * - 'user': 태블릿 전면 카메라 (아동·가족 얼굴이나 셀프 동작 촬영용)
 */
export type CameraFacingMode = 'environment' | 'user';

/**
 * @description [HR-04, HR-05] 기기 카메라(WebRTC MediaStream)를 시작하는 비동기 서비스 함수
 * @param {CameraFacingMode} facingMode 전면('user') 또는 후면('environment') 카메라 방향
 * @returns {Promise<Result<MediaStream, AppError>>} 성공 시 MediaStream, 실패 시 한국어 안내 에러 반환
 */
export async function startCameraStream(
  facingMode: CameraFacingMode
): Promise<Result<MediaStream, AppError>> {
  try {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return err(
        'CAMERA_NOT_SUPPORTED',
        '현재 브라우저에서 실시간 카메라 기능을 지원하지 않아요. 사진첩에서 선택해 주세요.'
      );
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: facingMode },
        width: { ideal: 640 },
        height: { ideal: 640 },
      },
      audio: false,
    });

    return ok(stream);
  } catch (error: unknown) {
    return err(
      'CAMERA_ACCESS_DENIED',
      '카메라 권한이 거부되었거나 연결된 카메라를 찾을 수 없어요. 권한을 허용하거나 사진첩을 이용해 주세요.',
      error
    );
  }
}

/**
 * @description [HR-04, HR-05] 사용 중인 카메라 MediaStream의 모든 트랙을 안전하게 중지하는 함수
 * @param {MediaStream | null} stream 중지할 카메라 스트림 객체
 * @returns {Result<void, AppError>} 정지 성공 여부 결과 객체
 */
export function stopCameraStream(stream: MediaStream | null): Result<void, AppError> {
  try {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    return ok(undefined);
  } catch (error: unknown) {
    return err('CAMERA_STOP_FAILED', '카메라 종료 중 일시적인 오류가 발생했어요.', error);
  }
}

/**
 * @description 이미지 소스(Video 또는 Image)를 중앙 정사각형으로 크롭하여 320x320 JPEG Data URL로 변환하는 내부 헬퍼
 */
function cropAndCompressToSquareDataUrl(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number
): string | null {
  const targetSize = PHOTO_CAPTURE_CONFIG.THUMBNAIL_SIZE;
  const canvas = document.createElement('canvas');
  canvas.width = targetSize;
  canvas.height = targetSize;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const minSide = Math.min(sourceWidth, sourceHeight);
  const sx = Math.max(0, (sourceWidth - minSide) / 2);
  const sy = Math.max(0, (sourceHeight - minSide) / 2);

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, targetSize, targetSize);
  ctx.drawImage(source, sx, sy, minSide, minSide, 0, 0, targetSize, targetSize);

  return canvas.toDataURL('image/jpeg', PHOTO_CAPTURE_CONFIG.JPEG_QUALITY);
}

/**
 * @description [HR-04, HR-05] 실시간 비디오 엘리먼트의 현재 프레임을 캡처하여 압축된 Data URL로 반환하는 함수
 * @param {HTMLVideoElement} videoElement 현재 재생 중인 비디오 DOM 엘리먼트
 * @returns {Result<string, AppError>} 캡처된 JPEG Data URL 결과 객체
 */
export function captureVideoFrameToDataUrl(
  videoElement: HTMLVideoElement
): Result<string, AppError> {
  try {
    const width = videoElement.videoWidth || PHOTO_CAPTURE_CONFIG.THUMBNAIL_SIZE;
    const height = videoElement.videoHeight || PHOTO_CAPTURE_CONFIG.THUMBNAIL_SIZE;
    const dataUrl = cropAndCompressToSquareDataUrl(videoElement, width, height);

    if (!dataUrl) {
      return err('CAPTURE_CANVAS_UNAVAILABLE', '화면을 사진으로 변환하는 데 실패했어요.');
    }
    return ok(dataUrl);
  } catch (error: unknown) {
    return err('VIDEO_CAPTURE_FAILED', '카메라 화면을 캡처하는 중 오류가 발생했어요.', error);
  }
}

/**
 * @description [HR-04, HR-05] 사진첩(갤러리) 또는 기기 카메라 파일 입력을 읽어 최적화된 Data URL로 변환하는 함수
 * 움직이는 GIF는 원본 애니메이션을 그대로 유지하고, 일반 고화질 사진은 로컬 스토리지 용량 보호를 위해 320x320으로 리사이징합니다.
 * @param {File} file 사용자가 선택한 이미지 파일 객체
 * @returns {Promise<Result<string, AppError>>} 변환된 이미지 Data URL 결과 객체
 */
export async function processGalleryImageFile(file: File): Promise<Result<string, AppError>> {
  try {
    if (!file.type.startsWith('image/') && !file.name.toLowerCase().endsWith('.gif')) {
      return err('INVALID_IMAGE_FILE', '사진 또는 GIF 이미지 파일만 등록할 수 있어요.');
    }

    const rawDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') resolve(reader.result);
        else reject(new Error('FILE_READ_EMPTY'));
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

    const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');
    if (isGif) {
      return ok(rawDataUrl);
    }

    const compressedDataUrl = await new Promise<string>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const resized = cropAndCompressToSquareDataUrl(
          img,
          img.naturalWidth || PHOTO_CAPTURE_CONFIG.THUMBNAIL_SIZE,
          img.naturalHeight || PHOTO_CAPTURE_CONFIG.THUMBNAIL_SIZE
        );
        resolve(resized ?? rawDataUrl);
      };
      img.onerror = () => resolve(rawDataUrl);
      img.src = rawDataUrl;
    });

    return ok(compressedDataUrl);
  } catch (error: unknown) {
    return err('FILE_PROCESS_FAILED', '사진 파일을 불러오는 중 오류가 발생했어요.', error);
  }
}

