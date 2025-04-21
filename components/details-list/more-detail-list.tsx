"use client";

import { Details } from "@/types";
import { useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp, Info } from "lucide-react";

function MoreDetailList({ details }: { details: Details[] }) {
  const [showAll, setShowAll] = useState(false);

  const displayedDetails = showAll ? details : details.slice(0, 6);
  const hasMoreDetails = details.length > 6;

  return (
    <div className="space-y-4">
      {details.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {displayedDetails.map((detail) => (
              <div
                key={detail.id}
                className="rounded-lg p-4 bg-gradient-to-br from-secondary to-secondary/90 hover:shadow-md transition-all duration-300 border border-secondary/20 flex items-center gap-2"
              >
                <div className="bg-white/10 p-1.5 rounded-full">
                  <Info size={14} className="text-white/80" />
                </div>
                <p className="text-sm font-medium text-white">
                  {detail.detailName}
                </p>
              </div>
            ))}
          </div>

          {hasMoreDetails && (
            <div className="flex justify-center mt-2">
              <Button
                onClick={() => setShowAll(!showAll)}
                variant="outline"
                size="sm"
                className="rounded-full px-4 py-1 h-auto bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200 text-primary font-medium flex items-center gap-1.5 transition-all duration-300 hover:shadow-md"
              >
                {showAll ? (
                  <>
                    <ChevronUp size={16} />
                    <span>Thu gọn</span>
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} />
                    <span>Xem thêm {details.length - 6} chi tiết</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p className="text-sm text-gray-500 italic flex items-center gap-2">
            <Info size={16} className="opacity-70" />
            Không có thông tin chi tiết
          </p>
        </div>
      )}
    </div>
  );
}

export default MoreDetailList;
