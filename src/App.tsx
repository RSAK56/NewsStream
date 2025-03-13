import type { JSX } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import NewsFeed from "./components/NewsFeed";
import DefaultLayout from "./layout/DefaultLayout";

const queryClient = new QueryClient();

const App = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <DefaultLayout>
        <NewsFeed />
      </DefaultLayout>
    </QueryClientProvider>
  );
};

export default App;
