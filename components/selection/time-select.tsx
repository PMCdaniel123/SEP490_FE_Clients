import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

function TimeSelect() {
  const [time, setTime] = useState({
    hours: "00",
    minutes: "00",
  });
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  const toggleTimePicker = () => setIsTimePickerOpen(!isTimePickerOpen);

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    setTime({
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
    });
  }, []);

  const handleInputChange = (field: string, value: string) => {
    if (["hours", "minutes"].includes(field) && !/^\d*$/.test(value)) {
      return;
    }

    setTime((prevTime) => ({
      ...prevTime,
      [field]: value.padStart(2, "0"),
    }));
  };

  return (
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
          <div className="flex justify-between items-center">
            <select
              value={time.hours}
              className="border rounded-lg px-4 py-2"
              onChange={(e) => handleInputChange("hours", e.target.value)}
            >
              {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                <option key={hour} value={hour}>
                  {hour < 10 ? `0${hour}` : hour}
                </option>
              ))}
            </select>
            :
            <select
              value={time.minutes}
              className="border rounded-lg px-4 py-2"
              onChange={(e) => handleInputChange("minutes", e.target.value)}
            >
              {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                <option key={minute} value={minute}>
                  {minute < 10 ? `0${minute}` : minute}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimeSelect;
