import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import { useColors } from '@/hooks/use-colors';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'キャンセル',
  isDangerous = false,
}: ConfirmDialogProps) {
  const colors = useColors();

  // useCallback で関数参照を安定化
  const handleConfirmClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('[CONFIRM-DIALOG] Confirm button clicked');
    onConfirm();
  }, [onConfirm]);

  const handleCancelClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('[CONFIRM-DIALOG] Cancel button clicked');
    onCancel();
  }, [onCancel]);

  const handleBackgroundClick = useCallback(() => {
    console.log('[CONFIRM-DIALOG] Background clicked');
    onCancel();
  }, [onCancel]);

  // Web 版では Modal が正しく動作しないため、条件分岐
  if (Platform.OS === 'web' && visible) {
    // Web 版: シンプルな div ベースのダイアログ
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '16px',
        }}
        onClick={handleBackgroundClick}
      >
        <div
          style={{
            backgroundColor: colors.background,
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: '320px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.25)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title */}
          <div
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: colors.foreground,
              marginBottom: '12px',
            }}
          >
            {title}
          </div>

          {/* Message */}
          <div
            style={{
              fontSize: '14px',
              color: colors.muted,
              marginBottom: '24px',
              lineHeight: '20px',
              whiteSpace: 'pre-wrap',
            }}
          >
            {message}
          </div>

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
            }}
          >
            {/* Cancel Button */}
            <button
              onClick={handleCancelClick}
              style={{
                paddingTop: '10px',
                paddingBottom: '10px',
                paddingLeft: '16px',
                paddingRight: '16px',
                borderRadius: '8px',
                backgroundColor: colors.surface,
                color: colors.foreground,
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              {cancelText}
            </button>

            {/* Confirm Button */}
            <button
              onClick={handleConfirmClick}
              style={{
                paddingTop: '10px',
                paddingBottom: '10px',
                paddingLeft: '16px',
                paddingRight: '16px',
                borderRadius: '8px',
                backgroundColor: isDangerous ? colors.error : colors.primary,
                color: '#ffffff',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ネイティブ版: React Native Modal を使用
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        }}
      >
        <View
          style={{
            backgroundColor: colors.background,
            borderRadius: 12,
            padding: 24,
            width: '100%',
            maxWidth: 320,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          {/* Title */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: colors.foreground,
              marginBottom: 12,
            }}
          >
            {title}
          </Text>

          {/* Message */}
          <Text
            style={{
              fontSize: 14,
              color: colors.muted,
              marginBottom: 24,
              lineHeight: 20,
            }}
          >
            {message}
          </Text>

          {/* Buttons */}
          <View
            style={{
              flexDirection: 'row',
              gap: 12,
              justifyContent: 'flex-end',
            }}
          >
            {/* Cancel Button */}
            <TouchableOpacity
              onPress={onCancel}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor: colors.surface,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: colors.foreground,
                }}
              >
                {cancelText}
              </Text>
            </TouchableOpacity>

            {/* Confirm Button */}
            <TouchableOpacity
              onPress={onConfirm}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor: isDangerous ? colors.error : colors.primary,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#ffffff',
                }}
              >
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
