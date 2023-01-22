import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "phosphor-react";

interface CheckboxHabitProps {
  title: string;
  checked: boolean;
  disabled?: boolean;
  id: string;
  toggle: (id: string) => void;
}

export function CheckboxHabit(props: CheckboxHabitProps) {
  return (
    <Checkbox.Root
      className="flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed"
      checked={props.checked}
      disabled={props.disabled}
      onCheckedChange={() => props.toggle(props.id)}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500  
      group-focus:outline-none group-focus:ring-2 group-focus:ring-violet-500 group-focus:ring-offset-2 group-focus:ring-offset-background
      transition-colors"
      >
        <Checkbox.Indicator>
          <Check size={20} weight="bold" className="text-white" />
        </Checkbox.Indicator>
      </div>

      <span className="font-semibold leading-tight text-xl group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
        {props.title}
      </span>
    </Checkbox.Root>
  );
}
