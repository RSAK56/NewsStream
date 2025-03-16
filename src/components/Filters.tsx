import { useNewsStore } from "../store/useNewsStore";
import { categories, sources } from "../constants";
import { Category, NewsSource } from "../constants/types";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "./ui/date-range-picker";
import * as React from "react";
import { useUserStore } from "../store/useUserStore";
import { useEffect } from "react";

const Filters = () => {
  const {
    filters,
    setSearch,
    setDateRange,
    toggleSource,
    toggleCategory,
    isDarkMode,
    showSaved,
  } = useNewsStore();

  const { user, preferences } = useUserStore();

  // Initialize filters from user preferences when component mounts
  useEffect(() => {
    if (user) {
      const { newsFilters } = user.preferences;
      // Apply saved sources
      newsFilters.sources.forEach((source) => {
        if (!filters.sources.includes(source)) {
          toggleSource(source as NewsSource);
        }
      });
      // Apply saved categories
      newsFilters.categories.forEach((category) => {
        if (!filters.categories.includes(category)) {
          toggleCategory(category as Category);
        }
      });
    }
  }, [user]);

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
    to: filters.dateTo ? new Date(filters.dateTo) : undefined,
  });

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDate(range);
    setDateRange(
      range?.from?.toISOString().split("T")[0],
      range?.to?.toISOString().split("T")[0],
    );
  };

  // Get available sources and categories from saved articles
  const availableSources = React.useMemo(() => {
    if (!showSaved) return sources;
    return [
      ...new Set(
        preferences?.savedArticles?.map((article) =>
          article.source.name.toLowerCase(),
        ),
      ),
    ];
  }, [showSaved, preferences?.savedArticles]);

  const availableCategories = React.useMemo(() => {
    if (!showSaved) return categories;
    return [
      ...new Set(
        preferences?.savedArticles
          ?.map((article) => article.category?.toLowerCase())
          .filter(Boolean),
      ),
    ];
  }, [showSaved, preferences?.savedArticles]);

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } rounded-lg shadow p-6 space-y-6`}
    >
      {/* Search */}
      <div>
        <label
          htmlFor="search"
          className={`block text-sm font-medium ${
            isDarkMode ? "text-gray-200" : "text-gray-700"
          }`}
        >
          Search
        </label>
        <input
          type="text"
          id="search"
          value={filters?.search}
          onChange={(e) => setSearch(e?.target?.value)}
          className={`mt-1 block w-full border-0 border-b focus:ring-0 outline-none bg-transparent ${
            isDarkMode
              ? "border-gray-600 text-white placeholder-gray-400"
              : "border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
          placeholder={
            showSaved ? "Search saved articles..." : "Search articles..."
          }
        />
      </div>

      {/* Sources */}
      <div>
        <h3
          className={`text-sm font-medium mb-2 ${
            isDarkMode ? "text-gray-200" : "text-gray-700"
          }`}
        >
          Sources
        </h3>
        <div className="space-y-2">
          {sources.map((source: NewsSource) => (
            <label
              key={source}
              className={`flex items-center ${
                showSaved && !availableSources.includes(source.toLowerCase())
                  ? "opacity-50"
                  : ""
              }`}
            >
              <input
                type="checkbox"
                checked={filters?.sources?.includes(source)}
                onChange={() => toggleSource(source)}
                disabled={
                  showSaved && !availableSources.includes(source.toLowerCase())
                }
                className={`rounded text-blue-600 focus:ring-blue-500 ${
                  isDarkMode ? "bg-gray-700 border-gray-600" : "border-gray-300"
                }`}
              />
              <span
                className={`ml-2 text-sm capitalize ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {source}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3
          className={`text-sm font-medium mb-2 ${
            isDarkMode ? "text-gray-200" : "text-gray-700"
          }`}
        >
          Categories
        </h3>
        <div className="space-y-2">
          {categories?.map((category: Category) => (
            <label
              key={category}
              className={`flex items-center ${
                showSaved &&
                !availableCategories.includes(category.toLowerCase())
                  ? "opacity-50"
                  : ""
              }`}
            >
              <input
                type="checkbox"
                checked={filters?.categories?.includes(category)}
                onChange={() => toggleCategory(category)}
                disabled={
                  showSaved &&
                  !availableCategories.includes(category.toLowerCase())
                }
                className={`rounded text-blue-600 focus:ring-blue-500 ${
                  isDarkMode ? "bg-gray-700 border-gray-600" : "border-gray-300"
                }`}
              />
              <span
                className={`ml-2 text-sm capitalize ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div>
        <h3
          className={`text-sm font-medium mb-2 ${
            isDarkMode ? "text-gray-200" : "text-gray-700"
          }`}
        >
          Date Range
        </h3>
        <DateRangePicker
          date={date}
          onDateChange={handleDateRangeChange}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

export default Filters;
