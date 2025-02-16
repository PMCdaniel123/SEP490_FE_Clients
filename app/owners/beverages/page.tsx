import BeverageTable from "@/components/table/beverage-table";
import { beverageList } from "@/constants/constant";
import { BeverageTableColumns } from "@/constants/table-columns";

function BeverageManagement() {
  return (
    <div className="p-4 bg-white rounded-xl">
      <BeverageTable columns={BeverageTableColumns} data={beverageList} />
    </div>
  );
}

export default BeverageManagement;
