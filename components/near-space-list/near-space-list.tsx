/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Slider from "react-slick";
import { Users, Ruler, MapPin, Calendar, Clock, LandPlot } from "lucide-react";
import { Card } from "../ui/card";
import { CardContent } from "../ui/card-content";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import Loader from "../loader/Loader";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Workspace } from "@/types";
import Link from "next/link";
import { toast } from "react-toastify";
import { BASE_URL } from "@/constants/environments";

interface WorkspaceWithStatus extends Workspace {
  status: string;
  distanceKm: number;
}

interface Location {
  lat: number;
  lng: number;
}

export default function NearSpaceList({ km }: { km: string }) {
  const [workspaces, setWorkspaces] = useState<WorkspaceWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setHoveredCard] = useState<number | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Trình duyệt của bạn không hỗ trợ định vị địa lý.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setError(null); // Clear any previous error messages
        const fetchWorkspaces = async () => {
          setLoading(true);
          try {
            const formattedKm = km === "All" ? "" : km;
            const url =
              formattedKm === ""
                ? `${BASE_URL}/workspaces/nearby?lat=${latitude}&lng=${longitude}`
                : `${BASE_URL}/workspaces/nearby?lat=${latitude}&lng=${longitude}&radiusKm=${formattedKm}`;
            const response = await fetch(`${url}`);

            if (!response.ok) {
              throw new Error("Mạng không ổn định");
            }

            const data = await response.json();
            const formatted =
              data.workspaces === null || data.workspaces === undefined
                ? []
                : data.workspaces.filter(
                    (workspace: WorkspaceWithStatus) =>
                      workspace.status === "Active"
                  );

            setWorkspaces(formatted);
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
          }
        };

        fetchWorkspaces();
      },
      () => {
        setLoading(false);
        setError(
          "Không thể truy cập vị trí của bạn. Vui lòng cấp quyền truy cập vị trí để xem không gian làm việc gần bạn."
        );
      }
    );
  }, [km]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader />
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <div className="w-full mx-auto text-center mt-10">
        <p className="text-gray-600 text-base">Không có dữ liệu để hiển thị.</p>
      </div>
    );
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };

  return (
    <>
      <div className="w-full mx-auto px-6 md:px-0">
        <div className="mt-10">
          {location ? (
            <p className="text-gray-500 md:ml-3 mb-4">
              {workspaces.length} không gian gần bạn được tìm thấy
            </p>
          ) : (
            !error && <p>Lỗi vị trí...</p>
          )}
        </div>
        <Slider {...settings} className="near-space-slider">
          {workspaces.map((workspace) => {
            const shortTermPrice = workspace.prices.find(
              (price) => price.category === "Giờ"
            )?.price;
            const longTermPrice = workspace.prices.find(
              (price) => price.category === "Ngày"
            )?.price;

            return (
              <div key={workspace.id} className="p-3">
                <Link href={`/workspace/${workspace.id}`} className="block">
                  <motion.div
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3 }}
                    onMouseEnter={() => setHoveredCard(Number(workspace.id))}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <Card className="relative overflow-hidden rounded-lg shadow-lg border border-gray-100 h-full">
                      <div className="relative group">
                        <div className="overflow-hidden h-40">
                          <img
                            src={
                              workspace.images[0]?.imgUrl || "/placeholder.png"
                            }
                            alt={workspace.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>

                        {location && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-secondary hover:bg-secondary/80 text-white px-2 py-1 rounded-md text-xs flex items-center">
                              <LandPlot className="mr-1" size={16} />
                              {workspace.distanceKm.toFixed(2)} km
                            </Badge>
                          </div>
                        )}

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
                          <MapPin className="mr-1 text-gray-400" size={14} />
                          <span className="truncate">{workspace.address}</span>
                        </p>

                        <div className="grid grid-cols-2 gap-2 mb-3">
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
                            {shortTermPrice && (
                              <div className="flex justify-between items-center">
                                <div className="flex items-center text-gray-700 text-xs md:text-sm">
                                  <Clock
                                    className="mr-1 text-orange-500"
                                    size={16}
                                  />
                                  <span>Theo giờ</span>
                                </div>
                                <span className="font-semibold text-gray-900 text-xs md:text-sm">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(shortTermPrice)}
                                </span>
                              </div>
                            )}

                            {longTermPrice && (
                              <div className="flex justify-between items-center">
                                <div className="flex items-center text-gray-700 text-xs md:text-sm">
                                  <Calendar
                                    className="mr-1 text-purple-500"
                                    size={16}
                                  />
                                  <span>Theo ngày</span>
                                </div>
                                <span className="font-semibold text-gray-900 text-xs md:text-sm">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(longTermPrice)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <Button className="w-full mt-4 text-white">
                          Xem chi tiết
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              </div>
            );
          })}
        </Slider>

        <style jsx global>{`
          .near-space-slider .slick-dots li button:before {
            font-size: 10px;
            color: #835101;
          }
          .near-space-slider .slick-dots li.slick-active button:before {
            color: rgb(188, 122, 15);
          }
          .near-space-slider .slick-prev:before,
          .near-space-slider .slick-next:before {
            color: #835101;
            font-size: 24px;
          }
        `}</style>
      </div>
    </>
  );
}
