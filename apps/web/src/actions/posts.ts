"use server";

import { posts } from "@repo/db/data";


const likesByIP: Record<number, Set<string>> = {};

export async function incrementViews(postId: number) {
  const post = posts.find((p) => p.id === postId);
  if (post) {
    post.views += 1;
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