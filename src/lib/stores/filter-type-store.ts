import {create} from 'zustand'

export type DirectionOption = { label: string; value: 'all' | 1 | 0 }

interface FilterTypeState {
  selectedType: DirectionOption
  changeSelectedType: (value: DirectionOption) => void
}

export const useFilterTypeStore = create<FilterTypeState>()((set) => ({
  selectedType: {label: 'Все типы', value: 'all'},
  changeSelectedType: (value) => set({selectedType: value}),
}))