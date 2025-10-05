import {create} from "zustand"

export type DatePreset = "days" | "week" | "month" | "year" | "custom"

export interface DateFilterState {
  preset: DatePreset
  // диапазон всегда «включительно»
  start: Date
  end: Date
  // удобная подпись для UI (например, "3 дня" или "12.09.2025–15.09.2025")
  label: string

  setPreset: (preset: DatePreset) => void
  setCustomRange: (start: Date, end: Date) => void
  shiftPrev: () => void
  shiftNext: () => void
}

// ===== helpers =====
const addDays = (d: Date, days: number) => {
  const x = new Date(d)
  x.setDate(x.getDate() + days)
  x.setHours(0, 0, 0, 0)
  return x
}
const today = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}
const formatDMY = (d: Date) =>
  `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`
const labelFor = (preset: DatePreset, start: Date, end: Date) => {
  if (preset === "days") return "3 дня"
  if (preset === "week") return "Неделя"
  if (preset === "month") return "Месяц"
  if (preset === "year") return "Год"
  return `${formatDMY(start)}–${formatDMY(end)}`
}
const lengthForPreset = (preset: DatePreset, start: Date, end: Date) => {
  switch (preset) {
    case "days":
      return 3
    case "week":
      return 7
    case "month":
      return 30
    case "year":
      return 365
    case "custom": {
      const ms = end.getTime() - start.getTime()
      return Math.max(1, Math.round(ms / 86400000) + 1)
    }
  }
}
const rangeForPresetEndingToday = (preset: DatePreset) => {
  const end = today()
  const len = lengthForPreset(preset, end, end)
  const start = addDays(end, -(len - 1))
  return {start, end}
}

export const useFilterDateStore = create<DateFilterState>()((set, get) => {
  const {start, end} = rangeForPresetEndingToday("days")
  return {
    preset: "days",
    start, end,
    label: labelFor("days", start, end),

    setPreset: (preset) => {
      if (preset === "custom") {
        const s = get().start, e = get().end
        set({preset: "custom", label: labelFor("custom", s, e)})
      } else {
        const {start, end} = rangeForPresetEndingToday(preset)
        set({preset, start, end, label: labelFor(preset, start, end)})
      }
    },

    setCustomRange: (s, e) => {
      const start = s <= e ? s : e
      const end = s <= e ? e : s
      start.setHours(0, 0, 0, 0)
      end.setHours(0, 0, 0, 0)
      set({preset: "custom", start, end, label: labelFor("custom", start, end)})
    },

    shiftPrev: () => {
      const {preset, start, end} = get()
      const len = lengthForPreset(preset, start, end)
      const nStart = addDays(start, -len)
      const nEnd = addDays(end, -len)
      set({start: nStart, end: nEnd, label: labelFor(preset, nStart, nEnd)})
    },

    shiftNext: () => {
      const {preset, start, end} = get()
      const len = lengthForPreset(preset, start, end)
      const nStart = addDays(start, len)
      const nEnd = addDays(end, len)
      set({start: nStart, end: nEnd, label: labelFor(preset, nStart, nEnd)})
    },
  }
})