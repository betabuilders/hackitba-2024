"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EXPENSES } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function PayExpense({ params } : { params: { expense: string }} ) {
    const formSchema = z.object({
        cbu: z.string().min(4, {
            message: "Porfavor ingrese un numero de CBU correcto"
        })
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cbu: "",
        },
    });

    return <main className="flex min-h-screen flex-col items-center justify-center p-4 my-8 lg:p-24 pt-6 gap-8">
        <div className="flex flex-col justify-center items-center h-full gap-8">
            <div>
                <h2 className="text-sm opacity-50 text-center mb-2">
                    Origen:
                </h2>
                <h1 className="text-2xl lg:text-3xl uppercase">{EXPENSES.find((e) => e.id == params.expense)?.name }</h1>
            </div>
            <div className="flex -space-x-1 overflow-hidden ">
                {EXPENSES.find((e) => e.id == params.expense)?.people.map((url, i) => <Avatar key={i} className="inline-block h-10 w-10 rounded-full">
                    <img key={i} src={`/avatars/${url}.jpeg`}/>
                </Avatar>)}
            </div>
            <h2>Destino</h2>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})} className="space-y-8">
                <FormField
                    control={form.control}
                    name="cbu"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>CBU</FormLabel>
                        <FormControl>
                            <Input className="uppercase" placeholder="Ingrese cbu" type="email" {...field} />
                        </FormControl>
                        <FormDescription>Cuenta a la que transferir dinero</FormDescription>
                        <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full bg-blue-200">Submit</Button>
            </form>
        </Form>
        <hr className="w-2/3 my-6"/>
        <p className="text-sm opacity-50">
            (Pagar desde saldo ID: {params.expense.slice(params.expense.indexOf.length - 9)})
        </p>
        </div>
    </main>
}