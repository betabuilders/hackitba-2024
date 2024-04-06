import { CATEGORIES, Expense } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import CategoryBadge from "./category-badge";
import { Plus } from "lucide-react";

export default function ExpenseGrid(props: { expenses: Expense[], role: string, filter: string[] }) {
	console.log(props.filter);
	const filteredExpenses = props.expenses.filter(e => props.filter?.every((f) => e.categories.includes(f) ) ?? true ).map((info, i) => {
		return (
		  <a href={props.role == 'ADMIN' ? `./expenses/${info.id}` : `./pay/${info.id}/`} className="w-full h-full">
			  <Card key={i} className="w-full h-full">
				  <CardHeader>
				  <CardTitle >{info.name}</CardTitle>
				  <CardDescription className="flex flex-col gap-2">
					  AR$ {info.amount}
				  </CardDescription>
				  <div className="flex flex-row gap-2">
					  { ...info.categories.map((e, k) => <CategoryBadge key={k} category={e}/> ) }
				  </div>
				  </CardHeader>
				  <CardContent>
				  <p>{info.description}</p>
				  </CardContent>
			  </Card>
		  </a>
		);
	});

    return <div className="grid-cols grid auto-rows-min grid-cols-1 lg:grid-cols-4 items-start justify-start gap-4 w-full">
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