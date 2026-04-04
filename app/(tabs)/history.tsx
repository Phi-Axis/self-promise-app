import { View, Text, SafeAreaView, FlatList, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { usePromise } from "../../lib/promise-context";
import { useColors } from "../../hooks/use-colors";

interface PromiseItem {
  id: string;
  promiseText: string;
  reflectionText?: string;
  createdAt: string;
}

export default function HistoryScreen() {
  const colors = useColors();
  const { archivedPromises, fetchArchivedPromises, isLoading } = usePromise();

  useEffect(() => {
    fetchArchivedPromises();
  }, [fetchArchivedPromises]);

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (archivedPromises.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 }}>
          <View style={{ alignItems: "center", gap: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
              履歴がありません
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center" }}>
              約束を完了すると、ここに表示されます
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: PromiseItem }) => {
    return (
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: "#E8D7C8",
        }}
      >
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
            {item.promiseText}
          </Text>

          {item.reflectionText ? (
            <View
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: "#E8D7C8",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: colors.foreground,
                  lineHeight: 20,
                }}
              >
                {item.reflectionText}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 16 }}>
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.foreground }}>
            履歴
          </Text>
        </View>

        <FlatList
          data={archivedPromises}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
