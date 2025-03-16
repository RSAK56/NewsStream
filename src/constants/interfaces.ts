import { NewsSource, Category } from "./types";

export interface INewsStore {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  filters: {
    search: string;
    sources: NewsSource[];
    categories: Category[];
    dateFrom: string | undefined;
    dateTo: string | undefined;
  };
  setSearch: (search: string) => void;
  toggleSource: (source: NewsSource) => void;
  toggleCategory: (category: Category) => void;
  setDateRange: (from?: string, to?: string) => void;
  saveArticle: (article: INewsArticle) => Promise<void>;
  removeSavedArticle: (articleId: string) => Promise<void>;
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
  isSaved?: boolean;
}

export interface INewsResponse {
  articles: INewsArticle[];
  status: string;
  totalResults: number;
}

export interface Article extends INewsArticle {
  id: string;
  isSaved?: boolean;
}

export interface UserPreferences {
  darkMode: boolean;
  savedArticles: Article[];
  newsFilters: {
    categories: Category[];
    sources: NewsSource[];
    dateRange?: {
      from: Date;
      to: Date;
    };
  };
}

export interface UserProfile {
  id: string;
  email: string;
  preferences: UserPreferences;
}
