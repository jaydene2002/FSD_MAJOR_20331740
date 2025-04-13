import { redirect } from "next/navigation";
import { isLoggedIn } from "../../../utils/auth";
import Link from "next/link";
import PostForm from "../../../components/PostForm";

export default async function CreatePostPage() {
  const loggedIn = await isLoggedIn();
  if (!loggedIn) {
    redirect("/");
  }

  return (
    <main className="p-6">
      <div className="mb-6">
        <Link href="/" className="text-blue-500 hover:text-blue-700">
          ← Back to posts
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      
      <PostForm isCreate={true} />
    </main>
  );
}