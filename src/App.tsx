import type { JSX } from "react/jsx-runtime";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useUserStore } from "./store/useUserStore";
import { supabase } from "./lib/supabase";

import NewsFeed from "./components/NewsFeed";
import DefaultLayout from "./layout/DefaultLayout";
import AuthCallback from "./components/auth/AuthCallback";

const queryClient = new QueryClient();

const App = (): JSX.Element => {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: preferences } = await supabase
          ?.from("user_preferences")
          ?.select("preferences")
          ?.eq("user_id", session.user.id)
          ?.single();

        setUser({
          id: session?.user?.id,
          email: session?.user?.email!,
          preferences: preferences?.preferences || {
            darkMode: false,
            savedArticles: [],
            newsFilters: {
              categories: [],
              sources: [],
            },
          },
        });
      } else {
        setUser(null);
      }
    });
  }, [setUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/"
            element={
              <DefaultLayout>
                <NewsFeed />
              </DefaultLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
