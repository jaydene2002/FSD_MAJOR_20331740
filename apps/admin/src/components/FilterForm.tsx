'use client'; // Directive to tell Next.js this is a client component that runs in the browser, not on the server

// Import necessary hooks from Next.js and React
import {useSearchParams } from 'next/navigation'; // Hook to access URL query parameters
import { useState } from 'react'; // Hook to create and manage component state

/**
 * FilterForm Component
 * 
 * This component creates a filtering interface for blog posts with:
 * - Content text search field
 * - Tag filter field
 * - Date filter field (in DDMMYYYY format)
 * - Sorting dropdown
 * 
 * It synchronizes UI state with URL parameters to create bookmarkable/shareable filtered views.
 * The component communicates filter changes to its parent via custom events.
 * 
 * @returns JSX element containing the filter form UI
 */
export default function FilterForm() {
  // Get access to the current URL query parameters
  // This hook returns an immutable object of the current URL's query parameters
  const searchParams = useSearchParams();
  
  // STATE MANAGEMENT: Initialize state variables with values from URL or empty strings
  // The || operator provides a fallback empty string if the parameter doesn't exist
  // The searchParams.get() method returns the value of a specific query parameter or null if it doesn't exist
  const [contentFilter, setContentFilter] = useState(searchParams.get('content') || '');
  const [tagFilter, setTagFilter] = useState(searchParams.get('tag') || '');
  const [dateFilter, setDateFilter] = useState(searchParams.get('date') || '');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || ''); 
  
  /**
   * Updates URL query parameters and broadcasts a custom event with all filter values
   * 
   * This function:
   * 1. Creates a new URLSearchParams object from the current URL parameters
   * 2. Updates or removes a specific parameter based on the provided value
   * 3. Updates the browser URL without triggering page reload using history.replaceState
   * 4. Dispatches a custom event for other components to react to filter changes
   * 
   * @param name - The query parameter name to update ('content', 'tag', 'date', or 'sort')
   * @param value - The new value for the parameter (empty string removes the parameter)
   */
  const updateUrl = (name: string, value: string) => {
    // Create a mutable copy of the current URL query parameters
    // The toString() method converts the URLSearchParams object to a URL-encoded string
    const params = new URLSearchParams(searchParams.toString());
    
    // Conditional parameter handling based on value presence
    if (value) {
      // If value exists, set/update the parameter
      // The set() method adds or updates a parameter in the URLSearchParams object
      params.set(name, value);
    } else {
      // If value is empty, remove the parameter completely
      // The delete() method removes a parameter from the URLSearchParams object
      params.delete(name);
    }

    // Update the browser URL without navigating/reloading the page
    // null = no state object, '' = no title change, `/?${params}` = new URL with query string
    window.history.replaceState(null, '', `/?${params.toString()}`);
    
    // Create and dispatch a custom event to notify other components of filter changes
    // The CustomEvent constructor creates a new custom event object
    // The detail property contains data passed with the event - in this case all current filter values
    const event = new CustomEvent('urlchange', { 
      detail: { 
        // The ternary operator checks if the current parameter being updated is this specific filter
        // If it is, use the new value; otherwise, use the current state value
        content: name === 'content' ? value : contentFilter,
        tag: name === 'tag' ? value : tagFilter,
        date: name === 'date' ? value : dateFilter,
        sort: name === 'sort' ? value : sortOption
      } 
    });
    // Dispatch the event to the global window object so other components can listen for it
    window.dispatchEvent(event);
  };

  /**
   * Event handler for content filter changes
   * 
   * Updates the contentFilter state and URL when the content search field changes
   * 
   * @param e - The React change event from the input element
   */
  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Extract the current input value from the event target
    const value = e.target.value;
    // Update the local state with the new value
    setContentFilter(value);
    // Update the URL and notify other components
    updateUrl('content', value);
  };
  
  /**
   * Event handler for tag filter changes
   * 
   * Updates the tagFilter state and URL when the tag field changes
   * 
   * @param e - The React change event from the input element
   */
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Extract the current input value from the event target
    const value = e.target.value;
    // Update the local state with the new value
    setTagFilter(value);
    // Update the URL and notify other components
    updateUrl('tag', value);
  };
  
  /**
   * Event handler for date filter changes
   * 
   * Updates the dateFilter state and URL when the date field changes
   * The date is expected in DDMMYYYY format (e.g., "15052023" for May 15, 2023)
   * 
   * @param e - The React change event from the input element
   */
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Extract the current input value from the event target
    const value = e.target.value;
    // Update the local state with the new value
    setDateFilter(value);
    // Update the URL and notify other components
    updateUrl('date', value);
  };
  
  /**
   * Event handler for sort option changes
   * 
   * Updates the sortOption state and URL when the sort dropdown selection changes
   * 
   * @param e - The React change event from the select element
   */
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Extract the current select value from the event target
    const value = e.target.value;
    // Update the local state with the new value
    setSortOption(value);
    // Update the URL and notify other components
    updateUrl('sort', value);
  };

  // RENDER THE FILTER FORM UI
  return (
    // Container div with styling - margin-bottom, padding, background color, border, and rounded corners
    <div className="mb-6 p-4 bg-gray-50 border rounded">
      {/* Flexbox container for the form fields - wraps on smaller screens with spacing between items */}
      <div className="flex flex-wrap gap-4">
        {/* CONTENT FILTER FIELD */}
        <div className="flex flex-col">
          {/* Label for the content filter with styling for margin, text size, and font weight */}
          <label htmlFor="content-filter" className="mb-1 text-sm font-medium">Filter by Content:</label>
          {/* Text input for content filter - connects to label via id, displays current state value */}
          <input 
            id="content-filter"
            type="text"
            value={contentFilter}  // Controlled component bound to contentFilter state
            onChange={handleContentChange}  // Event handler updates state and URL on typing
            className="p-2 border rounded"  // Styling for padding, border, and rounded corners
            data-test-id="content-filter"  // Attribute for automated testing
          />
        </div>
        
        {/* TAG FILTER FIELD */}
        <div className="flex flex-col">
          {/* Label for the tag filter */}
          <label htmlFor="tag-filter" className="mb-1 text-sm font-medium">Filter by Tag:</label>
          {/* Text input for tag filter */}
          <input 
            id="tag-filter"
            type="text"
            value={tagFilter}  // Controlled component bound to tagFilter state
            onChange={handleTagChange}  // Event handler updates state and URL on typing
            className="p-2 border rounded"  // Styling for padding, border, and rounded corners
            data-test-id="tag-filter"  // Attribute for automated testing
          />
        </div>
        
        {/* DATE FILTER FIELD */}
        <div className="flex flex-col">
          {/* Label for the date filter */}
          <label htmlFor="date-filter" className="mb-1 text-sm font-medium">Filter by Date Created:</label>
          {/* Text input for date filter - expects DDMMYYYY format */}
          <input 
            id="date-filter"
            type="text"
            value={dateFilter}  // Controlled component bound to dateFilter state
            onChange={handleDateChange}  // Event handler updates state and URL on typing
            className="p-2 border rounded"  // Styling for padding, border, and rounded corners
            data-test-id="date-filter"  // Attribute for automated testing
          />
        </div>
        
        {/* SORT SELECTION DROPDOWN */}
        <div className="flex flex-col">
          {/* Label for the sort dropdown */}
          <label htmlFor="sort-by" className="mb-1 text-sm font-medium">Sort By:</label>
          {/* Select dropdown for sort options */}
          <select 
            id="sort-by"
            value={sortOption}  // Controlled component bound to sortOption state
            onChange={handleSortChange}  // Event handler updates state and URL on selection
            className="p-2 border rounded"  // Styling for padding, border, and rounded corners
          >
            {/* Default empty option with dashes as placeholder text */}
            <option value="">----</option> 
            {/* Sort options with values that match the server's expected format */}
            <option value="title-asc">Title (A-Z)</option>  {/* Alphabetical title sort */}
            <option value="title-desc">Title (Z-A)</option>  {/* Reverse alphabetical title sort */}
            <option value="date-asc">Date (Oldest)</option>  {/* Chronological date sort */}
            <option value="date-desc">Date (Newest)</option>  {/* Reverse chronological date sort */}
          </select>
        </div>
      </div>
    </div>
  );
}