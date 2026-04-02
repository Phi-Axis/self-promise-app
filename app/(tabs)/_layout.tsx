import "../../global.css";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="history" options={{ title: "履歴" }} />
      <Tabs.Screen name="settings" options={{ title: "設定" }} />
      <Tabs.Screen name="home" options={{ href: null }} />
    </Tabs>
  );
}
