import { create } from "zustand";
import { INewsStore } from "../constants/interfaces";

export const useNewsStore = create<INewsStore>()((set) => ({
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  filters: {
    search: "",
    sources: ["newsapi", "guardian", "nytimes"],
    categories: ["general"],
    dateFrom: undefined,
    dateTo: undefined,
  },
  toggleSource: (source) =>
    set(
      (state) =>
        ({
          filters: {
            ...state.filters,
            sources: state.filters.sources.includes(source)
              ? state.filters.sources.filter((s) => s !== source)
              : [...state.filters.sources, source],
          },
        } as INewsStore),
    ),
}));
