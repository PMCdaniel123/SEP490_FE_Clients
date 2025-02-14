import { LabelIconProps } from "@/types";

function AmenitiesItem({ icon: Icon, label }: LabelIconProps) {
  return (
    <div className="flex items-center gap-4 mb-2">
      <Icon size={24} />
      <span>{label}</span>
    </div>
  );
}

export default AmenitiesItem;
