import { redirect } from "next/navigation";
import { isLoggedIn } from "../../../utils/auth";
import Link from "next/link";
import PostForm from "../../../components/PostForm";

//Create post page
export default async function CreatePostPage() {
  const loggedIn = await isLoggedIn();
  if (!loggedIn) {
    redirect("/");
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col p-6">
      <div className="mb-6 w-full text-right">
        <Link href="/" className="text-blue-500 hover:text-blue-700">
          ← Back to posts
        </Link>
      </div>
      <div className="w-full text-center">
        <h1 className="mb-6 text-2xl font-bold">Create New Post</h1>
      </div>
      <PostForm isCreate={true} />
    </main>
  );
}
