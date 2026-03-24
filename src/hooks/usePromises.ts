import { useState, useEffect } from 'react';
import { AppState, Promise } from '../types';
import { loadState, saveState, generateId, getTodayDate, getTodayPromise } from '../utils/storage';

export const usePromises = () => {
  const [state, setState] = useState<AppState>({ promises: [] });

  useEffect(() => {
    const loaded = loadState();
    setState(loaded);
  }, []);

  useEffect(() => {
    const todayPromise = getTodayPromise(state.promises);
    setState(prev => ({ ...prev, todayPromise }));
  }, [state.promises]);

  const addPromise = (title: string, description?: string, dueDate?: string) => {
    const newPromise: Promise = {
      id: generateId(),
      title,
      description,
      dueDate: dueDate || getTodayDate(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const newState = {
      ...state,
      promises: [...state.promises, newPromise],
    };

    setState(newState);
    saveState(newState);
  };

  const completePromise = (id: string) => {
    const newState = {
      ...state,
      promises: state.promises.map(p =>
        p.id === id
          ? { ...p, completed: true, completedAt: new Date().toISOString() }
          : p
      ),
    };

    setState(newState);
    saveState(newState);
  };

  const deletePromise = (id: string) => {
    const newState = {
      ...state,
      promises: state.promises.filter(p => p.id !== id),
    };

    setState(newState);
    saveState(newState);
  };

  return {
    state,
    addPromise,
    completePromise,
    deletePromise,
  };
};
