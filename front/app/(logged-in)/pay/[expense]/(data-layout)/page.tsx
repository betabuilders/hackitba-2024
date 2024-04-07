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
import { useEffect, useState } from "react";
import { getExpense } from "@/actions/action";

const formSchema = z.object({
    cbu: z.string().min(4, {
        message: "Porfavor ingrese un numero de CBU correcto"
    })
});

function onSubmit(data: z.infer<typeof formSchema>, expense?: Expense) {
    // @todo make a request to the server, get access and redirect
    const url = new URL(`./pay/${expense?.id}/amount`,window.location.origin);
    url.searchParams.set('cbu', data.cbu);
    new URL(window.location.href).searchParams.forEach((v, k) => url.searchParams.set(k,v));
    window.location = url.href;
}

export default function PayExpense({ params } : { params: { expense: string }} ) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cbu: "",
        },
    });

    const [expenseData, setExpenseData] = useState<Expense>();

    useEffect(() => {
        getExpense(params.expense).then(data => setExpenseData(data));
    }, []);

    return <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit((e) => onSubmit(e, expenseData))} className="space-y-8 w-full">
                <FormField
                    control={form.control}
                    name="cbu"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-sm font-light uppercase">
                            Transferí a una cuenta</FormLabel>
                        <FormControl>
                            <Input className="uppercase" placeholder="Ingresá el CBU, CVU o alias" type="text" {...field} />
                        </FormControl>
                        {/* <FormDescription>Cuenta a la que transferir dinero</FormDescription> */}
                        <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full bg-blue-400 dark:bg-blue-200 ">Continuar</Button>
                <a href={`./pay/${expenseData?.id}/amount`} rel="prefetch" className="sr-only"></a>
            </form>
        </Form>
    </div>
}