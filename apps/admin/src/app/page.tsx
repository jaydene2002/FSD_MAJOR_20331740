import { cookies } from "next/headers";
import { posts } from "@repo/db/data";
import { redirect } from "next/navigation";
import { isLoggedIn } from "../utils/auth";
import FilterForm from "../components/FilterForm";
import Link from "next/link";
import PostList from "../components/PostList";
import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin";

async function login(formData: FormData) {
  "use server";
  const password = formData.get("password");
  if (password === "123") {
    // Create a proper JWT token
    const token = jwt.sign(
      { userId: "admin" }, // Payload with user info
      env.JWT_SECRET || "super-secret-password", // Use the secret from your .env
    );
    
    (await cookies()).set({
      name: "auth_token",
      value: token, // Set the JWT as the cookie value
      path: "/",
      httpOnly: true
    });
  }
  redirect("/");
}

async function logout() {
  "use server";
  (await cookies()).delete({
    name: "auth_token",
    path: "/"
  });
  redirect("/");
}

export default async function Home({ 
  searchParams 
}: { 
  searchParams: Promise<{ content?: string, tag?: string, date?: string, sort?: string }>
}) {
  const { content, tag, date, sort } = await searchParams;
  
  const loggedIn = await isLoggedIn();
  
  if (!loggedIn) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Sign in to your account</h1>
        <form action={login} className="w-full max-w-md space-y-4">
          <div>
            <label htmlFor="password" className="block mb-2">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password"
              className="w-full p-2 border rounded" 
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Sign In
          </button>
        </form>
      </main>
    );
  }

  const initialContentFilter = content || '';
  const initialTagFilter = tag || '';
  const initialDateFilter = date || '';
  const initialSortOption = sort || ''; 
  
  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin of Full Stack Blog</h1>
        <div className="flex gap-4">
          <Link href="/posts/create" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Create Post
          </Link>
          <form action={logout}>
            <button 
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
      
      <FilterForm />
      
      {/* Use a client component for real-time filtering without navigation */}
      <PostList 
        allPosts={posts} 
        initialContent={initialContentFilter}
        initialTag={initialTagFilter}
        initialDate={initialDateFilter}
        initialSort={initialSortOption}
      />
    </main>
  );
}