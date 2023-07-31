import AuthenticatedPage from '~/components/authenticated-page'
import { getCommitteesColumns } from '~/components/table/committees/committees-columns'
import { DataTable } from '~/components/table/data-table'
import PageLayout, { TitleLayout } from '~/layout'
import { api } from '~/utils/api'
import { useState } from 'react'
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
import { Dot } from '~/components/dot'
import CommitteesTableToolbarActions from '~/components/table/committees/committees-toolbar-actions'
import { z } from 'zod'
import { CommitteeHeaders, MyHeaders } from '~/constants/headers'
import { DialogsEnum } from '~/constants/enums'
import {
  FilterStateType,
  filterAProps,
  filterTProps,
  handleChangeComplementaryFilters
} from '~/components/filters'
import CommitteeDialog from '~/components/dialogs/committee-dialog'
import { CommitteeSchema } from '~/schemas/committee'
import LoadingLayout from '~/components/loading-layout'

export default function Committees() {
  const router = useRouter()

  const [open, setOpen] = useState(DialogsEnum.none)

  const handleOpenDialog = (dialogEnum: DialogsEnum) => setOpen(dialogEnum)

  const [filterA, setFilterA] = useState<FilterStateType>()
  const [filterT, setFilterT] = useState<FilterStateType>()

  const utils = api.useContext()

  const { data, isLoading, isError } = api.committee.getAll.useQuery({
    is_active: filterA?.value,
    is_temporary: filterT?.value
  })

  if (isError) {
    return <span>Error: sowwyyyy</span>
  }

  const propsFilters: IFilter[] = [
    {
      ...filterAProps,
      activeFilters: filterA?.labels,
      handleChangeActiveFilters: (labels) =>
        handleChangeComplementaryFilters('is_active', setFilterA, labels)
    },
    {
      ...filterTProps,
      activeFilters: filterT?.labels,
      handleChangeActiveFilters: (labels) =>
        handleChangeComplementaryFilters('is_temporary', setFilterT, labels)
    }
  ]

  const deactivate = api.committee.deactivate.useMutation({
    onMutate() {
      return utils.committee.getAll.cancel()
    },
    // TODO onError
    onSettled(data) {
      return utils.committee.getAll.invalidate()
    }
  })

  const create = api.committee.create.useMutation({
    // TODO onError
    onSettled(data) {
      return utils.committee.getAll.invalidate()
    }
  })

  function handleDeactivateCommittees(ids: number[]) {
    //TODO pelo amor de deus vai invalidar tudo 500 vezes
    // faz a função no prisma com IN pra ver os ids
    ids.forEach((id) => deactivate.mutate({ id }))
  }

  function handleViewCommittee(id: number) {
    router.push(`${Routes.COMMITTEES}/${id}`)
  }

  const handleSaveCommittee = (data: z.infer<typeof CommitteeSchema>) => {
    create.mutate(data)
  }

  return (
    <AuthenticatedPage>
      {/* <LoadingLayout loading={isLoading}> */}
      <div className="committees container my-6 mb-auto min-h-[90vh] rounded-xl bg-gray-900/20 pb-4 text-white drop-shadow-lg">
        <ContentHeader />
        <DataTable
          data={data || []}
          isLoading={isLoading}
          columns={getCommitteesColumns(handleDeactivateCommittees, handleViewCommittee)}
          tableFilters={<TableToolbarFilter filters={propsFilters} />}
          tableActions={
            <CommitteesTableToolbarActions
              handleCreateCommittee={() => handleOpenDialog(DialogsEnum.committee)}
            />
          }
          column={CommitteeHeaders.NAME}
        />
        <CommitteeDialog
          open={open === DialogsEnum.committee}
          handleOpenDialog={handleOpenDialog}
          handleSave={handleSaveCommittee}
        />
      </div>
      {/* </LoadingLayout> */}
    </AuthenticatedPage>
  )
}

const ContentHeader = () => {
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
            <strong>{MyHeaders.COMMITTEES}: </strong>
            {total_count}
            <Dot />
            <strong>{MyHeaders.COMMITTEES} ativos: </strong>
            {active_count}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
