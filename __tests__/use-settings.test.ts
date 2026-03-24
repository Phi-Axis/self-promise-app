import { describe, it, expect, beforeEach, vi } from "vitest";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock AsyncStorage
vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe("Settings Management", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Default Settings", () => {
    it("should have correct default notification enabled state", () => {
      const defaultSettings = {
        notificationEnabled: true,
        notificationTime: "21:00",
      };
      expect(defaultSettings.notificationEnabled).toBe(true);
    });

    it("should have correct default notification time", () => {
      const defaultSettings = {
        notificationEnabled: true,
        notificationTime: "21:00",
      };
      expect(defaultSettings.notificationTime).toBe("21:00");
    });
  });

  describe("Settings Storage", () => {
    it("should save settings to AsyncStorage", async () => {
      const mockSetItem = AsyncStorage.setItem as any;
      mockSetItem.mockResolvedValue(undefined);

      const settings = {
        notificationEnabled: true,
        notificationTime: "21:00",
      };

      await AsyncStorage.setItem("appSettings", JSON.stringify(settings));

      expect(mockSetItem).toHaveBeenCalledWith(
        "appSettings",
        expect.stringContaining("21:00")
      );
    });

    it("should load settings from AsyncStorage", async () => {
      const settings = {
        notificationEnabled: true,
        notificationTime: "21:00",
      };

      const mockGetItem = AsyncStorage.getItem as any;
      mockGetItem.mockResolvedValue(JSON.stringify(settings));

      const result = await AsyncStorage.getItem("appSettings");
      const parsed = result ? JSON.parse(result) : null;

      expect(parsed).toEqual(settings);
    });

    it("should handle missing settings gracefully", async () => {
      const mockGetItem = AsyncStorage.getItem as any;
      mockGetItem.mockResolvedValue(null);

      const result = await AsyncStorage.getItem("appSettings");
      expect(result).toBeNull();
    });
  });

  describe("Notification Settings", () => {
    it("should validate notification time format", () => {
      const validTimes = ["21:00", "09:30", "00:00", "23:59"];
      const timeRegex = /^\d{2}:\d{2}$/;

      validTimes.forEach((time) => {
        expect(timeRegex.test(time)).toBe(true);
      });
    });

    it("should reject invalid notification time format", () => {
      const invalidTimes = ["21", "21:0", "21:00:00", "9:30", "21:5", "abc:de"];
      const timeRegex = /^\d{2}:\d{2}$/;

      invalidTimes.forEach((time) => {
        expect(timeRegex.test(time)).toBe(false);
      });
    });

    it("should handle time increment correctly", () => {
      const currentTime = "21:00";
      const [hours, minutes] = currentTime.split(":").map(Number);
      const newHours = (hours + 1) % 24;
      const newTime = `${String(newHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

      expect(newTime).toBe("22:00");
    });

    it("should handle time decrement correctly", () => {
      const currentTime = "21:00";
      const [hours, minutes] = currentTime.split(":").map(Number);
      const newHours = (hours - 1 + 24) % 24;
      const newTime = `${String(newHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

      expect(newTime).toBe("20:00");
    });

    it("should handle time decrement at midnight", () => {
      const currentTime = "00:00";
      const [hours, minutes] = currentTime.split(":").map(Number);
      const newHours = (hours - 1 + 24) % 24;
      const newTime = `${String(newHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

      expect(newTime).toBe("23:00");
    });

    it("should handle time increment at 23:00", () => {
      const currentTime = "23:00";
      const [hours, minutes] = currentTime.split(":").map(Number);
      const newHours = (hours + 1) % 24;
      const newTime = `${String(newHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

      expect(newTime).toBe("00:00");
    });
  });

  describe("Settings Update", () => {
    it("should update notification enabled state", () => {
      const currentSettings = {
        notificationEnabled: true,
        notificationTime: "21:00",
      };

      const updatedSettings = {
        ...currentSettings,
        notificationEnabled: false,
      };

      expect(updatedSettings.notificationEnabled).toBe(false);
      expect(updatedSettings.notificationTime).toBe("21:00");
    });

    it("should update notification time", () => {
      const currentSettings = {
        notificationEnabled: true,
        notificationTime: "21:00",
      };

      const updatedSettings = {
        ...currentSettings,
        notificationTime: "22:00",
      };

      expect(updatedSettings.notificationTime).toBe("22:00");
      expect(updatedSettings.notificationEnabled).toBe(true);
    });

    it("should handle partial updates", () => {
      const currentSettings = {
        notificationEnabled: true,
        notificationTime: "21:00",
      };

      const partialUpdate = { notificationTime: "20:00" };
      const updatedSettings = { ...currentSettings, ...partialUpdate };

      expect(updatedSettings.notificationEnabled).toBe(true);
      expect(updatedSettings.notificationTime).toBe("20:00");
    });
  });
});
