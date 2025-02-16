"use client";

import { useParams } from "next/navigation";

function BeverageDetail() {
  const { beverageId } = useParams() as { beverageId: string };
  return (
    <div className="p-4 bg-white rounded-xl">Beverage detail {beverageId}</div>
  );
}

export default BeverageDetail;
