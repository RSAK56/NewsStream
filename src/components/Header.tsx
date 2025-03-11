import { Moon, NotepadTextDashed, Sun } from "lucide-react";

import { useNewsStore } from "../store/useNewsStore";

const Header = () => {
  const { toggleDarkMode, isDarkMode } = useNewsStore();

  return (
    <header
      className={`${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
      } shadow w-full fixed left-0 right-0`}
    >
      <div className="w-screen px-2 sm:px-4 py-3 sm:py-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <NotepadTextDashed className="h-6 w-6 sm:h-12 sm:w-12 text-purple-500" />
            <span
              className={`text-2xl sm:text-5xl md:text-6xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              NewsStream
            </span>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
              isDarkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700"
            }`}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : (
              <Moon className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
