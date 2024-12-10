import React, { useState } from "react";

import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button";
import { ChevronsUpDown, Check } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandList,
  CommandGroup,
  CommandItem,
} from "./ui/command";
import { cn } from "@/lib/utils";
import DropDownData from "@/types/DropDownData";

interface ComboboxProps {
  dropDownData: DropDownData[];
  idleText: string;
  searchText: string;
  className?: string;
  onSelected?: (value: string) => void;
}

const Combobox = (props: ComboboxProps) => {
  const { dropDownData, onSelected, idleText, searchText, className } = props;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={"justify-between " + className}
        >
          {value
            ? dropDownData.find((data) => data.value === value)?.name
            : `${idleText}`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        {/* <PopoverContent className="w-full p-0"> */}
        <Command>
          <CommandInput placeholder={`${searchText}`} className="h-9" />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {dropDownData.map((data) => (
                <CommandItem
                  key={data.value}
                  value={data.name}
                  onSelect={(currentName) => {
                    setValue(
                      dropDownData.find((e) => {
                        return e.name === currentName;
                      })!.value
                    );
                    onSelected &&
                      onSelected(
                        dropDownData.find((e) => {
                          return e.name === currentName;
                        })!.value
                      );
                    setOpen(false);
                  }}
                >
                  {data.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === data.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Combobox;
