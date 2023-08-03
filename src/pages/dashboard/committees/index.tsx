import AuthenticatedPage from '~/components/authenticated-page'
import { getCommitteesColumns } from '~/components/table/committees/committees-columns'
import { DataTable } from '~/components/table/data-table'
import { ContentLayout, TitleLayout } from '~/layout'
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
  filterTProps,
  getComplementaryFilterValue,
  handleChangeComplementaryFilters
} from '~/components/filters'
import CommitteeDialog from '~/components/dialogs/committee-dialog'
import { CommitteeSchema } from '~/schemas/committee'
import { AlertDialog } from '~/components/dialogs/alert-dialog'
import { Committee } from '@prisma/client'
import SuccessionDialogs from '~/components/dialogs/succession-dialogs'
import ErrorPage from '~/pages/500'
import { LS } from '~/constants/local_storage'

export default function Committees() {
  const router = useRouter()

  const [openDialog, setOpenDialog] = useState(DialogsEnum.none)

  const [selectedCommittee, setSelectedCommittee] = useState<Committee | number>()

  const handleOpenDialog = (dialogEnum: DialogsEnum) => setOpenDialog(dialogEnum)

  const [filterA, setFilterA] = useState<FilterStateType>()
  const [filterT, setFilterT] = useState<FilterStateType>()

  useEffect(() => {
    // if (typeof window !== 'undefined') {
    setFilterA(getComplementaryFilterValue(LS.COMMITTEE_A, 'is_active', 'is_inactive'))
    setFilterT(getComplementaryFilterValue(LS.COMMITTEE_T, 'is_permanent', 'is_temporary'))
    // }
  }, [])

  const utils = api.useContext()

  const { data, isLoading, isError } = api.committee.getAll.useQuery({
    is_active: filterA?.value,
    is_temporary: filterT?.value
  })

  if (isError) {
    return <ErrorPage />
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
    }
  ]

  const deactivate = api.committee.deactivate.useMutation({
    onMutate() {
      return utils.committee.getAll.cancel()
    },
    onSettled() {
      return utils.committee.getAll.invalidate()
    }
  })

  const create = api.committee.create.useMutation({
    onSettled() {
      return utils.committee.getAll.invalidate()
    }
  })

  function onDeactivateCommittee(id: number) {
    setSelectedCommittee(id)
    setOpenDialog(DialogsEnum.alert_deactivate)
  }

  function handleDeactivateCommittee() {
    if (selectedCommittee && typeof selectedCommittee == 'number')
      deactivate.mutate({ id: selectedCommittee })
  }

  function onCommitteeSuccession(id: number) {
    setSelectedCommittee(id)
    setOpenDialog(DialogsEnum.succession)
  }

  function handleViewCommittee(id: number) {
    router.push(`${Routes.COMMITTEES}/${id}`)
  }

  const handleSaveCommittee = (data: z.infer<typeof CommitteeSchema>) => {
    create.mutate(data)
  }

  const handleCreateCommittee = () => {
    setSelectedCommittee(undefined)
    handleOpenDialog(DialogsEnum.committee)
  }

  return (
    <AuthenticatedPage>
      <ContentLayout className="committees">
        <CommitteeTableTitle />
        <DataTable
          data={data || []}
          isLoading={isLoading}
          columns={getCommitteesColumns(
            onDeactivateCommittee,
            onCommitteeSuccession,
            handleViewCommittee
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
        />
        <SuccessionDialogs
          open={openDialog}
          handleOpenDialog={handleOpenDialog}
          committeeId={selectedCommittee as number}
        />
        <AlertDialog
          open={openDialog == DialogsEnum.alert_deactivate}
          description={
            <>
              Esta ação irá <strong>encerrar</strong> o {MyHeaders.COMMITTEE.toLowerCase()} atual e
              <strong>todas</strong> as suas participações. Deseja continuar?
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
