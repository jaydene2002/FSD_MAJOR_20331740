"use client";

import { Button } from "@repo/ui/button";
import { useTheme } from "./ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";
//UI component to switch between light and dark themes
const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      data-test-id="theme-toggle"
      className="px-3 py-3 md:py-2 text-sm font-medium rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
    >
      {theme === "light" ? (
        <>
          <FaMoon className="h-4 w-4" />
          <span className="hidden sm:inline">Dark Mode</span>
        </>
      ) : (
        <>
          <FaSun className="h-4 w-4" />
          <span className="hidden sm:inline">Light Mode</span>
        </>
      )}
    </Button>
  );
};

export default ThemeSwitch;