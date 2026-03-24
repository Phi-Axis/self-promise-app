import { View, Text, SafeAreaView } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import Svg, { Circle, Path } from "react-native-svg";

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
          {/* チェックマーク */}
          <View style={{ width: 128, height: 128, alignItems: "center", justifyContent: "center" }}>
            <Svg width={128} height={128} viewBox="0 0 128 128">
              {/* 円形背景 */}
              <Circle cx="64" cy="64" r="60" fill={colors.success} opacity={0.15} />
              {/* チェックマーク */}
              <Path
                d="M 40 65 L 55 80 L 88 45"
                stroke={colors.success}
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
          </View>

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
