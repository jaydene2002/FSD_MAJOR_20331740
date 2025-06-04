import { redirect } from "next/navigation";
import { isLoggedIn } from "../../../utils/auth";
import Link from "next/link";
import PostForm from "../../../components/PostForm";
import { getPosts } from "../../../actions/posts";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;

  const loggedIn = await isLoggedIn();
  if (!loggedIn) {
    redirect("/");
  }

  // Get all posts and find the one with matching the urlId
  const allPosts = await getPosts();
  const post = allPosts.find((p) => p.urlId === urlId);

  if (!post) {
    return (
      <main className="p-6">
        <div className="mb-6">
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            ← Back to posts
          </Link>
        </div>
        <h1 className="mb-4 text-2xl font-bold">Post not found</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col p-6">
      <div className="mb-6 w-full text-right">
        <Link href="/" className="text-blue-500 hover:text-blue-700">
          ← Back to posts
        </Link>
      </div>
      <div className="w-full text-center">
        <h1 className="mb-6 text-2xl font-bold">Edit Post</h1>
      </div>
      <PostForm post={post} />
    </main>
  );
}
