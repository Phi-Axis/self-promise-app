import { createContext, useContext } from "react";

const PromiseContext = createContext({});

export function PromiseProvider({ children }: { children: React.ReactNode }) {
  return (
    <PromiseContext.Provider value={{}}>
      {children}
    </PromiseContext.Provider>
  );
}

export function usePromise() {
  return useContext(PromiseContext);
}
