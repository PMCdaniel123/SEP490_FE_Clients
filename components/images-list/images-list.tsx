"use client";

import { useState } from "react";

interface Workspace {
  id: string;
  title: string;
  address: string;
  price: string;
  image: string;
  roomCapacity: number;
  roomType: string;
  roomSize: number;
  description: string;
}

function ImageList({ workspace }: { workspace: Workspace }) {
  const [mainImage, setMainImage] = useState("/banner.png");
  const thumbnails = [
    "/banner.png",
    workspace.image,
    ...Array(5).fill(workspace.image),
  ];

  return (
    <div className="w-full">
      <div className="relative w-full h-96">
        <img
          src={mainImage}
          alt={workspace.title}
          className="w-full h-full object-cover rounded-lg transition-transform duration-300"
        />
      </div>
      <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
        {thumbnails.map((img, i) => (
          <div
            key={i}
            className={`relative w-80 h-48 flex-shrink-0 cursor-pointer ${
              mainImage === img ? "border-4 border-primary rounded-lg" : ""
            }`}
            onClick={() => setMainImage(img)}
          >
            <img
              src={img}
              alt={`Coworking Space ${i + 1}`}
              className="w-full h-full object-cover rounded-lg hover:opacity-80 transition-opacity"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageList;
