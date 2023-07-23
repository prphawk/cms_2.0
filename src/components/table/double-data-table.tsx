'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import DataTablePagination from './data-table-pagination';
import { ReactNode, useState } from 'react';
import { TableToolbar } from './data-table-toolbar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { TitleLayout } from '~/layout';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
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

export function DoubleDataTable<TData, TValue>({
  columns: firstColumns,
  secondColumns,
  data,
  isLoading,
  tableFilters,
  tableActions,
  column,
}: DataTableProps<TData, TValue> & {
  secondColumns: any;
  isLoading?: boolean;
  tableFilters?: JSX.Element;
  tableActions?: JSX.Element;
  column: string;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const firstTable = useReactTable({
    // https://tanstack.com/table/v8/docs/api/features/pagination
    data,
    columns: firstColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    //enableGlobalFilter: true,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <>
      <TableToolbar
        table={firstTable}
        tableFilters={tableFilters}
        tableActions={tableActions}
        column={column}
      />
      <div className="mt-3 rounded-md border">
        <Table>
          <TableHeader>
            {firstTable.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="text-white" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {firstTable.getRowModel().rows?.length ? (
              firstTable.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  <Accordion className="mb-6" type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </AccordionTrigger>
                      <AccordionContent className="tracking-wide">oi</AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={firstColumns.length} className="h-24 text-center">
                  {isLoading ? 'Loading...' : 'No results.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={firstTable} />
    </>
  );
}
