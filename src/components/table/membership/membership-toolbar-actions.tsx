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

export default function MembershipTableToolbarActions(props: {
  committee: CommitteeDataType;
  handleCreateMembership: () => void;
  handleDeactivateCommittees: () => void;
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
      />
    </>
  );
}

const ActionsMenuButton = ({
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
        <DropdownMenuItem>Editar órgão</DropdownMenuItem>
        {/*TODO botar uns icons aqui */}
        {committee.committee_template_id && <DropdownMenuItem>Suceder órgão</DropdownMenuItem>}
        <DropdownMenuSeparator />
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
