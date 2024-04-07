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

const formSchema = z.object({
    cbu: z.string().min(4, {
        message: "Porfavor ingrese un numero de CBU correcto"
    })
});

function onSubmit(data: z.infer<typeof formSchema>, expense?: Expense) {
    console.log(data);
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

    const expenseData = EXPENSES.find((e) => e.id == params.expense);

    return <>
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
        <div className="flex flex-col items-center gap-2 w-full">
            <ArrowDownIcon className="w-8 h-8 text-blue-400 dark:text-blue-200"/>
            <h2 className="text-sm opacity-50 text-center mb-2 font-mono">
                Destino</h2>
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
                    <Button type="submit" className="w-full bg-blue-200">Continuar</Button>
                </form>
            </Form>
        </div>
    </>
}