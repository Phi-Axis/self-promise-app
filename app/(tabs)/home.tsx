import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f5f2ee",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
      }}
    >
      <Pressable
        onPress={() => router.push("/promise-input")}
        style={{
          width: "100%",
          maxWidth: 320,
          height: 140,
          borderRadius: 28,
          borderWidth: 1,
          borderColor: "#d8c8b8",
          backgroundColor: "#efe8df",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: "#5f5f5f",
          }}
        >
          今日の約束を書く
        </Text>
      </Pressable>
    </View>
  );
}
