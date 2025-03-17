import { TCategory } from "@/constants/types";
import { TNewsSource } from "@/constants/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isNewsSource(value: string): value is TNewsSource {
  return ["newsapi", "guardian", "nytimes"].includes(value as TNewsSource);
}

export function isCategory(value: string): value is TCategory {
  return [
    "general",
    "business",
    "technology",
    "sports",
    "entertainment",
    "health",
    "science",
  ].includes(value as TCategory);
}
