import {
  IGuardianArticle,
  INewsAPIArticle,
  INewsResponse,
  INYTimesArticle,
} from "../constants/interfaces";

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
  const response = await fetch(
    `https://content.guardianapis.com/search?api-key=${API_KEY}&show-fields=thumbnail,bodyText&q=${category}`,
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
  const response = await fetch(
    `https://api.nytimes.com/svc/topstories/v2/${category}.json?api-key=${API_KEY}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch news from NY Times");
  }

  const data = await response.json();

  // Transform NYTimes response to match NewsResponse interface
  return {
    status: "ok",
    totalResults: data.results.length,
    articles: data.results.map((item: INYTimesArticle) => ({
      ...item,
      category: item.section || category,
      title: item.title,
      description: item.abstract,
      url: item.url,
      urlToImage: item.multimedia?.[0]?.url,
      publishedAt: item.published_date,
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
      const categoryParam =
        categories.length > 0 ? categories.join(",") : "general";

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

    const results = await Promise.all(promises);

    // Combine and deduplicate articles from all sources
    return {
      status: "ok",
      totalResults: results.reduce(
        (sum, result) => sum + result.totalResults,
        0,
      ),
      articles: results.flatMap((result) => result.articles),
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(`Failed to fetch news: ${errorMessage}`);
  }
};
