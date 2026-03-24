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
          <TouchableOpacity
            onPress={handleCreatePromise}
            activeOpacity={0.95}
          >
            <View 
              className="rounded-3xl px-8 py-6 items-center"
              style={{
                backgroundColor: "#F5EDE3",
                borderWidth: 1,
                borderColor: "#E8D7C8",
              }}
            >
              <Text className="text-base text-foreground">
                今日の約束を書く
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* State: Active - 約束が入力済み（未完了） */}
        {state === "active" && (
          <View className="items-center gap-8">
            <Text className="text-lg text-foreground text-center leading-relaxed px-4">
              {promise?.promiseText}
            </Text>
            
            <TouchableOpacity
              onPress={handleMarkAsChecked}
              activeOpacity={0.95}
            >
              <View 
                className="rounded-full px-8 py-3 items-center"
                style={{
                  backgroundColor: "#D4E5D4",
                  borderWidth: 1,
                  borderColor: "#C0D9C0",
                }}
              >
                <Text className="text-sm text-foreground">
                  できた
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* State: Checked - 完了済み（感想未入力） */}
        {state === "checked" && (
          <View className="items-center gap-8">
            <Text className="text-7xl">✓</Text>
            
            <Text className="text-lg text-foreground text-center leading-relaxed px-4">
              {promise?.promiseText}
            </Text>
            
            <TouchableOpacity
              onPress={handleAddReflection}
              activeOpacity={0.95}
            >
              <View 
                className="rounded-full px-8 py-3 items-center"
                style={{
                  backgroundColor: "#F5EDE3",
                  borderWidth: 1,
                  borderColor: "#E8D7C8",
                }}
              >
                <Text className="text-sm text-foreground">
                  感想を書く
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* State: Archived - 完了済み（感想入力済み） */}
        {state === "archived" && (
          <View className="items-center gap-6">
            <Text className="text-lg text-foreground text-center leading-relaxed px-4">
              {promise?.promiseText}
            </Text>
            
            <Text className="text-sm text-muted text-center leading-relaxed px-4 italic">
              {promise?.reflectionText}
            </Text>
          </View>
        )}
      </View>

      {/* Error Display */}
      {error && (
        <View className="bg-error bg-opacity-10 rounded-lg p-4 border border-error mb-6">
          <Text className="text-sm text-error">{error}</Text>
        </View>
      )}

      {/* Bottom Navigation */}
      <View className="flex-row gap-2 py-4 border-t border-border">
        <TouchableOpacity
          onPress={handleViewArchived}
          className="flex-1 py-2 px-3 rounded-full items-center"
          style={{ backgroundColor: "#FFFBF7" }}
        >
          <Text className="text-xs text-foreground">完了</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSettings}
          className="flex-1 py-2 px-3 rounded-full items-center"
          style={{ backgroundColor: "#FFFBF7" }}
        >
          <Text className="text-xs text-foreground">設定</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
