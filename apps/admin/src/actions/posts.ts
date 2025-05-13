'use server';

import { Post, posts } from "@repo/db/data";
import { client } from "@repo/db/client";


export async function togglePostActive(postId: number) {
  try {

    const post = await client.db.post.findUnique({
      where: { id: postId } 
    });
    
    if (post) {
      // If the post exists in the database, update its active status by toggling it (true→false or false→true)
      // The update operation modifies the existing record and returns the updated version
      const updatedPost = await client.db.post.update({
        where: { id: postId }, // Target the specific post by its ID
        data: { active: !post.active } // Flip the current 'active' boolean value to its opposite
      });
      
      // Log the successful operation with the post ID and its new active status for debugging/auditing
      console.log(`Post ${postId} active status toggled to: ${updatedPost.active}`);
      
      // Return the fully updated post object to the caller
      return updatedPost;
    } else {
      // If no post with the given ID was found in the database, log this information
      console.log(`Post with ID ${postId} not found`);
      
      // Return undefined to indicate to the caller that the operation couldn't be completed
      return undefined;
    }
  } catch (error) {
    // If any database errors occur during the try block, this catch block handles them
    // This could happen during development, testing, or if the database is temporarily unavailable
    console.error("Error toggling post active status:", error);
    
    // FALLBACK MECHANISM: If the database operation fails, try to work with in-memory data instead
    // This search finds the first post in the in-memory array that matches the given ID
    const post = posts.find(p => p.id === postId);
    
    if (post) {
      // If a matching post is found in the in-memory array, toggle its active status directly
      post.active = !post.active;
      
      // Log that we used the fallback mechanism and the new status
      console.log(`[Fallback] Post ${postId} active status toggled to: ${post.active}`);
      
      // Simulate a database delay to make the UI experience more realistic
      // This prevents the UI from updating too quickly during development
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Return the updated post from memory, or undefined if no matching post was found
    return post;
  }
}

export async function getPosts(filters?: {
  content?: string; // Optional text to search within post titles and content
  tag?: string;     // Optional tag to filter posts by
  date?: string;    // Optional date string in DDMMYYYY format to filter posts on or after
  sort?: string;    // Optional sort parameter in format 'field-direction'
}): Promise<Post[]> {
  try {
    // Initialize an empty 'where' object to build our database query conditions
    // This object will be populated with different filtering conditions based on the provided filters
    const where: any = {};
    
    // CONTENT FILTERING: Search in both title and content fields if a content filter is provided
    if (filters?.content) {
      // Convert the search text to lowercase to enable case-insensitive searching
      // This is necessary for SQLite which doesn't natively support case-insensitive search with 'mode: insensitive'
      const searchText = filters.content.toLowerCase();
      
      // Set up an OR condition to match posts where EITHER the title OR the content contains the search text
      // This broadens the search to find posts that might mention the term in either place
      where.OR = [
        { title: { contains: searchText } },   // Match if title contains the search text
        { content: { contains: searchText } }  // Match if content contains the search text
      ];
    }
    
    // TAG FILTERING: Filter posts by tag if a tag filter is provided
    if (filters?.tag) {
      // For SQLite database backends, we use simple 'contains' without specifying a mode parameter
      // This searches for the tag text anywhere within the tags field
      // Note: In a production system, tags would ideally be a relation, not a text field
      where.tags = { contains: filters.tag };
    }
    
    // DATE FILTERING: Filter posts by publication date if a date filter is provided
    if (filters?.date && /^\d{8}$/.test(filters.date)) {
      // Validate that the date string matches the expected format (8 digits)
      // Then extract the day, month, and year components from the DDMMYYYY format
      const day = filters.date.substring(0, 2);    // First 2 characters are the day
      const month = filters.date.substring(2, 4);  // Next 2 characters are the month
      const year = filters.date.substring(4);      // Remaining characters are the year
      
      // Construct a JavaScript Date object from these components
      // Format the date string as YYYY-MM-DD for the Date constructor
      const inputDate = new Date(`${year}-${month}-${day}`);
      
      // Only apply the date filter if we successfully parsed a valid date
      // isNaN(date.getTime()) returns true if the date is invalid
      if (!isNaN(inputDate.getTime())) {
        // Set up a 'greater than or equal to' filter on the date field
        // This will find posts published on or after the specified date
        where.date = { gte: inputDate };
      }
    }
    
    // SORTING: Determine the sort order for the results
    // Default to sorting by date in descending order (newest first)
    let orderBy: any = { date: 'desc' };
    
    // Apply custom sorting if specified in the filters
    if (filters?.sort) {
      switch (filters.sort) {
        case 'title-asc':
          // Sort alphabetically by title (A-Z)
          orderBy = { title: 'asc' };
          break;
        case 'title-desc':
          // Sort reverse alphabetically by title (Z-A)
          orderBy = { title: 'desc' };
          break;
        case 'date-asc':
          // Sort chronologically by date (oldest first)
          orderBy = { date: 'asc' };
          break;
        case 'date-desc':
          // Sort reverse chronologically by date (newest first)
          orderBy = { date: 'desc' };
          break;
      }
    }
    
    // EXECUTE THE DATABASE QUERY: Fetch filtered posts from the database
    // This is where the actual database interaction happens
    // The 'where' object contains all our filter conditions, and 'orderBy' controls the sorting
    const dbPosts = await client.db.post.findMany({
      where,    // Apply all the filter conditions constructed above
      orderBy   // Apply the determined sort order
    });
    
    // Log the number of posts found for debugging and monitoring purposes
    console.log(`Loaded ${dbPosts.length} filtered posts from database`);
    
    // Map the database post objects to our application's Post type
    // This ensures the structure matches what the rest of the application expects
    return dbPosts.map(post => ({
      id: post.id,               // Unique identifier for the post
      urlId: post.urlId,         // URL-friendly slug for the post
      title: post.title,         // Post title
      content: post.content,     // Main content body of the post
      description: post.description, // Short summary of the post
      imageUrl: post.imageUrl,   // URL to the post's featured image
      date: post.date,           // Publication date
      category: post.category,   // Category classification
      views: post.views,         // View count
      likes: post.likes,         // Like count
      tags: post.tags,           // Comma-separated tags
      active: post.active        // Whether the post is active/visible
    }));
  } catch (error) {
    // FALLBACK MECHANISM: If the database query fails for any reason, switch to in-memory filtering
    // This ensures the application remains functional during development or database issues
    
    // Log the error for debugging and monitoring
    console.error("Error loading posts from database:", error);
    console.log("Fallback to in-memory filtering");
    
    // Start with a copy of all posts from the in-memory array
    // Using spread operator creates a new array, so we don't modify the original
    let filteredPosts = [...posts];
    
    // CONTENT FILTERING: Apply the same content filter logic to the in-memory array
    if (filters?.content) {
      const searchText = filters.content.toLowerCase(); // Convert to lowercase for case-insensitive comparison
      
      // Filter the array to only include posts that contain the search text in title or content
      filteredPosts = filteredPosts.filter(p => 
        p.title.toLowerCase().includes(searchText) || // Check if title contains the search text
        p.content.toLowerCase().includes(searchText)  // Check if content contains the search text
      );
    }
    
    // TAG FILTERING: Apply tag filtering to the in-memory array
    if (filters?.tag) {
      const tagText = filters.tag.toLowerCase(); // Convert to lowercase for case-insensitive comparison
      
      // Filter to only include posts that have the tag text in their tags field
      filteredPosts = filteredPosts.filter(p => 
        p.tags.toLowerCase().includes(tagText) // Check if tags field contains the tag text
      );
    }
    
    // DATE FILTERING: Apply date filtering to the in-memory array
    if (filters?.date && /^\d{8}$/.test(filters.date)) {
      // Parse the date components as in the database version
      const day = filters.date.substring(0, 2);
      const month = filters.date.substring(2, 4);
      const year = filters.date.substring(4);
      
      // Create a Date object for comparison
      const inputDate = new Date(`${year}-${month}-${day}`);
      
      if (!isNaN(inputDate.getTime())) {
        // Filter to only include posts with dates on or after the input date
        filteredPosts = filteredPosts.filter(p => new Date(p.date) >= inputDate);
      } else {
        // If the date is invalid, return an empty array to match database behavior
        filteredPosts = [];
      }
    }
    
    // SORTING: Apply the same sorting logic to the in-memory array
    if (filters?.sort) {
      switch (filters.sort) {
        case 'title-asc':
          // Sort alphabetically by title (A-Z) using string comparison
          filteredPosts.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'title-desc':
          // Sort reverse alphabetically by title (Z-A) using string comparison
          filteredPosts.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case 'date-asc':
          // Sort chronologically by date (oldest first) using timestamp comparison
          filteredPosts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          break;
        case 'date-desc':
          // Sort reverse chronologically by date (newest first) using timestamp comparison
          filteredPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          break;
        default:
          // Default to newest first if an invalid sort option is provided
          filteredPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
    } else {
      // Default sort by date desc (newest first) if no sort option is provided
      filteredPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    // Return the filtered and sorted array of posts
    return filteredPosts;
  }
}

export async function savePost(updatedPost: Post) {

  console.log("Entered save post");
  
  try {
  
    if (updatedPost.id !== 0) {

      const updatedDbPost = await client.db.post.update({
        where: { id: updatedPost.id }, // Target the specific post by its ID
        data: {
          // We only update user-editable fields, maintaining data integrity for system-managed fields
          title: updatedPost.title,           // Update the post title
          description: updatedPost.description, // Update the post description/summary
          content: updatedPost.content,       // Update the main content body
          imageUrl: updatedPost.imageUrl,     // Update the featured image URL
          category: updatedPost.category,     // Update the category classification
          tags: updatedPost.tags,             // Update the comma-separated tags
          active: updatedPost.active          // Update visibility status
          // Note: We deliberately DON'T update fields like date, views, likes, urlId
        }
      });
      
      // Log the successful update operation
      console.log(`Post ${updatedPost.id} updated in database`);
      
      // Return the updated post from the database, cast to our Post type
      return updatedDbPost as Post;
    } else {
 
      const urlId = updatedPost.title
        .toLowerCase()                // Convert to lowercase
        .replace(/[^\w\s-]/g, '')     // Remove special characters
        .replace(/\s+/g, '-');        // Replace spaces with hyphens
      
      // Create a new post record in the database with all required fields
      const newPost = await client.db.post.create({
        data: {
          title: updatedPost.title,           // User-provided title
          urlId: urlId,                       // Generated URL-friendly slug
          description: updatedPost.description, // User-provided description
          content: updatedPost.content,       // User-provided content
          imageUrl: updatedPost.imageUrl,     // User-provided image URL
          category: updatedPost.category,     // User-provided category
          tags: updatedPost.tags,             // User-provided tags
          date: new Date(),                   // Current timestamp as publication date
          views: 0,                           // Initialize view count to zero
          likes: 0,                           // Initialize like count to zero
          active: true                        // New posts are active by default
        }
      });
      
      // Log the successful creation operation with the new post ID
      console.log(`New post created in database with ID ${newPost.id}`);
      
      // Return the newly created post, cast to our Post type
      return newPost as Post;
    }
  } catch (error) {
    // FALLBACK MECHANISM: If the database operation fails, fall back to in-memory operations
    // This ensures the application remains functional during development or database issues
    
    // Log the error and indicate we're falling back to in-memory operations
    console.error("Error saving post to database:", error);
    console.log("Fallback to in-memory posts array");
    
    // Find the index of the post in our in-memory array (if it exists)
    // This will be -1 if the post doesn't exist
    const postIndex = posts.findIndex(p => p.id === updatedPost.id);
    
    if (postIndex !== -1) {
      // UPDATE SCENARIO: The post exists in our in-memory array
      
      // Replace the existing post with the updated version
      // Using spread operator to create a completely new object (avoiding reference issues)
      posts[postIndex] = { ...updatedPost };
      
      // Log the successful in-memory update
      console.log(`[Fallback] Post ${updatedPost.id} updated in memory`);
      
      // Simulate a database delay for more realistic UI experience
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return the updated post
      return posts[postIndex];
    } else {
      // CREATION SCENARIO: We need to create a new post in memory
      // We only reach this block for new posts (ID=0) or if we couldn't find an existing post to update
      
      if (updatedPost.id === 0) {
        // Generate a new unique ID for the post
        // We find the maximum ID in the existing posts array and add 1
        const newId = Math.max(...posts.map(p => p.id)) + 1;
        
        // Create a URL-friendly slug from the post title using the same logic as the database version
        const urlId = updatedPost.title
          .toLowerCase()                // Convert to lowercase
          .replace(/[^\w\s-]/g, '')     // Remove special characters
          .replace(/\s+/g, '-');        // Replace spaces with hyphens
        
        // Create a new post object with all required fields
        const newPost: Post = {
          ...updatedPost,               // Copy all user-provided fields
          id: newId,                    // Set the new unique ID
          urlId,                        // Set the URL-friendly slug
          date: new Date(),             // Set the current timestamp as publication date
          views: 0,                     // Initialize view count to zero
          likes: 0,                     // Initialize like count to zero
          active: true                  // New posts are active by default
        };
        
        // Add the new post to our in-memory array
        posts.push(newPost);
        
        // Log the successful in-memory creation
        console.log(`[Fallback] New post created in memory with ID ${newId}`);
        
        // Simulate a database delay for more realistic UI experience
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Return the newly created post
        return newPost;
      } else {
        // This case occurs if we're trying to update a post that doesn't exist
        // Log the failed operation
        console.log(`[Fallback] Post with ID ${updatedPost.id} not found`);
        
        // Return undefined to indicate the operation failed
        return undefined;
      }
    }
  }
}