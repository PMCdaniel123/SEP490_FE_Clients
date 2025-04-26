"use client";

import { Details } from "@/types";
import { useState } from "react";
import { Button } from "../ui/button";
import { Info, Plus, Minus, MapPin } from "lucide-react";

function MoreDetailList({ details }: { details: Details[] }) {
  const [showAll, setShowAll] = useState(false);

  const displayedDetails = showAll ? details : details.slice(0, 4);
  const hasMoreDetails = details.length > 4;

  return (
    <div className="space-y-6">
      {details.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedDetails.map((detail) => (
              <div
                key={detail.id}
                className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex-shrink-0 bg-primary/10 text-primary rounded-full w-10 h-10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <MapPin size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium leading-relaxed">
                    {detail.detailName}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {hasMoreDetails && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={() => setShowAll(!showAll)}
                variant="outline"
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-primary border border-primary/30 rounded-full hover:bg-primary/5 transition-all"
              >
                {showAll ? (
                  <>
                    <Minus size={18} />
                    Thu gọn
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Xem thêm {details.length - 4} chi tiết
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 border border-dashed border-gray-300 rounded-2xl">
          <div className="bg-gray-100 p-4 rounded-full mb-3">
            <Info size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">
            Chưa có thông tin vị trí chỗ ngồi
          </p>
        </div>
      )}
    </div>
  );
}

export default MoreDetailList;
