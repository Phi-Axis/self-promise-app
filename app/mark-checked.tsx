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
    <ScreenContainer className="px-6">
      <View className="flex-1 flex-col justify-center items-center">
        {/* 中央ブロック */}
        <View className="w-full max-w-sm items-center gap-12">
          {/* チェックマーク */}
          <View className="items-center">
            <Text className="text-7xl">✓</Text>
          </View>
          
          {/* テキスト */}
          <View className="items-center">
            <Text className="text-lg text-foreground">
              できた
            </Text>
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
          
          {/* ボタン */}
          <View className="items-center pt-4">
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={isLoading}
              className="px-10 py-4 rounded-full items-center"
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
      </View>
    </ScreenContainer>
  );
}
