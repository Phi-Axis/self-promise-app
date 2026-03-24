import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScreenContainer } from "../../components/screen-container";
import { usePromise } from "../../lib/promise-context";
import { useColors } from "../../hooks/use-colors";

export default function ArchivedFolderScreen() {
  const router = useRouter();
  const colors = useColors();
  const { archivedPromises, fetchArchivedPromises, isLoading } = usePromise();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchArchivedPromises();
  }, [fetchArchivedPromises]);

  const handleViewDetail = (id: string) => {
    setSelectedId(id);
  };

  const handleBack = () => {
    setSelectedId(null);
  };

  const handleBackToHome = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  const selectedPromise = archivedPromises.find((p) => p.id === selectedId);

  if (selectedPromise) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 gap-6">
          <TouchableOpacity onPress={handleBack}>
            <Text className="text-base font-semibold text-primary">← 戻る</Text>
          </TouchableOpacity>

          <View>
            <Text className="text-3xl font-bold text-foreground mb-2">
              完了した約束
            </Text>
          </View>

          <View className="flex-1 gap-6">
            {/* Promise */}
            <View className="bg-surface rounded-lg p-6 border border-border">
              <Text className="text-sm text-muted mb-3">約束</Text>
              <Text className="text-lg font-semibold text-foreground">
                {selectedPromise.promiseText}
              </Text>
            </View>

            {/* Reflection */}
            <View className="bg-surface rounded-lg p-6 border border-border">
              <Text className="text-sm text-muted mb-3">感想</Text>
              <Text className="text-base text-foreground italic">
                {selectedPromise.reflectionText}
              </Text>
            </View>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <View className="flex-1 gap-6">
        <TouchableOpacity onPress={handleBackToHome}>
          <Text className="text-base font-semibold text-primary">← ホームに戻る</Text>
        </TouchableOpacity>

        <View>
          <Text className="text-3xl font-bold text-foreground mb-2">
            完了フォルダ
          </Text>
          <Text className="text-sm text-muted">
            守れた約束が蓄積されています
          </Text>
        </View>

        {archivedPromises.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg text-muted text-center">
              まだ完了した約束がありません
            </Text>
          </View>
        ) : (
          <FlatList
            data={archivedPromises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleViewDetail(item.id)}
                className="bg-surface rounded-lg p-4 border border-border mb-3"
              >
                <Text className="text-base font-semibold text-foreground mb-2">
                  {item.promiseText}
                </Text>
                <Text className="text-sm text-muted italic">
                  {item.reflectionText}
                </Text>
              </TouchableOpacity>
            )}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ScreenContainer>
  );
}
