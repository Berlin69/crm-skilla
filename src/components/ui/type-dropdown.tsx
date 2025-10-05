import {useState} from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {ChevronDown, X} from "lucide-react";
import {cn} from "@/lib/utils.ts";
import {type DirectionOption, useFilterTypeStore} from "@/lib/stores/filter-type-store.ts";
import {Button} from "@/components/ui/button.tsx";

export const TypeDropdown = () => {
  const [open, setOpen] = useState(false);

  const selectedType = useFilterTypeStore(state => state.selectedType);
  const changeSelectedType = useFilterTypeStore(state => state.changeSelectedType);

  const filterTypeData: DirectionOption[] = [
    {label: "Все типы", value: "all"},
    {label: "Входящие", value: 1},
    {label: "Исходящие", value: 0},
  ]

  return (
    <div className={'flex items-center gap-4'}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className={'outline-none cursor-pointer flex items-center gap-1'}>
          <span className={cn('text-sm font-sf', selectedType.value !== 'all' && 'text-plt-accent')}>
            {selectedType.label}
          </span>
          <ChevronDown
            size={16}
            className={cn('text-plt-accent-transparent transition-transform duration-150', open && 'rotate-180 text-plt-accent')}/>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={'start'}>
          {filterTypeData.map((item) => (
            <DropdownMenuItem
              key={item.value}
              onClick={() => changeSelectedType(item)}
              className={cn(item.value === selectedType.value && 'text-plt-accent', 'leading-[18px] py-1.5 px-3')}
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {selectedType.value !== 'all' &&
          <Button
              variant={'ghost'}
              onClick={() => changeSelectedType({label: "Все типы", value: "all"})}
              className={'cursor-pointer text-[#5E7793] !px-0 hover:text-plt-accent'}>
        <span>
          Сбросить фильтры
        </span>
            <X/>
          </Button>
      }
    </div>
  );
};
