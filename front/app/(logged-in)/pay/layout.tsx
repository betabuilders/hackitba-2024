"use client";

import { ReactNode, useEffect, useRef } from "react";


export default function PaymentFlowLayout({ children } : { children: ReactNode }) {
    const ref = useRef(null as unknown as HTMLDivElement);

    return <main ref={ref} className="absolute top-0 min-h-full flex flex-col items-center justify-center p-4 w-full lg:p-24 pt-2">
        <div className="flex flex-col justify-center items-center h-full gap-6 w-[90%] lg:w-1/2">
            { children }
        </div>
    </main>
}