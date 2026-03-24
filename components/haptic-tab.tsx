import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import { Platform } from "react-native";

// Haptics は Web では利用不可なため、Platform チェックで条件分岐
let Haptics: any = null;
if (Platform.OS !== "web") {
  try {
    Haptics = require("expo-haptics");
  } catch (e) {
    // Haptics が利用できない環境では無視
  }
}

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        // Web では Haptics を実行しない
        if (Platform.OS === "ios" && Haptics) {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
