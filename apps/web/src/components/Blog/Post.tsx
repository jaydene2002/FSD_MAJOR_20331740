"use client";

import { toggleLike } from "@/actions/posts";
import { useState } from "react";
import Link from "next/link";
import { marked } from "marked";

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
      className="prose mx-auto max-w-4xl space-y-6"
    >
      {/* Make the title text itself a link */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        <Link
          href={`/post/${post.urlId}`}
          className="text-gray-900 no-underline dark:text-white"
        >
          {post.title}
        </Link>
      </h1>

      <div className="flex gap-x-3 text-sm text-gray-600 dark:text-gray-400">
        <span>{post.category}</span>
        {post.tags
          ?.split(",")
          .map((tag: string, index: number) => (
            <span key={index}>#{tag.trim()}</span>
          ))}
        <span>{formattedDate}</span>
        <span>{post.views} views</span>
        <span>{likes} likes</span>
      </div>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full rounded-lg"
        />
      )}

      <div
        data-test-id="content-markdown"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
        className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200"
      />

      <button
        data-test-id="like-button"
        onClick={handleLike}
        className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
      >
        {liked ? "Unlike" : "Like"}
      </button>
    </article>
  );
}
