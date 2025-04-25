/* eslint-disable @next/next/no-img-element */
"use client";

import Loader from "@/components/loader/Loader";
import { BASE_URL } from "@/constants/environments";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { CardContent } from "@/components/ui/card-content";
import {
  Building2,
  CalendarCheck,
  Filter,
  MapPin,
  Star,
  X,
} from "lucide-react";
import Pagination from "@/components/pagination/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfigProvider, Slider } from "antd";
import { Input } from "@/components/ui/input";
import { HotWorkspaceOwnerProps } from "@/types";
import SectionTitle from "@/components/ui/section-tilte";

function OwnerPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [ownerList, setOwnerList] = useState<HotWorkspaceOwnerProps[]>([]);
  const [filterOwnerList, setFilterOwnerList] = useState<
    HotWorkspaceOwnerProps[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [ratingRange, setRatingRange] = useState<[number, number]>([0, 5]);
  const [bookingRange, setBookingRange] = useState<[number, number]>([0, 100]);
  const [workspaceRange, setWorkspaceRange] = useState<[number, number]>([
    0, 100,
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOwnerList = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/searchbyownername`);

        if (!response.ok) {
          throw new Error("Có lỗi xảy ra khi tải dữ liệu.");
        }

        const data = await response.json();
        const formattedData =
          data.workspaceOwnerByOwnerNameDTOs === null ||
          data.workspaceOwnerByOwnerNameDTOs === undefined
            ? []
            : data.workspaceOwnerByOwnerNameDTOs
                .sort(
                  (a: HotWorkspaceOwnerProps, b: HotWorkspaceOwnerProps) =>
                    b.numberOfBooking - a.numberOfBooking
                )
                .sort(
                  (a: HotWorkspaceOwnerProps, b: HotWorkspaceOwnerProps) =>
                    b.rateAverage - a.rateAverage
                );
        setOwnerList(formattedData);
        setFilterOwnerList(formattedData);

        const maxRating = Math.max(
          ...formattedData.map(
            (d: HotWorkspaceOwnerProps) => d.rateAverage || 0
          )
        );
        const maxBooking = Math.max(
          ...formattedData.map(
            (d: HotWorkspaceOwnerProps) => d.numberOfBooking || 0
          )
        );
        const maxWorkspace = Math.max(
          ...formattedData.map(
            (d: HotWorkspaceOwnerProps) => d.numberOfWorkspace || 0
          )
        );

        setRatingRange([0, maxRating > 0 ? maxRating : 5]);
        setBookingRange([0, maxBooking > 0 ? maxBooking : 100]);
        setWorkspaceRange([0, maxWorkspace > 0 ? maxWorkspace : 100]);
        setLoading(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Đã xảy ra lỗi!";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          theme: "light",
        });
        setOwnerList([]);
        setLoading(false);
      }
    };

    fetchOwnerList();
  }, []);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const applyFilters = (
    query = searchQuery,
    rating = ratingRange,
    booking = bookingRange,
    workspace = workspaceRange
  ) => {
    let filtered = [...ownerList];

    if (query) {
      const searchTermLower = query.toLowerCase();
      filtered = filtered.filter(
        (owner) =>
          owner.licenseName.toLowerCase().includes(searchTermLower) ||
          owner.licenseAddress.toLowerCase().includes(searchTermLower)
      );
    }

    filtered = filtered.filter(
      (owner) =>
        owner.rateAverage >= rating[0] && owner.rateAverage <= rating[1]
    );

    filtered = filtered.filter(
      (owner) =>
        owner.numberOfBooking >= booking[0] &&
        owner.numberOfBooking <= booking[1]
    );

    filtered = filtered.filter(
      (owner) =>
        owner.numberOfWorkspace >= workspace[0] &&
        owner.numberOfWorkspace <= workspace[1]
    );

    setFilterOwnerList(filtered);
    setCurrentPage(1);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setSearchQuery("");

    const maxRating = Math.max(...ownerList.map((d) => d.rateAverage || 0));
    const maxBooking = Math.max(
      ...ownerList.map((d) => d.numberOfBooking || 0)
    );
    const maxWorkspace = Math.max(
      ...ownerList.map((d) => d.numberOfWorkspace || 0)
    );

    setRatingRange([0, maxRating > 0 ? maxRating : 5]);
    setBookingRange([0, maxBooking > 0 ? maxBooking : 100]);
    setWorkspaceRange([0, maxWorkspace > 0 ? maxWorkspace : 100]);

    setFilterOwnerList(ownerList);
  };

  if (loading) {
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  if (ownerList.length === 0) {
    return (
      <div className="w-[90%] mx-auto pt-16 pb-20 text-center">
        <img src="/404.png" alt="No data" className="w-96 mx-auto mt-6" />
        <p className="text-gray-600 text-lg">Không có dữ liệu để hiển thị.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(filterOwnerList.length / 12);

  const paginatedOwnerList = filterOwnerList.slice(
    (currentPage - 1) * 12,
    currentPage * 12
  );

  return (
    <div className="w-[90%] mx-auto pt-16 pb-20 px-6">
      <SectionTitle>Danh sách thương hiệu</SectionTitle>
      <div className="flex flex-wrap items-center justify-end gap-4 mt-10">
        <button
          className="flex items-center space-x-2 px-4 py-2 border border-primary rounded-full text-sm sm:text-base hover:bg-primary hover:text-white transition-all duration-200"
          onClick={toggleFilters}
        >
          <Filter size={18} />
          <span>Bộ lọc</span>
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm theo tên hoặc địa chỉ thương hiệu
              </label>
              <Input
                type="text"
                placeholder="Nhập từ khóa tìm kiếm..."
                className="w-full py-6 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Số sao:</p>
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
                  max={Math.max(...ownerList.map((d) => d.rateAverage || 0))}
                  value={ratingRange}
                  onChange={(value) =>
                    setRatingRange(value as [number, number])
                  }
                />
              </ConfigProvider>
              <div className="flex justify-between text-sm">
                <span>{ratingRange[0]} sao</span>
                <span>{ratingRange[1]} sao</span>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Lượt đặt:
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
                    ...ownerList.map((d) => d.numberOfBooking || 0)
                  )}
                  value={bookingRange}
                  onChange={(value) =>
                    setBookingRange(value as [number, number])
                  }
                />
              </ConfigProvider>
              <div className="flex justify-between text-sm">
                <span>{bookingRange[0]} lượt</span>
                <span>{bookingRange[1]} lượt</span>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Số lượng không gian:
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
                    ...ownerList.map((d) => d.numberOfWorkspace || 0)
                  )}
                  value={workspaceRange}
                  onChange={(value) =>
                    setWorkspaceRange(value as [number, number])
                  }
                />
              </ConfigProvider>
              <div className="flex justify-between text-sm">
                <span>{workspaceRange[0]} không gian</span>
                <span>{workspaceRange[1]} không gian</span>
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
          {filterOwnerList.length} kết quả được tìm thấy
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {paginatedOwnerList.map((owner) => (
            <div key={owner.workspaceOwnerId} className="relative group">
              <Link
                href={`/workspace-owner/${owner.workspaceOwnerId}`}
                className="block"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <Card className="relative overflow-hidden rounded-lg shadow-lg border border-gray-100 h-full">
                    <div
                      className={
                        "absolute -left-40 top-0 h-full w-14 rotate-[30deg] scale-y-150 bg-primary/20 transition-all duration-700 group-hover:left-[calc(100%+8rem)]"
                      }
                    />
                    <div className="relative group">
                      <div className="overflow-hidden h-40">
                        <img
                          src={"/banner.png"}
                          alt={owner.licenseName}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>

                      <div className="absolute -bottom-8 left-4 h-20 w-20 rounded-lg overflow-hidden border-2 border-secondary">
                        <Image
                          src={owner?.avatar || "/owner_icon.png"}
                          alt="Avatar"
                          fill
                          className="object-cover bg-primary/20"
                        />
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 120,
                            delay: 0.5,
                          }}
                          className="left-32"
                        ></motion.div>
                      </div>

                      <div className="absolute -bottom-8 left-28 overflow-hidden">
                        <Badge className="bg-primary hover:bg-secondary text-white">
                          Thương hiệu
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-3 mt-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">
                        {owner.licenseName}
                      </h3>
                      <p className="text-gray-600 text-xs mb-3 flex items-center">
                        <MapPin className="mr-1 text-gray-400" size={14} />
                        <span className="truncate">{owner.licenseAddress}</span>
                      </p>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <div className="flex flex-col gap-2 items-center rounded-lg border-2 text-fourth text-sm p-1">
                          <span className="flex items-center gap-2 justify-center font-medium text-sm">
                            <Star size={16} className="text-primary" />{" "}
                            {owner.rateAverage}
                          </span>
                          <span className="flex items-center gap-2 justify-center font-medium text-xs">
                            sao
                          </span>
                        </div>
                        <div className="flex flex-col gap-2 items-center rounded-lg border-2 text-fourth text-sm p-1">
                          <span className="flex items-center gap-2 justify-center font-medium text-sm">
                            <CalendarCheck size={16} className="text-primary" />{" "}
                            {owner.numberOfBooking}
                          </span>
                          <span className="flex items-center gap-2 justify-center font-medium text-xs">
                            lượt đặt
                          </span>
                        </div>
                        <div className="flex flex-col gap-2 items-center rounded-lg border-2 text-fourth text-sm p-1">
                          <span className="flex items-center gap-2 justify-center font-medium text-sm">
                            <Building2 size={16} className="text-primary" />{" "}
                            {owner.numberOfWorkspace}
                          </span>
                          <span className="flex items-center gap-2 justify-center font-medium text-xs">
                            không gian
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {filterOwnerList.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

export default OwnerPage;
