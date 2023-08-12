import { ColumnDef } from '@tanstack/react-table'
import { EmployeeHeaders, MembershipHeaders, MyHeaders } from '~/constants/headers'
import { _toLocaleString } from '~/utils/string'
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
import DataTableColumnHeader from '~/components/table/data-table-column-header'
import Link from 'next/link'
import { Routes } from '~/constants/routes'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { IconBadge } from '~/components/badge'
import { MembershipWithEmployeeCommitteeAndMembershipCountDataType } from '~/types'

export const getEmployeesColumns = (
  handleViewCommittee: (
    membership: MembershipWithEmployeeCommitteeAndMembershipCountDataType
  ) => void,
  onDeactivateMembership: (
    membership: MembershipWithEmployeeCommitteeAndMembershipCountDataType
  ) => void,
  onDeactivateEmployee: (
    membership: MembershipWithEmployeeCommitteeAndMembershipCountDataType
  ) => void
): ColumnDef<MembershipWithEmployeeCommitteeAndMembershipCountDataType>[] => [
  {
    accessorKey: 'employee.name',
    accessorFn: (row) => row.employee.name,
    id: MembershipHeaders.NAME,
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
      //const is_inactive = !row.original.is_active

      return (
        <div className="flex w-[240px] flex-row">
          <strong className="truncate">{value}</strong>
          {/* {is_inactive && (
            <IconBadge>
              <CircleOffIcon className="h-3 w-3 text-white" />
            </IconBadge>
          )} */}
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
          className="flex max-w-[280px] flex-row underline"
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
      return <div className="truncate">{value}</div>
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
      const template_id = row.original.committee.template_id
      return (
        // <div className="min-w-[64px]">
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
              Ver {MyHeaders.COMMITTEE.toLowerCase()}
            </DropdownMenuItem>
            {template_id ? (
              <DropdownMenuItem>
                <Link href={`${Routes.TEMPLATES}/${template_id}/${role}`}>
                  Ver histórico do cargo
                </Link>
              </DropdownMenuItem>
            ) : (
              <></>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              danger
              disabled={!row.original.is_active}
              onClick={() => onDeactivateMembership(row.original)}
            >
              Desativar {MyHeaders.MEMBERSHIP.toLowerCase()}
            </DropdownMenuItem>
            <DropdownMenuItem
              danger
              disabled={!row.original.employee.is_active}
              onClick={() => onDeactivateEmployee(row.original)}
            >
              Desativar {MyHeaders.EMPLOYEE.toLowerCase()}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        // </div>
      )
    }
  }
]
