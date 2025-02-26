import WithdrawalTable from "@/components/table/withdrawal-table";
import { withdrawalList } from "@/constants/constant";
import { WithdrawalTableColumns } from "@/constants/table-columns";

function WithdrawalManagement() {
  return (
    <div className="p-4 bg-white rounded-xl">
      <WithdrawalTable columns={WithdrawalTableColumns} data={withdrawalList} />
    </div>
  );
}

export default WithdrawalManagement;
