import { type Post } from "@repo/db/data";
import Link from "next/link";
import { marked } from "marked";
import { FaRegHeart } from "react-icons/fa";

export function BlogListItem({ post }: { post: Post & { liked?: boolean } }) {
  const date = new Date(post.date);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  const formattedDate = `${day} ${month} ${year}`;

  const displayViews = post.views;

  return (
    <article
      data-test-id={`blog-post-${post.id}`}
      className="prose mx-auto grid aspect-[7/5] w-full max-w-4xl grid-cols-1 grid-rows-[30%_70%] space-y-4 rounded-lg bg-gray-100 lg:aspect-[5/2] lg:grid-cols-[35%_65%] lg:grid-rows-1 dark:bg-gray-900"
    >
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="h-full w-full rounded-lg object-cover"
        />
      )}
      <div className="flex h-full min-h-0 flex-col p-4">
        <div className="flex items-center gap-6">
          <span className="text-gray-600 dark:text-gray-400">
            {formattedDate}
          </span>
          <span className="rounded-full bg-white px-4 py-1">
            {post.category}
          </span>
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
            <span>{displayViews} views</span>
            <div className="flex items-center gap-2">
              <span>{post.likes} likes</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
