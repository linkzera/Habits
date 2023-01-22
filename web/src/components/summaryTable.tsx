import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";
import { Habit } from "./habitDay";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const summaryDates = generateDatesFromYearBeginning();

const minimumSummaryDatesSize = 18 * 7; //18 weeks
const amountOfDayToFill = minimumSummaryDatesSize - summaryDates.length;

type Summary = Array<{
  id: string;
  date: string;
  completed: number;
  amount: number;
}>;

export const SummaryTable = () => {
  const [days, setDays] = useState<Summary>([]);

  useEffect(() => {
    api.get("/summary").then((response) => setDays(response.data));
  }, []);

  return (
    <div className="w-full flex max-w-4xl">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((day, i) => {
          return (
            <div
              key={`day-${i}`}
              className="text-zinc-400 text-xl font-bold h-10 w-10 flex items-center justify-center"
            >
              {day}
            </div>
          );
        })}
      </div>
      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {days.length > 0 &&
          summaryDates.map((date) => {
            const dayInSummary = days.find((day) =>
              dayjs(date).isSame(day.date, "day")
            );

            return (
              <Habit
                key={`habit-${date}`}
                date={date}
                amount={dayInSummary?.amount}
                defaultCompleted={dayInSummary?.completed}
              />
            );
          })}

        {amountOfDayToFill > 0 &&
          Array.from({ length: amountOfDayToFill }).map((_, i) => {
            return (
              <div
                key={i}
                className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg  opacity-40 cursor-not-allowed"
              />
            );
          })}
      </div>
    </div>
  );
};
