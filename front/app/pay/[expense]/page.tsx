import { Button } from "@/components/ui/button";

export default function PayExpense({ params } : { params: { expense: string }} ) {
    return <main className="flex min-h-screen flex-col items-center justify-start p-4 my-8 lg:p-24 pt-6 gap-8">
        <h1>
            Pagar desde saldo: {params.expense}
        </h1>
        <Button className="bg-blue-400">Pagar</Button>
    </main>
}