import {api} from "@/shared/api/axios"

export async function getRecord(params: { recordId: string; partnershipId: string }) {
  const res = await api.post("/mango/getRecord", null, {
    params: {
      record: params.recordId,
      partnership_id: params.partnershipId,
    },
    responseType: "blob",
  })
  return res.data as Blob
}
