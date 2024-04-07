"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EXPENSES, Expense } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useSearchParams } from "next/navigation";
import { isNumberKey } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getExpense } from "@/actions/action";

const formSchema = z.object({
    amount: z.coerce.number().min(0, {
        message: "Porfavor ingrese un monto valido"
    })
});

function onSubmit(data: z.infer<typeof formSchema>, expense?: Expense) {
    // @todo make a request to the server, get access and redirect
    const url = new URL(`./pay/${expense?.id}/description`,window.location.origin);
    url.searchParams.set('amount', data.amount.toString());
    new URL(window.location.href).searchParams.forEach((v, k) => url.searchParams.set(k,v));
    window.location = url.href;
}

export default function PaymentAmount({ params } : { params: { expense: string, cbu: string }} ) {
    const ALIAS = useSearchParams().get('cbu');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: undefined,
        },
    });

    const [expenseData, setExpenseData] = useState<Expense>();

    useEffect(() => {
        getExpense(params.expense).then(data => setExpenseData(data));
    }, []);

    return <Form {...form}>
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
            <Button type="submit" className="w-full dark:bg-blue-200 bg-blue-400">Continuar</Button>
            <a href={`./pay/${expenseData?.id}/amount`} rel="prefetch" className="sr-only"></a>
        </form>
    </Form>
}