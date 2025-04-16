import { Calendar, ChevronDown, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { DatePicker, ConfigProvider } from "antd";
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
import { Badge } from "@/components/ui/badge";
import 'dayjs/locale/vi';

dayjs.extend(isBetween);
dayjs.locale('vi');

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
          autoClose: 1500,
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
      <div className="text-center py-4">
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
            autoClose: 1500,
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

  // Calculate duration in days
  const calculateDuration = () => {
    if (!date?.from || !date?.to) return 0;
    return dayjs(date.to).diff(dayjs(date.from), 'day') + 1;
  };

  const duration = calculateDuration();

  // Format date range for display
  const formatDateRange = () => {
    if (!date?.from || !date?.to) return "";
    
    if (dayjs(date.from).isSame(date.to, 'day')) {
      return dayjs(date.from).format('DD/MM/YYYY');
    }
    
    return `${dayjs(date.from).format('DD/MM/YYYY')} - ${dayjs(date.to).format('DD/MM/YYYY')}`;
  };

  return (
    <div className="mb-4">
      <div
        className="flex items-center justify-between px-4 py-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={toggleDatePicker}
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="text-black text-sm font-medium">Chọn ngày</span>
          {isDatePickerOpen && (
            <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
              Đã chọn
            </Badge>
          )}
        </div>
        <ChevronDown
          className={`transition-transform text-primary ${
            isDatePickerOpen ? "rotate-180" : ""
          }`}
          size={18}
        />
      </div>
      
      {isDatePickerOpen && (
        <div className="mt-2 border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-primary text-white px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Chọn khoảng thời gian</span>
            </div>
            {duration > 0 && (
              <Badge className="bg-white text-primary">
                {duration} ngày
              </Badge>
            )}
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
                    <span>Khoảng thời gian</span>
                  </div>
                  
                  <RangePicker
                    className="w-full py-2"
                    onChange={handleDateChange}
                    format="DD/MM/YYYY"
                    defaultValue={[
                      date?.from ? dayjs(date.from) : undefined,
                      date?.to ? dayjs(date.to) : undefined,
                    ]}
                    placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                    disabledDate={(current) => {
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
                    }}
                  />
                </div>
                
                {date?.from && date?.to && (
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{formatDateRange()}</span>
                    </div>
                    <Badge variant="outline" className="text-primary">
                      {duration} ngày
                    </Badge>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-md">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <p className="text-sm">Các ngày đã được đặt sẽ không thể chọn. Thời gian hoạt động: {open} - {close}.</p>
                </div>
              </div>
            </ConfigProvider>
          </div>
        </div>
      )}
    </div>
  );
}

export default DateSelect;
