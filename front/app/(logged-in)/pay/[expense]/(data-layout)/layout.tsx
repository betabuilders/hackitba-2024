"use client";

import AvatarCascade from "@/components/avatar-cascade";
import { EXPENSES } from "@/lib/constants";
import { ArrowDownIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";


export default function PaymentFlowLayout({ children, params } : { params: { expense: string, }, children: ReactNode, }) {
    const ref = useRef(null as unknown as HTMLDivElement);
    const ALIAS = useSearchParams().get('cbu');
    const AMOUNT = useSearchParams().get('amount');
    const expenseData = EXPENSES.find((e) => e.id.toString() == params.expense);

    return <div className="flex flex-col justify-center items-center w-full h-fit">
    <div className="text-center">
        <h2 className="text-sm opacity-50 text-center mb-2 font-mono">
            Origen
        </h2>
        <h1 className="text-2xl lg:text-4xl uppercase">{expenseData?.title }</h1>
        <h1 className="text-xl opacity-50 text-center mb-2">
            { AMOUNT ? `$${AMOUNT}` : `Disponible: $${expenseData?.balance }` }
        </h1>
    </div>
    <AvatarCascade imageSources={expenseData?.members.map((url) => `/avatars/${url.avatar}`)} className="h-16 w-16 rounded-full ring-2 ring-neutral-200 dark:ring-neutral-700 -ring-offset-2"/>
    <div className="flex flex-col items-center gap-2 w-full h-full">
        <ArrowDownIcon className="w-8 h-8 text-blue-400 dark:text-blue-200"/>
        <h2 className="text-sm opacity-50 text-center mb-2 font-mono uppercase">{ ALIAS && ALIAS != '' ? ALIAS : "Destino" }</h2>
        <div className="w-full [&>*]:w-full">
            { children }
        </div>
    </div>
</div>
}