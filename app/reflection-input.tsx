import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
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
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 }}>
          <View style={{ width: "100%", maxWidth: 320, gap: 16 }}>
            {/* 約束表示 */}
            <View style={{ gap: 16 }}>
              <Text style={{ fontSize: 22, fontWeight: "600", color: colors.foreground, textAlign: "center", lineHeight: 32, marginBottom: 16 }}>
                {promise?.promiseText}
              </Text>
            </View>

            {/* 入力エリア */}
            <TextInput
              value={text}
              onChangeText={(t) => {
                setText(t);
                setError("");
              }}
              placeholder="感想を書いてください"
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={4}
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
                minHeight: 80,
              }}
            />
            {error && (
              <Text style={{ fontSize: 14, color: colors.error, textAlign: "center" }}>{error}</Text>
            )}

            {/* ボタン */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={handleCancel}
                disabled={isLoading}
                style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 20, alignItems: "center", backgroundColor: "#FFFBF7" }}
              >
                <Text style={{ fontSize: 14, color: colors.foreground }}>キャンセル</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                disabled={isLoading || !text.trim()}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                  alignItems: "center",
                  backgroundColor: text.trim() ? "#A89968" : "#A89968",
                  opacity: isLoading || !text.trim() ? 0.5 : 1,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={{ fontSize: 14, color: "white" }}>保存</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
