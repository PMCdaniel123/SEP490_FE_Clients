import { Facilities } from "@/types";
import FacilitiesItem from "./facilities-item";

function FacilitiesList({ facilities }: { facilities: Facilities[] }) {
  return (
    <div>
      {facilities.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 md:max-w-4xl text-fourth font-semibold">
          {facilities.map((facility, index) => (
            <FacilitiesItem
              label={facility.facilityName}
              key={index}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-sixth italic flex items-center">Trống</p>
      )}
    </div>
  );
}

export default FacilitiesList;
