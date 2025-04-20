"use client";

import { Details } from "@/types";
import { useState } from "react";
import { Button } from "../ui/button";

function MoreDetailList({ details }: { details: Details[] }) {
  const [showAll, setShowAll] = useState(false);

  const displayedDetails = showAll ? details : details.slice(0, 6);
  const hasMoreDetails = details.length > 6;
  return (
    <div>
      {details.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-2 md:max-w-4xl text-fourth font-semibold">
            {displayedDetails.map((detail) => (
              <div
                key={detail.id}
                className="rounded-lg p-4 bg-secondary"
              >
                <p className="text-sm font-semibold text-white">
                  {detail.detailName}
                </p>
              </div>
            ))}
          </div>
          {hasMoreDetails && (
            <Button
              onClick={() => setShowAll(!showAll)}
              className="mt-4 bg-white text-primary hover:bg-gray-50 border border-primary"
            >
              {showAll ? "Thu gọn" : "Xem thêm"}
            </Button>
          )}
        </>
      ) : (
        <p className="text-sm text-sixth italic flex items-center">Trống</p>
      )}
    </div>
  );
}

export default MoreDetailList;
