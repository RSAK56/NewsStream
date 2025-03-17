import { TNewsSource, TCategory } from "./types";
import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";
import { DateRange } from "react-day-picker";

export interface INewsStore {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  filters: {
    search: string;
    sources: TNewsSource[];
    categories: TCategory[];
    dateFrom: string | undefined;
    dateTo: string | undefined;
  };
  setSearch: (search: string) => void;
  toggleSource: (source: TNewsSource) => void;
  toggleCategory: (category: TCategory) => void;
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

export interface IArticle extends INewsArticle {
  id: string;
  isSaved?: boolean;
}

export interface IUserPreferences {
  darkMode: boolean;
  savedArticles: IArticle[];
  newsFilters: {
    categories: TCategory[];
    sources: TNewsSource[];
    dateRange?: {
      from: Date;
      to: Date;
    };
  };
}

export interface IUserProfile {
  id: string;
  email: string;
  preferences: IUserPreferences;
}

export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export interface IDateRangePickerProps {
  className?: string;
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  isDarkMode?: boolean;
}

export interface IHeaderProps {
  onSignInClick: () => void;
}

export interface IAppProps {
  Component: React.ComponentType;
  pageProps: Record<string, unknown>;
}

export interface INewsState {
  filters: {
    search: string;
    sources: TNewsSource[];
    categories: TCategory[];
    dateFrom?: string;
    dateTo?: string;
  };
  isDarkMode: boolean;
  showSaved: boolean;
  savedArticles: IArticle[];
  toggleSavedView: () => void;
  toggleDarkMode: () => void;
  setSearch: (search: string) => void;
  toggleSource: (source: TNewsSource) => void;
  toggleCategory: (category: TCategory) => void;
  setDateRange: (from?: string, to?: string) => void;
  saveArticle: (article: INewsArticle) => Promise<void>;
  removeSavedArticle: (articleId: string) => Promise<void>;
}

export interface IUserState {
  user: IUserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  preferences: IUserPreferences;
  setUser: (user: IUserProfile | null) => void;
  updatePreferences: (preferences: Partial<IUserPreferences>) => Promise<void>;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ user: IUserProfile | null }>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setSavedArticles: (articles: IArticle[]) => void;
  saveArticle: (article: IArticle) => Promise<void>;
  unsaveArticle: (article: IArticle) => Promise<void>;
  init: () => Promise<void>;
}

export interface ICategoriesFilterProps {
  expanded: boolean;
  onToggle: () => void;
  categories: TCategory[];
  availableCategories: string[];
  filters: {
    categories: TCategory[];
  };
  toggleCategory: (category: TCategory) => void;
  showSaved: boolean;
  isDarkMode: boolean;
}

export interface ISourcesFilterProps {
  expanded: boolean;
  onToggle: () => void;
  sources: TNewsSource[];
  availableSources: TNewsSource[];
  filters: {
    sources: TNewsSource[];
  };
  toggleSource: (source: TNewsSource) => void;
  showSaved: boolean;
  isDarkMode: boolean;
}
