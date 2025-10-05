import {api} from "@/shared/api/axios"
import type {SkillaListResponse} from "./types"
import {mapToCall} from "./map"
import type {Call} from "../model/types"

export type FetchCallsParams = {
  dateStart: string
  dateEnd: string
  sortBy?: "date" | "duration"
  order?: "ASC" | "DESC"
  limit?: number
  offset?: number
  inOut?: 0 | 1
}

export async function fetchCalls(params: FetchCallsParams): Promise<Call[]> {
  const body: Record<string, unknown> = {
    date_start: params.dateStart,
    date_end: params.dateEnd,
    sort_by: params.sortBy,
    order: params.order,
    limit: params.limit,
    offset: params.offset,
  }
  if (params.inOut !== undefined) body.in_out = String(params.inOut)

  const res = await api.post<SkillaListResponse>("/mango/getList", body)

  // подстраховка: если бэк проигнорирует фильтр, отфильтруем локально
  const raw = res.data.results
  const filtered = params.inOut !== undefined ? raw.filter(x => x.in_out === params.inOut) : raw

  return filtered.map(mapToCall)
}
