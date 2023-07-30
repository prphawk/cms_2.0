import { Button } from '@/components/ui/button'
import { MoreHorizontalIcon, PlusIcon } from 'lucide-react'
import { CommitteeDataType } from '~/pages/dashboard/committees/[id]'
import { DialogsEnum } from '~/constants/enums'

import { Committee } from '@prisma/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Headers } from '~/constants/headers'

export default function MembershipTableToolbarActions(props: {
  committee: CommitteeDataType
  onDeactivateCommittee: () => void
  handleClickAddMembershipButton: () => void
  handleOpenDialog: (dialogEnum: DialogsEnum) => void
}) {
  return (
    <>
      <Button
        onClick={() => {
          props.handleClickAddMembershipButton()
          props.handleOpenDialog(DialogsEnum.membership)
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
        onDeactivateCommittee={props.onDeactivateCommittee}
        handleOpenDialog={props.handleOpenDialog}
      />
    </>
  )
}

const ActionsMenuButton = (props: {
  committee: Committee
  onDeactivateCommittee: () => void
  handleOpenDialog: (dialogEnum: DialogsEnum) => void
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
        <DropdownMenuItem onClick={() => props.handleOpenDialog(DialogsEnum.committee)}>
          Editar {Headers.COMMITTEE.toLowerCase()}
        </DropdownMenuItem>
        {/*TODO botar uns icons aqui */}
        <DropdownMenuItem
          disabled={!props.committee.is_active || !props.committee.committee_template_id}
          onClick={() => props.handleOpenDialog(DialogsEnum.succession)}
        >
          Suceder {Headers.COMMITTEE.toLowerCase()}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          danger
          disabled={!props.committee.is_active}
          onClick={props.onDeactivateCommittee}
        >
          Encerrar {Headers.COMMITTEE.toLowerCase()}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
