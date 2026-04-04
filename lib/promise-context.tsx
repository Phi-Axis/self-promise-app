import { createContext, useReducer, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkAndPerformDailyCleanup } from "./daily-cleanup";

export type PromiseStatus = "empty" | "active" | "checked" | "archived";

export interface PromiseData {
  id: string;
  promiseText: string;
  status: PromiseStatus;
  reflectionText?: string;
  createdAt: string;
}

interface PromiseContextType {
  promise: PromiseData | null;
  archivedPromises: PromiseData[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createPromise: (promiseText: string) => Promise<void>;
  markAsChecked: () => Promise<void>;
  addReflection: (reflectionText: string) => Promise<void>;
  fetchArchivedPromises: () => Promise<void>;
  resetPromise: () => Promise<void>;
  deletePromise: (id: string) => Promise<void>;
  resetAllData: () => Promise<void>;
  resetSettings: () => Promise<void>;
}

const PromiseContext = createContext<PromiseContextType | undefined>(undefined);

interface State {
  promise: PromiseData | null;
  archivedPromises: PromiseData[];
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: "SET_PROMISE"; payload: PromiseData }
  | { type: "UPDATE_PROMISE"; payload: Partial<PromiseData> }
  | { type: "SET_ARCHIVED"; payload: PromiseData[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET" };

const initialState: State = {
  promise: null,
  archivedPromises: [],
  isLoading: false,
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_PROMISE":
      return { ...state, promise: action.payload, error: null };
    case "UPDATE_PROMISE":
      return {
        ...state,
        promise: state.promise ? { ...state.promise, ...action.payload } : null,
      };
    case "SET_ARCHIVED":
      return { ...state, archivedPromises: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "RESET":
      return { ...state, promise: null, error: null };
    default:
      return state;
  }
}

export function PromiseProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load promise from AsyncStorage on mount and check for daily cleanup
  useEffect(() => {
    const initializeApp = async () => {
      await checkAndPerformDailyCleanup();
      await loadPromiseFromStorage();
      await loadArchivedPromises();
    };
    initializeApp();
  }, []);

  const loadPromiseFromStorage = useCallback(async () => {
    try {
      // Check if localStorage has been cleared (for reset flow)
      if (typeof localStorage !== 'undefined') {
        const localStorageEmpty = localStorage.length === 0 || localStorage.getItem('todayPromise') === null;
        if (localStorageEmpty) {
          console.log('[PROMISE-CTX] localStorage is empty, skipping load');
          return;
        }
      }
      
      const stored = await AsyncStorage.getItem("todayPromise");
      // Double-check that localStorage is still not empty before loading
      if (typeof localStorage !== 'undefined' && localStorage.length === 0) {
        console.log('[PROMISE-CTX] localStorage was cleared during async operation, skipping load');
        return;
      }
      if (stored) {
        const promise = JSON.parse(stored);
        // Only load if it's today's promise
        const createdDate = new Date(promise.createdAt).toISOString().split("T")[0];
        const today = new Date().toISOString().split("T")[0];
        if (createdDate === today) {
          dispatch({ type: "SET_PROMISE", payload: promise });
        } else {
          // Remove yesterday's promise
          await AsyncStorage.removeItem("todayPromise");
        }
      }
    } catch (error) {
      console.error("Failed to load promise from storage:", error);
    }
  }, []);

  const savePromiseToStorage = useCallback(async (promise: PromiseData) => {
    try {
      await AsyncStorage.setItem("todayPromise", JSON.stringify(promise));
    } catch (error) {
      console.error("Failed to save promise to storage:", error);
      throw error;
    }
  }, []);

  const loadArchivedPromises = useCallback(async () => {
    try {
      // Check if localStorage has been cleared (for reset flow)
      if (typeof localStorage !== 'undefined') {
        const localStorageEmpty = localStorage.length === 0 || localStorage.getItem('archivedPromises') === null;
        if (localStorageEmpty) {
          console.log('[PROMISE-CTX] localStorage is empty, skipping archived load');
          return;
        }
      }
      
      const stored = await AsyncStorage.getItem("archivedPromises");
      // Double-check that localStorage is still not empty before loading
      if (typeof localStorage !== 'undefined' && localStorage.length === 0) {
        console.log('[PROMISE-CTX] localStorage was cleared during async operation, skipping archived load');
        return;
      }
      if (stored) {
        const archived = JSON.parse(stored);
        dispatch({ type: "SET_ARCHIVED", payload: archived });
      }
    } catch (error) {
      console.error("Failed to load archived promises:", error);
    }
  }, []);

  const saveArchivedPromises = useCallback(async (promises: PromiseData[]) => {
    try {
      await AsyncStorage.setItem("archivedPromises", JSON.stringify(promises));
    } catch (error) {
      console.error("Failed to save archived promises:", error);
      throw error;
    }
  }, []);

  const createPromise = useCallback(
    async (promiseText: string) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });
        const today = new Date().toISOString().split("T")[0];

        if (state.promise) {
          const existingDate = new Date(state.promise.createdAt).toISOString().split("T")[0];

          if (existingDate === today) {
            dispatch({ type: "SET_ERROR", payload: "今日はすでに約束があります" });
            return;
          }
        }
        const newPromise: PromiseData = {
          id: Date.now().toString(),
          promiseText,
          status: "active",
          createdAt: new Date().toISOString(),
        };
        
        dispatch({ type: "SET_PROMISE", payload: newPromise });
        await savePromiseToStorage(newPromise);
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "約束の保存に失敗しました" });
        console.error("Failed to create promise:", error);
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [savePromiseToStorage]
  );

  const markAsChecked = useCallback(async () => {
    if (!state.promise) return;

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      
      const updatedPromise = { ...state.promise, status: "checked" as PromiseStatus };
      dispatch({ type: "UPDATE_PROMISE", payload: { status: "checked" } });
      await savePromiseToStorage(updatedPromise);
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "チェックに失敗しました" });
      console.error("Failed to mark as checked:", error);
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.promise, savePromiseToStorage]);

  const addReflection = useCallback(
    async (reflectionText: string) => {
      if (!state.promise) return;

      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });
        
        const updatedPromise: PromiseData = {
          ...state.promise,
          status: "archived",
          reflectionText,
        };
        
        dispatch({
          type: "UPDATE_PROMISE",
          payload: { status: "archived", reflectionText },
        });
        
        // Save to archived promises
        const updated = [...state.archivedPromises, updatedPromise];
        await saveArchivedPromises(updated);
        dispatch({ type: "SET_ARCHIVED", payload: updated });
        // Save to localStorage with key "promises"
        if (typeof localStorage !== 'undefined') {
          try {
            const existingData = localStorage.getItem('promises');
            const promisesArray = existingData ? JSON.parse(existingData) : [];
            promisesArray.push({
              id: updatedPromise.id,
              promise: updatedPromise.promiseText,
              reflection: updatedPromise.reflectionText || '',
              createdAt: updatedPromise.createdAt,
            });
            localStorage.setItem('promises', JSON.stringify(promisesArray));
          } catch (err) {
            console.error('Failed to save to localStorage:', err);
          }
        }
        
        // Clear today's promise
        await AsyncStorage.removeItem("todayPromise");
        dispatch({ type: "RESET" });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "感想の保存に失敗しました" });
        console.error("Failed to add reflection:", error);
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [state.promise, state.archivedPromises, saveArchivedPromises]
  );

  const fetchArchivedPromises = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await loadArchivedPromises();
    } catch (error) {
      console.error("Failed to fetch archived promises:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [loadArchivedPromises]);

  const resetPromise = useCallback(async () => {
    try {
      await AsyncStorage.removeItem("todayPromise");
      dispatch({ type: "RESET" });
    } catch (error) {
      console.error("Failed to reset promise:", error);
    }
  }, []);

  const deletePromise = useCallback(
    async (id: string) => {
      try {
        const updated = state.archivedPromises.filter((p) => p.id !== id);
        await saveArchivedPromises(updated);
        dispatch({ type: "SET_ARCHIVED", payload: updated });
      } catch (error) {
        console.error("Failed to delete promise:", error);
        throw error;
      }
    },
    [state.archivedPromises, saveArchivedPromises]
  );

  const resetAllData = useCallback(async () => {
    console.log('[RESET-CTX] resetAllData() called');
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      
      // Web 環境では localStorage を直接クリア
      if (typeof localStorage !== 'undefined') {
        console.log('[RESET-CTX] Clearing localStorage...');
        localStorage.removeItem("todayPromise");
        localStorage.removeItem("archivedPromises");
        localStorage.removeItem("appSettings");
        localStorage.removeItem("lastCleanupDate");
        // localStorage.clear() を呼び出して、すべてのデータをクリア
        localStorage.clear();
        console.log('[RESET-CTX] localStorage cleared');
      }
      
      // AsyncStorage もクリア
      console.log('[RESET-CTX] Clearing AsyncStorage...');
      try {
        await AsyncStorage.removeItem("todayPromise");
        await AsyncStorage.removeItem("archivedPromises");
        await AsyncStorage.removeItem("appSettings");
        await AsyncStorage.removeItem("lastCleanupDate");
        console.log('[RESET-CTX] AsyncStorage items removed');
      } catch (e) {
        console.log('[RESET-CTX] AsyncStorage removeItem failed:', e);
      }
      
      // localStorage を再度確実にクリア（AsyncStorage を経由した複製を防ぐ）
      if (typeof localStorage !== 'undefined') {
        console.log('[RESET-CTX] Double-checking localStorage...');
        localStorage.removeItem("todayPromise");
        localStorage.removeItem("archivedPromises");
        localStorage.removeItem("appSettings");
        localStorage.removeItem("lastCleanupDate");
        localStorage.clear();
        console.log('[RESET-CTX] localStorage double-cleared');
      }
      
      // 状态をリセット
      dispatch({ type: "SET_ARCHIVED", payload: [] });
      dispatch({ type: "RESET" });
      console.log('[RESET-CTX] State reset complete');
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "リセットに失敗しました" });
      console.error('[RESET-CTX] Failed to reset all data:', error);
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const resetSettings = useCallback(async () => {
    console.log('[RESET-CTX] resetSettings() called');
    try {
      console.log('[RESET-CTX] Removing appSettings...');
      try {
        await AsyncStorage.removeItem('appSettings');
      } catch (e) {
        console.log('[RESET-CTX] AsyncStorage removeItem failed');
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('appSettings');
        console.log('[RESET-CTX] localStorage.removeItem(appSettings) called');
      }
      console.log('[RESET-CTX] appSettings removed');
    } catch (error) {
      console.error('[RESET-CTX] Failed to reset settings:', error);
      throw error;
    }
  }, []);

  const value: PromiseContextType = {
    promise: state.promise,
    archivedPromises: state.archivedPromises,
    isLoading: state.isLoading,
    error: state.error,
    createPromise,
    markAsChecked,
    addReflection,
    fetchArchivedPromises,
    resetPromise,
    deletePromise,
    resetAllData,
    resetSettings,
  };

  return (
    <PromiseContext.Provider value={value}>
      {children}
    </PromiseContext.Provider>
  );
}

export function usePromise() {
  const context = useContext(PromiseContext);
  if (!context) {
    throw new Error("usePromise must be used within PromiseProvider");
  }
  return context;
}

import { useContext } from "react";
