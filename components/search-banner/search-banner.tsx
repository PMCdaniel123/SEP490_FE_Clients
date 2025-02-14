import Image from "next/image";
import { Search, ChevronDown } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { useState } from "react";

export default function SearchBanner() {
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [space, setSpace] = useState("");
  const [people, setPeople] = useState("");
  const [selectedTab, setSelectedTab] = useState("Bàn cá nhân");

  return (
    <div className="relative w-full h-[500px]">
      <Image
        src="/banner.png"
        alt="Banner"
        layout="fill"
        objectFit="cover"
        className="brightness-75"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
        <h2 className="text-6xl font-extrabold tracking-wide">WorkHive</h2>

        <div className="flex gap-6 mt-6 text-lg font-medium">
          {["Bàn cá nhân", "Văn phòng", "Phòng họp", "Phòng hội thảo"].map(
            (tab) => (
              <span
                key={tab}
                className={`pb-2 cursor-pointer transition-all duration-100 ease-in-out ${
                  selectedTab === tab
                    ? "border-b-2 border-white text-white"
                    : "text-gray-400"
                }`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </span>
            )
          )}
        </div>

        <div className="mt-8 bg-white text-black rounded-full flex items-center shadow-lg p-2 w-[85%] max-w-5xl">
          <Dropdown
            label="Địa điểm"
            value={location}
            setValue={setLocation}
            placeholder="Hồ Chí Minh"
            hasBorder
          >
            <DropdownItem value="hcm">Hồ Chí Minh</DropdownItem>
            <DropdownItem value="hanoi">Hà Nội</DropdownItem>
            <DropdownItem value="danang">Đà Nẵng</DropdownItem>
          </Dropdown>

          <Dropdown
            label="Thời gian"
            value={time}
            setValue={setTime}
            placeholder="Chọn thời gian"
            hasBorder
          >
            <DropdownItem value="morning">Sáng</DropdownItem>
            <DropdownItem value="afternoon">Chiều</DropdownItem>
            <DropdownItem value="full">Cả ngày</DropdownItem>
          </Dropdown>

          <Dropdown
            label="Loại không gian"
            value={space}
            setValue={setSpace}
            placeholder="Loại không gian"
            hasBorder
          >
            <DropdownItem value="coworking">Coworking Space</DropdownItem>
            <DropdownItem value="private">Văn phòng riêng</DropdownItem>
            <DropdownItem value="meeting">Phòng họp</DropdownItem>
          </Dropdown>

          <Dropdown
            label="Số lượng người"
            value={people}
            setValue={setPeople}
            placeholder="Chọn số người"
            hasBorder={false}
          >
            <DropdownItem value="1-5">1-5 người</DropdownItem>
            <DropdownItem value="6-10">6-10 người</DropdownItem>
            <DropdownItem value="11-20">11-20 người</DropdownItem>
          </Dropdown>

          <button className="bg-gray-800 text-white p-4 rounded-full shadow-md transition-transform transform hover:scale-105 active:scale-95">
            <Search size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}

interface DropdownProps {
  label: string;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  children: React.ReactNode;
  hasBorder: boolean;
}

function Dropdown({
  label,
  value,
  setValue,
  placeholder,
  children,
  hasBorder,
}: DropdownProps) {
  return (
    <div className={`flex-1 p-4 ${hasBorder ? "border-r" : ""}`}>
      <p className="text-xs font-semibold">{label}</p>
      <Select.Root value={value} onValueChange={setValue}>
        <Select.Trigger className="w-full flex justify-between items-center bg-transparent text-sm outline-none p-3 border rounded-lg shadow-sm cursor-pointer focus:ring-2 focus:ring-gray-300">
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <ChevronDown size={16} />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className="bg-white rounded-lg shadow-lg p-2 w-56"
            position="popper"
          >
            <Select.Viewport>{children}</Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

interface DropdownItemProps {
  value: string;
  children: React.ReactNode;
}

function DropdownItem({ value, children }: DropdownItemProps) {
  return (
    <Select.Item
      value={value}
      className="p-2 hover:bg-gray-100 cursor-pointer rounded-md focus:bg-gray-200 focus:outline-none"
    >
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  );
}
