"use client";

import Slider from "react-slick";
import { amenityList } from "@/constants/constant";
import AmenitiesItem from "./amenities-item";

function AmenitiesList() {
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
    <div className="mx-auto w-full">
      <Slider {...settings}>
        {amenityList.map((amenity) => (
          <div key={amenity.id} className="px-2">
            <AmenitiesItem {...amenity} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default AmenitiesList;
