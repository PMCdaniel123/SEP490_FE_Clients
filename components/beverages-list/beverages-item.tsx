/* eslint-disable @next/next/no-img-element */
"use client";

import { BeverageProps } from "@/types";
import { Card } from "../ui/card";
import { Banknote, ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { addBeverage } from "@/stores/slices/cartSlice";
import { Button } from "../ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import { Tooltip } from "antd";

function BeveragesItem({
  id,
  name,
  price,
  imgUrl,
  description,
}: BeverageProps) {
  const dispatch = useDispatch();
  const [animate, setAnimate] = useState(false);
  const [hidden, setHidden] = useState(false);

  const handleAddToCart = () => {
    setAnimate(true);
    setTimeout(() => {
      dispatch(
        addBeverage({
          id,
          name,
          imgUrl,
          price: Number(price),
          quantity: 1,
        })
      );
      setHidden(true);
      setAnimate(false);

      setTimeout(() => {
        setHidden(false);
      }, 0);
    }, 1000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  if (hidden) return null;

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={
          animate
            ? { x: 400, y: -200, opacity: 0, scale: 0.5 }
            : { x: 0, y: 0, opacity: 1, scale: 1 }
        }
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <Card className="relative overflow-hidden rounded-lg shadow-md w-full cursor-pointer my-2">
          <div className="grid grid-cols-3">
            <div className="flex flex-col col-span-1">
              <img
                src={imgUrl}
                alt={name}
                className="w-full h-full object-cover rounded-t-lg"
              />
              <div className="bg-primary text-white px-3 py-1 rounded-b-lg text-base flex gap-2 items-center justify-center">
                <Banknote /> {formatCurrency(Number(price))}
              </div>
            </div>
            <div className="col-span-2 p-4 flex flex-col gap-4 items-start justify-center">
              <Tooltip title={name} color="#835101">
                <h3 className="text-base font-semibold line-clamp-1">{name}</h3>
              </Tooltip>
              <Tooltip title={description} color="#835101">
                <p className="text-gray-600 text-sm line-clamp-2">
                  {description}
                </p>
              </Tooltip>
              <Button
                className="text-white flex gap-2 items-center"
                onClick={handleAddToCart}
              >
                <ShoppingCart />
                <span>Thêm vào giỏ hàng</span>
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default BeveragesItem;
