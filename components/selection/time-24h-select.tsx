"use client";

import {
  clearWorkspaceTime,
  setWorkspaceTime,
} from "@/stores/slices/cartSlice";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

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

  return (
    <div className="mb-4">
      <div
        className="flex items-center justify-between px-4 py-3 border rounded-lg cursor-pointer hover:bg-gray-50"
        onClick={toggleTimePicker}
      >
        <span className="text-black text-sm">Chọn thời gian</span>
        <ChevronDown
          className={`transition-transform ${
            isTimePickerOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      {isTimePickerOpen && (
        <div className="mt-2">
          <div className="border rounded-lg p-3 bg-gray-50 flex flex-col gap-6">
            <div className="grid grid-cols-3 items-center">
              <p className="col-span-1">Từ:</p>
              <div className="flex flex-col items-center w-full col-span-2 gap-2">
                <DatePicker
                  className="w-full py-2"
                  format="DD/MM/YYYY"
                  value={startDate}
                  onChange={(date) => handleDateChange(date, "start")}
                  disabledDate={(current) =>
                    current &&
                    (current < dayjs().startOf("day") ||
                      current > dayjs().add(1, "day"))
                  }
                />
                <div className="flex justify-between items-center w-full">
                  <select
                    value={startTime.hours}
                    className="border rounded-lg px-4 py-2"
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
                  <span>:</span>
                  <select
                    value={startTime.minutes}
                    className="border rounded-lg px-4 py-2"
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
            <div className="grid grid-cols-3 items-center">
              <p className="col-span-1">Đến:</p>
              <div className="flex flex-col items-center w-full col-span-2 gap-2">
                <DatePicker
                  className="w-full py-2"
                  format="DD/MM/YYYY"
                  value={endDate}
                  onChange={(date) => handleDateChange(date, "end")}
                  disabledDate={(current) =>
                    current &&
                    (current < dayjs().startOf("day") ||
                      current > dayjs().add(1, "day"))
                  }
                />
                <div className="flex justify-between items-center w-full">
                  <select
                    value={endTime.hours}
                    className="border rounded-lg px-4 py-2"
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
                  <span>:</span>
                  <select
                    value={endTime.minutes}
                    className="border rounded-lg px-4 py-2"
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
        </div>
      )}
    </div>
  );
}

export default Time24hSelect;
