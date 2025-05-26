"use client";

import { useState, useEffect, useRef } from "react";
import BlogList from "./Blog/List";
import { PAGE_LIMIT } from "@/config";

type InfiniteScrollProps = {
  initialPosts: any[]; //First posts to be displayed
  totalPages?: number; //How many pages there are. The ? symbol is truthy, so its optional
  className?: string; //Style class
};

//Accepts the initial posts and total pages as props
export function Main({
  initialPosts,
  totalPages = 1, //Default to 1 if no value is given to us
  className, //CSS Class to apply to the container
}: InfiniteScrollProps) {
  //Creates variable posts to store all posts loaded
  //The useState here will be used to store the inital posts
  const [posts, setPosts] = useState(initialPosts);
  //Keeps track of page we're on
  const [currentPage, setCurrentPage] = useState(1);
  //Keeps track of if we're loading more posts
  const [isLoading, setIsLoading] = useState(false);
  //Creates a reference to the container element
  //Used to check if user has scrolled to bottom of the page
  //The useref stores container element
  const containerRef = useRef<HTMLDivElement | null>(null);

  //Fetches more post when users scrolls down
  const fetchMorePosts = async () => {
    //Does nothing if posts are loaded or reached the last page
    if (isLoading || currentPage >= totalPages) return;
    //Sets loading to true to preven multiple fetches
    setIsLoading(true);
    //Calculates next page number
    const nextPage = currentPage + 1;
    //Fetches posts from the server
    const response = await fetch(`/api/posts?page=${nextPage}&limit=${PAGE_LIMIT}`);
    //Waits for the response to be converted to JSON
    const data = await response.json();

    //Adds any new posts to existing list, and cretes array with old and new posts
    setPosts((prevPosts) => [...prevPosts, ...data.posts]);
    //Updates the current page to the next page
    setCurrentPage(nextPage);
    //Sets loading to false so more posts can be loaded later
    setIsLoading(false);
  };

  //Useffect in this case is used to add an event listener to the container element
  useEffect(() => {
    //Runs when the user scrolls down
    const handleScroll = () => {
      //Stops if the container is not defined
      if (!containerRef.current) return;
      //Get info on scroll position
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current; 
      //Load more post if within 50 pixels of the bottom
      if (scrollHeight - scrollTop <= clientHeight + 50) {
        fetchMorePosts();
      }
    };
    //Adds even listner to the container element
    const container = containerRef.current;
    //Calls the handleScroll function when the user scrolls
    container?.addEventListener("scroll", handleScroll);
    //It removes the event listener when the container is no longer in use, 
    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, currentPage, totalPages]); //Runs only if these change

  return (
    <div
      ref={containerRef}
      className={`h-screen overflow-y-auto p-8 ${className}`}
    >
      <div className="p-4 bg-gray-100 dark:bg-gray-900">
        <BlogList posts={posts} />
        {isLoading && (
          <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
            Loading...
          </p>
        )}
      </div>
    </div>
  );
}
