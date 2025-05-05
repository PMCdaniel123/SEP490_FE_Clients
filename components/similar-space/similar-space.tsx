/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Ruler, Clock, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card-content";
import Loader from "@/components/loader/Loader";
import { Badge } from "@/components/ui/badge";
import { BASE_URL } from "@/constants/environments";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface SimilarWorkspace {
  id: number;
  name: string;
  address: string;
  category: string;
  capacity: number;
  area: number;
  prices: { price: number; category: string }[];
  images: { imgUrl: string }[];
  shortTermPrice?: number;
  longTermPrice?: number;
}

interface SimilarSpaceProps {
  category: string;
}

export default function SimilarSpace({ category }: SimilarSpaceProps) {
  const [workspaces, setWorkspaces] = useState<SimilarWorkspace[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!category) return;

    const fetchSimilarSpaces = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/users/searchbycategory${encodeURIComponent(category)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch similar spaces.");
        }

        const data = await response.json();
        const formattedWorkspaces = data.workspaceSearchByCategoryDTOs.map(
          (workspace: SimilarWorkspace) => ({
            ...workspace,
            shortTermPrice:
              workspace.prices.find((price) => price.category === "Giờ")
                ?.price || 0,
            longTermPrice:
              workspace.prices.find((price) => price.category === "Ngày")
                ?.price || 0,
          })
        );
        setWorkspaces(formattedWorkspaces);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching similar spaces:", error);
        setLoading(false);
      }
    };

    fetchSimilarSpaces();
  }, [category]);

  if (loading) {
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <div className="text-center">
        <p className="text-gray-600 text-lg">Không có không gian tương tự.</p>
      </div>
    );
  }

  const settings = {
    dots: true,
    infinite: workspaces.length > 3,
    speed: 500,
    slidesToShow: 3,
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
    <div className="flex flex-col gap-6 mb-6">
      <h2 className="text-xl font-bold text-primary">
        Các không gian tương tự
      </h2>

      <div className="px-6 md:px-0">
        <Slider {...settings} className="similar-space-slider">
          {workspaces.map((workspace) => (
            <div key={workspace.id} className="p-2">
              <Card
                className="relative overflow-hidden rounded-lg shadow-md transition-transform transform hover:scale-100 cursor-pointer h-full"
                onClick={() => router.push(`/workspace/${workspace.id}`)}
              >
                <div className="relative group">
                  <div className="overflow-hidden h-36">
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
                  <h3 className="text-base font-bold text-gray-800 mb-1 line-clamp-1">
                    {workspace.name}
                  </h3>
                  <p className="text-gray-600 text-xs mb-3 flex items-center">
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
                      {workspace.shortTermPrice !== undefined &&
                        workspace.shortTermPrice > 0 && (
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-gray-700 text-xs">
                              <Clock
                                className="mr-1 text-orange-500"
                                size={16}
                              />
                              <span>Theo giờ</span>
                            </div>
                            <span className="font-semibold text-gray-900 text-xs">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(workspace.shortTermPrice)}
                            </span>
                          </div>
                        )}

                      {workspace.longTermPrice !== undefined &&
                        workspace.longTermPrice > 0 && (
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-gray-700 text-xs">
                              <Calendar
                                className="mr-1 text-purple-500"
                                size={16}
                              />
                              <span>Theo ngày</span>
                            </div>
                            <span className="font-semibold text-gray-900 text-xs">
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
            </div>
          ))}
        </Slider>
      </div>

      <style jsx global>{`
        .similar-space-slider .slick-dots li button:before {
          font-size: 10px;
          color: #835101;
        }
        .similar-space-slider .slick-dots li.slick-active button:before {
          color: rgb(188, 122, 15);
        }
        .similar-space-slider .slick-prev:before,
        .similar-space-slider .slick-next:before {
          color: #835101;
          font-size: 24px;
        }
      `}</style>
    </div>
  );
}
