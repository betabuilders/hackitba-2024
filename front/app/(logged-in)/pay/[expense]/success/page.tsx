"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EXPENSES, Expense } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ArrowDownIcon } from "@radix-ui/react-icons";
import AvatarCascade from "@/components/avatar-cascade";
import { MouseEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { CameraIcon } from "lucide-react";
import { createPayment, getExpense, getID } from "@/actions/action";

export default function PaymentDescription({ params } : { params: { expense: string, cbu: string }} ) {
    const ALIAS = useSearchParams().get('cbu');
    const DESCRIPTION = useSearchParams().get('description');
    const AMOUNT = useSearchParams().get('amount');

    const [expenseData, setExpenseData] = useState<Expense>();

    useEffect(() => {
        getExpense(params.expense).then(data => setExpenseData(data));
        getID().then(id => {
            console.log({id, expense: params.expense, amount: -Number(AMOUNT), cbu: ALIAS, description: DESCRIPTION});
            createPayment(Number(id), params.expense, -Number(AMOUNT), ALIAS, DESCRIPTION)});
    }, []);

    return <>
        <div className="rounded border border-green-600 w-fit p-8 flex flex-col items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl lg:text-3xl font-mono">Operacion <span className="text-green-600 dark:text-green-400">exitosa</span></h1>
                <hr className="my-4"/>
                <h1 className="text-2xl lg:text-4xl uppercase">{expenseData?.title}</h1>
                <h1 className="text-xl opacity-50 text-center mb-2">
                    $ { AMOUNT }
                </h1>
            </div>
            <AvatarCascade imageSources={expenseData?.members.map((url) => `/avatars/${url.avatar}`)} className="h-16 w-16 rounded-full ring-2 ring-neutral-200 dark:ring-neutral-700 -ring-offset-2"/>
            <div className="flex flex-col items-center gap-2 w-full">
                <ArrowDownIcon className="w-8 h-8 text-blue-400 dark:text-blue-200"/>
                <h2 className="text-sm opacity-50 text-center mb-2 font-mono uppercase">{ALIAS}</h2>
            </div>
            <hr className="w-full color-white p-2"/>
            <p className="font-light">{DESCRIPTION}</p>
        </div>
        <Card className="flex flex-row p-2 opacity-50">
            Cargar ticket <CameraIcon className="ml-3 size-5"/>
        </Card>
    </>
}