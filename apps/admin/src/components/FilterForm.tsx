'use client';

import {useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function FilterForm() {
  const searchParams = useSearchParams();
  
  const [contentFilter, setContentFilter] = useState(searchParams.get('content') || '');
  const [tagFilter, setTagFilter] = useState(searchParams.get('tag') || '');
  const [dateFilter, setDateFilter] = useState(searchParams.get('date') || '');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || ''); 
  
  const updateUrl = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    window.history.replaceState(null, '', `/?${params.toString()}`);
    
    const event = new CustomEvent('urlchange', { 
      detail: { 
        content: name === 'content' ? value : contentFilter,
        tag: name === 'tag' ? value : tagFilter,
        date: name === 'date' ? value : dateFilter,
        sort: name === 'sort' ? value : sortOption
      } 
    });
    window.dispatchEvent(event);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContentFilter(value);
    updateUrl('content', value);
  };
  
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagFilter(value);
    updateUrl('tag', value);
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateFilter(value);
    updateUrl('date', value);
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortOption(value);
    updateUrl('sort', value);
  };

  return (
    <div className="mb-6 p-4 bg-gray-50 border rounded">
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col">
          <label htmlFor="content-filter" className="mb-1 text-sm font-medium">Filter by Content:</label>
          <input 
            id="content-filter"
            type="text"
            value={contentFilter}
            onChange={handleContentChange}
            className="p-2 border rounded"
            data-test-id="content-filter"
          />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="tag-filter" className="mb-1 text-sm font-medium">Filter by Tag:</label>
          <input 
            id="tag-filter"
            type="text"
            value={tagFilter}
            onChange={handleTagChange}
            className="p-2 border rounded"
            data-test-id="tag-filter"
          />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="date-filter" className="mb-1 text-sm font-medium">Filter by Date Created:</label>
          <input 
            id="date-filter"
            type="text"
            value={dateFilter}
            onChange={handleDateChange}
            className="p-2 border rounded"
            data-test-id="date-filter"
          />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="sort-by" className="mb-1 text-sm font-medium">Sort By:</label>
          <select 
            id="sort-by"
            value={sortOption}
            onChange={handleSortChange}
            className="p-2 border rounded"
          ><option value="">----</option> 
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="date-desc">Date (Newest)</option>
          </select>
        </div>
      </div>
    </div>
  );
}