"use client";

/**
 * Filter form component for the admin interface
 * 
 * This component provides filtering and sorting capabilities for the post list.
 * It maintains filter state for content text search, tag filtering, date filtering,
 * and sort order selection.
 * 
 * The component updates the URL with query parameters to maintain state across
 * page refreshes and dispatches custom events when filters change to notify
 * parent components.
 */

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FilterForm() {
  const searchParams = useSearchParams();

  const [contentFilter, setContentFilter] = useState(
    searchParams.get("content") || "",
  );
  const [tagFilter, setTagFilter] = useState(searchParams.get("tag") || "");
  const [dateFilter, setDateFilter] = useState(searchParams.get("date") || "");
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "");

  const updateUrl = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    window.history.replaceState(null, "", `/?${params.toString()}`);

    const event = new CustomEvent("urlchange", {
      detail: {
        content: name === "content" ? value : contentFilter,
        tag: name === "tag" ? value : tagFilter,
        date: name === "date" ? value : dateFilter,
        sort: name === "sort" ? value : sortOption,
      },
    });
    window.dispatchEvent(event);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContentFilter(value);
    updateUrl("content", value);
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagFilter(value);
    updateUrl("tag", value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateFilter(value);
    updateUrl("date", value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortOption(value);
    updateUrl("sort", value);
  };

  return (
    <div className="sticky top-20 z-30 mx-auto w-full max-w-4xl bg-white p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 md:justify-center gap-4 md:flex-row md:items-end md:gap-4">
        <div className="flex flex-col">
          <label
            htmlFor="content-filter"
            className="mb-1 text-sm font-medium text-gray-400"
          >
            Filter by Content:
          </label>
          <input
            id="content-filter"
            type="text"
            value={contentFilter}
            onChange={handleContentChange}
            className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-900"
            data-test-id="content-filter"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="tag-filter"
            className="mb-1 text-sm font-medium text-gray-400"
          >
            Filter by Tag:
          </label>
          <input
            id="tag-filter"
            type="text"
            value={tagFilter}
            onChange={handleTagChange}
            className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-900"
            data-test-id="tag-filter"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="date-filter"
            className="mb-1 text-sm font-medium text-gray-400"
          >
            Filter by Date Created:
          </label>
          <input
            id="date-filter"
            type="text"
            value={dateFilter}
            onChange={handleDateChange}
            className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-900"
            data-test-id="date-filter"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="sort-by"
            className="mb-1 text-sm font-medium text-gray-400"
          >
            Sort By:
          </label>
          <select
            id="sort-by"
            value={sortOption}
            onChange={handleSortChange}
            className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-900"
          >
            <option value="">Recent</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="date-desc">Date (Newest)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
