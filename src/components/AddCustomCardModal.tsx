import React, { useState } from 'react';
import { Button, Form, Input, Modal, Radio, Select, Space } from 'antd';
import { useCamera } from '../hooks/useCamera';
import { AacCard, NounCategory, NounCategoryId, VerbMotionType } from '../types/aac';
import { PartOfSpeech } from '../types/common';
import { CUSTOM_CARD_SAMPLE_EMOJIS, VERB_MOTION_OPTIONS } from '../utils/aacTemplates';
import { PhotoCaptureControl } from './PhotoCaptureControl';

/**
 * @description AddCustomCardModal 컴포넌트의 Props 인터페이스
 */
export interface AddCustomCardModalProps {
  /** 모달 열림 여부 */
  readonly open: boolean;
  /** 명사 카테고리 목록 */
  readonly categories: readonly NounCategory[];
  /** 현재 활성화된 명사 카테고리 기본값 */
  readonly defaultCategoryId: NounCategoryId;
  /** 모달 닫기 콜백 */
  readonly onClose: () => void;
  /** 새 카드 저장 콜백 */
  readonly onAddCard: (newCard: AacCard) => void;
}

/**
 * @description [HR-01, HR-03, HR-05] 치료사가 아동 맞춤형 명사/동사 카드(사진첩 업로드 및 실시간 카메라 촬영 포함)를 추가하는 모달
 * @param {AddCustomCardModalProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 커스텀 카드 추가 모달 엘리먼트
 */
export function AddCustomCardModal({
  open,
  categories,
  defaultCategoryId,
  onClose,
  onAddCard,
}: AddCustomCardModalProps): React.ReactElement {
  const [partOfSpeech, setPartOfSpeech] = useState<PartOfSpeech>('noun');
  const [label, setLabel] = useState<string>('');
  const [speechText, setSpeechText] = useState<string>('');
  const [categoryId, setCategoryId] = useState<NounCategoryId>(defaultCategoryId);
  const [emoji, setEmoji] = useState<string>('🍓');
  const [motionType, setMotionType] = useState<VerbMotionType>('begging');
  const [customImageUrl, setCustomImageUrl] = useState<string>('');

  const {
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
  } = useCamera();

  /** 모달 닫기 시 카메라 스트림을 안전하게 종료하는 핸들러 */
  const handleCancel = (): void => {
    closeCamera();
    clearCameraError();
    onClose();
  };

  /** 입력값을 검증하고 새 AAC 카드를 생성하여 상위 컨테이너에 전달하는 핸들러 */
  const handleSubmit = (): void => {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) return;

    const newCard: AacCard = {
      id: `custom-${Date.now()}`,
      label: trimmedLabel,
      speechText: speechText.trim() || trimmedLabel,
      partOfSpeech,
      categoryId: partOfSpeech === 'noun' ? categoryId : undefined,
      emoji,
      motionType: partOfSpeech === 'verb' ? motionType : undefined,
      customImageUrl: customImageUrl || undefined,
      isCustom: true,
    };

    closeCamera();
    clearCameraError();
    onAddCard(newCard);
    setLabel('');
    setSpeechText('');
    setCustomImageUrl('');
    onClose();
  };

  return (
    <Modal
      title="✨ 아동 맞춤형 새 어휘·동작 카드 만들기"
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText="카드 추가하기"
      cancelText="취소"
      okButtonProps={{ disabled: !label.trim() }}
      width={560}
      destroyOnClose
    >
      <Form layout="vertical">
        <Form.Item label="1. 카드 종류 (명사 칸 vs 움직이는 동사 칸)">
          <Radio.Group
            value={partOfSpeech}
            onChange={(e) => setPartOfSpeech(e.target.value as PartOfSpeech)}
            buttonStyle="solid"
          >
            <Radio.Button value="noun">🥐 명사 (왼쪽 사물·음식 칸)</Radio.Button>
            <Radio.Button value="verb">🤲 동사 (오른쪽 동작 칸)</Radio.Button>
          </Radio.Group>
        </Form.Item>

        {partOfSpeech === 'noun' ? (
          <Form.Item label="2. 명사 카테고리 선택">
            <Select
              value={categoryId}
              onChange={(val) => setCategoryId(val)}
              options={categories.map((c) => ({ value: c.id, label: `${c.iconEmoji} ${c.label}` }))}
            />
          </Form.Item>
        ) : (
          <Form.Item label="2. 동사 움직임(동작 모션) 선택">
            <Select value={motionType} onChange={(val) => setMotionType(val)} options={VERB_MOTION_OPTIONS} />
          </Form.Item>
        )}

        <Form.Item label="3. 카드에 표시할 글자 (예: 내 물컵, 엄마, 과자)" required>
          <Input
            placeholder="아동에게 보여줄 단어를 입력하세요"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="4. 음성(TTS)으로 읽어줄 발음 (비워두면 카드 글자와 동일)">
          <Input placeholder="예: 물컵" value={speechText} onChange={(e) => setSpeechText(e.target.value)} />
        </Form.Item>

        <Form.Item label="5. 기본 아이콘 선택 또는 사진첩 / 실시간 카메라로 직접 찍기">
          <Space wrap style={{ marginBottom: 10 }}>
            {CUSTOM_CARD_SAMPLE_EMOJIS.map((item) => (
              <Button
                key={item}
                type={emoji === item && !customImageUrl ? 'primary' : 'default'}
                onClick={() => {
                  setEmoji(item);
                  setCustomImageUrl('');
                }}
              >
                {item}
              </Button>
            ))}
          </Space>

          <PhotoCaptureControl
            customImageUrl={customImageUrl}
            isCameraOpen={isCameraOpen}
            isLoadingCamera={isLoadingCamera}
            facingMode={facingMode}
            cameraError={cameraError}
            videoRef={videoRef}
            onOpenCamera={() => void openCamera()}
            onCloseCamera={closeCamera}
            onToggleFacingMode={() => void toggleFacingMode()}
            onCapturePhoto={() => capturePhoto((url) => setCustomImageUrl(url))}
            onSelectFile={(file) => void handleGalleryFile(file, (url) => setCustomImageUrl(url))}
            onClearPhoto={() => setCustomImageUrl('')}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
