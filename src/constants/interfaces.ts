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

export interface INewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}
export interface INewsResponse {
  articles: INewsArticle[];
  status: string;
  totalResults: number;
}
