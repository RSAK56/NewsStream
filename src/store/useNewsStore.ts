import { create } from "zustand";
import { INewsStore } from "../constants/interfaces";

export const useNewsStore = create<INewsStore>()((set) => ({
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));
