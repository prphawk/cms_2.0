import { ColumnDef } from '@tanstack/react-table'
import { CommitteeHeaders, MyHeaders } from '~/constants/headers'
import { _diffMonths, _sortStringDate, _toLocaleString } from '~/utils/string'
import DataTableColumnHeader, {
  DateColumn,
  EndDateBadge
} from '~/components/table/data-table-column-header'

import { Committee, Template, Notification } from '@prisma/client'
import { BellRingIcon, HelpCircleIcon, MoreHorizontal, Users2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'

export type TemplateType = Template & {
  _count: { committees: number }
  committee?: Committee | null
  notification: Notification | null
}

export const getTemplateColumns = (
  handleChangeNotifValue: (template: TemplateType, value: boolean) => void,
  handleViewCommittee: (committee_id: number) => void,
  onEditTemplate: (template: TemplateType) => void
): ColumnDef<TemplateType>[] => [
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
    accessorKey: 'committee',
    accessorFn: (row) =>
      row.committee?.begin_date && row.committee.end_date
        ? _diffMonths(row.committee.begin_date, row.committee.end_date)
        : undefined,
    id: 'Duração de Mandato',
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as number
      return <div>{value ? `${value} meses` : 'Permanente'}</div>
    }
  },
  {
    accessorKey: '_count',
    accessorFn: (row) => row._count.committees.toString(),
    id: 'Mandato Atual',
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string

      return (
        <div className="flex max-w-[280px] flex-row">
          <div className="truncate">{value}º mandato</div>
        </div>
      )
    }
  },

  {
    accessorKey: 'committee.begin_date',
    accessorFn: (row) => _toLocaleString(row.committee?.begin_date),
    sortingFn: _sortStringDate,
    id: CommitteeHeaders.BEGIN_DATE,
    header: ({ column }) => <DataTableColumnHeader column={column} title={`Início de Mandato`} />,
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
  {
    accessorKey: 'Notificar-me',
    id: MyHeaders.NOTIFICATIONS,
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <div className="flex flex-row text-center">
        <DataTableColumnHeader className="min-w-[64px]" column={column} title={column.id} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircleIcon className="ml-2 h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>
              Receber notificação por email {process.env.DAYS} dias antes do mandato ativo expirar
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
    cell: ({ row }) => {
      const template = row.original
      return (
        <div className="flex flex-row items-center gap-x-2">
          <Switch
            checked={template.notification?.isOn}
            onCheckedChange={(v) => handleChangeNotifValue(template, v)}
          />
          <BellRingIcon className="ml-1 h-4 w-4" />
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
        <div className="flex min-w-[64px]">
          {committee && (
            <div className="ml-auto px-4">
              <Button
                onClick={() => handleViewCommittee(committee.id)}
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
                  <Separator />
                  <DropdownMenuItem onClick={() => handleViewCommittee(committee.id)}>
                    Ver mandato atual
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditTemplate(row.original)}>
                    Editar {MyHeaders.TEMPLATE.toLowerCase()}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      )
    }
  }
]
