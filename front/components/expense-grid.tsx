import { CATEGORIES, Expense } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import CategoryBadge from "./category-badge";
import { Plus } from "lucide-react";
import { Avatar } from "./ui/avatar";

export default function ExpenseGrid(props: { expenses: Expense[], role: string, filter: string[] }) {
	console.log(props.filter);
	const filteredExpenses = props.expenses.filter(e => props.filter?.every((f) => e.categories.includes(f) ) ?? true ).map((info, i) => {
		return (
		  <a key={i} href={props.role == 'ADMIN' ? `./expenses/${info.id}` : `./pay/${info.id}/`} className="w-full h-full">
			  <Card key={i} className="w-full h-full flex justify-between">
				<div className="grid grid-cols-5 grid-rows-1 w-full">
					<div className="col-span-3 w-full flex flex-col justify-between">
						<CardHeader className="w-full">
							<CardTitle>{info.name}</CardTitle>
							<div className="flex flex-row gap-2 overflow-x-scroll">
								{ ...info.categories.map((e, k) => <CategoryBadge key={k} category={e}/> ) }
							</div>
						</CardHeader>
						<CardContent className="flex">
							<div className="m-0 p-0">
								<div className="flex -space-x-1 overflow-hidden ">
									{info.people.map((url, i) => <Avatar key={i} className="inline-block h-10 w-10 rounded-full">
										<img key={i} src={`./avatars/${url}.jpeg`}/>
									</Avatar>)}
								</div>
							</div>
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

    return <div className="grid-cols grid auto-rows-min grid-cols-1 lg:grid-cols-3 items-start justify-start gap-4 w-full">
        {
			...(filteredExpenses.length == 0 ? [<Card className="p-4 col-span-full">
				<p className="text-xl">No se encontro un saldo perteneciente a las categorias:</p>
				<div className="inline-flex w-full gap-4">{ props.filter.map((f, i) => <CategoryBadge key={i} category={f}/>) }</div>
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