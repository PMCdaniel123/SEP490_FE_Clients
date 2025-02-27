import { MapPin, Sofa, Users } from "lucide-react";
import DetailsItem from "./details-item";
import { DetailsListProps } from "@/types";

function DetailsList({ roomCapacity, roomSize, roomType }: DetailsListProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
      <DetailsItem icon={Users} label={roomCapacity + ""} />
      <DetailsItem icon={MapPin} label={roomSize + ""} />
      <DetailsItem icon={Sofa} label={roomType} />
    </div>
  );
}

export default DetailsList;
