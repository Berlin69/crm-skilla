import {useState} from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {ChevronRight} from "lucide-react";
import {cn} from "@/lib/utils.ts";

export const TypeDropdown = () => {

  const [open, setOpen] = useState(false);
  return (
    <div>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className={'outline-none cursor-pointer flex items-center gap-1'}>
          <span>
            Все типы
          </span>
          <ChevronRight size={16}
                        className={cn('text-plt-accent transition-transform duration-150', open && 'rotate-90')}/>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={'start'}>
          <DropdownMenuItem>
            Все типы
          </DropdownMenuItem>
          <DropdownMenuItem>
            Входящие
          </DropdownMenuItem>
          <DropdownMenuItem>
            Исходящие
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
