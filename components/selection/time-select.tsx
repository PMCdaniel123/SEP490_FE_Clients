import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

function TimeSelect() {
  const [time, setTime] = useState({
    hours: "00",
    minutes: "00",
  });
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const getNowTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    setTime({
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
    });

    updateDescription(hours, minutes);
  };

  const toggleTimePicker = () => {
    setIsTimePickerOpen(!isTimePickerOpen);
    getNowTime();
  };

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    setTime({
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
    });

    updateDescription(hours, minutes);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    if (["hours", "minutes"].includes(field) && !/^\d*$/.test(value)) {
      return;
    }

    setTime((prevTime) => ({
      ...prevTime,
      [field]: value.padStart(2, "0"),
    }));

    const updatedTime = {
      ...time,
      [field]: value.padStart(2, "0"),
    };

    validateTime(updatedTime.hours, updatedTime.minutes);
  };

  const validateTime = (hours: string, minutes: string) => {
    const now = new Date();
    const selected = new Date();

    selected.setHours(parseInt(hours));
    selected.setMinutes(parseInt(minutes));
    selected.setSeconds(0);

    const nowPlusOneHour = new Date(now.getTime() + 60 * 60 * 1000);

    if (selected < nowPlusOneHour) {
      setError("Thời gian phải sau ít nhất 1 giờ so với hiện tại.");
      setDescription("");
    } else {
      setError("");
      updateDescription(parseInt(hours), parseInt(minutes));
    }
  };

  const updateDescription = (hours: number, minutes: number) => {
    const selected = new Date();
    selected.setHours(hours);
    selected.setMinutes(minutes);

    const end = new Date(selected.getTime() + 60 * 60 * 1000);

    const formatTime = (date: Date) =>
      `${date.getHours() % 12 || 12}:${String(date.getMinutes()).padStart(
        2,
        "0"
      )} ${date.getHours() >= 12 ? "chiều" : "sáng"}`;

    const formattedDate = `Bắt đầu lúc ${formatTime(selected)}`;
    const endTime = `Kết thúc lúc ${formatTime(end)}`;

    setDescription(`${formattedDate}\n${endTime}`);
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
          <div className="border rounded-lg p-3 bg-gray-50">
            <div className="flex justify-between items-center">
              <select
                value={time.hours}
                className="border rounded-lg px-4 py-2"
                onChange={(e) => handleInputChange("hours", e.target.value)}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={String(i).padStart(2, "0")}>
                    {i < 10 ? `0${i}` : i}
                  </option>
                ))}
              </select>
              <span>:</span>
              <select
                value={time.minutes}
                className="border rounded-lg px-4 py-2"
                onChange={(e) => handleInputChange("minutes", e.target.value)}
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={String(i).padStart(2, "0")}>
                    {i < 10 ? `0${i}` : i}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
      {/* This is a description time booking */}
      <div className="flex flex-col mt-4 gap-2">
        {description && (
          <>
            <p className="font-normal text-fifth text-sm whitespace-pre-line space-y-2 ml-4">
              {description}
            </p>
          </>
        )}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
}

export default TimeSelect;
