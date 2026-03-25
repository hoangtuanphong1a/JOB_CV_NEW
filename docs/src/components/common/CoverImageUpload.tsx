// components/common/CoverImageUpload.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CoverImageUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

const acceptedTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const CoverImageUpload = React.forwardRef<
  HTMLInputElement,
  CoverImageUploadProps
>(({ value, onChange, disabled = false }, ref) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Tạo preview khi value thay đổi
  useEffect(() => {
    if (value) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);

      // Cleanup cũ nếu có
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [value]);

  const validateAndSetFile = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!acceptedTypes.includes(file.type)) {
      setError("Chỉ hỗ trợ định dạng: JPG, PNG, WebP, GIF");
      return false;
    }

    if (file.size > maxSize) {
      setError("Kích thước ảnh không được vượt quá 5MB");
      return false;
    }

    setError(null);
    onChange(file);
    return true;
  };

  const handleFile = (file: File) => {
    validateAndSetFile(file);
  };

  const removeFile = () => {
    onChange(null);
    setError(null);
    // preview sẽ tự cleanup nhờ useEffect
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-6">
      {/* Dropzone + Input */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${
            dragActive ? "border-purple-500 bg-purple-50/70" : "border-gray-300"
          }
          ${value ? "border-green-500 bg-green-50/30" : ""}
          ${error ? "border-red-500 bg-red-50/30" : ""}
          ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
        `}
        onDragEnter={(e) => {
          e.preventDefault();
          if (!disabled) setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          if (!disabled) setDragActive(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          ref={ref}
          type="file"
          accept={acceptedTypes.join(",")}
          disabled={disabled}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        {value ? (
          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
            <div>
              <p className="font-semibold text-gray-800">{value.name}</p>
              <p className="text-sm text-gray-600">
                {(value.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={removeFile}
              disabled={disabled}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-1" />
              Xóa ảnh bìa
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-16 h-16 mx-auto text-purple-600" />
            <div>
              <p className="text-lg font-medium text-purple-700">
                Kéo & thả ảnh vào đây
              </p>
              <p className="text-sm text-gray-600 mt-1">
                hoặc click để chọn từ máy tính
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Hỗ trợ: JPG, PNG, WebP, GIF (tối đa 5MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Preview ảnh */}
      {preview && (
        <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-purple-200">
          <img
            src={preview}
            alt="Preview ảnh bìa"
            className="w-full h-80 object-cover"
          />
          <button
            onClick={removeFile}
            disabled={disabled}
            className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Thông báo lỗi */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
});

CoverImageUpload.displayName = "CoverImageUpload";
