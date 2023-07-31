import { ColumnDef } from '@tanstack/react-table'
import { MyHeaders, MembershipHeaders } from '~/constants/headers'
import { _toLocaleString } from '~/utils/string'
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
import DataTableColumnHeader from '~/components/table/data-table-column-header'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { IconBadge } from '~/components/badge'
import { MembershipWithEmployeeAndCommitteeDataType } from '~/types'

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
    accessorKey: 'committee.name',
    accessorFn: (row) => row.committee.name,
    id: MyHeaders.COMMITTEE,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string
      const is_inactive = !row.original.committee.is_active

      return (
        <div className="flex max-w-[280px] flex-row">
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
      const committee_id = row.original.committee_id
      return (
        <div className="min-w-[64px]">
          <Button
            onClick={() => handleViewCommittee(committee_id)}
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
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleViewCommittee(committee_id)}>
                Ver membros
              </DropdownMenuItem>
              {/* <DropdownMenuItem disabled>Editar participação</DropdownMenuItem> //TODO perguntar se precisa ter */}
              <DropdownMenuItem
                disabled
                //disabled={!row.original.is_active}
              >
                Suceder cargo
              </DropdownMenuItem>
              {/* <DropdownMenuSeparator /> */}
              {/* <DropdownMenuItem danger disabled={!row.original.is_active}>Encerrar participação</DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
]
