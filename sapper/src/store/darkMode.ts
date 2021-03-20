import { writable } from "svelte/store";

const dark = () => {
  const { subscribe, set, update } = writable(false);

  const turnOff = () => {
    set(false);
    document.documentElement.classList.remove("dark");
  };

  const turnOn = () => {
    set(true);
    document.documentElement.classList.add("dark");
  };

  return {
    subscribe,
    set,
    update,
    turnOff: turnOff,
    turnOn: turnOn,
  };
};

export const darkMode = dark();
