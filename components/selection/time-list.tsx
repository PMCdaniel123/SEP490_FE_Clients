"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../loader/Loader";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { BASE_URL } from "@/constants/environments";
import { Calendar, Clock, CalendarDays, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import 'dayjs/locale/vi';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale('vi'); // Set Vietnamese locale

interface Time {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  workspaceTimeCategory: string;
  isFullDay?: boolean;
  originalStartDate?: string;
  originalEndDate?: string;
}

function TimeList({ workspaceId }: { workspaceId: string }) {
  const today = dayjs();
  const tomorrow = today.add(1, "day");
  const nextDay = today.add(2, "day");
  const [loading, setLoading] = useState(false);
  const [timeList, setTimeList] = useState<Time[]>([]);

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
      } catch (error: unknown) {
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

  const filterByTime = (date: dayjs.Dayjs) => {
    // Get hourly bookings for the specific day
    const hourlyBookings = timeList.filter((item: Time) => {
      const isSameDay =
        (dayjs(item.startDate).isSame(date, "day") ||
          dayjs(item.endDate).isSame(date, "day")) &&
        (item.status === "InUse" || item.status === "Handling") &&
        item.workspaceTimeCategory !== "Ngày";
      return isSameDay;
    });

    // Check for daily bookings that affect this day
    const dailyBookings = timeList.filter((item: Time) => {
      const startDate = dayjs(item.startDate);
      const endDate = dayjs(item.endDate);
      
      return (
        (item.status === "InUse" || item.status === "Handling") &&
        item.workspaceTimeCategory === "Ngày" &&
        date.isSameOrAfter(startDate, "day") &&
        date.isSameOrBefore(endDate, "day")
      );
    });

    // If there are daily bookings affecting this day, add a special "full-day" item
    if (dailyBookings.length > 0) {
      const fullDayItems = dailyBookings.map((booking: Time) => ({
        ...booking,
        isFullDay: true,
        originalStartDate: booking.startDate,
        originalEndDate: booking.endDate,
        startDate: date.startOf('day').format(),
        endDate: date.endOf('day').format()
      }));
      
      return [...hourlyBookings, ...fullDayItems];
    }

    return hourlyBookings;
  };

  const filterByDate = () => {
    const now = dayjs();

    return timeList.filter((item: Time) => {
      const startDate = dayjs(item.startDate);
      const endDate = dayjs(item.endDate);

      const isValidTime =
        startDate.isValid() &&
        endDate.isValid() &&
        ((startDate.isSameOrBefore(now, "day") &&
          endDate.isSameOrAfter(now, "day")) ||
          startDate.isAfter(now, "day")) &&
        (item.status === "InUse" || item.status === "Handling") &&
        item.workspaceTimeCategory === "Ngày";

      return isValidTime;
    });
  };

  const todayList = filterByTime(today).sort(
    (a: Time, b: Time) =>
      Number(dayjs(a.startDate)) - Number(dayjs(b.startDate))
  );
  const tomorrowList = filterByTime(tomorrow).sort(
    (a: Time, b: Time) =>
      Number(dayjs(a.startDate)) - Number(dayjs(b.startDate))
  );
  const nextDayList = filterByTime(nextDay).sort(
    (a: Time, b: Time) =>
      Number(dayjs(a.startDate)) - Number(dayjs(b.startDate))
  );
  const dateList = filterByDate().sort(
    (a: Time, b: Time) =>
      Number(dayjs(a.startDate)) - Number(dayjs(b.startDate))
  );

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader />
      </div>
    );
  }

  const formatTimeRange = (start: string, end: string, isFullDay: boolean = false) => {
    if (isFullDay) {
      return (
        <div className="flex flex-col">
          <span className="font-medium text-amber-700">Đã được đặt cả ngày</span>
          <span className="text-xs text-gray-500">
            Thuộc lịch đặt: {dayjs(start).format("DD/MM/YYYY")} - {dayjs(end).format("DD/MM/YYYY")}
          </span>
        </div>
      );
    }
    
    return (
      <>
        <span className="font-medium">{dayjs(start).format("HH:mm")}</span> - 
        <span className="font-medium">{dayjs(end).format("HH:mm")}</span>
        <span className="text-xs ml-2 text-gray-500">
          {dayjs(start).format("DD/MM/YYYY")}
        </span>
      </>
    );
  };

  const renderTimeSlots = (timeSlots: Time[]) => {
    if (timeSlots.length === 0) {
      return (
        <div className="flex items-center justify-center py-6 text-gray-500">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="italic">Trống</span>
        </div>
      );
    }

    const fullDayBookings = timeSlots.filter((item: Time) => item.isFullDay);
    const hourlyBookings = timeSlots.filter((item: Time) => !item.isFullDay);

    return (
      <ScrollArea className="h-[200px] pr-4">
        <div className="space-y-2">
          {fullDayBookings.length > 0 && (
            <div className="mb-3">
              {fullDayBookings.map((item: Time) => (
                <div
                  key={`fullday-${item.id}`}
                  className="flex items-center p-3 rounded-lg bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors mb-2"
                >
                  <CalendarDays className="w-4 h-4 mr-3 text-amber-700 flex-shrink-0" />
                  <span>{formatTimeRange(item.originalStartDate || item.startDate, item.originalEndDate || item.endDate, true)}</span>
                </div>
              ))}
            </div>
          )}
          
          {hourlyBookings.map((item: Time) => (
            <div
              key={item.id}
              className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <Clock className="w-4 h-4 mr-3 text-primary flex-shrink-0" />
              <span>{formatTimeRange(item.startDate, item.endDate)}</span>
            </div>
          ))}
          
          {hourlyBookings.length === 0 && fullDayBookings.length > 0 && (
            <div className="flex items-center justify-center py-2 text-gray-500">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="italic">Bạn không thể đặt trong thời gian này</span>
            </div>
          )}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className="mt-4">
      <div className="flex items-center mb-4 text-primary">
        <AlertCircle className="w-5 h-5 mr-2" />
        <p className="text-sm">
          Các khung giờ dưới đây đã được đặt và không khả dụng
        </p>
      </div>
      
      <Tabs defaultValue="hourly" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="hourly" className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>Đặt theo giờ</span>
          </TabsTrigger>
          <TabsTrigger value="daily" className="flex items-center">
            <CalendarDays className="w-4 h-4 mr-2" />
            <span>Đặt theo ngày</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="hourly" className="space-y-4">
          <div className="space-y-4">
            <div>
              <div className="flex items-center mb-2">
                <Calendar className="w-4 h-4 mr-2 text-primary" />
                <h3 className="font-medium text-primary">
                  {today.format("dddd, DD/MM/YYYY").charAt(0).toUpperCase() + today.format("dddd, DD/MM/YYYY").slice(1)}
                </h3>
                {todayList.length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {todayList.length} khung giờ
                  </Badge>
                )}
              </div>
              {renderTimeSlots(todayList)}
              <Separator className="my-4" />
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <Calendar className="w-4 h-4 mr-2 text-primary" />
                <h3 className="font-medium text-primary">
                  {tomorrow.format("dddd, DD/MM/YYYY").charAt(0).toUpperCase() + tomorrow.format("dddd, DD/MM/YYYY").slice(1)}
                </h3>
                {tomorrowList.length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {tomorrowList.length} khung giờ
                  </Badge>
                )}
              </div>
              {renderTimeSlots(tomorrowList)}
              <Separator className="my-4" />
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <Calendar className="w-4 h-4 mr-2 text-primary" />
                <h3 className="font-medium text-primary">
                  {nextDay.format("dddd, DD/MM/YYYY").charAt(0).toUpperCase() + nextDay.format("dddd, DD/MM/YYYY").slice(1)}
                </h3>
                {nextDayList.length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {nextDayList.length} khung giờ
                  </Badge>
                )}
              </div>
              {renderTimeSlots(nextDayList)}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="daily">
          <div>
            <div className="flex items-center mb-2">
              <CalendarDays className="w-4 h-4 mr-2 text-primary" />
              <h3 className="font-medium text-primary">
                Các ngày đã được đặt
              </h3>
              {dateList.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {dateList.length} ngày
                </Badge>
              )}
            </div>
            
            <ScrollArea className="h-[250px] pr-4">
              <div className="space-y-2">
                {dateList.length > 0 ? (
                  dateList.map((item: Time) => (
                    <div
                      key={item.id}
                      className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <CalendarDays className="w-4 h-4 mr-3 text-primary flex-shrink-0" />
                      <div>
                        <div className="font-medium">
                          {dayjs(item.startDate).format("DD/MM/YYYY")} - {dayjs(item.endDate).format("DD/MM/YYYY")}
                        </div>
                        <div className="text-xs text-gray-500">
                          {dayjs(item.startDate).format("HH:mm")} - {dayjs(item.endDate).format("HH:mm")}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center py-6 text-gray-500">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span className="italic">Trống</span>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default TimeList;
