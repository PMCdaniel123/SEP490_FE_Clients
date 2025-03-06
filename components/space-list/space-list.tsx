"use client";

import { useEffect, useState } from "react";
import { Heart, Users, Ruler, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "../ui/card";
import { CardContent } from "../ui/card-content";
import Loader from "../loader/Loader";

interface Workspace {
  id: string;
  name: string;
  address: string;
  shortTermPrice: number;
  longTermPrice: number;
  images: { imgUrl: string }[];
  capacity: number;
  area: number;
  category: string;
  prices: { category: string; price: number }[];
}

export default function SpaceList() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://localhost:5050/workspaces")
      .then((response) => response.json())
      .then((data: { workspaces: Workspace[] }) => {
        const formattedWorkspaces = data.workspaces.map((workspace) => ({
          ...workspace,
          shortTermPrice: workspace.prices.find(
            (price) => price.category === "Giờ"
          )?.price || 0,
          longTermPrice: workspace.prices.find(
            (price) => price.category === "Ngày"
          )?.price || 0,
        }));
        setWorkspaces(formattedWorkspaces);
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

  if (workspaces.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center">
        <p className="text-gray-600 text-lg">Không có dữ liệu để hiển thị.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {workspaces.slice(0, 6).map((workspace, index) => (
          <Card
            key={index}
            className="relative overflow-hidden rounded-lg shadow-md"
          >
            <div className="relative">
              <img
                src={workspace.images[0].imgUrl}
                alt={workspace.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-md text-sm">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(workspace.shortTermPrice)}{" "}
                -{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(workspace.longTermPrice)}
              </div>
            </div>
            <CardContent className="p-4">
              <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow">
                <Heart className="text-gray-500" size={20} />
              </div>
              <h3 className="text-lg font-semibold mt-2">{workspace.name}</h3>
              <p className="text-gray-600 text-sm">{workspace.address}</p>
              <div className="flex items-center text-gray-600 text-sm mt-2">
                <span className="flex items-center mr-2">
                  <Users className="mr-1" size={16} /> {workspace.capacity}
                </span>
                <span className="flex items-center mr-2">
                  <Ruler className="mr-1" size={16} /> {workspace.area}
                </span>
                <span className="flex items-center">
                  <Bed className="mr-1" size={16} /> {workspace.category}
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