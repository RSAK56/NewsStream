import { NewsSource } from "./types";

export interface INewsStore {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  filters: {
    search: "";
    sources: ["newsapi", "guardian", "nytimes"];
    categories: ["general"];
    dateFrom: undefined;
    dateTo: undefined;
  };
  toggleSource: (source: NewsSource) => void;
}
