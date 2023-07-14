'use client';

import { Committee } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { CommitteeHeaders } from '~/constants/headers';
import { _toLocaleString } from '~/utils/string';
import { ArrowUpDown, EyeIcon, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import DataTableColumnHeader from '~/components/table/data-table-column-header';

export const columns: ColumnDef<Committee>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title={CommitteeHeaders.NAME} />,
    cell: ({ row }) => {
      const value = row.getValue('name') as string;
      const is_temporary = !row.original.committee_template_id;

      return (
        <div>
          {is_temporary && (
            <Badge className="mr-2 text-white" variant="outline">
              Temporária
            </Badge>
          )}
          <strong>{value}</strong>
        </div>
      );
    },
  },
  {
    accessorKey: 'bond',
    header: ({ column }) => <DataTableColumnHeader column={column} title={CommitteeHeaders.BOND} />,
    cell: ({ row }) => {
      const value = row.getValue('bond') as string;
      return <div className="text-center">{value}</div>;
    },
  },
  {
    accessorKey: 'begin_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={CommitteeHeaders.BEGIN_DATE} />
    ),
    cell: ({ row }) => {
      const date = row.getValue('begin_date') as Date;
      return <div className="text-center">{_toLocaleString(date)}</div>; // pode retornar JSX tbm
    },
  },
  {
    accessorKey: 'end_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={CommitteeHeaders.END_DATE} />
    ),
    cell: ({ row }) => {
      const date = row.getValue('end_date') as Date;
      return <div className="text-center">{_toLocaleString(date)}</div>;
    },
  },
  {
    accessorKey: 'ordinance',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={CommitteeHeaders.ORDINANCE} />
    ),
    cell: ({ row }) => {
      const value = row.getValue('ordinance') as string;
      return <div className="text-center">{value}</div>;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const committee = row.original;

      return (
        <>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Ver detalhes</span>
            <EyeIcon className="h-4 w-4" />
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
              <DropdownMenuItem>Ver membros</DropdownMenuItem>
              <DropdownMenuItem>Ver histórico</DropdownMenuItem>
              <DropdownMenuSeparator />
              {committee.committee_template_id && (
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(committee.id.toString())}
                >
                  Suceder comissão
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>Desativar comissão</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
