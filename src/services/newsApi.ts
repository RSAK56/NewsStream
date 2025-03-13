interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface NewsResponse {
  articles: NewsArticle[];
  status: string;
  totalResults: number;
}

const fetchNewsAPI = async (): Promise<NewsResponse> => {
  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  const response = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch news from NewsAPI");
  }

  return response.json();
};

const fetchGuardian = async (): Promise<NewsResponse> => {
  const API_KEY = import.meta.env.VITE_GUARDIAN_API_KEY;
  const response = await fetch(
    `https://content.guardianapis.com/search?api-key=${API_KEY}&show-fields=thumbnail,bodyText`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch news from Guardian");
  }

  const data = await response.json();

  // Transform Guardian response to match NewsResponse interface
  return {
    status: "ok",
    totalResults: data.response.total,
    articles: data.response.results.map((item: any) => ({
      title: item.webTitle,
      description: item.fields?.bodyText?.substring(0, 200) + "...",
      url: item.webUrl,
      urlToImage: item.fields?.thumbnail,
      publishedAt: item.webPublicationDate,
      source: { name: "The Guardian" },
    })),
  };
};

const fetchNYTimes = async (): Promise<NewsResponse> => {
  const API_KEY = import.meta.env.VITE_NYTIMES_API_KEY;
  const response = await fetch(
    `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${API_KEY}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch news from NY Times");
  }

  const data = await response.json();

  // Transform NYTimes response to match NewsResponse interface
  return {
    status: "ok",
    totalResults: data.results.length,
    articles: data.results.map((item: any) => ({
      title: item.title,
      description: item.abstract,
      url: item.url,
      urlToImage: item.multimedia?.[0]?.url,
      publishedAt: item.published_date,
      source: { name: "The New York Times" },
    })),
  };
};

export const fetchNews = async (sources: string[]): Promise<NewsResponse> => {
  try {
    const promises = sources.map((source) => {
      switch (source) {
        case "newsapi":
          return fetchNewsAPI();
        case "guardian":
          return fetchGuardian();
        case "nytimes":
          return fetchNYTimes();
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

export type { NewsArticle, NewsResponse };
