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

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
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
            <button
              type="button"
              onClick={() => document.getElementById("imageUpload")?.click()}
              className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload image"}
            </button>
            <span className="text-sm text-gray-500">or</span>
          </div>

          <input
            id="imageUrl"
            name="imageUrl"
            type="text"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => onImageChange(e.target.value)}
            className="w-full rounded border p-2"
          />
        </div>

        {error && <p className="mt-1 text-red-600">{error}</p>}
      </div>

      {imageUrl && (
        <div className="mt-4 rounded border p-4">
          <p className="mb-2 text-sm text-gray-500">Image Display:</p>
          <img
            src={imageUrl}
            alt="Preview"
            data-test-id="image-preview"
            className="max-h-64 object-contain"
          />
        </div>
      )}
    </>
  );
}