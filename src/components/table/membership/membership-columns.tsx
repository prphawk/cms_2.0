import { ColumnDef } from '@tanstack/react-table'
import { MembershipHeaders } from '~/constants/headers'
import { _sortStringDate, _toLocaleString } from '~/utils/string'
import { CircleOffIcon, MoreHorizontal } from 'lucide-react'
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
import Link from 'next/link'
import { Routes } from '~/constants/routes'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { IconBadge } from '~/components/badge'
import { CommitteeWithMembersDataType, MembershipWithEmployeeDataType } from '~/types'

export const getMembershipColumns = (
  onChangeMembership: (membership: MembershipWithEmployeeDataType) => void,
  onDeactivateMembership: (membership: MembershipWithEmployeeDataType) => void,
  committee: CommitteeWithMembersDataType
): ColumnDef<MembershipWithEmployeeDataType>[] => [
  {
    accessorKey: 'employee.name',
    accessorFn: (row) => row.employee.name,
    id: MembershipHeaders.NAME,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string
      const is_inactive = !row.original.is_active

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
    accessorKey: 'role',
    id: MembershipHeaders.ROLE,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string
      const role = row.original.role
      return committee.committee_template_id ? (
        <Link
          className="flex max-w-[280px] flex-row underline"
          href={`${Routes.TEMPLATES}/${committee.committee_template_id}/${role}`}
        >
          <span className="truncate">{value}</span>
        </Link>
      ) : (
        <>{value}</>
      )
    }
  },
  {
    accessorKey: 'ordinance',
    id: MembershipHeaders.ORDINANCE,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string
      return <div className="truncate">{value}</div>
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
      console.log(value, row.original?.is_active)
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
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-60 truncate">{value}</div>
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
      const role = row.original.role
      return (
        <div className="min-w-[64px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              {/* <DropdownMenuItem>Ver histórico de cargo</DropdownMenuItem> */}
              <DropdownMenuSeparator />
              {committee.committee_template_id ? (
                <DropdownMenuItem>
                  <Link href={`${Routes.TEMPLATES}/${committee.committee_template_id}/${role}`}>
                    Ver histórico do cargo
                  </Link>
                </DropdownMenuItem>
              ) : (
                <></>
              )}
              <DropdownMenuItem
                disabled={!row.original.is_active}
                onClick={() => onChangeMembership(row.original)}
              >
                Editar participação
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled
                //disabled={!row.original.is_active}
              >
                Suceder cargo
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                danger
                disabled={!row.original.is_active}
                onClick={() => onDeactivateMembership(row.original)}
              >
                Encerrar participação
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
]
