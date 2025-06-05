"use client";

import { toggleLike } from "@/actions/posts";
import { useState } from "react";
import Link from "next/link";
import { marked } from "marked";
import { FaRegHeart, FaHeart } from "react-icons/fa";
/**
 * Blog post detail component for displaying full article content.
 * Handles like/unlike functionality with user IP tracking.
 * Renders formatted markdown content with proper styling.
 */
export function Post({ post, userIp }: { post: any; userIp: string }) {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(post.liked || false);

  const date = new Date(post.date);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  const formattedDate = `${day} ${month} ${year}`;
  const contentHtml = marked(post.content);

  const handleLike = async () => {
    const result = await toggleLike(post.id, userIp);
    if (result?.post) {
      setLikes(result.post.likes);
      setLiked(result.liked);
    }
  };

  return (
    <article
      data-test-id={`blog-post-${post.id}`}
      className="prose mx-auto max-w-4xl space-y-6 p-6 mt-4"
    >
      <div className="flex items-center gap-6">
        <span className="text-gray-600 dark:text-gray-400">
          {formattedDate}
        </span>
        <span className="rounded-full bg-white px-4 py-1">{post.category}</span>
      </div>
      {/* Make the title text itself a link */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        <Link
          href={`/post/${post.urlId}`}
          className="text-gray-900 no-underline dark:text-white"
        >
          {post.title}
        </Link>
      </h1>
      <div className="my-2">
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full rounded-lg"
          />
        )}
      </div>

      <div className="">
        <div
          data-test-id="content-markdown"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
          className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200"
        />
        <div className="flex flex-col gap-x-3 text-sm text-gray-600 dark:text-gray-400 mt-4">
          <div className="flex gap-2">
            {post.tags
              ?.split(",")
              .map((tag: string, index: number) => (
                <span key={index}>#{tag.trim()}</span>
              ))}
          </div>
          <hr className="!my-4 border-t border-gray-300 dark:border-gray-700" />
          <div className="flex items-center justify-between">
            <span>{post.views} views</span>
            <span
              className="flex cursor-pointer select-none items-center gap-2"
              onClick={handleLike}
              data-test-id="like-button"
              title={liked ? "Unlike" : "Like"}
            >
              {liked ? (
                <FaHeart className="h-4 w-4 text-red-600" />
              ) : (
                <FaRegHeart className="h-4 w-4 text-red-500" />
              )}
              {likes} likes
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
