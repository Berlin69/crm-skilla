import {Calendar, ChevronLeft, ChevronRight} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {useState} from "react";
import {useFilterDateStore} from "@/lib/stores/filter-date-store.ts";
import {cn} from "@/lib/utils.ts";


export const DateDropdown = () => {
  const [open, setOpen] = useState(false);

  const selectedDate = useFilterDateStore(state => state.selectedDate);
  const changeSelectedDate = useFilterDateStore(state => state.changeSelectedDate);

  const dateData = [
    {
      label: '3 дня',
      value: 'days',
    },
    {
      label: 'Неделя',
      value: 'week',
    },
    {
      label: 'Месяц',
      value: 'month',
    },
    {
      label: 'Год',
      value: 'year',
    },
    {
      label: 'Указать даты',
      value: 'choose-dates',
    },
  ]

  return (
    <div className={'flex items-center gap-3'}>
      <Button
        className={'text-plt-accent-transparent hover:text-plt-accent cursor-pointer transition-colors duration-150'}
        variant={'ghost'}>
        <ChevronLeft/>
      </Button>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className={'group flex items-center gap-2 cursor-pointer'}>
          <Calendar
            className={'text-plt-accent-transparent group-hover:text-plt-accent transition-colors duration-150'}/>
          <span className={'text-plt-accent text-sm'}>
            {selectedDate.label}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={'end'}>
          {dateData.map((date) => (
            <DropdownMenuItem
              key={date.value}
              onClick={() => changeSelectedDate(date)}
              className={cn(date.value === selectedDate.value && 'text-plt-accent', 'px-5 py-1.5 grid')}
            >
              <span className={'leading-7'}>{date.label}</span>
              {date.value === 'choose-dates' &&
                  <div className={'flex items-center gap-[29px] text-plt-accent-transparent'}>
                  <span>
                    __.__.__-__.__.__
                  </span>
                    <Calendar className={'text-plt-accent-transparent'}/>
                  </div>
              }
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        className={'text-plt-accent-transparent hover:text-plt-accent cursor-pointer transition-colors duration-150'}
        variant={'ghost'}>
        <ChevronRight/>
      </Button>
    </div>
  );
};
