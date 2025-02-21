/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { X } from "lucide-react";

interface ImageUploadProps {
  value: string;
  handleChange: (value: string) => void;
  handleRemove: () => void;
}

const ImageUpload = ({
  value,
  handleChange,
  handleRemove,
}: ImageUploadProps) => {
  const [image, setImage] = useState<string>("");

  useEffect(() => {
    setImage(value);
  }, [value]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      handleChange(url);
      setImage(url);
    }
  };

  const removeImage = () => {
    handleRemove();
    URL.revokeObjectURL(image);
    setImage("");
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="image" className="text-fourth font-bold text-base ml-6">
        Hình ảnh
      </Label>
      <Input
        className="py-3 px-4 rounded-md file:bg-seventh border h-[50px]"
        id="image"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />

      {image && (
        <div className="relative w-36 h-36 border rounded-md overflow-hidden mt-2">
          <img
            src={image}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            onClick={removeImage}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
