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

import { getExpenses, getOrganization, isAdmin } from "@/actions/action"; 
import { cn } from "@/lib/utils";

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [role, setRole] = useState(false);
  const [organization, setOrganization] = useState({});
  const [filters, setFilters] = useState(Object.keys(CATEGORIES).reduce((prev, curr) => (prev[curr] = false, prev), {} as { [key: string]: boolean }));
  
  useEffect(() => {
    getExpenses().then(res => setExpenses(res.data));
    isAdmin().then(res => setRole(res));
    getOrganization().then(res => setOrganization(res));
  }, []);


  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 my-8 lg:p-24 pt-10 gap-8">
      <div className="flex w-full gap-4 justify-between items-center">
        
        <div>
          <h1 className="text-2xl lg:text-5xl font-bold">
            {organization.name}
          </h1>
          <h2 className="text-lg lg:text-2xl font-light">
            {organization.description}
          </h2>
        </div>
        {
          role ? 
            <div className="flex flex-col lg:flex-row gap-4 w-full justify-end">
              <div className="bg-card px-4 lg:px-8 py-2 rounded-lg flex flex-col content-between border justify-center">
                <h1 className="text-sm lg:text-lg font-bold text-left">
                  Sin Asignar:
                </h1>
                <h1 className="text-2xl lg:text-5xl font-bold font-mono text-right">
                  ${organization.availableBalance}
                </h1>
              </div>
              <div className="bg-card px-4 lg:px-8 py-2 rounded-lg flex flex-col content-between border">
                <h1 className="text-sm lg:text-lg font-bold text-left">
                  Fondos Totales:
                </h1>
                <h1 className="text-2xl lg:text-5xl font-bold font-mono text-right">
                  ${organization.totalFunds}
                </h1>
              </div>

            </div> : null
        }

      </div>
      <Card className="w-full h-full p-4">
        <div className="flex flex-col text-left self-start gap-2">
        <h1 className="text-2xl lg:text-5xl font-bold">{role ? "Presupuestos existentes" : "Presupuestos Disponibles"}</h1>
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

      <ExpenseGrid filter={Object.keys(filters).filter(k => filters[k])} expenses={expenses} role={role}></ExpenseGrid>
    </main>
  );
}
