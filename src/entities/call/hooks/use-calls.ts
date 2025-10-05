import {useQuery, keepPreviousData} from "@tanstack/react-query"

import type {Call} from "../model/types"
import {fetchCalls, type FetchCallsParams} from "@/entities/call/api/fetch-calls.ts";

export function useCalls(params: FetchCallsParams) {
  return useQuery<Call[]>({
    queryKey: ["calls", params],
    queryFn: () => fetchCalls(params),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })
}
