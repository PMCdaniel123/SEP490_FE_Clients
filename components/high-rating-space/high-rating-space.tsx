/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Slider from "react-slick";
import { Users, Ruler, Star, MapPin, Clock, Calendar } from "lucide-react";
import { Card } from "../ui/card";
import { CardContent } from "../ui/card-content";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loader from "../loader/Loader";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { BASE_URL } from "@/constants/environments";
import Link from "next/link";

export interface Workspace {
  id: number;
  name: string;
  address: string;
  rate: number;
  area: number;
  capacity: number;
  category: string;
  prices: { price: number; category: string }[];
  images: { imgUrl: string }[];
  status: string;
}

export default function HighRatingSpace() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${BASE_URL}/users/searchbyrate`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        const filteredWorkspaces = data.workspaces.filter(
          (workspace: Workspace) => workspace.status === "Active"
        );
        if (filteredWorkspaces.length === 0) {
          setLoading(false);
          return;
        }
        const highRatingWorkspaces = filteredWorkspaces
          .filter((workspace: Workspace) => workspace.rate >= 4)
          .sort((a: Workspace, b: Workspace) => b.rate - a.rate);
        setWorkspaces(highRatingWorkspaces);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

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
    slidesToScroll: 2,
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
    <div className="w-full mx-auto pt-4 px-6 md:px-0">
      <Slider {...settings} className="high-rating-slider">
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
                  onMouseEnter={() => setHoveredCard(workspace.id)}
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

                      <div className="absolute top-3 left-3">
                        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-md text-sm flex items-center">
                          <Star
                            className="mr-1"
                            size={14}
                            fill="white"
                            strokeWidth={0}
                          />
                          {workspace.rate.toFixed(1)}
                        </Badge>
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
                        <MapPin className="mr-1 text-gray-400" size={14} />
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
        .high-rating-slider .slick-dots li button:before {
          font-size: 10px;
          color: #835101;
        }
        .high-rating-slider .slick-dots li.slick-active button:before {
          color: rgb(188, 122, 15);
        }
        .high-rating-slider .slick-prev:before,
        .high-rating-slider .slick-next:before {
          color: #835101;
          font-size: 24px;
        }
      `}</style>
    </div>
  );
}
