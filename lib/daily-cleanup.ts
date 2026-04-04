import AsyncStorage from "@react-native-async-storage/async-storage";

export async function checkAndPerformDailyCleanup() {
  try {
    const stored = await AsyncStorage.getItem("todayPromise");

    if (!stored) {
      return;
    }

    const promise = JSON.parse(stored);
    const promiseDate = new Date(promise.createdAt).toISOString().split("T")[0];
    const today = new Date().toISOString().split("T")[0];

    if (promiseDate !== today && promise.status !== "archived") {
      await AsyncStorage.removeItem("todayPromise");
    }
  } catch (error) {
    console.error("Failed to perform daily cleanup:", error);
  }
}
