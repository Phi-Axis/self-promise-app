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
      // チェックを完了した後、感想入力画面に直接遷移
      router.replace("/reflection-input");
    } catch (error) {
      console.error("Failed to mark as checked:", error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ScreenContainer className="px-6">
      <View className="flex-1 flex-col">
        {/* 上部余白 */}
        <View className="flex-1" />
        
        {/* チェックマーク */}
        <View className="items-center mb-12">
          <Text className="text-6xl mb-8">✓</Text>
          <Text className="text-lg text-foreground text-center">
            できました
          </Text>
        </View>
        
        {/* 約束表示 */}
        <View className="gap-6 mb-12">
          <View className="gap-3">
            <Text className="text-xs text-muted tracking-wide">今日の約束</Text>
            <Text className="text-base text-foreground leading-relaxed">
              {promise?.promiseText}
            </Text>
          </View>
        </View>
        
        {/* 下部余白 */}
        <View className="flex-1" />
        
        {/* ボタン */}
        <View className="flex-row gap-3 pb-4">
          <TouchableOpacity
            onPress={handleCancel}
            disabled={isLoading}
            className="flex-1 py-3 px-4 rounded-full items-center"
            style={{ backgroundColor: "#FFFBF7" }}
          >
            <Text className="text-base text-foreground">戻る</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleConfirm}
            disabled={isLoading}
            className="flex-1 py-3 px-4 rounded-full items-center"
            style={{
              backgroundColor: "#D4E5D4",
              borderWidth: 1,
              borderColor: "#C0D9C0",
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.foreground} />
            ) : (
              <Text className="text-base text-foreground font-medium">次へ</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}
