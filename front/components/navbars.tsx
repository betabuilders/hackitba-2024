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
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MobileNavBar({
  children,
  ...props
}: { children?: ReactNode } & { [key: string]: any }) {
	const pathname = usePathname();

	return <Sheet>
		<SheetTrigger asChild>
				<Button variant="ghost"
					className="fixed z-50 top-0 m-5 p-6 border text-base bg-slate-200/20 backdrop-blur-md hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
				>
				<HamburgerMenuIcon/>
			</Button>
		</SheetTrigger>
		<SheetContent side={"left"} className="dark:backdrop-blur">
			<ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
				{LINKS.map((link) => 
					<a href={link.href} key={link.name}>
						<SheetClose className="block">
							<p className={`text-xl pb-4 font-medium ${pathname == link.href ? "opacity-50 pointer-events-none" : ""}`}>{link.name}</p>
						</SheetClose>
					</a>
				)}
			</ScrollArea>
		</SheetContent>
	</Sheet>;
}

export function DesktopNavBar({
  children,
  ...props
}: { children?: ReactNode } & { [key: string]: any }) {
	const pathname = usePathname();
	
	return (
		<nav className="hidden z-50 lg:block">
			<div className="fixed flex h-0 lg:h-16 w-full items-center justify-between bg-primary z-50 text-center font-bold px-24">
				<p>Beta builders</p>
				<div className="flex flex-row justify-end gap-4 font-semibold">
					{...LINKS.map((l) => {
						return <div key={l.name} className={cn("py-1 px-2 rounded-sm border bg-white/40 border-blue-200", pathname == l.href ? "font-normal text-gray-500" : "")}>
							<a href={l.href}>{l.name}</a>
						</div>
					})}
				</div>
			</div>
		</nav>
	);
}
