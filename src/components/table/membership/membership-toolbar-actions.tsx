import { Button } from '@/components/ui/button';
import { MoreHorizontalIcon, PlusIcon } from 'lucide-react';
import { CommitteeDataType, dialogsEnum } from '~/pages/dashboard/committees/[id]';
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
  handleDeactivateCommittees: () => void;
  handleClickAddMembershipButton: () => void;
  handleOpenDialog: (dialogEnum: number) => void;
}) {
  return (
    <>
      <Button
        onClick={() => {
          props.handleClickAddMembershipButton();
          props.handleOpenDialog(dialogsEnum.membership);
        }}
        variant="outline"
        size="sm"
        className="ml-auto mr-2 hidden h-8 bg-transparent lg:flex"
      >
        <PlusIcon className="mr-2 h-5 w-5" />
        Adicionar membro(s)
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
  handleOpenDialog: (dialogEnum: number) => void;
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
        <DropdownMenuItem onClick={() => props.handleOpenDialog(dialogsEnum.committee)}>
          Editar órgão
        </DropdownMenuItem>
        {/*TODO botar uns icons aqui */}
        {props.committee.committee_template_id && (
          <DropdownMenuItem
            onClick={() => {
              props.handleOpenDialog(dialogsEnum.membershipArray);
            }}
          >
            Suceder órgão
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {
          <DropdownMenuItem
            disabled={!props.committee.is_active}
            onClick={() => {
              props.handleDeactivateCommittees([props.committee.id]);
              props.committee.is_active = false;
            }}
          >
            Desativar órgão
          </DropdownMenuItem>
        }
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
