"use client";

import { beverageList } from "@/constants/constant";
import BeveragesItem from "./beverages-item";

function BeveragesList() {
  return (
    <div className="mx-auto w-full flex flex-col gap-4 mt-8">
      <p className="text-base font-medium leading-none text-primary">
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
      <p className="text-base font-medium leading-none text-primary">
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
