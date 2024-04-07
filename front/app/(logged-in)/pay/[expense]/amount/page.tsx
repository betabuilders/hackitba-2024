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
import { isNumberKey } from "@/lib/utils";

const formSchema = z.object({
    amount: z.coerce.number().min(0, {
        message: "Porfavor ingrese un monto valido"
    })
});

function onSubmit(data: z.infer<typeof formSchema>, expense?: Expense) {
    console.log(data);
    // @todo make a request to the server, get access and redirect
    const url = new URL(`./pay/${expense?.id}/description`,window.location.origin);
    url.searchParams.set('amount', data.amount.toString());
    new URL(window.location.href).searchParams.forEach((v, k) => url.searchParams.set(k,v));
    window.location = url.href;
}

export default function PaymentDescription({ params } : { params: { expense: string, cbu: string }} ) {
    const ALIAS = useSearchParams().get('cbu');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: undefined,
        },
    });

    const expenseData = EXPENSES.find((e) => e.id == params.expense);

    return <div className="flex flex-col justify-center items-center h-fit">
        <div className="text-center">
            <h2 className="text-sm opacity-50 text-center mb-2 font-mono">
                Origen
            </h2>
            <h1 className="text-2xl lg:text-4xl uppercase">{expenseData?.name }</h1>
            <h1 className="text-xl opacity-50 text-center mb-2">
                Disponible: $ { expenseData?.amount }
            </h1>
        </div>
        <AvatarCascade imageSources={expenseData?.people.map((url) => `/avatars/${url}.jpeg`)} className="h-16 w-16 rounded-full ring-2 ring-neutral-200 dark:ring-neutral-700 -ring-offset-2"/>
        <div className="flex flex-col items-center gap-2 w-full h-full">
            <ArrowDownIcon className="w-8 h-8 text-blue-400 dark:text-blue-200"/>
            <h2 className="text-sm opacity-50 text-center mb-2 font-mono uppercase">{ALIAS}</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => onSubmit(data, expenseData))} className="space-y-8 w-full h-full">
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="text-sm font-light uppercase">Ingrese el monto a transferir</FormLabel>
                            <FormControl>
                                <div className="flex flex-row items-center align-middle h-full">
                                    <p>$</p> <Input 
                                    className="font-ultrabold text-3xl lg:text-5xl !border-0 !outline-0 !ring-0 !shadow-none !ring-offset-0 h-fit"
                                    onKeyPress={(event) => (!isNumberKey(event) && event.preventDefault()) }
                                    placeholder="0.00"
                                    type="number"
                                    inputMode="numeric"
                                    pattern="\d+"
                                    {...field}
                                />
                                </div>
                            </FormControl>
                            {/* <FormDescription>Cuenta a la que transferir dinero</FormDescription> */}
                            <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full bg-blue-200">Continuar</Button>
                </form>
            </Form>
        </div>
    </div>
}