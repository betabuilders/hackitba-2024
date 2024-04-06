import { CATEGORIES } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

export type Expense = {
    name: string,
    amount: string,
    description: string,
    categories: string[],
}

export default function ExpenseGrid(props: {expenses: Expense[] }) {
    return <div className="grid-cols grid auto-rows-min grid-cols-1 lg:grid-cols-4 items-start justify-start gap-4">
        {...props.expenses.map((info, i) => {
          return (
            <Card key={i} className="w-full h-full">
              <CardHeader>
                <CardTitle>{info.name}</CardTitle>
                <CardDescription className="flex flex-col gap-2">
                  <p>AR$ {info.amount}</p>
                  <div className="flex flex-row gap-2">
                    { ...info.categories.map((e, i) => <Badge className={CATEGORIES[e].style} key={i + info.name}>{CATEGORIES[e].name}</Badge> ) }
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{info.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
}