import Image from "next/image";
import {
  Clock,
  LucideIcon,
  MapPin,
  Search,
  Sofa,
  UsersRound,
  ChevronDown,
} from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/constants/environments";
import { searchAddress, workspaceCategory } from "@/constants/constant";
import AnimatedBorderTrail from "../animate-ui/trail-border";

export default function SearchBanner() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [space, setSpace] = useState("");
  const [people, setPeople] = useState("");

  const [locations, setLocations] = useState<string[]>([]);
  const [times] = useState<{ label: string; value: string }[]>([
    { label: "Thời gian linh hoạt (24h)", value: "1" },
    { label: "Thời gian cố định", value: "0" },
  ]);
  const [spaces, setSpaces] = useState<string[]>([]);
  const [capacities, setCapacities] = useState<string[]>([]);

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/workspaces`);
        if (!response.ok) {
          throw new Error("Có lỗi khi tải danh sách không gian.");
        }
        const data: {
          workspaces: { address: string; category: string; capacity: number }[];
        } = await response.json();

        type Workspace = {
          address: string;
          category: string;
          capacity: number;
        };

        const uniqueCapacities = Array.from(
          new Set(
            data.workspaces.map((ws: Workspace) => ws.capacity.toString())
          )
        ).sort((a, b) => Number(a) - Number(b));

        setLocations(searchAddress);
        setSpaces(workspaceCategory);
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
      router.push(`/search/Address`);
      return;
    }

    const query = new URLSearchParams(queryParams).toString();
    router.push(`/search/${encodeURIComponent(query)}`);
  };

  return (
    <div className="relative w-full h-[600px] md:h-[500px]">
      <Image
        src="/banner.png"
        alt="Banner"
        layout="fill"
        objectFit="cover"
        className="brightness-50"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-wide mb-2 text-shadow">
          WorkHive
        </h2>
        <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl">
          Tìm không gian làm việc phù hợp với nhu cầu của bạn
        </p>

        <div className="w-full md:w-[90%] lg:w-[80%] xl:w-[70%] mx-auto flex items-center justify-center mt-4 md:mt-8">
          <AnimatedBorderTrail trailSize="sm" trailColor="#D0BEA0">
            <div
              className={`bg-white/95 backdrop-blur-sm text-black rounded-xl flex ${
                isSmallScreen ? "flex-col" : "flex-row"
              } items-center justify-center w-full shadow-xl p-3 transition-all duration-300 ease-in-out`}
            >
              <Dropdown
                label="Địa điểm"
                icon={MapPin}
                value={location}
                setValue={setLocation}
                placeholder="Bạn muốn làm việc ở đâu?"
                hasBorder={!isSmallScreen}
                isSmallScreen={isSmallScreen}
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
                hasBorder={!isSmallScreen}
                isSmallScreen={isSmallScreen}
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
                hasBorder={!isSmallScreen}
                isSmallScreen={isSmallScreen}
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
                hasBorder={false}
                isSmallScreen={isSmallScreen}
              >
                {capacities.map((cap) => (
                  <DropdownItem key={cap} value={cap}>
                    {cap} người
                  </DropdownItem>
                ))}
              </Dropdown>

              <button
                onClick={handleSearch}
                className={`${
                  isSmallScreen ? "w-full mt-3" : "ml-3"
                } bg-primary hover:bg-primary/80 text-white p-3 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2`}
              >
                <Search size={22} />
                <span className={isSmallScreen ? "inline" : "hidden md:inline"}>
                  Tìm kiếm
                </span>
              </button>
            </div>
          </AnimatedBorderTrail>
        </div>
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
  isSmallScreen: boolean;
}

function Dropdown({
  label,
  icon: Icon,
  value,
  setValue,
  placeholder,
  children,
  hasBorder,
  isSmallScreen,
}: DropdownProps) {
  return (
    <div
      className={`${isSmallScreen ? "w-full" : "flex-1"} p-2 md:p-3 ${
        !isSmallScreen && hasBorder ? "border-r border-gray-200" : ""
      } ${
        isSmallScreen ? "border-b border-gray-200 last:border-b-0 pb-3" : ""
      }`}
    >
      <p className="text-xs md:text-sm font-semibold mb-1 md:mb-2 items-center justify-start flex px-2 gap-1 md:gap-2 text-gray-700">
        <Icon size={isSmallScreen ? 16 : 18} className="text-primary" />
        <span>{label}</span>
      </p>
      <Select.Root value={value} onValueChange={setValue}>
        <Select.Trigger
          className={`w-full flex justify-between items-center bg-transparent text-xs md:text-sm outline-none p-1 md:p-2 cursor-pointer font-medium rounded-md hover:bg-gray-50 transition-colors ${
            value ? "text-black" : "text-gray-500"
          }`}
        >
          <Select.Value placeholder={placeholder} />
          <ChevronDown size={16} className="ml-2 text-gray-400" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className="bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden max-h-[250px] overflow-y-auto w-[var(--radix-select-trigger-width)] min-w-[180px]"
            position="popper"
            sideOffset={5}
          >
            <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
              <ChevronDown className="rotate-180" size={16} />
            </Select.ScrollUpButton>
            <Select.Viewport className="p-1">{children}</Select.Viewport>
            <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
              <ChevronDown size={16} />
            </Select.ScrollDownButton>
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
      className="p-2.5 hover:bg-gray-50 cursor-pointer rounded-md focus:bg-gray-100 focus:outline-none text-sm flex items-center transition-colors data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary data-[selected]:bg-primary/20 data-[selected]:text-primary"
    >
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  );
}
