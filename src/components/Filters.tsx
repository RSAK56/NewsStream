import { useNewsStore } from "../store/useNewsStore";
import { sources } from "../constants";

const Filters = () => {
  const { filters, setSearch, toggleSource, isDarkMode } = useNewsStore();

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } rounded-lg shadow p-6 space-y-6`}
    >
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

      <div>
        <h3
          className={`text-sm font-medium mb-2 ${
            isDarkMode ? "text-gray-200" : "text-gray-700"
          }`}
        >
          Sources
        </h3>
        <div className="space-y-2">
          {sources.map((source) => (
            <label key={source} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.sources.includes(source)}
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
    </div>
  );
};

export default Filters;
