'use client';

import { Committee } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { CommitteeHeaders } from '~/constants/headers';
import { _toLocaleString } from '~/utils/string';
import { EyeIcon, MoreHorizontal } from 'lucide-react';
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
    id: CommitteeHeaders.NAME,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string;
      const is_temporary = !row.original.committee_template_id;
      const is_inactive = !row.original.is_active;

      return (
        <div>
          {is_temporary && (
            <Badge className="mr-2 text-white" variant="outline">
              Temporária
            </Badge>
          )}
          {is_inactive && (
            <Badge className="mr-2 text-white" variant="outline">
              Inativa
            </Badge>
          )}
          <strong>{value}</strong>
        </div>
      );
    },
  },
  {
    accessorKey: 'bond',
    id: CommitteeHeaders.BOND,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string;
      return <div>{value}</div>;
    },
  },
  {
    accessorKey: 'begin_date',
    id: CommitteeHeaders.BEGIN_DATE,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const date = row.getValue(column.id) as Date;
      return <div>{_toLocaleString(date)}</div>; // pode retornar JSX tbm
    },
  },
  {
    accessorKey: 'end_date',
    id: CommitteeHeaders.END_DATE,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const date = row.getValue(column.id) as Date;
      return <div>{_toLocaleString(date)}</div>;
    },
  },
  {
    accessorKey: 'ordinance',
    id: CommitteeHeaders.ORDINANCE,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string;
      return <div>{value}</div>;
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
