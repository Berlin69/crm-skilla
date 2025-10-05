import type {SkillaCall, SkillaListResponse} from "@/entities/call/api/types.ts";
import {api} from "@/shared/api/axios.ts";
import type {Call} from "@/entities/call/model/types.ts";
import {mapToCall} from "@/entities/call/api/map.ts";

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
  const raw = res.data.results

  const inRange = (x: SkillaCall) => {
    const ymd = x.date_notime ?? x.date.slice(0, 10)
    return ymd >= params.dateStart && ymd <= params.dateEnd
  }
  const byDateServerOK = raw.every(inRange)
  const byDirServerOK =
    params.inOut === undefined ? true : raw.every(x => x.in_out === params.inOut)

  const serverRespectsFilters = byDateServerOK && byDirServerOK

  const base = serverRespectsFilters ? raw : raw.filter(inRange)
  const byDir =
    params.inOut !== undefined ? base.filter(x => x.in_out === params.inOut) : base

  const offset = params.offset ?? 0
  const page =
    typeof params.limit === "number" && !serverRespectsFilters
      ? byDir.slice(offset, offset + params.limit)
      : byDir

  return page.map(mapToCall)
}
