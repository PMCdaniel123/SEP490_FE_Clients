/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, Users, Ruler, Clock, Calendar, X } from "lucide-react";
import { CardContent } from "@/components/ui/card-content";
import Loader from "@/components/loader/Loader";
import Pagination from "@/components/pagination/pagination";
import { Badge } from "@/components/ui/badge";
import { Slider, ConfigProvider, Select } from "antd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/constants/environments";
import ShinyCard from "@/components/animate-ui/shiny-card";

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
  status: string;
  createdAt: string; // Added for sorting by newest
}

export default function PropertyGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "Tất cả"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [filteredWorkspaces, setFilteredWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const router = useRouter();

  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [areaRange, setAreaRange] = useState<[number, number]>([0, 500]);
  const [capacityRange, setCapacityRange] = useState<[number, number]>([
    0, 100,
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<string>("newest");

  useEffect(() => {
    fetch(`${BASE_URL}/workspaces`)
      .then((response) => response.json())
      .then((data: { workspaces: Workspace[] }) => {
        const activeWorkspaces = data.workspaces.filter(
          (workspace) => workspace.status === "Active"
        );

        const formattedWorkspaces = activeWorkspaces.map((workspace) => ({
          ...workspace,
          shortTermPrice:
            workspace.prices.find((price) => price.category === "Giờ")?.price ||
            0,
          longTermPrice:
            workspace.prices.find((price) => price.category === "Ngày")
              ?.price || 0,
        }));
        setWorkspaces(formattedWorkspaces);
        setFilteredWorkspaces(formattedWorkspaces);
        setLoading(false);

        const uniqueCategories = Array.from(
          new Set(
            activeWorkspaces.map((workspace: Workspace) => workspace.category)
          )
        );
        setCategories(["Tất cả", ...uniqueCategories]);

        const maxPrice = Math.max(
          ...formattedWorkspaces.map((w) =>
            Math.max(w.shortTermPrice || 0, w.longTermPrice || 0)
          )
        );
        const maxArea = Math.max(
          ...formattedWorkspaces.map((w) => w.area || 0)
        );
        const maxCapacity = Math.max(
          ...formattedWorkspaces.map((w) => w.capacity || 0)
        );

        setPriceRange([0, maxPrice > 0 ? maxPrice : 1000000]);
        setAreaRange([0, maxArea > 0 ? maxArea : 500]);
        setCapacityRange([0, maxCapacity > 0 ? maxCapacity : 100]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  // Re-sort workspaces when sort option changes
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when sorting changes
  }, [sortOption]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const applyFilters = (
    query = searchQuery,
    category = selectedCategory,
    price = priceRange,
    area = areaRange,
    capacity = capacityRange
  ) => {
    let filtered = [...workspaces];

    if (query) {
      const searchTermLower = query.toLowerCase();
      filtered = filtered.filter(
        (workspace) =>
          workspace.name.toLowerCase().includes(searchTermLower) ||
          workspace.address.toLowerCase().includes(searchTermLower)
      );
    }

    if (category && category !== "Tất cả") {
      filtered = filtered.filter(
        (workspace) => workspace.category === category
      );
    }

    filtered = filtered.filter((workspace) => {
      const workspacePrice = Math.max(
        workspace.shortTermPrice || 0,
        workspace.longTermPrice || 0
      );
      return workspacePrice >= price[0] && workspacePrice <= price[1];
    });

    filtered = filtered.filter(
      (workspace) => workspace.area >= area[0] && workspace.area <= area[1]
    );

    filtered = filtered.filter(
      (workspace) =>
        workspace.capacity >= capacity[0] && workspace.capacity <= capacity[1]
    );

    setFilteredWorkspaces(filtered);
    setCurrentPage(1);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Tất cả");

    const maxPrice = Math.max(
      ...workspaces.map((w) =>
        Math.max(w.shortTermPrice || 0, w.longTermPrice || 0)
      )
    );
    const maxArea = Math.max(...workspaces.map((w) => w.area || 0));
    const maxCapacity = Math.max(...workspaces.map((w) => w.capacity || 0));

    setPriceRange([0, maxPrice > 0 ? maxPrice : 1000000]);
    setAreaRange([0, maxArea > 0 ? maxArea : 500]);
    setCapacityRange([0, maxCapacity > 0 ? maxCapacity : 100]);

    setFilteredWorkspaces(workspaces);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    applyFilters(searchQuery, category, priceRange, areaRange, capacityRange);
  };

  // Sort workspaces based on selected sort option
  const sortWorkspaces = (workspaces: Workspace[]) => {
    const sortedWorkspaces = [...workspaces];

    switch (sortOption) {
      case "newest":
        return sortedWorkspaces.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "price-asc":
        return sortedWorkspaces.sort((a, b) => {
          const priceA = Math.min(
            a.shortTermPrice || Infinity,
            a.longTermPrice || Infinity
          );
          const priceB = Math.min(
            b.shortTermPrice || Infinity,
            b.longTermPrice || Infinity
          );
          return priceA - priceB;
        });
      case "price-desc":
        return sortedWorkspaces.sort((a, b) => {
          const priceA = Math.min(a.shortTermPrice || 0, a.longTermPrice || 0);
          const priceB = Math.min(b.shortTermPrice || 0, b.longTermPrice || 0);
          return priceB - priceA;
        });
      case "area-asc":
        return sortedWorkspaces.sort((a, b) => a.area - b.area);
      case "area-desc":
        return sortedWorkspaces.sort((a, b) => b.area - a.area);
      default:
        return sortedWorkspaces;
    }
  };

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

  const totalPages = Math.ceil(filteredWorkspaces.length / 9);

  const paginatedWorkspaces = sortWorkspaces(filteredWorkspaces).slice(
    (currentPage - 1) * 9,
    currentPage * 9
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-6 md:gap-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`text-sm sm:text-base font-medium transition-all duration-200 hover:text-primary hover:border-b-2 hover:border-primary py-2 ${
                selectedCategory === category
                  ? "border-b-2 border-primary text-primary font-semibold"
                  : "text-gray-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#835101",
              },
            }}
          >
            <Select
              defaultValue="newest"
              style={{ width: 180 }}
              onChange={(value) => setSortOption(value)}
              options={[
                { value: "newest", label: "Mới nhất" },
                { value: "price-asc", label: "Giá tăng dần" },
                { value: "price-desc", label: "Giá giảm dần" },
                { value: "area-asc", label: "Diện tích tăng dần" },
                { value: "area-desc", label: "Diện tích giảm dần" },
              ]}
            />
          </ConfigProvider>

          <button
            className="flex items-center space-x-2 px-4 py-2 border rounded-full text-sm sm:text-base hover:bg-primary hover:text-white transition-all duration-200"
            onClick={toggleFilters}
          >
            <Filter size={18} />
            <span>Bộ lọc</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Bộ lọc tìm kiếm</h2>
            <button
              onClick={toggleFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tìm kiếm theo tên hoặc địa chỉ
                </label>
                <Input
                  type="text"
                  placeholder="Nhập từ khóa tìm kiếm..."
                  className="w-full"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <p className="font-medium mb-2">Khoảng giá (VND):</p>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#835101",
                    },
                  }}
                >
                  <Slider
                    range
                    min={0}
                    max={Math.max(
                      ...workspaces.map((w) =>
                        Math.max(w.shortTermPrice || 0, w.longTermPrice || 0)
                      )
                    )}
                    step={50000}
                    value={priceRange}
                    onChange={(value) =>
                      setPriceRange(value as [number, number])
                    }
                  />
                </ConfigProvider>
                <div className="flex justify-between text-sm">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-4">
                <p className="font-medium mb-2">Diện tích (m²):</p>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#835101",
                    },
                  }}
                >
                  <Slider
                    range
                    min={0}
                    max={Math.max(...workspaces.map((w) => w.area || 0))}
                    value={areaRange}
                    onChange={(value) =>
                      setAreaRange(value as [number, number])
                    }
                  />
                </ConfigProvider>
                <div className="flex justify-between text-sm">
                  <span>{areaRange[0]} m²</span>
                  <span>{areaRange[1]} m²</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="font-medium mb-2">Sức chứa (người):</p>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#835101",
                    },
                  }}
                >
                  <Slider
                    range
                    min={0}
                    max={Math.max(...workspaces.map((w) => w.capacity || 0))}
                    value={capacityRange}
                    onChange={(value) =>
                      setCapacityRange(value as [number, number])
                    }
                  />
                </ConfigProvider>
                <div className="flex justify-between text-sm">
                  <span>{capacityRange[0]} người</span>
                  <span>{capacityRange[1]} người</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => applyFilters()}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Áp dụng bộ lọc
            </Button>
            <Button onClick={resetFilters} variant="outline">
              Đặt lại
            </Button>
          </div>
        </div>
      )}

      <div className="mt-10">
        <p className="text-gray-500 mb-4">
          {filteredWorkspaces.length} kết quả được tìm thấy
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {paginatedWorkspaces.map((workspace) => (
            <ShinyCard
              key={workspace.id}
              className="transition-transform transform md:hover:scale-105 cursor-pointer"
            >
              <div
                className="relative overflow-hidden rounded-lg shadow-md"
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

                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex flex-col gap-1">
                      {workspace.shortTermPrice > 0 && (
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-gray-700 text-sm">
                            <Clock className="mr-1 text-orange-500" size={16} />
                            <span>Theo giờ</span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {formatPrice(workspace.shortTermPrice)}
                          </span>
                        </div>
                      )}

                      {workspace.longTermPrice > 0 && (
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-gray-700 text-sm">
                            <Calendar
                              className="mr-1 text-purple-500"
                              size={16}
                            />
                            <span>Theo ngày</span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {formatPrice(workspace.longTermPrice)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </div>
            </ShinyCard>
          ))}
        </div>
      </div>

      {filteredWorkspaces.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
