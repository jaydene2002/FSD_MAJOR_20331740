'use server';

/**
 * Posts management server actions for the admin interface
 * 
 * @module posts
 * 
 * This module provides server actions for managing blog posts in the admin interface.
 * It handles CRUD operations for posts including:
 * - Toggling post visibility (active status)
 * - Retrieving posts with filtering and sorting options
 * - Creating new posts and updating existing ones
 * 
 * The Post type defines the structure of blog post objects with properties for
 * content, metadata, and status information.
 */

import { client } from "@repo/db/client";

// Define Post type directly to avoid any dependencies on @repo/db/data
type Post = {
  id: number;
  urlId: string;
  title: string;
  content: string;
  description: string;
  imageUrl: string;
  date: Date;
  category: string;
  views: number;
  likes: number;
  tags: string;
  active: boolean;
};

export async function togglePostActive(postId: number) {
  try {
    const post = await client.db.post.findUnique({
      where: { id: postId } 
    });
    
    if (post) {
      const updatedPost = await client.db.post.update({
        where: { id: postId },
        data: { active: !post.active }
      });
      
      console.log(`Post ${postId} active status toggled to: ${updatedPost.active}`);
      
      return updatedPost;
    } else {
      console.log(`Post with ID ${postId} not found`);
      
      return undefined;
    }
  } catch (error) {
    console.error("Error toggling post active status:", error);
    return null;
  }
}

export async function getPosts(filters?: {
  content?: string;
  tag?: string;
  date?: string;
  sort?: string;
}): Promise<Post[]> {
  try {
    const where: any = {};
    
    if (filters?.content) {
      const searchText = filters.content.toLowerCase();
      
      where.OR = [
        { title: { contains: searchText } },
        { content: { contains: searchText } }
      ];
    }
    
    if (filters?.tag) {
      where.tags = { contains: filters.tag };
    }
    
    if (filters?.date && /^\d{8}$/.test(filters.date)) {
      const day = filters.date.substring(0, 2);
      const month = filters.date.substring(2, 4);
      const year = filters.date.substring(4);
      
      const inputDate = new Date(`${year}-${month}-${day}`);
      
      if (!isNaN(inputDate.getTime())) {
        where.date = { gte: inputDate };
      }
    }
    
    let orderBy: any = { date: 'desc' };
    
    if (filters?.sort) {
      switch (filters.sort) {
        case 'title-asc':
          orderBy = { title: 'asc' };
          break;
        case 'title-desc':
          orderBy = { title: 'desc' };
          break;
        case 'date-asc':
          orderBy = { date: 'asc' };
          break;
        case 'date-desc':
          orderBy = { date: 'desc' };
          break;
      }
    }
    
    const dbPosts = await client.db.post.findMany({
      where,
      orderBy
    });
    
    console.log(`Loaded ${dbPosts.length} filtered posts from database`);
    
    return dbPosts as Post[];
  } catch (error) {
    console.error("Error loading posts from database:", error);
    return [];
  }
}

export async function savePost(updatedPost: Post) {
  console.log("Entered save post");
  
  try {
    if (updatedPost.id !== 0) {
      const updatedDbPost = await client.db.post.update({
        where: { id: updatedPost.id },
        data: {
          title: updatedPost.title,
          description: updatedPost.description,
          content: updatedPost.content,
          imageUrl: updatedPost.imageUrl,
          category: updatedPost.category,
          tags: updatedPost.tags,
          active: updatedPost.active
        }
      });
      
      console.log(`Post ${updatedPost.id} updated in database`);
      
      return updatedDbPost as Post;
    } else {
      const urlId = updatedPost.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      const newPost = await client.db.post.create({
        data: {
          title: updatedPost.title,
          urlId: urlId,
          description: updatedPost.description,
          content: updatedPost.content,
          imageUrl: updatedPost.imageUrl,
          category: updatedPost.category,
          tags: updatedPost.tags,
          date: new Date(),
          views: 0,
          likes: 0,
          active: true
        }
      });
      
      console.log(`New post created in database with ID ${newPost.id}`);
      
      return newPost as Post;
    }
  } catch (error) {
    console.error("Error saving post to database:", error);
    return null;
  }
}