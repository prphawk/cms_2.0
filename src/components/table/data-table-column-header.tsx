import { Column } from '@tanstack/react-table'

import { cn } from '@/lib/utils'

import {
  AlertTriangleIcon,
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
import { ArrowUp01Icon } from 'lucide-react'
import { _isDateComing, _toDate, _toLocaleExtendedString } from '~/utils/string'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { PropsWithChildren } from 'react'

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
    return <div className={cn('font-bold', className)}>{title}</div>
  }

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
              <>
                <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
                <span>{columnSecondary ? '*' : ''}</span>
              </>
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

export const DateColumn = ({ value, children }: { value: string } & PropsWithChildren) => {
  const dateValue = _toDate(value)

  return (
    <div className="flex flex-row" aria-labelledby={value}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>{value}</div>
          </TooltipTrigger>
          {children}
          <TooltipContent>{_toLocaleExtendedString(dateValue)}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export const EndDateBadge = ({ value, isActive }: { value: string; isActive: boolean }) => {
  const dateValue = _toDate(value)

  return isActive ? (
    <span className="self-center ">
      {_isDateComing(dateValue) && <AlertTriangleIcon className=" ml-2 h-4 w-4 text-yellow-500" />}
    </span>
  ) : (
    <></>
  )
}
