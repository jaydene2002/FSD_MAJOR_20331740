"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import ThemeSwitch from "../Themes/ThemeSwitcher";
/**
 * Top navigation menu component with search functionality and theme toggle.
 * Implements debounced search with URL updates and real-time filtering.
 * Maintains synchronized state between URL parameters and search input.
 */
function debounce<T extends (...args: any[]) => any>(fn: T, delay = 300) {
  let timeoutId: any;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function TopMenu({ query }: { query?: string }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(query || "");
  const isInitialMount = useRef(true);
  const userTyping = useRef(false);

  // Update URL with debounce to avoid excessive history entries
  const updateURL = debounce((search: string) => {
    router.push(`/search?q=${encodeURIComponent(search)}`, { scroll: false });
  }, 500);

  // Handle search input changes
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setSearchQuery(newQuery);
    userTyping.current = true;

    // Dispatch custom event for real-time filtering
    const searchEvent = new CustomEvent("search-query-changed", {
      detail: { query: newQuery },
    });
    window.dispatchEvent(searchEvent);

    // Update URL with slight delay
    updateURL(newQuery);
  };

  // Initialize with query from props only on initial mount
  useEffect(() => {
    if (isInitialMount.current && query !== undefined) {
      setSearchQuery(query);
      isInitialMount.current = false;
    }
  }, [query]);

  return (
    <div className="sticky h-20 top-0 z-50 pl-12 md:pl-0 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-2">
          <form
            action="#"
            method="GET"
            className="flex-1 max-w-lg"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="relative">
              <input
                type="text"
                name="q"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-5 w-5 text-gray-400 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </form>
          <div className="flex items-center gap-x-4">
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </div>
  );
}