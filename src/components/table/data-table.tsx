'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import DataTablePagination from './data-table-pagination'
import { ReactNode, useState } from 'react'
import { TableToolbar } from './data-table-toolbar'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

// const getPaginationProps = () => {
//   return {
//     manualPagination: true,
//     pageCount: -1,
//     getPageCount,
//     nextPage,
//     previousPage,
//     getCanPreviousPage,
//     getCanNextPage,
//     getPageOptions: [10, 25, 50, 100],
//     setPageSize,
//     setPageCount
//   };
// };

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  tableFilters,
  tableActions,
  column
}: DataTableProps<TData, TValue> & {
  tableFilters?: JSX.Element
  isLoading?: boolean
  tableActions?: JSX.Element
  column: string
}) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const table = useReactTable({
    // https://tanstack.com/table/v8/docs/api/features/pagination
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    //enableGlobalFilter: true,
    state: {
      sorting,
      columnFilters
    }
  })

  return (
    <>
      <TableToolbar
        table={table}
        tableFilters={tableFilters}
        tableActions={tableActions}
        column={column}
      />
      <div className="mt-3 rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="text-white" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
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
                  {isLoading ? 'Loading...' : 'No results.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </>
  )
}
