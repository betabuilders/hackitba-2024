"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"


function onSubmit(data) {
    console.log(data);
}

export default function LoginPage(){
    const formSchema = z.object({
        email: z.string().email({
          message: "Please enter a valid email address",
        }),
        password: z.string().min(6, {
            message: "Please use a longer password"
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
                            <FormDescription>This is your email address.</FormDescription>
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
                            <FormDescription>Choose a secure password.</FormDescription>
                            <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </main>
    </div>
}