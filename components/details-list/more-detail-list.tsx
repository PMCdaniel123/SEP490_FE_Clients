"use client";

import { Details } from "@/types";
import { useState } from "react";
import { Button } from "../ui/button";
import { Info, Plus, Minus } from "lucide-react";

function MoreDetailList({ details }: { details: Details[] }) {
  const [showAll, setShowAll] = useState(false);

  const displayedDetails = showAll ? details : details.slice(0, 6);
  const hasMoreDetails = details.length > 6;

  return (
    <div className="space-y-6">
      {details.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {displayedDetails.map((detail) => (
              <div
                key={detail.id}
                className="flex items-center gap-4 p-4 rounded-2xl border border-gray-200 bg-white hover:shadow-md transition-all duration-300 hover:-translate-y-[2px]"
              >
                <div className="flex items-center justify-center bg-primary/10 text-primary rounded-full w-10 h-10">
                  <Info size={20} />
                </div>
                <p className="text-sm font-medium text-gray-800">
                  {detail.detailName}
                </p>
              </div>
            ))}
          </div>

          {hasMoreDetails && (
            <div className="flex justify-center">
              <Button
                onClick={() => setShowAll(!showAll)}
                variant="outline"
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-full hover:bg-gray-50 transition-all"
              >
                {showAll ? (
                  <>
                    <Minus size={18} />
                    Thu gọn
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Xem thêm {details.length - 6} chi tiết
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 bg-gray-50 border border-dashed border-gray-300 rounded-2xl">
          <div className="bg-gray-100 p-3 rounded-full mb-3">
            <Info size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium text-sm">
            Không có thông tin vị trí chỗ ngồi
          </p>
        </div>
      )}
    </div>
  );
}

export default MoreDetailList;
