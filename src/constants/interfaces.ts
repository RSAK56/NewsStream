import { NewsSource, Category } from "./types";

export interface INewsStore {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  filters: {
    search: "";
    sources: ["newsapi", "guardian", "nytimes"];
    categories: Category[];
    dateFrom: undefined;
    dateTo: undefined;
  };
  setSearch: (search: string) => void;
  toggleSource: (source: NewsSource) => void;
  toggleCategory: (category: Category) => void;
  setDateRange: (from?: string, to?: string) => void;
}

export interface INewsAPIArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  category?: string;
}

export interface IGuardianArticle {
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  sectionId: string;
  fields?: {
    bodyText: string;
    thumbnail: string;
  };
}

export interface INYTimesArticle {
  title: string;
  abstract: string;
  url: string;
  published_date: string;
  section: string;
  multimedia?: Array<{ url: string }>;
}

export interface INewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  category?: string;
  source: {
    name: string;
  };
}
export interface INewsResponse {
  articles: INewsArticle[];
  status: string;
  totalResults: number;
}
