"use server";

import { client } from "@repo/db/client";

export async function fetchUpdatedPosts(
  filter: { urlId?: string; category?: string } = {},
) {
  try {
    const whereClause: any = { active: true };

    if (filter.urlId) {
      whereClause.urlId = filter.urlId;
    }

    if (filter.category) {
      whereClause.category = filter.category;
    }

    console.log("Fetching posts with filter:", filter);
    const posts = await client.db.post.findMany({
      where: whereClause,
      orderBy: { date: "dec" },
    });

    console.log("Fetched filtered posts:", posts);
    return posts;
  } catch (error) {
    console.error("Error fetching filtered posts:", error);
    return [];
  }
}

export async function loadPaginatedPosts(page: number, limit: number = 10) {
  try {
    const skip = (page - 1) * limit;

    const posts = await client.db.post.findMany({
      where: { active: true },
      orderBy: { date: "desc" },
      skip,
      take: limit,
    });

    console.log(`Fetched posts for page ${page}:`, posts);
    return posts;
  } catch (error) {
    console.error("Error fetching paginated posts:", error);
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
      where: { postId, userIP ,
    });

    if (existingLike) {
      // Unlike
      await client.db.like.deleteMany({
        where: {
          postId,
          userIP // Use a combination of fields to uniquely identify the record
        },
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