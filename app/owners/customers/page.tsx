import CustomerTable from "@/components/table/customer-table";
import { customerList } from "@/constants/constant";
import { CustomerTableColumns } from "@/constants/table-columns";

function CustomerManagement() {
  return (
    <div className="p-4 bg-white rounded-xl">
      <CustomerTable columns={CustomerTableColumns} data={customerList} />
    </div>
  );
}

export default CustomerManagement;
