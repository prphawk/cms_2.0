import { ColumnDef } from '@tanstack/react-table'
import { CommitteeHeaders, MyHeaders } from '~/constants/headers'
import { _diffMonths, _sortStringDate, _toLocaleString } from '~/utils/string'
import DataTableColumnHeader, {
  DateColumn,
  EndDateBadge
} from '~/components/table/data-table-column-header'

import { Committee, Template } from '@prisma/client'
import { BellIcon, BellRingIcon, Users2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export const getTemplateColumns = (
  handleViewCommittee: (committee_id: number) => void
): ColumnDef<Template & { _count: { committees: number }; committee?: Committee }>[] => [
  {
    accessorKey: 'name',
    id: MyHeaders.TEMPLATE,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ column, row }) => {
      const value = row.getValue(column.id) as string
      return (
        <div className="flex w-[240px] flex-row">
          <strong className="truncate">{value}</strong>
        </div>
      )
    }
  },
  {
    accessorKey: '_count',
    accessorFn: (row) => row._count.committees.toString(),
    id: 'Mandatos',
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string

      return (
        <div className="flex max-w-[280px] flex-row">
          <div className="truncate">
            <strong className="truncate">{value}</strong>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: 'committee',
    accessorFn: (row) =>
      row.committee ? _diffMonths(row.committee.begin_date, row.committee.end_date) : undefined,
    id: 'Duração de Mandato',
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as number
      return <div>{value ? `${value} meses` : ''}</div>
    }
  },
  {
    accessorKey: 'committee.begin_date',
    accessorFn: (row) => _toLocaleString(row.committee?.begin_date),
    sortingFn: _sortStringDate,
    id: CommitteeHeaders.BEGIN_DATE,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={`Início de Mandato Atual`} />
    ),
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string

      return row.original?.committee ? <DateColumn value={value}></DateColumn> : <></>
    }
  },
  {
    accessorKey: 'committee.end_date',
    accessorFn: (row) => _toLocaleString(row.committee?.end_date),
    sortingFn: _sortStringDate,
    id: 'Próxima Eleição',
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string

      return row.original?.committee ? (
        <DateColumn value={value}>
          <EndDateBadge value={value} isActive={row.original?.committee?.is_active} />
        </DateColumn>
      ) : (
        <></>
      )
    }
  },
  // {
  //   accessorKey: 'observations',
  //   id: CommitteeHeaders.OBSERVATIONS,
  //   header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
  //   cell: ({ row, column }) => {
  //     const value = row.getValue(column.id) as string
  //     return (
  //       <TooltipProvider>
  //         <Tooltip>
  //           <TooltipTrigger asChild>
  //             <div className="w-48 truncate">{value}</div>
  //           </TooltipTrigger>
  //           <TooltipContent>{value}</TooltipContent>
  //         </Tooltip>
  //       </TooltipProvider>
  //     )
  //   }
  // },
  {
    accessorKey: 'Notificar-me',
    id: 'Notificações',
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader className="min-w-[64px]" column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-x-2">
          <Switch />
          <BellRingIcon className="h-4 w-4" />
        </div>
      )
    }
  },
  {
    enableHiding: false,
    id: 'actions',
    cell: ({ row }) => {
      const committee = row.original.committee
      return (
        <div className="min-w-[64px]">
          {committee && (
            <Button
              onClick={() => handleViewCommittee(committee.id)}
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Ver detalhes</span>
              <Users2Icon className="h-4 w-4" />
            </Button>
          )}
        </div>
      )
    }
  }
]
