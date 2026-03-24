import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "../components/screen-container";
import { usePromise } from "../lib/promise-context";
import { useColors } from "../hooks/use-colors";

export default function MarkCheckedScreen() {
  const router = useRouter();
  const colors = useColors();
  const { promise, markAsChecked, isLoading } = usePromise();

  const handleConfirm = async () => {
    try {
      await markAsChecked();
      router.replace("/reflection-input");
    } catch (error) {
      console.error("Failed to mark as checked:", error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ScreenContainer className="px-6 flex-col">
      {/* ヘッダー */}
      <View className="pt-8 pb-12">
        <Text className="text-2xl font-bold text-foreground">できた</Text>
      </View>

      {/* メインコンテンツ - 中央配置 */}
      <View className="flex-1 justify-center items-center px-4">
        <View className="w-full max-w-sm items-center gap-12">
          {/* チェックマーク */}
          <View className="items-center">
            <Text className="text-7xl">✓</Text>
          </View>
          
          {/* 約束表示 */}
          <View className="w-full gap-3">
            <Text className="text-xs text-muted tracking-widest uppercase text-center">
              今日の約束
            </Text>
            <Text className="text-base text-foreground text-center leading-relaxed">
              {promise?.promiseText}
            </Text>
          </View>
        </View>
      </View>

      {/* ボタン */}
      <View className="flex-row gap-3 py-6">
        <TouchableOpacity
          onPress={handleCancel}
          disabled={isLoading}
          className="flex-1 py-4 px-4 rounded-full items-center"
          style={{ backgroundColor: "#FFFBF7" }}
        >
          <Text className="text-base text-foreground font-semibold">戻る</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleConfirm}
          disabled={isLoading}
          className="flex-1 py-4 px-4 rounded-full items-center"
          style={{
            backgroundColor: "#A89968",
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-base text-white font-semibold">次へ</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
