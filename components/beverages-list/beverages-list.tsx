"use client";

import { beverageList } from "@/constants/constant";
import BeveragesItem from "./beverages-item";
import { ScrollArea } from "../ui/scroll-area";

function BeveragesList() {
  return (
    <div className="mx-auto w-full flex flex-col gap-4">
      <p className="text-lg font-medium leading-none text-primary">
        1. Thức uống
      </p>
      <ScrollArea className="h-96 w-full">
        <div>
          {beverageList.map((beverage) => (
            <div key={beverage.id} className="px-2">
              <BeveragesItem {...beverage} />
            </div>
          ))}
        </div>
      </ScrollArea>
      <p className="text-lg font-medium leading-none text-primary">2. Đồ ăn</p>
      <ScrollArea className="h-96 w-full">
        <div>
          {beverageList.map((beverage) => (
            <div key={beverage.id} className="px-2">
              <BeveragesItem {...beverage} />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default BeveragesList;
