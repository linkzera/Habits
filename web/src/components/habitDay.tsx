import * as Popover from "@radix-ui/react-popover";
import clsx from "clsx";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { CheckboxHabit } from "./checkBox";
import { ProgressBar } from "./progressBar";

interface HabitProps {
  defaultCompleted?: number;
  amount?: number;
  date: Date;
}

export function Habit({
  defaultCompleted = 0,
  amount = 0,
  ...props
}: HabitProps) {
  const [completed, setCompleted] = useState(defaultCompleted);
  const progress = amount > 0 ? Math.round((completed / amount) * 100) : 0;

  function handleCompletedChange(completed: number) {
    setCompleted(completed);
  }
  return (
    <Popover.Root>
      <Popover.Trigger
        className={clsx(
          "w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-background",
          {
            "bg-violet-500 border-violet-400": progress >= 80,
            "bg-violet-600 border-violet-500": progress >= 60 && progress < 80,
            "bg-violet-700 border-violet-500": progress >= 40 && progress < 60,
            "bg-violet-800 border-violet-600": progress >= 20 && progress < 40,
            "bg-violet-900 border-violet-700": progress < 20 && progress > 0,
            "bg-zinc-900 border-zinc-800": progress === 0,
          }
        )}
      />
      <Popover.Portal>
        <Popover.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col">
          <HabitDayPopover
            date={props.date}
            progress={progress}
            onCompletedChange={handleCompletedChange}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

interface HabitDayPopoverProps {
  date: Date;
  progress: number;
  onCompletedChange: (completed: number) => void;
}

interface HabitsInfo {
  possibleHabits: Array<{
    id: string;
    title: string;
    createdAt: Date;
  }>;
  completedHabits: string[];
}

const HabitDayPopover = (props: HabitDayPopoverProps) => {
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>();

  useEffect(() => {
    api
      .get("day", {
        params: {
          date: props.date.toISOString(),
        },
      })
      .then((response) => {
        setHabitsInfo(response.data);
      });
  }, []);

  const isDayInPast = dayjs(props.date).endOf("day").isBefore(dayjs(), "day");

  function handleToggle(id: string) {
    api.patch(`habits/${id}/toggle`).then((response) => {
      setHabitsInfo(response.data);
      const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(id);

      let completedHabits: string[] = [];
      if (isHabitAlreadyCompleted) {
        completedHabits = habitsInfo!.completedHabits.filter(
          (habitId) => habitId !== id
        );
      } else {
        completedHabits = [...habitsInfo!.completedHabits, id];
      }
      setHabitsInfo({ ...habitsInfo!, completedHabits });
      props.onCompletedChange(completedHabits.length);
    });
  }

  return (
    <>
      <span className="text-zinc-400 font-semibold">
        {dayjs(props.date).format("dddd")}
      </span>
      <span className="text-white text-3xl font-extrabold mt-2">
        {dayjs(props.date).format("DD/MM")}
      </span>
      <ProgressBar progress={props.progress} />
      <div className="mt-6 flex flex-col gap-3">
        {habitsInfo?.possibleHabits?.map((habit) => (
          <CheckboxHabit
            id={habit.id}
            toggle={handleToggle}
            key={habit.id}
            checked={habitsInfo.completedHabits.includes(habit.id)}
            title={habit.title}
            disabled={isDayInPast}
          />
        ))}
      </div>
      <Popover.Arrow className="fill-zinc-900 h-2 w-4" />
    </>
  );
};
