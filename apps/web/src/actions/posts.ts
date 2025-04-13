'use server';

import { posts } from "@repo/db/data";

export async function incrementViews(postId: number) {
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.views += 1;
  }
  return post;
}

export async function toggleLike(postId: number) {
  const post = posts.find(p => p.id === postId);
  if (post) {
    
    const postWithLiked = post as any;
    
    // Toggle like/unlike
    if (postWithLiked._liked) {
      post.likes -= 1;
      postWithLiked._liked = false;
    } else {
      post.likes += 1;
      postWithLiked._liked = true;
    }
  }
  return post;
}