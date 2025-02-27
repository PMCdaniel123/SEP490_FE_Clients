import PromotionTable from "@/components/table/promotion-table";
import { promotionList } from "@/constants/constant";
import { PromotionTableColumns } from "@/constants/table-columns";

function PromotionManagement() {
  return (
    <div className="p-4 bg-white rounded-xl">
      <PromotionTable columns={PromotionTableColumns} data={promotionList} />
    </div>
  );
}

export default PromotionManagement;
