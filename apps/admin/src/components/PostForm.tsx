"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Post } from "@repo/db/data";
import { savePost } from "../actions/posts";
import RichTextEditor from "./RichTextEditor";
import ImageUploader from "./ImageUploader";

type PostFormProps = {
  post?: Post;
  isCreate?: boolean;
};

export default function PostForm({ post, isCreate = false }: PostFormProps) {
  const router = useRouter();
  const defaultPost: Post = isCreate
    ? {
        id: 0, // Temporary ID that will be replaced
        urlId: "",
        title: "",
        description: "",
        content: "",
        imageUrl: "",
        tags: "",
        category: "",
        date: new Date(),
        views: 0,
        likes: 0,
        active: true,
      }
    : post!;

  const [localPost, setLocalPost] = useState<Post>(defaultPost);
  const { title, description, content, imageUrl, tags, category } = localPost;
  const [success, setSuccess] = useState(false);

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showGlobalError, setShowGlobalError] = useState(false);

  // URL validation regex
  const urlRegex = /^(http|https):\/\/[^ "]+$/;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    // Validate all fields
    const newErrors: Record<string, string> = {};

    if (!title?.trim()) {
      newErrors.title = "Title is required";
    }

    if (!description?.trim()) {
      newErrors.description = "Description is required";
    } else if (description.length > 200) {
      newErrors.description =
        "Description is too long. Maximum is 200 characters";
    }

    if (!content?.trim()) {
      newErrors.content = "Content is required";
    }

    if (!imageUrl?.trim()) {
      newErrors.imageUrl = "Image URL is required";
    } else if (!urlRegex.test(imageUrl)) {
      newErrors.imageUrl = "This is not a valid URL";
    }

    if (!tags?.trim()) {
      newErrors.tags = "At least one tag is required";
    }

  if (isCreate && (!category?.trim() || !/^[A-Za-z]+$/.test(category || ''))) {
  newErrors.category = "Category is required and can only contain letters (no spaces, numbers, or special characters)";
}

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setShowGlobalError(true);
      return;
    }

    await savePost(localPost);
    setShowGlobalError(false);
    setSuccess(true);
  };

  const handleCancel = () => {
    router.push("/"); // Navigate back to admin home page
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {showGlobalError && (
        <div className="rounded border border-red-300 bg-red-100 p-3 text-red-700">
          Please fix the errors before saving
        </div>
      )}

      <div>
        <label htmlFor="title" className="mb-2 block font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(e) =>
            setLocalPost({ ...localPost, title: e.target.value })
          }
          className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
        {errors.title && <p className="mt-1 text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="mb-2 block font-medium">
          Description
        </label>
        <RichTextEditor
          id="description"
          value={description}
          onChange={(value) =>
            setLocalPost({ ...localPost, description: value })
          }
        ></RichTextEditor>
        <p className="mt-1 text-sm text-gray-500">Max 200 characters</p>
        {errors.description && (
          <p className="mt-1 text-red-600">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="content" className="font-medium">
          Content (Markdown)
        </label>

        <RichTextEditor
          id="content"
          value={content}
          onChange={(value) => setLocalPost({ ...localPost, content: value })}
        ></RichTextEditor>

        {errors.content && (
          <p className="mt-1 text-red-600">{errors.content}</p>
        )}
      </div>

      {isCreate && (
        <div>
          <label htmlFor="category" className="mb-2 block font-medium">
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            value={category}
            onChange={(e) =>
              setLocalPost({ ...localPost, category: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
          {errors.category && (
            <p className="mt-1 text-red-600">{errors.category}</p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="tags" className="mb-2 block font-medium">
          Tags
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          value={tags}
          onChange={(e) => setLocalPost({ ...localPost, tags: e.target.value })}
          className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
        {errors.tags && <p className="mt-1 text-red-600">{errors.tags}</p>}
      </div>

      <ImageUploader
        imageUrl={imageUrl}
        onImageChange={(url) => setLocalPost({ ...localPost, imageUrl: url })}
        error={errors.imageUrl}
      />
      {success && (
        <div className="mb-2 flex items-center justify-between rounded border border-green-300 bg-green-100 p-3 text-green-800">
          <span>Post updated successfully</span>
          <button
            type="button"
            className="ml-4 font-bold text-green-700 hover:text-green-900"
            aria-label="Close"
            onClick={() => setSuccess(false)}
          >
            ×
          </button>
        </div>
      )}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          className="rounded-lg border border-gray-300 bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}
