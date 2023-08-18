'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { XIcon } from 'lucide-react'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { Table } from '@tanstack/react-table'
import { SlidersHorizontalIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { DataTableDateFacetedFilter } from './data-table-date-faceted-filter'

interface TableToolbarProps<TData> {
  table: Table<TData>
}

export function TableToolbar<TData>(
  props: TableToolbarProps<TData> & {
    tableFilters?: JSX.Element
    tableActions?: JSX.Element
    searchPlaceholder?: string
    globalFilter: string
    onChange: (value: string) => void
  }
) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={'Buscar...' || props.searchPlaceholder}
          value={props.globalFilter}
          onChange={(event) => props.onChange(event.target.value)}
          className="h-8 w-[150px] bg-transparent text-muted-foregroundPage lg:w-[250px]"
        />
        {props.tableFilters}
      </div>
      {props.tableActions}
      <TableViewOptions table={props.table} />
    </div>
  )
}

export interface IFilterOptions {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface IFilter {
  dates?: any
  title: string
  options?: IFilterOptions[]
  activeFilters?: string[]
  handleChangeActiveFilters: (value: any) => void
}

export const TableToolbarFilter = (props: { filters: IFilter[] }) => {
  const handleResetFilters = () => {
    props.filters.forEach((f) => {
      f.handleChangeActiveFilters(
        f.dates ? { begin_date: undefined, end_date: undefined } : undefined
      )
    })
  }

  return (
    <>
      {props.filters.map((f, index) =>
        f.dates ? (
          <DataTableDateFacetedFilter
            key={index}
            title={f.title}
            dates={f.dates}
            filters={f.activeFilters}
            setDatesValue={f.handleChangeActiveFilters}
          />
        ) : (
          f.options && (
            <DataTableFacetedFilter
              key={index}
              disabled={!f.options?.length}
              title={f.title}
              options={f.options}
              filters={f.activeFilters}
              setFiltersValue={f.handleChangeActiveFilters}
            />
          )
        )
      )}
      {props.filters.some((f) => f.activeFilters?.length) ? (
        <Button variant="ghost" onClick={handleResetFilters} className="h-8 px-2 lg:px-3">
          Limpar
          <XIcon className="ml-1 mt-1 h-4 w-4" />
        </Button>
      ) : (
        <></>
      )}
    </>
  )
}

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
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
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
