"use client";

import {
  clearWorkspaceTime,
  setWorkspaceTime,
} from "@/stores/slices/cartSlice";
import { DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";
import { Calendar, Clock, ChevronDown, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import 'dayjs/locale/vi';

dayjs.locale('vi');

function Time24hSelect() {
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
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
    updatedStartDate: dayjs.Dayjs,
    updatedEndDate: dayjs.Dayjs
  ) => {
    const formattedStartTime = `${String(startHours).padStart(2, "0")}:${String(
      startMinutes
    ).padStart(2, "0")} ${updatedStartDate.format("DD/MM/YYYY")}`;

    const formattedEndTime = `${String(endHours).padStart(2, "0")}:${String(
      endMinutes
    ).padStart(2, "0")} ${updatedEndDate.format("DD/MM/YYYY")}`;

    dispatch(
      setWorkspaceTime({
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        category: "Giờ",
      })
    );
  };

  const toggleTimePicker = () => {
    setIsTimePickerOpen(!isTimePickerOpen);
    const newStartTime = startTime;
    let newEndTime = endTime;
    let newEndDate = endDate;
    const newStartDate = startDate;
    if (newStartTime.hours === 23) {
      newEndTime = { hours: 0, minutes: newStartTime.minutes };
      newEndDate = newStartDate.add(1, "day");
      setEndDate(newEndDate);
    }
    saveTime(
      startTime.hours,
      startTime.minutes,
      newEndTime.hours,
      newEndTime.minutes,
      startDate,
      newEndDate
    );
  };

  const handleDateChange = (
    selectedDate: dayjs.Dayjs | null,
    type: "start" | "end"
  ) => {
    if (!selectedDate) return;

    let newStartTime = startTime;
    let newEndTime = endTime;
    let newEndDate = endDate;
    let newStartDate = startDate;

    if (type === "start") {
      newStartDate = selectedDate;
      setStartDate(selectedDate);

      if (!selectedDate.isSame(dayjs(), "day")) {
        newStartTime = { hours: 0, minutes: 0 };
      } else {
        newStartTime = { hours: dayjs().hour(), minutes: dayjs().minute() };
      }
      newEndDate = selectedDate;
      setEndDate(newEndDate);
      newEndTime = {
        hours: newStartTime.hours + 1,
        minutes: newStartTime.minutes,
      };
      setEndTime(newEndTime);
      setStartTime(newStartTime);
    } else {
      newEndDate = selectedDate;
      setEndDate(selectedDate);

      if (!selectedDate.isSame(startDate, "day")) {
        newEndTime = { hours: 0, minutes: startTime.minutes };
      } else {
        newEndTime = { hours: startTime.hours + 1, minutes: startTime.minutes };
      }
    }

    if (newStartTime.hours === 23) {
      newEndTime = { hours: 0, minutes: newStartTime.minutes };
      newEndDate = selectedDate.add(1, "day");
      setEndDate(newEndDate);
    }

    setEndTime(newEndTime);
    saveTime(
      newStartTime.hours,
      newStartTime.minutes,
      newEndTime.hours,
      newEndTime.minutes,
      newStartDate,
      newEndDate
    );
  };

  const handleStartTimeInput = (field: "hours" | "minutes", value: string) => {
    if (!/^\d*$/.test(value)) return;

    let newStartTime = { ...startTime, [field]: Number(value) };
    let newEndDate = endDate;

    if (
      startDate.isSame(dayjs(), "day") &&
      dayjs()
        .hour(newStartTime.hours)
        .minute(newStartTime.minutes)
        .isBefore(dayjs())
    ) {
      newStartTime = { hours: dayjs().hour(), minutes: dayjs().minute() };
    }

    setStartTime(newStartTime);

    let newEndTime = {
      hours: newStartTime.hours + 1,
      minutes: newStartTime.minutes,
    };

    if (newStartTime.hours === 23) {
      newEndTime = { hours: 0, minutes: newStartTime.minutes };
      newEndDate = startDate.add(1, "day");
      setEndDate(newEndDate);
    }

    setEndTime(newEndTime);
    saveTime(
      newStartTime.hours,
      newStartTime.minutes,
      newEndTime.hours,
      newEndTime.minutes,
      startDate,
      newEndDate
    );
  };

  const handleEndTimeInput = (field: "hours" | "minutes", value: string) => {
    if (!/^\d*$/.test(value)) return;

    let newEndTime = { ...endTime, [field]: Number(value) };

    if (
      startDate.isSame(endDate, "day") &&
      newEndTime.hours <= startTime.hours
    ) {
      newEndTime = { hours: startTime.hours + 1, minutes: startTime.minutes };
    }

    setEndTime(newEndTime);
    saveTime(
      startTime.hours,
      startTime.minutes,
      newEndTime.hours,
      newEndTime.minutes,
      startDate,
      endDate
    );
  };

  // Calculate duration between start and end times
  const calculateDuration = () => {
    const start = dayjs(startDate)
      .hour(startTime.hours)
      .minute(startTime.minutes);
    const end = dayjs(endDate)
      .hour(endTime.hours)
      .minute(endTime.minutes);
    
    const diffHours = end.diff(start, 'hour');
    const diffMinutes = end.diff(start, 'minute') % 60;
    
    return {
      hours: diffHours,
      minutes: diffMinutes
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
            <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
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
                {duration.hours > 0 ? `${duration.hours} giờ ` : ''}
                {duration.minutes > 0 ? `${duration.minutes} phút` : ''}
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
                {/* Start time section */}
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <Calendar className="h-4 w-4" />
                    <span>Thời gian bắt đầu</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-500 mb-1">Ngày</label>
                      <DatePicker
                        className="w-full"
                        format="DD/MM/YYYY"
                        value={startDate}
                        onChange={(date) => handleDateChange(date, "start")}
                        disabledDate={(current) =>
                          current &&
                          (current < dayjs().startOf("day") ||
                            current > dayjs().add(1, "day"))
                        }
                        placeholder="Chọn ngày"
                      />
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-500 mb-1">Giờ</label>
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
                  </div>
                </div>
                
                <Separator />
                
                {/* End time section */}
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <Calendar className="h-4 w-4" />
                    <span>Thời gian kết thúc</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-500 mb-1">Ngày</label>
                      <DatePicker
                        className="w-full"
                        format="DD/MM/YYYY"
                        value={endDate}
                        onChange={(date) => handleDateChange(date, "end")}
                        disabledDate={(current) =>
                          current &&
                          (current < dayjs().startOf("day") ||
                            current > dayjs().add(1, "day"))
                        }
                        placeholder="Chọn ngày"
                      />
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-500 mb-1">Giờ</label>
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
                          className="flex-1 py-1 px-2 focus:outline-none"
                          disabled
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
                </div>
                
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-md mt-4">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <p className="text-sm">Thời gian đặt phải trong cùng một ngày hoặc kéo dài đến ngày hôm sau.</p>
                </div>
              </div>
            </ConfigProvider>
          </div>
        </div>
      )}
    </div>
  );
}

export default Time24hSelect;
