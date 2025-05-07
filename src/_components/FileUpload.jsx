import { useState, useRef } from "react";
import Image from "next/image";

const FileUpload = ({ onFilesSelected }) => {
  const [selectedFiles, setSelectedFiles] = useState([]); // Array of file objects
  const [previews, setPreviews] = useState([]); // Array of preview URLs
  const inputRef = useRef(null);

  const handleFileChange = (incomingFiles) => {
    const newFiles = Array.from(incomingFiles).filter((file) =>
      file.type.startsWith("image/")
    );

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);

    onFilesSelected([...selectedFiles, ...newFiles]); // Update parent
  };

  const handleRemove = (indexToRemove) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== indexToRemove);
    const updatedPreviews = previews.filter((_, i) => i !== indexToRemove);

    // Clean up object URL to prevent memory leaks
    URL.revokeObjectURL(previews[indexToRemove]);

    setSelectedFiles(updatedFiles);
    setPreviews(updatedPreviews);

    onFilesSelected(updatedFiles); // Update parent
  };

  return (
    <div>
      <div
        className="border-dashed border-2 border-gray-400 p-6 rounded-md text-center cursor-pointer"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileChange(e.dataTransfer.files);
        }}
      >
        <p className="text-gray-600">
          Drag and drop images here, or click to select
        </p>
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
          {previews.map((src, idx) => (
            <div key={idx} className="relative group">
              <Image
                src={src}
                alt="preview"
                width={120}
                height={120}
                className="rounded"
              />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-0 right-0 bg-black bg-opacity-60 text-white rounded-full px-2 py-0.5 text-sm hover:bg-opacity-80"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
