import { create } from "zustand";
import { UserProfile, UserPreferences, Article } from "../constants/interfaces";
import { supabase, redirectURL } from "../lib/supabase";

interface UserState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  preferences: UserPreferences;
  setUser: (user: UserProfile | null) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ user: UserProfile | null }>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setSavedArticles: (articles: Article[]) => void;
  saveArticle: (article: Article) => Promise<void>;
  unsaveArticle: (article: Article) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isAuthenticated: !!localStorage.getItem("user"),
  isLoading: true,
  preferences: {
    darkMode: false,
    savedArticles: [],
    newsFilters: {
      categories: [],
      sources: [],
    },
  },
  setSavedArticles: (articles) => {
    set((state) => ({
      preferences: { ...state.preferences, savedArticles: articles },
    }));
  },
  saveArticle: async (article) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Get the existing preference row first
      const { data: existingPref } = await supabase
        .from("user_preferences")
        .select("id, preferences")
        .eq("user_id", user.id)
        .single();

      if (!existingPref) return;

      const currentPreferences = existingPref.preferences || {
        savedArticles: [],
      };
      const updatedSavedArticles = [
        ...(currentPreferences.savedArticles || []),
        article,
      ];

      // Update existing row
      const { error } = await supabase
        .from("user_preferences")
        .update({
          preferences: {
            ...currentPreferences,
            savedArticles: updatedSavedArticles,
          },
        })
        .eq("user_id", user.id)
        .eq("id", existingPref.id);

      if (error) throw error;

      // Update local state
      set((state) => ({
        preferences: {
          ...state.preferences,
          savedArticles: updatedSavedArticles,
        },
      }));
    } catch (error) {
      console.error("Error saving article:", error);
      throw error;
    }
  },
  unsaveArticle: async (article) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Get the existing preference row first
      const { data: existingPref } = await supabase
        .from("user_preferences")
        .select("id, preferences")
        .eq("user_id", user.id)
        .single();

      if (!existingPref) return;

      const currentPreferences = existingPref.preferences || {
        savedArticles: [],
      };
      const updatedSavedArticles = (
        currentPreferences.savedArticles || []
      ).filter((savedArticle: Article) => savedArticle.url !== article.url);

      // Update existing row
      const { error } = await supabase
        .from("user_preferences")
        .update({
          preferences: {
            ...currentPreferences,
            savedArticles: updatedSavedArticles,
          },
        })
        .eq("user_id", user.id)
        .eq("id", existingPref.id);

      if (error) throw error;

      // Update local state
      set((state) => ({
        preferences: {
          ...state.preferences,
          savedArticles: updatedSavedArticles,
        },
      }));
    } catch (error) {
      console.error("Error unsaving article:", error);
      throw error;
    }
  },

  setUser: (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
    set({ user, isAuthenticated: !!user });
  },

  updatePreferences: async (preferences) => {
    const { user } = get();
    if (!user) return;

    const updatedPreferences = {
      ...user.preferences,
      ...preferences,
      newsFilters: {
        ...user.preferences.newsFilters,
        ...(preferences.newsFilters || {}),
      },
    };

    // First try to get the existing preference row
    const { data: existingPref } = await supabase
      .from("user_preferences")
      .select("id")
      .eq("user_id", user.id)
      .single();

    const { data, error } = await supabase
      .from("user_preferences")
      .update({ preferences: updatedPreferences })
      .eq("user_id", user.id)
      .eq("id", existingPref?.id)
      .select();

    if (!error) {
      console.log("Update successful:", data);
      set({
        user: {
          ...user,
          preferences: updatedPreferences,
        },
      });
    } else {
      console.error("Error updating preferences:", error);
    }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      try {
        const { data: preferences } = await supabase
          .from("user_preferences")
          .select("preferences")
          .eq("user_id", data.user.id)
          .single();

        const userData = {
          id: data.user.id,
          email: data.user.email!,
          preferences: preferences?.preferences || {
            darkMode: false,
            savedArticles: [],
            newsFilters: {
              categories: [],
              sources: [],
            },
          },
        };

        set({ user: userData });
        return { user: userData };
      } catch (error) {
        console.error("Error setting up user preferences:", error);
        throw error;
      }
    }
    return { user: null };
  },

  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectURL,
      },
    });

    if (error) throw error;

    if (data.user) {
      throw new Error(
        "Please check your email for a confirmation link to complete your registration.",
      );
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
    localStorage.removeItem("user");
  },
}));
