/* eslint-disable @next/next/no-img-element */
"use client";

import { Workspace } from "@/types";
import React, { useState } from "react";
import { Modal } from "antd";
import Slider from "react-slick";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ImageGallery({ workspace }: { workspace: Workspace }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const images = workspace.images;

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const sliderRef = React.useRef<Slider>(null);

  const next = () => {
    sliderRef.current?.slickNext();
  };

  const prev = () => {
    sliderRef.current?.slickPrev();
  };

  const settings = {
    initialSlide: selectedImageIndex!,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
  };

  return (
    <div className={`grid gap-2 ${images.length > 3 ? "grid-cols-3" : images.length > 1 ? "grid-cols-3" : "grid-cols-1"}`}>
      {images.length > 0 && (
        <div className={`col-span-${images.length > 3 ? 2 : images.length > 1 ? 2 : 1}`}>
          <img
            src={images[0].imgUrl}
            alt="Main Workspace"
            className="w-full h-[400px] object-cover rounded-lg cursor-pointer"
            onClick={() => handleImageClick(0)}
          />
        </div>
      )}

      {images.length === 2 && (
        <div className="col-span-1">
          <img
            src={images[1].imgUrl}
            alt="Second Workspace"
            className="w-full h-[400px] object-cover rounded-lg cursor-pointer"
            onClick={() => handleImageClick(1)}
          />
        </div>
      )}

      {images.length > 2 && (
        <div className={`grid ${images.length > 3 ? "grid-cols-2" : "grid-cols-1"} gap-2`}>
          {images.slice(1, 4).map((image, index) => (
            <img
              key={index}
              src={image.imgUrl}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-[195px] object-cover rounded-lg cursor-pointer"
              onClick={() => handleImageClick(index + 1)}
            />
          ))}
          {images.length > 4 && (
            <div
              className="w-full h-[195px] flex items-center justify-center bg-gray-200 rounded-lg cursor-pointer relative"
              onClick={() => handleImageClick(4)}
              style={{
                backgroundImage: `url(${images[4].imgUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
              <span className="text-white font-medium relative z-10">Xem thêm +</span>
            </div>
          )}
          {images.length === 4 && (
            <div
              className="w-full h-[195px] flex items-center justify-center bg-gray-200 rounded-lg cursor-pointer relative"
              onClick={() => handleImageClick(3)}
              style={{
                backgroundImage: `url(${images[3].imgUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
              <span className="text-white font-medium relative z-10">Xem tất cả +</span>
            </div>
          )}
        </div>
      )}

      <Modal width={650} open={selectedImageIndex !== null} footer={null} onCancel={() => setSelectedImageIndex(null)} centered>
        <div className="relative">
          <Slider ref={sliderRef} {...settings}>
            {images.map((image, index) => (
              <div key={index}>
                <img src={image.imgUrl} alt={`Image ${index + 1}`} className="w-full rounded-lg" />
              </div>
            ))}
          </Slider>
          <LeftOutlined className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white text-2xl cursor-pointer" onClick={prev} />
          <RightOutlined className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white text-2xl cursor-pointer" onClick={next} />
        </div>
      </Modal>
    </div>
  );
}

export default ImageGallery;