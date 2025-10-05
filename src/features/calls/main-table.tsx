import {useMemo} from "react"
import {toYMD} from "@/shared/lib/date"
import {useFilterTypeStore} from "@/lib/stores/filter-type-store"
import {columns} from "@/components/pages/main-table/columns.tsx";
import {DataTable} from "@/components/pages/main-table/data-table.tsx";
import {useCalls} from "@/entities/call/hooks/use-calls.ts"; // твой стор

export const MainTable = () => {
  const today = useMemo(() => new Date(), [])
  const dateStart = toYMD(today)
  const dateEnd = toYMD(today)

  const selectedType = useFilterTypeStore(s => s.selectedType)
  const inOutParam: 0 | 1 | undefined =
    selectedType.value === 'all' ? undefined : selectedType.value

  const params = useMemo(() => ({
    dateStart, dateEnd,
    sortBy: "date" as const,
    order: "DESC" as const,
    limit: 50,
    offset: 0,
    inOut: inOutParam,
  }), [dateStart, dateEnd, inOutParam])

  const {data = [], isLoading, isError} = useCalls(params)

  if (isLoading) return <div className="p-4 text-sm text-muted-foreground">Загрузка…</div>
  if (isError) return <div className="p-4 text-sm text-destructive">Ошибка загрузки</div>

  return (
    <div className="container mx-auto py-10 pt-4">
      <DataTable columns={columns} data={data}/>
    </div>
  )
}
