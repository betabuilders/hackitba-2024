"use client"; 

import { ReactNode } from "react";
import Link from "next/link";

import { Sheet, SheetTrigger, SheetContent, SheetClose } from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
  } from "@/components/ui/navigation-menu";

export function MobileNavBar({ children, ...props} : { children?: ReactNode } & { [key:string]:any } ) {
    return <>{children}</>
}

export function DesktopNavBar({ children, ...props} : { children?: ReactNode } & { [key:string]:any } ) {
    return <nav>
        <div className="flex w-full h-[100px] bg-red-300 text-center justify-center items-center font-bold uppercase">
            <p>Nav bar</p>
        </div>
    </nav>
}