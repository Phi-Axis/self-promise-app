import { View, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "../components/screen-container";
import { usePromise } from "../lib/promise-context";
import { useColors } from "../hooks/use-colors";

export default function ReflectionInputScreen() {
  const router = useRouter();
  const colors = useColors();
  const { addReflection } = usePromise();
  const [text, setText] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) return;

    try {
      await addReflection(text.trim());
      router.push("/completion-screen");
    } catch (err) {
      console.error("Failed to add reflection:", err);
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
              placeholder="感想を書いてください"
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={5}
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
                minHeight: 110,
              }}
            />
          </View>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
