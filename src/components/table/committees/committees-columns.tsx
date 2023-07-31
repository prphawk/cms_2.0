import { Committee } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { CommitteeHeaders, MyHeaders } from '~/constants/headers'
import { _isDateComing, _toLocaleString } from '~/utils/string'
import {
  AlertOctagonIcon,
  AlertTriangleIcon,
  CircleOffIcon,
  EyeIcon,
  HourglassIcon,
  LucideIcon,
  MoreHorizontal,
  Users2Icon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import DataTableColumnHeader from '~/components/table/data-table-column-header'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'
import { Routes } from '~/constants/routes'
import { EndDate, IconBadge } from '~/components/badge'

interface IActiveCount {
  active_count: number
  total_count: number
}

export const getCommitteesColumns = (
  handleDeactivateCommittees: (ids: number[]) => void,
  handleViewCommittee: (id: number) => void
): ColumnDef<
  Committee & {
    members_count: {
      active_count: number
      total_count: number
    }
  }
>[] => [
  {
    accessorKey: 'name',
    id: CommitteeHeaders.NAME,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string
      const is_temporary = !row.original.committee_template_id
      const is_inactive = !row.original.is_active

      return (
        <div className="flex w-[280px] flex-row">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="truncate">
                  <strong className="truncate">{value}</strong>
                </div>
              </TooltipTrigger>
              <TooltipContent>{value}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <span>
            <div className="flex flex-row">
              {is_temporary && (
                <IconBadge>
                  <HourglassIcon className="h-3 w-3 text-white" />
                </IconBadge>
              )}
              {is_inactive && (
                <IconBadge>
                  <CircleOffIcon className="h-3 w-3 text-white" />
                </IconBadge>
              )}
            </div>
          </span>
        </div>
      )
    }
  },
  {
    accessorKey: 'bond',
    id: CommitteeHeaders.BOND,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string
      return <div>{value}</div>
    }
  },
  {
    accessorKey: 'ordinance',
    id: CommitteeHeaders.ORDINANCE,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string
      return <div className="truncate">{value}</div>
    }
  },
  {
    accessorKey: 'begin_date',
    id: CommitteeHeaders.BEGIN_DATE,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const date = row.getValue(column.id) as Date
      return <div className="text-sm">{_toLocaleString(date)}</div> // pode retornar JSX tbm
    }
  },
  {
    accessorKey: 'end_date',
    id: CommitteeHeaders.END_DATE,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const date = row.getValue(column.id) as Date
      return <EndDate value={date} isActive={row.original?.is_active} />
    }
  },
  {
    accessorKey: 'members_count',
    accessorFn: (row) => row.members_count,
    sortingFn: (row1, row2, columnId) => {
      return (row1.getValue(columnId) as IActiveCount).active_count >
        (row2.getValue(columnId) as IActiveCount).active_count
        ? 1
        : -1
    },
    id: CommitteeHeaders.MEMBERS,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as IActiveCount
      return (
        <div>
          {value.active_count} de {value.total_count} membros
        </div>
      )
    }
  },
  {
    accessorKey: 'observations',
    id: CommitteeHeaders.OBSERVATIONS,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-48 truncate">{value}</div>
            </TooltipTrigger>
            <TooltipContent>{value}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const committee = row.original
      return (
        <div className="min-w-[64px]">
          <Button
            onClick={() => handleViewCommittee(committee.id)}
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Ver detalhes</span>
            <Users2Icon className="h-4 w-4" />
          </Button>
          <CommitteeActionsMenuColumn
            committee={committee}
            onViewCommittee={() => handleViewCommittee(committee.id)}
            handleDeactivateCommittees={handleDeactivateCommittees}
          />
        </div>
      )
    }
  }
]

export const CommitteeActionsMenuColumn = ({
  committee,
  onViewCommittee,
  handleDeactivateCommittees
}: {
  committee: Committee
  onViewCommittee: () => void
  handleDeactivateCommittees: (ids: number[]) => void
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <Separator />
        <DropdownMenuItem onClick={onViewCommittee}>Ver membros</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled
          //disabled={!committee.is_active || !committee.committee_template_id}
        >
          Suceder {MyHeaders.COMMITTEE.toLowerCase()}
        </DropdownMenuItem>
        <DropdownMenuItem
          danger
          onClick={() => {
            handleDeactivateCommittees([committee.id])
            committee.is_active = false
          }}
        >
          Encerrar {MyHeaders.COMMITTEE.toLowerCase()}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
