import {
  CigaretteOff,
  Thermometer,
  Tv,
  UtensilsCrossed,
  Wifi,
  Zap,
} from "lucide-react";
import AmenitiesItem from "./amenities-item";

function AmenitiesList() {
  return (
    <div className="grid grid-cols-2 gap-4 md:max-w-4xl text-fourth font-semibold">
      <AmenitiesItem icon={UtensilsCrossed} label={"Quầy tự phục vụ"} />
      <AmenitiesItem icon={Tv} label={"Tivi 65 inch"} />
      <AmenitiesItem icon={Thermometer} label={"Máy lạnh"} />
      <AmenitiesItem icon={Wifi} label={"Wifi tốc độ cao"} />
      <AmenitiesItem icon={Zap} label={"Ổ điện"} />
      <AmenitiesItem icon={CigaretteOff} label={"Không hút thuốc"} />
    </div>
  );
}

export default AmenitiesList;
