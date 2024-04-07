"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { CATEGORIES, EXPENSES, URL_API } from "@/lib/constants";
import ExpenseGrid from "@/components/expense-grid";
import CategoryBadge from "@/components/category-badge";
import { use, useState, useEffect } from "react";

import { getExpenses } from "@/actions/action"; 
import { cn } from "@/lib/utils";

const ROLE = "USER";

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState(Object.keys(CATEGORIES).reduce((prev, curr) => (prev[curr] = false, prev), {} as { [key: string]: boolean }));

  
  const get_expenses = async () => {
    await getExpenses().then(res => setExpenses(res.data));
  }

  useEffect(() => {
    get_expenses();
  }, []);


  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 my-8 lg:p-24 pt-10 gap-8">
      <h1 className="text-2xl lg:text-5xl font-bold">{ROLE == 'ADMIN' ? "Presupuestos existentes" : "Presupuestos Disponibles"}</h1>
      <Card className="w-full h-full p-4">
        <div className="flex flex-col text-left self-start gap-2">
          <p>Filtros</p>
          <div className="flex flex-wrap justify-start gap-2 lg:gap-4 w-full [&>*]:text-black">
            { ...Object.keys(CATEGORIES).map((_,i) => <CategoryBadge key={i} category={_} className={cn("cursor-pointer", filters[_] ? "opacity-50" : "opacity-100 hover:scale-[102%]" )} onClick={
              filters[_] ? 
              () => { setFilters(fil => { fil[_] = false; return { ...fil }; }); }
              : () => { setFilters(fil => { fil[_] = true; return { ...fil }; }); }
            } />
            )}
          </div>
        </div>
      </Card>

      <ExpenseGrid filter={Object.keys(filters).filter(k => filters[k])} expenses={expenses} role={ROLE}></ExpenseGrid>
    </main>
  );
}
