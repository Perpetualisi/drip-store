import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ThemeStore {
  isDark: boolean
  toggle: () => void
  setDark: (val: boolean) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: false,
      toggle: () => set((state) => ({ isDark: !state.isDark })),
      setDark: (val) => set({ isDark: val }),
    }),
    { name: "drip-theme" }
  )
)