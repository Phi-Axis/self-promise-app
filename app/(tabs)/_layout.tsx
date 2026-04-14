import "../../global.css";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 84,
          paddingTop: 10,
          paddingBottom: 16,
          backgroundColor: "#f5f2ee",
          borderTopWidth: 1,
          borderTopColor: "#e3ddd5",
        },
      }}
    >
      
      <Tabs.Screen
        name="history"
        options={{
          title: "履歴",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="list-outline"
              size={28}
              color={focused ? "#a99278" : "#c9c0b4"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home"
              size={28}
              color={focused ? "#a99278" : "#c9c0b4"}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="settings"
        options={{
          title: "設定",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="settings"
              size={28}
              color={focused ? "#a99278" : "#c9c0b4"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
