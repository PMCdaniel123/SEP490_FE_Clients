"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../loader/Loader";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { BASE_URL } from "@/constants/environments";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

interface Time {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  workspaceTimeCategory: string;
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

  const filterByTime = (date: dayjs.Dayjs) =>
    timeList.filter((item) => {
      const isSameDay =
        dayjs(item.startDate).isSame(date, "day") &&
        (item.status === "InUse" || item.status === "Handling") &&
        item.workspaceTimeCategory !== "Ngày";
      return isSameDay;
    });

  const filterByDate = () => {
    const now = dayjs();

    return timeList.filter((item) => {
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
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 mt-8">
      <h1 className="text-base font-medium text-white border border-primary bg-primary rounded-md py-2 px-4">
        1. Đặt theo giờ
      </h1>
      <div className="flex flex-col gap-4">
        <h1 className="text-base font-medium leading-none text-primary">
          {today.format("DD/MM/YYYY")}:
        </h1>
        <div className="flex flex-row flex-wrap gap-2">
          {todayList.length > 0 ? (
            todayList.map((item) => (
              <div
                key={item.id}
                className="p-2 rounded-md bg-fourth text-white font-medium text-sm"
              >
                {dayjs(item.startDate).format("HH:mm")} -{" "}
                {dayjs(item.endDate).format("HH:mm")}
              </div>
            ))
          ) : (
            <p className="text-sm text-sixth italic flex items-center">Trống</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-base font-medium leading-none text-primary">
          {tomorrow.format("DD/MM/YYYY")}:
        </h1>
        <div className="flex flex-row flex-wrap gap-2">
          {tomorrowList.length > 0 ? (
            tomorrowList.map((item) => (
              <div
                key={item.id}
                className="p-2 rounded-md bg-fourth text-white font-medium text-sm"
              >
                {dayjs(item.startDate).format("HH:mm")} -{" "}
                {dayjs(item.endDate).format("HH:mm")}
              </div>
            ))
          ) : (
            <p className="text-sm text-sixth italic flex items-center">Trống</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-base font-medium leading-none text-primary">
          {nextDay.format("DD/MM/YYYY")}:
        </h1>
        <div className="flex flex-row flex-wrap gap-2">
          {nextDayList.length > 0 ? (
            nextDayList.map((item) => (
              <div
                key={item.id}
                className="p-2 rounded-md bg-fourth text-white font-medium text-sm"
              >
                {dayjs(item.startDate).format("HH:mm")} -{" "}
                {dayjs(item.endDate).format("HH:mm")}
              </div>
            ))
          ) : (
            <p className="text-sm text-sixth italic flex items-center">Trống</p>
          )}
        </div>
      </div>

      <h1 className="text-base font-medium text-white border border-primary bg-primary rounded-md py-2 px-4">
        2. Đặt theo ngày
      </h1>
      <div className="flex flex-row flex-wrap gap-2">
        {dateList.length > 0 ? (
          dateList.map((item) => (
            <div
              key={item.id}
              className="p-2 rounded-md bg-fourth text-white font-medium text-sm"
            >
              {dayjs(item.startDate).format("HH:mm DD/MM/YYYY")} -{" "}
              {dayjs(item.endDate).format("HH:mm DD/MM/YYYY")}
            </div>
          ))
        ) : (
          <p className="text-sm text-sixth italic flex items-center">Trống</p>
        )}
      </div>
    </div>
  );
}

export default TimeList;
