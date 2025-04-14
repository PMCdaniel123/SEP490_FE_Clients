import { Facilities } from "@/types";
import FacilitiesItem from "./facilities-item";
import { useState } from "react";
import { Button } from "@/components/ui/button";

function FacilitiesList({ facilities }: { facilities: Facilities[] }) {
  const [showAll, setShowAll] = useState(false);

  const displayedFacilities = showAll ? facilities : facilities.slice(0, 6);
  const hasMoreFacilities = facilities.length > 6;

  return (
    <div>
      {facilities.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-2 md:max-w-4xl text-fourth font-semibold">
            {displayedFacilities.map((facility, index) => (
              <FacilitiesItem label={facility.facilityName} key={index} />
            ))}
          </div>
          {hasMoreFacilities && (
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

export default FacilitiesList;
