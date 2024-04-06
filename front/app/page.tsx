import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { CATEGORIES } from "@/lib/constants";
import ExpenseGrid, { Expense } from "@/components/expense-grid";

const EXPENSES = [
  {
    name: "Saldo 1",
    amount: "234.00",
    description:
      "Descripcion de gasto iria aca, junto con mas informacion que no puedo pensar ahora",
      categories: ["DECOR", "INFRA"]
  },
  { name: "Saldo 2", amount: "5007.32", description: "Una computadora cara", categories: ["TOOLS"] },
  {
    name: "Saldo 3",
    amount: "234.87",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa accusamus inventore expedita iusto nihil. Animi culpa dolor qui. Aut adipisci facilis odit",
    categories: ["DECOR"]
  },
] as Expense[];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 lg:p-24 pt-6 gap-8">
      <Card className="w-full h-full p-4">
        <div className="flex flex-col text-left self-start gap-2">
          <p>Filtros</p>
          <div className="flex flex-wrap justify-start gap-2 lg:gap-4 w-full [&>*]:text-black">
            { ...Object.values(CATEGORIES).map((_,i) => <Badge className={_.style} key={i}>{_.name}</Badge> ) }
          </div>
        </div>
      </Card>
      
      <ExpenseGrid expenses={EXPENSES}></ExpenseGrid>
    </main>
  );
}
