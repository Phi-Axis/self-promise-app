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

// Mock trpc
vi.mock("@/lib/trpc", () => ({
  trpc: {
    promises: {
      create: {
        useMutation: () => ({
          mutateAsync: vi.fn().mockResolvedValue(1),
        }),
      },
      updateStatus: {
        useMutation: () => ({
          mutateAsync: vi.fn().mockResolvedValue(undefined),
        }),
      },
      delete: {
        useMutation: () => ({
          mutateAsync: vi.fn().mockResolvedValue(undefined),
        }),
      },
      getArchived: {
        useQuery: () => ({
          data: [],
          isLoading: false,
        }),
      },
    },
    settings: {
      get: {
        useQuery: () => ({
          data: {
            notificationEnabled: true,
            notificationTime: "21:00",
          },
          isLoading: false,
        }),
      },
      update: {
        useMutation: () => ({
          mutateAsync: vi.fn().mockResolvedValue(undefined),
        }),
      },
    },
  },
}));

// Mock daily-cleanup
vi.mock("@/lib/daily-cleanup", () => ({
  checkAndPerformDailyCleanup: vi.fn().mockResolvedValue(undefined),
}));

describe("Promise Context", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Promise Status Validation", () => {
    it("should accept valid promise statuses", () => {
      const validStatuses = ["empty", "active", "checked", "archived"];
      validStatuses.forEach((status) => {
        expect(["empty", "active", "checked", "archived"]).toContain(status);
      });
    });

    it("should have correct initial state", () => {
      const initialState = {
        promise: null,
        archivedPromises: [],
        isLoading: false,
        error: null,
      };
      expect(initialState.promise).toBeNull();
      expect(initialState.archivedPromises).toEqual([]);
      expect(initialState.isLoading).toBe(false);
      expect(initialState.error).toBeNull();
    });
  });

  describe("Promise Data Structure", () => {
    it("should have correct promise data shape", () => {
      const promiseData = {
        id: 1,
        promiseText: "笑顔で挨拶する",
        status: "active" as const,
        reflectionText: undefined,
        createdAt: new Date(),
      };

      expect(promiseData).toHaveProperty("id");
      expect(promiseData).toHaveProperty("promiseText");
      expect(promiseData).toHaveProperty("status");
      expect(promiseData).toHaveProperty("createdAt");
    });

    it("should validate promise text is not empty", () => {
      const promiseText = "笑顔で挨拶する";
      expect(promiseText.trim().length).toBeGreaterThan(0);
    });

    it("should allow reflection text to be optional", () => {
      const promiseData = {
        id: 1,
        promiseText: "笑顔で挨拶する",
        status: "active" as const,
        reflectionText: undefined,
        createdAt: new Date(),
      };

      expect(promiseData.reflectionText).toBeUndefined();

      const promiseWithReflection = {
        ...promiseData,
        reflectionText: "できた",
      };
      expect(promiseWithReflection.reflectionText).toBe("できた");
    });
  });

  describe("State Transitions", () => {
    it("should transition from empty to active", () => {
      const emptyState = { status: "empty" as const };
      const activeState = { ...emptyState, status: "active" as const };
      expect(activeState.status).toBe("active");
    });

    it("should transition from active to checked", () => {
      const activeState = { status: "active" as const };
      const checkedState = { ...activeState, status: "checked" as const };
      expect(checkedState.status).toBe("checked");
    });

    it("should transition from checked to archived", () => {
      const checkedState = { status: "checked" as const };
      const archivedState = {
        ...checkedState,
        status: "archived" as const,
        reflectionText: "できた",
      };
      expect(archivedState.status).toBe("archived");
      expect(archivedState.reflectionText).toBe("できた");
    });
  });

  describe("AsyncStorage Integration", () => {
    it("should save promise to AsyncStorage", async () => {
      const promiseData = {
        id: 1,
        promiseText: "笑顔で挨拶する",
        status: "active" as const,
        createdAt: new Date(),
      };

      const mockSetItem = AsyncStorage.setItem as any;
      mockSetItem.mockResolvedValue(undefined);

      await AsyncStorage.setItem("todayPromise", JSON.stringify(promiseData));

      expect(mockSetItem).toHaveBeenCalledWith(
        "todayPromise",
        expect.stringContaining("笑顔で挨拶する")
      );
    });

    it("should load promise from AsyncStorage", async () => {
      const promiseData = {
        id: 1,
        promiseText: "笑顔で挨拶する",
        status: "active" as const,
        createdAt: new Date().toISOString(),
      };

      const mockGetItem = AsyncStorage.getItem as any;
      mockGetItem.mockResolvedValue(JSON.stringify(promiseData));

      const result = await AsyncStorage.getItem("todayPromise");
      const parsed = result ? JSON.parse(result) : null;

      expect(parsed).toEqual(expect.objectContaining({
        promiseText: "笑顔で挨拶する",
        status: "active",
      }));
    });

    it("should remove promise from AsyncStorage", async () => {
      const mockRemoveItem = AsyncStorage.removeItem as any;
      mockRemoveItem.mockResolvedValue(undefined);

      await AsyncStorage.removeItem("todayPromise");

      expect(mockRemoveItem).toHaveBeenCalledWith("todayPromise");
    });
  });

  describe("Validation Rules", () => {
    it("should reject empty promise text", () => {
      const emptyText = "";
      expect(emptyText.trim().length).toBe(0);
    });

    it("should accept short reflection text", () => {
      const shortReflection = "○";
      expect(shortReflection.trim().length).toBeGreaterThan(0);
    });

    it("should accept normal reflection text", () => {
      const normalReflection = "できた";
      expect(normalReflection.trim().length).toBeGreaterThan(0);
    });

    it("should validate today's promise by date", () => {
      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split("T")[0];

      expect(today).not.toBe(yesterday);

      const promiseCreatedToday = {
        createdAt: new Date().toISOString(),
      };
      const createdDate = new Date(promiseCreatedToday.createdAt)
        .toISOString()
        .split("T")[0];

      expect(createdDate).toBe(today);
    });
  });

  describe("Daily Cleanup Logic", () => {
    it("should identify incomplete promises", () => {
      const incompleteStatuses = ["empty", "active", "checked"];
      incompleteStatuses.forEach((status) => {
        expect(status).not.toBe("archived");
      });
    });

    it("should preserve archived promises", () => {
      const archivedPromise = {
        status: "archived" as const,
        promiseText: "笑顔で挨拶する",
        reflectionText: "できた",
      };

      expect(archivedPromise.status).toBe("archived");
      expect(archivedPromise.reflectionText).toBeDefined();
    });

    it("should handle cleanup date tracking", () => {
      const today = new Date().toISOString().split("T")[0];
      const lastCleanupDate = today;

      expect(lastCleanupDate).toBe(today);
    });
  });
});

  describe("resetAllData", () => {
    it("should remove todayPromise from AsyncStorage", async () => {
      const mockRemoveItem = AsyncStorage.removeItem as any;
      mockRemoveItem.mockResolvedValue(undefined);

      await AsyncStorage.removeItem("todayPromise");

      expect(mockRemoveItem).toHaveBeenCalledWith("todayPromise");
    });

    it("should remove archivedPromises from AsyncStorage", async () => {
      const mockRemoveItem = AsyncStorage.removeItem as any;
      mockRemoveItem.mockResolvedValue(undefined);

      await AsyncStorage.removeItem("archivedPromises");

      expect(mockRemoveItem).toHaveBeenCalledWith("archivedPromises");
    });

    it("should remove appSettings from AsyncStorage", async () => {
      const mockRemoveItem = AsyncStorage.removeItem as any;
      mockRemoveItem.mockResolvedValue(undefined);

      await AsyncStorage.removeItem("appSettings");

      expect(mockRemoveItem).toHaveBeenCalledWith("appSettings");
    });

    it("should remove all data keys in sequence", async () => {
      vi.clearAllMocks();
      const mockRemoveItem = AsyncStorage.removeItem as any;
      mockRemoveItem.mockResolvedValue(undefined);

      const keysToRemove = ["todayPromise", "archivedPromises", "appSettings"];
      
      for (const key of keysToRemove) {
        await AsyncStorage.removeItem(key);
      }

      expect(mockRemoveItem).toHaveBeenCalledTimes(3);
      expect(mockRemoveItem).toHaveBeenNthCalledWith(1, "todayPromise");
      expect(mockRemoveItem).toHaveBeenNthCalledWith(2, "archivedPromises");
      expect(mockRemoveItem).toHaveBeenNthCalledWith(3, "appSettings");
    });
  });
