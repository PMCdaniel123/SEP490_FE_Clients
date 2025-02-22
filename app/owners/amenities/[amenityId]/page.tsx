"use client";

import AmenityForm from "@/components/owner-form/AmenityForm";
import { amenityList } from "@/constants/constant";
import { AmenityProps } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function AmenityDetail() {
  const { amenityId } = useParams() as { amenityId: string };
  const [amenityDetail, setAmenityDetail] = useState<AmenityProps | null>(null);

  useEffect(() => {
    if (amenityId) {
      setAmenityDetail(amenityList[Number.parseInt(amenityId) - 1]);
    }
  }, [amenityId]);

  return (
    <div className="p-4 bg-white rounded-xl">
      <AmenityForm initialData={amenityDetail} />
    </div>
  );
}

export default AmenityDetail;
