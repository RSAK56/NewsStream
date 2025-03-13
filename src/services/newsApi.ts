import {
  IGuardianArticle,
  INewsAPIArticle,
  INewsResponse,
  INYTimesArticle,
} from "../constants/interfaces";
import { Category } from "../constants/types";

const CATEGORY_MAPPINGS: {
  guardian: Record<Category, string>;
  nytimes: Record<Category, string>;
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

const fetchNewsAPI = async (category: string): Promise<INewsResponse> => {
  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  const response = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}&category=${category}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch news from NewsAPI");
  }

  const data = await response.json();

  // Transform NewsAPI response to match NewsResponse interface
  return {
    status: "ok",
    totalResults: data.articles.length,
    articles: data.articles.map((item: INewsAPIArticle) => ({
      ...item,
      category: item.category || category,
      title: item.title,
      description: item.description,
      url: item.url,
      urlToImage: item.urlToImage,
      publishedAt: item.publishedAt,
      source: { name: "NewsAPI" },
    })),
  };
};

const fetchGuardian = async (category: string): Promise<INewsResponse> => {
  const API_KEY = import.meta.env.VITE_GUARDIAN_API_KEY;
  const guardianCategory =
    CATEGORY_MAPPINGS.guardian[category as Category] || "news";

  const response = await fetch(
    `https://content.guardianapis.com/search?api-key=${API_KEY}&show-fields=thumbnail,bodyText&section=${guardianCategory}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch news from Guardian");
  }

  const data = await response.json();

  // Transform Guardian response to match NewsResponse interface
  return {
    status: "ok",
    totalResults: data.response.total,
    articles: data.response.results.map((item: IGuardianArticle) => ({
      ...item,
      category: item.sectionId || category,
      title: item.webTitle,
      description: item.fields?.bodyText?.substring(0, 200) + "...",
      url: item.webUrl,
      urlToImage: item.fields?.thumbnail,
      publishedAt: item.webPublicationDate,
      source: { name: "The Guardian" },
    })),
  };
};

const fetchNYTimes = async (category: string): Promise<INewsResponse> => {
  const API_KEY = import.meta.env.VITE_NYTIMES_API_KEY;
  const nytCategory = CATEGORY_MAPPINGS.nytimes[category as Category] || "home";

  const response = await fetch(
    `https://api.nytimes.com/svc/topstories/v2/${nytCategory}.json?api-key=${API_KEY}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch news from NY Times");
  }

  const data = await response.json();
  return {
    status: "ok",
    totalResults: data.results?.length || 0,
    articles: (data.results || []).map((item: INYTimesArticle) => ({
      title: item.title,
      description: item.abstract,
      url: item.url,
      urlToImage: item.multimedia?.[0]?.url,
      publishedAt: item.published_date,
      category: item.section || category,
      source: { name: "The New York Times" },
    })),
  };
};

export const fetchNews = async (
  sources: string[],
  categories: string[],
): Promise<INewsResponse> => {
  try {
    const promises = sources.map((source) => {
      const categoryParam = categories.length > 0 ? categories[0] : "general"; // Use first category only

      switch (source) {
        case "newsapi":
          return fetchNewsAPI(categoryParam);
        case "guardian":
          return fetchGuardian(categoryParam);
        case "nytimes":
          return fetchNYTimes(categoryParam);
        default:
          return Promise.reject(new Error(`Unknown source: ${source}`));
      }
    });

    const results = await Promise.allSettled(promises);
    const successfulResults = results
      .filter(
        (result): result is PromiseFulfilledResult<INewsResponse> =>
          result.status === "fulfilled",
      )
      .map((result) => result.value);

    return {
      status: "ok",
      totalResults: successfulResults.reduce(
        (sum, result) => sum + result.totalResults,
        0,
      ),
      articles: successfulResults.flatMap((result) => result.articles),
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(`Failed to fetch news: ${errorMessage}`);
  }
};
