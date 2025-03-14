import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useUserStore } from "../store/useUserStore";

interface AppProps {
  Component: React.ComponentType;
  pageProps: Record<string, unknown>;
}

function MyApp({ Component, pageProps }: AppProps) {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: preferences } = await supabase
          .from("user_preferences")
          .select("preferences")
          .eq("user_id", session.user.id)
          .single();

        setUser({
          id: session.user.id,
          email: session.user.email!,
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
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
