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
      <ScreenContainer className="px-6 flex-col">
        {/* メインコンテンツ */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-4">
            {/* 入力エリア */}
            <TextInput
              value={text}
              onChangeText={(t) => {
                setText(t);
                setError("");
              }}
              placeholder="小さな約束を書いてください"
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
                borderRadius: 16,
                padding: 16,
                fontSize: 16,
                fontFamily: "System",
                textAlignVertical: "top",
                outline: "none",
                minHeight: 160,
              }}
            />
            {error && (
              <Text className="text-sm text-error text-center mt-4">{error}</Text>
            )}
          </View>
        </ScrollView>

        {/* ボタン */}
        <View className="flex-row gap-3 py-4">
          <TouchableOpacity
            onPress={handleCancel}
            disabled={isLoading}
            className="flex-1 py-3 px-4 rounded-full items-center"
            style={{ backgroundColor: "#FFFBF7" }}
          >
            <Text className="text-sm text-foreground">キャンセル</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSave}
            disabled={isLoading || !text.trim()}
            className="flex-1 py-3 px-4 rounded-full items-center"
            style={{
              backgroundColor: text.trim() ? "#A89968" : "#A89968",
              opacity: isLoading || !text.trim() ? 0.5 : 1,
            }}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text className="text-sm text-white">保存</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
