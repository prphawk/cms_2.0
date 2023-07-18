import { Committee } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { CommitteesHeaders } from '~/constants/headers';
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
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const getCommitteesColumns = (
  handleDeactivateCommittees: (ids: number[]) => void,
  handleViewCommittee: (id: number) => void,
): ColumnDef<Committee>[] => [
  {
    accessorKey: 'name',
    id: CommitteesHeaders.NAME,
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
    id: CommitteesHeaders.BOND,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string;
      return <div>{value}</div>;
    },
  },
  {
    accessorKey: 'begin_date',
    id: CommitteesHeaders.BEGIN_DATE,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const date = row.getValue(column.id) as Date;
      return <div>{_toLocaleString(date)}</div>; // pode retornar JSX tbm
    },
  },
  {
    accessorKey: 'end_date',
    id: CommitteesHeaders.END_DATE,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const date = row.getValue(column.id) as Date;
      return <div>{_toLocaleString(date)}</div>;
    },
  },
  {
    accessorKey: 'ordinance',
    id: CommitteesHeaders.ORDINANCE,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string;
      return <div>{value}</div>;
    },
  },
  {
    accessorKey: 'members',
    id: CommitteesHeaders.MEMBERS,
    header: ({ column }) => <DataTableColumnHeader column={column} title={column.id} />,
    cell: ({ row, column }) => {
      const value = row.getValue(column.id) as string;
      return <div className="text-center">{value.length}</div>;
    },
  },
  {
    accessorKey: 'observations',
    id: CommitteesHeaders.OBSERVATIONS,
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
        <DropdownMenuItem>Ver membros</DropdownMenuItem>
        <DropdownMenuItem>Suceder órgão</DropdownMenuItem>
        <DropdownMenuSeparator />
        {committee.committee_template_id && (
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(committee.id.toString())}>
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
