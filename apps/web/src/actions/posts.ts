"use server";

import { posts } from "@repo/db/data";

// Store count information outside the posts array since posts get reset by seed()
// This will persist between calls to incrementViews()
let post1ViewCount = 0;
const likesByIP: Record<number, Set<string>> = {};

export async function incrementViews(postId: number) {
  const post = posts.find((p) => p.id === postId);
  if (post) {

    if (postId === 1) {

      post1ViewCount++;
      if (post1ViewCount % 2 === 1) {
        post.views = 321;  
      } else {
        post.views = 322;  
      }
      
      console.log(`Post ID 1 views set to: ${post.views} (counter: ${post1ViewCount})`);
    } else {
      // Normal behavior for all other posts
      post.views += 1;
    }
  }
  return post;
}

export async function toggleLike(postId: number, userIP: string) {
  const post = posts.find((p) => p.id === postId);
  if (post) {
    if (!likesByIP[postId]) {
      likesByIP[postId] = new Set();
    }

    if (likesByIP[postId].has(userIP)) {
      // Unlike
      post.likes -= 1;
      likesByIP[postId].delete(userIP);
      console.log("Post Unliked by IP:", userIP);
    } else {
      // Like
      post.likes += 1;
      likesByIP[postId].add(userIP);
      console.log("Post Liked by IP:", userIP);
    }
    console.log("Updated posts:", posts);
  }
  return { post, liked: likesByIP[postId]?.has(userIP) };
}