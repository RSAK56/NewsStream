import { useQuery } from "@tanstack/react-query";
import { useNewsStore } from "../store/useNewsStore";
import { fetchNews } from "../services/newsApi";
import { queryKeys } from "../constants/keys";
import { INewsArticle } from "../constants/interfaces";

const NewsFeed = () => {
  const isDarkMode = useNewsStore((state) => state.isDarkMode);
  const selectedSources = useNewsStore((state) => state.filters.sources);
  const searchTerm = useNewsStore((state) => state.filters.search);

  const { data, isLoading, error } = useQuery({
    queryKey: [...queryKeys.news, selectedSources],
    queryFn: () => fetchNews(selectedSources),
  });

  const filteredArticles = data?.articles?.filter((article) => {
    const searchLower = searchTerm?.toLowerCase() || "";
    const sourceLower = article?.source?.name?.toLowerCase() || "";

    // Check if searching for a source name
    if (
      searchLower === "newsapi" ||
      searchLower === "guardian" ||
      searchLower === "times"
    ) {
      return sourceLower.includes(searchLower);
    }

    // Otherwise search in title and description
    return (
      article?.title?.toLowerCase()?.includes(searchLower) ||
      article?.description?.toLowerCase()?.includes(searchLower)
    );
  });

  if (error) {
    return (
      <div className="space-y-6">
        <h2
          className={`text-4xl font-semibold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          News Articles
        </h2>
        <div
          className={`${
            isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-600"
          } rounded-lg shadow p-4`}
        >
          <p className="text-red-500">Error loading news articles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2
        className={`text-xl font-semibold ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        News Articles
      </h2>
      <div
        className={`${
          isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-600"
        } rounded-lg shadow p-4 space-y-4`}
      >
        {isLoading ? (
          <p>Loading news articles...</p>
        ) : (
          filteredArticles?.map((article: INewsArticle, index: number) => (
            <article
              key={index}
              className="border-b last:border-b-0 pb-4 last:pb-0"
            >
              <a
                href={article?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:opacity-80"
              >
                {article?.urlToImage && (
                  <img
                    src={article?.urlToImage}
                    alt={article?.title}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                )}
                <h3
                  className={`font-semibold text-lg mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {article?.title}
                </h3>
                <p className="text-sm">{article?.description}</p>
                <div className="mt-2 text-xs text-gray-500">
                  <span>{article?.source.name}</span>
                  <span className="mx-2">•</span>
                  <span>
                    {new Date(article?.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </a>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default NewsFeed;
