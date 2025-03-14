"use client";

import Slider from "react-slick";
import AmenitiesItem from "./amenities-item";
import Loader from "../loader/Loader";
import { useEffect, useState } from "react";
import { AmenityProps } from "@/types";
import { toast } from "react-toastify";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function AmenitiesList({ ownerId }: { ownerId: string }) {
  const [loading, setLoading] = useState(false);
  const [amenityList, setAmenityList] = useState<AmenityProps[]>([]);

  useEffect(() => {
    if (!ownerId) return;
    setLoading(true);

    const fetchAmenityList = async () => {
      try {
        const response = await fetch(
          `https://localhost:5050/amenities/Owner/${ownerId}`
        );

        if (!response.ok) {
          throw new Error("Có lỗi xảy ra khi tải tiện ích.");
        }

        const data = await response.json();
        setAmenityList(Array.isArray(data.amenities) ? data.amenities : []);
        setLoading(false);
      } catch {
        toast.error("Có lỗi xảy ra khi tải tiện ích.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          theme: "light",
        });
        setAmenityList([]);
        setLoading(false);
      }
    };

    fetchAmenityList();
  }, [ownerId]);

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

  if (loading) {
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full">
      {amenityList.length > 0 ? (
        <Slider {...settings}>
          {amenityList.map((amenity) => (
            <div key={amenity.id} className="px-2">
              <AmenitiesItem {...amenity} />
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-sm text-sixth italic flex items-center">Trống</p>
      )}
    </div>
  );
}

export default AmenitiesList;
