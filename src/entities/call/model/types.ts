export type Rating = 'Отлично' | 'Хорошо' | 'Скрипт не использован' | 'Плохо' | null

export type Call = {
  id: string
  type: 'incoming' | 'outgoing' | 'incoming-fail' | 'outgoing-fail'
  time: Date
  employee: { imageUrl: string; name: string }
  call: { isContact: boolean; phone: string; name?: string; company?: string }
  source: string
  rating: Rating
  duration: number // сек
}