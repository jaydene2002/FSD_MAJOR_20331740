import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isLoggedIn } from "../utils/auth";
import FilterForm from "../components/FilterForm";
import Link from "next/link";
import PostList from "../components/PostList";
import { getPosts } from "../actions/posts";


async function logout() {
  "use server";
  
  (await cookies()).delete("auth_token");
  
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
        <form 
          action="/api/auth"
          method="post"
          className="w-full max-w-md space-y-4"
        >
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

  const filters = { content, tag, date, sort };
  const allPosts = await getPosts(filters);

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
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
      
      <FilterForm />
      
      <PostList 
        allPosts={allPosts}
        initialContent={initialContentFilter}
        initialTag={initialTagFilter}
        initialDate={initialDateFilter}
        initialSort={initialSortOption}
      />
    </main>
  );
}