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

interface FirstEnterDialogProps {
  isDialogOpen: boolean;
  onFinished?: (name: string) => void;
}

const FirstEnterDialog = (props: FirstEnterDialogProps) => {
  const [nameField, setNameField] = useState("");
  const [namePageVisible, setNamePageVisible] = useState(true);

  const { isDialogOpen, onFinished } = props;

  const onNameSubmit = () => {
    if (
      !(
        document.querySelector("#name_input") as HTMLInputElement
      ).reportValidity()
    ) {
      let form = document.querySelector("#name_form");
      let tmpSubmit = document.createElement("button");
      form!.appendChild(tmpSubmit);
      tmpSubmit.click();
      form!.removeChild(tmpSubmit);
      document.querySelector("#name_input")?.classList.add("border-red-600");
    } else {
      setNamePageVisible(false);
    }
  };

  return (
    <AlertDialog open={isDialogOpen}>
      {namePageVisible ? (
        <AlertDialogContent
          className={"sm:max-w-[425px] transition-all outline-none"}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Welcome to the game!</AlertDialogTitle>
            <AlertDialogDescription>
              Enter your profile here. Click next when you're done.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <form
              id="name_form"
              className="grid grid-cols-4 items-center gap-4"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onNameSubmit();
                }
              }}
            >
              <Label className="text-right">Name</Label>
              <Input
                value={nameField}
                onChange={(e) => setNameField(e.target.value)}
                id="name_input"
                required
                className="col-span-3"
              />
            </form>
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
        </AlertDialogContent>
      ) : (
        <AlertDialogContent
          className={"sm:max-w-[425px] transition-transform outline-none"}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Welcome to the game!</AlertDialogTitle>
            <AlertDialogDescription>Story of the game.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="inline flex-col items-center gap-4">
              Welcome to the world of "Carbon Code: The Spy Energy Race!" In the
              year 2200, the world is depleted of resources, and countries are
              engaged in fierce competition to find{" "}
              <span className="text-cyan-600">clean energy</span>. You will play
              the role of a spy, infiltrating different countries to locate
              inventor teams and steal their research. As a spy, you must work
              within the{" "}
              <span className="text-red-600">
                {" "}
                limited carbon emission restrictions{" "}
              </span>
              , searching for clues, gathering information, and ensuring that
              your country stays ahead in the clean energy race. Your mission
              begins now, and <span className="text-green-600">good luck!</span>
            </div>
          </div>
          <AlertDialogFooter>
            <Button
              onClick={() => {
                // localStorage.setItem("user", `${nameField}`);
                // setUsername(nameField);
                // setIsDialogOpen(false);
                onFinished && onFinished(nameField);
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
