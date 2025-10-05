import {useQuery} from "@tanstack/react-query"
import {getRecord} from "@/entities/call/api/get-record.ts";

type Params = {
  recordId?: string | null
  partnershipId?: string
}

export function useCallRecord({recordId, partnershipId}: Params) {
  const q = useQuery({
    queryKey: ["call-record", recordId, partnershipId],
    enabled: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (!recordId || !partnershipId) throw new Error("record params missing")
      return getRecord({recordId, partnershipId})
    },
  })

  return {
    blob: q.data,
    isFetching: q.isFetching,
    isError: q.isError,
    error: q.error,
    refetch: q.refetch,
  }
}
