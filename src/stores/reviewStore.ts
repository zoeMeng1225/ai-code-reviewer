import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ReviewHistoryItem } from "@/types/reviews";

interface HistoryState {
  items: ReviewHistoryItem[];
  addItem: (item: Omit<ReviewHistoryItem, "id" | "createdAt">) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
}

const MAX_HISTORY = 20;

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const newItem: ReviewHistoryItem = {
            ...item,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          };
          const updated = [newItem, ...state.items].slice(0, MAX_HISTORY);
          return { items: updated };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      clearAll: () => set({ items: [] }),
    }),
    {
      name: "review-history",
    },
  ),
);
