'use client';

import { Post } from "@repo/db/data";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { togglePostActive } from "../actions/posts";

export default function PostList({
  allPosts,               
  initialContent = '',     
  initialTag = '',         
  initialDate = '',        
  initialSort = ''        
}: {
  allPosts: Post[],          
  initialContent?: string,  
  initialTag?: string,       
  initialDate?: string,      
  initialSort?: string       
}) {
  const [searchText, setSearchText] = useState(initialContent);
  const [tagFilter, setTagFilter] = useState(initialTag);
  const [dateFilter, setDateFilter] = useState(initialDate);
  const [sortOption, setSortOption] = useState(initialSort);
  const [localPosts, setLocalPosts] = useState<Post[]>(allPosts);

  useEffect(() => {
    setLocalPosts(allPosts);
  }, [allPosts]);

  useEffect(() => {
    const handleUrlChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      setSearchText(customEvent.detail.content || '');
      setTagFilter(customEvent.detail.tag || '');
      setDateFilter(customEvent.detail.date || '');
      setSortOption(customEvent.detail.sort || '');
    };

    window.addEventListener('urlchange', handleUrlChange);
    return () => window.removeEventListener('urlchange', handleUrlChange);
  }, []);

  const handleToggleActive = async (id: number) => {
    const updatedPosts = localPosts.map(post => 
      post.id === id ? { ...post, active: !post.active } : post
    );
    
    setLocalPosts(updatedPosts);
    await togglePostActive(id);
  };

  const filteredPosts = useMemo(() => {
    let result = [...localPosts];
    
    if (searchText) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchText.toLowerCase()) ||
          p.content.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (tagFilter) {
      result = result.filter((p) =>
        p.tags.toLowerCase().includes(tagFilter.toLowerCase())
      );
    }

    if (dateFilter) {
      const isValidFormat = /^\d{8}$/.test(dateFilter);
      
      if (isValidFormat) {
        const day = dateFilter.substring(0, 2);
        const month = dateFilter.substring(2, 4);
        const year = dateFilter.substring(4);
    
        const inputDate = new Date(`${year}-${month}-${day}`);
    
        if (!isNaN(inputDate.getTime())) {
          result = result.filter((p) => new Date(p.date) >= inputDate);
        } else {
          result = [];
        }
      } else {
        result = [];
      }
    }

    if (sortOption === "title-asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "title-desc") {
      result.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortOption === "date-asc") {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortOption === "date-desc") {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    return result;
  }, [localPosts, searchText, tagFilter, dateFilter, sortOption]);

  const displayPosts = !searchText && !tagFilter && !dateFilter && !sortOption
    ? filteredPosts.slice(0, 4)
    : filteredPosts;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayPosts.map((post) => (
          <article
            key={post.id}
            className="border rounded-lg overflow-hidden shadow-sm"
            data-test-id={`post-${post.id}`}
          >
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <Link
                href={`/post/${post.urlId}`}
                className="text-xl font-semibold text-gray-900 hover:text-indigo-600"
              >
                {post.title}
              </Link>
              <p className="mt-2 text-sm text-gray-600">{post.description}</p>
              <div className="mt-4 flex items-center justify-between">
                {post.active ? (
                  <button
                    onClick={() => handleToggleActive(post.id)}
                    className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                  >
                    Active
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleActive(post.id)}
                    className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                  >
                    Inactive
                  </button>
                )}
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-500">
                  #{post.tags.split(",").join(", #")}
                </span>
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-500">
                  {post.category}
                </span>
              </div>
              <div className="mt-2">
                <time className="text-sm text-gray-500">
                  Posted on {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </time>
              </div>
            </div>
          </article>
        ))}
      </div>
      
      {displayPosts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No posts match your filters</p>
        </div>
      )}
    </div>
  );
}