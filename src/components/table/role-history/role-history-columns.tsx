import { Committee, Employee, Membership } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { Headers, MembershipHeaders } from '~/constants/headers'
import { _toLocaleString } from '~/utils/string'
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
import { Badge } from '@/components/ui/badge'
import DataTableColumnHeader from '~/components/table/data-table-column-header'
import Link from 'next/link'
import { Routes } from '~/constants/routes'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'

export const CommitteeActionsMenuColumn = ({ committee }: { committee: Committee }) => {
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
        <DropdownMenuItem>
          <Link href={`${Routes.COMMITTEES}/${committee.id}`}>Ver membros</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {committee.committee_template_id && (
          <DropdownMenuItem disabled>Suceder órgão</DropdownMenuItem>
        )}
        <DropdownMenuItem
          disabled
          danger
          // onClick={() => {
          //   handleDeactivateCommittees([committee.id]);
          //   committee.is_active = false;
          // }}
        >
          Encerrar {Headers.COMMITTEE.toLowerCase()}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const getTemplateRoleHistoryColumns = (): ColumnDef<
  Membership & { employee: Employee } & { committee: Committee }
>[] => [
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
          {is_inactive && (
            <Badge className="mr-2 text-white" variant="outline">
              Inativo(a)
            </Badge>
          )}
          <strong>{value}</strong>
        </div>
      )
    }
  },
  {
    accessorKey: 'committee.name',
    accessorFn: (row) => row.committee.name,
    id: Headers.COMMITTEE,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string
      const is_inactive = !row.original.committee.is_active

      return (
        <div>
          {is_inactive && (
            <Badge className="mr-2 text-white" variant="outline">
              Inativa
            </Badge>
          )}
          {value}
        </div>
      )
    }
  },
  {
    accessorKey: 'begin_date',
    id: MembershipHeaders.BEGIN_DATE,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const date = row.getValue(column.id) as Date
      return <div>{_toLocaleString(date)}</div>
    }
  },
  {
    accessorKey: 'end_date',
    id: MembershipHeaders.END_DATE,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const date = row.getValue(column.id) as Date
      return <div>{_toLocaleString(date)}</div>
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
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Suceder cargo</DropdownMenuItem>
              <DropdownMenuItem
                disabled
                //  onClick={() => handleChangeMembership(row.original)}
              >
                Editar participação
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Encerrar participação</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )
    }
  }
]
