import { Employee, Membership } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { MembershipHeaders } from '~/constants/headers'
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
import { EndDate, IconBadge } from '~/components/badge'
import { MembershipWithEmployeeType } from '~/pages/dashboard/committees/[id]'

export const getMembershipColumns = (
  onChangeMembership: (membership: MembershipWithEmployeeType) => void,
  onDeactivateMembership: (id: MembershipWithEmployeeType) => void,
  committee_template_id?: number | null,
  committee_begin_date?: Date | null,
  committee_end_date?: Date | null
): // handleDeactivateCommittees: (ids: number[]) => void,
ColumnDef<Membership & { employee: Employee }>[] => [
  {
    accessorKey: 'employee.name',
    accessorFn: (row) => row.employee.name,
    id: MembershipHeaders.NAME,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row }) => {
      const value = row.original.employee?.name as string
      const is_inactive = !row.original.is_active

      return (
        <div>
          <strong>{value}</strong>
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
      return committee_template_id ? (
        <Link className="underline" href={`${Routes.TEMPLATES}/${committee_template_id}/${role}`}>
          {value}
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
      return <div>{value}</div>
    }
  },
  {
    accessorKey: 'begin_date',
    id: MembershipHeaders.BEGIN_DATE,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const date = (row.getValue(column.id) as Date) || committee_begin_date
      return <div>{_toLocaleString(date)}</div> // pode retornar JSX tbm
    }
  },
  {
    accessorKey: 'end_date',
    id: MembershipHeaders.END_DATE,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const date = (row.getValue(column.id) as Date) || committee_end_date
      return <EndDate value={date} isActive={row.original?.is_active} />
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
        <>
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
              {committee_template_id ? (
                <DropdownMenuItem>
                  <Link href={`${Routes.TEMPLATES}/${committee_template_id}/${role}`}>
                    Ver histórico do cargo
                  </Link>
                </DropdownMenuItem>
              ) : (
                <></>
              )}
              <DropdownMenuItem onClick={() => onChangeMembership(row.original)}>
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
                onClick={() => {
                  onDeactivateMembership(row.original)
                  row.original.is_active = false
                }}
              >
                Encerrar participação
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )
    }
  }
]
