/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, Users, Ruler, Clock, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card-content";
import Loader from "@/components/loader/Loader";
import Pagination from "@/components/pagination/pagination";
import { Badge } from "@/components/ui/badge";

interface Workspace {
  id: string;
  name: string;
  address: string;
  shortTermPrice: number;
  longTermPrice: number;
  images: { imgUrl: string }[];
  prices: { category: string; price: number }[];
  capacity: number;
  category: string;
  area: number;
}

export default function PropertyGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("https://localhost:5050/workspaces")
      .then((response) => response.json())
      .then((data: { workspaces: Workspace[] }) => {
        const formattedWorkspaces = data.workspaces.map((workspace) => ({
          ...workspace,
          shortTermPrice:
            workspace.prices.find((price) => price.category === "Giờ")?.price || 0,
          longTermPrice:
            workspace.prices.find((price) => price.category === "Ngày")?.price || 0,
        }));
        setWorkspaces(formattedWorkspaces);
        setLoading(false);

        const uniqueCategories = Array.from(
          new Set(data.workspaces.map((workspace: Workspace) => workspace.category))
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

  if (workspaces.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <img src="/404.png" alt="No data" className="w-96 mx-auto mt-6" />
        <p className="text-gray-600 text-lg">Không có dữ liệu để hiển thị.</p>
      </div>
    );
  }

  const filteredWorkspaces =
    selectedCategory && selectedCategory !== "Tất cả"
      ? workspaces.filter((workspace) => workspace.category === selectedCategory)
      : workspaces;

  const totalPages = Math.ceil(filteredWorkspaces.length / 9);

  const paginatedWorkspaces = filteredWorkspaces.slice(
    (currentPage - 1) * 9,
    currentPage * 9
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`text-sm sm:text-lg font-medium ${
                selectedCategory === category
                  ? "border-b-2 border-black"
                  : "text-gray-500"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <button className="flex items-center space-x-2 px-4 py-2 border rounded-full text-sm sm:text-base">
          <Filter size={18} />
          <span>Bộ lọc</span>
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {paginatedWorkspaces.map((workspace) => (
          <Card
            key={workspace.id}
            className="relative overflow-hidden rounded-lg shadow-md transition-transform transform hover:scale-105 cursor-pointer"
            onClick={() => router.push(`/workspace/${workspace.id}`)}
          >
            <div className="relative group">
              <div className="overflow-hidden h-56">
                <img
                  src={workspace.images[0]?.imgUrl || "/placeholder.png"}
                  alt={workspace.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* <div className="absolute top-3 left-3">
                <Heart className="text-gray-500 bg-white p-2 rounded-full shadow-md" size={20} />
              </div> */}

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <div className="flex justify-between items-end">
                  <Badge className="bg-primary hover:bg-secondary text-white">
                    {workspace.category}
                  </Badge>
                </div>
              </div>
            </div>

            <CardContent className="p-5">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 line-clamp-1">
                {workspace.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3 flex items-center">
                <span className="truncate">{workspace.address}</span>
              </p>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex items-center text-gray-700 text-sm">
                  <Users className="mr-1 text-blue-500" size={16} />
                  <span>{workspace.capacity} người</span>
                </div>
                <div className="flex items-center text-gray-700 text-sm justify-end">
                  <Ruler className="mr-1 text-green-500" size={16} />
                  <span>{workspace.area} m²</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <div className="flex flex-col gap-1">
                  {workspace.shortTermPrice > 0 && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-700 text-sm">
                        <Clock className="mr-1 text-orange-500" size={16} />
                        <span>Theo giờ</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(workspace.shortTermPrice)}
                      </span>
                    </div>
                  )}

                  {workspace.longTermPrice > 0 && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-700 text-sm">
                        <Calendar className="mr-1 text-purple-500" size={16} />
                        <span>Theo ngày</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(workspace.longTermPrice)}
                      </span>
                    </div>
                  )}
                </div>
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