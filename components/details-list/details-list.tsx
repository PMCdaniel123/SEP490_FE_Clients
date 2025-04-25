import { Ruler, Sofa, Users } from "lucide-react";
import DetailsItem from "./details-item";
import { DetailsListProps } from "@/types";

function DetailsList({ roomCapacity, roomSize, roomType }: DetailsListProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-8">
      <DetailsItem icon={Users} label={roomCapacity + " " + " người"} />
      <DetailsItem icon={Ruler} label={roomSize + " " + " m²"} />
      <DetailsItem icon={Sofa} label={roomType} />
    </div>
  );
}

export default DetailsList;
