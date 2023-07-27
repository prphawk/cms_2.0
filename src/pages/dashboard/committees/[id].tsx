import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { useRouter } from 'next/router'
import { useState } from 'react'
import AuthenticatedPage from '~/components/authenticated-page'
import { getMembershipColumns } from '~/components/table/membership/membership-columns'
import { IFilter, IFilterOptions, TableToolbarFilter } from '~/components/table/data-table-toolbar'
import { DataTable } from '~/components/table/data-table'
import PageLayout, { TitleLayout } from '~/layout'
import { api } from '~/utils/api'
import { _isNumeric, _toLocaleString, _formatCount } from '~/utils/string'
import { Committee, Employee, Membership } from '@prisma/client'
import MembershipTableToolbarActions from '~/components/table/membership/membership-toolbar-actions'
import { Dot } from '~/components/dot'
import { z } from 'zod'

import { MembershipHeaders } from '~/constants/headers'
import { FilterStateType, filterAProps, handleChangeActiveFilters } from '~/components/filters'
import CommitteeDialog, { CommitteeSchema } from '~/components/dialogs/committee-dialog'
import MembershipDialog, { MembershipSchema } from '~/components/dialogs/membership-dialog'
import SuccessionDialogs from '~/components/dialogs/succession-dialogs'

export enum dialogsEnum {
  committee,
  membership,
  succession1st,
  succession2nd
}

export default function CommitteeMembership() {
  const router = useRouter()
  const param_id = Number(router.query.id)

  const utils = api.useContext()

  //TODO replace w/ upsert? that would b cool
  const updateCommittee = api.committee.update.useMutation({
    // TODO onError
    onSettled() {
      return utils.committee.getOne.invalidate()
    }
  })

  //TODO upsert?
  const updateMembership = api.membership.update.useMutation({
    // TODO onError
    onSettled() {
      utils.committee.getOne.invalidate()
      utils.membership.getRoleOptionsByCommittee.invalidate()
    }
  })

  const createMembership = api.membership.create.useMutation({
    // TODO onError
    onSuccess() {
      utils.employee.getOptions.invalidate() //TODO caso tenha criado um novo servidor no processo, atualiza a lista de opções do diálogo
    },
    onSettled() {
      utils.committee.getOne.invalidate()
      utils.membership.getRoleOptionsByCommittee.invalidate()
    }
  })

  const [selectedMembership, setSelectedMembership] = useState<
    Membership & { employee: Employee }
  >()

  const [openDialog, setOpenDialog] = useState(-1)

  const handleOpenDialog = (dialogEnum: number) => {
    setOpenDialog(dialogEnum)
  }

  const [filterA, setFilterA] = useState<FilterStateType>()
  const [filterC, setFilterC] = useState<string[]>()

  const {
    data: committeeData,
    isLoading,
    isError
  } = api.committee.getOne.useQuery(
    {
      id: param_id,
      is_active: filterA?.value,
      roles: filterC
    },
    { enabled: !isNaN(param_id) }
  )

  const { data: roleOptions } = api.membership.getRoleOptionsByCommittee.useQuery(
    {
      committee_id: param_id
    },
    { enabled: !isNaN(param_id) }
  )

  if (
    isError
    //|| deactivate.isError
  ) {
    return <span>Error: sowwyyyy</span> //TODO pelo amor de deus kk
  }

  const handleChangeActiveFiltersC = (values?: string[]) => {
    setFilterC(!values?.length ? undefined : values)
  }

  const propsFilters: IFilter[] = [
    {
      ...filterAProps,
      activeFilters: filterA?.labels,
      handleChangeActiveFilters: (labels) =>
        handleChangeActiveFilters('is_active', setFilterA, labels)
    },
    {
      title: 'Cargo',
      options: roleOptions?.length ? (roleOptions as IFilterOptions[]) : [],
      activeFilters: filterC,
      handleChangeActiveFilters: handleChangeActiveFiltersC
    }
  ]

  const handleSaveCommittee = (
    committeeSchema: z.infer<typeof CommitteeSchema> & { id?: number }
  ) => {
    if (committeeData?.id) {
      updateCommittee.mutate({ id: committeeData.id, ...committeeSchema })
    }
  }

  const handleSaveMembership = (membershipSchema: z.infer<typeof MembershipSchema>) => {
    if (!committeeData?.id) return
    if (selectedMembership) {
      updateMembership.mutate({ id: selectedMembership.id, ...membershipSchema })
    } else createMembership.mutate({ committee_id: committeeData.id, ...membershipSchema })
  }

  const handleClickAddMembershipButton = () => {
    setSelectedMembership(undefined)
  }

  const handleChangeMembership = (membership: Membership & { employee: Employee }) => {
    handleOpenDialog(dialogsEnum.membership)
    setSelectedMembership({ ...membership })
  }

  const propsActions = {
    committee: committeeData!,
    handleClickAddMembershipButton,
    handleDeactivateCommittees: () => {}, //TODO
    handleOpenDialog
  }

  return (
    <AuthenticatedPage>
      <PageLayout>
        <div className="committee container my-10 mb-auto text-white ">
          {committeeData && (
            <>
              <CommitteeDetails data={committeeData} />
              <DataTable
                isLoading={isLoading}
                data={committeeData?.members || []}
                columns={getMembershipColumns(
                  handleChangeMembership,
                  committeeData.committee_template_id,
                  committeeData.begin_date,
                  committeeData.end_date
                )}
                tableFilters={<TableToolbarFilter filters={propsFilters} />}
                tableActions={<MembershipTableToolbarActions {...propsActions} />}
                column={MembershipHeaders.NAME}
              />
              <CommitteeDialog
                committee={committeeData}
                open={openDialog == dialogsEnum.committee}
                handleOpenDialog={handleOpenDialog}
                handleSave={handleSaveCommittee}
              />
              <MembershipDialog
                member={selectedMembership}
                open={openDialog == dialogsEnum.membership}
                handleOpenDialog={handleOpenDialog}
                handleSave={handleSaveMembership}
                committee={{
                  id: committeeData.id,
                  begin_date: committeeData.begin_date,
                  end_date: committeeData.end_date
                }}
              />
              <SuccessionDialogs
                open1st={openDialog == dialogsEnum.succession1st}
                open2nd={openDialog == dialogsEnum.succession2nd}
                handleOpenDialog={handleOpenDialog}
                handleSave={(data) => console.log(data)}
                committeeId={committeeData.id}
              />
            </>
          )}
        </div>
      </PageLayout>
    </AuthenticatedPage>
  )
}

export type CommitteeDataType = Committee & { members: Membership[] }

const CommitteeDetails = ({ data }: { data: CommitteeDataType }) => {
  const { data: countData, isLoading } = api.membership.groupByActivity.useQuery({
    committee_id: data.id
  })

  const { active_count, total_count } = _formatCount(isLoading, countData)
  return (
    <Accordion className="mb-6" type="single" defaultValue="item-1" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <TitleLayout>{data?.name}</TitleLayout>
        </AccordionTrigger>
        <AccordionContent className="tracking-wide">
          <strong>Vínculo: </strong> {data?.bond}
          <Dot />
          <strong>Portaria: </strong>
          {data?.ordinance || '-'}
          <Dot />
          <strong>Data de Início: </strong>
          {_toLocaleString(data?.begin_date)}
          <Dot />
          <strong>Data de Fim: </strong>
          {_toLocaleString(data?.end_date)}
          <Dot />
          {data.observations && (
            <>
              <strong>Observações: </strong> "{data.observations}"
              <Dot />
            </>
          )}
          <strong>Tipo: </strong>Órgão
          {data?.committee_template_id ? ' Permanente' : ' Temporário'}
          <Dot />
          <strong>Status: </strong> {data?.is_active ? 'Ativa' : 'Inativa'}
          <Dot />
          <strong>Membros: </strong> {total_count}
          <Dot />
          <strong>Membros ativos: </strong> {active_count}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
