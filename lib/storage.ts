import { STORAGE_KEY } from "@/lib/constants";
import { StorageShape } from "@/lib/types";

export const defaultStorage: StorageShape = {
  profile: null,
  group: null,
  activities: [],
  monthlyResetAt: null
};

export function readStorage(): StorageShape {
  if (typeof window === "undefined") return defaultStorage;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultStorage;

  try {
    const parsed = JSON.parse(raw) as Partial<StorageShape>;
    return {
      profile: parsed.profile ?? null,
      group: parsed.group ?? null,
      activities: parsed.activities ?? [],
      monthlyResetAt: parsed.monthlyResetAt ?? null
    };
  } catch {
    return defaultStorage;
  }
}

export function writeStorage(payload: StorageShape) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}