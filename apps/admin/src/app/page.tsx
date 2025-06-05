import { isLoggedIn } from "../utils/auth";       
import FilterForm from "../components/FilterForm"; 
import PostList from "../components/PostList";    
import { getPosts } from "../actions/posts";      
import LoginForm from "../components/LoginForm";


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
      <div className="w-full h-[calc(100vh-5rem)] flex flex-col justify-center items-center p-6">
        <h1 className="text-2xl font-bold mb-4">Sign in to your account</h1>
        <LoginForm />
      </div>
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
    <div>
      {/* Filter interface for searching and filtering posts */}
      <FilterForm />
      
      {/* Post list showing all filtered posts from the database */}
      {/* The data is already filtered on the server by our getPosts function */}
      <PostList 
        allPosts={allPosts} 
        initialContent={initialContentFilter} 
        initialTag={initialTagFilter}         
        initialDate={initialDateFilter}       
        initialSort={initialSortOption}       
      />
    </div>
  );
}