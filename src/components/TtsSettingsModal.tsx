import React from 'react';
import { Button, Form, Modal, Select, Slider, Switch, Typography } from 'antd';
import { SoundFilled } from '@ant-design/icons';
import { TtsSettings } from '../types/aac';

const { Text } = Typography;

/**
 * @description TtsSettingsModal 컴포넌트의 Props 인터페이스
 */
export interface TtsSettingsModalProps {
  /** 모달 열림 여부 */
  readonly open: boolean;
  /** 현재 TTS 설정값 */
  readonly settings: TtsSettings;
  /** 기기에서 사용 가능한 한국어 음성 목록 */
  readonly koreanVoices: readonly SpeechSynthesisVoice[];
  /** 설정 업데이트 콜백 */
  readonly onUpdateSettings: (partial: Partial<TtsSettings>) => void;
  /** 설정된 목소리로 샘플 문장('빵 주세요') 테스트 발화 콜백 */
  readonly onTestSpeak: (sampleText: string) => void;
  /** 모달 닫기 콜백 */
  readonly onClose: () => void;
}

/**
 * @description [HR-01, HR-03, HR-05] 치료사가 아동의 청각 인지 속도에 맞춰 TTS 음성 엔진, 속도, 음높이를 조절하는 모달
 * @param {TtsSettingsModalProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} TTS 음성 설정 모달 엘리먼트
 */
export function TtsSettingsModal({
  open,
  settings,
  koreanVoices,
  onUpdateSettings,
  onTestSpeak,
  onClose,
}: TtsSettingsModalProps): React.ReactElement {
  return (
    <Modal
      title="🔊 고품질 한국어 음성(TTS) 세부 설정"
      open={open}
      onCancel={onClose}
      footer={[
        <Button
          key="test"
          icon={<SoundFilled />}
          onClick={() => onTestSpeak('빵 주세요')}
        >
          “빵 주세요” 미리 들어보기
        </Button>,
        <Button key="close" type="primary" onClick={onClose}>
          완료
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="한국어 목소리 엔진 선택 (고품질 신경망/삼성/구글 음성 자동 추천)">
          <Select
            placeholder="자동 (가장 자연스러운 한국어 고품질 음성)"
            value={settings.preferredVoiceURI || ''}
            onChange={(val) =>
              onUpdateSettings({ preferredVoiceURI: val || undefined })
            }
            options={[
              { value: '', label: '✨ 자동 선택 (기기 내 최고 품질 한국어 음성)' },
              ...koreanVoices.map((v) => ({
                value: v.voiceURI,
                label: `${v.name} (${v.lang})`,
              })),
            ]}
          />
        </Form.Item>

        <Form.Item
          label={`말하기 속도 (${settings.rate.toFixed(2)}배속 — 언어치료 권장: 0.85 ~ 0.95)`}
        >
          <Slider
            min={0.6}
            max={1.2}
            step={0.05}
            value={settings.rate}
            onChange={(val) => onUpdateSettings({ rate: val })}
            marks={{
              0.6: '천천히(0.6x)',
              0.92: '권장(0.92x)',
              1.2: '빠르게(1.2x)',
            }}
          />
        </Form.Item>

        <Form.Item label={`목소리 톤 / 음높이 (${settings.pitch.toFixed(2)})`}>
          <Slider
            min={0.8}
            max={1.3}
            step={0.05}
            value={settings.pitch}
            onChange={(val) => onUpdateSettings({ pitch: val })}
            marks={{
              0.8: '차분하게',
              1.05: '따뜻하게(권장)',
              1.3: '밝고 높게',
            }}
          />
        </Form.Item>

        <Form.Item label="동사 탭 시 전체 문장 자동 이어읽기">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text type="secondary">
              예: ‘빵’ 선택 후 ‘주세요’를 누르면 “주세요” 발화 직후 “빵 주세요”를 이어서 읽어줍니다.
            </Text>
            <Switch
              checked={settings.autoReadCompletedSentence}
              onChange={(checked) =>
                onUpdateSettings({ autoReadCompletedSentence: checked })
              }
            />
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}

