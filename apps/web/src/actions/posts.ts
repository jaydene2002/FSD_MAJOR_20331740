"use server";

import { client } from "@repo/db/client";
import { PAGE_LIMIT } from "@/config";

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
      orderBy: { date: "desc" },
    });

    console.log("Fetched filtered posts:", posts);
    return posts;
  } catch (error) {
    console.error("Error fetching filtered posts:", error);
    return [];
  }
}

// This function fetches posts with pagination, we need to wait for posts to be fetched before we move on.
export async function loadPaginatedPosts(page: number = 1, limit: number = PAGE_LIMIT) {
  try {
    // Ensure page is at least 1
    const currentPage = Math.max(page, 1);
    //How many posts to skip per page, default is 3
    const skip = (currentPage - 1) * limit;
    // Fetch posts from the database
    const posts = await client.db.post.findMany({
      where: { active: true },
      orderBy: { date: "desc" },
      skip, // Skip the first (page - 1) * limit posts
      take: limit, // Take the next limit posts
    });
    //Counts total number of posts
    const totalPosts = await client.db.post.count({ where: { active: true } });
    // Calculate total pages based on the total number of posts and the limit
    const totalPages = Math.ceil(totalPosts / limit);
    //Debugging purposes
    console.log(`Fetched posts for page ${currentPage}:`, posts);
    //Returns actual amount of posts for this page
    //Along with current page, total pages, total posts, and if there are more pages
    return {
      posts,
      pagination: {
        currentPage,
        totalPages,
        totalPosts,
        hasNextPage: currentPage < totalPages, // Check if there are more pages
        hasPreviousPage: currentPage > 1, // Check if there are previous pages
      },
    };
  } catch (error) {
    //If there is an error, log it and return an empty array
    console.error("Error fetching paginated posts:", error);
    return {
      posts: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalPosts: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
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
      where: { postId, userIP },
    });

    if (existingLike) {
      // Unlike
      await client.db.like.deleteMany({
        where: {
          postId,
          userIP, // Use a combination of fields to uniquely identify the record
        },
      });
      const post = await client.db.post.update({
        where: { id: postId },
        data: { likes: { decrement: 1 } },
      });
      console.log(`Post ID ${postId} unliked by IP: ${userIP}`);
      return { post, liked: false };
    } else {
      // Like
      await client.db.like.create({
        data: { postId, userIP },
      });
      const post = await client.db.post.update({
        where: { id: postId },
        data: { likes: { increment: 1 } },
      });
      console.log(`Post ID ${postId} liked by IP: ${userIP}`);
      return { post, liked: true };
    }
  } catch (error) {
    console.error(`Error toggling like for post ID ${postId}:`, error);
    return null;
  }
}