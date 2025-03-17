import { CATEGORY_MAPPINGS } from "@/constants";
import {
  IGuardianArticle,
  INewsAPIArticle,
  INewsResponse,
  INYTimesArticle,
} from "../constants/interfaces";
import { TCategory } from "../constants/types";

const fetchNewsAPI = async (
  category: string,
  from?: string,
  to?: string,
): Promise<INewsResponse> => {
  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

  // Format dates to ISO 8601 (YYYY-MM-DDTHH:mm:ss)
  const fromDate = from ? new Date(from).toISOString() : "";
  const toDate = to ? new Date(to).toISOString() : "";
  const dateParams = `${fromDate ? `&from=${fromDate}` : ""}${
    toDate ? `&to=${toDate}` : ""
  }`;

  const response = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}&category=${category}${dateParams}`,
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

const fetchGuardian = async (
  category: string,
  from?: string,
  to?: string,
): Promise<INewsResponse> => {
  const API_KEY = import.meta.env.VITE_GUARDIAN_API_KEY;
  const guardianCategory =
    CATEGORY_MAPPINGS.guardian[category as TCategory] || "news";

  const dateParams = `${from ? `&from=${from}` : ""}${to ? `&to=${to}` : ""}`;

  const response = await fetch(
    `https://content.guardianapis.com/search?api-key=${API_KEY}&show-fields=thumbnail,bodyText&section=${guardianCategory}${dateParams}`,
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

const fetchNYTimes = async (
  category: string,
  from?: string,
  to?: string,
): Promise<INewsResponse> => {
  const API_KEY = import.meta.env.VITE_NYTIMES_API_KEY;
  // First try mapped category, fallback to 'home' if not supported
  const nytCategory =
    CATEGORY_MAPPINGS.nytimes[category as TCategory] || "home";

  const dateParams = `${from ? `&from=${from}` : ""}${to ? `&to=${to}` : ""}`;

  try {
    const response = await fetch(
      `https://api.nytimes.com/svc/topstories/v2/${nytCategory}.json?api-key=${API_KEY}${dateParams}`,
    );

    if (!response.ok) {
      // If category request fails, fallback to home
      const fallbackResponse = await fetch(
        `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${API_KEY}${dateParams}`,
      );
      if (!fallbackResponse.ok) {
        throw new Error("Failed to fetch news from NY Times");
      }
      return processFetchedData(await fallbackResponse.json(), category);
    }

    return processFetchedData(await response.json(), category);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to fetch news from NY Times: ${errorMessage}`);
  }
};

const processFetchedData = (
  data: any,
  requestedCategory: string,
): INewsResponse => {
  return {
    status: "ok",
    totalResults: data.results?.length || 0,
    articles: (data.results || []).map((item: INYTimesArticle) => ({
      title: item.title,
      description: item.abstract,
      url: item.url,
      urlToImage: item.multimedia?.[0]?.url,
      publishedAt: item.published_date,
      category: item.section || requestedCategory,
      source: { name: "The New York Times" },
    })),
  };
};

export const fetchNews = async (
  sources: string[],
  categories: string[],
  dateFrom?: string,
  dateTo?: string,
): Promise<INewsResponse> => {
  try {
    const promises = sources.flatMap((source) =>
      (categories.length > 0 ? categories : ["general"]).map((category) => {
        switch (source) {
          case "newsapi":
            return fetchNewsAPI(category, dateFrom, dateTo);
          case "guardian":
            return fetchGuardian(category, dateFrom, dateTo);
          case "nytimes":
            return fetchNYTimes(category, dateFrom, dateTo);
          default:
            return Promise.reject(new Error(`Unknown source: ${source}`));
        }
      }),
    );

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
