import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

function DateSelect() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const toggleDatePicker = () => setIsDatePickerOpen(!isDatePickerOpen);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateChange = (dates: any) => {
    if (dates) {
      setDate({
        from: dates[0].toDate(),
        to: dates[1].toDate(),
      });
    }
  };

  return (
    <div className="mb-4">
      <div
        className="flex items-center justify-between px-4 py-3 border rounded-lg cursor-pointer hover:bg-gray-50"
        onClick={toggleDatePicker}
      >
        <span className="text-black text-sm">Chọn ngày</span>
        <ChevronDown
          className={`transition-transform ${
            isDatePickerOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      {isDatePickerOpen && (
        <div className="mt-2 border rounded-lg p-3 bg-gray-50">
          <RangePicker
            className="py-2"
            onChange={handleDateChange}
            format="DD/MM/YYYY"
            defaultValue={[
              date?.from ? dayjs(date.from) : undefined,
              date?.to ? dayjs(date.to) : undefined,
            ]}
            disabledDate={(current) =>
              current && current < dayjs().startOf("day")
            }
          />
        </div>
      )}
      <div className="flex flex-col mt-4 ml-4">
        <p className="text-fifth text-sm font-normal">
          Bắt đầu {date?.from ? dayjs(date.from).format("DD/MM/YYYY") : ""}
        </p>
        <p className="text-sm text-fifth font-normal">
          Kết thúc {date?.to ? dayjs(date.to).format("DD/MM/YYYY") : ""}
        </p>
      </div>
    </div>
  );
}

export default DateSelect;
