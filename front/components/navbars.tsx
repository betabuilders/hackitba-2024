"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";

import { Sheet, SheetTrigger, SheetContent, SheetClose } from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";

import { HamburgerMenuIcon } from '@radix-ui/react-icons';

import { LINKS } from "@/lib/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar } from "./ui/avatar";
import { getAvatar, getNames, isAdmin } from "@/actions/action";

export function MobileNavBar({
  children,
  ...props
}: { children?: ReactNode } & { [key: string]: any }) {
	const pathname = usePathname();
	const [admin, setRole] = useState(false);

	useEffect(() => {
		isAdmin().then(v => setRole(v));
	}, []);

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
				{LINKS.filter(f => f.admin == true && admin == false).map((link) => 
					<a rel="prefetch" href={link.href} key={link.name}>
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
	const [admin, setRole] = useState(false);
	const [avatar, setAvatar] = useState("");
	const [name, setName] = useState("");

	useEffect(() => {
		isAdmin().then(v => setRole(v));
		getAvatar().then(v => setAvatar(v));
		getNames().then(v => setName(v));
	}, []);

	
	return (
		<nav className="hidden z-50 lg:block">
			<div className="fixed top-0 flex h-0 lg:h-16 w-full items-center justify-between bg-primary/10 z-50 text-center font-bold px-24">
				<p>Bienvenido, {name}!</p>
				<div className="flex flex-row justify-end items-center gap-4 font-semibold">
					{...LINKS.filter(f => !(f.admin == true && admin == false)).map((l) => {
						return <div key={l.name} className={cn("py-1 px-2 rounded-sm border bg-white/20 border-blue-200 h-fit", pathname == l.href ? "font-normal text-gray-800" : "")}>
							<a rel="prefetch" href={l.href}>{l.name}</a>
						</div>
					})}
					{
						<Avatar><img src={`/avatars/${avatar}`} key={'pfp'} /></Avatar>
					}
				</div>
			</div>
		</nav>
	);
}
