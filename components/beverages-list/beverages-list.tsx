"use client";

import BeveragesItem from "./beverages-item";
import Loader from "../loader/Loader";
import { useEffect, useState } from "react";
import { BeverageProps } from "@/types";
import { toast } from "react-toastify";
import { BASE_URL } from "@/constants/environments";

function BeveragesList({ ownerId }: { ownerId: string }) {
  const [loading, setLoading] = useState(false);
  const [beverageList, setBeverageList] = useState<BeverageProps[]>([]);
  const [drinkList, setDrinkList] = useState<BeverageProps[]>([]);
  const [foodList, setFoodList] = useState<BeverageProps[]>([]);

  useEffect(() => {
    if (!ownerId) return;
    setLoading(true);

    const fetchBeverageList = async () => {
      try {
        const response = await fetch(`${BASE_URL}/beverages/Owner/${ownerId}`);

        if (!response.ok) {
          throw new Error("Có lỗi xảy ra khi tải thực đơn.");
        }

        const data = await response.json();
        setBeverageList(Array.isArray(data.beverages) ? data.beverages : []);
        setDrinkList(
          Array.isArray(data.beverages)
            ? data.beverages.filter(
                (item: BeverageProps) => item.category === "Thức uống"
              )
            : []
        );
        setFoodList(
          Array.isArray(data.beverages)
            ? data.beverages.filter(
                (item: BeverageProps) => item.category === "Đồ ăn"
              )
            : []
        );
        setLoading(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Đã xảy ra lỗi!";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          theme: "light",
        });
        setBeverageList([]);
        setDrinkList([]);
        setFoodList([]);
        setLoading(false);
      }
    };

    fetchBeverageList();
  }, [ownerId]);

  if (loading) {
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full flex flex-col gap-4 mt-8">
      <p className="text-base font-semibold leading-none text-black">
        1. Thức uống
      </p>
      {beverageList.length > 0 && drinkList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2">
          {beverageList.map(
            (beverage) =>
              beverage.category === "Thức uống" && (
                <div key={beverage.id} className="px-2">
                  <BeveragesItem {...beverage} />
                </div>
              )
          )}
        </div>
      ) : (
        <p className="text-sm text-sixth italic flex items-center">Trống</p>
      )}
      <p className="text-base font-semibold leading-none text-black">
        2. Đồ ăn
      </p>
      {beverageList.length > 0 && foodList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2">
          {beverageList.map(
            (beverage) =>
              beverage.category === "Đồ ăn" && (
                <div key={beverage.id} className="px-2">
                  <BeveragesItem {...beverage} />
                </div>
              )
          )}
        </div>
      ) : (
        <p className="text-sm text-sixth italic flex items-center">Trống</p>
      )}
    </div>
  );
}

export default BeveragesList;
