// Import necessary modules from Next.js and our custom components
import { cookies } from "next/headers";           // Lets us work with cookies on the server side
import { redirect } from "next/navigation";       // Allows us to redirect users to different pages
import { isLoggedIn } from "../utils/auth";       // Our function that checks if the user is authenticated
import FilterForm from "../components/FilterForm"; // Component for filtering posts by various criteria
import Link from "next/link";                     // Creates client-side navigation links
import PostList from "../components/PostList";    // Component that displays the list of blog posts
import { getPosts } from "../actions/posts";      // Server function to fetch posts from the database


async function logout() {
  "use server";
  
  // Delete the auth_token cookie to end the user's session
  (await cookies()).delete("auth_token");
  
  // Redirect to the home page which will show the login form since user is no longer authenticated
  redirect("/");
}


export default async function Home({ 
  searchParams 
}: { 
  // Type definition for URL query parameters with optional filters
  searchParams: Promise<{ content?: string, tag?: string, date?: string, sort?: string }>
}) {
  // Extract the filter parameters from the URL query string
  const { content, tag, date, sort } = await searchParams;
  
  // Check if the user is logged in by verifying their JWT token
  // This calls our isLoggedIn function which checks for a valid auth_token cookie
  const loggedIn = await isLoggedIn();
  
  // AUTHENTICATION CHECK - If not logged in, show the login form
  if (!loggedIn) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Sign in to your account</h1>
        {/* Login form that posts directly to our API authentication endpoint */}
        <form 
          action="/api/auth" // Form submits to our auth API route
          method="post"      // Uses HTTP POST method as required for login
          className="w-full max-w-md space-y-4"
        >
          <div>
            <label htmlFor="password" className="block mb-2">Password</label>
            <input 
              id="password"    // Connects input to label for accessibility
              name="password"  // Field name our API expects
              type="password"  // Masks the password as dots for security
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

  // AUTHENTICATED USER VIEW - This section only runs if the user is logged in
  
  // Load filtered posts from the database using our server action
  // This performs server-side filtering based on the URL parameters
  const filters = { content, tag, date, sort };
  const allPosts = await getPosts(filters);

  // Prepare initial filter values for components
  // The || operator provides a fallback empty string if the parameter is undefined
  const initialContentFilter = content || '';
  const initialTagFilter = tag || '';
  const initialDateFilter = date || '';
  const initialSortOption = sort || ''; 
  
  // Render the admin dashboard with post management interface
  return (
    <main className="p-6">
      {/* Header section with title and action buttons */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin of Full Stack Blog</h1>
        <div className="flex gap-4">
          {/* Create Post button - Links to the post creation page */}
          <Link href="/posts/create" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Create Post
          </Link>
          {/* Logout form - Uses our server action to handle logout */}
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
      
      {/* Filter interface for searching and filtering posts */}
      <FilterForm />
      
      {/* Post list showing all filtered posts from the database */}
      {/* The data is already filtered on the server by our getPosts function */}
      <PostList 
        allPosts={allPosts} // Pass the pre-filtered posts from the server
        initialContent={initialContentFilter} // Initial content search value
        initialTag={initialTagFilter}         // Initial tag filter value
        initialDate={initialDateFilter}       // Initial date filter value
        initialSort={initialSortOption}       // Initial sort option
      />
    </main>
  );
}