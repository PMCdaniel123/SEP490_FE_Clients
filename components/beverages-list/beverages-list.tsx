"use client";

import { beverageList } from "@/constants/constant";
import BeveragesItem from "./beverages-item";

function BeveragesList() {
  return (
    <div className="mx-auto w-full flex flex-col gap-4 mt-8">
      <p className="text-base font-semibold leading-none text-black">
        1. Thức uống
      </p>
      <div>
        {beverageList.map(
          (beverage) =>
            beverage.category === "1" && (
              <div key={beverage.id} className="px-2">
                <BeveragesItem {...beverage} />
              </div>
            )
        )}
      </div>
      <p className="text-base font-semibold leading-none text-black">
        2. Đồ ăn
      </p>
      <div>
        {beverageList.map(
          (beverage) =>
            beverage.category === "2" && (
              <div key={beverage.id} className="px-2">
                <BeveragesItem {...beverage} />
              </div>
            )
        )}
      </div>
    </div>
  );
}

export default BeveragesList;
