import {
  clearWorkspaceTime,
  setWorkspaceTime,
} from "@/stores/slices/cartSlice";
import { DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";
import { Calendar, Clock, ChevronDown, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import "dayjs/locale/vi";

dayjs.locale("vi");

function TimeSelect() {
  const [date, setDate] = useState(dayjs());
  const [startTime, setStartTime] = useState({
    hours: dayjs().hour(),
    minutes: dayjs().minute(),
  });
  const [endTime, setEndTime] = useState({
    hours: dayjs().hour() + 1,
    minutes: dayjs().minute(),
  });
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isTimePickerOpen) {
      dispatch(clearWorkspaceTime());
    }
  }, [isTimePickerOpen, dispatch]);

  const saveTime = (
    startHours: number,
    startMinutes: number,
    endHours: number,
    endMinutes: number,
    selectedDate: dayjs.Dayjs
  ) => {
    const formattedStartTime = `${String(startHours).padStart(2, "0")}:${String(
      startMinutes
    ).padStart(2, "0")} ${selectedDate.format("DD/MM/YYYY")}`;

    const formattedEndTime = `${String(endHours).padStart(2, "0")}:${String(
      endMinutes
    ).padStart(2, "0")} ${selectedDate.format("DD/MM/YYYY")}`;

    dispatch(
      setWorkspaceTime({
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        category: "Giờ",
      })
    );
  };

  const getNowTime = (selectedDate: dayjs.Dayjs) => {
    const now = dayjs();
    const isToday = selectedDate.isSame(now, "day");

    setStartTime({
      hours: isToday ? now.hour() : 0,
      minutes: isToday ? now.minute() : 0,
    });
    setEndTime({
      hours: isToday ? now.hour() + 1 : 1,
      minutes: isToday ? now.minute() : 0,
    });
    saveTime(
      isToday ? now.hour() : 0,
      isToday ? now.minute() : 0,
      isToday ? now.hour() + 1 : 1,
      isToday ? now.minute() : 0,
      selectedDate
    );
  };

  const toggleTimePicker = () => {
    setIsTimePickerOpen(!isTimePickerOpen);
    getNowTime(date);
  };

  const handleDateChange = (selectedDate: dayjs.Dayjs | null) => {
    if (selectedDate) {
      setDate(selectedDate);
      getNowTime(selectedDate);
    }
  };

  const handleStartTimeInput = (field: string, value: string) => {
    if (!/^\d*$/.test(value)) return;

    let newStartTime = {
      ...startTime,
      [field]: Number(value),
    };

    if (date.isSame(dayjs(), "day")) {
      const now = dayjs();
      const selectedTime = dayjs()
        .hour(newStartTime.hours)
        .minute(newStartTime.minutes);

      if (selectedTime.isBefore(now)) {
        newStartTime = {
          hours: now.hour(),
          minutes: now.minute(),
        };
      }
    }

    setStartTime(newStartTime);

    const start = dayjs().hour(newStartTime.hours).minute(newStartTime.minutes);
    setEndTime({
      hours: start.hour() + 1,
      minutes: start.minute(),
    });

    saveTime(
      newStartTime.hours,
      newStartTime.minutes,
      start.hour() + 1,
      start.minute(),
      date
    );
  };

  const handleEndTimeInput = (field: string, value: string) => {
    if (!/^\d*$/.test(value)) return;

    let newEndTime = {
      ...endTime,
      [field]: Number(value),
    };

    const start = dayjs().hour(startTime.hours).minute(startTime.minutes);
    const end = dayjs().hour(newEndTime.hours).minute(newEndTime.minutes);

    if (!end.isAfter(start)) {
      newEndTime = {
        hours: start.hour() + 1,
        minutes: start.minute(),
      };
    }

    setEndTime(newEndTime);

    saveTime(
      startTime.hours,
      startTime.minutes,
      newEndTime.hours,
      newEndTime.minutes,
      date
    );
  };

  // Calculate duration between start and end times
  const calculateDuration = () => {
    const start = dayjs(date).hour(startTime.hours).minute(startTime.minutes);
    const end = dayjs(date).hour(endTime.hours).minute(endTime.minutes);

    const diffHours = end.diff(start, "hour");
    const diffMinutes = end.diff(start, "minute") % 60;

    return {
      hours: diffHours,
      minutes: diffMinutes,
    };
  };

  const duration = calculateDuration();

  return (
    <div className="mb-4">
      <div
        className="flex items-center justify-between px-4 py-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={toggleTimePicker}
      >
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-black text-sm font-medium">Chọn thời gian</span>
          {isTimePickerOpen && (
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary text-xs"
            >
              Đã chọn
            </Badge>
          )}
        </div>
        <ChevronDown
          className={`transition-transform text-primary ${
            isTimePickerOpen ? "rotate-180" : ""
          }`}
          size={18}
        />
      </div>

      {isTimePickerOpen && (
        <div className="mt-2 border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-primary text-white px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Thời gian đặt chỗ</span>
            </div>
            {duration.hours > 0 || duration.minutes > 0 ? (
              <Badge className="bg-white text-primary">
                {duration.hours > 0 ? `${duration.hours} giờ ` : ""}
                {duration.minutes > 0 ? `${duration.minutes} phút` : ""}
              </Badge>
            ) : null}
          </div>

          <div className="p-4 bg-white">
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#835101",
                },
              }}
            >
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <Calendar className="h-4 w-4" />
                    <span>Ngày đặt</span>
                  </div>

                  <DatePicker
                    className="w-full"
                    format="DD/MM/YYYY"
                    value={date}
                    onChange={handleDateChange}
                    disabledDate={(current) =>
                      current &&
                      (current < dayjs().startOf("day") ||
                        current > dayjs().add(2, "day"))
                    }
                    placeholder="Chọn ngày"
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <Clock className="h-4 w-4" />
                      <span>Thời gian bắt đầu</span>
                    </div>

                    <div className="flex items-center border rounded-md overflow-hidden">
                      <select
                        value={startTime.hours}
                        className="flex-1 py-1 px-2 border-r focus:outline-none"
                        onChange={(e) =>
                          handleStartTimeInput("hours", e.target.value)
                        }
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <option key={i} value={String(i)}>
                            {i < 10 ? `0${i}` : i}
                          </option>
                        ))}
                      </select>
                      <span className="px-2 text-gray-500">:</span>
                      <select
                        value={startTime.minutes}
                        className="flex-1 py-1 px-2 focus:outline-none"
                        onChange={(e) =>
                          handleStartTimeInput("minutes", e.target.value)
                        }
                      >
                        {Array.from({ length: 60 }, (_, i) => (
                          <option key={i} value={String(i)}>
                            {i < 10 ? `0${i}` : i}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <Clock className="h-4 w-4" />
                      <span>Thời gian kết thúc</span>
                    </div>

                    <div className="flex items-center border rounded-md overflow-hidden">
                      <select
                        value={endTime.hours}
                        className="flex-1 py-1 px-2 border-r focus:outline-none"
                        onChange={(e) =>
                          handleEndTimeInput("hours", e.target.value)
                        }
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <option key={i} value={String(i)}>
                            {i < 10 ? `0${i}` : i}
                          </option>
                        ))}
                      </select>
                      <span className="px-2 text-gray-500">:</span>
                      <select
                        value={endTime.minutes}
                        disabled
                        className="flex-1 py-1 px-2 focus:outline-none"
                        onChange={(e) =>
                          handleEndTimeInput("minutes", e.target.value)
                        }
                      >
                        {Array.from({ length: 60 }, (_, i) => (
                          <option key={i} value={String(i)}>
                            {i < 10 ? `0${i}` : i}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                  {/* tinh thoi gian */}
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      {date.format("DD/MM/YYYY")} |{" "}
                      {String(startTime.hours).padStart(2, "0")}:
                      {String(startTime.minutes).padStart(2, "0")} -{" "}
                      {String(
                        endTime.hours === 24 ? 0 : endTime.hours
                      ).padStart(2, "0")}
                      :{String(endTime.minutes).padStart(2, "0")}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-primary">
                    {duration.hours > 0 ? `${duration.hours} giờ ` : ""}
                    {duration.minutes > 0 ? `${duration.minutes} phút` : ""}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-md">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <p className="text-sm">
                    Các thời gian không khả dụng sẽ không thể chọn.
                  </p>
                </div>
              </div>
            </ConfigProvider>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimeSelect;
