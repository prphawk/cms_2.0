import AuthenticatedPage from '~/components/authenticated-page'
import { getCommitteesColumns } from '~/components/table/committees/committees-columns'
import { DataTable } from '~/components/table/data-table'
import { ContentLayout } from '~/layouts/page-layout'
import { api } from '~/utils/api'
import { useEffect, useState } from 'react'
import { IFilter, TableToolbarFilter } from '../../../components/table/data-table-toolbar'
import { useRouter } from 'next/router'
import { Routes } from '~/constants/routes'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { _toLocaleString, _formatCount } from '~/utils/string'
import CommitteesTableToolbarActions from '~/components/table/committees/committees-toolbar-actions'
import { z } from 'zod'
import { CommitteeHeaders, MyHeaders } from '~/constants/headers'
import { DialogsEnum } from '~/constants/enums'
import {
  FilterStateType,
  filterAProps,
  filterDProps,
  filterTProps,
  getActiveDateFilterLabels,
  getComplementaryFilterValue,
  handleChangeComplementaryFilters
} from '~/components/filters'
import CommitteeDialog from '~/components/dialogs/committee-dialog'
import { CommitteeFormSchema } from '~/schemas/committee'
import { AlertDialog } from '~/components/dialogs/alert-dialog'
import { Committee } from '@prisma/client'
import SuccessionDialogs from '~/components/dialogs/succession-dialogs'
import ErrorPage from '~/pages/500'
import { LS } from '~/constants/local_storage'
import { TitleLayout } from '~/layouts/text-layout'
import { FilterStateDatesType } from '~/types'

export default function Committees() {
  const router = useRouter()

  const [openDialog, setOpenDialog] = useState(DialogsEnum.none)

  const [selectedCommittee, setSelectedCommittee] = useState<Committee>()

  const handleOpenDialog = (dialogEnum: DialogsEnum) => setOpenDialog(dialogEnum)

  const [filterA, setFilterA] = useState<FilterStateType>()
  const [filterT, setFilterT] = useState<FilterStateType>()
  const [filterD, setFilterD] = useState<FilterStateDatesType>({
    begin_date: undefined,
    end_date: undefined
  })

  useEffect(() => {
    const valueA = getComplementaryFilterValue(LS.COMMITTEE_A, 'is_active', 'is_inactive')
    const valueT = getComplementaryFilterValue(LS.COMMITTEE_T, 'is_temporary', 'is_permanent')
    if (valueA || valueT) {
      utils.committee.getAll.cancel()
      setFilterA(valueA)
      setFilterT(valueT)
    }
  }, [])

  const utils = api.useContext()

  const { data, isLoading, isError } = api.committee.getAll.useQuery({
    is_active: filterA?.value,
    is_temporary: filterT?.value,
    dates: filterD
  })

  if (isError) {
    return <ErrorPage />
  }

  const handleChangeActiveFiltersD = (values: FilterStateDatesType) => {
    setFilterD({ ...values })
  }

  const propsFilters: IFilter[] = [
    {
      ...filterAProps(),
      activeFilters: filterA?.labels,
      handleChangeActiveFilters: (labels) =>
        handleChangeComplementaryFilters(LS.COMMITTEE_A, 'is_active', setFilterA, labels)
    },
    {
      ...filterTProps,
      activeFilters: filterT?.labels,
      handleChangeActiveFilters: (labels) =>
        handleChangeComplementaryFilters(LS.COMMITTEE_T, 'is_temporary', setFilterT, labels)
    },
    {
      ...filterDProps,
      dates: filterD,
      activeFilters: getActiveDateFilterLabels(filterD),
      handleChangeActiveFilters: handleChangeActiveFiltersD
    }
  ]

  const deactivate = api.committee.deactivate.useMutation({
    onMutate() {
      return utils.committee.getAll.cancel()
    },
    onSuccess() {
      return utils.committee.getAll.invalidate()
    }
  })

  const create = api.committee.create.useMutation({
    onMutate() {
      return utils.committee.getAll.cancel()
    },
    onSuccess(data) {
      router.push(`${Routes.COMMITTEES}/${data.id}`)
    }
  })

  const update = api.committee.update.useMutation({
    onMutate() {
      return utils.committee.getAll.cancel()
    },
    onSuccess() {
      return utils.committee.getAll.invalidate()
    }
  })

  function onDeactivateCommittee(com: Committee) {
    setSelectedCommittee(com)
    setOpenDialog(DialogsEnum.alert_deactivate)
  }

  function handleDeactivateCommittee() {
    if (selectedCommittee && typeof selectedCommittee == 'number')
      deactivate.mutate({ id: selectedCommittee })
  }

  function onCommitteeSuccession(com: Committee) {
    setSelectedCommittee(com)
    setOpenDialog(DialogsEnum.succession)
  }

  function onViewCommittee(com: Committee) {
    router.push(`${Routes.COMMITTEES}/${com.id}`)
  }

  function onEditCommittee(com: Committee) {
    setSelectedCommittee(com)
    setOpenDialog(DialogsEnum.committee)
  }

  const handleSaveCommittee = (data: z.infer<typeof CommitteeFormSchema>) => {
    data.id ? update.mutate({ id: data.id, ...data }) : create.mutate(data)
  }

  const handleCreateCommittee = () => {
    setSelectedCommittee(undefined)
    handleOpenDialog(DialogsEnum.committee)
  }

  return (
    <AuthenticatedPage>
      <ContentLayout className="committees my-6 mb-auto min-h-[89vh]">
        <CommitteeTableTitle />
        <DataTable
          data={data || []}
          isLoading={isLoading}
          columns={getCommitteesColumns(
            onViewCommittee,
            onEditCommittee,
            onCommitteeSuccession,
            onDeactivateCommittee
          )}
          tableFilters={<TableToolbarFilter filters={propsFilters} />}
          tableActions={
            <CommitteesTableToolbarActions handleCreateCommittee={handleCreateCommittee} />
          }
        />
        <CommitteeDialog
          open={openDialog === DialogsEnum.committee}
          handleOpenDialog={handleOpenDialog}
          handleSave={handleSaveCommittee}
          committee={selectedCommittee}
        />
        {selectedCommittee && (
          <SuccessionDialogs
            open={openDialog}
            handleOpenDialog={handleOpenDialog}
            committeeId={selectedCommittee?.id}
          />
        )}
        <AlertDialog
          open={openDialog == DialogsEnum.alert_deactivate}
          description={
            <>
              Esta ação irá <strong>encerrar</strong> o {MyHeaders.COMMITTEE.toLowerCase()} atual e
              <strong> todas</strong> as suas participações. Deseja continuar?
            </>
          }
          handleOpenDialog={handleOpenDialog}
          handleContinue={handleDeactivateCommittee}
        />
      </ContentLayout>
    </AuthenticatedPage>
  )
}

const CommitteeTableTitle = () => {
  const { data: countData, isLoading } = api.committee.groupByActivity.useQuery()

  const { active_count, total_count } = _formatCount(isLoading, countData)

  return (
    <>
      <Accordion className="mb-6" type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <TitleLayout>{MyHeaders.COMMITTEES}</TitleLayout>
          </AccordionTrigger>
          <AccordionContent className="tracking-wide">
            <strong>{MyHeaders.COMMITTEES} ativos: </strong>
            {active_count} de {total_count}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
