"use client";

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

import { 
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";


import { SUPPLIERS } from "@/lib/constants"

export type Payment = {
    id: string,
    name: string
    categories: string[]
    cuit: string,
    cbu: string
};

export const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
    },
    {
      accessorKey: "categories",
      header: "Categorias",
      cell: ({ row }) => {
        const categories = row.original.categories;
   
        return <div className="flex gap-2">
            {categories.map((c, i) => {
                return <CategoryBadge category={c} key={i}/>
            })}
        </div>
      },
    },
    {
        accessorKey: "cuit",
        header: "CUIT",
        cell: ({ row }) => <p className="font-mono">{row.original.cuit}</p>,
    },
    {
        accessorKey: "cbu",
        header: "CBU",
        cell: ({ row }) => <p className="font-mono">{row.original.cbu}</p>,
    },
    {
        accessorKey: "action",
        header: "",
        cell: ({row}) => {
            return <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {/* <DropdownMenuLabel>Acciones</DropdownMenuLabel> */}
                    <DropdownMenuItem onClick={() => window.location = new URL(`./supplier/${row.original.id}`, window.origin)}>Ver gastos</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.name)}>Copiar Nombre</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.cbu)}>Copiar CBU</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.cuit)}>Copiar CUIT</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        }
    }
];

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData extends Payment, TValue>({
    columns,
    data,
  }: DataTableProps<TData, TValue>) {
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
    })
   
    return (
      <div className="rounded-md p-4 border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    )
  }

export default function SuppliersView() {
    return <div className="flex flex-col justify-center items-center w-full h-full p-8">
        <main className="p-2 m-4 lg:m-16 rounded">
            <DataTable columns={columns} data={SUPPLIERS} />
        </main>
    </div>
}