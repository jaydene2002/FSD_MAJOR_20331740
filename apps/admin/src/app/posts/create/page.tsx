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
    <main className="mx-auto w-full max-w-4xl p-6 text-center flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      <PostForm isCreate={true} />
    </main>
  );
}