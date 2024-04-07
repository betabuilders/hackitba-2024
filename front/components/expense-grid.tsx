import { CATEGORIES, Expense } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import CategoryBadge, { CategoryContainer } from "./category-badge";
import { Plus } from "lucide-react";
import { Avatar } from "./ui/avatar";
import AvatarCascade from "./avatar-cascade";

export default function ExpenseGrid(props: { expenses: Expense[], role: string, filter: string[] }) {
	console.log(props.filter);
	const filteredExpenses = props.expenses.filter(e => props.filter?.every((f) => e.categories.includes(f) ) ?? true ).map((info, i) => {
		return (
			<a rel="prefetch" key={i} href={props.role == 'ADMIN' ? `./expenses/${info.id}` : `./pay/${info.id}/`} className="w-full h-full">
				<Card key={i} className="w-full h-full flex justify-between hover:scale-[101%] transition-transform duration-300 ease-in-out">
					<div className="grid grid-cols-5 grid-rows-1 w-full">
						<div className="col-span-3 w-full flex flex-col justify-between">
							<CardHeader className="w-full">
								<CardTitle>{info.name}</CardTitle>
								<div className="flex flex-row gap-2 w-[140%]">
									{ <CategoryContainer className="flex-wrap" categories={info.categories}/> }
								</div>
							</CardHeader>
							<CardContent className="flex">
								<AvatarCascade imageSources={info.people.map((i) => `/avatars/${i}.jpeg`)}/>
							</CardContent>
						</div>
						<div className="col-span-2 flex justify-end items-center pr-2 mr-2">
							<p className="font-bold text-2xl">$ {info.amount.split(',').map((t, i) => <span key={i} className={i == 0 ? "text-2xl" : "text-sm align-top"}>{t}</span> )}</p>
						</div>
					</div>
				</Card>
			</a>
		);
	});

    return <div className="grid-cols grid auto-rows-min grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-start justify-start gap-4 w-full">
        {
			...(filteredExpenses.length == 0 ? [<Card className="p-4 col-span-full">
				<p className="text-xl">No se encontro un saldo perteneciente a las categorias:</p>
				{/* @ts-ignore */}
				<div className="inline-flex w-full gap-4">{ <CategoryContainer categories={props.filter}/> }</div>
			</Card>] : filteredExpenses)
		}
		
		{
			props.role === 'ADMIN' ?
			<Card className="flex justify-center items-center w-full h-full">
				<Plus className="size-16"></Plus>
			</Card>
			: null
		}
      </div>
}