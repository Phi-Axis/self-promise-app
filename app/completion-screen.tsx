import { View, Text } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import Svg, { Circle, Path } from "react-native-svg";

import { ScreenContainer } from "../components/screen-container";
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
    <ScreenContainer className="flex items-center justify-center">
      <View className="gap-6 items-center" style={{ marginTop: -60 }}>
        {/* チェックマーク */}
        <View className="w-32 h-32 items-center justify-center">
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
        <View className="gap-3 items-center">
          <Text className="text-3xl font-bold text-foreground">
            できた
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
