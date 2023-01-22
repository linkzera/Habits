import * as Dialog from "@radix-ui/react-dialog";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check, Plus, X } from "phosphor-react";

import logo from "../assets/logo.svg";
import { FormEvent, useState } from "react";
import { api } from "../lib/axios";

const weekDaysAvailable = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export const Header = () => {
  return (
    <div className="w-full max-w-3xl mx-auto flex items-center justify-between">
      <img src={logo} alt="Habit Tracker" />
      <Modal />
    </div>
  );
};

const Modal = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="flex gap-3 items-center border font-semibold border-violet-500 py-4 px-6 my-2 rounded-lg hover:border-violet-300 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-background">
        <Plus
          size={20}
          weight="bold"
          className="text-violet-500 font-semibold"
        />
        Novo Hábito
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="w-screen h-screen bg-black/80 fixed inset-0" />
        <Dialog.Content className="absolute w-full max-w-lg bg-zinc-900 rounded-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-10">
          <Dialog.Close className="absolute top-6 right-6 text-zinc-400 rounded-lg hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-background">
            <X size={24} aria-label="fechar" />
          </Dialog.Close>
          <Dialog.Title className="text-3xl leading-tight font-extrabold">
            Criar Hábito
          </Dialog.Title>

          <NewHabitForm />
          <Dialog.Description />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const NewHabitForm = () => {
  const [weekDays, setWeekDays] = useState<number[]>([]);
  const [title, setTitle] = useState("");

  function createNewHabit(event: FormEvent) {
    event.preventDefault();

    if (!title || weekDays.length === 0) {
      return;
    }

    api.post("/habits", { title, weekDays }).then(() => {
      setTitle("");
      setWeekDays([]);
      alert("Hábito criado com sucesso!");
    });
  }

  function handleToggleWeekDay(day: number) {
    if (weekDays.includes(day)) {
      const filteredWeekDays = weekDays.filter((item) => item !== day);
      setWeekDays(filteredWeekDays);
    } else {
      setWeekDays([...weekDays, day]);
    }
  }

  return (
    <form
      onSubmit={(event) => createNewHabit(event)}
      className="w-full flex flex-col mt-6"
    >
      <label htmlFor="title" className="font-semibold leading-tight">
        Qual seu comprometimento?
      </label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Ex: Estudar React, ler um livro, etc."
        autoFocus
        className="rounded-lg p-4 text-white bg-zinc-800 placeholder-zinc-400 mt-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
      />

      <label htmlFor="" className="font-semibold leading-tight mt-4">
        Qual a recorrência?
      </label>

      <div className="flex flex-col items-start mt-3 gap-2">
        {weekDaysAvailable.map((day, index) => (
          <Checkbox.Root
            className="flex items-center gap-3 group focus:outline-none"
            key={day}
            checked={weekDays.includes(index)}
            onCheckedChange={() => handleToggleWeekDay(index)}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500  group-focus:ring-2 group-focus:ring-violet-500 group-focus:ring-offset-2 group-focus:ring-offset-background  transition-colors">
              <Checkbox.Indicator>
                <Check size={20} weight="bold" className="text-white" />
              </Checkbox.Indicator>
            </div>

            <span className="font-regular leading-tight text-base">{day}</span>
          </Checkbox.Root>
        ))}
      </div>

      <button
        type="submit"
        className="flex items-center gap-3 mt-6 bg-green-500 hover:bg-green-800 py-4 justify-center rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-colors"
      >
        <Check size={20} weight="bold" />
        Confirmar
      </button>
    </form>
  );
};
