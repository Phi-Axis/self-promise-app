import { View, Text, TouchableOpacity, ActivityIndicator, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { usePromise } from "../lib/promise-context";
import { useColors } from "../hooks/use-colors";
import { ConfirmDialog } from "../components/confirm-dialog";

export default function SettingsScreen() {
  const router = useRouter();
  const colors = useColors();
  const { resetAllData, isLoading } = usePromise();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleConfirmReset = async () => {
    setIsResetting(true);
    try {
      await resetAllData();
      setShowConfirm(false);
      // リセット後はホームに戻す
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Failed to reset data:", error);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 16 }}>
        {/* ヘッダー */}
        <View style={{ marginBottom: 32 }}>
          <TouchableOpacity onPress={handleBack} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: colors.foreground }}>← ホームに戻る</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.foreground }}>
            設定
          </Text>
        </View>

        {/* 削除ボタン */}
        <View style={{ gap: 16 }}>
          <TouchableOpacity
            onPress={() => setShowConfirm(true)}
            disabled={isLoading || isResetting}
            style={{
              paddingVertical: 16,
              paddingHorizontal: 20,
              borderRadius: 12,
              alignItems: "center",
              backgroundColor: colors.error,
              opacity: isLoading || isResetting ? 0.6 : 1,
            }}
          >
            {isResetting ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={{ fontSize: 16, color: "white", fontWeight: "600" }}>
                すべて削除
              </Text>
            )}
          </TouchableOpacity>

          <Text style={{ fontSize: 12, color: colors.muted, textAlign: "center", marginTop: 8 }}>
            すべての記録を削除します。この操作は取り消せません。
          </Text>
        </View>
      </View>

      {/* 確認ダイアログ */}
      <ConfirmDialog
        visible={showConfirm}
        title="すべて削除しますか？"
        message="すべての約束と感想の記録が削除されます。この操作は取り消せません。"
        confirmText="削除"
        cancelText="キャンセル"
        isDangerous={true}
        onConfirm={handleConfirmReset}
        onCancel={() => setShowConfirm(false)}
      />
    </SafeAreaView>
  );
}
