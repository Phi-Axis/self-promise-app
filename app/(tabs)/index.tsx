import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ScreenContainer } from "../../components/screen-container";
import { usePromise } from "../../lib/promise-context";
import { useColors } from "../../hooks/use-colors";
import { useNotifications } from "../../hooks/use-notifications";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { promise, isLoading, error } = usePromise();
  const { scheduleNotification } = useNotifications();

  useEffect(() => {
    scheduleNotification();
  }, [scheduleNotification]);

  const state = promise?.status || "empty";

  const handleCreatePromise = () => {
    router.push("/promise-input" as const);
  };

  const handleMarkAsChecked = () => {
    router.push("/mark-checked" as const);
  };

  const handleAddReflection = () => {
    router.push("/reflection-input" as const);
  };

  const handleViewArchived = () => {
    router.push("/archived-folder");
  };

  const handleSettings = () => {
    router.push("/settings");
    setTimeout(() => scheduleNotification(), 500);
  };

  if (isLoading) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="px-6 flex-col">
      {/* メインコンテンツ - 中央配置 */}
      <View className="flex-1 justify-center items-center">
        {/* State: Empty - 約束がない状態 */}
        {state === "empty" && (
          <View className="items-center gap-8">
            {/* メッセージ */}
            <Text className="text-base text-muted text-center">
              自分を信じることから始まる
            </Text>
            
            {/* ボタン */}
            <TouchableOpacity
              onPress={handleCreatePromise}
              activeOpacity={0.7}
            >
              <View 
                className="px-10 py-4 rounded-full items-center"
                style={{
                  backgroundColor: "#F5EDE3",
                  borderWidth: 1,
                  borderColor: "#E8D7C8",
                }}
              >
                <Text className="text-base text-foreground font-medium">
                  今日の約束を書く
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* State: Active - 約束が入力済み（未完了） */}
        {state === "active" && (
          <View className="w-full max-w-sm items-center gap-12">
            {/* 約束表示 */}
            <View className="w-full gap-4">
              <Text className="text-xs text-muted tracking-widest uppercase text-center">
                今日の約束
              </Text>
              <Text className="text-lg text-foreground text-center leading-relaxed">
                {promise?.promiseText}
              </Text>
            </View>
            
            {/* ボタン */}
            <TouchableOpacity
              onPress={handleMarkAsChecked}
              activeOpacity={0.7}
            >
              <View 
                className="px-10 py-4 rounded-full items-center"
                style={{
                  backgroundColor: "#D4E5D4",
                  borderWidth: 1,
                  borderColor: "#C0D9C0",
                }}
              >
                <Text className="text-base text-foreground font-medium">
                  できた
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* State: Checked - 完了済み（感想未入力） */}
        {state === "checked" && (
          <View className="w-full max-w-sm items-center gap-12">
            {/* 約束表示 */}
            <View className="w-full gap-4">
              <Text className="text-xs text-muted tracking-widest uppercase text-center">
                完了しました
              </Text>
              <Text className="text-lg text-foreground text-center leading-relaxed">
                {promise?.promiseText}
              </Text>
            </View>
            
            {/* ボタン */}
            <TouchableOpacity
              onPress={handleAddReflection}
              activeOpacity={0.7}
            >
              <View 
                className="px-10 py-4 rounded-full items-center"
                style={{
                  backgroundColor: "#F5EDE3",
                  borderWidth: 1,
                  borderColor: "#E8D7C8",
                }}
              >
                <Text className="text-base text-foreground font-medium">
                  感想を書く
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* State: Archived - 完了済み（感想入力済み） */}
        {state === "archived" && (
          <View className="w-full max-w-sm items-center gap-8">
            {/* 約束表示 */}
            <View className="w-full gap-4">
              <Text className="text-xs text-muted tracking-widest uppercase text-center">
                完了した約束
              </Text>
              <Text className="text-lg text-foreground text-center leading-relaxed">
                {promise?.promiseText}
              </Text>
            </View>
            
            {/* 感想表示 */}
            <View className="w-full gap-4">
              <Text className="text-xs text-muted tracking-widest uppercase text-center">
                感想
              </Text>
              <Text className="text-base text-foreground text-center leading-relaxed italic">
                {promise?.reflectionText}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Error Display */}
      {error && (
        <View className="bg-error bg-opacity-10 rounded-lg p-4 border border-error mb-6">
          <Text className="text-sm text-error">{error}</Text>
        </View>
      )}

      {/* Bottom Navigation - 固定 */}
      <View className="flex-row gap-3 py-6 border-t border-border">
        <TouchableOpacity
          onPress={handleViewArchived}
          className="flex-1 py-3 px-4 rounded-full items-center"
          style={{ backgroundColor: "#FFFBF7" }}
        >
          <Text className="text-sm text-foreground">完了フォルダ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSettings}
          className="flex-1 py-3 px-4 rounded-full items-center"
          style={{ backgroundColor: "#FFFBF7" }}
        >
          <Text className="text-sm text-foreground">設定</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
