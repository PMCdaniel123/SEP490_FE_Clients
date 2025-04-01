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
    <Wifi />
  ) : label.toLowerCase().includes("tv") ||
    label.toLowerCase().includes("tivi") ||
    label.toLowerCase().includes("màn hình") ? (
    <TvMinimal />
  ) : label.toLowerCase().includes("máy chiếu") ? (
    <Presentation />
  ) : label.toLowerCase().includes("quầy tự phục vụ") ||
    label.toLowerCase().includes("quầy phục vụ") ? (
    <IceCreamBowl />
  ) : label.toLowerCase().includes("máy lạnh") ||
    label.toLowerCase().includes("máy điều hòa") ? (
    <AirVent />
  ) : label.toLowerCase().includes("quạt") ? (
    <Fan />
  ) : label.toLowerCase().includes("ổ") ? (
    <PlugZap />
  ) : label.toLowerCase().includes("sinh nhật") ? (
    <Cake />
  ) : label.toLowerCase().includes("camera") ||
    label.toLowerCase().includes("máy quay") ? (
    <Cctv />
  ) : label.toLowerCase().includes("thú cưng") ? (
    <Cat />
  ) : label.toLowerCase().includes("game") ||
    label.toLowerCase().includes("trò chơi") ? (
    <Dices />
  ) : label.toLowerCase().includes("máy in") ? (
    <Printer />
  ) : label.toLowerCase().includes("loa") ? (
    <Speaker />
  ) : label.toLowerCase().includes("mic") ? (
    <MicVocal />
  ) : label.toLowerCase().includes("tủ") ? (
    <Container />
  ) : label.toLowerCase().includes("sách") ? (
    <LibraryBig />
  ) : (
    <Archive />
  );

  return (
    <div className="flex items-center mb-2 gap-4">
      {icon}
      <span>{label}</span>
    </div>
  );
}

export default FacilitiesItem;
