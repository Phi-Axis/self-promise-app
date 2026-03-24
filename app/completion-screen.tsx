import { View, Text, SafeAreaView } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";


import { useColors } from "../hooks/use-colors";

export default function CompletionScreen() {
  const router = useRouter();
  const colors = useColors();

  useEffect(() => {
    // 4秒間完了画面を表示してからホーム画面に戻す
    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ gap: 24, alignItems: "center" }}>
          {/* メッセージ */}
          <View style={{ gap: 12, alignItems: "center" }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.foreground }}>
              できた
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
