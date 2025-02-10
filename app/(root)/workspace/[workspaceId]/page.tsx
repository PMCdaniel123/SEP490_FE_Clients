"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Bed,
  MapPin,
  Thermometer,
  Wifi,
  Tv,
  Heart,
  Share2,
  UtensilsCrossed,
  CigaretteOff,
  Zap,
  ShieldEllipsis,
  Star,
  Clock,
  ChevronDown,
  Phone,
} from "lucide-react";
import Loader from "@/components/loader/Loader";
import Image from "next/image";
import { useParams } from "next/navigation";
import HighRatingSpace from "@/components/high-rating-space/high-rating-space";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Workspace {
  id: string;
  title: string;
  address: string;
  price: string;
  image: string;
  roomCapacity: number;
  roomType: string;
  roomSize: number;
  description: string;
}

const WorkspaceDetail = () => {
  const { workspaceId } = useParams() as { workspaceId: string };
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
    meridiem: "AM",
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const toggleTimePicker = () => setIsTimePickerOpen(!isTimePickerOpen);
  const toggleDatePicker = () => setIsDatePickerOpen(!isDatePickerOpen);

  const nvhEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d348.9642206394354!2d106.79814839250291!3d10.87513123723215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d8a6b19d6763%3A0x143c54525028b2e!2sNh%C3%A0%20V%C4%83n%20h%C3%B3a%20Sinh%20vi%C3%AAn%20TP.HCM!5e0!3m2!1sen!2sau!4v1697048597389!5m2!1sen!2sau";

  useEffect(() => {
    if (!workspaceId) return;

    fetch(
      `https://67271c49302d03037e6f6a3b.mockapi.io/spaceList/${workspaceId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setWorkspace(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [workspaceId]);

  useEffect(() => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const meridiem = hours >= 12 ? "PM" : "AM";

    if (hours > 12) {
      hours -= 12;
    }
    if (hours === 0) {
      hours = 12;
    }

    setTime({
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
      meridiem,
    });
  }, []);

  const handleInputChange = (field: string, value: string) => {
    if (
      ["hours", "minutes", "seconds"].includes(field) &&
      !/^\d*$/.test(value)
    ) {
      return;
    }

    setTime((prevTime) => ({
      ...prevTime,
      [field]: value.padStart(2, "0"),
    }));
  };

  if (loading) {
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  if (!workspace) {
    return <div className="text-center">Workspace not found</div>;
  }

  return (
    <div className="flex flex-col container mx-auto px-10 py-8 gap-20">
      <div className="w-full">
        <div className="relative w-full h-96">
          <img
            src={workspace.image}
            alt={workspace.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="relative w-full h-48">
              <img
                src={workspace.image}
                alt={`Coworking Space ${i + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-primary">
                {workspace.title}
              </h1>
              <p className="text-fifth max-w-xl">{workspace.address}</p>
            </div>
            <div className="flex items-center justify-center gap-8 text-primary">
              <Heart size={32} />
              <Share2 size={32} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
            <div className="flex flex-col items-center text-center bg-[#EFF0F2] justify-center h-40 rounded-xl text-fourth gap-2">
              <Users size={44} />
              <span className="text-sm font-semibold">
                Bàn {workspace.roomCapacity} người
              </span>
            </div>
            <div className="flex flex-col items-center text-center bg-[#EFF0F2] justify-center h-40 rounded-xl text-fourth gap-2">
              <MapPin size={44} />
              <span className="text-sm font-semibold">
                {workspace.roomSize}
              </span>
            </div>
            <div className="flex flex-col items-center text-center bg-[#EFF0F2] justify-center h-40 rounded-xl text-fourth gap-2">
              <Bed size={44} />
              <span className="text-sm font-semibold">
                {workspace.roomType}
              </span>
            </div>
            <div className="flex flex-col items-center text-center bg-[#EFF0F2] justify-center h-40 rounded-xl text-fourth gap-2">
              <Thermometer size={44} />
              <span className="text-sm font-semibold">Miễn phí trà đá</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary mb-6">
              Mô tả chi tiết
            </h2>
            <p className="text-fifth">
              Tạo không gian làm việc riêng biệt với Dedicated Desk – chỗ ngồi
              cố định dành riêng cho bạn hoặc nhóm nhỏ trong không gian
              coworking chuyên nghiệp. Với Dedicated Desk, bạn sẽ có một môi
              trường làm việc yên tĩnh, riêng tư và đầy đủ tiện nghi, giúp bạn
              tập trung hoàn toàn vào công việc của mình.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-primary">Tiện ích</h2>
            <div className="grid grid-cols-2 space-y-2 gap-4 md:max-w-3xl text-fourth font-semibold">
              <div className="flex items-center space-x-4">
                <UtensilsCrossed size={24} />
                <span>Quầy tự phục vụ</span>
              </div>
              <div className="flex items-center space-x-4">
                <Tv size={24} />
                <span>Tivi 65 inch</span>
              </div>
              <div className="flex items-center space-x-4">
                <Thermometer size={24} />
                <span>Máy lạnh</span>
              </div>
              <div className="flex items-center space-x-4">
                <Wifi size={24} />
                <span>Wifi tốc độ cao</span>
              </div>
              <div className="flex items-center space-x-4">
                <Zap size={24} />
                <span>Ổ điện</span>
              </div>
              <div className="flex items-center space-x-4">
                <CigaretteOff size={24} />
                <span>Không hút thuốc</span>
              </div>
            </div>
            <button className="text-fourth border border-1 border-primary rounded-xl py-4 font-semibold md:max-w-[250px] hover:bg-primary hover:text-white transition-colors duration-300">
              Hiển thị Menu dịch vụ
            </button>
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary mb-6">
              Quy định chung
            </h2>
            <div className="grid grid-cols-2 space-y-2 gap-4 md:max-w-3xl text-fourth font-semibold items-center">
              <div className="flex items-center gap-4">
                <ShieldEllipsis size={28} />
                <span>Không mang đồ ăn thức uống từ bên ngoài vào</span>
              </div>
              <div className="flex items-center gap-4">
                <ShieldEllipsis size={24} />
                <span>Không mang theo động vật</span>
              </div>
              <div className="flex items-center gap-4">
                <ShieldEllipsis size={24} />
                <span>Không gây ồn ào xung quanh</span>
              </div>
              <div className="flex items-center gap-4">
                <ShieldEllipsis size={24} />
                <span>Không khói thuốc</span>
              </div>
            </div>
          </div>

          <div>
            <iframe
              src={nvhEmbedUrl}
              width="100%"
              height="400px"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg shadow-lg"
            ></iframe>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-primary">
              Các không gian tương tự
            </h2>
            <div>
              <HighRatingSpace />
            </div>
            <button className="text-fourth border border-1 border-primary rounded-xl py-4 font-semibold md:max-w-[250px] hover:bg-primary hover:text-white transition-colors duration-300">
              Hiển thị trên bản đồ
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-primary">
              Đánh giá từ khách hàng
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <Image
                    alt="avatar"
                    src="/logo.png"
                    width={64}
                    height={64}
                    className="rounded-full border"
                  />
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-fourth text-base">
                      Nguyễn Văn A
                    </p>
                    <p className="text-fifth text-sm">14/02/2025</p>
                    <div className="flex items-center justify-start gap-1">
                      <Star size={16} />
                      <Star size={16} />
                      <Star size={16} />
                      <Star size={16} />
                      <Star size={16} />
                    </div>
                  </div>
                </div>
                <p className="text-fifth">
                  Không gian làm việc rất chuyên nghiệp và yên tĩnh, phù hợp để
                  tập trung hoàn toàn vào công việc
                </p>
              </div>

              <div className="flex flex-col gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <Image
                    alt="avatar"
                    src="/logo.png"
                    width={64}
                    height={64}
                    className="rounded-full border"
                  />
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-fourth text-base">
                      Nguyễn Văn A
                    </p>
                    <p className="text-fifth text-sm">14/02/2025</p>
                    <div className="flex items-center justify-start gap-1">
                      <Star size={16} />
                      <Star size={16} />
                      <Star size={16} />
                      <Star size={16} />
                      <Star size={16} />
                    </div>
                  </div>
                </div>
                <p className="text-fifth">
                  Không gian làm việc rất chuyên nghiệp và yên tĩnh, phù hợp để
                  tập trung hoàn toàn vào công việc
                </p>
              </div>

              <div className="flex flex-col gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <Image
                    alt="avatar"
                    src="/logo.png"
                    width={64}
                    height={64}
                    className="rounded-full border"
                  />
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-fourth text-base">
                      Nguyễn Văn A
                    </p>
                    <p className="text-fifth text-sm">14/02/2025</p>
                    <div className="flex items-center justify-start gap-1">
                      <Star size={16} />
                      <Star size={16} />
                      <Star size={16} />
                      <Star size={16} />
                      <Star size={16} />
                    </div>
                  </div>
                </div>
                <p className="text-fifth">
                  Không gian làm việc rất chuyên nghiệp và yên tĩnh, phù hợp để
                  tập trung hoàn toàn vào công việc
                </p>
              </div>

              <div className="flex flex-col gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <Image
                    alt="avatar"
                    src="/logo.png"
                    width={64}
                    height={64}
                    className="rounded-full border"
                  />
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-fourth text-base">
                      Nguyễn Văn A
                    </p>
                    <p className="text-fifth text-sm">14/02/2025</p>
                    <div className="flex items-center justify-start gap-1">
                      <Star size={16} />
                      <Star size={16} />
                      <Star size={16} />
                      <Star size={16} />
                      <Star size={16} />
                    </div>
                  </div>
                </div>
                <p className="text-fifth">
                  Không gian làm việc rất chuyên nghiệp và yên tĩnh, phù hợp để
                  tập trung hoàn toàn vào công việc
                </p>
              </div>
            </div>
            <button className="text-fourth border border-1 border-primary rounded-xl py-4 font-semibold md:max-w-[250px] hover:bg-primary hover:text-white transition-colors duration-300">
              Hiển thị thêm đánh giá
            </button>
          </div>
        </div>

        <div className="p-8 rounded-xl shadow-2xl border flex flex-col">
          <div>
            <h2 className="text-2xl font-bold text-fourth">$1 - $20</h2>
            <Separator className="my-8" />
            <p className="text-fifth">
              Thuê theo giờ: $1 <br />
              Thuê dài hạn: $20
            </p>
            <Separator className="my-8" />
            <div className="mt-8">
              <p className="font-semibold text-fourth mb-2 text-sm">
                Chủ Nhật 16 tháng 7 năm 2023 lúc 5:00 chiều
              </p>
              <p className="text-sm text-fifth mb-6">
                Thời lượng 1 giờ, kết thúc lúc 6:00 chiều
              </p>

              <div className="mb-4">
                <div
                  className="flex items-center justify-between px-4 py-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={toggleTimePicker}
                >
                  <span className="text-fourth">Chọn thời gian</span>
                  <ChevronDown
                    className={`transition-transform ${
                      isTimePickerOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {isTimePickerOpen && (
                  <div className="mt-2 border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <input
                        type="text"
                        value={time.hours}
                        className="w-10 text-center border rounded-lg p-1"
                        onChange={(e) =>
                          handleInputChange("hours", e.target.value)
                        }
                      />
                      :
                      <input
                        type="text"
                        value={time.minutes}
                        className="w-10 text-center border rounded-lg p-1"
                        onChange={(e) =>
                          handleInputChange("minutes", e.target.value)
                        }
                      />
                      :
                      <input
                        type="text"
                        value={time.seconds}
                        className="w-10 text-center border rounded-lg p-1"
                        onChange={(e) =>
                          handleInputChange("seconds", e.target.value)
                        }
                      />
                      <select
                        value={time.meridiem}
                        onChange={(e) =>
                          handleInputChange("meridiem", e.target.value)
                        }
                        className="border rounded-lg px-2 py-1"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div
                  className="flex items-center justify-between px-4 py-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={toggleDatePicker}
                >
                  <span className="text-fourth">Chọn ngày</span>
                  <ChevronDown
                    className={`transition-transform ${
                      isDatePickerOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {isDatePickerOpen && (
                  <div className="mt-2 border rounded-lg p-4 bg-gray-50">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      monthsShown={1}
                      inline
                    />
                  </div>
                )}
              </div>

              <Button className="w-full py-8 bg-primary text-white font-semibold rounded-full text-lg my-10">
                Đặt Ngay
              </Button>

              <div className="flex justify-between items-center mt-4 text-sm text-fourth font-semibold">
                <div className="flex items-center gap-2">
                  <Clock />
                  <span>Chính sách hoàn tiền</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone />
                  <span>Liên hệ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceDetail;
