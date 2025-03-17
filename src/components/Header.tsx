import {
  Moon,
  NotepadTextDashed,
  Sun,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Button } from "./ui/button";
import { useNewsStore } from "../store/useNewsStore";
import { useUserStore } from "@/store/useUserStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { IHeaderProps } from "@/constants/interfaces";

const Header = ({ onSignInClick }: IHeaderProps) => {
  const isDarkMode = useNewsStore((state) => state.isDarkMode);
  const toggleDarkMode = useNewsStore((state) => state.toggleDarkMode);
  const { user, signOut } = useUserStore();

  return (
    <header
      className={`${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
      } shadow w-full fixed left-0 right-0 z-50`}
    >
      <div className="w-screen px-2 sm:px-4 py-3 sm:py-6">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-0 md:justify-between w-full">
          <div className="flex items-center space-x-2 justify-center">
            <NotepadTextDashed className="h-6 w-6 sm:h-12 sm:w-12 text-purple-500" />
            <span
              className={`text-2xl sm:text-5xl md:text-6xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              NewsStream
            </span>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700"
              } hover:cursor-pointer`}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Moon className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={`${
                      isDarkMode
                        ? "border-gray-600 bg-gray-800 text-white hover:bg-gray-700 hover:text-white"
                        : "bg-white text-gray-900 hover:bg-gray-100"
                    } flex items-center gap-2 px-3 py-2 max-w-[200px] hover:cursor-pointer`}
                  >
                    <span className="truncate">{user.email}</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className={`w-[200px] ${
                    isDarkMode ? "bg-gray-800 border-gray-600" : ""
                  }`}
                >
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className={`cursor-pointer ${
                      isDarkMode
                        ? "hover:bg-gray-700 hover:text-white focus:text-white focus:bg-gray-700 text-white"
                        : ""
                    }`}
                  >
                    <LogOut
                      className={`mr-2 h-4 w-4 ${
                        isDarkMode ? "text-white" : ""
                      }`}
                    />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={onSignInClick}
                size="sm"
                className="hover:cursor-pointer"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
