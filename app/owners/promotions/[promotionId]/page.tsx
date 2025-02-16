"use client";

import { useParams } from "next/navigation";

function PromotionDetail() {
  const { promotionId } = useParams() as { promotionId: string };
  return (
    <div className="p-4 bg-white rounded-xl">
      Promotion detail {promotionId}
    </div>
  );
}

export default PromotionDetail;
