import { LucideIcon } from "lucide-react";

interface AmenitiesItemProps {
  icon: LucideIcon;
  label: string;
}

function AmenitiesItem({ icon: Icon, label }: AmenitiesItemProps) {
  return (
    <div className="flex items-center gap-4 mb-2">
      <Icon size={24} />
      <span>{label}</span>
    </div>
  );
}

export default AmenitiesItem;
