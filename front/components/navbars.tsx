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

export function MobileNavBar({
  children,
  ...props
}: { children?: ReactNode } & { [key: string]: any }) {
  return <>{children}</>;
}

export function DesktopNavBar({
  children,
  ...props
}: { children?: ReactNode } & { [key: string]: any }) {
  return (
    <nav>
      <div className="flex h-16 w-full items-center justify-center bg-blue-300 text-center font-bold uppercase">
        <p>Beta builders</p>
      </div>
    </nav>
  );
}
