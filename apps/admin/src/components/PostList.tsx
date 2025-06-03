"use client";

import { Post } from "@repo/db/data";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { togglePostActive } from "../actions/posts";
import { Post as BlogPost } from "./Post";

export default function PostList({
  allPosts,
  initialContent = "",
  initialTag = "",
  initialDate = "",
  initialSort = "",
}: {
  allPosts: Post[];
  initialContent?: string;
  initialTag?: string;
  initialDate?: string;
  initialSort?: string;
}) {
  const [searchText, setSearchText] = useState(initialContent);
  const [tagFilter, setTagFilter] = useState(initialTag);
  const [dateFilter, setDateFilter] = useState(initialDate);
  const [sortOption, setSortOption] = useState(initialSort);
  const [localPosts, setLocalPosts] = useState<Post[]>(allPosts);

  useEffect(() => {
    setLocalPosts(allPosts);
  }, [allPosts]);

  useEffect(() => {
    const handleUrlChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      setSearchText(customEvent.detail.content || "");
      setTagFilter(customEvent.detail.tag || "");
      setDateFilter(customEvent.detail.date || "");
      setSortOption(customEvent.detail.sort || "");
    };

    window.addEventListener("urlchange", handleUrlChange);
    return () => window.removeEventListener("urlchange", handleUrlChange);
  }, []);

  const handleToggleActive = async (id: number) => {
    const updatedPosts = localPosts.map((post) =>
      post.id === id ? { ...post, active: !post.active } : post,
    );

    setLocalPosts(updatedPosts);
    await togglePostActive(id);
  };

  const filteredPosts = useMemo(() => {
    let result = [...localPosts];

    if (searchText) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchText.toLowerCase()) ||
          p.content.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    if (tagFilter) {
      result = result.filter((p) =>
        p.tags.toLowerCase().includes(tagFilter.toLowerCase()),
      );
    }

    if (dateFilter) {
      const isValidFormat = /^\d{8}$/.test(dateFilter);

      if (isValidFormat) {
        const day = dateFilter.substring(0, 2);
        const month = dateFilter.substring(2, 4);
        const year = dateFilter.substring(4);

        const inputDate = new Date(`${year}-${month}-${day}`);

        if (!isNaN(inputDate.getTime())) {
          result = result.filter((p) => new Date(p.date) >= inputDate);
        } else {
          result = [];
        }
      } else {
        result = [];
      }
    }

    if (sortOption === "title-asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "title-desc") {
      result.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortOption === "date-asc") {
      result.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    } else if (sortOption === "date-desc") {
      result.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    } else {
      result.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    }

    return result;
  }, [localPosts, searchText, tagFilter, dateFilter, sortOption]);

  const displayPosts =
    !searchText && !tagFilter && !dateFilter && !sortOption
      ? filteredPosts.slice(0, 4)
      : filteredPosts;

  return (
    <div className="p-6 mx-auto w-full max-w-4xl space-y-6">
      <div className="flex flex-col gap-8">
        {displayPosts.map((post) => (
          <BlogPost post={post} key={post.id} onToggleActive={handleToggleActive} />
        ))}
      </div>

      {displayPosts.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-gray-500">No posts match your filters</p>
        </div>
      )}
    </div>
  );
}
