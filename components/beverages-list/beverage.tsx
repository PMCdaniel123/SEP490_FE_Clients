/* eslint-disable @next/next/no-img-element */
"use client";

import {
  CartItem,
  removeBeverage,
  updateBeverageQuantity,
} from "@/stores/slices/cartSlice";
import { Trash2, Minus, Plus } from "lucide-react";
import { useDispatch } from "react-redux";

interface Props {
  item: CartItem;
}

function Beverage({ item }: Props) {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeBeverage(item.id));
  };

  const handleIncrement = () => {
    dispatch(
      updateBeverageQuantity({ id: item.id, quantity: item.quantity + 1 })
    );
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      dispatch(
        updateBeverageQuantity({ id: item.id, quantity: item.quantity - 1 })
      );
    }
  };

  return (
    <div className="flex items-center justify-between p-2 bg-white shadow-md border rounded-md gap-1">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-md"
      />
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-sm font-semibold line-clamp-1">{item.name}</p>
          <p className="text-xs text-gray-500">{item.price} VND</p>
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

      <p className="text-base font-medium">{item.price * item.quantity} VND</p>

      <button
        onClick={handleRemove}
        className="text-red-500 hover:text-red-300"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}

export default Beverage;
