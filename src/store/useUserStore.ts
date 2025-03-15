import { create } from "zustand";
import { UserProfile, UserPreferences } from "../constants/interfaces";
import { supabase, redirectURL } from "../lib/supabase";

interface UserState {
  user: UserProfile | null;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),

  updatePreferences: async (preferences) => {
    const { user } = get();
    if (!user) return;

    const updatedPreferences = {
      ...user.preferences,
      ...preferences,
    };

    const { error } = await supabase
      .from("user_preferences")
      .upsert({ user_id: user.id, preferences: updatedPreferences });

    if (!error) {
      set({
        user: {
          ...user,
          preferences: updatedPreferences,
        },
      });
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
        // First try to get existing preferences
        const { data: preferences } = await supabase
          .from("user_preferences")
          .select("preferences")
          .eq("user_id", data.user.id)
          .single();

        if (!preferences) {
          // If no preferences exist, create initial preferences
          const { error: prefsError } = await supabase
            .from("user_preferences")
            .insert({
              user_id: data.user.id,
              preferences: {
                darkMode: false,
                savedArticles: [],
                newsFilters: {
                  categories: [],
                  sources: [],
                },
              },
            });

          if (prefsError) throw prefsError;
        }

        set({
          user: {
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
          },
        });
      } catch (error) {
        console.error("Error setting up user preferences:", error);
        throw error;
      }
    }
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
  },
}));
