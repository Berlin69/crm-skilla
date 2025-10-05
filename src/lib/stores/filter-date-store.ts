import { create } from 'zustand'

type FilterDate = { label: string; value: string }

interface FilterDateState {
  selectedDate: FilterDate
  changeSelectedDate: (value: FilterDate) => void
}

export const useFilterDateStore = create<FilterDateState>()((set) => ({
  selectedDate: { label: '3 дня', value: 'days' },
  changeSelectedDate: (value) => set({ selectedDate: value }),
}))