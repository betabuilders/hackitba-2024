"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

function onSubmit(data) {
    console.log(data);
    // @todo make a request to the server, get access and redirect
    window.location = new URL('./expenses', window.origin).href;
}

export default function LoginPage(){
    const formSchema = z.object({
        email: z.string().email({
          message: "Porfavor ingrese un email correcto",
        }),
        password: z.string().min(4, {
            message: "Porfavor utilice una contraseña de 4+ caracteres"
        })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    
    return <div className="flex flex-col justify-center items-center w-full h-[100vh] p-8">
        <main className="flex flex-col justify-center items-center lg:w-1/3 w-full p-4 lg:p-16 h-fit border rounded gap">
            <p>Login</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="beta-builders@gmail.com" type="email" {...field} />
                            </FormControl>
                            <FormDescription>Ingrese su correo electronico.</FormDescription>
                            <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="* * *" type="password" {...field} />
                            </FormControl>
                            <FormDescription>Elija una contraseña segura.</FormDescription>
                            <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">Submit</Button>
                </form>
            </Form>
        </main>
    </div>
}