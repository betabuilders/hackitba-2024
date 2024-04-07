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
import { MouseEvent, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentDescription({ params } : { params: { expense: string, cbu: string }} ) {
    const ALIAS = useSearchParams().get('cbu');
    const DESCRIPTION = useSearchParams().get('description');
    const AMOUNT = useSearchParams().get('amount');

    const expenseData = EXPENSES.find((e) => e.id == params.expense);

    return <>
        <div className="rounded border border-green-600 w-fit p-8 flex flex-col items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl lg:text-3xl font-mono">Operacion <span className="text-green-200 dark:text-green-400">exitosa</span></h1>
                <hr className="my-4"/>
                <h1 className="text-2xl lg:text-4xl uppercase">{expenseData?.name}</h1>
                <h1 className="text-xl opacity-50 text-center mb-2">
                    $ { AMOUNT }
                </h1>
            </div>
            <AvatarCascade imageSources={expenseData?.people.map((url) => `/avatars/${url}.jpeg`)} className="h-16 w-16 rounded-full ring-2 ring-neutral-200 dark:ring-neutral-700 -ring-offset-2"/>
            <div className="flex flex-col items-center gap-2 w-full">
                <ArrowDownIcon className="w-8 h-8 text-blue-400 dark:text-blue-200"/>
                <h2 className="text-sm opacity-50 text-center mb-2 font-mono uppercase">{ALIAS}</h2>
            </div>
            <hr className="w-full color-white p-2"/>
            <p className="font-light">{DESCRIPTION}</p>
        </div>

    </>
}