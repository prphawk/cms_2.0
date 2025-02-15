import { ColumnDef } from '@tanstack/react-table'
import { EmployeeHeaders, MembershipHeaders, MyHeaders } from '~/constants/headers'
import { _sortStringDate, _toLocaleString } from '~/utils/string'
import { MoreHorizontal } from 'lucide-react'
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
import { IconBadge, InactiveBadge, MyTooltip } from '~/components/badge'
import { MembershipWithEmployeeCommitteeAndMembershipCountDataType } from '~/types'
import { EmployeeTooltipValue, MembershipTooltipValue, Observations, Ordinance } from '../colums'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export const getEmployeesColumns = (
  handleViewCommittee: (
    membership: MembershipWithEmployeeCommitteeAndMembershipCountDataType
  ) => void,
  onEditEmployee: (membership: MembershipWithEmployeeCommitteeAndMembershipCountDataType) => void,
  onDeactivateMembership: (
    membership: MembershipWithEmployeeCommitteeAndMembershipCountDataType
  ) => void,
  onDeactivateEmployee: (
    membership: MembershipWithEmployeeCommitteeAndMembershipCountDataType
  ) => void,
  onDeleteMembership: (
    membership: MembershipWithEmployeeCommitteeAndMembershipCountDataType
  ) => void
): ColumnDef<MembershipWithEmployeeCommitteeAndMembershipCountDataType>[] => [
  {
    accessorKey: 'employee.name',
    accessorFn: (row) => row.employee.name,
    id: MembershipHeaders.MEMBER,
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        title={column.id}
        columnSecondary={table.getColumn(EmployeeHeaders.MEMBERSHIP_COUNT)}
      />
    ),
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string
      const is_inactive = !row.original.employee.is_active

      return (
        <div className="flex w-[240px] flex-row">
          <EmployeeTooltipValue {...{ value, is_inactive }} />
        </div>
      )
    }
  },
  {
    accessorKey: 'employee.name._count',
    enableHiding: false,
    accessorFn: (row) => row.employee._count.committees.toString(),
    id: EmployeeHeaders.MEMBERSHIP_COUNT,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string
      return <div className="flex flex-row justify-center">{value}</div>
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
        <div className="flex max-w-[200px] flex-row truncate">
          <MembershipTooltipValue {...{ value, is_inactive }} />
        </div>
      )
    }
  },
  {
    accessorKey: 'committee.role',
    id: MembershipHeaders.ROLE,
    accessorFn: (row) => row.role,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string
      const template_id = row.original.committee.template_id
      return template_id ? (
        <Link
          className="flex max-w-[180px] flex-row underline"
          href={`${Routes.TEMPLATES}/${template_id}/${value}`}
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
      const membership = row.original
      const template_id = membership.committee.template_id
      return (
        <div className="flex min-w-[64px]">
          <div className="ml-auto px-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleViewCommittee(row.original)}>
                  Ver {MyHeaders.INSTANCE.toLowerCase()}
                </DropdownMenuItem>
                {template_id ? (
                  <DropdownMenuItem>
                    <Link href={`${Routes.TEMPLATES}/${template_id}/${membership.role}`}>
                      {`Ver histórico de "${membership.role}"`}
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <></>
                )}
                <DropdownMenuItem onClick={() => onEditEmployee(membership)}>
                  Editar {MembershipHeaders.MEMBER.toLowerCase()}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={!membership.is_active}
                  onClick={() => onDeactivateMembership(membership)}
                >
                  Encerrar {MyHeaders.MEMBERSHIP.toLowerCase()}
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!membership.employee.is_active}
                  onClick={() => onDeactivateEmployee(membership)}
                >
                  Desativar {MyHeaders.EMPLOYEE.toLowerCase()}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  danger
                  disabled={membership.is_active}
                  onClick={() => onDeleteMembership(membership)}
                >
                  Deletar {MyHeaders.MEMBERSHIP.toLowerCase()}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )
    }
  }
]
