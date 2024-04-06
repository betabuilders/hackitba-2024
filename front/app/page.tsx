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
import CategoryBadge from "@/components/category-badge";

const EXPENSES = [
  {
    id: "bb5a5768-5d91-4c6c-8014-aa44a56be733",
    name: "Saldo 1",
    amount: "234.00",
    description:
      "Descripcion de gasto iria aca, junto con mas informacion que no puedo pensar ahora",
      categories: ["DECOR", "INFRA"]
  },
  {
	id: "7b9f077f-6db2-449c-8068-6096c3ec4eff",
    name: "Saldo 2",
    amount: "5007.32",
    description: "Una computadora cara",
    categories: ["TOOLS"]
  },
  {
	id: "197d50ff-f30c-4e11-b317-ed2cf0c76432",
    name: "Saldo 3",
    amount: "234.87",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa accusamus inventore expedita iusto nihil. Animi culpa dolor qui. Aut adipisci facilis odit",
    categories: ["DECOR"]
  },
] as Expense[];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 my-8 lg:p-24 pt-6 gap-8">
      <h1 className="text-2xl lg:text-5xl font-bold">Pagar</h1>
      <Card className="w-full h-full p-4">
        <div className="flex flex-col text-left self-start gap-2">
          <p>Filtros</p>
          <div className="flex flex-wrap justify-start gap-2 lg:gap-4 w-full [&>*]:text-black">
            { ...Object.keys(CATEGORIES).map((_,i) => <CategoryBadge category={_}/> ) }
          </div>
        </div>
      </Card>
      
      <ExpenseGrid expenses={EXPENSES} role="USER"></ExpenseGrid>
    </main>
  );
}
