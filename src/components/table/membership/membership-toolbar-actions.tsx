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

export default function DataTableToolbarActions(props: {
  committee: CommitteeDataType;
  handleAddMembership: () => void;
  handleDeactivateCommittees: () => void;
}) {
  return (
    <>
      <Button
        onClick={props.handleAddMembership}
        variant="outline"
        size="sm"
        className="ml-auto mr-2 hidden h-8 bg-transparent lg:flex"
      >
        <PlusIcon className="mr-2 h-5 w-5" />
        Adicionar membro(a)
      </Button>
      <CommitteeActionsMenuButton
        committee={props.committee}
        handleDeactivateCommittees={props.handleDeactivateCommittees}
      />
    </>
  );
}

export const CommitteeActionsMenuButton = ({
  committee,
  handleDeactivateCommittees,
}: {
  committee: Committee;
  handleDeactivateCommittees: (ids: number[]) => void;
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
        <DropdownMenuItem>Editar comissão</DropdownMenuItem>
        {/*TODO botar uns icons aqui */}
        <DropdownMenuItem>Suceder comissão</DropdownMenuItem>
        <DropdownMenuSeparator />
        {committee.committee_template_id && <DropdownMenuItem>Suceder comissão</DropdownMenuItem>}
        <DropdownMenuItem
          onClick={() => {
            handleDeactivateCommittees([committee.id]);
            committee.is_active = false;
          }}
        >
          Desativar comissão
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
