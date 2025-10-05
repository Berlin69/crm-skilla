import type {Rating} from "./types"

const POOL: Rating[] = ['Отлично', 'Хорошо', 'Скрипт не использован', 'Плохо', null]

export const seededRating = (seed: string): Rating => {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return POOL[h % POOL.length]
}