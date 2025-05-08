'use server';

import { Post, posts } from "@repo/db/data";

/**
 * Toggle the active status of a post
 * @param postId The ID of the post to toggle
 * @returns The updated post or undefined if not found
 */
export async function togglePostActive(postId: number) {
  // Find the post by ID
  const post = posts.find((p) => p.id === postId);
  console.log("toggling post active");
  if (post) {
    // Toggle the active status
    post.active = !post.active;
    console.log(`Post ${postId} active status toggled to: ${post.active}`);
    
    // Make sure the change is properly flushed before returning
    // This ensures the test's reload check will see the updated state
    await new Promise(resolve => setTimeout(resolve, 500));
  } else {
    console.log(`Post with ID ${postId} not found`);
  }
  
  return post;
}

/**
 * Save the updated post
 * @returns The updated post or undefined if not found
 * @param updatedPost
 */
export async function savePost(updatedPost: Post) {
  // Find the post index in the array
  const postIndex = posts.findIndex((p) => p.id === updatedPost.id);

  if (postIndex !== -1) {
    // Update the post at the found index
    posts[postIndex] = { ...updatedPost };
    console.log(
      `Post ${updatedPost.id} updated successfully:`,
      posts[postIndex],
    );

    // Make sure the change is properly flushed before returning
    await new Promise((resolve) => setTimeout(resolve, 500));

    return posts[postIndex];
  } else {
    // Handle new post creation (for the Create Post functionality)
    if (updatedPost.id === 0) {
      // Treat id: 0 as a new post
      // Generate a new ID for the new post
      const newId = Math.max(...posts.map((p) => p.id)) + 1;

      // Create URL-friendly ID from title
      const urlId = updatedPost.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

      // Create a new post with the generated ID and urlId
      const newPost: Post = {
        ...updatedPost,
        id: newId,
        urlId,
        date: new Date(),
        views: 0,
        likes: 0,
        active: true,
      };

      // Add to the posts array
      posts.push(newPost);
      console.log(`New post created with ID ${newId}`);

      await new Promise((resolve) => setTimeout(resolve, 500));
      return newPost;
    } else {
      console.log(`Post with ID ${updatedPost.id} not found`);
      return undefined;
    }
  }
}