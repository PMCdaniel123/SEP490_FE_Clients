/* eslint-disable @next/next/no-img-element */
"use client";

import { BeverageProps } from "@/types";
import { Card } from "../ui/card";
import { Banknote } from "lucide-react";

function BeveragesItem({ name, price, image, description }: BeverageProps) {
  return (
    <Card className="relative overflow-hidden rounded-lg shadow-md w-full cursor-pointer my-2">
      <div className="grid grid-cols-4">
        <div className="flex flex-col col-span-1">
          <img
            src={image}
            alt={name}
            className="w-full h-36 object-cover rounded-t-lg"
          />
          <div className="bg-primary bg-opacity-90 text-white px-3 py-1 rounded-b-lg text-base flex gap-2 items-center justify-center">
            <Banknote /> {price} VND
          </div>
        </div>
        <div className="col-span-3 p-4 flex flex-col gap-2 items-start justify-center">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </Card>
  );
}

export default BeveragesItem;
