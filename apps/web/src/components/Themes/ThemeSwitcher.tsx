"use client";

import { Button } from "@repo/ui/button";
import { useTheme } from "./ThemeContext";

const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      onClick={toggleTheme}
      data-test-id="theme-toggle"
      className="px-3 py-1 text-sm font-medium rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
    >
      {theme === "light" ? "Dark Mode" : "Light Mode"}
    </Button>
  );
};

export default ThemeSwitch;