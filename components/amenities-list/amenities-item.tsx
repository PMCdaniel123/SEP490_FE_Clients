/* eslint-disable @next/next/no-img-element */
"use client";

import { AmenityProps } from "@/types";
import { Card, CardContent } from "../ui/card";
import { Banknote, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Modal } from "antd";
import { useDispatch } from "react-redux";
import { addAmenity } from "@/stores/slices/cartSlice";
import { Button } from "../ui/button";

function AmenitiesItem({
  id,
  name,
  price,
  imgUrl,
  quantity,
  category,
  description,
}: AmenityProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addAmenity({
        id,
        name,
        imgUrl,
        price: Number(price),
        quantity: 1,
      })
    );
    setIsOpen(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <>
      <Card
        className="relative overflow-hidden rounded-lg shadow-md h-full cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative">
          <img src={imgUrl} alt={name} className="w-full h-60 object-cover" />
          <div className="absolute top-2 left-2 bg-primary text-white px-3 py-1 rounded-md text-sm flex gap-2 items-center">
            <Banknote /> {formatCurrency(Number(price))}
          </div>
        </div>
        <CardContent className="p-4 flex flex-col gap-2 border-t border-primary">
          <p className="text-sm font-semibold line-clamp-1">{name}</p>
          <p className="text-gray-600 text-xs">Số lượng: {quantity}</p>
          <p className="text-gray-600 text-xs">Loại: {category}</p>
        </CardContent>
      </Card>

      <Modal
        title={
          <p className="text-xl font-bold text-primary">Thông tin chi tiết</p>
        }
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={null}
        className="w-full mx-auto"
        width={640}
      >
        <div className="flex flex-col md:flex-row gap-10 mt-10 mb-6 mx-auto items-center justify-center">
          <div className="relative md:w-1/2">
            <img
              src={imgUrl}
              alt={name}
              className="w-72 h-72 object-cover rounded-lg border"
            />
            <div className="absolute top-2 left-2 bg-primary text-white px-3 py-2 rounded-lg text-base flex gap-2 items-center justify-center">
              <Banknote /> {formatCurrency(Number(price))}
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4 md:w-1/2">
            <p className="text-lg font-semibold">{name}</p>
            <p className="text-gray-800 text-sm">
              <span className="font-semibold">Số lượng: </span>
              {quantity}
            </p>
            <p className="text-gray-800 text-sm">
              <span className="font-semibold">Loại: </span>
              {category}
            </p>
            <p className="text-gray-800 text-sm">
              <span className="font-semibold">Mô tả: </span>
              {description}
            </p>
            <Button
              className="text-white flex gap-2 items-center text-base hover:bg-secondary transition py-6"
              onClick={handleAddToCart}
            >
              <ShoppingCart />
              <span>Thêm</span>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default AmenitiesItem;
