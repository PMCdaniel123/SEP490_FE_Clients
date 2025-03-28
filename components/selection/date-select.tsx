import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import {
  clearWorkspaceTime,
  setWorkspaceTime,
} from "@/stores/slices/cartSlice";
import { toast } from "react-toastify";
import { RootState } from "@/stores";
import Loader from "../loader/Loader";
import { BASE_URL } from "@/constants/environments";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;

interface Time {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  workspaceTimeCategory: string;
}

function DateSelect({
  openTime,
  closeTime,
}: {
  openTime: string;
  closeTime: string;
}) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const toggleDatePicker = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
    getNowTime();
  };
  const dispatch = useDispatch();
  const open = openTime.substring(0, 5);
  const close = closeTime.substring(0, 5);
  const [timeList, setTimeList] = useState<Time[]>([]);
  const [loading, setLoading] = useState(false);
  const { workspaceId } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    if (!workspaceId) return;
    setLoading(true);

    const fetchTimeList = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/users/booking/workspacetimes?WorkspaceId=${workspaceId}`
        );

        if (!response.ok) {
          throw new Error(
            "Có lỗi xảy ra khi tải các thời gian không khả dụng."
          );
        }

        const data = await response.json();
        setTimeList(
          Array.isArray(data.workspaceTimes) ? data.workspaceTimes : []
        );
        setLoading(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Đã xảy ra lỗi!";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          theme: "light",
        });
      }
    };

    fetchTimeList();
  }, [workspaceId]);

  useEffect(() => {
    if (!isDatePickerOpen) {
      dispatch(clearWorkspaceTime());
    }
  }, [isDatePickerOpen, dispatch]);

  if (loading) {
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  const getNowTime = () => {
    const now = dayjs();
    const selectedStart = dayjs(now.toDate());
    const selectedEnd = dayjs(now.toDate());

    const isToday = selectedStart.isSame(now, "day");

    const startTime = isToday
      ? selectedStart.startOf("day").format("DD/MM/YYYY")
      : selectedStart.format("DD/MM/YYYY");

    const endTime = isToday
      ? selectedEnd.startOf("day").format("DD/MM/YYYY")
      : selectedEnd.format("DD/MM/YYYY");

    setDate({
      from: now.toDate(),
      to: now.toDate(),
    });

    dispatch(
      setWorkspaceTime({
        startTime: open + " " + startTime,
        endTime: close + " " + endTime,
        category: "Ngày",
      })
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateChange = (dates: any) => {
    if (dates) {
      const now = dayjs();
      const selectedStart = dayjs(dates[0].toDate());
      const selectedEnd = dayjs(dates[1].toDate());

      const isToday = selectedStart.isSame(now, "day");

      const startTime = isToday
        ? selectedStart.startOf("day").format("DD/MM/YYYY")
        : selectedStart.format("DD/MM/YYYY");

      const endTime = isToday
        ? selectedEnd.startOf("day").format("DD/MM/YYYY")
        : selectedEnd.format("DD/MM/YYYY");

      const hasOverlap = timeList.some(({ startDate, endDate }) => {
        const bookedStart = dayjs(startDate, "YYYY-MM-DD");
        const bookedEnd = dayjs(endDate, "YYYY-MM-DD");

        return (
          selectedStart.isBetween(bookedStart, bookedEnd, "day", "[]") ||
          selectedEnd.isBetween(bookedStart, bookedEnd, "day", "[]") ||
          (selectedStart.isSameOrBefore(bookedStart) &&
            selectedEnd.isSameOrAfter(bookedEnd))
        );
      });

      if (hasOverlap) {
        toast.error(
          "Khoảng thời gian đã bị đặt trước. Vui lòng chọn ngày khác!",
          {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            theme: "light",
          }
        );
        dispatch(clearWorkspaceTime());
        return;
      }

      setDate({
        from: dates[0].toDate(),
        to: dates[1].toDate(),
      });

      dispatch(
        setWorkspaceTime({
          startTime: open + " " + startTime,
          endTime: close + " " + endTime,
          category: "Ngày",
        })
      );
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
              // current && current < dayjs().startOf("day")
              {
                if (!current) return false;

                // Disable past dates
                if (current < dayjs().startOf("day")) {
                  return true;
                }

                // Disable dates in timeList
                return timeList.some(({ startDate, endDate }) => {
                  const start = dayjs(startDate, "YYYY-MM-DD");
                  const end = dayjs(endDate, "YYYY-MM-DD");
                  return current.isBetween(start, end, "day", "[]"); // '[]' includes start and end dates
                });
              }
            }
          />
        </div>
      )}
    </div>
  );
}

export default DateSelect;
