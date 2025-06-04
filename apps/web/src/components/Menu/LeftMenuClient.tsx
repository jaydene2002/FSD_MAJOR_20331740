"use client";

import { useState } from "react";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";
import { BaseList } from "@/components/Menu/BaseList";
import { FaBars, FaTimes } from "react-icons/fa";

export function LeftMenuClient({ posts }: { posts: any }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="fixed left-4 top-4 z-[100] block rounded-lg border border-gray-300 bg-white w-10 h-10 flex items-center justify-center p-0 md:hidden dark:border-gray-700 dark:bg-gray-800"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
      >
        <FaBars className="w-6 h-6 text-gray-800 dark:text-gray-100" />
      </button>

      {/* Sidebar - Modified for fixed positioning on desktop */}
      <aside
        className={`fixed left-0 top-0 z-[100] h-screen w-64 overflow-y-auto border-r border-gray-200 bg-white transition-transform duration-300 dark:border-gray-700 dark:bg-gray-800 ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{ willChange: "transform" }}
      >
        <div className="flex justify-end p-2 md:hidden">
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="rounded w-10 h-10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <FaTimes className="w-6 h-6 text-gray-800 dark:text-gray-100" />
          </button>
        </div>
        <div className="p-4 pt-6">
          <div className="mb-6 flex items-center gap-2">
            <img src="/wsulogo.png" alt="WSU Logo" className="h-auto w-8" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Full Stack Blog
            </h2>
          </div>
          <nav>
            <BaseList />
            <ul
              role="list"
              className="flex flex-1 flex-col gap-y-7 border-t border-gray-200 pt-6 dark:border-gray-700"
            >
              <li className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-300 dark:text-white">
                  Categories
                </h2>
                <CategoryList posts={posts} />
              </li>
              <li className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-300 dark:text-white">
                  History
                </h2>
                <HistoryList posts={posts} />
              </li>
              <li className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-300 dark:text-white">
                  Tags
                </h2>
                <TagList posts={posts} />
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[90] bg-transparent md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}
