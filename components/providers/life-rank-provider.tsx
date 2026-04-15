"use client";

import { createContext, useContext } from "react";
import { useLifeRankStore } from "@/hooks/use-liferank-store";

const LifeRankContext = createContext<ReturnType<typeof useLifeRankStore> | null>(null);

export function LifeRankProvider({ children }: { children: React.ReactNode }) {
  const value = useLifeRankStore();
  return <LifeRankContext.Provider value={value}>{children}</LifeRankContext.Provider>;
}

export function useLifeRank() {
  const context = useContext(LifeRankContext);
  if (!context) {
    throw new Error("useLifeRank must be used inside LifeRankProvider");
  }

  return context;
}