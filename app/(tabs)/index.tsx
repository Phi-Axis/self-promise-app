import { View, Text, TouchableOpacity, ActivityIndicator, SafeAreaView, Platform } from "react-native";
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 }}>
        {/* State: Empty */}
        {state === "empty" && (
          <TouchableOpacity
            onPress={handleCreatePromise}
            activeOpacity={0.95}
            style={{ width: "85%" }}
          >
            <View 
              style={{
                borderRadius: 24,
                paddingHorizontal: 24,
                paddingVertical: 28,
                minHeight: 140,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#F5EDE3",
                borderWidth: 1,
                borderColor: "#E8D7C8",
              }}
            >
              <Text style={{ fontSize: 19, color: "#222222", fontWeight: "600" }}>
                今日の約束を書く
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* State: Active */}
        {state === "active" && (
          <View style={{ alignItems: "center", gap: 24, maxWidth: 320 }}>
            <Text style={{ fontSize: 24, color: colors.foreground, textAlign: "center", lineHeight: 32, fontWeight: "700", letterSpacing: 0.5 }}>
              {promise?.promiseText}
            </Text>
            
            <TouchableOpacity
              onPress={handleMarkAsChecked}
              activeOpacity={0.95}
            >
              <View 
                style={{
                  borderRadius: 20,
                  paddingHorizontal: 32,
                  paddingVertical: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#A8E6A3",
                  borderWidth: 1,
                  borderColor: "#98D893",
                }}
              >
                <Text style={{ fontSize: 16, color: "#fff", fontWeight: "600", textAlign: "center", whiteSpace: "nowrap" }}>
                  できた✅
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* State: Checked */}
        {state === "checked" && (
          <View style={{ alignItems: "center", gap: 24, maxWidth: 320 }}>
            <Text style={{ fontSize: 16, color: colors.foreground, textAlign: "center", lineHeight: 24 }}>
              {promise?.promiseText}
            </Text>
            
            <TouchableOpacity
              onPress={handleAddReflection}
              activeOpacity={0.95}
            >
              <View 
                style={{
                  borderRadius: 20,
                  paddingHorizontal: 24,
                  paddingVertical: 8,
                  alignItems: "center",
                  backgroundColor: "#F5EDE3",
                  borderWidth: 1,
                  borderColor: "#E8D7C8",
                }}
              >
                <Text style={{ fontSize: 12, color: colors.foreground }}>
                  感想を書く
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* State: Archived */}
        {state === "archived" && (
          <View style={{ alignItems: "center", gap: 16, maxWidth: 320 }}>
            <Text style={{ fontSize: 16, color: colors.foreground, textAlign: "center", lineHeight: 24 }}>
              {promise?.promiseText}
            </Text>
            
            <Text style={{ fontSize: 12, color: colors.muted, textAlign: "center", lineHeight: 18, fontStyle: "italic" }}>
              {promise?.reflectionText}
            </Text>
          </View>
        )}
      </View>

      {/* Error Display */}
      {error && (
        <View style={{ backgroundColor: colors.error, opacity: 0.1, borderRadius: 8, padding: 16, borderWidth: 1, borderColor: colors.error, margin: 24 }}>
          <Text style={{ fontSize: 14, color: colors.error }}>{error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
