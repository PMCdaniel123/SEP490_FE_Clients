"use client";

import BeverageForm from "@/components/owner-form/BeverageForm";
import { beverageList } from "@/constants/constant";
import { BeverageProps } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function BeverageDetail() {
  const { beverageId } = useParams() as { beverageId: string };
  const [beverageDetail, setBeverageDetail] = useState<BeverageProps | null>(
    null
  );

  useEffect(() => {
    if (beverageId) {
      setBeverageDetail(beverageList[Number.parseInt(beverageId) - 1]);
    }
  }, [beverageId]);

  return (
    <div className="p-4 bg-white rounded-xl">
      <BeverageForm initialData={beverageDetail} />
    </div>
  );
}

export default BeverageDetail;
