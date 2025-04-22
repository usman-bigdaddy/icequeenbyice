"use client";

import { IKImage, ImageKitProvider, IKUpload, IKVideo } from "imagekitio-next";
import config from "@/lib/config";
import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

const {
  env: { apiEndpoint, imagekit },
} = config;

const { publicKey, urlEndpoint } = imagekit;

const authenticator = async () => {
  try {
    const response = await fetch(`${apiEndpoint}/api/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();

    if (!data.signature || !data.token || !data.expire) {
      throw new Error("Missing required authentication parameters.");
    }

    return {
      token: data.token,
      expire: data.expire,
      signature: data.signature,
    };
  } catch (error) {
    toast.error(`Authentication request failed: ${error.message}`);
    return null;
  }
};

const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  onFileChange,
  value,
}) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState({ filePath: value ?? null });
  const [progress, setProgress] = useState(0);

  const styles = {
    button: "bg-light-600 border-gray-100 border",
    placeholder: "text-slate-500",
    text: "text-dark-400",
  };

  const onError = (error) => {
    toast.error(`${type} upload failed: ${error.message}`);
  };

  const onSuccess = (res) => {
    toast.success(`Image uploaded successfully`);
    setFile(res);
    
    // Create the full image URL by combining the urlEndpoint and filePath
    const fullImageUrl = `${urlEndpoint}${res.filePath}`;
    onFileChange(fullImageUrl);  // Pass the full URL to the parent component
  };

  const onValidate = (file) => {
    if (type === "image" && file.size > 20 * 1024 * 1024) {
      toast.warn(
        "File size too large: Please upload a file that is less than 20MB."
      );
      return false;
    }
    if (type === "video" && file.size > 50 * 1024 * 1024) {
      toast.warn(
        "File size too large: Please upload a file that is less than 50MB."
      );
      return false;
    }
    return true;
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}  // Pass urlEndpoint to ImageKitProvider
      authenticator={authenticator}
    >
      <IKUpload
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        validateFile={onValidate}
        onUploadStart={() => setProgress(0)}
        onUploadProgress={({ loaded, total }) => {
          const percent = Math.round((loaded / total) * 100);
          setProgress(percent);
        }}
        folder={folder}
        accept={accept}
        className="hidden"
      />

      <button
        className={cn("upload-btn", styles.button)}
        onClick={(e) => {
          e.preventDefault();
          if (!ikUploadRef.current) {
            toast.error("Upload input not initialized!");
            return;
          }
          ikUploadRef.current.click();
        }}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />
        <p className={cn("text-base", styles.placeholder)}>{placeholder}</p>
        {file.filePath && (
          <p className={cn("upload-filename", styles.text)}>{file.filePath}</p>
        )}
      </button>

      {progress > 0 && progress !== 100 && (
        <div className="w-full rounded-full bg-green-200">
          <div className="progress" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}

      {file.filePath &&
        (type === "image" ? (
          <IKImage
            alt={file.filePath}
            path={file.filePath}
            width={500}
            height={300}
          />
        ) : type === "video" ? (
          <IKVideo
            path={file.filePath}
            controls={true}
            className="h-96 w-full rounded-xl"
          />
        ) : null)}
    </ImageKitProvider>
  );
};

export default FileUpload;
