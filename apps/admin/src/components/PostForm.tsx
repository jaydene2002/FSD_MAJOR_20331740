'use client';

import { useState, useRef, useEffect } from 'react';
import { Post } from '@repo/db/data';
import { marked } from 'marked';

type PostFormProps = {
  post?: Post;
  isCreate?: boolean;
}

export default function PostForm({ post, isCreate = false }: PostFormProps) {
  
  const [title, setTitle] = useState(post?.title || '');
  const [description, setDescription] = useState(post?.description || '');
  const [content, setContent] = useState(post?.content || '');
  const [imageUrl, setImageUrl] = useState(post?.imageUrl || '');
  const [tags, setTags] = useState(post?.tags || '');
  const [category, setCategory] = useState(post?.category || '');
  
  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showGlobalError, setShowGlobalError] = useState(false);
  
  // Preview state
  const [showPreview, setShowPreview] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  
  // URL validation regex
  const urlRegex = /^(http|https):\/\/[^ "]+$/;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.length > 200) {
      newErrors.description = 'Description is too long. Maximum is 200 characters';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    } else if (!urlRegex.test(imageUrl)) {
      newErrors.imageUrl = 'This is not a valid URL';
    }
    
    if (!tags.trim()) {
      newErrors.tags = 'At least one tag is required';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      setShowGlobalError(true);
      return;
    }
    
    setShowGlobalError(false);
    
    
    alert('Post updated successfully');
  };

  // Toggle preview and save cursor position
  const togglePreview = () => {
    if (!showPreview && contentRef.current) {
      setCursorPosition(contentRef.current.selectionStart);
    }
    setShowPreview(!showPreview);
  };
  
  // Restore cursor position after closing preview
  useEffect(() => {
    if (!showPreview && contentRef.current) {
      contentRef.current.focus();
      contentRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [showPreview, cursorPosition]);

  return (
    <form className="space-y-6 max-w-4xl" onSubmit={handleSubmit}>
      {showGlobalError && (
        <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded">
          Please fix the errors before saving
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block mb-2 font-medium">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {errors.title && <p className="mt-1 text-red-600">{errors.title}</p>}
      </div>
      
      <div>
        <label htmlFor="description" className="block mb-2 font-medium">Description</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        ></textarea>
        <p className="text-sm text-gray-500 mt-1">Max 200 characters</p>
        {errors.description && <p className="mt-1 text-red-600">{errors.description}</p>}
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="content" className="font-medium">Content (Markdown)</label>
          <button
            type="button"
            onClick={togglePreview}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm"
          >
            {showPreview ? 'Close Preview' : 'Preview'}
          </button>
        </div>
        
        {!showPreview ? (
          <textarea
            id="content"
            name="content"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded font-mono"
            ref={contentRef}
          ></textarea>
        ) : (
          <div 
            data-test-id="content-preview"
            className="w-full p-4 border rounded bg-white min-h-[200px]"
            dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
          />
        )}
        
        {errors.content && <p className="mt-1 text-red-600">{errors.content}</p>}
      </div>
      
      {isCreate && (
        <div>
          <label htmlFor="category" className="block mb-2 font-medium">Category</label>
          <input
            id="category"
            name="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
          />
          {errors.category && <p className="mt-1 text-red-600">{errors.category}</p>}
        </div>
      )}
      
      <div>
        <label htmlFor="tags" className="block mb-2 font-medium">Tags</label>
        <input
          id="tags"
          name="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {errors.tags && <p className="mt-1 text-red-600">{errors.tags}</p>}
      </div>
      
      <div>
        <label htmlFor="imageUrl" className="block mb-2 font-medium">Image URL</label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {errors.imageUrl && <p className="mt-1 text-red-600">{errors.imageUrl}</p>}
      </div>
      
      {imageUrl && (
        <div className="border rounded p-4">
          <p className="text-sm text-gray-500 mb-2">Image Display:</p>
          <img 
            src={imageUrl} 
            alt="Preview"
            data-test-id="image-preview"
            className="max-h-64 object-contain"
          />
        </div>
      )}
      
      <div className="flex justify-end gap-4">
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}