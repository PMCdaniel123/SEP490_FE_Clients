"use client";

import { useEffect, useState } from "react";
import { Heart, Users, Ruler, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "../ui/card";
import { CardContent } from "../ui/card-content";
import Loader from "../loader/Loader";

interface Workspace {
  title: string;
  address: string;
  price: string;
  image: string;
  roomCapacity: number;
  roomType: string;
  roomSize: number;
}

export default function SpaceList() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://67271c49302d03037e6f6a3b.mockapi.io/spaceList")
      .then((response) => response.json())
      .then((data) => {
        setWorkspaces(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {workspaces.map((workspace, index) => (
          <Card
            key={index}
            className="relative overflow-hidden rounded-lg shadow-md"
          >
            <div className="relative">
              <img
                src={workspace.image}
                alt={workspace.title}
                className="w-full h-48 object-cover"
              />
              {/* Price overlay (inside the image) */}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-md text-sm">
                {workspace.price}
              </div>
            </div>
            <CardContent className="p-4">
              <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow">
                <Heart className="text-gray-500" size={20} />
              </div>
              <h3 className="text-lg font-semibold mt-2">{workspace.title}</h3>
              <p className="text-gray-600 text-sm">{workspace.address}</p>
              <div className="flex items-center text-gray-600 text-sm mt-2">
                <span className="flex items-center mr-2">
                  <Users className="mr-1" size={16} /> {workspace.roomCapacity}
                </span>
                <span className="flex items-center mr-2">
                  <Ruler className="mr-1" size={16} /> {workspace.roomSize}
                </span>
                <span className="flex items-center">
                  <Bed className="mr-1" size={16} /> {workspace.roomType}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <Button className="px-6 py-2 bg-black text-white rounded">
          Xem tất cả
        </Button>
      </div>
    </div>
  );
}
