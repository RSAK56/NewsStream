import { TCategory, TNewsSource } from "./types";

export const sources: TNewsSource[] = ["newsapi", "guardian", "nytimes"];

export const categories: TCategory[] = [
  "general",
  "business",
  "technology",
  "sports",
  "entertainment",
  "health",
  "science",
];

export const CATEGORY_MAPPINGS: {
  guardian: Record<TCategory, string>;
  nytimes: Record<TCategory, string>;
} = {
  guardian: {
    business: "business",
    technology: "technology",
    general: "news",
    health: "healthcare",
    sports: "sport",
    entertainment: "culture",
    science: "science",
  },
  nytimes: {
    business: "business",
    technology: "technology",
    sports: "sports",
    health: "health",
    general: "home",
    science: "science",
    entertainment: "arts",
  },
};
