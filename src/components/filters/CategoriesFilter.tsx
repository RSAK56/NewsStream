import { ChevronDown } from "lucide-react";
import { TCategory } from "@/constants/types";

interface CategoriesFilterProps {
  expanded: boolean;
  onToggle: () => void;
  categories: TCategory[];
  availableCategories: string[];
  filters: {
    categories: TCategory[];
  };
  toggleCategory: (category: TCategory) => void;
  showSaved: boolean;
  isDarkMode: boolean;
}

export const CategoriesFilter = ({
  expanded,
  onToggle,
  categories,
  availableCategories,
  filters,
  toggleCategory,
  showSaved,
  isDarkMode,
}: CategoriesFilterProps) => {
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
        <span>Categories</span>
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
        {categories?.map((category: TCategory) => (
          <label
            key={category}
            className={`flex items-center ${
              showSaved && !availableCategories.includes(category.toLowerCase())
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
              className={`rounded text-blue-600 focus:ring-blue-500 hover:cursor-pointer ${
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
  );
};
