import Image from "next/image";
import { Clock, LucideIcon, MapPin, Search, Sofa, UsersRound, AlertCircle } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchBanner() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [space, setSpace] = useState("");
  const [people, setPeople] = useState("");

  const [locations, setLocations] = useState<string[]>([]);
  const [times] = useState<{ label: string; value: string }[]>([
    { label: "Mở cửa 24h", value: "1" },
    { label: "Linh hoạt", value: "0" },
  ]);
  const [spaces, setSpaces] = useState<string[]>([]);
  const [capacities, setCapacities] = useState<string[]>([]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await fetch("https://localhost:5050/workspaces");
        if (!response.ok) {
          throw new Error("Failed to fetch workspace data.");
        }
        const data: { workspaces: { address: string; category: string; capacity: number }[] } =
          await response.json();

        const uniqueLocations = Array.from(new Set(data.workspaces.map((ws: any) => ws.address)));
        const uniqueSpaces = Array.from(new Set(data.workspaces.map((ws: any) => ws.category)));
        const uniqueCapacities = Array.from(
          new Set(data.workspaces.map((ws: any) => ws.capacity.toString()))
        );

        setLocations(uniqueLocations);
        setSpaces(uniqueSpaces);
        setCapacities(uniqueCapacities);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  const handleSearch = () => {

    const queryParams: Record<string, string> = {};
    if (location) queryParams.Address = location;
    if (space) queryParams.Category = space;
    if (time) queryParams.Is24h = time;
    if (people) queryParams.Capacity = people;

    if (Object.keys(queryParams).length === 0) {
      setErrorMessage("Vui lòng chọn ít nhất một tiêu chí tìm kiếm!");
      return;
    }

    setErrorMessage(null);
    const query = new URLSearchParams(queryParams).toString();

    router.push(`/search/${encodeURIComponent(query)}`);
  };

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

        <div className="mt-8 bg-white text-black rounded-full flex items-center justify-center shadow-lg p-2 w-[72%]">
          <Dropdown
            label="Địa điểm"
            icon={MapPin}
            value={location}
            setValue={setLocation}
            placeholder="Bạn muốn làm việc ở đâu?"
            hasBorder
          >
            {locations.map((loc) => (
              <DropdownItem key={loc} value={loc}>
                {loc}
              </DropdownItem>
            ))}
          </Dropdown>

          <Dropdown
            label="Thời gian"
            icon={Clock}
            value={time}
            setValue={setTime}
            placeholder="Chọn thời gian"
            hasBorder
          >
            {times.map((t) => (
              <DropdownItem key={t.value} value={t.value}>
                {t.label}
              </DropdownItem>
            ))}
          </Dropdown>

          <Dropdown
            label="Loại không gian"
            icon={Sofa}
            value={space}
            setValue={setSpace}
            placeholder="Chọn loại không gian"
            hasBorder
          >
            {spaces.map((sp) => (
              <DropdownItem key={sp} value={sp}>
                {sp}
              </DropdownItem>
            ))}
          </Dropdown>

          <Dropdown
            label="Sức chứa"
            icon={UsersRound}
            value={people}
            setValue={setPeople}
            placeholder="Chọn sức chứa"
            hasBorder
          >
            {capacities.map((cap) => (
              <DropdownItem key={cap} value={cap}>
                {cap}
              </DropdownItem>
            ))}
          </Dropdown>

          <div
            onClick={handleSearch}
            className="ml-2 bg-gray-800 text-white p-4 rounded-full shadow-md transition-transform transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Search size={22} />
          </div>
        </div>


        {errorMessage && (
          <div className="mt-4 bg-red-100 text-red-700 p-4 rounded-lg flex items-center gap-2 shadow-md">
            <AlertCircle size={20} />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface DropdownProps {
  label: string;
  icon: LucideIcon;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  children: React.ReactNode;
  hasBorder: boolean;
}

function Dropdown({
  label,
  icon: Icon,
  value,
  setValue,
  placeholder,
  children,
  hasBorder,
}: DropdownProps) {
  return (
    <div className={`flex-1 p-4 ${hasBorder ? "border-r" : ""}`}>
      <p className="text-sm font-semibold mb-2 items-center justify-start flex px-2 gap-2">
        <Icon size={20} />
        <span>{label}</span>
      </p>
      <Select.Root value={value} onValueChange={setValue}>
        <Select.Trigger
          className={`w-full flex justify-between items-center bg-transparent text-sm outline-none p-2 cursor-pointer font-semibold ${value ? "text-black" : "text-sixth"
            }`}
        >
          <Select.Value placeholder={placeholder} />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className="bg-white rounded-xl shadow-xl p-2 z-50 overflow-hidden border border-black"
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