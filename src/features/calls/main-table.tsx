import {useMemo} from "react"
import {toYMD} from "@/shared/lib/date"
import {useFilterTypeStore} from "@/lib/stores/filter-type-store"
import {columns} from "@/features/calls/columns.tsx";
import {DataTable} from "@/features/calls/data-table.tsx";
import {useCalls} from "@/entities/call/hooks/use-calls.ts";
import {useFilterDateStore} from "@/lib/stores/filter-date-store.ts";


export const MainTable = () => {
  const selectedType = useFilterTypeStore(s => s.selectedType)
  const inOutParam: 0 | 1 | undefined =
    selectedType.value === 'all' ? undefined : selectedType.value

  const start = useFilterDateStore(s => s.start)
  const end = useFilterDateStore(s => s.end)

  const params = useMemo(() => ({
    dateStart: toYMD(start),
    dateEnd: toYMD(end),
    sortBy: "date" as const,
    order: "DESC" as const,
    limit: 50,
    offset: 0,
    inOut: inOutParam,
  }), [start, end, inOutParam])

  const {data = [], isLoading, isError} = useCalls(params)

  if (isLoading) return <div className="p-4 text-sm text-muted-foreground">Загрузка…</div>
  if (isError) return <div className="p-4 text-sm text-destructive">Ошибка загрузки</div>

  return (
    <div className="mx-auto py-10 pt-4">
      <DataTable columns={columns} data={data}/>
    </div>
  )
}
