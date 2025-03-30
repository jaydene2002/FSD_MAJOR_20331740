"use client";

import { useRouter } from "next/navigation";
import ThemeSwitch from "../Themes/ThemeSwitcher";

function debounce<T extends (...args: any[]) => any>(fn: T, delay = 300) {
  let timeoutId: any;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function TopMenu({ query }: { query?: string }) {
  const router = useRouter();

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const search = event.target.value;
      router.push(`/search?q=${search}`);
    },
  );

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <form action="#" method="GET" className="flex-1 max-w-lg">
            <div className="relative">
              <input
                type="text"
                name="q"
                placeholder="Search posts..."
                defaultValue={query}
                onChange={handleSearch}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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