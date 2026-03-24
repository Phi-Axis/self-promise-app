import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "../components/screen-container";
import { usePromise } from "../lib/promise-context";
import { useColors } from "../hooks/use-colors";

export default function ReflectionInputScreen() {
  const router = useRouter();
  const colors = useColors();
  const { promise, addReflection, isLoading } = usePromise();
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!text.trim()) {
      setError("感想を入力してください（○でも大丈夫です）");
      return;
    }

    try {
      await addReflection(text.trim());
      // 完了画面に遷移
      router.push("/completion-screen");
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
      <ScreenContainer className="p-6">
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-6">
            <View>
              <Text className="text-3xl font-bold text-foreground mb-2">
                感想を書いてみよう
              </Text>
              <Text className="text-sm text-muted">
                夜に、短くても大丈夫。「できた」「気持ちよかった」「○」など
              </Text>
            </View>

            {/* Promise Reference */}
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-xs text-muted mb-2">実行した約束</Text>
              <Text className="text-base font-semibold text-foreground">
                {promise?.promiseText}
              </Text>
            </View>

            <View className="min-h-32">
              <TextInput
                value={text}
                onChangeText={(t) => {
                  setText(t);
                  setError("");
                }}
                placeholder="感想を書いてください..."
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={4}
                maxLength={500}
                editable={!isLoading}
                style={{
                  backgroundColor: colors.surface,
                  color: colors.foreground,
                  borderColor: error ? colors.error : "#E8D7C8",
                  borderWidth: 2,
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 16,
                  fontFamily: "System",
                  textAlignVertical: "top",
                  outline: "none",
                  outlineColor: "#D4C4B0",
                  outlineWidth: 0,
                }}
              />
              {error && (
                <Text className="text-sm text-error mt-2">{error}</Text>
              )}
            </View>

            {/* Spacer to push buttons below keyboard */}
            <View className="flex-1 min-h-8" />

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleCancel}
                disabled={isLoading}
                className="flex-1 py-3 px-4 rounded-lg bg-surface border border-border items-center"
              >
                <Text className="text-base font-semibold text-foreground">キャンセル</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                disabled={isLoading || !text.trim()}
                style={{
                  flex: 1,
                  backgroundColor: colors.primary,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  alignItems: "center",
                  opacity: isLoading || !text.trim() ? 0.6 : 1,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-base font-semibold text-white">保存</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
