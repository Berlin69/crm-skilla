import type {ColumnDef} from "@tanstack/react-table"
import {IconIncoming, IconIncomingFail, IconOutgoing, IconOutgoingFail, IconUserFallback} from "@/components/icons";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {getRatingVariant} from "@/shared/lib/get-rating-variant.ts";
import {formatDuration} from "@/shared/lib/format-duration.ts";
import {ChevronDown} from "lucide-react"
import {Button} from "@/components/ui/button.tsx";
import type {Call} from "@/entities/call/model/types"


export const columns: ColumnDef<Call>[] = [
  {
    accessorKey: "type",
    header: "Тип",
    cell: ({row}) => {
      const call = row.original

      if (call.type === "incoming") {
        return <IconIncoming/>
      }
      if (call.type === "outgoing") {
        return <IconOutgoing/>
      }
      if (call.type === "incoming-fail") {
        return <IconIncomingFail/>
      }
      if (call.type === "outgoing-fail") {
        return <IconOutgoingFail/>
      }
    }
  },
  {
    accessorKey: "time",
    header: ({column}) => {
      const sorted = column.getIsSorted() as false | "asc" | "desc"
      return (
        <Button
          className={'px-0'}
          variant="inline"
          onClick={() => column.toggleSorting(sorted === "asc")}
          aria-sort={sorted ? (sorted === "asc" ? "ascending" : "descending") : "none"}
        >
          Время
          <ChevronDown
            className={
              "ml-1 h-4 w-4 transition-transform duration-200 " +
              (sorted ? "opacity-100 " : "opacity-40 ") +
              (sorted === "asc" ? "rotate-180" : "")
            }
          />
        </Button>
      )
    },
    sortingFn: (rowA, rowB) =>
      rowA.original.time.getTime() - rowB.original.time.getTime(),
    cell: ({row}) => {
      const call = row.original

      const timeString = call.time.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});
      return (<span>{timeString}</span>)
    }
  },
  {
    accessorKey: "employee",
    header: "Сотрудник",
    cell: ({row}) => {
      const call = row.original

      return (<Avatar>
        <AvatarImage src={call.employee.imageUrl}/>
        <AvatarFallback className={'bg-[#eaf0fa] size-[32px]'}>
          {/*{call.employee.name.split(' ').map(name => name[0])}*/}
          <IconUserFallback/>
        </AvatarFallback>
      </Avatar>)
    }
  },
  {
    accessorKey: "call",
    header: "Звонок",
    cell: ({row}) => {
      const call = row.original

      return (
        <div>
          {call.call.isContact ? <div className={'grid grid-cols-1'}><span>{call.call.name}</span><span
              className={'text-[#5E7793]'}>{call.call.company ? call.call.company : call.call.phone}</span></div> :
            <span>{call.call.phone}</span>}
        </div>
      )
    }
  },
  {
    accessorKey: "source",
    header: "Источник",
    cell: ({row}) => {
      const call = row.original
      return <p className={'text-[#5E7793] max-w-[197px] text-wrap'}>{call.source}</p>
    }
  },
  {
    accessorKey: "rating",
    header: "Оценка",
    cell: ({row}) => {
      const call = row.original
      return (
        <Badge variant={getRatingVariant(call.rating)}>
          {call.rating}
        </Badge>
      )
    }
  },
  {
    accessorKey: "duration",
    header: ({column}) => {
      const sorted = column.getIsSorted() as false | "asc" | "desc"

      return (
        <Button
          className="px-0"
          variant="inline"
          onClick={() => column.toggleSorting(sorted === "asc")}
          aria-sort={sorted ? (sorted === "asc" ? "ascending" : "descending") : "none"}
        >
          Длительность
          <ChevronDown
            className={
              "ml-1 h-4 w-4 transition-transform duration-200 " +
              (sorted ? "opacity-100 " : "opacity-40 ") +
              (sorted === "asc" ? "rotate-180" : "")
            }
          />
        </Button>
      )
    },
    sortingFn: (a, b) => a.original.duration - b.original.duration,
    cell: ({row}) => <p className={'text-end'}>{formatDuration(row.original.duration)}</p>,
  },
]