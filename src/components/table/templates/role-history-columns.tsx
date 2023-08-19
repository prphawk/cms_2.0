import { ColumnDef } from '@tanstack/react-table'
import { MyHeaders, MembershipHeaders } from '~/constants/headers'
import { _sortStringDate, _toLocaleString } from '~/utils/string'
import { CircleOffIcon, MoreHorizontal, Users2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import DataTableColumnHeader, {
  DateColumn,
  EndDateBadge
} from '~/components/table/data-table-column-header'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { IconBadge } from '~/components/badge'
import { MembershipWithEmployeeAndCommitteeDataType } from '~/types'
import { Observations, Ordinance } from '../colums'

export const getTemplateRoleHistoryColumns = (
  handleViewCommittee: (committee_id: number) => void
): ColumnDef<MembershipWithEmployeeAndCommitteeDataType>[] => [
  {
    accessorKey: 'employee.name',
    accessorFn: (row) => row.employee.name,
    id: MembershipHeaders.NAME,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row }) => {
      const value = row.original.employee?.name as string
      const is_inactive = !row.original.employee.is_active

      return (
        <div className="flex w-[240px] flex-row">
          <strong className="truncate">{value}</strong>
          {is_inactive && (
            <IconBadge>
              <CircleOffIcon className="h-3 w-3 text-white" />
            </IconBadge>
          )}
        </div>
      )
    }
  },
  {
    accessorKey: 'committee.name',
    accessorFn: (row) => row.committee.name,
    id: MyHeaders.MEMBERSHIP,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string
      const is_inactive = !row.original.is_active

      return (
        <div className="flex max-w-[250px] flex-row">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="truncate">{value}</div>
              </TooltipTrigger>
              <TooltipContent>
                {is_inactive ? 'Participação encerrada em ' + value : value}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {is_inactive && (
            <IconBadge>
              <CircleOffIcon className="h-3 w-3" />
            </IconBadge>
          )}
        </div>
      )
    }
  },
  {
    accessorKey: 'ordinance',
    id: MembershipHeaders.ORDINANCE,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string
      return Ordinance(value)
    }
  },
  {
    accessorKey: 'begin_date',
    id: MembershipHeaders.BEGIN_DATE,
    sortingFn: _sortStringDate,
    accessorFn: (row) => _toLocaleString(row.begin_date),
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string
      return <DateColumn value={value} />
    }
  },
  {
    accessorKey: 'end_date',
    id: MembershipHeaders.END_DATE,
    sortingFn: _sortStringDate,
    accessorFn: (row) => _toLocaleString(row.end_date),
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string
      return (
        <DateColumn value={value}>
          <EndDateBadge value={value} isActive={row.original?.is_active} />
        </DateColumn>
      )
    }
  },
  {
    accessorKey: 'observations',
    id: MembershipHeaders.OBSERVATIONS,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string
      return Observations(value)
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const committee_id = row.original.committee_id
      return (
        <div className="flex min-w-[64px]">
          <div className="ml-auto px-4">
            <Button
              onClick={() => handleViewCommittee(committee_id)}
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Ver detalhes</span>
              <Users2Icon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )
    }
  }
]
