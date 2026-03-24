import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { usePromise } from "@/lib/promise-context";
import { useColors } from "@/hooks/use-colors";

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
    <ScreenContainer className="p-6">
      <View className="flex-1 items-center justify-center">
        {/* カード＋ボタンのグループ */}
        <View className="w-full max-w-sm gap-4" style={{ marginTop: -62 }}>
          {/* カード */}
          <View className="w-full bg-surface rounded-2xl p-8 items-center gap-6 border border-border">
            <View className="w-full bg-background rounded-lg p-4 border border-border">
              <Text className="text-xs text-muted mb-2">今日の約束</Text>
              <Text className="text-base font-semibold text-foreground">
                {promise?.promiseText}
              </Text>
            </View>
          </View>

          {/* ボタングループ */}
          <View className="flex-row gap-3 w-full">
            <TouchableOpacity
              onPress={handleCancel}
              disabled={isLoading}
              className="flex-1 py-3 px-4 rounded-lg bg-surface border border-border items-center"
            >
              <Text className="text-base font-semibold text-foreground">キャンセル</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirm}
              disabled={isLoading}
              style={{
                flex: 1,
                backgroundColor: colors.success,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                alignItems: "center",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-base font-semibold text-white">できた ✅</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
