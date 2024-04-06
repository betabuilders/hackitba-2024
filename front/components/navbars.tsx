"use client";

import { ReactNode } from "react";
import Link from "next/link";

import { Sheet, SheetTrigger, SheetContent, SheetClose } from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";

import { HamburgerMenuIcon } from '@radix-ui/react-icons';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { LINKS } from "@/lib/constants";

export function MobileNavBar({
  children,
  ...props
}: { children?: ReactNode } & { [key: string]: any }) {
	return <nav className="block lg:hidden">
		<div className="absolute rounded border top-4 left-4 p-4 backdrop-blur-md">
			<HamburgerMenuIcon/>
		</div>
	</nav>;
}

export function DesktopNavBar({
  children,
  ...props
}: { children?: ReactNode } & { [key: string]: any }) {
  return (
    <nav className="hidden lg:block">
      <div className="flex h-16 w-full items-center justify-between bg-blue-300 text-center font-bold px-24">
        <p>Beta builders</p>
        <div className="flex flex-row justify-end gap-4 font-semibold">
			{...LINKS.map((l) => {
				return <div className="py-1 px-2 rounded-sm border bg-white/40 border-blue-200">
					<a key={l.name} href={l.href}>{l.name}</a>
				</div>
			})}
        </div>
      </div>
    </nav>
  );
}
