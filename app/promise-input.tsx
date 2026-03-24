import { View, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "../components/screen-container";
import { usePromise } from "../lib/promise-context";
import { useColors } from "../hooks/use-colors";

export default function PromiseInputScreen() {
  const router = useRouter();
  const colors = useColors();
  const { createPromise } = usePromise();
  const [text, setText] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) return;

    try {
      await createPromise(text.trim());
      router.replace("/mark-checked");
    } catch (err) {
      console.error("Failed to create promise:", err);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScreenContainer className="flex-col">
        {/* 入力欄のみ中央配置 */}
        <View className="flex-1 justify-center items-center px-6">
          <View className="w-full max-w-xs">
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="小さな約束を書いてください"
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={6}
              maxLength={500}
              onSubmitEditing={handleSubmit}
              returnKeyType="done"
              style={{
                backgroundColor: colors.surface,
                color: colors.foreground,
                borderColor: "#E8D7C8",
                borderWidth: 1,
                borderRadius: 16,
                padding: 16,
                fontSize: 16,
                fontFamily: "System",
                textAlignVertical: "top",
                outline: "none",
                minHeight: 140,
              }}
            />
          </View>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
