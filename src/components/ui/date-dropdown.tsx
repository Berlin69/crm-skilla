import {useEffect, useState} from "react"
import {Calendar as IconCalendar, ChevronLeft, ChevronRight} from "lucide-react"
import {Button} from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {Calendar} from "@/components/ui/calendar"        // твой wrapper
import type {DateRange} from "react-day-picker"
import {useFilterDateStore} from "@/lib/stores/filter-date-store"
import {cn} from "@/lib/utils"

export const DateDropdown = () => {
  const preset = useFilterDateStore(s => s.preset)
  const label = useFilterDateStore(s => s.label)
  const start = useFilterDateStore(s => s.start)
  const end = useFilterDateStore(s => s.end)
  const setPreset = useFilterDateStore(s => s.setPreset)
  const setCustomRange = useFilterDateStore(s => s.setCustomRange)
  const prev = useFilterDateStore(s => s.shiftPrev)
  const next = useFilterDateStore(s => s.shiftNext)

  const [menuOpen, setMenuOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [draftRange, setDraftRange] = useState<DateRange | undefined>(undefined)

  const startOfDay = (d: Date) => {
    const x = new Date(d)
    x.setHours(0, 0, 0, 0)
    return x
  }

  const handleDayClick = (day: Date) => {
    const clicked = startOfDay(day)
    const range = draftRange

    // 1) если диапазон ещё не начат или завершён — начинаем новый диапазон
    if (!range?.from || (range.from && range.to)) {
      setDraftRange({from: clicked, to: undefined})
      return
    }

    // 2) есть только from — второй клик назначает to (меняем местами при необходимости)
    const from = startOfDay(range.from)
    if (!range.to) {
      if (clicked < from) setDraftRange({from: clicked, to: from})
      else setDraftRange({from, to: clicked})
      return
    }

    // 3) обе границы заданы — двигаем ближайшую к клику (чтобы можно было сдвинуть левую границу вперёд)
    const to = startOfDay(range.to)
    const distToStart = Math.abs(clicked.getTime() - from.getTime())
    const distToEnd = Math.abs(clicked.getTime() - to.getTime())

    if (distToStart <= distToEnd) {
      // двигаем левую границу
      let newFrom = clicked
      let newTo = to
      if (newFrom > newTo) [newFrom, newTo] = [newTo, newFrom]
      setDraftRange({from: newFrom, to: newTo})
    } else {
      // двигаем правую границу
      let newFrom = from
      let newTo = clicked
      if (newFrom > newTo) [newFrom, newTo] = [newTo, newFrom]
      setDraftRange({from: newFrom, to: newTo})
    }
  }
  // Подготавливаем черновик при открытии диалога
  useEffect(() => {
    if (dialogOpen) {
      setDraftRange({from: start, to: end})
    }
  }, [dialogOpen, start, end])

  const presets = [
    {label: "3 дня", value: "days" as const},
    {label: "Неделя", value: "week" as const},
    {label: "Месяц", value: "month" as const},
    {label: "Год", value: "year" as const},
  ]

  const onApply = () => {
    if (draftRange?.from && draftRange?.to) {
      setCustomRange(draftRange.from, draftRange.to)
      setPreset("custom")
      setDialogOpen(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        className="text-plt-accent-transparent hover:text-plt-accent"
        variant="ghost"
        onClick={prev}
        aria-label="Предыдущий период"
      >
        <ChevronLeft/>
      </Button>

      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger className="group flex items-center gap-2 cursor-pointer">
          <IconCalendar className="text-plt-accent-transparent group-hover:text-plt-accent transition-colors"/>
          <span className="text-plt-accent text-sm">{label}</span>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="min-w-[220px] p-0">
          {presets.map((p) => (
            <DropdownMenuItem
              key={p.value}
              onClick={() => {
                setPreset(p.value)
                setMenuOpen(false)
              }}
              className={cn("px-5 py-1.5 leading-[28px]", p.value === preset && "text-plt-accent")}
            >
              {p.label}
            </DropdownMenuItem>
          ))}

          <DropdownMenuItem
            onClick={() => {
              setMenuOpen(false)
              setDialogOpen(true)
            }}
            className="px-5 py-2"
          >
            <div className="w-full">
              <div className="flex items-center justify-between">
                <span>Указать даты</span>
              </div>
              <div className={'flex justify-between'}>
                <div className="mt-1 text-[11px] leading-4 tracking-widest text-muted-foreground">
                  __.__.__ — __.__.__
                </div>
                <IconCalendar className="text-plt-accent-transparent"/>
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        className="text-plt-accent-transparent hover:text-plt-accent"
        variant="ghost"
        onClick={next}
        aria-label="Следующий период"
      >
        <ChevronRight/>
      </Button>

      {/* Диалог с выбором дат (range) и кнопкой «Применить» */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[620px]">
          <DialogHeader>
            <DialogTitle>Период</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Calendar
              mode="range"
              numberOfMonths={2}
              selected={draftRange}
              onDayClick={handleDayClick}
              onSelect={setDraftRange}
            />

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={onApply} disabled={!(draftRange?.from && draftRange?.to)}>
                Применить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
