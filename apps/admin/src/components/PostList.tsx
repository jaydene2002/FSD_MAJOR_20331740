'use client'; // A client component, enabling client-side interactivity

import { Post } from "@repo/db/data"; // Import the Post type from shared database package
import Link from "next/link"; // Import Next.js Link component for client-side navigation
import { useEffect, useState, useMemo } from "react"; // Import React hooks for state management and optimization
import { togglePostActive } from "../actions/posts"; // Import server action to toggle post visibility

/**
 * PostList Component
 * 
 * This component displays a filterable, sortable grid of blog posts with the ability to toggle post visibility.
 * It receives server-filtered posts and can apply additional client-side filtering for responsive UI.
 * 
 * The component implements:
 * - Display of post cards in a responsive grid layout
 * - Client-side filtering by content, tags, and dates
 * - Client-side sorting options
 * - Optimistic UI updates when toggling post visibility
 * - URL-based filter synchronization
 * 
 * @param props Component props
 * @param props.allPosts Array of posts already filtered on the server
 * @param props.initialContent Initial search text from URL query parameters
 * @param props.initialTag Initial tag filter from URL query parameters
 * @param props.initialDate Initial date filter from URL query parameters (DDMMYYYY format)
 * @param props.initialSort Initial sort option from URL query parameters
 */
export default function PostList({
  allPosts,                // Array of posts pre-filtered on the server
  initialContent = '',     // Initial content search text (default: empty string)
  initialTag = '',         // Initial tag filter (default: empty string)
  initialDate = '',        // Initial date filter in DDMMYYYY format (default: empty string)
  initialSort = ''         // Initial sort option (default: empty string)
}: {
  allPosts: Post[],          // Required prop: Array of Post objects
  initialContent?: string,   // Optional prop: Initial content search text
  initialTag?: string,       // Optional prop: Initial tag filter
  initialDate?: string,      // Optional prop: Initial date filter
  initialSort?: string       // Optional prop: Initial sort option
}) {
  // STATE MANAGEMENT: Define state variables to track filter and sort parameters
  const [searchText, setSearchText] = useState(initialContent); // State for content search text
  const [tagFilter, setTagFilter] = useState(initialTag);       // State for tag filter
  const [dateFilter, setDateFilter] = useState(initialDate);    // State for date filter
  const [sortOption, setSortOption] = useState(initialSort);    // State for sort option
  const [localPosts, setLocalPosts] = useState<Post[]>(allPosts); // Local copy of posts for client-side operations

  // SERVER SYNC: Update local posts when server-filtered posts change
  // This effect runs whenever allPosts changes (e.g., when new filtered data arrives from server)
  useEffect(() => {
    setLocalPosts(allPosts); // Synchronize local state with server data
  }, [allPosts]); // Dependency array ensures effect only runs when allPosts changes

  // URL SYNC: Listen for URL parameter changes and update filters accordingly
  // This effect connects filter state to URL parameters for bookmarkable/shareable filtered views
  useEffect(() => {
    // Define event handler for custom 'urlchange' events
    const handleUrlChange = (event: Event) => {
      // Cast the generic Event to our custom event type with filter details
      const customEvent = event as CustomEvent;
      
      // Update all filter and sort states based on the URL parameters
      setSearchText(customEvent.detail.content || ''); // Update content search
      setTagFilter(customEvent.detail.tag || '');      // Update tag filter
      setDateFilter(customEvent.detail.date || '');    // Update date filter
      setSortOption(customEvent.detail.sort || '');    // Update sort option
    };

    // Register event listener for URL changes
    window.addEventListener('urlchange', handleUrlChange);
    
    // Cleanup function to prevent memory leaks by removing the event listener
    return () => window.removeEventListener('urlchange', handleUrlChange);
  }, []); // Empty dependency array means this effect runs once on component mount

  // TOGGLE POST ACTIVE STATUS: Handler for activating/deactivating posts
  // This function implements optimistic UI updates for a responsive user experience
  const handleToggleActive = async (id: number) => {
    // Create a new array with the post's active status toggled
    // Using map() to create a new array rather than modifying the existing one
    const updatedPosts = localPosts.map(post => 
      post.id === id ? { ...post, active: !post.active } : post // Toggle active status for matching post
    );
    
    // Update UI immediately (optimistic update) before server confirmation
    // This makes the UI feel responsive rather than waiting for the server
    setLocalPosts(updatedPosts);
    
    // Call server action to persist the change in the database
    // This happens asynchronously after the UI is already updated
    await togglePostActive(id);
  };

  // CLIENT-SIDE FILTERING AND SORTING: Filter and sort posts based on state
  // useMemo optimization prevents unnecessary re-filtering on every render
  const filteredPosts = useMemo(() => {
    // Start with a copy of all local posts to avoid mutating the original array
    let result = [...localPosts];
    
    // CONTENT FILTERING: Filter by text in title or content
    if (searchText) {
      // Filter posts to include only those containing the search text in title or content
      // Case-insensitive search by converting both strings to lowercase
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchText.toLowerCase()) ||   // Check title
          p.content.toLowerCase().includes(searchText.toLowerCase())    // Check content
      );
    }

    // TAG FILTERING: Filter by tags field
    if (tagFilter) {
      // Filter posts to include only those containing the tag text
      // Case-insensitive tag matching by converting to lowercase
      result = result.filter((p) =>
        p.tags.toLowerCase().includes(tagFilter.toLowerCase())
      );
    }

    // DATE FILTERING: Filter by publication date
    if (dateFilter) {
      // Validate date format is exactly 8 digits (DDMMYYYY)
      const isValidFormat = /^\d{8}$/.test(dateFilter);
      
      if (isValidFormat) {
        // Extract date components from the DDMMYYYY string
        const day = dateFilter.substring(0, 2);      // First 2 digits = day
        const month = dateFilter.substring(2, 4);    // Next 2 digits = month
        const year = dateFilter.substring(4);        // Remaining digits = year
    
        // Create a JavaScript Date object in YYYY-MM-DD format
        const inputDate = new Date(`${year}-${month}-${day}`);
    
        // Only apply the filter if the date is valid
        // isNaN(date.getTime()) returns true if the date is invalid
        if (!isNaN(inputDate.getTime())) {
          // Filter to posts with publication date on or after the input date
          result = result.filter((p) => new Date(p.date) >= inputDate);
        } else {
          // If the date is invalid, return empty results
          result = [];
        }
      } else {
        // If the format doesn't match DDMMYYYY, return empty results
        result = [];
      }
    }

    // SORTING: Apply selected sort option
    if (sortOption === "title-asc") {
      // Sort alphabetically by title (A to Z)
      // localeCompare provides proper alphabetical sorting for all languages
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "title-desc") {
      // Sort reverse alphabetically by title (Z to A)
      result.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortOption === "date-asc") {
      // Sort chronologically by date (oldest first)
      // Convert dates to timestamps for numerical comparison
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortOption === "date-desc") {
      // Sort reverse chronologically by date (newest first)
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
      // Default sort: newest posts first
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    // Return the filtered and sorted array of posts
    return result;
  }, [localPosts, searchText, tagFilter, dateFilter, sortOption]); // Dependencies that trigger recalculation

  // LIMIT DISPLAY: Show limited posts on home screen if no filters are active
  // This creates a cleaner homepage while still allowing full filtered results
  const displayPosts = !searchText && !tagFilter && !dateFilter && !sortOption
    ? filteredPosts.slice(0, 4)  // Show only the first 4 posts if no filters are active
    : filteredPosts;             // Show all filtered posts when any filter is active

  return (
    <div className="space-y-6"> {/* Container with vertical spacing between sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Responsive grid layout: 1 column on mobile, 2 on tablets, 3 on desktops */}
        {displayPosts.map((post) => (
          <article
            key={post.id} // Unique React key for efficient list rendering
            className="border rounded-lg overflow-hidden shadow-sm" // Card styling with border and subtle shadow
            data-test-id={`post-${post.id}`} // Data attribute for automated testing
          >
            <img
              src={post.imageUrl} // Post featured image URL
              alt={post.title}   // Accessible alt text matching the post title
              className="w-full h-48 object-cover" // Fixed height image that covers its container
            />
            <div className="p-4"> {/* Card content padding */}
              <Link
                href={`/post/${post.urlId}`} // Link to the post detail page using the URL-friendly slug
                className="text-xl font-semibold text-gray-900 hover:text-indigo-600" // Styling with hover effect
              >
                {post.title} {/* Display the post title as a clickable link */}
              </Link>
              <p className="mt-2 text-sm text-gray-600">{post.description}</p> {/* Post description/summary */}
              <div className="mt-4 flex items-center justify-between"> {/* Container for the active status toggle */}
                {post.active ? (
                  // For active posts: Green button indicating active status
                  <button
                    onClick={() => handleToggleActive(post.id)} // Trigger the toggle action when clicked
                    className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800" // Green styling
                  >
                    Active {/* Text indicates current status */}
                  </button>
                ) : (
                  // For inactive posts: Red button indicating inactive status
                  <button
                    onClick={() => handleToggleActive(post.id)} // Same toggle action for consistency
                    className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800" // Red styling
                  >
                    Inactive {/* Text indicates current status */}
                  </button>
                )}
              </div>
              <div className="mt-2"> {/* Tags section */}
                <span className="text-sm text-gray-500">
                  #{post.tags.split(",").join(", #")} {/* Format tags with hash prefix and comma separation */}
                </span>
              </div>
              <div className="mt-2"> {/* Category section */}
                <span className="text-sm text-gray-500">
                  {post.category} {/* Display the post category */}
                </span>
              </div>
              <div className="mt-2"> {/* Publication date section */}
                <time className="text-sm text-gray-500">
                  {/* Format date in a human-readable format (e.g., "Mar 15, 2023") */}
                  Posted on {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </time>
              </div>
            </div>
          </article>
        ))}
      </div>
      
      {/* Display a message when no posts match the current filters */}
      {displayPosts.length === 0 && (
        <div className="text-center py-8"> {/* Centered container with vertical padding */}
          <p className="text-gray-500">No posts match your filters</p> {/* User-friendly empty state message */}
        </div>
      )}
    </div>
  );
}