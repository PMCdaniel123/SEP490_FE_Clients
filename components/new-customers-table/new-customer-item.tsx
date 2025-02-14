import { NewCustomerItemProps } from "@/types";
import { Mail } from "lucide-react";
import Image from "next/image";

function NewCustomerItem({ avatar, name, address }: NewCustomerItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Image
          src={avatar}
          alt=""
          width={50}
          height={50}
          className="border rounded-full"
        />
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-base">{name}</p>
          <p className="text-sm text-gray-600">{address}</p>
        </div>
      </div>
      <div className="p-3 rounded-full bg-gray-200 cursor-pointer text-[#FF8E29]">
        <Mail size={20} />
      </div>
    </div>
  );
}

export default NewCustomerItem;
