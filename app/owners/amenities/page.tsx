import AmenityTable from "@/components/table/amenity-table";
import { amenityList } from "@/constants/constant";
import { AmenityTableColumns } from "@/constants/table-columns";

function AmenitiesManagement() {
  return (
    <div className="p-4 bg-white rounded-xl">
      <AmenityTable columns={AmenityTableColumns} data={amenityList} />
    </div>
  );
}

export default AmenitiesManagement;
