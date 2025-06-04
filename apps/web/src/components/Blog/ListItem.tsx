import { useState } from "react";
import { toggleLike } from "@/actions/posts";
import { type Post } from "@repo/db/data";
import Link from "next/link";
import { marked } from "marked";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useUser } from "@/app/context/UserContext";

export function BlogListItem({ post }: { post: Post & { liked?: boolean } }) {
  const userIp = useUser();
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(post.liked || false);


  const date = new Date(post.date);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  const formattedDate = `${day} ${month} ${year}`;

  const handleLike = async () => {
    const result = await toggleLike(post.id, userIp || "");
    if (result?.post) {
      setLikes(result.post.likes);
      setLiked(result.liked);
    }
  };

  return (
    <article
      data-test-id={`blog-post-${post.id}`}
      className="prose mx-auto w-full max-w-4xl rounded-lg bg-gray-100 dark:bg-gray-900 grid grid-rows-[30%_70%] grid-cols-1 lg:grid-rows-1 lg:grid-cols-[35%_65%] aspect-[7/5] lg:aspect-[5/2] space-y-4"
    >
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="h-full w-full rounded-lg object-cover"
        />
      )}
      <div className="flex h-full min-h-0 flex-col p-4">
        <div className="flex gap-6 items-center">
          <span className="text-gray-600 dark:text-gray-400">{formattedDate}</span>
          <span className="py-1 px-4 bg-white rounded-full">{post.category}</span>
        </div>
        <div className="my-2">
          <Link
            href={`/post/${post.urlId}`}
            className="text-xl font-bold text-gray-900 no-underline hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
          >
            {post.title}
          </Link>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: marked(post.description) }} />
        </div>

        <div className="mt-auto gap-x-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex gap-2">
            {post.tags
              ?.split(",")
              .map((tag, index) => <span key={index}>#{tag.trim()}</span>)}
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