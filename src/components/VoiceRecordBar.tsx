import React, { useRef } from 'react';
import { Alert, Button, Space, Tag, Typography } from 'antd';
import { AudioFilled, AudioMutedOutlined, DeleteOutlined, FolderOpenOutlined, SoundFilled } from '@ant-design/icons';
import { TOUCH_METRICS, WARM_PASTEL_COLORS } from '../utils/constants';

const { Text } = Typography;

/**
 * @description VoiceRecordBar 컴포넌트의 Props 인터페이스
 */
export interface VoiceRecordBarProps {
  /** 현재 대상 문장 텍스트 (예: '빵 먹어요') */
  readonly sentenceText: string;
  /** 해당 문장에 녹음된 아동 음성이 존재하는지 여부 */
  readonly hasRecordedVoice: boolean;
  /** 현재 마이크 녹음 진행 중 여부 */
  readonly isRecording: boolean;
  /** 현재 녹음된 아동 음성이 재생 중인지 여부 */
  readonly isPlayingRecordedVoice: boolean;
  /** 녹음 관련 에러 안내 메시지 */
  readonly recordError: string | null;
  /** 아동 음성 녹음 시작 콜백 */
  readonly onStartRecording: () => void;
  /** 아동 음성 녹음 종료 및 저장 콜백 */
  readonly onStopRecording: () => void;
  /** 오디오 파일 또는 기기 기본 녹음기 파일 선택 콜백 */
  readonly onSelectAudioFile: (file: File | undefined) => void;
  /** 녹음된 아동 음성으로 통합 동작 그림 실행 콜백 */
  readonly onPlayRecordedWithScene: () => void;
  /** 녹음된 아동 음성 삭제 콜백 */
  readonly onDeleteRecording: () => void;
}

/**
 * @description [HR-01, HR-03, HR-05] 아동 음성을 녹음하여 '하나로 합쳐진 실제 동작 그림'에 적용하고 재생하는 프레젠테이셔널 바 컴포넌트
 * @param {VoiceRecordBarProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 아동 음성 녹음 및 재생 컨트롤 바 엘리먼트
 */
export function VoiceRecordBar({
  sentenceText,
  hasRecordedVoice,
  isRecording,
  isPlayingRecordedVoice,
  recordError,
  onStartRecording,
  onStopRecording,
  onSelectAudioFile,
  onPlayRecordedWithScene,
  onDeleteRecording,
}: VoiceRecordBarProps): React.ReactElement {
  const audioFileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div
      aria-label="아동 음성 녹음 컨트롤 바"
      style={{
        marginTop: 12,
        padding: '10px 16px',
        borderRadius: 18,
        backgroundColor: hasRecordedVoice ? '#ECFDF5' : '#FFFDF8',
        border: `2px dashed ${hasRecordedVoice ? WARM_PASTEL_COLORS.VERB_ACCENT : WARM_PASTEL_COLORS.NOUN_CARD_BORDER}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <Space wrap align="center" size="small">
        <Text strong style={{ fontSize: 15, color: WARM_PASTEL_COLORS.TEXT_PRIMARY }}>
          🎤 통합 동작 그림 아동 목소리:
        </Text>

        {!isRecording ? (
          <>
            <Button
              type={hasRecordedVoice ? 'default' : 'primary'}
              icon={<AudioFilled style={{ color: hasRecordedVoice ? '#EF4444' : undefined }} />}
              onClick={onStartRecording}
              style={{
                minHeight: TOUCH_METRICS.MIN_TARGET_SIZE - 6,
                borderRadius: 14,
                fontWeight: 700,
                backgroundColor: hasRecordedVoice ? '#FFFFFF' : '#10B981',
                borderColor: '#10B981',
              }}
            >
              {hasRecordedVoice ? '아동 음성 다시 녹음하기' : '아동 음성 녹음하기'}
            </Button>

            <Button
              icon={<FolderOpenOutlined />}
              onClick={() => audioFileInputRef.current?.click()}
              style={{ minHeight: TOUCH_METRICS.MIN_TARGET_SIZE - 6, borderRadius: 14 }}
            >
              녹음 파일·기기 녹음기
            </Button>
          </>
        ) : (
          <Button
            danger
            type="primary"
            icon={<AudioMutedOutlined />}
            onClick={onStopRecording}
            style={{
              minHeight: TOUCH_METRICS.MIN_TARGET_SIZE - 6,
              borderRadius: 14,
              fontWeight: 700,
              animation: 'gentlePulse 0.8s infinite',
            }}
          >
            ⏹️ 녹음 완료 (“{sentenceText}” 말하는 중... 클릭 시 저장)
          </Button>
        )}

        <input
          ref={audioFileInputRef}
          type="file"
          accept="audio/*"
          capture
          aria-label="아동 음성 파일 또는 기기 녹음기 입력"
          onChange={(e) => {
            onSelectAudioFile(e.target.files?.[0]);
            e.target.value = '';
          }}
          style={{ display: 'none' }}
        />

        {hasRecordedVoice && !isRecording && (
          <>
            <Button
              type="primary"
              icon={<SoundFilled />}
              onClick={onPlayRecordedWithScene}
              style={{
                minHeight: TOUCH_METRICS.MIN_TARGET_SIZE - 6,
                borderRadius: 14,
                fontWeight: 700,
                backgroundColor: WARM_PASTEL_COLORS.VERB_ACCENT,
              }}
            >
              {isPlayingRecordedVoice ? '🔊 아동 목소리 재생 중...' : '👧 아동 목소리로 통합 동작 보기'}
            </Button>

            <Button danger size="small" icon={<DeleteOutlined />} aria-label="녹음된 아동 음성 삭제" onClick={onDeleteRecording} style={{ borderRadius: 12 }}>
              녹음 지우기
            </Button>
          </>
        )}
      </Space>

      {hasRecordedVoice ? (
        <Tag color="green" style={{ borderRadius: 12, fontSize: 13, fontWeight: 600 }}>
          ✓ [② 하나로 합쳐진 실제 동작 그림]에서 녹음된 아동의 실제 목소리가 재생됩니다!
        </Tag>
      ) : (
        <Text type="secondary" style={{ fontSize: 13 }}>
          [아동 음성 녹음하기]를 누르고 아이가 “{sentenceText}”라고 말한 뒤 [⏹️ 녹음 완료]를 눌러주세요!
        </Text>
      )}

      {recordError && <Alert type="warning" showIcon message={recordError} style={{ borderRadius: 12, width: '100%' }} />}
    </div>
  );
}
