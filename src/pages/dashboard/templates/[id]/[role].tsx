import { useRouter } from 'next/router'
import AuthenticatedPage from '~/components/authenticated-page'
import { ContentLayout } from '~/layouts/page-layout'
import { api } from '~/utils/api'
import { _isNumeric, _toLocaleString } from '~/utils/string'
import { DataTable } from '~/components/table/data-table'
import { CommitteeHeaders, MembershipHeaders, MyHeaders } from '~/constants/headers'
import { getTemplateRoleHistoryColumns } from '~/components/table/templates/role-history-columns'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { PropsWithChildren, useState } from 'react'
import { Routes } from '~/constants/routes'
import { TitleLayout } from '~/layouts/text-layout'
import { filterDProps, getActiveDateFilterLabels } from '~/components/filters'
import { IFilter, TableToolbarFilter } from '~/components/table/data-table-toolbar'
import { FilterStateDatesType } from '~/types'
import { PLACEHOLDER } from '~/constants/placeholders'

export default function TemplateRoleHistory() {
  const router = useRouter()

  const template_id = Number(router.query.id)
  const role = router.query.role as string
  const [filterD, setFilterD] = useState<FilterStateDatesType>({
    begin_date: undefined,
    end_date: undefined
  })

  const { data } = api.membership.getRoleHistory.useQuery(
    {
      template_id,
      role,
      dates: filterD
    },
    { enabled: !isNaN(template_id) && role != undefined }
  )

  const handleChangeActiveFiltersD = (values: FilterStateDatesType) => {
    setFilterD({ ...values })
  }

  const propsFilters: IFilter[] = [
    {
      ...filterDProps,
      dates: filterD,
      activeFilters: getActiveDateFilterLabels(filterD),
      handleChangeActiveFilters: handleChangeActiveFiltersD
    }
  ]

  const handleViewCommittee = (committee_id: number) => {
    router.push(`${Routes.COMMITTEES}/${committee_id}`)
  }

  return (
    <AuthenticatedPage>
      <ContentLayout className="role my-6 mb-auto min-h-[89vh]">
        {data && (
          <>
            <TemplateHistoryTableTitle {...{ template_id, role }} />
            <DataTable
              data={data}
              columns={getTemplateRoleHistoryColumns(handleViewCommittee)}
              tableFilters={<TableToolbarFilter filters={propsFilters} />}
            />
          </>
        )}
      </ContentLayout>
    </AuthenticatedPage>
  )
}

const TemplateHistoryTableTitle = (props: { template_id: number; role: string }) => {
  const { data, isLoading } = api.template.getOne.useQuery({
    template_id: props.template_id
  })
  return (
    <HistoryDetails
      isLoading={isLoading}
      title={`${data?.name}: ${props.role}`}
    >{`Histórico de participações de cargo "${props.role}" através de todos mandatos de ${data?.name}`}</HistoryDetails>
  )
}
//TODO arrumar essa historia aqui
export const HistoryDetails = (
  props: { title: string; isLoading?: boolean } & PropsWithChildren
) => {
  return (
    <Accordion className="mb-6" type="single" defaultValue="item-1" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <TitleLayout>{props.isLoading ? PLACEHOLDER.LOADING : props.title}</TitleLayout>
        </AccordionTrigger>
        <AccordionContent className="tracking-wide">{props.children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
