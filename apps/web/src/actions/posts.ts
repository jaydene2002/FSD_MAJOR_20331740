"use server";

import { client } from "@repo/db/client";

export async function fetchUpdatedPosts(urlId?: string) {
  try {
    if (urlId) {
      // Fetch a specific post by ID
      const post = await client.db.post.findUnique({
        where: { urlId },
      });
      console.log(`Fetched post with url ID ${urlId}:`, post);
      return post ? [post] : [];
    } else {
      // Fetch all active posts
      const posts = await client.db.post.findMany({
        where: { active: true },
        orderBy: { date: "desc" },
      });
      console.log("Fetched all active posts:", posts);
      return posts;
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function incrementViews(postId: number) {
  try {
    const post = await client.db.post.update({
      where: { id: postId },
      data: { views: { increment: 1 } },
    });
    console.log(`Incremented views for post ID ${postId}:`, post.views);
    return post;
  } catch (error) {
    console.error(`Error incrementing views for post ID ${postId}:`, error);
    return null;
  }
}

export async function toggleLike(postId: number, userIP: string) {
  try {
    const existingLike = await client.db.like.findFirst({
      where: { postId, userIP }
    });

    if (existingLike) {
      // Unlike
      await client.db.like.deleteMany({
        where: {
          postId, userIP // Use a combination of fields to uniquely identify the record
        });
      const post = await client.db.post.update({
        where: { id: postId },
        data: { likes: { decrement: 1 } }
      });
      console.log(`Post ID ${postId} unliked by IP: ${userIP}`);
      return { post, liked: false };
    } else {
      // Like
      await client.db.like.create({
        data: { postId, userIP }
      });
      const post = await client.db.post.update({
        where: { id: postId },
        data: { likes: { increment: 1 } }
      });
      console.log(`Post ID ${postId} liked by IP: ${userIP}`);
      return { post, liked: true };
    }
  } catch (error) {
    console.error(`Error toggling like for post ID ${postId}:`, error);
    return null;
  }
}