import { AppState, Promise } from '../types';

const STORAGE_KEY = 'self-promise-app-state';

export const loadState = (): AppState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { promises: [] };
  } catch {
    return { promises: [] };
  }
};

export const saveState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.error('Failed to save state');
  }
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getTodayPromise = (promises: Promise[]): Promise | undefined => {
  const today = getTodayDate();
  return promises.find(p => p.dueDate === today && !p.completed);
};
