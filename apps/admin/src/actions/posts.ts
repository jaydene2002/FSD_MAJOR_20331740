'use server';

import { posts } from "@repo/db/data";

/**
 * Toggle the active status of a post
 * @param postId The ID of the post to toggle
 * @returns The updated post or undefined if not found
 */
export async function togglePostActive(postId: number) {
  // Find the post by ID
  const post = posts.find(p => p.id === postId);
  
  if (post) {
    // Toggle the active status
    post.active = !post.active;
    console.log(`Post ${postId} active status toggled to: ${post.active}`);
  } else {
    console.log(`Post with ID ${postId} not found`);
  }
  
  return post;
}