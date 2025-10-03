import {DateDropdown} from "@/components/ui/date-dropdown.tsx";
import {TypeDropdown} from "@/components/ui/type-dropdown.tsx";


export const Filter = () => {
  return (
    <div className={'flex justify-between items-center'}>
      <TypeDropdown/>
      <DateDropdown/>
    </div>
  );
};