'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { XIcon } from 'lucide-react';
import { DataTableViewOptions } from '../data-table-view-options';
import { DataTableFacetedFilter } from '../data-table-faceted-filter';
import { Table } from '@tanstack/react-table';
import { CommitteeHeaders } from '~/constants/headers';
import { PropsWithChildren } from 'react';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>(props: DataTableToolbarProps<TData> & PropsWithChildren) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Buscar..."
          value={(props.table.getColumn(CommitteeHeaders.NAME)?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            props.table.getColumn(CommitteeHeaders.NAME)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] bg-transparent text-muted-foregroundPage lg:w-[250px]"
        />

        {props.children}
      </div>
      <DataTableViewOptions table={props.table} />
    </div>
  );
}

interface Filters {
  isActiveFilters?: string[];
  _setIsActiveFilterValues: (values?: string[]) => void;
  isTemporaryFilters?: string[];
  _setIsTemporaryFilterValues: (values?: string[]) => void;
}

export const DataTableToolbarFilter = ({
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
        title="Atividade"
        options={[
          { label: 'Ativa', value: 'is_active' },
          { label: 'Inativa', value: 'is_inactive' },
        ]}
        filters={isActiveFilters}
        setFiltersValue={_setIsActiveFilterValues}
      />
      <DataTableFacetedFilter
        title="Duração"
        options={[
          { label: 'Permanente', value: 'is_permanent' },
          { label: 'Temporária', value: 'is_temporary' },
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
