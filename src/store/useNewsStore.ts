import { create } from "zustand";
import { INewsStore } from "../constants/interfaces";
import { Category } from "../constants/types";

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
  setSearch: (search) =>
    set(
      (state) =>
        ({
          filters: { ...state?.filters, search },
        } as INewsStore),
    ),
  toggleSource: (source) =>
    set(
      (state) =>
        ({
          filters: {
            ...state?.filters,
            sources: state?.filters?.sources?.includes(source)
              ? state?.filters?.sources?.filter((s) => s !== source)
              : [...state?.filters?.sources, source],
          },
        } as INewsStore),
    ),
  toggleCategory: (category: Category) =>
    set(
      (state) =>
        ({
          filters: {
            ...state?.filters,
            categories: state?.filters?.categories?.includes(category)
              ? state?.filters?.categories?.filter((c) => c !== category)
              : [...state?.filters?.categories, category],
          },
        } as INewsStore),
    ),
}));
