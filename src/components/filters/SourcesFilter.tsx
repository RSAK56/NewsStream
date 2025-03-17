import { ChevronDown } from "lucide-react";
import { TNewsSource } from "@/constants/types";
import { ISourcesFilterProps } from "@/constants/interfaces";

export const SourcesFilter = ({
  expanded,
  onToggle,
  sources,
  availableSources,
  filters,
  toggleSource,
  showSaved,
  isDarkMode,
}: ISourcesFilterProps) => {
  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between text-sm font-medium mb-2 hover:cursor-pointer p-2 rounded-md border ${
          isDarkMode
            ? "text-gray-200 border-gray-700 hover:bg-gray-700/50"
            : "text-gray-700 border-gray-200 hover:bg-gray-50"
        }`}
      >
        <span>Sources</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            expanded ? "transform rotate-180" : ""
          } ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
        />
      </button>
      <div
        className={`space-y-2 transition-all duration-200 px-2 ${
          expanded
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        {sources.map((source: TNewsSource) => (
          <label
            key={source}
            className={`flex items-center ${
              showSaved && !availableSources.includes(source)
                ? "opacity-50"
                : ""
            }`}
          >
            <input
              type="checkbox"
              checked={filters?.sources?.includes(source)}
              onChange={() => toggleSource(source)}
              disabled={showSaved && !availableSources.includes(source)}
              className={`rounded text-blue-600 focus:ring-blue-500 hover:cursor-pointer ${
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
  );
};
