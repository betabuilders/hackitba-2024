import { CATEGORIES } from "@/lib/constants";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

export default function CategoryBadge({ category }: { category: string }) {
    // @ts-ignore
    return <Badge className={cn("inline-block", CATEGORIES[category].style)}>{CATEGORIES[category].name}</Badge>
}