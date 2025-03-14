"use client";

import BeveragesItem from "./beverages-item";
import Loader from "../loader/Loader";
import { useEffect, useState } from "react";
import { BeverageProps } from "@/types";
import { toast } from "react-toastify";

function BeveragesList({ ownerId }: { ownerId: string }) {
  const [loading, setLoading] = useState(false);
  const [beverageList, setBeverageList] = useState<BeverageProps[]>([]);

  useEffect(() => {
    if (!ownerId) return;
    setLoading(true);

    const fetchBeverageList = async () => {
      try {
        const response = await fetch(
          `https://localhost:5050/beverages/Owner/${ownerId}`
        );

        if (!response.ok) {
          throw new Error("Có lỗi xảy ra khi tải thực đơn.");
        }

        const data = await response.json();
        setBeverageList(Array.isArray(data.beverages) ? data.beverages : []);
        setLoading(false);
      } catch {
        toast.error("Có lỗi xảy ra khi tải thực đơn.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          theme: "light",
        });
        setBeverageList([]);
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
      {beverageList.length > 0 ? (
        <div>
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
      {beverageList.length > 0 ? (
        <div>
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
