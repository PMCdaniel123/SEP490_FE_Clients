/* eslint-disable @next/next/no-img-element */
"use client";

import {
  CartItem,
  removeAmenity,
  updateAmenityQuantity,
} from "@/stores/slices/cartSlice";
import { Trash2, Minus, Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface Props {
  item: CartItem;
}

function Amenity({ item }: Props) {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeAmenity(item.id));
  };

  const handleIncrement = () => {
    dispatch(
      updateAmenityQuantity({ id: item.id, quantity: item.quantity + 1 })
    );
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      dispatch(
        updateAmenityQuantity({ id: item.id, quantity: item.quantity - 1 })
      );
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="flex items-center justify-between p-2 bg-white shadow-md border rounded-md">
      <img
        src={item.imgUrl}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-md"
      />
      <div className="flex flex-col gap-2">
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-sm font-semibold line-clamp-1 sm:w-24">
                  {item.name}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-white">{item.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <p className="text-xs text-gray-500">{formatCurrency(item.price)}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrement}
            className={`${
              item.quantity <= 1 ? "cursor-not-allowed opacity-50" : ""
            } p-2 bg-primary text-white rounded-md`}
            disabled={item.quantity <= 1}
          >
            <Minus size={10} />
          </button>

          <p className="text-sm">{item.quantity}</p>

          <button
            onClick={handleIncrement}
            className="p-2 bg-primary text-white rounded-md"
          >
            <Plus size={10} />
          </button>
        </div>
      </div>

      <p className="text-sm font-medium">
        {formatCurrency(item.price * item.quantity)}
      </p>

      <button
        onClick={handleRemove}
        className="text-red-500 hover:text-red-300"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}

export default Amenity;
