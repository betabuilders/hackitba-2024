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

const DESCRIPTION_CHAR_LIMIT = 4;

const formSchema = z.object({
    description: z.string().min(DESCRIPTION_CHAR_LIMIT, {
        message: "Porfavor ingrese una descripcion"
    })
});

function onSubmit(data: z.infer<typeof formSchema>, expense?: Expense) {
    console.log(data);
    // @todo make a request to the server, get access and redirect
    setTimeout(() => {
        const url = new URL(`./pay/${expense?.id}/success`,window.location.origin);
        url.searchParams.set('description', data.description);
        new URL(window.location.href).searchParams.forEach((v, k) => url.searchParams.set(k,v));
        document.querySelector("#green-bubble")?.remove();
        window.location = url.href;
    }, 1200);
}

function createGreenBubble(e: MouseEvent<HTMLButtonElement, MouseEvent>){
    const div = document.createElement('div') as HTMLDivElement;
    let size = 20;
    div.style.background = "#22c55e";
    div.style.width = size + "px";
    div.style.height = size + "px";
    div.style.position = "absolute";
    div.style.left = e.pageX + "px";
    div.style.top = e.pageY + "px";
    div.style.zIndex = "100";
    div.style.display = "block";
    div.style.transform = "translate(-50%, -50%)";
    div.style.willChange = "transform";
    div.style.borderRadius = "100vh";
    div.id = "green-bubble";

    let run = () => requestAnimationFrame(() => {
        if (size <= 2000) {
            size += 1 + size * size * 0.002;
            div.style.width = size + "px";
            div.style.height = size + "px";
            run();
        }
    });

    run();

    document.body.appendChild(div);
}

export default function PaymentDescription({ params } : { params: { expense: string, cbu: string }} ) {
    const ALIAS = useSearchParams().get('cbu');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: "",
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
            <h2 className="text-sm opacity-50 text-center mb-2 font-mono uppercase">{ALIAS}</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => onSubmit(data, expenseData))} className="space-y-8 w-full">
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="text-sm font-light uppercase">Brevemente describa la operacion</FormLabel>
                            <FormControl>
                                <Input className="" placeholder="Descripcion" type="text" {...field} />
                            </FormControl>
                            {/* <FormDescription>Cuenta a la que transferir dinero</FormDescription> */}
                            <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" onClick={(e) => createGreenBubble(e)} className="w-full bg-blue-200 uppercase tracking-widest font-extrabold" disabled={((form.watch().description?.length || 0) < DESCRIPTION_CHAR_LIMIT)}>Pagar</Button>
                </form>
            </Form>
        </div>
    </>
}