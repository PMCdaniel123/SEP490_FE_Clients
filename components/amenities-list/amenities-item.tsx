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
  image,
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
        image,
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
          <img src={image} alt={name} className="w-full h-60 object-cover" />
          <div className="absolute top-2 left-2 bg-primary text-white px-3 py-1 rounded-md text-sm flex md:flex-row flex-col gap-2 items-center">
            <Banknote /> {formatCurrency(Number(price))}
          </div>
        </div>
        <CardContent className="p-4 flex flex-col gap-2">
          <p className="text-base font-semibold">{name}</p>
          <p className="text-gray-600 text-sm">Số lượng: {quantity}</p>
          <p className="text-gray-600 text-sm">Loại: {category}</p>
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
        <div className="md:flex gap-10 mt-10 mb-6 mx-auto items-center justify-center">
          <div className="relative">
            <img
              src={image}
              alt={name}
              className="w-72 h-72 object-cover rounded-lg"
            />
            <div className="absolute top-2 left-2 bg-primary text-white px-3 py-2 rounded-lg text-base flex gap-2 items-center justify-center">
              <Banknote /> {formatCurrency(Number(price))}
            </div>
          </div>

          <div className="flex flex-col justify-center gap-2">
            <p className="text-lg font-semibold">{name}</p>
            <p className="text-gray-600 text-base">Số lượng: {quantity}</p>
            <p className="text-gray-600 text-base">Loại: {category}</p>
            <p className="text-gray-600 text-base">Mô tả: {description}</p>
            <Button
              className="text-white flex gap-2 items-center text-base hover:bg-secondary transition py-6"
              onClick={handleAddToCart}
            >
              <ShoppingCart />
              <span>Thêm vào giỏ hàng</span>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default AmenitiesItem;
