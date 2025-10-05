import {parseSkillaDate} from "@/shared/lib/date"
import {seededRating} from "../model/rating"
import type {Call} from "../model/types"
import type {SkillaCall} from "./types"

export const mapToCall = (x: SkillaCall): Call => {
  const success = x.status === "Дозвонился"
  const type =
    x.in_out === 1
      ? (success ? "incoming" : "incoming-fail")
      : (success ? "outgoing" : "outgoing-fail")

  const phone = x.in_out === 1 ? (x.from_number || x.to_number) : (x.to_number || x.from_number)

  return {
    id: String(x.id),
    type,
    time: parseSkillaDate(x.date),
    employee: {
      imageUrl: x.person_avatar || "https://lk.skilla.ru/img/noavatar.jpg",
      name: [x.person_name, x.person_surname].filter(Boolean).join(" ") || "Сотрудник",
    },
    call: {
      isContact: Boolean(x.contact_name || x.contact_company),
      phone,
      name: x.contact_name || undefined,
      company: x.contact_company || undefined,
    },
    source: x.line_name || x.source || "",
    rating: seededRating(String(x.id)),
    duration: x.time ?? 0,
    recordId: x.record ?? null,
    partnershipId: x.partnership_id,
  }
}
