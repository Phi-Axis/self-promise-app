import { View, Text, TouchableOpacity, ActivityIndicator, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
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
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
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
          <View className="items-center gap-6 max-w-xs">
            <Text className="text-base text-foreground text-center leading-relaxed">
              {promise?.promiseText}
            </Text>
            
            <TouchableOpacity
              onPress={handleMarkAsChecked}
              activeOpacity={0.95}
            >
              <View 
                className="rounded-full px-6 py-2 items-center"
                style={{
                  backgroundColor: "#D4E5D4",
                  borderWidth: 1,
                  borderColor: "#C0D9C0",
                }}
              >
                <Text className="text-xs text-foreground">
                  できた
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* State: Checked */}
        {state === "checked" && (
          <View className="items-center gap-6 max-w-xs">
            <Text className="text-6xl">✓</Text>
            
            <Text className="text-base text-foreground text-center leading-relaxed">
              {promise?.promiseText}
            </Text>
            
            <TouchableOpacity
              onPress={handleAddReflection}
              activeOpacity={0.95}
            >
              <View 
                className="rounded-full px-6 py-2 items-center"
                style={{
                  backgroundColor: "#F5EDE3",
                  borderWidth: 1,
                  borderColor: "#E8D7C8",
                }}
              >
                <Text className="text-xs text-foreground">
                  感想を書く
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* State: Archived */}
        {state === "archived" && (
          <View className="items-center gap-4 max-w-xs">
            <Text className="text-base text-foreground text-center leading-relaxed">
              {promise?.promiseText}
            </Text>
            
            <Text className="text-xs text-muted text-center leading-relaxed italic">
              {promise?.reflectionText}
            </Text>
          </View>
        )}
      </View>

      {/* Error Display */}
      {error && (
        <View className="bg-error bg-opacity-10 rounded-lg p-4 border border-error m-6">
          <Text className="text-sm text-error">{error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
