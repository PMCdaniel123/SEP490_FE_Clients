/* eslint-disable @next/next/no-img-element */
"use client";

import { Workspace } from "@/types";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Modal, Spin } from "antd";
import Slider from "react-slick";
import { LeftOutlined, RightOutlined, CloseOutlined } from "@ant-design/icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ImageGallery({ workspace }: { workspace: Workspace }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const images = workspace.images;
  
  // Create a unique key for the slider to force re-render when modal opens
  const [sliderKey, setSliderKey] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleImageClick = (index: number) => {
    setImageLoading(true);
    setSelectedImageIndex(index);
    // Increment the key to force slider to re-render with the new initial slide
    setSliderKey(prev => prev + 1);
  };

  const sliderRef = useRef<Slider>(null);

  const next = useCallback(() => {
    sliderRef.current?.slickNext();
  }, []);

  const prev = useCallback(() => {
    sliderRef.current?.slickPrev();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      
      if (e.key === 'ArrowRight') {
        next();
      } else if (e.key === 'ArrowLeft') {
        prev();
      } else if (e.key === 'Escape') {
        setSelectedImageIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, next, prev]);

  const handleModalClose = () => {
    setSelectedImageIndex(null);
  };

  const getActualIndex = (sliceStartIndex: number, relativeIndex: number) => {
    return sliceStartIndex + relativeIndex;
  };

  // Xác định layout dựa trên số lượng hình ảnh
  const renderGallery = () => {
    if (isSmallScreen) {
      // Hiển thị trên màn hình nhỏ
      return (
        <div className="flex flex-col gap-2">
          {images.length > 0 && (
            <img
              src={images[0].imgUrl}
              alt="Main Workspace"
              className="w-full h-[300px] object-cover rounded-lg cursor-pointer"
              onClick={() => handleImageClick(0)}
            />
          )}
          
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {images.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={image.imgUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-20 w-32 flex-shrink-0 object-cover rounded-md cursor-pointer"
                  onClick={() => handleImageClick(getActualIndex(1, index))}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    switch (images.length) {
      case 0:
        return null;
      case 1:
        return (
          <div className="w-full">
            <img
              src={images[0].imgUrl}
              alt="Workspace"
              className="w-full h-[400px] object-cover rounded-lg cursor-pointer"
              onClick={() => handleImageClick(0)}
            />
          </div>
        );
      case 2:
        return (
          <div className="flex gap-2">
            <div className="w-3/5">
              <img
                src={images[0].imgUrl}
                alt="Main Workspace"
                className="w-full h-[400px] object-cover rounded-lg cursor-pointer"
                onClick={() => handleImageClick(0)}
              />
            </div>
            <div className="w-2/5">
              <img
                src={images[1].imgUrl}
                alt="Second Workspace"
                className="w-full h-[400px] object-cover rounded-lg cursor-pointer"
                onClick={() => handleImageClick(1)}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex gap-2">
            <div className="w-3/5">
              <img
                src={images[0].imgUrl}
                alt="Main Workspace"
                className="w-full h-[400px] object-cover rounded-lg cursor-pointer"
                onClick={() => handleImageClick(0)}
              />
            </div>
            <div className="w-2/5 flex flex-col gap-2">
              <img
                src={images[1].imgUrl}
                alt="Second Workspace"
                className="w-full h-[195px] object-cover rounded-lg cursor-pointer"
                onClick={() => handleImageClick(1)}
              />
              <img
                src={images[2].imgUrl}
                alt="Third Workspace"
                className="w-full h-[195px] object-cover rounded-lg cursor-pointer"
                onClick={() => handleImageClick(2)}
              />
            </div>
          </div>
        );
        case 4:
  return (
    <div className="flex gap-2">
      <div className="w-3/5">
        <img
          src={images[0].imgUrl}
          alt="Main Workspace"
          className="w-full h-[400px] object-cover rounded-lg cursor-pointer"
          onClick={() => handleImageClick(0)}
        />
      </div>
      <div className="w-2/5 flex flex-col gap-2">
        <img
          src={images[1].imgUrl}
          alt="Second Workspace"
          className="w-full h-[195px] object-cover rounded-lg cursor-pointer"
          onClick={() => handleImageClick(1)}
        />
        <div className="grid grid-cols-2 gap-2">
          <img
            src={images[2].imgUrl}
            alt="Third Workspace"
            className="w-full h-[195px] object-cover rounded-lg cursor-pointer"
            onClick={() => handleImageClick(2)}
          />
          <img
            src={images[3].imgUrl}
            alt="Fourth Workspace"
            className="w-full h-[195px] object-cover rounded-lg cursor-pointer"
            onClick={() => handleImageClick(3)}
          />
        </div>
      </div>
    </div>
  );

        
      default:
        return (
          <div className="flex gap-2">
            <div className="w-3/5">
              <img
                src={images[0].imgUrl}
                alt="Main Workspace"
                className="w-full h-[400px] object-cover rounded-lg cursor-pointer"
                onClick={() => handleImageClick(0)}
              />
            </div>
            <div className="w-2/5 grid grid-cols-2 gap-2">
              {images.slice(1, 5).map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.imgUrl}
                    alt={`Workspace ${index + 1}`}
                    className="w-full h-[195px] object-cover rounded-lg cursor-pointer"
                    onClick={() => handleImageClick(getActualIndex(1, index))}
                  />
                  {index === 3 && images.length > 5 && (
                    <div 
                      className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg cursor-pointer"
                      onClick={() => handleImageClick(getActualIndex(1, index))}
                    >
                      <span className="text-white font-medium">+{images.length - 5} Khác</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {renderGallery()}

      <Modal 
        width="90%" 
        open={selectedImageIndex !== null} 
        footer={null} 
        onCancel={handleModalClose} 
        centered
        closeIcon={<CloseOutlined className="text-white text-xl" />}
        className="image-gallery-modal"
        styles={{
          mask: { backgroundColor: 'rgba(0, 0, 0, 0.85)' },
          content: { backgroundColor: 'transparent', boxShadow: 'none' }
        }}
      >
        {selectedImageIndex !== null && (
          <div className="relative">
            <Slider 
              key={sliderKey}
              ref={sliderRef} 
              initialSlide={selectedImageIndex}
              infinite={true}
              speed={500}
              slidesToShow={1}
              slidesToScroll={1}
              arrows={false}
              dots={true}
              adaptiveHeight={true}
              beforeChange={() => setImageLoading(true)}
              afterChange={(current) => {
                setImageLoading(false);
                setSelectedImageIndex(current);
              }}
            >
              {images.map((image, index) => (
                <div key={index} className="flex justify-center items-center min-h-[70vh]">
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Spin size="large" />
                    </div>
                  )}
                  <img 
                    src={image.imgUrl} 
                    alt={`Image ${index + 1}`} 
                    className="max-h-[90vh] w-full object-contain" 
                    onLoad={() => setImageLoading(false)}
                  />
                </div>
              ))}
            </Slider>
            
            <button 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all"
              onClick={prev}
              aria-label="Previous image"
            >
              <LeftOutlined className="text-xl" />
            </button>
            
            <button 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all"
              onClick={next}
              aria-label="Next image"
            >
              <RightOutlined className="text-xl" />
            </button>
            
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              <p className="text-sm font-medium">
                {selectedImageIndex + 1} / {images.length}
              </p>
            </div>
          </div>
        )}
      </Modal>
      
      <style jsx global>{`
        .image-gallery-modal .ant-modal-content {
          padding: 0;
          overflow: hidden;
        }
        .image-gallery-modal .ant-modal-close {
          top: 16px;
          right: 16px;
        }
        .slick-dots li button:before {
          color: white;
        }
        .slick-dots li.slick-active button:before {
          color: white;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        img.cursor-pointer {
          transition: transform 0.3s ease;
        }
        img.cursor-pointer:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </>
  );
}

export default ImageGallery;
