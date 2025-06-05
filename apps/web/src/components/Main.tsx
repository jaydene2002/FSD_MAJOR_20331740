"use client";

import { useState, useEffect, useRef } from "react";
import BlogList from "./Blog/List";
import { PAGE_LIMIT } from "@/config";
/**
 * Main content component with infinite scroll pagination.
 * Handles post filtering, search functionality, and dynamic loading.
 * Manages scroll events to fetch additional posts when user reaches bottom.
 * Uses efficient state management for filtered and unfiltered post collections.
 * Provides loading indicators and empty state messaging for better UX.
 */
type InfiniteScrollProps = {
  initialPosts: any[];
  totalPages?: number;
  className?: string;
  initialSearchQuery?: string;
};

export function Main({
  initialPosts,
  totalPages = 1,
  className,
  initialSearchQuery = "",
}: InfiniteScrollProps) {
  const [allPosts, setAllPosts] = useState(initialPosts);
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Filter posts when search query changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredPosts(allPosts);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allPosts.filter(
      (post) =>
        post.active &&
        (post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query)),
    );
    setFilteredPosts(filtered);
  }, [searchQuery, allPosts]);

  // Update search query from parent components
  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  // Add search query to context through custom event
  useEffect(() => {
    const handleSearchUpdate = (event: CustomEvent) => {
      setSearchQuery(event.detail.query);
    };

    window.addEventListener(
      "search-query-changed",
      handleSearchUpdate as EventListener,
    );

    return () => {
      window.removeEventListener(
        "search-query-changed",
        handleSearchUpdate as EventListener,
      );
    };
  }, []);

  const fetchMorePosts = async () => {
    if (isLoading || currentPage >= totalPages) return;

    setIsLoading(true);
    const nextPage = currentPage + 1;

    const response = await fetch(
      `/api/posts?page=${nextPage}&limit=${PAGE_LIMIT}`,
    );
    const data = await response.json();

    setAllPosts((prevPosts) => [...prevPosts, ...data.posts]);
    setCurrentPage(nextPage);
    setIsLoading(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollHeight - scrollTop <= clientHeight + 50) {
        fetchMorePosts();
      }
    };

    const container = containerRef.current;
    container?.addEventListener("scroll", handleScroll);

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, currentPage, totalPages]);

  return (
    <div
      ref={containerRef}
      className={`h-full overflow-y-auto p-8 ${className}`}
    >
      <BlogList posts={filteredPosts}/>
      {isLoading && (
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
          Loading...
        </p>
      )}
      {!isLoading && searchQuery && filteredPosts.length === 0 && (
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
          No posts found matching "{searchQuery}"
        </p>
      )}
    </div>
  );
}
