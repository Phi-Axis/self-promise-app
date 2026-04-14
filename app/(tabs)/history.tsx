import { View, Text, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
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
  const [openIds, setOpenIds] = useState<string[]>([]);

  useEffect(() => {
    fetchArchivedPromises();
  }, [fetchArchivedPromises]);

  const toggleItem = (id: string) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter((itemId) => itemId !== id));
    } else {
      setOpenIds([...openIds, id]);
    }
  };

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
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
          }}
        >
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
    const isOpen = openIds.includes(item.id);

    return (
      <TouchableOpacity
        onPress={() => toggleItem(item.id)}
        activeOpacity={0.9}
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
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: colors.foreground,
              lineHeight: 22,
              paddingLeft: 10,
           }}
          >
           ✨ {item.promiseText}
          </Text>
          {isOpen && (
            <View
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: "#E8D7C8",
                paddingLeft: 18,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: colors.foreground,
                  lineHeight: 20,
                  fontStyle: "italic",
                }}
              >
                {item.reflectionText ? item.reflectionText : ""}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>

      <View style={{ height: 20 }} />
      
      <FlatList
          data={archivedPromises}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
    </SafeAreaView>
  );
}
