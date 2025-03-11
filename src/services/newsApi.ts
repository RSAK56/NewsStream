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

export const fetchNews = async (): Promise<NewsResponse> => {
  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  const response = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }

  return response.json();
};

export type { NewsArticle, NewsResponse };
