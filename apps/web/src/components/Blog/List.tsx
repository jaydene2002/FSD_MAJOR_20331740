import type { Post } from "@repo/db/data";
import { BlogListItem } from "./ListItem";

export function BlogList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <div className="py-6 text-gray-900 dark:text-gray-100">0 Posts</div>;
  }

  return (
    <div className="mt-6 mb-16 flex flex-col gap-8">
      <div className="w-full mx-auto max-w-4xl my-5 mb-16">
        <h1 className="text-4xl font-medium text-black dark:text-white mb-2">From the blog</h1>
        <p className="text-black dark:text-white">Learn how to grow your business from our expert advice.</p>
      </div>
      {posts.map((post) => (
        <BlogListItem key={post.id} post={post} />
      ))}
    </div>
  );
}

export default BlogList;