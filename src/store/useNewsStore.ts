import { create } from "zustand";
import { INewsArticle, IArticle, INewsState } from "../constants/interfaces";
import { TCategory, TNewsSource } from "../constants/types";
import { useUserStore } from "./useUserStore";

// Subscribe to user store changes
useUserStore.subscribe((state) => {
  if (state.user) {
    useNewsStore.setState({
      isDarkMode: state.user.preferences.darkMode,
      filters: {
        ...useNewsStore.getState().filters,
        sources: state.user.preferences.newsFilters.sources || [],
        categories: state.user.preferences.newsFilters.categories || [],
      },
      savedArticles: state.user.preferences.savedArticles || [],
    });
  }
});

export const useNewsStore = create<INewsState>((set) => ({
  isDarkMode: useUserStore.getState().user?.preferences.darkMode || false,
  showSaved: false,
  savedArticles: useUserStore.getState().user?.preferences.savedArticles || [],
  toggleDarkMode: () => {
    set((state) => {
      const newDarkMode = !state.isDarkMode;
      // Update user preferences in Supabase
      useUserStore.getState().updatePreferences({
        darkMode: newDarkMode,
      });
      return { isDarkMode: newDarkMode };
    });
  },
  filters: {
    search: "",
    sources: useUserStore.getState().user?.preferences.newsFilters.sources || [
      "newsapi",
      "guardian",
      "nytimes",
    ],
    categories:
      useUserStore.getState().user?.preferences.newsFilters.categories || [],
    dateFrom: undefined,
    dateTo: undefined,
  },
  setSearch: (search: string) =>
    set((state) => ({
      filters: { ...state.filters, search },
    })),
  toggleSource: (source: TNewsSource) => {
    set((state) => {
      const newSources = state.filters.sources.includes(source)
        ? state.filters.sources.filter((s) => s !== source)
        : [...state.filters.sources, source];

      // Update user preferences in Supabase
      useUserStore.getState().updatePreferences({
        newsFilters: {
          ...useUserStore.getState().user?.preferences.newsFilters,
          sources: newSources,
          categories:
            useUserStore.getState().user?.preferences.newsFilters.categories ||
            [],
        },
      });

      return {
        filters: {
          ...state.filters,
          sources: newSources,
        },
      };
    });
  },
  toggleCategory: (category: TCategory) => {
    set((state) => {
      const newCategories = state.filters.categories.includes(category)
        ? state.filters.categories.filter((c) => c !== category)
        : [...state.filters.categories, category];

      // Update user preferences in Supabase
      useUserStore.getState().updatePreferences({
        newsFilters: {
          ...useUserStore.getState().user?.preferences.newsFilters,
          sources:
            useUserStore.getState().user?.preferences.newsFilters.sources || [],
          categories: newCategories,
        },
      });

      return {
        filters: {
          ...state.filters,
          categories: newCategories,
        },
      };
    });
  },
  setDateRange: (from?: string, to?: string) =>
    set((state) => ({
      filters: { ...state.filters, dateFrom: from, dateTo: to },
    })),
  saveArticle: async (article: INewsArticle) => {
    const userStore = useUserStore.getState();
    if (!userStore.user) return;

    const articleWithId: IArticle = {
      ...article,
      id: crypto.randomUUID(),
      isSaved: true,
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
  toggleSavedView: () =>
    set((state) => ({
      showSaved: !state.showSaved,
    })),
}));
