import FacilitiesItem from "./facilities-item";

function FacilitiesList() {
  return (
    <div className="grid grid-cols-2 gap-2 md:max-w-4xl text-fourth font-semibold">
      <FacilitiesItem index={1} label={"Quầy tự phục vụ"} />
      <FacilitiesItem index={2} label={"Tivi 65 inch"} />
      <FacilitiesItem index={3} label={"Máy lạnh"} />
      <FacilitiesItem index={4} label={"Wifi tốc độ cao"} />
      <FacilitiesItem index={5} label={"Ổ điện"} />
      <FacilitiesItem index={6} label={"Không hút thuốc"} />
    </div>
  );
}

export default FacilitiesList;
