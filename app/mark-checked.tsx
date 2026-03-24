import { View, Text, TouchableOpacity, ActivityIndicator, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 }}>
        <View style={{ alignItems: "center", gap: 32, maxWidth: 320 }}>
          {/* チェックマーク */}
          <Text style={{ fontSize: 48 }}>✓</Text>
          
          {/* 約束表示 */}
          <Text style={{ fontSize: 16, color: colors.foreground, textAlign: "center", lineHeight: 24 }}>
            {promise?.promiseText}
          </Text>

          {/* ボタン */}
          <View style={{ flexDirection: "row", gap: 12, width: "100%" }}>
            <TouchableOpacity
              onPress={handleCancel}
              disabled={isLoading}
              style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 20, alignItems: "center", backgroundColor: "#FFFBF7" }}
            >
              <Text style={{ fontSize: 14, color: colors.foreground }}>戻る</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirm}
              disabled={isLoading}
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 20,
                alignItems: "center",
                backgroundColor: "#A89968",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={{ fontSize: 14, color: "white" }}>次へ</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
