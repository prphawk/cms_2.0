import { Employee, Membership } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { CommitteeHeaders, GeneralHeaders, MembershipHeaders } from '~/constants/headers';
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
import { Badge } from '@/components/ui/badge';
import DataTableColumnHeader from '~/components/table/data-table-column-header';
import Link from 'next/link';
import { Router } from 'next/router';
import { Routes } from '~/constants/routes';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const getMembershipColumns = (
  handleChangeMembership: (membership: Membership & { employee: Employee }) => void,
  committee_template_id?: number | null,
  committee_begin_date?: Date | null,
  committee_end_date?: Date | null,
): // handleDeactivateCommittees: (ids: number[]) => void,
ColumnDef<Membership & { employee: Employee }>[] => [
  {
    accessorKey: 'employee.name',
    accessorFn: (row) => row.employee.name,
    id: MembershipHeaders.NAME,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row }) => {
      const value = row.original.employee?.name as string;
      const is_temporary = row.original.is_temporary;
      const is_inactive = !row.original.is_active;

      return (
        <div>
          {is_temporary && (
            <Badge className="mr-2 text-white" variant="outline">
              Temporário(a)
            </Badge>
          )}
          {is_inactive && (
            <Badge className="mr-2 text-white" variant="outline">
              Inativo(a)
            </Badge>
          )}
          <strong>{value}</strong>
        </div>
      );
    },
  },
  {
    accessorKey: 'role',
    id: MembershipHeaders.ROLE,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string;
      const committee_id = row.original.committee_id;
      const role = row.original.role;
      return (
        <Link className="underline" href={`${Routes.COMMITTEES}/${committee_id}/${role}`}>
          {value}
        </Link>
      );
    },
  },
  {
    accessorKey: 'begin_date',
    id: MembershipHeaders.BEGIN_DATE,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const date = (row.getValue(column.id) as Date) || committee_begin_date;
      return <div>{_toLocaleString(date)}</div>; // pode retornar JSX tbm
    },
  },
  {
    accessorKey: 'end_date',
    id: MembershipHeaders.END_DATE,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const date = (row.getValue(column.id) as Date) || committee_end_date;
      return <div>{_toLocaleString(date)}</div>; // pode retornar JSX tbm
    },
  },
  {
    accessorKey: 'observations',
    id: MembershipHeaders.OBSERVATIONS,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-60 truncate">{value}</div>
            </TooltipTrigger>
            <TooltipContent>{value}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const committee_id = row.original.committee_id;
      const role = row.original.role;
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
              <DropdownMenuItem>
                {committee_template_id ? (
                  <Link href={`${Routes.TEMPLATES}/${committee_template_id}/${role}`}>
                    Ver histórico do cargo na {CommitteeHeaders.TEMPLATE}
                  </Link>
                ) : (
                  <Link href={`${Routes.COMMITTEES}/${committee_id}/${role}`}>
                    Ver histórico do cargo na {GeneralHeaders.COMMITTEE}
                  </Link>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem disabled>Suceder cargo</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleChangeMembership(row.original)}>
                Editar participação
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Encerrar participação</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
