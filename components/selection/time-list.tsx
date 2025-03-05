"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../loader/Loader";

interface Time {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
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
          `https://localhost:5050/users/booking/workspacetimes?WorkspaceId=${workspaceId}`
        );

        if (!response.ok) {
          throw new Error(
            "Có lỗi xảy ra khi tải các thời gian không khả dụng."
          );
        }

        const data = await response.json();
        setTimeList(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch {
        toast.error("Có lỗi xảy ra khi tải các thời gian không khả dụng.", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          theme: "dark",
        });
      }
    };

    fetchTimeList();
  }, [workspaceId]);

  const filterByDate = (date: dayjs.Dayjs) =>
    timeList.filter((item) =>
      dayjs(item.start_date, "HH:mm DD/MM/YYYY").isSame(date, "day")
    );

  const todayList = filterByDate(today);
  const tomorrowList = filterByDate(tomorrow);
  const nextDayList = filterByDate(nextDay);

  if (loading) {
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 mt-8">
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
                {item.start_date.split(" ")[0]} - {item.end_date.split(" ")[0]}
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
                {item.start_date.split(" ")[0]} - {item.end_date.split(" ")[0]}
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
                {item.start_date.split(" ")[0]} - {item.end_date.split(" ")[0]}
              </div>
            ))
          ) : (
            <p className="text-sm text-sixth italic flex items-center">Trống</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TimeList;
