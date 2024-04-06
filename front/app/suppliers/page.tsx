import CategoryBadge from "@/components/category-badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { MoreHorizontal } from "lucide-react"

import { SUPPLIERS } from "@/lib/constants"

export default function SuppliersView() {
    return <div className="flex flex-col justify-center items-center w-full h-full p-8">
        <main className="p-2 m-4 lg:m-16 border border-white/50 rounded">
            <Table className="caption-top">
                <TableCaption className="text-foreground pb-2">Tus provedores autorizados</TableCaption>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[200px]">Nombre</TableHead>
                    <TableHead>Categorias</TableHead>
                    <TableHead>CUIT</TableHead>
                    <TableHead>CBU</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {...SUPPLIERS.map((data, i) => {
                        return <TableRow key={i}>
                            <TableCell className="font-medium">{data.name}</TableCell>
                            <TableCell className="flex gap-2">
                                {data.categories.map((c, i) => {
                                    return <CategoryBadge category={c} key={i}/>
                                })}
                            </TableCell>
                            <TableCell className="font-mono">{data.cuit}</TableCell>
                            <TableCell className="text-right font-mono">{data.cbu}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {/* <DropdownMenuLabel>Acciones</DropdownMenuLabel> */}
                                        <DropdownMenuItem>Ver gastos</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Copiar Nombre</DropdownMenuItem>
                                        <DropdownMenuItem>Copiar CBU</DropdownMenuItem>
                                        <DropdownMenuItem>Copiar CUIT</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    })}
                </TableBody>
            </Table>
        </main>
    </div>
}