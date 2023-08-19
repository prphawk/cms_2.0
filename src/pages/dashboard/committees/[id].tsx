import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AuthenticatedPage from '~/components/authenticated-page'
import { getMembershipColumns } from '~/components/table/membership/membership-columns'
import { IFilter, IFilterOptions, TableToolbarFilter } from '~/components/table/data-table-toolbar'
import { DataTable } from '~/components/table/data-table'
import { ContentLayout } from '~/layouts/page-layout'
import { api } from '~/utils/api'
import { _isNumeric, _toLocaleString, _formatCount } from '~/utils/string'
import MembershipTableToolbarActions from '~/components/table/membership/membership-toolbar-actions'
import { Dot } from '~/components/dot'
import { z } from 'zod'
import { CommitteeHeaders, MembershipHeaders, MyHeaders } from '~/constants/headers'
import {
  FilterStateType,
  filterAProps,
  filterDProps,
  getActiveDateFilterLabels,
  getComplementaryFilterValue,
  handleChangeComplementaryFilters
} from '~/components/filters'
import CommitteeDialog from '~/components/dialogs/committee-dialog'
import MembershipDialog from '~/components/dialogs/membership-dialog'
import SuccessionDialogs from '~/components/dialogs/succession-dialogs'
import { CommitteeSchema } from '~/schemas/committee'
import { MembershipFormSchema } from '~/schemas/membership'
import { DialogsEnum } from '~/constants/enums'
import { AlertDialog } from '~/components/dialogs/alert-dialog'
import { HourglassIcon, CircleOffIcon } from 'lucide-react'
import { IconBadge } from '~/components/badge'
import {
  CommitteeWithOptionalTemplateDataType,
  FilterStateDatesType,
  MembershipWithEmployeeDataType
} from '~/types'
import ErrorPage from '~/pages/500'
import { LS } from '~/constants/local_storage'
import { TitleLayout } from '~/layouts/text-layout'

export default function CommitteeMembership() {
  const router = useRouter()
  const param_id = Number(router.query.id)

  const utils = api.useContext()

  const updateCommittee = api.committee.update.useMutation({
    onSettled() {
      return utils.committee.getOne.invalidate()
    }
  })

  const updateMembership = api.membership.update.useMutation({
    onSettled() {
      utils.committee.getOne.invalidate()
      utils.membership.getRoleOptionsByCommittee.invalidate()
    }
  })

  const createMembership = api.membership.create.useMutation({
    onSuccess() {
      utils.employee.getOptions.invalidate() //TODO caso tenha criado um novo servidor no processo, atualiza a lista de opções do diálogo
    },
    onSettled() {
      utils.committee.getOne.invalidate()
      utils.membership.getRoleOptionsByCommittee.invalidate()
    }
  })

  const deactivateCommittee = api.committee.deactivate.useMutation({
    onSuccess() {
      utils.committee.getOne.invalidate()
      utils.committee.getAll.invalidate() //TODO ver aquele negócio de mudar o resultado da chamada pra so mudar o status dessa comissão
    }
  })
  const deactivateMembership = api.membership.deactivate.useMutation({
    onSuccess() {
      utils.committee.getOne.invalidate()
    }
  })

  const [selectedMembership, setSelectedMembership] = useState<MembershipWithEmployeeDataType>()

  const [openDialog, setOpenDialog] = useState(DialogsEnum.none)

  const handleOpenDialog = (dialogEnum: DialogsEnum) => {
    setOpenDialog(dialogEnum)
  }

  const [filterA, setFilterA] = useState<FilterStateType>()
  const [filterC, setFilterC] = useState<string[]>()
  const [filterD, setFilterD] = useState<FilterStateDatesType>({
    begin_date: undefined,
    end_date: undefined
  })

  useEffect(() => {
    setFilterA(getComplementaryFilterValue(LS.MEMBERSHIP_A, 'is_active', 'is_inactive'))
  }, [])

  const {
    data: committeeData,
    isLoading,
    isError
  } = api.committee.getOne.useQuery(
    {
      id: param_id,
      is_active: filterA?.value,
      roles: filterC,
      dates: filterD
    },
    { enabled: !isNaN(param_id) }
  )

  const { data: roleOptions } = api.membership.getRoleOptionsByCommittee.useQuery(
    {
      committee_id: param_id
    },
    { enabled: !isNaN(param_id) }
  )

  if (isError) {
    return <ErrorPage />
  }

  const handleChangeActiveFiltersC = (values?: string[]) => {
    setFilterC(!values?.length ? undefined : values)
  }

  const handleChangeActiveFiltersD = (values: FilterStateDatesType) => {
    setFilterD({ ...values })
  }

  const propsFilters: IFilter[] = [
    {
      ...filterAProps(),
      activeFilters: filterA?.labels,
      handleChangeActiveFilters: (labels) =>
        handleChangeComplementaryFilters(LS.MEMBERSHIP_A, 'is_active', setFilterA, labels)
    },
    {
      title: 'Cargo',
      options: roleOptions?.length ? (roleOptions as IFilterOptions[]) : [],
      activeFilters: filterC,
      handleChangeActiveFilters: handleChangeActiveFiltersC
    },
    {
      ...filterDProps,
      dates: filterD,
      activeFilters: getActiveDateFilterLabels(filterD),
      handleChangeActiveFilters: handleChangeActiveFiltersD
    }
  ]

  const handleSaveCommittee = (
    committeeSchema: z.infer<typeof CommitteeSchema> & { id?: number }
  ) => {
    if (committeeData?.id) {
      updateCommittee.mutate({ id: committeeData.id, ...committeeSchema })
    }
  }

  const handleSaveMembership = (membershipSchema: z.infer<typeof MembershipFormSchema>) => {
    if (!committeeData?.id) return
    if (selectedMembership) {
      updateMembership.mutate({ id: selectedMembership.id, ...membershipSchema })
    } else createMembership.mutate({ committee_id: committeeData.id, ...membershipSchema })
  }

  const onCreateMembership = () => {
    setSelectedMembership(undefined)
  }

  const onChangeMembership = (membership: MembershipWithEmployeeDataType) => {
    handleOpenDialog(DialogsEnum.membership)
    setSelectedMembership({ ...membership })
  }

  const onDeactivateMembership = (membership: MembershipWithEmployeeDataType) => {
    handleOpenDialog(DialogsEnum.alert_deactivate)
    setSelectedMembership({ ...membership })
  }

  const onDeactivateCommittee = () => {
    handleOpenDialog(DialogsEnum.alert_succession)
  }

  const handleDeactivateCommittee = () => {
    deactivateCommittee.mutate({ id: param_id })
  }

  const handleDeactivateMembership = () => {
    if (selectedMembership) deactivateMembership.mutate({ id: selectedMembership.id })
  }

  const propsActions = {
    committee: committeeData!,
    onCreateMembership,
    onDeactivateCommittee,
    handleOpenDialog
  }

  return (
    <AuthenticatedPage>
      <ContentLayout className="committee my-6 mb-auto min-h-[89vh]">
        {committeeData && (
          <>
            <CommitteesTableTitle data={committeeData} />
            <DataTable
              isLoading={isLoading}
              data={committeeData?.members || []}
              columns={getMembershipColumns(
                onChangeMembership,
                onDeactivateMembership,
                committeeData
              )}
              tableFilters={<TableToolbarFilter filters={propsFilters} />}
              tableActions={<MembershipTableToolbarActions {...propsActions} />}
            />
            <CommitteeDialog
              committee={committeeData}
              open={openDialog == DialogsEnum.committee}
              handleOpenDialog={handleOpenDialog}
              handleSave={handleSaveCommittee}
            />
            <MembershipDialog
              member={selectedMembership}
              open={openDialog == DialogsEnum.membership}
              handleOpenDialog={handleOpenDialog}
              handleSave={handleSaveMembership}
              committee={{
                id: committeeData.id,
                begin_date: committeeData.begin_date,
                end_date: committeeData.end_date
              }}
            />
            <SuccessionDialogs
              open={openDialog}
              handleOpenDialog={handleOpenDialog}
              committeeId={committeeData.id}
            />
            <AlertDialog
              open={openDialog == DialogsEnum.alert_succession}
              description={
                <>
                  Esta ação irá <strong>encerrar</strong> o {MyHeaders.COMMITTEE.toLowerCase()}{' '}
                  atual e todas as suas participações. Deseja continuar?
                </>
              }
              handleOpenDialog={handleOpenDialog}
              handleContinue={handleDeactivateCommittee}
            />
            <AlertDialog
              open={openDialog == DialogsEnum.alert_deactivate}
              description={
                <>
                  Esta ação irá <strong>encerrar</strong> esta participação. Deseja continuar?
                </>
              }
              handleOpenDialog={handleOpenDialog}
              handleContinue={handleDeactivateMembership}
            />
          </>
        )}
      </ContentLayout>
    </AuthenticatedPage>
  )
}

const CommitteesTableTitle = ({ data }: { data: CommitteeWithOptionalTemplateDataType }) => {
  const { data: countData, isLoading } = api.membership.groupByActivity.useQuery({
    committee_id: data.id
  })

  const { active_count, total_count } = _formatCount(isLoading, countData)
  return (
    <Accordion className="mb-6" type="single" defaultValue="item-1" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <TitleLayout>
            {data?.name}
            <span className="ml-1">
              {!data.template_id && (
                <IconBadge>
                  <HourglassIcon className="h-4 w-4" />
                </IconBadge>
              )}
              {!data.is_active && (
                <IconBadge>
                  <CircleOffIcon className="h-4 w-4 " />
                </IconBadge>
              )}
            </span>
          </TitleLayout>
        </AccordionTrigger>
        <AccordionContent className="tracking-wide">
          <strong>{CommitteeHeaders.BOND}: </strong> {data?.bond}
          <Dot />
          <strong>{CommitteeHeaders.ORDINANCE}: </strong>
          {data?.ordinance || 'Não informado'}
          <Dot />
          <strong>{CommitteeHeaders.BEGIN_DATE}: </strong>
          {_toLocaleString(data?.begin_date)}
          <Dot />
          <strong>{CommitteeHeaders.END_DATE}: </strong>
          {_toLocaleString(data?.end_date)}
          <Dot />
          {data.observations && (
            <>
              <strong>{CommitteeHeaders.OBSERVATIONS}: </strong> "{data.observations}"
              <Dot />
            </>
          )}
          <strong>{MyHeaders.CATEGORY_F}: </strong>
          {MyHeaders.COMMITTEE}
          {data?.template_id ? ' Permanente' : ' Temporário'}
          <Dot />
          {data?.template_id ? (
            <>
              <strong>{CommitteeHeaders.TEMPLATE}: </strong>
              {data?.template?.name}
              <Dot />
            </>
          ) : (
            <></>
          )}
          <strong>{MyHeaders.STATUS_F}: </strong> {data?.is_active ? 'Ativo' : 'Inativo'}
          <Dot />
          <strong>{CommitteeHeaders.MEMBERS}: </strong> {active_count} de {total_count}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
