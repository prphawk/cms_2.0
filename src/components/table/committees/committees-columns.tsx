import { Committee } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { CommitteeHeaders } from '~/constants/headers';
import { _toLocaleString } from '~/utils/string';
import { CircleOffIcon, EyeIcon, HourglassIcon, LucideIcon, MoreHorizontal } from 'lucide-react';
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
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { Routes } from '~/constants/routes';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface IActiveCount {
  active_count: number;
  total_count: number;
}

export const IconBadge = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <Badge className="ml-2 px-1 py-0.5" variant="outline">
      {children}
    </Badge>
  );
};

export const getCommitteesColumns = (
  handleDeactivateCommittees: (ids: number[]) => void,
  handleViewCommittee: (id: number) => void,
): ColumnDef<
  Committee & {
    members_count: {
      active_count: number;
      total_count: number;
    };
  }
>[] => [
  {
    accessorKey: 'name',
    id: CommitteeHeaders.NAME,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string;
      const is_temporary = !row.original.committee_template_id;
      const is_inactive = !row.original.is_active;

      return (
        <div className="inline-block w-full truncate">
          <strong className="">{value}</strong>
          {is_temporary && (
            <IconBadge>
              <HourglassIcon className="h-3 w-3 text-white" />
            </IconBadge>
          )}
          {is_inactive && (
            <IconBadge>
              <CircleOffIcon className="h-3 w-3 text-white" />
            </IconBadge>
          )}
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
    accessorKey: 'ordinance',
    id: CommitteeHeaders.ORDINANCE,
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
      return <div className="text-sm">{_toLocaleString(date)}</div>; // pode retornar JSX tbm
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
    accessorKey: 'members_count',
    accessorFn: (row) => row.members_count,
    sortingFn: (row1, row2, columnId) => {
      return (row1.getValue(columnId) as IActiveCount).active_count >
        (row2.getValue(columnId) as IActiveCount).active_count
        ? 1
        : -1;
    },
    id: CommitteeHeaders.MEMBERS,
    header: ({ column }) => (
      <DataTableColumnHeader className="align-center" column={column} title={column.id} />
    ),
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as IActiveCount;
      return (
        <div className="text-center">
          {value.active_count} de {value.total_count} membros
        </div>
      );
    },
  },
  {
    accessorKey: 'observations',
    id: CommitteeHeaders.OBSERVATIONS,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-48 truncate">{value}</div>
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
      const committee = row.original;

      return (
        <>
          <Button
            onClick={() => handleViewCommittee(committee.id)}
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Ver detalhes</span>
            <EyeIcon className="h-4 w-4" />
          </Button>
          <CommitteeActionsMenuColumn
            committee={committee}
            handleDeactivateCommittees={handleDeactivateCommittees}
          />
        </>
      );
    },
  },
];

export const CommitteeActionsMenuColumn = ({
  committee,
  handleDeactivateCommittees,
}: {
  committee: Committee;
  handleDeactivateCommittees: (ids: number[]) => void;
}) => {
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
          <DropdownMenuItem
            disabled
            onClick={() => navigator.clipboard.writeText(committee.id.toString())}
          >
            Suceder órgão
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => {
            handleDeactivateCommittees([committee.id]);
            committee.is_active = false;
          }}
        >
          Desativar órgão
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
