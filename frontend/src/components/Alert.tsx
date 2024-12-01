import React, { ReactNode } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button";

interface AlertProps {
    title: string;
    description: string;
    open: boolean;
    children?: ReactNode;
}

const Alert = (props: AlertProps) => {

    const { title, description, open, children } = props

    console.log(children)


    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{ title }</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    { description }
                </AlertDialogDescription>
                <AlertDialogFooter>
                {/* this part will be filled */}
                { children }
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default Alert;