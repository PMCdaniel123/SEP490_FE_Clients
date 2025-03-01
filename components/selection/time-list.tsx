"use client";

import { timeList } from "@/constants/constant";
import dayjs from "dayjs";

function TimeList() {
  const today = dayjs();
  const tomorrow = today.add(1, "day");
  const nextDay = today.add(2, "day");

  const todayList = timeList.filter((item) =>
    dayjs(item.startDate, "HH:mm DD/MM/YYYY").isSame(today, "day")
  );

  const tomorrowList = timeList.filter((item) =>
    dayjs(item.startDate, "HH:mm DD/MM/YYYY").isSame(tomorrow, "day")
  );

  const nextDayList = timeList.filter((item) =>
    dayjs(item.startDate, "HH:mm DD/MM/YYYY").isSame(nextDay, "day")
  );

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
                {item.startDate.split(" ")[0]} - {item.endDate.split(" ")[0]}
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
                {item.startDate.split(" ")[0]} - {item.endDate.split(" ")[0]}
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
                {item.startDate.split(" ")[0]} - {item.endDate.split(" ")[0]}
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
