"use client";

/* eslint-disable @next/next/no-img-element */
import ShinyCard from "@/components/animate-ui/shiny-card";
import FloatingCard from "@/components/animate-ui/floating-card";
import AnimatedText from "@/components/animate-ui/animated-text";
import Loader from "@/components/loader/Loader";
import Pagination from "@/components/pagination/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card-content";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { BASE_URL } from "@/constants/environments";
import { HotWorkspaceOwnerProps, Promotion } from "@/types";
import { ConfigProvider, Slider } from "antd";
import {
  Calendar,
  Clock,
  Filter,
  Ruler,
  Users,
  X,
  GiftIcon,
  Star,
  CalendarCheck,
  Building2,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import ReactSlider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SectionTitle from "@/components/ui/section-tilte";

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
}

function WorkspaceOwnerDetail() {
  const { ownerId } = useParams() as { ownerId: string };
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [ownerData, setOwnerData] = useState<HotWorkspaceOwnerProps | null>({
    workspaceOwnerId: 0,
    phone: "",
    email: "",
    googleMapUrl: "",
    licenseName: "",
    licenseAddress: "",
    avatar: "",
    rateAverage: 0,
    numberOfBooking: 0,
    numberOfWorkspace: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "Tất cả"
  );
  const [filteredWorkspaces, setFilteredWorkspaces] = useState<Workspace[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [areaRange, setAreaRange] = useState<[number, number]>([0, 500]);
  const [capacityRange, setCapacityRange] = useState<[number, number]>([
    0, 100,
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!ownerId) return;

    setLoading(true);
    const fetchOwner = async () => {
      try {
        const response = await fetch(`${BASE_URL}/workspace-owners/${ownerId}`);

        if (!response.ok) {
          throw new Error("Có lỗi xảy ra khi tải thông tin chủ doanh nghiệp.");
        }

        const data = await response.json();

        const ownerDataResponse = await fetch(
          `${BASE_URL}/users/searchbyownername?OwnerName=${data.owner.licenseName}`
        );

        if (!ownerDataResponse.ok) {
          throw new Error("Có lỗi xảy ra khi tải thông tin chủ doanh nghiệp.");
        }

        const ownerDataJson = await ownerDataResponse.json();

        const formatted =
          ownerDataJson.workspaceOwnerByOwnerNameDTOs === null ||
          ownerDataJson.workspaceOwnerByOwnerNameDTOs === undefined
            ? null
            : ownerDataJson.workspaceOwnerByOwnerNameDTOs[0];

        setOwnerData(formatted);
        setLoading(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Đã xảy ra lỗi!";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          theme: "light",
        });
        setOwnerData(null);
        setLoading(false);
      }
    };

    fetchOwner();
  }, [ownerId]);

  useEffect(() => {
    if (!ownerId) return;
    setLoading(true);
    const fetchWorkspaces = async () => {
      try {
        const response = await fetch(`${BASE_URL}/workspaces/owner/${ownerId}`);

        if (!response.ok) {
          throw new Error("Có lỗi xảy ra khi tải danh sách không gian!");
        }

        const data = await response.json();
        const formatted =
          data.workspaces === null || data.workspaces === undefined
            ? []
            : data.workspaces
                .filter((workspace: Workspace) => workspace.status === "Active")
                .map((workspace: Workspace) => ({
                  ...workspace,
                  shortTermPrice:
                    workspace.prices.find((price) => price.category === "Giờ")
                      ?.price || 0,
                  longTermPrice:
                    workspace.prices.find((price) => price.category === "Ngày")
                      ?.price || 0,
                }));
        setWorkspaces(formatted);
        setFilteredWorkspaces(formatted);
        setLoading(false);

        const uniqueCategories: string[] = Array.from(
          new Set(
            formatted.map(
              (workspace: Workspace) => (workspace?.category || "") as string
            )
          )
        );
        setCategories(["Tất cả", ...uniqueCategories]);

        const maxPrice = Math.max(
          ...formatted.map((w: Workspace) =>
            Math.max(w.shortTermPrice || 0, w.longTermPrice || 0)
          )
        );
        const maxArea = Math.max(
          ...formatted.map((w: Workspace) => w.area || 0)
        );
        const maxCapacity = Math.max(
          ...formatted.map((w: Workspace) => w.capacity || 0)
        );

        setPriceRange([0, maxPrice > 0 ? maxPrice : 1000000]);
        setAreaRange([0, maxArea > 0 ? maxArea : 500]);
        setCapacityRange([0, maxCapacity > 0 ? maxCapacity : 100]);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Đã xảy ra lỗi!";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          theme: "light",
        });
        setWorkspaces([]);
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, [ownerId]);

  useEffect(() => {
    if (!ownerId) return;

    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${BASE_URL}/workspace-owners/${ownerId}/promotions`
        );

        if (!response.ok) {
          throw new Error(`Error fetching promotions for owner ${ownerId}`);
        }

        const data = await response.json();
        console.log("Promotions data:", data);

        // Filter to only show Active promotions
        let activePromotions = [];

        if (Array.isArray(data.promotions)) {
          activePromotions = data.promotions.filter(
            (promo: Promotion) => promo.status === "Active"
          );
        }

        console.log("Active promotions count:", activePromotions.length);
        console.log("Active promotions:", activePromotions);

        // Process promotions without fetching workspace names
        const processedPromotions = activePromotions.map((promo: Promotion) => {
          return {
            ...promo,
            workspaceName: promo.workspaceID
              ? "Không gian làm việc"
              : "Không gian làm việc",
          };
        });

        console.log("Processed promotions:", processedPromotions);
        setPromotions(processedPromotions);
      } catch (error) {
        console.error("Error fetching promotions:", error);
        setPromotions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, [ownerId]); // Only depend on ownerId

  if (loading) {
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  const totalPages = Math.ceil(filteredWorkspaces.length / 12);

  const paginatedWorkspaces = filteredWorkspaces.slice(
    (currentPage - 1) * 12,
    currentPage * 12
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

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

  if (!loading && !ownerData) {
    return (
      <div className="w-full md:w-[90%] mx-auto pt-16 pb-20 text-center">
        <img src="/404.png" alt="No data" className="w-96 mx-auto mt-6" />
        <p className="text-gray-600 text-lg">Không có dữ liệu để hiển thị.</p>
      </div>
    );
  }

  const sliderSettings = {
    dots: promotions.length > 1,
    infinite: promotions.length > 1,
    speed: 500,
    slidesToShow: promotions.length === 1 ? 1 : Math.min(promotions.length, 3),
    slidesToScroll: 1,
    arrows: promotions.length > 1,
    nextArrow: undefined,
    prevArrow: undefined,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow:
            promotions.length === 1 ? 1 : Math.min(promotions.length, 2),
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full md:w-[90%] mx-auto pt-16 pb-20 px-6">
      {/* Owner Profile Card */}
      <ShinyCard className="w-full bg-white rounded-lg overflow-hidden shadow-md mb-12">
        {/* Cover Image */}
        <div className="relative h-48 w-full">
          <Image
            src="/banner.png"
            alt="Cover"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
        </div>

        {/* Profile Info Section */}
        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <motion.div
            className="absolute -top-12 left-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FloatingCard
              intensity={10}
              glareIntensity={0.2}
              className="relative w-32 h-32 lg:h-48 lg:w-48 rounded-full ring-4 ring-white overflow-hidden shadow-lg p-0"
            >
              <Image
                src={ownerData?.avatar || "/owner_icon.png"}
                alt="Avatar"
                fill
                className="object-cover bg-primary/10"
              />
            </FloatingCard>
          </motion.div>

          {/* Name & Info */}
          <motion.div
            className="ml-0 lg:ml-60 pt-24 lg:pt-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AnimatedText
              text={ownerData?.licenseName || "Thương hiệu"}
              animation="fade"
              className="text-xl font-bold text-fourth"
              delay={0.4}
            />
            <div className="flex md:flex-row flex-col md:items-center gap-2 text-sm text-fifth">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 120, delay: 0.5 }}
              >
                <Badge className="bg-secondary/80 hover:bg-secondary text-white text-xs">
                  Thương hiệu
                </Badge>
              </motion.div>
              {ownerData?.licenseAddress && (
                <motion.p
                  className="flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <span>{ownerData.licenseAddress}</span>
                </motion.p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2 w-full lg:w-1/3">
              <div className="flex flex-col gap-2 items-center rounded-lg border-2 text-fourth text-sm p-2">
                <span className="flex items-center gap-2 justify-center font-medium text-base">
                  <Star size={20} className="text-primary" />{" "}
                  {ownerData?.rateAverage || 0}
                </span>
                <span className="flex items-center gap-2 justify-center font-medium text-sm">
                  sao
                </span>
              </div>
              <div className="flex flex-col gap-2 items-center rounded-lg border-2 text-fourth text-sm p-2">
                <span className="flex items-center gap-2 justify-center font-medium text-base">
                  <CalendarCheck size={20} className="text-primary" />{" "}
                  {ownerData?.numberOfBooking || 0}
                </span>
                <span className="flex items-center gap-2 justify-center font-medium text-sm">
                  lượt đặt
                </span>
              </div>
              <div className="flex flex-col gap-2 items-center rounded-lg border-2 text-fourth text-sm p-2">
                <span className="flex items-center gap-2 justify-center font-medium text-base">
                  <Building2 size={20} className="text-primary" />{" "}
                  {ownerData?.numberOfWorkspace || 0}
                </span>
                <span className="flex items-center gap-2 justify-center font-medium text-sm">
                  không gian
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </ShinyCard>

      <Separator className="my-8" />

      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-6 md:gap-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`text-sm md:text-base font-medium transition-all duration-200 hover:text-primary hover:border-b-2 hover:border-primary py-2 ${
                  selectedCategory === category
                    ? "border-b-2 border-primary text-primary font-semibold"
                    : "text-gray-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <button
            className="flex items-center space-x-2 px-5 py-2.5 border border-gray-300 rounded-full text-sm bg-white shadow-sm hover:bg-gray-50 transition-all duration-200"
            onClick={toggleFilters}
          >
            <Filter size={16} className="text-primary" />
            <span className="font-medium">Bộ lọc</span>
          </button>
        </div>

        {/* Promotions Section */}
        {promotions.length > 0 && (
          <div className="mb-10 bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-lg font-bold text-fourth mb-4 flex items-center gap-2">
              <span className="text-primary">
                <GiftIcon />
              </span>{" "}
              Mã khuyến mãi đang có hiệu lực
            </h2>
            {promotions.length > 1 ? (
              <div className="slider-container pb-6">
                <ReactSlider {...sliderSettings}>
                  {promotions.map((promotion) => (
                    <div key={promotion.id} className="px-2">
                      <div
                        className="border-2 border-dashed border-primary/40 bg-gradient-to-br from-white to-primary/5 rounded-lg p-4 hover:shadow-lg transition-all duration-300 hover:border-primary cursor-pointer h-full"
                        onClick={() =>
                          router.push(`/workspace/${promotion.workspaceID}`)
                        }
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-lg font-bold text-primary mb-1">
                              {promotion.code}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                              {promotion.workspaceName || "Không gian làm việc"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {dayjs(promotion.startDate).format("DD/MM/YYYY")}{" "}
                              - {dayjs(promotion.endDate).format("DD/MM/YYYY")}
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-primary to-secondary text-white text-lg font-bold rounded-full h-14 w-14 flex items-center justify-center shadow-md transform transition-transform hover:scale-105">
                            {promotion.discount}%
                          </div>
                        </div>
                        {promotion.description && (
                          <p className="text-xs text-gray-600 mt-3 border-t border-primary/20 pt-2">
                            {promotion.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </ReactSlider>
                <style jsx global>{`
                  .slider-container .slick-arrow {
                    background: #835101;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    display: flex !important;
                    align-items: center;
                    justify-content: center;
                    z-index: 1;
                  }
                  .slider-container .slick-arrow:before {
                    font-size: 20px;
                    line-height: 1;
                    opacity: 0.75;
                    color: white;
                  }
                  .slider-container .slick-arrow:hover {
                    background: #b49057;
                  }
                  .slider-container .slick-prev {
                    left: -10px;
                  }
                  .slider-container .slick-next {
                    right: -10px;
                  }
                  .slider-container .slick-dots li button:before {
                    color: #835101;
                  }
                  .slider-container .slick-dots li.slick-active button:before {
                    color: #835101;
                  }
                `}</style>
              </div>
            ) : (
              <div className="max-w-md mx-auto">
                <div
                  className="border-2 border-dashed border-primary/40 bg-gradient-to-br from-white to-primary/5 rounded-lg p-4 hover:shadow-lg transition-all duration-300 hover:border-primary cursor-pointer"
                  onClick={() =>
                    router.push(`/workspace/${promotions[0].workspaceID}`)
                  }
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-lg font-bold text-primary mb-1">
                        {promotions[0].code}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {promotions[0].workspaceName || "Không gian làm việc"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {dayjs(promotions[0].startDate).format("DD/MM/YYYY")} -{" "}
                        {dayjs(promotions[0].endDate).format("DD/MM/YYYY")}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-primary to-secondary text-white text-lg font-bold rounded-full h-14 w-14 flex items-center justify-center shadow-md transform transition-transform hover:scale-105">
                      {promotions[0].discount}%
                    </div>
                  </div>
                  {promotions[0].description && (
                    <p className="text-xs text-gray-600 mt-3 border-t border-primary/20 pt-2">
                      {promotions[0].description}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {showFilters && (
          <div className="mb-4 bg-white p-4 rounded-xl shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-fourth">
                Lọc kết quả tìm kiếm
              </h2>
              <button
                onClick={toggleFilters}
                className="text-gray-500 hover:text-primary transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-fourth mb-1">
                    Tìm kiếm theo tên hoặc địa chỉ
                  </label>
                  <Input
                    type="text"
                    placeholder="Nhập từ khóa tìm kiếm..."
                    className="w-full py-6 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={searchQuery}
                    onChange={(e) => {
                      e.preventDefault();
                      handleSearch(e.target.value);
                    }}
                  />
                </div>

                <div className="mb-6">
                  <p className="text-sm font-medium mb-3 text-fourth">
                    Khoảng giá (VND):
                  </p>
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
                      step={1000}
                      value={priceRange}
                      onChange={(value) =>
                        setPriceRange(value as [number, number])
                      }
                    />
                  </ConfigProvider>
                  <div className="flex justify-between text-sm">
                    <span>{formatCurrency(priceRange[0])}</span>
                    <span>{formatCurrency(priceRange[1])}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-6">
                  <p className="text-sm font-medium mb-3 text-fourth">
                    Diện tích (m²):
                  </p>
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

                <div className="mb-6">
                  <p className="text-sm font-medium mb-3 text-fourth">
                    Sức chứa (người):
                  </p>
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
                className="bg-primary hover:bg-primary/90 text-white font-medium px-6"
              >
                Áp dụng bộ lọc
              </Button>
              <Button
                onClick={resetFilters}
                variant="outline"
                className="border-gray-300 hover:bg-gray-50"
              >
                Đặt lại
              </Button>
            </div>
          </div>
        )}

        <div className="mt-10">
          <SectionTitle>Không gian làm việc</SectionTitle>
          <p className="text-gray-500 mb-6 mt-10">
            {filteredWorkspaces.length} không gian làm việc được tìm thấy
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
                    <div className="overflow-hidden h-40">
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

                  <CardContent className="p-3">
                    <h3 className="text-base md:text-lg font-bold text-gray-800 mb-1 line-clamp-1">
                      {workspace.name}
                    </h3>
                    <p className="text-gray-600 text-xs mb-3 flex items-center">
                      <span className="truncate">{workspace.address}</span>
                    </p>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="flex items-center text-gray-700 text-xs">
                        <Users className="mr-1 text-blue-500" size={16} />
                        <span>{workspace.capacity} người</span>
                      </div>
                      <div className="flex items-center text-gray-700 text-xs justify-end">
                        <Ruler className="mr-1 text-green-500" size={16} />
                        <span>{workspace.area} m²</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-300 pt-3">
                      <div className="flex flex-col gap-1">
                        {workspace.shortTermPrice > 0 && (
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-gray-700 text-xs md:text-sm">
                              <Clock
                                className="mr-1 text-orange-500"
                                size={16}
                              />
                              <span>Theo giờ</span>
                            </div>
                            <span className="font-semibold text-gray-900 text-xs md:text-sm">
                              {formatCurrency(workspace.shortTermPrice)}
                            </span>
                          </div>
                        )}

                        {workspace.longTermPrice > 0 && (
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-gray-700 text-xs md:text-sm">
                              <Calendar
                                className="mr-1 text-purple-500"
                                size={16}
                              />
                              <span>Theo ngày</span>
                            </div>
                            <span className="font-semibold text-gray-900 text-xs md:text-sm">
                              {formatCurrency(workspace.longTermPrice)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button className="w-full mt-4 text-white hidden md:block">
                      Xem chi tiết
                    </Button>
                  </CardContent>
                </div>
              </ShinyCard>
            ))}
          </div>
        </div>
      </div>
      {workspaces.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

export default WorkspaceOwnerDetail;
