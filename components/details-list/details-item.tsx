import { LucideIcon } from "lucide-react";

interface DetailsItemProps {
  icon: LucideIcon;
  label: string;
}

function DetailsItem({ icon: Icon, label }: DetailsItemProps) {
  return (
    <div className="flex flex-col items-center text-center bg-[#EFF0F2] justify-center h-40 rounded-xl text-fourth gap-2">
      <Icon size={44} />
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
}

export default DetailsItem;
