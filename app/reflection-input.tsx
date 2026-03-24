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
      setError("感想を入力してください");
      return;
    }

    try {
      await addReflection(text.trim());
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
      <ScreenContainer className="px-6 flex-col">
        {/* ヘッダー */}
        <View className="pt-8 pb-12">
          <Text className="text-2xl font-bold text-foreground mb-2">
            感想を書いてみよう
          </Text>
          <Text className="text-sm text-muted">
            夜に、短くても大丈夫。「できた」「気持ちよかった」「○」など
          </Text>
        </View>

        {/* メインコンテンツ */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-4">
            {/* 約束表示 */}
            <View className="gap-6 mb-8">
              <View className="gap-3">
                <Text className="text-xs text-muted tracking-widest uppercase">
                  実行した約束
                </Text>
                <Text className="text-base text-foreground text-center leading-relaxed">
                  {promise?.promiseText}
                </Text>
              </View>
            </View>

            {/* 入力エリア */}
            <View className="gap-6">
              <TextInput
                value={text}
                onChangeText={(t) => {
                  setText(t);
                  setError("");
                }}
                placeholder="感想を書いてください..."
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={5}
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
                  minHeight: 120,
                }}
              />
              {error && (
                <Text className="text-sm text-error text-center">{error}</Text>
              )}
            </View>
          </View>
        </ScrollView>

        {/* ボタン */}
        <View className="flex-row gap-3 py-6">
          <TouchableOpacity
            onPress={handleCancel}
            disabled={isLoading}
            className="flex-1 py-4 px-4 rounded-full items-center"
            style={{ backgroundColor: "#FFFBF7" }}
          >
            <Text className="text-base text-foreground font-semibold">キャンセル</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSave}
            disabled={isLoading || !text.trim()}
            className="flex-1 py-4 px-4 rounded-full items-center"
            style={{
              backgroundColor: text.trim() ? "#A89968" : "#A89968",
              opacity: isLoading || !text.trim() ? 0.5 : 1,
            }}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-base text-white font-semibold">保存</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
