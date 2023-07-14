'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { XIcon } from 'lucide-react';
import { DataTableViewOptions } from '../../../components/table/data-table-view-options';
import { DataTableFacetedFilter } from '../../../components/table/data-table-faceted-filter';
import { Table } from '@tanstack/react-table';
import { CommitteeHeaders } from '~/constants/headers';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter..."
          value={(table.getColumn(CommitteeHeaders.NAME)?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn(CommitteeHeaders.NAME)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] bg-transparent text-muted-foregroundPage lg:w-[250px]"
        />
        {/* {table.getColumn('bond') && (
          <DataTableFacetedFilter
            column={table.getColumn('bond')}
            title="Status"
            options={[{ label: 'status 1', value: '1' }]}
          />
        )}
        {table.getColumn('name') && (
          <DataTableFacetedFilter
            column={table.getColumn('name')}
            title="Priority"
            options={[{ label: 'priority 1', value: '1' }]}
          />
        )} 
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <XIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
        */}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
