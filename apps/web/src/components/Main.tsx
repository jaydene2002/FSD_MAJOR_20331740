"use client";

import { useState, useEffect, useRef } from "react";
import BlogList from "./Blog/List";
import { PAGE_LIMIT } from "@/config";

type InfiniteScrollProps = {
  initialPosts: any[];
  totalPages?: number;
  className?: string;
};

export function Main({
  initialPosts,
  totalPages = 1,
  className,
}: InfiniteScrollProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const fetchMorePosts = async () => {
    if (isLoading || currentPage >= totalPages) return;

    setIsLoading(true);
    const nextPage = currentPage + 1;

    const response = await fetch(`/api/posts?page=${nextPage}&limit=${PAGE_LIMIT}`);
    const data = await response.json();

    setPosts((prevPosts) => [...prevPosts, ...data.posts]);
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
      className={`h-screen overflow-y-auto p-8 ${className}`}
    >
      <div className="p-4 bg-gray-100 dark:bg-gray-900">
        <BlogList posts={posts} />
        {isLoading && (
          <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
            Loading...
          </p>
        )}
      </div>
    </div>
  );
}
