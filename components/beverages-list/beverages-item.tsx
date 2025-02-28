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

function BeveragesItem({ id, name, price, image, description }: BeverageProps) {
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
          image,
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
                src={image}
                alt={name}
                className="w-full h-36 object-cover rounded-t-lg"
              />
              <div className="bg-primary text-white px-3 py-1 rounded-b-lg text-base flex gap-2 items-center justify-center">
                <Banknote /> {price} VND
              </div>
            </div>
            <div className="col-span-2 p-4 flex flex-col gap-2 items-start justify-center">
              <h3 className="text-base font-semibold">{name}</h3>
              <p className="text-gray-600 text-sm">{description}</p>
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
