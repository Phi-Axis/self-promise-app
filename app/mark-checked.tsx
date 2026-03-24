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

  return (
    <ScreenContainer className="flex-col">
      {/* 「できた」ボタンのみ中央配置 */}
      <View className="flex-1 justify-center items-center px-6">
        <TouchableOpacity
          onPress={handleConfirm}
          disabled={isLoading}
          activeOpacity={0.95}
        >
          <View 
            className="rounded-full px-8 py-3 items-center"
            style={{
              backgroundColor: "#D4E5D4",
              borderWidth: 1,
              borderColor: "#C0D9C0",
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? (
              <ActivityIndicator color="black" size="small" />
            ) : (
              <Text className="text-sm text-foreground">
                できた
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
