export interface SkillaPartnerData {
  id: string;
  name: string;
  phone: string
}

export interface SkillaCall {
  id: number
  partnership_id: string
  partner_data: SkillaPartnerData
  date: string
  date_notime: string
  time: number
  from_number: string
  from_extension: string
  to_number: string
  to_extension: string
  is_skilla: 0 | 1
  status: 'Дозвонился' | 'Не дозвонился'
  record: string | null
  line_number: string
  line_name: string
  in_out: 0 | 1              // 1 — входящий, 0 — исходящий
  from_site: 0 | 1
  source: string
  errors: unknown[]
  disconnect_reason: string
  results: unknown[]
  stages: unknown[]
  abuse: unknown[]
  contact_name?: string
  contact_company?: string
  person_id?: number
  person_name?: string
  person_surname?: string
  person_avatar?: string
  candidate_id?: number
  candidate_name?: string
  candidate_link?: string
  candidate_vacancy_name?: string
}

export interface SkillaListResponse {
  total_rows: string
  results: SkillaCall[]
}
