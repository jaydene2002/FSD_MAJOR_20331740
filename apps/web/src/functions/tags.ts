import type { Post } from "@repo/db/data";

interface TagItem {
  name: string;
  count: number;
}

// Keep the existing tags function
export async function tags(posts: Array<Pick<Post, 'tags' | 'active'> | Post>): Promise<TagItem[]> {
  // Filter only active posts
  const activePosts = posts.filter(post => post.active);
  
  // Count tags from active posts
  const tagCounts: Record<string, number> = {};
  
  activePosts.forEach(post => {
    if (!post.tags) return;
    
    const postTags = post.tags.split(',').map(tag => tag.trim());
    postTags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  // Convert to array of objects with name and count
  return Object.entries(tagCounts)
    .map(([name, count]): TagItem => ({
      name,
      count
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Add this function - it's what's missing from your code
export function getPostsByTag(posts: Post[], tagSlug: string): Post[] {
  // Convert URL slug format to tag format (e.g., "dev-tools" → "dev tools")
  const normalizedTagSlug = tagSlug.toLowerCase();
  const tagWithSpaces = normalizedTagSlug.replace(/-/g, ' ');
  
  return posts.filter(post => {
    // Only consider active posts with tags
    if (!post.active || !post.tags) return false;
    
    const postTags = post.tags
      .split(',')
      .map(tag => tag.trim().toLowerCase());
    
    // Check if any of the post's tags match our tag (either format)
    return postTags.some(tag => 
      tag === normalizedTagSlug || 
      tag === tagWithSpaces
    );
  });
}