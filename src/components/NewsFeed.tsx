import { useQuery } from "@tanstack/react-query";
import { useNewsStore } from "../store/useNewsStore";
import { useUserStore } from "../store/useUserStore";
import { fetchNews } from "../services/newsApi";
import { queryKeys } from "../constants/keys";
import { INewsArticle, Article } from "../constants/interfaces";
import { Bookmark, BookmarkCheck } from "lucide-react";

const NewsFeed = () => {
  const isDarkMode = useNewsStore((state) => state.isDarkMode);
  const selectedSources = useNewsStore((state) => state.filters.sources);
  const searchTerm = useNewsStore((state) => state.filters.search);
  const selectedCategories = useNewsStore((state) => state.filters.categories);
  const dateFrom = useNewsStore((state) => state.filters.dateFrom);
  const dateTo = useNewsStore((state) => state.filters.dateTo);
  const { user, preferences, saveArticle, unsaveArticle } = useUserStore();

  const { data, isLoading, error } = useQuery({
    queryKey: [
      ...queryKeys.news,
      selectedSources,
      selectedCategories,
      dateFrom,
      dateTo,
    ],
    queryFn: () =>
      fetchNews(selectedSources, selectedCategories, dateFrom, dateTo),
  });

  const filteredArticles =
    data?.articles?.filter((article) => {
      const searchLower = searchTerm?.toLowerCase() || "";
      const sourceLower = article?.source?.name?.toLowerCase() || "";

      // Date filter
      const articleDate = new Date(article?.publishedAt);
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;

      // Set time to start of day for from date and end of day for to date
      if (fromDate) fromDate.setHours(0, 0, 0, 0);
      if (toDate) toDate.setHours(23, 59, 59, 999);

      const matchesDate =
        (!fromDate || articleDate >= fromDate) &&
        (!toDate || articleDate <= toDate);

      // Search filter
      if (
        searchLower === "newsapi" ||
        searchLower === "guardian" ||
        searchLower === "times"
      ) {
        return sourceLower.includes(searchLower);
      }

      // Category filter
      const articleCategory = article?.category?.toLowerCase() || "";
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some((category) =>
          articleCategory.includes(category.toLowerCase()),
        );

      // Text search filter
      const matchesSearch =
        article?.title?.toLowerCase()?.includes(searchLower) ||
        article?.description?.toLowerCase()?.includes(searchLower);

      return matchesCategory && matchesSearch && matchesDate;
    }) || [];

  const NoDataMessage = () => (
    <div className="text-center py-12">
      <svg
        className={`w-24 h-24 mx-auto mb-4 ${
          isDarkMode ? "text-gray-600" : "text-gray-400"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2"
        />
      </svg>
      <h3
        className={`text-xl font-medium mb-2 ${
          isDarkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        No News Articles Found
      </h3>
      <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
        There are no articles available for the selected sources and categories.
      </p>
    </div>
  );

  const handleSaveArticle = async (article: INewsArticle) => {
    if (!user) {
      // Handle unauthenticated user - maybe show sign in modal
      return;
    }

    const articleWithId: Article = {
      ...article,
      id: article.url,
    };

    const isArticleSaved = preferences.savedArticles?.some(
      (savedArticle) => savedArticle.url === article.url,
    );

    try {
      if (isArticleSaved) {
        await unsaveArticle(articleWithId);
      } else {
        await saveArticle(articleWithId);
      }
    } catch (error) {
      console.error("Error saving article:", error);
    }
  };

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
        ) : filteredArticles?.length ? (
          filteredArticles.map((article: INewsArticle, index: number) => (
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
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <div>
                    <span>{article?.source.name}</span>
                    <span className="mx-2">•</span>
                    <span>
                      {new Date(article?.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {user && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSaveArticle(article);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      {preferences.savedArticles?.some(
                        (savedArticle) => savedArticle.url === article.url,
                      ) ? (
                        <BookmarkCheck className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Bookmark className="h-5 w-5" />
                      )}
                    </button>
                  )}
                </div>
              </a>
            </article>
          ))
        ) : (
          <NoDataMessage />
        )}
      </div>
    </div>
  );
};

export default NewsFeed;
