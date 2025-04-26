import { LabelIconProps } from "@/types";

function DetailsItem({ icon: Icon, label }: LabelIconProps) {
  return (
    <div className="flex flex-col items-center text-center bg-[#EFF0F2] justify-center h-28 rounded-lg text-fourth gap-2">
      <Icon size={30} />
      <span className="text-base font-semibold">{label}</span>
    </div>
  );
}

export default DetailsItem;
