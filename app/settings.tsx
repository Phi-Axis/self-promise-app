import { View, Text, TouchableOpacity, Switch, ActivityIndicator, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScreenContainer } from "../../components/screen-container";
import { useColors } from "../../hooks/use-colors";
import { useSettings } from "../../hooks/use-settings";
import { usePromise } from "../../lib/promise-context";
import { ConfirmDialog } from "../../components/confirm-dialog";

export default function SettingsScreen() {
  const router = useRouter();
  const colors = useColors();
  const { settings, updateSettings } = useSettings();
  const { resetAllData, resetSettings } = usePromise();
  const [isLoading, setIsLoading] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(settings.notificationEnabled);
  const [notificationTime, setNotificationTime] = useState(settings.notificationTime);
  const [isSaving, setIsSaving] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setNotificationEnabled(settings.notificationEnabled);
    setNotificationTime(settings.notificationTime);
  }, [settings]);

  const handleToggleNotification = async (value: boolean) => {
    setNotificationEnabled(value);
    setIsSaving(true);
    try {
      await updateSettings({
        notificationEnabled: value,
      });
    } catch (error) {
      console.error("Failed to update notification setting:", error);
      setNotificationEnabled(!value);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTimeChange = (direction: "up" | "down") => {
    const [hours, minutes] = notificationTime.split(":").map(Number);
    let newHours = hours;

    if (direction === "up") {
      newHours = (hours + 1) % 24;
    } else {
      newHours = (hours - 1 + 24) % 24;
    }

    const newTime = `${String(newHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    setNotificationTime(newTime);

    setIsSaving(true);
    updateSettings({ notificationTime: newTime })
      .finally(() => setIsSaving(false));
  };

  const handleBack = () => {
    router.back();
  };

  const handleResetAllData = () => {
    console.log('[RESET] handleResetAllData called');
    setShowResetConfirm(true);
  };

  const handleCancelReset = () => {
    console.log('[RESET] User cancelled reset');
    setShowResetConfirm(false);
  };

  const handleConfirmReset = async () => {
    console.log('[RESET] User confirmed reset');
    setShowResetConfirm(false);
    setIsLoading(true);
    try {
      console.log('[RESET] Calling resetAllData()...');
      await resetAllData();
      console.log('[RESET] resetAllData() completed');
      console.log('[RESET] Calling resetSettings()...');
      await resetSettings();
      console.log('[RESET] resetSettings() completed');
      console.log('[RESET] All data reset successfully');
      
      // Wait a bit to ensure localStorage is cleared before navigation
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('[RESET] Reloading page to ensure localStorage is cleared...');
      // Reload the page to ensure localStorage is completely cleared
      window.location.href = '/';
    } catch (error) {
      console.error('[RESET] Error during reset:', error);
      setIsLoading(false);
    }
  }

  return (
    <>
      <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          <TouchableOpacity onPress={handleBack}>
            <Text className="text-base font-semibold text-primary">← ホームに戻る</Text>
          </TouchableOpacity>

          <View>
            <Text className="text-3xl font-bold text-foreground mb-2">
              設定
            </Text>
            <Text className="text-sm text-muted">
              アプリの設定を変更できます
            </Text>
          </View>

          {/* Notification Settings */}
          <View className="bg-surface rounded-lg p-6 border border-border gap-4">
            <View>
              <Text className="text-lg font-semibold text-foreground mb-2">
                夜の通知
              </Text>
              <Text className="text-sm text-muted">
                約束の感想を書くよう、静かに通知します
              </Text>
            </View>

            {/* Toggle */}
            <View className="flex-row items-center justify-between">
              <Text className="text-base text-foreground">通知を有効にする</Text>
              <Switch
                value={notificationEnabled}
                onValueChange={handleToggleNotification}
                disabled={isSaving}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={notificationEnabled ? colors.primary : colors.muted}
              />
            </View>

            {/* Time Selector */}
            {notificationEnabled && (
              <View className="gap-3">
                <Text className="text-sm text-muted">通知時刻</Text>
                <View className="flex-row items-center justify-between bg-background rounded-lg p-4 border border-border">
                  <TouchableOpacity
                    onPress={() => handleTimeChange("down")}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-lg bg-surface border border-border"
                  >
                    <Text className="text-lg font-semibold text-foreground">−</Text>
                  </TouchableOpacity>

                  <Text className="text-2xl font-bold text-foreground">
                    {notificationTime}
                  </Text>

                  <TouchableOpacity
                    onPress={() => handleTimeChange("up")}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-lg bg-surface border border-border"
                  >
                    <Text className="text-lg font-semibold text-foreground">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Reset Button */}
          <TouchableOpacity
            onPress={handleResetAllData}
            disabled={isLoading}
            style={{
              backgroundColor: colors.error,
              paddingVertical: 16,
              paddingHorizontal: 16,
              borderRadius: 8,
              alignItems: "center",
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-base font-semibold text-white">全データをリセット</Text>
            )}
          </TouchableOpacity>

          {/* Info */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted">
              このアプリは、小さな約束を守ることで自信を積み上げるためのシンプルな道具です。
            </Text>
          </View>
        </View>
        </ScrollView>
      </ScreenContainer>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        visible={showResetConfirm}
        title="全データをリセット"
        message="今日の約束と完了フォルダのすべてのデータが削除されます。この操作は取り消せません。"
        onConfirm={handleConfirmReset}
        onCancel={handleCancelReset}
        confirmText="リセット"
        cancelText="キャンセル"
        isDangerous={true}
      />

      {isLoading && (
        <View className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </>
  );
}
