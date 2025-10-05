import {api} from '@/lib/axios'

// --- API (минимум полей, без домыслов) ---
export interface SkillaCall {
  id: number
  date: string            // "YYYY-MM-DD HH:mm:ss"
  time: number            // длительность в секундах
  in_out: 0 | 1           // 1 входящий, 0 исходящий
  status: 'Дозвонился' | 'Не дозвонился'
  from_number: string
  line_name?: string
  source?: string
  contact_name?: string
  contact_company?: string
  person_name?: string
  person_surname?: string
  person_avatar?: string
}

export interface SkillaListResponse {
  total_rows: string
  results: SkillaCall[]
}

// --- Твой доменный тип ---
export type Call = {
  id: string
  type: 'incoming' | 'outgoing' | 'incoming-fail' | 'outgoing-fail'
  time: Date
  employee: { imageUrl: string; name: string }
  call: { isContact: boolean; phone: string; name?: string; company?: string }
  source: string
  rating: 'Отлично' | 'Хорошо' | 'Скрипт не использован' | 'Плохо' | null
  duration: number
}

// helpers
const parseApiDate = (s: string) => new Date(s) // формат API безопасно парсится современными браузерами

// Skilla → Call
export function mapToCall(x: SkillaCall): Call {
  const success = x.status === 'Дозвонился'
  const type =
    x.in_out === 1
      ? (success ? 'incoming' : 'incoming-fail')
      : (success ? 'outgoing' : 'outgoing-fail')

  return {
    id: String(x.id),
    type,
    time: parseApiDate(x.date),
    employee: {
      imageUrl: x.person_avatar || 'https://lk.skilla.ru/img/noavatar.jpg',
      name: [x.person_name, x.person_surname].filter(Boolean).join(' ') || 'Сотрудник',
    },
    call: {
      isContact: Boolean(x.contact_name || x.contact_company),
      phone: x.from_number,
      name: x.contact_name || undefined,
      company: x.contact_company || undefined,
    },
    source: x.line_name || x.source || '',
    rating: null,           // в /getList явного рейтинга нет
    duration: x.time ?? 0,
  }
}

// Вызов API со серверной сортировкой
export async function fetchCalls(params: {
  dateStart: string // 'YYYY-MM-DD'
  dateEnd: string   // 'YYYY-MM-DD'
  sortBy?: 'date' | 'duration'
  order?: 'ASC' | 'DESC'
  limit?: number
  offset?: number
}): Promise<Call[]> {
  const res = await api.post<SkillaListResponse>('/mango/getList', null, {
    params: {
      date_start: params.dateStart,
      date_end: params.dateEnd,
      sort_by: params.sortBy,
      order: params.order,
      limit: params.limit,
      offset: params.offset,
    },
  })
  return res.data.results.map(mapToCall)
}
