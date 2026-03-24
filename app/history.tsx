import { View, Text, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { usePromise } from "../lib/promise-context";
import { useColors } from "../hooks/use-colors";

interface PromiseItem {
  id: string;
  promiseText: string;
  reflectionText?: string;
  createdAt: string;
}

export default function HistoryScreen() {
  const router = useRouter();
  const colors = useColors();
  const { archivedPromises, fetchArchivedPromises, isLoading } = usePromise();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchArchivedPromises();
  }, [fetchArchivedPromises]);

  const handleBack = () => {
    router.back();
  };

  const handleItemPress = (id: string) => {
    setSelectedId(selectedId === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateString;
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
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 }}>
          <TouchableOpacity onPress={handleBack} style={{ position: "absolute", top: 16, left: 24 }}>
            <Text style={{ fontSize: 16, color: colors.foreground }}>← ホームに戻る</Text>
          </TouchableOpacity>

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

  // 新しい順でソート
  const sortedPromises = [...archivedPromises].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const renderItem = ({ item }: { item: PromiseItem }) => {
    const isSelected = selectedId === item.id;

    return (
      <TouchableOpacity
        onPress={() => handleItemPress(item.id)}
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
          {/* 約束 */}
          <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
            {item.promiseText}
          </Text>

          {/* 日付 */}
          <Text style={{ fontSize: 12, color: colors.muted }}>
            {formatDate(item.createdAt)}
          </Text>

          {/* 感想（展開時のみ表示） */}
          {isSelected && item.reflectionText && (
            <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#E8D7C8" }}>
              <Text style={{ fontSize: 14, color: colors.foreground, fontStyle: "italic", lineHeight: 20 }}>
                {item.reflectionText}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 16 }}>
        {/* ヘッダー */}
        <View style={{ marginBottom: 24 }}>
          <TouchableOpacity onPress={handleBack} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: colors.foreground }}>← ホームに戻る</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.foreground }}>
            履歴
          </Text>
        </View>

        {/* リスト */}
        <FlatList
          data={sortedPromises}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
