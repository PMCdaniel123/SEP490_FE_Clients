/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Loader from "../loader/Loader";
import { toast } from "react-toastify";
import { BASE_URL } from "@/constants/environments";
import Slider from "react-slick";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { Building2, CalendarCheck, MapPin, Star } from "lucide-react";
import { CardContent } from "../ui/card-content";
import Image from "next/image";
import { Badge } from "../ui/badge";

interface HotWorkspaceOwnerProps {
  workspaceOwnerId: number;
  phone: string;
  email: string;
  googleMapUrl: string;
  licenseName: string;
  licenseAddress: string;
  avatar: string;
  rateAverage: number;
  numberOfBooking: number;
  numberOfWorkspace: number;
}

function HotWorkspaceOwner() {
  const [ownerList, setOwnerList] = useState<HotWorkspaceOwnerProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setHoveredCard] = useState<number | null>(null);

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
                .filter((item: HotWorkspaceOwnerProps) => item.rateAverage >= 4)
                .sort(
                  (a: HotWorkspaceOwnerProps, b: HotWorkspaceOwnerProps) =>
                    b.numberOfBooking - a.numberOfBooking
                )
                .sort(
                  (a: HotWorkspaceOwnerProps, b: HotWorkspaceOwnerProps) =>
                    b.rateAverage - a.rateAverage
                )
                .slice(0, 5);
        setOwnerList(formattedData);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader />
      </div>
    );
  }

  if (ownerList.length === 0) {
    return (
      <div className="w-full mx-auto text-center">
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
    <div className="w-full mx-auto pt-4">
      <Slider {...settings} className="high-rating-slider">
        {ownerList.map((owner) => {
          return (
            <div key={owner.workspaceOwnerId} className="p-3">
              <Link
                href={`/workspace-owner/${owner.workspaceOwnerId}`}
                className="block"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  onMouseEnter={() => setHoveredCard(owner.workspaceOwnerId)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card className="relative overflow-hidden rounded-lg shadow-lg border border-gray-100 h-full">
                    <div className="relative group">
                      <div className="overflow-hidden h-40">
                        <img
                          src={"/banner.png"}
                          alt={owner.licenseName}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>

                      <div className="absolute -bottom-8 left-3 h-20 w-20 rounded-lg overflow-hidden border-2 border-secondary">
                        <Image
                          src={owner?.avatar || "/owner_icon.png"}
                          alt="Avatar"
                          fill
                          className="object-cover bg-primary/20"
                        />
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

export default HotWorkspaceOwner;
