import { Button } from '@/components/ui/button'
import { MoreHorizontalIcon, PlusIcon } from 'lucide-react'
import { DialogsEnum } from '~/constants/enums'

import { Committee } from '@prisma/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { MyHeaders } from '~/constants/headers'
import { CommitteeWithMembersDataType } from '~/types'

export default function MembershipTableToolbarActions(props: {
  committee: CommitteeWithMembersDataType
  onDeactivateCommittee: () => void
  onCreateMembership: () => void
  handleOpenDialog: (dialogEnum: DialogsEnum) => void
}) {
  return (
    <>
      <Button
        onClick={() => {
          props.onCreateMembership()
          props.handleOpenDialog(DialogsEnum.membership)
        }}
        disabled={!props.committee.is_active}
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
        <DropdownMenuItem
          disabled={!props.committee.is_active}
          onClick={() => props.handleOpenDialog(DialogsEnum.committee)}
        >
          Editar {MyHeaders.COMMITTEE.toLowerCase()}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!props.committee.is_active || !props.committee.template_id}
          onClick={() => props.handleOpenDialog(DialogsEnum.succession)}
        >
          Suceder {MyHeaders.COMMITTEE.toLowerCase()}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          danger
          disabled={!props.committee.is_active}
          onClick={props.onDeactivateCommittee}
        >
          Encerrar {MyHeaders.COMMITTEE.toLowerCase()}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
