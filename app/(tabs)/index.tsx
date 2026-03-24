import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
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
    // Reschedule notifications after settings change
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
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-8">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-4xl font-bold text-foreground">小さな約束</Text>
            <Text className="text-sm text-muted text-center">
              自分を信じることから始まる
            </Text>
          </View>

          {/* Main Content Area - State-based rendering */}
          {state === "empty" && (
            <View className="flex-1 items-center justify-center gap-6">
              <TouchableOpacity
                onPress={handleCreatePromise}
                className="w-full"
                activeOpacity={0.98}
              >
                <View 
                  className="w-full rounded-2xl p-8 items-center gap-4"
                  style={{
                    backgroundColor: "#F5EDE3",
                    borderWidth: 2,
                    borderColor: "#D4C4B0",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.06,
                    shadowRadius: 12,
                    elevation: 5,
                    transform: [{ scale: 1 }],
                  }}
                >
                  <Text className="text-2xl font-semibold text-foreground text-center">
                    今日の約束を書いてみよう
                  </Text>
                  <Text className="text-sm text-muted text-center">
                    小さな約束から始まる。30秒以内で大丈夫です。
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* State B: Active (未完了) */}
          {state === "active" && (
            <View className="flex-1 gap-6">
              <View className="bg-surface rounded-lg p-6 border border-border">
                <Text className="text-sm text-muted mb-3">今日の約束</Text>
                <Text className="text-xl font-semibold text-foreground">
                  {promise?.promiseText}
                </Text>
              </View>

              <View className="flex-1 items-center justify-center gap-4">
                <Text className="text-base text-muted text-center">
                  実行したら「できた」をタップしてください
                </Text>
                <TouchableOpacity
                  onPress={handleMarkAsChecked}
                  style={{ backgroundColor: colors.success }}
                  className="px-8 py-4 rounded-lg"
                >
                  <Text className="text-white font-semibold text-lg">できた ✅</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* State C: Checked (完了・感想未入力) */}
          {state === "checked" && (
            <View className="flex-1 gap-6">
              <View className="bg-success bg-opacity-10 rounded-lg p-6 border border-success">
                <Text className="text-sm text-success mb-3">完了しました</Text>
                <Text className="text-xl font-semibold text-foreground">
                  {promise?.promiseText}
                </Text>
              </View>

              <View className="flex-1 items-center justify-center gap-4">
                <Text className="text-base text-muted text-center">
                  夜に、一言感想を書いてみてください
                </Text>
                <TouchableOpacity
                  onPress={handleAddReflection}
                  style={{ backgroundColor: colors.primary }}
                  className="px-8 py-4 rounded-lg"
                >
                  <Text className="text-white font-semibold text-base">感想を書く</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* State D: Archived (完了・感想入力済み) */}
          {state === "archived" && (
            <View className="flex-1 gap-6">
              <View className="bg-surface rounded-lg p-6 border border-border">
                <Text className="text-sm text-muted mb-3">完了した約束</Text>
                <Text className="text-xl font-semibold text-foreground mb-4">
                  {promise?.promiseText}
                </Text>
                <Text className="text-sm text-muted mb-2">感想</Text>
                <Text className="text-base text-foreground italic">
                  {promise?.reflectionText}
                </Text>
              </View>

              <View className="flex-1 items-center justify-center">
                <Text className="text-base text-muted text-center">
                  完了フォルダに保存されました
                </Text>
              </View>
            </View>
          )}

          {/* Error Display */}
          {error && (
            <View className="bg-error bg-opacity-10 rounded-lg p-4 border border-error">
              <Text className="text-sm text-error">{error}</Text>
            </View>
          )}

          {/* Bottom Navigation */}
          <View className="flex-row gap-3 pt-4 border-t border-border">
            <TouchableOpacity
              onPress={handleViewArchived}
              className="flex-1 py-3 px-4 rounded-lg bg-surface border border-border items-center"
            >
              <Text className="text-sm font-semibold text-foreground">完了フォルダ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSettings}
              className="flex-1 py-3 px-4 rounded-lg bg-surface border border-border items-center"
            >
              <Text className="text-sm font-semibold text-foreground">設定</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
