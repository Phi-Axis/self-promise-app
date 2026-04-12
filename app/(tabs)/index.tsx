import { Redirect } from "expo-router";
import { usePromise } from "../../lib/promise-context";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { promise, isLoading } = usePromise();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (promise) {
    return <Redirect href="/mark-checked" />;
  }

  return <Redirect href="/promise-input" />;
}
