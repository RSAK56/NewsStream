import * as React from "react";
import { useEffect } from "react";

import { DateRange } from "react-day-picker";

import { categories, sources } from "../constants";
import { useUserStore } from "../store/useUserStore";
import { DateRangePicker } from "./ui/date-range-picker";
import { TCategory, TNewsSource } from "../constants/types";

import { isCategory } from "@/lib/utils";
import { isNewsSource } from "@/lib/utils";

import { useNewsStore } from "../store/useNewsStore";

import { SourcesFilter } from "./filters/SourcesFilter";
import { CategoriesFilter } from "./filters/CategoriesFilter";

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
      newsFilters.sources.forEach((source: string) => {
        if (
          !filters.sources.includes(source as TNewsSource) &&
          isNewsSource(source)
        ) {
          toggleSource(source as TNewsSource);
        }
      });
      // Apply saved categories
      newsFilters.categories.forEach((category: string) => {
        if (
          !filters.categories.includes(category as TCategory) &&
          isCategory(category)
        ) {
          toggleCategory(category as TCategory);
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

    const sourceNames = preferences?.savedArticles?.map((article) =>
      article.source.name.toLowerCase(),
    );

    return sources.filter((source) => {
      const sourceLower = source.toLowerCase();
      const hasSource = sourceNames?.some((name) => {
        // Handle different variations of "times"
        if (sourceLower === "times" || sourceLower === "nytimes") {
          return name.includes("times") || name.includes("nytimes");
        }
        // Handle other sources
        return name.includes(sourceLower) || sourceLower.includes(name);
      });

      return hasSource;
    });
  }, [showSaved, preferences?.savedArticles]);

  const availableCategories = React.useMemo(() => {
    if (!showSaved) return categories;
    return [
      ...new Set(
        preferences?.savedArticles
          ?.map((article) => article.category?.toLowerCase())
          .filter((category): category is string => category !== undefined),
      ),
    ];
  }, [showSaved, preferences?.savedArticles]);

  const [expandedSections, setExpandedSections] = React.useState({
    sources: true,
    categories: true,
  });

  const toggleSection = (section: "sources" | "categories") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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

      <SourcesFilter
        expanded={expandedSections.sources}
        onToggle={() => toggleSection("sources")}
        sources={sources}
        availableSources={availableSources}
        filters={filters}
        toggleSource={toggleSource}
        showSaved={showSaved}
        isDarkMode={isDarkMode}
      />

      <CategoriesFilter
        expanded={expandedSections.categories}
        onToggle={() => toggleSection("categories")}
        categories={categories}
        availableCategories={availableCategories}
        filters={filters}
        toggleCategory={toggleCategory}
        showSaved={showSaved}
        isDarkMode={isDarkMode}
      />

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
