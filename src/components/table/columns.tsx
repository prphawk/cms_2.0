'use client';

import { Committee } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { CommitteeHeaders } from '~/constants/headers';
import { _toLocaleString } from '~/utils/string';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const columns: ColumnDef<Committee>[] = [
  {
    accessorKey: 'name',
    header: () => <strong>{CommitteeHeaders.NAME}</strong>,
    cell: ({ row }) => {
      const value = row.getValue('name') as string;
      const committee_template_id = row.original.committee_template_id as number | undefined;

      return <div>{value + (committee_template_id ? '' : '*')}</div>;
    },
  },
  {
    accessorKey: 'bond',
    header: () => <strong>{CommitteeHeaders.BOND}</strong>,
    cell: ({ row }) => {
      const value = row.getValue('bond') as string;
      return <div className="text-center">{value}</div>;
    },
  },
  {
    accessorKey: 'begin_date',
    header: () => <strong>{CommitteeHeaders.BEGIN_DATE}</strong>,
    cell: ({ row }) => {
      const date = row.getValue('begin_date') as Date;
      return <div className="text-center">{_toLocaleString(date)}</div>; // pode retornar JSX tbm
    },
  },
  {
    accessorKey: 'end_date',
    header: () => <strong>{CommitteeHeaders.END_DATE}</strong>,
    cell: ({ row }) => {
      const date = row.getValue('end_date') as Date;
      return <div className="text-center">{_toLocaleString(date)}</div>;
    },
  },
  {
    accessorKey: 'ordinance',
    header: () => <strong>{CommitteeHeaders.ORDINANCE}</strong>,
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
      );
    },
  },
];
