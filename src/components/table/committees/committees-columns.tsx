import { Committee } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { CommitteeHeaders, MyHeaders } from '~/constants/headers'
import { _isDateComing, _sortStringDate, _toDate, _toLocaleString } from '~/utils/string'
import { MoreHorizontal, Users2Icon } from 'lucide-react'
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
import { IconBadge, InactiveBadge, TemporaryBadge } from '~/components/badge'
import { CountDataType, CommitteeWithMembershipCountDataType } from '~/types'
import { CommitteeTooltipValue, Observations, Ordinance } from '../colums'

export const getCommitteesColumns = (
  onViewCommittee: (com: Committee) => void,
  onEditCommittee: (com: Committee) => void,
  onCommitteeSuccession: (com: Committee) => void,
  onDeactivateCommittee: (com: Committee) => void,
  onDeleteCommittee: (com: Committee) => void
): ColumnDef<CommitteeWithMembershipCountDataType>[] => [
  {
    accessorKey: 'name',
    id: CommitteeHeaders.NAME,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string
      const is_temporary = !row.original.template_id
      const is_inactive = !row.original.is_active

      return (
        <div className="flex w-[250px] flex-row">
          <CommitteeTooltipValue {...{value, is_inactive, is_temporary}} />
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
      return Ordinance(value)
    }
  },
  {
    accessorKey: 'begin_date',
    id: CommitteeHeaders.BEGIN_DATE,
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
    id: CommitteeHeaders.END_DATE,
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
    accessorKey: 'members_count',
    accessorFn: (row) => row.members_count,
    sortingFn: (row1, row2, columnId) => {
      return (row1.getValue(columnId) as CountDataType).active_count >
        (row2.getValue(columnId) as CountDataType).active_count
        ? 1
        : -1
    },
    id: CommitteeHeaders.MEMBERS,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as CountDataType
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
      return Observations(value)
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const committee = row.original
      return (
        <div className="flex min-w-[96px]">
          <div className="ml-auto px-4">
            <Button
              onClick={() => onViewCommittee(committee)}
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Ver detalhes</span>
              <Users2Icon className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onViewCommittee(committee)}>
                  Ver membros
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditCommittee(committee)}>
                  Editar mandato
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!committee.is_active || !committee.template_id}
                  onClick={() => onCommitteeSuccession(committee)}
                >
                  Suceder mandato
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  danger
                  disabled={!committee.is_active}
                  onClick={() => onDeactivateCommittee(committee)}
                >
                  Encerrar mandato
                </DropdownMenuItem>
                {!committee.is_active && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      danger
                      disabled={!!committee.is_active}
                      onClick={() => onDeleteCommittee(committee)}
                    >
                      Deletar mandato
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )
    }
  }
]
