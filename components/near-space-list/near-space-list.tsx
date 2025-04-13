/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Slider from "react-slick";
import { Heart, Users, Ruler, MapPin} from "lucide-react";
import { Card } from "../ui/card";
import { CardContent } from "../ui/card-content";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import Loader from "../loader/Loader";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export interface WorkspaceNearYou {
  id: number;
  title: string;
  address: string;
  price: string;
  image: string;
  roomCapacity: number;
  roomType: string;
  roomSize: number;
}

export default function NearSpaceList() {
  const [workspaces, setWorkspaces] = useState<WorkspaceNearYou[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://67271c49302d03037e6f6a3b.mockapi.io/spaceList")
      .then((response) => response.json())
      .then((data) => {
        setWorkspaces(data);
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
      <div className="max-w-7xl mx-auto p-6 text-center">
        <p className="text-gray-600 text-lg">Không có dữ liệu để hiển thị.</p>
      </div>
    );
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
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
    <div className="max-w-7xl mx-auto p-6 pb-12">
 
      <Slider {...sliderSettings} className="near-space-slider">
        {workspaces.map((workspace) => (
          <div key={workspace.id} className="px-3 py-2">
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              onMouseEnter={() => setHoveredCard(workspace.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className="relative overflow-hidden rounded-xl shadow-lg border border-gray-100 h-full">
                <div className="relative group">
                  <div className="overflow-hidden h-56">
                    <img
                      src={workspace.image || "/placeholder.png"}
                      alt={workspace.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary hover:bg-secondary text-white px-2 py-1 rounded-md text-sm">
                      {workspace.roomType}
                    </Badge>
                  </div>

                  <div className="absolute top-3 right-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/80 hover:bg-white rounded-full h-8 w-8 shadow-md"
                    >
                      <Heart
                        className={`${
                          hoveredCard === workspace.id
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                        size={18}
                        fill={
                          hoveredCard === workspace.id ? "currentColor" : "none"
                        }
                      />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1">
                    {workspace.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 flex items-center">
                    <MapPin className="mr-1 text-gray-400" size={14} />
                    <span className="truncate">{workspace.address}</span>
                  </p>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center text-gray-700 text-sm">
                      <Users className="mr-1 text-blue-500" size={16} />
                      <span>{workspace.roomCapacity} người</span>
                    </div>
                    <div className="flex items-center text-gray-700 text-sm justify-end">
                      <Ruler className="mr-1 text-green-500" size={16} />
                      <span>{workspace.roomSize} m²</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 text-sm">Giá:</span>
                      <span className="font-semibold text-gray-900">
                        {workspace.price}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full mt-4 text-white">Xem chi tiết</Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ))}
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
  );
}