// ImageUploader.tsx
import { useState } from "react";

type ImageUploaderProps = {
  imageUrl: string;
  onImageChange: (url: string) => void;
  error?: string;
};

export default function ImageUploader({ imageUrl, onImageChange, error }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);

    // Example using Cloudinary's unsigned upload
    try {
      const cloudName = "dbbigkyhe"; // Replace with your Cloudinary cloud name
      const unsignedUploadPreset = "blog-asst2"; // Replace with your upload preset

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", unsignedUploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        onImageChange(data.secure_url);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div>
        <label htmlFor="imageUrl" className="mb-2 block font-medium">
          Image Url
        </label>

        <div className="flex w-full gap-2">
          <input
            id="imageUrl"
            name="imageUrl"
            type="text"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => onImageChange(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 bg-white p-2 text-gray-900 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-900 h-10"
          />
          <button
            type="button"
            onClick={() => document.getElementById("imageUpload")?.click()}
            className="rounded-lg border border-gray-300 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 h-10 whitespace-nowrap text-sm"
            disabled={isUploading}
            style={{ minWidth: "120px" }}
          >
            {isUploading ? "Uploading..." : "Upload image"}
          </button>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
        </div>

        {error && <p className="mt-1 text-red-600">{error}</p>}
      </div>

      {imageUrl && (
        <div className="mt-4">
          <p className="mb-2 text-sm text-gray-500">Image Display:</p>
          <img
            src={imageUrl}
            alt="Preview"
            data-test-id="image-preview"
            className="object-contain w-full rounded-lg border border-gray-300"
          />
        </div>
      )}
    </>
  );
}