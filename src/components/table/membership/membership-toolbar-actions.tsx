import { Button } from '@/components/ui/button';
import { MoreHorizontalIcon, PlusIcon } from 'lucide-react';
import { CommitteeDataType } from '~/pages/dashboard/committees/[id]';
import { Committee } from '@prisma/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';

export default function MembershipTableToolbarActions(props: {
  committee: CommitteeDataType;
  handleCreateMembership: () => void;
  handleDeactivateCommittees: () => void;
  handleOpenDialog: (open: boolean) => void;
}) {
  return (
    <>
      <Button
        onClick={props.handleCreateMembership}
        variant="outline"
        size="sm"
        className="ml-auto mr-2 hidden h-8 bg-transparent lg:flex"
      >
        <PlusIcon className="mr-2 h-5 w-5" />
        Adicionar membro(a)
      </Button>
      <ActionsMenuButton
        committee={props.committee}
        handleDeactivateCommittees={props.handleDeactivateCommittees}
        handleOpenDialog={props.handleOpenDialog}
      />
    </>
  );
}

const ActionsMenuButton = (props: {
  committee: Committee;
  handleDeactivateCommittees: (ids: number[]) => void;
  handleOpenDialog: (open: boolean) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto mr-2 hidden h-8 bg-transparent lg:flex"
        >
          <MoreHorizontalIcon className="mr-2 h-5 w-5" />
          Ações
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => props.handleOpenDialog(true)}>
          Editar órgão
        </DropdownMenuItem>
        {/*TODO botar uns icons aqui */}
        {props.committee.committee_template_id && (
          <DropdownMenuItem disabled>Suceder órgão</DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            props.handleDeactivateCommittees([props.committee.id]);
            props.committee.is_active = false;
          }}
        >
          Desativar órgão
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
