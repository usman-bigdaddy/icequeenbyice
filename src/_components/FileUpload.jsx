"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import config from "@/lib/config";

const {
  env: { apiEndpoint, imagekit },
} = config;

const { urlEndpoint } = imagekit;

const FileUpload = ({ folder = "uploads", onUploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFileChange = (incomingFiles) => {
    const newFiles = Array.from(incomingFiles);
    const validImages = newFiles.filter((file) => file.type.startsWith("image/"));

    setFiles((prev) => [...prev, ...validImages]);
    setPreviews((prev) => [
      ...prev,
      ...validImages.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files);
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = [...files];
    const updatedPreviews = [...previews];
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
  };

  const uploadToImageKit = async (file) => {
    try {
      const authRes = await fetch(`${apiEndpoint}/api/imagekit`);
      const authData = await authRes.json();

      if (!authData.signature || !authData.token || !authData.expire) {
        throw new Error("Missing ImageKit auth data");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("useUniqueFileName", "true");
      formData.append("folder", folder);
      formData.append("publicKey", imagekit.publicKey);
      formData.append("signature", authData.signature);
      formData.append("expire", authData.expire);
      formData.append("token", authData.token);

      const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      return data.url;
    } catch (error) {
      toast.error(error.message || "Image upload failed");
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!files.length) {
      toast.warn("No images selected to upload.");
      return;
    }

    setUploading(true);
    const uploadedUrls = [];

    for (const file of files) {
      const url = await uploadToImageKit(file);
      if (url) uploadedUrls.push(url);
    }

    setUploading(false);

    if (uploadedUrls.length) {
      toast.success("All images uploaded!");
      onUploadComplete?.(uploadedUrls);
      setFiles([]);
      setPreviews([]);
    }
  };

  return (
    <div>
      <div
        className="border-dashed border-2 border-gray-400 p-6 rounded-md text-center cursor-pointer"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <p className="text-gray-600">Drag and drop images here, or click to select</p>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={inputRef}
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
        />
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {previews.map((src, index) => (
            <div key={index} className="relative group">
              <Image
                src={src}
                alt={`preview-${index}`}
                width={120}
                height={120}
                className="object-cover rounded border"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 text-xs opacity-75 group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!files.length || uploading}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Submit Images"}
      </button>
    </div>
  );
};

export default FileUpload;
