import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "../components/screen-container";
import { usePromise } from "../lib/promise-context";

export default function MarkCheckedScreen() {
  const router = useRouter();
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
    <ScreenContainer className="flex-1 px-6">
      {/* 画面全体を中央寄せ */}
      <View className="flex-1 justify-center items-center">
        <View className="items-center gap-8 max-w-xs">
          {/* チェックマーク */}
          <Text className="text-6xl">✓</Text>
          
          {/* 約束表示 */}
          <Text className="text-base text-foreground text-center leading-relaxed">
            {promise?.promiseText}
          </Text>

          {/* ボタン */}
          <View className="flex-row gap-3 w-full">
            <TouchableOpacity
              onPress={handleCancel}
              disabled={isLoading}
              className="flex-1 py-3 px-4 rounded-full items-center"
              style={{ backgroundColor: "#FFFBF7" }}
            >
              <Text className="text-sm text-foreground">戻る</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirm}
              disabled={isLoading}
              className="flex-1 py-3 px-4 rounded-full items-center"
              style={{
                backgroundColor: "#A89968",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-sm text-white">次へ</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
