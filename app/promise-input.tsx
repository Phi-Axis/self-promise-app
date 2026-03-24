import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "../components/screen-container";
import { usePromise } from "../lib/promise-context";
import { useColors } from "../hooks/use-colors";

export default function PromiseInputScreen() {
  const router = useRouter();
  const colors = useColors();
  const { createPromise, isLoading } = usePromise();
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!text.trim()) {
      setError("約束を入力してください");
      return;
    }

    try {
      await createPromise(text.trim());
      // 約束を保存した後、チェック画面に直接遷移
      router.replace("/mark-checked");
    } catch (err) {
      setError("保存に失敗しました");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScreenContainer className="px-6">
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 flex-col py-8">
            {/* 上部余白 */}
            <View className="h-12" />
            
            {/* メッセージ */}
            <View className="items-center mb-16">
              <Text className="text-base text-muted text-center leading-relaxed">
                小さな約束を書いてください
              </Text>
            </View>

            {/* 入力エリア */}
            <View className="flex-1 gap-4">
              <TextInput
                value={text}
                onChangeText={(t) => {
                  setText(t);
                  setError("");
                }}
                placeholder="笑顔で挨拶する"
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={6}
                maxLength={500}
                editable={!isLoading}
                style={{
                  backgroundColor: colors.surface,
                  color: colors.foreground,
                  borderColor: error ? colors.error : "#E8D7C8",
                  borderWidth: 1,
                  borderRadius: 8,
                  padding: 16,
                  fontSize: 16,
                  fontFamily: "System",
                  textAlignVertical: "top",
                  outline: "none",
                  outlineColor: "#D4C4B0",
                  outlineWidth: 0,
                  minHeight: 120,
                }}
              />
              {error && (
                <Text className="text-sm text-error">{error}</Text>
              )}
            </View>

            {/* 下部余白 */}
            <View className="h-8" />

            {/* ボタン */}
            <View className="flex-row gap-3 pb-4">
              <TouchableOpacity
                onPress={handleCancel}
                disabled={isLoading}
                className="flex-1 py-3 px-4 rounded-full items-center"
                style={{ backgroundColor: "#FFFBF7" }}
              >
                <Text className="text-base text-foreground">キャンセル</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                disabled={isLoading || !text.trim()}
                className="flex-1 py-3 px-4 rounded-full items-center"
                style={{
                  backgroundColor: text.trim() ? "#F5EDE3" : "#F5EDE3",
                  borderWidth: 1,
                  borderColor: "#E8D7C8",
                  opacity: isLoading || !text.trim() ? 0.5 : 1,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.foreground} />
                ) : (
                  <Text className="text-base text-foreground font-medium">保存</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
