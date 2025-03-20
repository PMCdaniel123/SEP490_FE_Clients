/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Ruler,
  Briefcase,
  MousePointerClick,
  FilterIcon,
  Search,
} from "lucide-react";
import Loader from "@/components/loader/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider, Checkbox, ConfigProvider } from "antd";

const SearchPage = ({ params }: { params: Promise<{ query?: string }> }) => {
  const router = useRouter();

  const [selectedResult, setSelectedResult] = useState<number | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Bộ lọc
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [areaRange, setAreaRange] = useState<[number, number]>([0, 500]);
  const [showFilters, setShowFilters] = useState(false);
  const [facilityOptions, setFacilityOptions] = useState<string[]>([]);

  // State cho tìm kiếm theo tên
  const [searchQuery, setSearchQuery] = useState<string>("");

  interface SearchResult {
    id: number;
    name: string;
    address: string;
    googleMapUrl: string;
    description: string;
    capacity: number;
    category: string;
    area: number;
    is24h: number;
    shortTermPrice: number | null;
    longTermPrice: number | null;
    images: string[];
    facilities: string[];
    policies: string[];
  }

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const resolvedParams = await params;
        const unwrappedQuery = resolvedParams.query
          ? decodeURIComponent(resolvedParams.query)
          : "";

        const endpoint = unwrappedQuery
          ? `https://localhost:5050/users/searchbyfourcriteria?${unwrappedQuery}`
          : `https://localhost:5050/users/searchbyfourcriteria`;

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("Failed to fetch search results.");
        }
        const data = await response.json();

        interface Price {
          category: string;
          price: number;
        }

        const mappedResults = data.workspaces.map(
          (workspace: {
            id: number;
            name: string;
            address: string;
            googleMapUrl: string;
            description: string;
            capacity: number;
            category: string;
            area: number;
            is24h: number;
            prices: { category: string; price: number }[];
            images: { imgUrl: string }[];
            facilities: { facilityName: string }[];
            policies: { policyName: string }[];
          }) => ({
            id: workspace.id,
            name: workspace.name,
            address: workspace.address,
            googleMapUrl: workspace.googleMapUrl,
            description: workspace.description,
            capacity: workspace.capacity,
            category: workspace.category,
            area: workspace.area,
            is24h: workspace.is24h,
            shortTermPrice:
              workspace.prices.find((price: Price) => price.category === "Giờ")
                ?.price || null,
            longTermPrice:
              workspace.prices.find((price: Price) => price.category === "Ngày")
                ?.price || null,
            images: workspace.images.map(
              (image: { imgUrl: string }) => image.imgUrl
            ),
            facilities: workspace.facilities.map(
              (facility: { facilityName: string }) => facility.facilityName
            ),
            policies: workspace.policies.map(
              (policy: { policyName: string }) => policy.policyName
            ),
          })
        );

        setResults(mappedResults);
        setFilteredResults(mappedResults);

        const uniqueFacilities = Array.from(
          new Set(
            data.workspaces.flatMap(
              (workspace: { facilities: { facilityName: string }[] }) =>
                workspace.facilities.map(
                  (facility: { facilityName: string }) => facility.facilityName
                )
            )
          )
        );
        setFacilityOptions(uniqueFacilities as string[]);

        if (mappedResults.length > 0) {
          setSelectedResult(mappedResults[0].id);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [params]);

  const formatPrice = (price: number | null) => {
    if (price === null) return "Liên hệ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleDoubleClick = (workspaceId: number) => {
    router.push(`/workspace/${workspaceId}`);
  };

  const handleClick = (workspaceId: number) => {
    setSelectedResult(workspaceId);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);

    if (!value.trim()) {
      applyFilters();
      return;
    }

    const searchTermLower = value.toLowerCase();
    const filtered = results.filter((workspace) => {
      const nameMatch =
        workspace.name.toLowerCase().includes(searchTermLower) ||
        workspace.address.toLowerCase().includes(searchTermLower);

      const workspacePrice =
        workspace.shortTermPrice || workspace.longTermPrice || 0;
      const priceMatch =
        workspacePrice >= priceRange[0] && workspacePrice <= priceRange[1];
      const areaMatch =
        workspace.area >= areaRange[0] && workspace.area <= areaRange[1];
      const facilitiesMatch =
        selectedFacilities.length === 0 ||
        selectedFacilities.every((facility) =>
          workspace.facilities.includes(facility)
        );

      return nameMatch && priceMatch && areaMatch && facilitiesMatch;
    });

    setFilteredResults(filtered);
  };

  const applyFilters = () => {
    const filtered = results.filter((workspace) => {
      const nameMatch = searchQuery
        ? workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          workspace.address.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const workspacePrice =
        workspace.shortTermPrice || workspace.longTermPrice || 0;
      const priceMatch =
        workspacePrice >= priceRange[0] && workspacePrice <= priceRange[1];
      const areaMatch =
        workspace.area >= areaRange[0] && workspace.area <= areaRange[1];
      const facilitiesMatch =
        selectedFacilities.length === 0 ||
        selectedFacilities.every((facility) =>
          workspace.facilities.includes(facility)
        );

      return nameMatch && priceMatch && areaMatch && facilitiesMatch;
    });

    setFilteredResults(filtered);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 1000000]);
    setSelectedFacilities([]);
    setAreaRange([0, 500]);
    setFilteredResults(results);
  };

  if (loading) {
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <div className="w-full md:w-2/4">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md mb-4">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên..."
              className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 pl-10"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>
          <Button
            className="ml-2 text-white px-4 py-2 rounded-md transition"
            onClick={toggleFilters}
          >
            <FilterIcon size={16} />
          </Button>
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-lg font-bold mb-4">Bộ lọc</h2>

            <div className="mb-4">
              <p className="font-medium">Giá (VND):</p>
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
                  max={1000000}
                  step={50000}
                  value={priceRange}
                  onChange={(value) => setPriceRange(value as [number, number])}
                />
              </ConfigProvider>
              <div className="flex justify-between">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="font-medium">Tiện ích:</p>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#835101",
                  },
                }}
              >
                <Checkbox.Group
                  options={facilityOptions}
                  value={selectedFacilities}
                  onChange={(checkedValues) =>
                    setSelectedFacilities(checkedValues as string[])
                  }
                />
              </ConfigProvider>
            </div>

            <div className="mb-4">
              <p className="font-medium">Diện tích (m²):</p>
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
                  max={500}
                  value={areaRange}
                  onChange={(value) => setAreaRange(value as [number, number])}
                />
              </ConfigProvider>
              <div className="flex justify-between">
                <span>{areaRange[0]} m²</span>
                <span>{areaRange[1]} m²</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={applyFilters} className="text-white">
                Áp dụng
              </Button>
              <Button onClick={resetFilters} variant="outline">
                Đặt lại
              </Button>
            </div>
          </div>
        )}

        <h1 className="text-2xl font-bold mb-4">Kết quả tìm kiếm</h1>
        <p className="text-gray-500 mb-4">
          {filteredResults.length} kết quả được tìm thấy
        </p>

        <div className="grid grid-cols-1 gap-6">
          {filteredResults.length > 0 ? (
            filteredResults.map((result) => (
              <div
                key={result.id}
                className={`bg-white p-4 rounded-lg shadow-md flex gap-4 cursor-pointer hover:shadow-lg transition relative group ${
                  selectedResult === result.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => handleClick(result.id)}
                onDoubleClick={() => handleDoubleClick(result.id)}
              >
                <img
                  src={result.images[0] || "no-image"}
                  alt={result.name}
                  className="w-1/3 h-40 object-cover rounded-lg"
                />
                <div className="flex flex-col justify-between w-2/3">
                  <h2 className="text-xl font-bold">{result.name}</h2>
                  <p className="text-gray-600 text-sm">{result.address}</p>
                  <div className="flex items-center gap-4 text-gray-500 text-sm mt-2">
                    <div className="flex items-center">
                      <Briefcase size={16} className="mr-1" /> {result.category}
                    </div>
                    <div className="flex items-center">
                      <Users size={16} className="mr-1" /> {result.capacity}{" "}
                      người
                    </div>
                    <div className="flex items-center">
                      <Ruler size={16} className="mr-1" /> {result.area} m²
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {result.facilities.slice(0, 3).map((facility, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                      >
                        {facility}
                      </span>
                    ))}
                    {result.facilities.length > 3 && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        +{result.facilities.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-end items-center mt-4">
                    <p className="text-lg font-bold">
                      {formatPrice(result.shortTermPrice)} -{" "}
                      {formatPrice(result.longTermPrice)}
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <MousePointerClick size={14} />
                  <span>Nhấn đúp để xem chi tiết</span>
                </div>
              </div>
            ))
          ) : (
            <p>Không tìm thấy kết quả nào</p>
          )}
        </div>
      </div>

      <div className="w-full md:w-2/4 bg-white p-4 rounded-lg shadow-md sticky top-6 h-fit">
        <h2 className="text-xl font-bold mb-4">Bản đồ</h2>
        <div
          className="relative overflow-hidden rounded-lg"
          style={{
            width: "100%",
            paddingTop: "56.25%",
          }}
        >
          {selectedResult ? (
            <iframe
              src={
                filteredResults
                  .find((r) => r.id === selectedResult)
                  ?.googleMapUrl.match(/src="([^"]+)"/)?.[1] || ""
              }
              width="100%"
              height="100%"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                border: 0,
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          ) : (
            <img
              src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-2506.jpg?t=st=1740509479~exp=1740513079~hmac=fb9232accc15d60c89c3ff49d0501d052507d8d41e7f29e996ddb4a42ad3fabf&w=1380"
              alt="No Results Found"
              className="w-full h-full object-cover rounded-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
