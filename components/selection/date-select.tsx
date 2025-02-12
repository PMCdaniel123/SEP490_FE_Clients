import { ChevronDown } from "lucide-react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DateSelect() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const toggleDatePicker = () => setIsDatePickerOpen(!isDatePickerOpen);

  return (
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
          />
        </div>
      )}
    </div>
  );
}

export default DateSelect;
