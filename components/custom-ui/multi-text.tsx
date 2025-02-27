"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { X } from "lucide-react";

interface MultiTextProps {
  placeholder: string;
  value: string[] | undefined;
  handleChange: (value: string) => void;
  handleRemove: (value: string) => void;
}

const MultiText: React.FC<MultiTextProps> = ({
  placeholder,
  value = [],
  handleChange,
  handleRemove,
}) => {
  const [inputValue, setInputValue] = useState("");

  const addValue = () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue || value.includes(trimmedValue)) return;
    handleChange(trimmedValue);
    setInputValue("");
  };

  return (
    <div className="flex flex-col">
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addValue();
          }
        }}
        className="py-6 px-4 rounded-md file:bg-seventh"
      />
      <div className="flex flex-col gap-2 mt-2">
        {value.map((item, index) => (
          <p
            key={index}
            className="bg-primary flex items-center justify-between text-white py-2 px-4 rounded-md hover:bg-secondary"
          >
            <span>{item}</span>
            <button
              type="button"
              className="outline-none"
              onClick={() => handleRemove(item)}
            >
              <X size={20} className="hover:text-red-600" />
            </button>
          </p>
        ))}
      </div>
    </div>
  );
};

export default MultiText;
