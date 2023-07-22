'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { XIcon } from 'lucide-react';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { CommitteesHeaders } from '~/constants/headers';
import { Table } from '@tanstack/react-table';
import { SlidersHorizontalIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TableToolbarProps<TData> {
  table: Table<TData>;
}

export function TableToolbar<TData>(
  props: TableToolbarProps<TData> & {
    tableFilters: JSX.Element;
    tableActions?: JSX.Element;
    column: string;
  },
) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Buscar..."
          value={(props.table.getColumn(props.column)?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            props.table.getColumn(props.column)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] bg-transparent text-muted-foregroundPage lg:w-[250px]"
        />
        {props.tableFilters}
      </div>
      {props.tableActions}
      <TableViewOptions table={props.table} />
    </div>
  );
}

interface Filters {
  isActiveFilters?: string[];
  _setIsActiveFilterValues: (values?: string[]) => void;
  isTemporaryFilters?: string[];
  _setIsTemporaryFilterValues: (values?: string[]) => void;
}

export const TableToolbarFilter = ({
  isActiveFilters,
  _setIsActiveFilterValues,
  isTemporaryFilters,
  _setIsTemporaryFilterValues,
}: Filters) => {
  const handleResetFilters = () => {
    _setIsActiveFilterValues(undefined);
    _setIsTemporaryFilterValues(undefined);
  };

  return (
    <>
      <DataTableFacetedFilter
        title="Status"
        options={[
          { label: 'Ativo(a)', value: 'is_active' },
          { label: 'Inativo(a)', value: 'is_inactive' },
        ]}
        filters={isActiveFilters}
        setFiltersValue={_setIsActiveFilterValues}
      />
      <DataTableFacetedFilter
        title="Tipo"
        options={[
          { label: 'Permanente', value: 'is_permanent' },
          { label: 'Temporário(a)', value: 'is_temporary' },
        ]}
        filters={isTemporaryFilters}
        setFiltersValue={_setIsTemporaryFilterValues}
      />

      {isTemporaryFilters?.length || isActiveFilters?.length ? (
        <Button variant="ghost" onClick={handleResetFilters} className="h-8 px-2 lg:px-3">
          Limpar
          <XIcon className="ml-1 mt-1 h-4 w-4" />
        </Button>
      ) : (
        <></>
      )}
    </>
  );
};

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function TableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto hidden h-8 bg-transparent lg:flex">
          <SlidersHorizontalIcon className="mr-2 h-4 w-4" />
          Exibir
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        {table
          .getAllColumns()
          .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
