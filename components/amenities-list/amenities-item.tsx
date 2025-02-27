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

  return (
    <>
      <Card
        className="relative overflow-hidden rounded-lg shadow-md h-full cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative">
          <img src={image} alt={name} className="w-full h-48 object-cover" />
          <div className="absolute bottom-2 left-2 bg-primary bg-opacity-90 text-white px-3 py-1 rounded-md text-sm flex md:flex-row flex-col gap-2 items-center">
            <Banknote /> {price} VND
          </div>
        </div>
        <CardContent className="p-4 flex flex-col gap-2">
          <p className="text-base font-semibold">{name}</p>
          <p className="text-gray-600 text-sm">Số lượng: {quantity}</p>
          <p className="text-gray-600 text-sm">Loại: {category}</p>
        </CardContent>
      </Card>

      <Modal
        title="Thông tin chi tiết"
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={null}
        className="w-full md:w-1/2"
      >
        <div className="md:flex gap-4 mt-4">
          <div className="flex flex-col">
            <img
              src={image}
              alt={name}
              className="w-48 h-48 object-cover rounded-t-lg"
            />
            <div className="bg-primary text-white px-3 py-2 rounded-b-lg text-base flex gap-2 items-center justify-center">
              <Banknote /> {price} VND
            </div>
          </div>

          <div className="flex flex-col justify-center gap-2">
            <p className="text-lg font-semibold">{name}</p>
            <p className="text-gray-600 text-sm">Số lượng: {quantity}</p>
            <p className="text-gray-600 text-sm">Loại: {category}</p>
            <p className="text-gray-600 text-sm">Mô tả: {description}</p>
            <Button
              className="text-white flex gap-2 items-center"
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
