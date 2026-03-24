import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Daily cleanup task to remove incomplete promises at midnight (00:00).
 * This ensures that only completed promises are kept in the archive.
 */
export async function performDailyCleanup() {
  try {
    const lastCleanupDate = await AsyncStorage.getItem("lastCleanupDate");
    const today = new Date().toISOString().split("T")[0];

    // Only run once per day
    if (lastCleanupDate === today) {
      return;
    }

    // Get today's promise
    const todayPromise = await AsyncStorage.getItem("todayPromise");

    if (todayPromise) {
      const promise = JSON.parse(todayPromise);

      // Only keep archived promises; remove active or checked promises
      if (promise.status !== "archived") {
        await AsyncStorage.removeItem("todayPromise");
      }
    }

    // Update last cleanup date
    await AsyncStorage.setItem("lastCleanupDate", today);
  } catch (error) {
    console.error("Daily cleanup failed:", error);
  }
}

/**
 * Check if daily cleanup is needed and perform it if necessary.
 * This should be called when the app starts or resumes from background.
 */
export async function checkAndPerformDailyCleanup() {
  try {
    const lastCleanupDate = await AsyncStorage.getItem("lastCleanupDate");
    const today = new Date().toISOString().split("T")[0];

    if (lastCleanupDate !== today) {
      await performDailyCleanup();
    }
  } catch (error) {
    console.error("Failed to check daily cleanup:", error);
  }
}
