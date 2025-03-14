import { create } from "zustand";
import { INewsStore, INewsArticle, Article } from "../constants/interfaces";
import { Category } from "../constants/types";
import { useUserStore } from "./useUserStore";

export const useNewsStore = create<INewsStore>()((set, get) => ({
  isDarkMode: true,
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
  setDateRange: (from?: string, to?: string) =>
    set(
      (state) =>
        ({
          filters: { ...state.filters, dateFrom: from, dateTo: to },
        } as INewsStore),
    ),
  saveArticle: async (article: INewsArticle) => {
    const userStore = useUserStore.getState();
    if (!userStore.user) return;

    const articleWithId: Article = {
      ...article,
      id: crypto.randomUUID(),
    };

    const updatedArticles = [
      ...userStore.user.preferences.savedArticles,
      articleWithId,
    ];
    await userStore.updatePreferences({
      savedArticles: updatedArticles,
    });
  },
  removeSavedArticle: async (articleId: string) => {
    const userStore = useUserStore.getState();
    if (!userStore.user) return;

    const updatedArticles = userStore.user.preferences.savedArticles.filter(
      (article) => article.id !== articleId,
    );
    await userStore.updatePreferences({
      savedArticles: updatedArticles,
    });
  },
}));
