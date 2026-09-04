"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  UploadCloud,
  X,
  Check,
  Link as LinkIcon,
  Cloud,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { uploadImage } from "@/lib/uploadClient";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  aspectRatio?: "square" | "video" | "banner";
  required?: boolean;
}

export default function ImageUploader({
  value,
  onChange,
  folder = "sir-ihsan/products",
  label = "Upload Image",
  aspectRatio = "square",
  required = false,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [mode, setMode] = useState<"file" | "url">("file");
  const [urlInput, setUrlInput] = useState(value || "");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    if (!file) return;

    // Check type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (PNG, JPG, WebP, AVIF).");
      return;
    }

    // Check size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size cannot exceed 10MB.");
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const response = await uploadImage(file, folder);
      onChange(response.url);
      setUrlInput(response.url);
    } catch (err: unknown) {
      console.error("Cloudinary upload failed:", err);
      const msg = err instanceof Error ? err.message : "Failed to upload image. Please try again.";
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUploadError(null);
    }
  };

  const clearImage = () => {
    onChange("");
    setUrlInput("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const aspectClass =
    aspectRatio === "video"
      ? "aspect-video"
      : aspectRatio === "banner"
      ? "aspect-[21/9]"
      : "aspect-square";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        {/* Tab switcher: Upload File vs Paste URL */}
        <div className="flex items-center bg-stone-100 p-0.5 rounded-lg text-[11px] font-semibold text-stone-600">
          <button
            type="button"
            onClick={() => setMode("file")}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
              mode === "file" ? "bg-white text-stone-900 shadow-xs" : "hover:text-stone-900"
            }`}
          >
            <Cloud className="w-3 h-3 text-amber-600" />
            Cloud Upload
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
              mode === "url" ? "bg-white text-stone-900 shadow-xs" : "hover:text-stone-900"
            }`}
          >
            <LinkIcon className="w-3 h-3 text-stone-500" />
            Image URL
          </button>
        </div>
      </div>

      {/* Preview Card If Value Exists */}
      {value ? (
        <div className="relative group rounded-xl border border-stone-200 bg-stone-50 overflow-hidden shadow-xs flex items-center justify-center">
          <div className={`relative w-full ${aspectClass} max-h-64`}>
            <Image
              src={value}
              alt="Uploaded Preview"
              fill
              className="object-cover"
              unoptimized
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white text-stone-900 text-xs font-semibold rounded-lg shadow-md hover:bg-stone-100 transition-colors flex items-center gap-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5 text-amber-600" />
                Replace Image
              </button>
              <button
                type="button"
                onClick={clearImage}
                className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          </div>

          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-400" />
            Asset Ready
          </div>
        </div>
      ) : (
        /* Empty State / Upload Area */
        <div>
          {mode === "file" ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                isDragOver
                  ? "border-amber-500 bg-amber-50/50"
                  : "border-stone-300 hover:border-amber-400 bg-stone-50/60 hover:bg-amber-50/20"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                className="hidden"
              />

              {isUploading ? (
                <div className="py-4 flex flex-col items-center gap-2 text-amber-700">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
                  <p className="text-xs font-semibold">Uploading to Cloudinary...</p>
                  <p className="text-[11px] text-stone-400">Optimizing luxury resolution & CDN</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-amber-100/70 text-amber-700 flex items-center justify-center">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-800">
                      Click to upload or drag and drop image
                    </p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      PNG, JPG, WebP up to 10MB • Auto-optimized via Cloudinary
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Direct URL input */
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/... or Cloudinary URL"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleUrlSubmit}
                  className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 shrink-0"
                >
                  Apply URL
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Alert */}
      {uploadError && (
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
