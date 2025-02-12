import { GlassWater, MapPin, Sofa, Users } from "lucide-react";
import DetailsItem from "./details-item";

type DetailsListProps = {
  roomCapacity: number;
  roomSize: number;
  roomType: string;
};

function DetailsList({
  roomCapacity,
  roomSize,
  roomType,
}: DetailsListProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
      <DetailsItem icon={Users} label={roomCapacity + ""} />
      <DetailsItem icon={MapPin} label={roomSize + ""} />
      <DetailsItem icon={Sofa} label={roomType} />
      <DetailsItem icon={GlassWater} label={"Miễn phí trà đá"} />
    </div>
  );
}

export default DetailsList;
