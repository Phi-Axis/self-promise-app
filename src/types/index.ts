export interface Promise {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface AppState {
  promises: Promise[];
  todayPromise?: Promise;
}
