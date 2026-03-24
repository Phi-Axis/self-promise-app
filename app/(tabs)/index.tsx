import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ScreenContainer } from "../../components/screen-container";
import { usePromise } from "../../lib/promise-context";
import { useColors } from "../../hooks/use-colors";
import { useNotifications } from "../../hooks/use-notifications";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { promise, isLoading, error } = usePromise();
  const { scheduleNotification } = useNotifications();

  useEffect(() => {
    scheduleNotification();
  }, [scheduleNotification]);

  const state = promise?.status || "empty";

  const handleCreatePromise = () => {
    router.push("/promise-input" as const);
  };

  const handleMarkAsChecked = () => {
    router.push("/mark-checked" as const);
  };

  const handleAddReflection = () => {
    router.push("/reflection-input" as const);
  };

  if (isLoading) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="flex-col">
      {/* 1要素だけ中央配置 */}
      <View className="flex-1 justify-center items-center px-6">
        {/* State: Empty */}
        {state === "empty" && (
          <TouchableOpacity
            onPress={handleCreatePromise}
            activeOpacity={0.95}
          >
            <View 
              className="rounded-3xl px-8 py-6 items-center"
              style={{
                backgroundColor: "#F5EDE3",
                borderWidth: 1,
                borderColor: "#E8D7C8",
              }}
            >
              <Text className="text-base text-foreground">
                今日の約束を書く
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* State: Active */}
        {state === "active" && (
          <TouchableOpacity
            onPress={handleMarkAsChecked}
            activeOpacity={0.95}
          >
            <View className="items-center">
              <Text className="text-lg text-foreground text-center leading-relaxed px-4 mb-6">
                {promise?.promiseText}
              </Text>
              <View 
                className="rounded-full px-8 py-3 items-center"
                style={{
                  backgroundColor: "#D4E5D4",
                  borderWidth: 1,
                  borderColor: "#C0D9C0",
                }}
              >
                <Text className="text-sm text-foreground">
                  できた
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* State: Checked */}
        {state === "checked" && (
          <TouchableOpacity
            onPress={handleAddReflection}
            activeOpacity={0.95}
          >
            <View className="items-center">
              <Text className="text-7xl mb-6">✓</Text>
              <Text className="text-lg text-foreground text-center leading-relaxed px-4 mb-6">
                {promise?.promiseText}
              </Text>
              <View 
                className="rounded-full px-8 py-3 items-center"
                style={{
                  backgroundColor: "#F5EDE3",
                  borderWidth: 1,
                  borderColor: "#E8D7C8",
                }}
              >
                <Text className="text-sm text-foreground">
                  感想を書く
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* State: Archived */}
        {state === "archived" && (
          <View className="items-center">
            <Text className="text-lg text-foreground text-center leading-relaxed px-4 mb-4">
              {promise?.promiseText}
            </Text>
            <Text className="text-sm text-muted text-center leading-relaxed px-4 italic">
              {promise?.reflectionText}
            </Text>
          </View>
        )}
      </View>

      {/* Error Display */}
      {error && (
        <View className="bg-error bg-opacity-10 rounded-lg p-4 border border-error mx-6 mb-6">
          <Text className="text-sm text-error">{error}</Text>
        </View>
      )}
    </ScreenContainer>
  );
}
