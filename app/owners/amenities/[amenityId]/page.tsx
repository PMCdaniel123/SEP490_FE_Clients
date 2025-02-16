"use client";

import { useParams } from "next/navigation";

function AmenityDetail() {
  const { amenityId } = useParams() as { amenityId: string };
  return (
    <div className="p-4 bg-white rounded-xl">
      Amenity detail {amenityId}
    </div>
  );
}

export default AmenityDetail;
