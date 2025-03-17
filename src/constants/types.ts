export type TNewsSource = "newsapi" | "guardian" | "nytimes";

export type TCategory =
  | "general"
  | "business"
  | "technology"
  | "sports"
  | "entertainment"
  | "health"
  | "science";

export type TQueryKeys = {
  news: readonly ["news"];
};
