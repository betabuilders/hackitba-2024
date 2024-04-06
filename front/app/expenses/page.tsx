"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { CATEGORIES, EXPENSES } from "@/lib/constants";
import ExpenseGrid from "@/components/expense-grid";
import CategoryBadge from "@/components/category-badge";
import { useState } from "react";

export default function Home() {
  const [filters, setFilters] = useState(Object.keys(CATEGORIES).reduce((prev, curr) => (prev[curr] = false, prev), {} as {[key: string]: boolean}));

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 my-8 lg:p-24 pt-6 gap-8">
      <h1 className="text-2xl lg:text-5xl font-bold">Presupuestos disponibles</h1>
      <Card className="w-full h-full p-4">
        <div className="flex flex-col text-left self-start gap-2">
          <p>Filtros</p>
          <div className="flex flex-wrap justify-start gap-2 lg:gap-4 w-full [&>*]:text-black">
            { ...Object.keys(CATEGORIES).map((_,i) => <CategoryBadge key={i} category={_} className="cursor-pointer" onClick={
					filters[_] ? 
					() => { setFilters(fil => { fil[_] = false; return { ...fil }; }); }
					: () => { setFilters(fil => { fil[_] = true; return { ...fil }; }); }
				} />
            )}
          </div>
        </div>
      </Card>
      
      <ExpenseGrid filter={Object.keys(filters).filter(k => filters[k])} expenses={EXPENSES} role="USER"></ExpenseGrid>
    </main>
  );
}
