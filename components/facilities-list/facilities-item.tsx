import {
  AirVent,
  Archive,
  Cake,
  Cat,
  Cctv,
  Container,
  Dices,
  Fan,
  IceCreamBowl,
  LibraryBig,
  MicVocal,
  PlugZap,
  Presentation,
  Printer,
  Speaker,
  TvMinimal,
  Wifi,
} from "lucide-react";

interface FacilitiesItemProps {
  label: string;
}

function FacilitiesItem({ label }: FacilitiesItemProps) {
  const icon = label.toLowerCase().includes("wifi") ? (
    <Wifi size={18} />
  ) : label.toLowerCase().includes("tv") ||
    label.toLowerCase().includes("tivi") ||
    label.toLowerCase().includes("màn hình") ? (
    <TvMinimal size={18} />
  ) : label.toLowerCase().includes("máy chiếu") ? (
    <Presentation size={18} />
  ) : label.toLowerCase().includes("quầy tự phục vụ") ||
    label.toLowerCase().includes("quầy phục vụ") ? (
    <IceCreamBowl size={18} />
  ) : label.toLowerCase().includes("máy lạnh") ||
    label.toLowerCase().includes("máy điều hòa") ? (
    <AirVent size={18} />
  ) : label.toLowerCase().includes("quạt") ? (
    <Fan size={18} />
  ) : label.toLowerCase().includes("ổ") ? (
    <PlugZap size={18} />
  ) : label.toLowerCase().includes("sinh nhật") ? (
    <Cake size={18} />
  ) : label.toLowerCase().includes("camera") ||
    label.toLowerCase().includes("máy quay") ? (
    <Cctv size={18} />
  ) : label.toLowerCase().includes("thú cưng") ? (
    <Cat size={18} />
  ) : label.toLowerCase().includes("game") ||
    label.toLowerCase().includes("trò chơi") ? (
    <Dices size={18} />
  ) : label.toLowerCase().includes("máy in") ? (
    <Printer size={18} />
  ) : label.toLowerCase().includes("loa") ? (
    <Speaker size={18} />
  ) : label.toLowerCase().includes("mic") ? (
    <MicVocal size={18} />
  ) : label.toLowerCase().includes("tủ") ? (
    <Container size={18} />
  ) : label.toLowerCase().includes("sách") ? (
    <LibraryBig size={18} />
  ) : (
    <Archive size={18} />
  );

  return (
    <div className="flex items-center mb-2 gap-4">
      {icon}
      <span className="text-sm md:text-base">{label}</span>
    </div>
  );
}

export default FacilitiesItem;
