import { CATEGORIES } from "@/lib/constants";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { DOMAttributes, ReactElement, ReactNode } from "react";

export default function CategoryBadge({ category, disabled, className, ...props }: { category: string, className?: string, disabled?: boolean } & {[key in keyof DOMAttributes<HTMLDivElement>]: DOMAttributes<HTMLDivElement>[key]} ) {
    // @ts-ignore
    return <Badge {...props} disabled={disabled} aria-disabled={disabled} className={cn("inline-block", className, CATEGORIES[category]?.style)}>{CATEGORIES[category]?.name}</Badge>
}

export function CategoryContainer({ categories, className } : { categories: (keyof typeof CATEGORIES)[], className?: string }) {
    return <div className={cn("inline-flex w-full gap-x-4 gap-y-2", className)}>{ categories.map((f, i) => <CategoryBadge key={i} category={f}/>) }</div>
}