import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "./ui/alert-dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { Check, ChevronsUpDown } from "lucide-react";
import backendURL from "./backendURL";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Country from "@/types/Country";
import Combobox from "./Combobox";

import PlayerCountry from "@/types/PlayerCountry";
import DropDownData from "@/types/DropDownData";

interface FirstEnterReturnValue {
  name: string;
  iso_country: string;
}

interface FirstEnterDialogProps {
  isDialogOpen: boolean;
  onFinished?: (result: FirstEnterReturnValue) => void;
}

const FirstEnterDialog = (props: FirstEnterDialogProps) => {
  const [dropDownCountryValue, setDropDownCountryValue] = useState("");

  const [nameField, setNameField] = useState("");
  const [namePageVisible, setNamePageVisible] = useState(true);

  const [isInSelectCountry, setIsInSelectCountry] = useState(false);

  const { isDialogOpen, onFinished } = props;

  const [dropDownChoices, setDropDownChoices] = useState<DropDownData[]>([]);

  const onNameSubmit = () => {
    if (nameField !== "") {
      setNamePageVisible(false);
    }
  };

  useEffect(() => {
    fetch(`${backendURL}/player_country`)
      .then(async (response) => {
        const playerCountry: PlayerCountry[] = await response.json();
        if (!localStorage.getItem("user")) {
          localStorage.setItem("playerCountry", JSON.stringify(playerCountry));
        }
        const temp_array: DropDownData[] = playerCountry.map((country) => {
          return {
            value: country.iso_country,
            name: country.name,
          };
        });
        setDropDownChoices(temp_array);
      })
      .catch((error: Error) => {
        alert("Fetch error");
      });
  }, []);

  return (
    <AlertDialog open={isDialogOpen}>
      {!isInSelectCountry ? (
        <AlertDialogContent
          className={"sm:max-w-[425px] transition-all outline-none"}
        >
          {namePageVisible ? (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Welcome to the game!</AlertDialogTitle>
                <AlertDialogDescription>
                  Enter your profile here. Click next when you're done.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex justify-center items-center w-full">
                  <Label className="text-right pl-[.5rem] pr-[1rem]">
                    Name
                  </Label>
                  <Input
                    value={nameField}
                    onChange={(e) => setNameField(e.target.value)}
                    id="name_input"
                    required
                    className="col-span-3"
                  />
                </div>
              </div>
              <AlertDialogFooter>
                <Button
                  type="submit"
                  onClick={() => {
                    onNameSubmit();
                  }}
                >
                  Next <ArrowRight />
                </Button>
              </AlertDialogFooter>
            </>
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Welcome to the game!</AlertDialogTitle>
                <AlertDialogDescription>
                  Story of the game.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid gap-4 py-4">
                <div className="inline flex-col items-center gap-4">
                  Welcome to the world of "Carbon Code: The Spy Energy Race!" In
                  the year 2200, the world is depleted of resources, and
                  countries are engaged in fierce competition to find{" "}
                  <span className="text-cyan-600">clean energy</span>. You will
                  play the role of a spy, infiltrating different countries to
                  locate inventor teams and steal their research. As a spy, you
                  must work within the{" "}
                  <span className="text-red-600">
                    {" "}
                    limited carbon emission restrictions{" "}
                  </span>
                  , searching for clues, gathering information, and ensuring
                  that your country stays ahead in the clean energy race. Your
                  mission begins now, and{" "}
                  <span className="text-green-600">good luck!</span>
                </div>
              </div>
              <AlertDialogFooter>
                <Button
                  onClick={() => {
                    // localStorage.setItem("user", `${nameField}`);
                    // setUsername(nameField);
                    // setIsDialogOpen(false);
                    // onFinished && onFinished(nameField);
                    setIsInSelectCountry(true);
                  }}
                >
                  Continue to Select Country <ArrowRight />
                </Button>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      ) : (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Select Your Country</AlertDialogTitle>
            <AlertDialogDescription>
              Select your country using the dropdown list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4 w-full">
            <Combobox
              dropDownData={dropDownChoices}
              onSelected={(value) => {
                setDropDownCountryValue(value);
                // console.log(value);
              }}
              idleText="Select country..."
              searchText="Search country..."
              className="w-full"
            ></Combobox>
          </div>
          <AlertDialogFooter>
            <Button
              onClick={() => {
                // localStorage.setItem("user", `${nameField}`);
                // setUsername(nameField);
                // setIsDialogOpen(false);
                if (dropDownCountryValue !== "") {
                  const return_value: FirstEnterReturnValue = {
                    name: nameField,
                    iso_country: dropDownCountryValue,
                  };
                  console.log(return_value);
                  onFinished && onFinished(return_value);
                } else {
                  alert("Please select your country first!");
                }
              }}
            >
              Continue to the game <ArrowRight />
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
};

export default FirstEnterDialog;
