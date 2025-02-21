/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { X } from "lucide-react";

interface ImagePreview {
  id: string;
  file: File;
}

interface ImageUploadProps {
  value: string[];
  handleChange: (value: string) => void;
  handleRemove: (value: string) => void;
}

const MultiImageUpload = ({
  value = [],
  handleChange,
  handleRemove,
}: ImageUploadProps) => {
  const [images, setImages] = useState<ImagePreview[]>([]);

  useEffect(() => {
    const existingImages = value.map((url) => ({
      id: url,
      file: new File([], url),
    }));
    setImages(existingImages);
  }, [value]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validImages = files.filter((file) => file.type.startsWith("image/"));

    const imagePreviews = validImages.map((file) => {
      const url = URL.createObjectURL(file);
      handleChange(url);
      return { id: url, file };
    });

    setImages((prevImages) => [...prevImages, ...imagePreviews]);
  };

  const removeImage = (id: string) => {
    setImages((prevImages) => prevImages.filter((img) => img.id !== id));
    handleRemove(id);
    URL.revokeObjectURL(id);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="images" className="text-fourth font-bold text-base ml-6">
        Hình ảnh
      </Label>
      <Input
        className="py-3 px-4 rounded-md file:bg-seventh border h-[50px]"
        id="images"
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
      />

      <div className="flex flex-wrap gap-4 mt-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative w-36 h-36 border rounded-md overflow-hidden"
          >
            <img
              src={img.id}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => removeImage(img.id)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              type="button"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiImageUpload;
