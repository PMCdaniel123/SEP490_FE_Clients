"use client";

import Slider from "react-slick";
import AmenitiesItem from "./amenities-item";
import Loader from "../loader/Loader";
import { useEffect, useState } from "react";
import { AmenityProps } from "@/types";
import { toast } from "react-toastify";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BASE_URL } from "@/constants/environments";

function AmenitiesList({ ownerId }: { ownerId: string }) {
  const [loading, setLoading] = useState(false);
  const [amenityList, setAmenityList] = useState<AmenityProps[]>([]);

  useEffect(() => {
    if (!ownerId) return;
    setLoading(true);

    const fetchAmenityList = async () => {
      try {
        const response = await fetch(`${BASE_URL}/amenities/Owner/${ownerId}`);

        if (!response.ok) {
          throw new Error("Có lỗi xảy ra khi tải tiện ích.");
        }

        const data = await response.json();
        setAmenityList(
          Array.isArray(data.amenities)
            ? data.amenities.filter((a: AmenityProps) => a.status === "Active")
            : []
        );
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
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
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
    <div className="mx-auto w-full relative pb-8">
      {amenityList.length > 0 ? (
        <Slider {...settings} className="high-rating-slider">
          {amenityList.map((amenity) => (
            <div key={amenity.id} className="px-2">
              <AmenitiesItem {...amenity} />
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-sm text-sixth italic flex items-center">Trống</p>
      )}
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

export default AmenitiesList;
