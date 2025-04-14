/* eslint-disable @typescript-eslint/no-explicit-any */
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

const PrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} z-10 `}
      style={{ ...style, display: "block", left: "-25px" }}
      onClick={onClick}
    >
      <div className="bg-primary hover:bg-gray-50 rounded-full  shadow-lg flex items-center justify-center border border-gray-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white hover:text-primary"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </div>
    </div>
  );
};

const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} z-10`}
      style={{ ...style, display: "block", right: "-25px" }}
      onClick={onClick}
    >
      <div className="bg-primary hover:bg-gray-50 rounded-full  shadow-lg flex items-center justify-center border border-gray-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white hover:text-primary"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    </div>
  );
};

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
        setAmenityList(Array.isArray(data.amenities) ? data.amenities : []);
        setLoading(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Đã xảy ra lỗi!";
        toast.error(errorMessage, {
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
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
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
    <div className="mx-auto w-full px-8 relative">
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
