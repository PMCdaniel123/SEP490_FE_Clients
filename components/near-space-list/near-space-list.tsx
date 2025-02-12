"use client";

import { useEffect, useState } from "react";
import Slider from "react-slick";
import { Heart, Users, Ruler, Bed, MapPin } from "lucide-react";
import { Card } from "../ui/card";
import { CardContent } from "../ui/card-content";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loader from "../loader/Loader";

interface Workspace {
  title: string;
  address: string;
  price: string;
  image: string;
  roomCapacity: number;
  roomType: string;
  roomSize: number;
}

export default function NearSpaceList() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mb-10">
      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center text-[#835101] cursor-pointer">
          <MapPin className="mr-2 text-black" size={24} />
          <span>
            Hiển thị <br />
            trên bản đồ
          </span>
        </div>
      </div>
      <Slider {...settings}>
        {workspaces.slice(0, 3).map((workspace, index) => (
          <div key={index} className="px-2">
            <Card className="relative overflow-hidden rounded-lg shadow-md">
              <div className="relative">
                <img
                  src={workspace.image}
                  alt={workspace.title}
                  className="w-full h-48 object-cover"
                />
                {/* Price overlay (inside the image) */}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-md text-sm">
                  {workspace.price}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow">
                  <Heart className="text-gray-500" size={20} />
                </div>
                <h3 className="text-lg font-semibold mt-2">
                  {workspace.title}
                </h3>
                <p className="text-gray-600 text-sm">{workspace.address}</p>
                <div className="flex items-center text-gray-600 text-sm mt-2">
                  <span className="flex items-center mr-2">
                    <Users className="mr-1" size={16} />{" "}
                    {workspace.roomCapacity}
                  </span>
                  <span className="flex items-center mr-2">
                    <Ruler className="mr-1" size={16} /> {workspace.roomSize}
                  </span>
                  <span className="flex items-center">
                    <Bed className="mr-1" size={16} /> {workspace.roomType}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </Slider>
    </div>
  );
}
