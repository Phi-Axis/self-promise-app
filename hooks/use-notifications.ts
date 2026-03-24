import { useEffect, useCallback } from "react";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { trpc } from "@/lib/trpc";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications() {
  const getSettingsQuery = trpc.settings.get.useQuery();

  const scheduleNotification = useCallback(async () => {
    try {
      if (!getSettingsQuery.data?.notificationEnabled) {
        return;
      }

      const [hours, minutes] = getSettingsQuery.data.notificationTime.split(":").map(Number);

      // Cancel existing notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Schedule daily notification (1回のみ)
      const trigger = {
        type: "calendar" as const,
        hour: hours,
        minute: minutes,
        repeats: true,
      };

      // Get current promise status to determine notification message
      const storedPromise = await AsyncStorage.getItem("todayPromise");
      let notificationBody = "今日の約束";
      
      if (storedPromise) {
        const promise = JSON.parse(storedPromise);
        // If promise is checked but reflection not added, show reflection reminder
        if (promise.status === "checked" && !promise.reflectionText) {
          notificationBody = "○でもいいよ";
        } else {
          // Always use "今日の約束" for consistency (no question marks)
          notificationBody = "今日の約束";
        }
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "",
          body: notificationBody,
          data: { type: "reflection_reminder" },
        },
        trigger: trigger as any,
      });
    } catch (error) {
      console.error("Failed to schedule notification:", error);
    }
  }, [getSettingsQuery.data]);

  useEffect(() => {
    scheduleNotification();
  }, [getSettingsQuery.data, scheduleNotification]);

  return { scheduleNotification, isLoading: getSettingsQuery.isLoading };
}
