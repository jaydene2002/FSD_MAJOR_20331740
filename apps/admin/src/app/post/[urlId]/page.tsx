import { cookies } from "next/headers";
import { posts } from "@repo/db/data";
import { redirect } from "next/navigation";
import { isLoggedIn } from "../../../utils/auth";
import Link from "next/link";
import PostForm from "../../../components/PostForm";

export default async function EditPostPage({ 
  params 
}: { 
  params: Promise<{ urlId: string }>
}) {
  const { urlId } = await params;
  
  const loggedIn = await isLoggedIn();
  if (!loggedIn) {
    redirect("/");
  }

  // Find the post by urlId
  const post = posts.find(p => p.urlId === urlId);
  if (!post) {
    return (
      <main className="p-6">
        <div className="mb-6">
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            ← Back to posts
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
      </main>
    );
  }

  return (
    <main className="p-6">
      <div className="mb-6">
        <Link href="/" className="text-blue-500 hover:text-blue-700">
          ← Back to posts
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      
      <PostForm post={post} />
    </main>
  );
}