import { useNewsStore } from "../store/useNewsStore";
import { categories, sources } from "../constants";
import { Category, NewsSource } from "../constants/types";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "./ui/date-range-picker";
import * as React from "react";

const Filters = () => {
  const {
    filters,
    setSearch,
    setDateRange,
    toggleSource,
    toggleCategory,
    isDarkMode,
  } = useNewsStore();

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
          placeholder="Search articles..."
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
            <label key={source} className="flex items-center">
              <input
                type="checkbox"
                checked={filters?.sources?.includes(source)}
                onChange={() => toggleSource(source)}
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
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={filters?.categories?.includes(category)}
                onChange={() => toggleCategory(category)}
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
