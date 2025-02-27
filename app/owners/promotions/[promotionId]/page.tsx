"use client";

import PromotionForm from "@/components/owner-form/PromotionForm";
import { promotionList } from "@/constants/constant";
import { PromotionProps } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function PromotionDetail() {
  const { promotionId } = useParams() as { promotionId: string };
  const [promotionDetail, setPromotionDetail] = useState<PromotionProps | null>(
    null
  );

  useEffect(() => {
    if (promotionId) {
      setPromotionDetail(promotionList[Number.parseInt(promotionId) - 1]);
    }
  }, [promotionId]);

  return (
    <div className="p-4 bg-white rounded-xl">
      <PromotionForm initialData={promotionDetail} />
    </div>
  );
}

export default PromotionDetail;
