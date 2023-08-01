import { Column } from '@tanstack/react-table'

import { cn } from '@/lib/utils'

import {
  ArrowDown01Icon,
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronsDownIcon,
  ChevronsUpDownIcon,
  ChevronsUpIcon,
  EyeOffIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useEffect } from 'react'
import { ArrowUp01Icon } from 'lucide-react'

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export default function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  columnSecondary
}: DataTableColumnHeaderProps<TData, TValue> & { columnSecondary?: Column<TData, TValue> }) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  useEffect(() => {
    console.log(title, columnSecondary)
  }, [columnSecondary])

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 hover:bg-transparent hover:text-inherit hover:underline data-[state=open]:bg-transparent "
          >
            <strong>{title}</strong>
            {column.getIsSorted() === 'desc' ? (
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'asc' ? (
              <ChevronUpIcon className="ml-2 h-4 w-4" />
            ) : columnSecondary?.getIsSorted() === 'desc' ? (
              <ChevronsDownIcon className="ml-2 h-4 w-4" />
            ) : columnSecondary?.getIsSorted() === 'asc' ? (
              <ChevronsUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUpIcon className="mr-2 h-3.5 w-3.5" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDownIcon className="mr-2 h-3.5 w-3.5" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {columnSecondary ? (
            <>
              <DropdownMenuItem onClick={() => columnSecondary?.toggleSorting(false)}>
                <ArrowUp01Icon className="mr-2 h-3.5 w-3.5" />
                Asc: {columnSecondary?.id}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => columnSecondary?.toggleSorting(true)}>
                <ArrowDown01Icon className="mr-2 h-3.5 w-3.5" />
                Desc: {columnSecondary?.id}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          ) : (
            <></>
          )}

          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOffIcon className="mr-2 h-3.5 w-3.5" />
            Ocultar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
