"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, Heart, Users, Ruler, Bed } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card-content";
import Loader from "@/components/loader/Loader";
import Pagination from "@/components/pagination/pagination";

interface Workspace {
  id: string;
  title: string;
  address: string;
  price: string;
  image: string;
  roomCapacity: number;
  roomType: string;
  roomSize: number;
}

export default function PropertyGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "Tất cả"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("https://67271c49302d03037e6f6a3b.mockapi.io/spaceList")
      .then((response) => response.json())
      .then((data: Workspace[]) => {
        setWorkspaces(data);
        setLoading(false);

        const uniqueCategories = Array.from(
          new Set(data.map((workspace: Workspace) => workspace.roomType))
        );
        setCategories(["Tất cả", ...uniqueCategories]);
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

  const filteredWorkspaces =
    selectedCategory && selectedCategory !== "Tất cả"
      ? workspaces.filter(
          (workspace) => workspace.roomType === selectedCategory
        )
      : workspaces;

  const totalPages = Math.ceil(filteredWorkspaces.length / 9);

  const paginatedWorkspaces = filteredWorkspaces.slice(
    (currentPage - 1) * 9,
    currentPage * 9
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between">
        <div className="flex space-x-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`text-lg font-medium ${
                selectedCategory === category
                  ? "border-b-2 border-black"
                  : "text-gray-500"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <button className="flex items-center space-x-2 px-4 py-2 border rounded-full">
          <Filter size={18} />
          <span>Bộ lọc</span>
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {paginatedWorkspaces.map((workspace, index) => (
          <Card
            key={index}
            className="relative overflow-hidden rounded-lg shadow-md transition-transform transform hover:scale-105 cursor-pointer"
            onClick={() => router.push(`/workspace/${workspace.id}`)}
          >
            <div className="relative">
              <img
                src={workspace.image}
                alt={workspace.title}
                className="w-full h-48 object-cover"
              />

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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
