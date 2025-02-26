import { DatePicker } from "antd";
import dayjs from "dayjs";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

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

  const getNowTime = () => {
    const now = dayjs();
    setStartTime({
      hours: now.hour(),
      minutes: now.minute(),
    });
    setEndTime({
      hours: now.hour() + 1,
      minutes: now.minute(),
    });
    setDate(now);
  };

  const toggleTimePicker = () => {
    setIsTimePickerOpen(!isTimePickerOpen);
    getNowTime();
  };

  const handleDateChange = (selectedDate: dayjs.Dayjs | null) => {
    if (selectedDate) {
      setDate(selectedDate);
      if (selectedDate.isSame(dayjs(), "day")) {
        getNowTime();
      }
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
          <div className="border rounded-lg p-3 bg-gray-50 flex flex-col gap-2">
            <DatePicker
              className="w-full py-2"
              format="DD/MM/YYYY"
              value={date}
              onChange={handleDateChange}
              disabledDate={(current) =>
                current &&
                (current < dayjs().startOf("day") ||
                  current > dayjs().add(2, "day"))
              }
            />
            <div className="grid grid-cols-3 items-center">
              <p className="col-span-1">Từ:</p>
              <div className="flex justify-between items-center w-full col-span-2">
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
            <div className="grid grid-cols-3 items-center">
              <p className="col-span-1">Đến:</p>
              <div className="flex justify-between items-center w-full col-span-2">
                <select
                  value={endTime.hours}
                  className="border rounded-lg px-4 py-2"
                  onChange={(e) => handleEndTimeInput("hours", e.target.value)}
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
      )}
    </div>
  );
}

export default TimeSelect;
