import { useRouter } from 'next/router'
import AuthenticatedPage from '~/components/authenticated-page'
import PageLayout, { TableLayout, TitleLayout } from '~/layout'
import { api } from '~/utils/api'
import { _isNumeric, _toLocaleString } from '~/utils/string'
import { DataTable } from '~/components/table/data-table'
import { CommitteeHeaders, MembershipHeaders } from '~/constants/headers'
import { getTemplateRoleHistoryColumns } from '~/components/table/role-history/role-history-columns'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { PropsWithChildren } from 'react'
import { Routes } from '~/constants/routes'

export default function TemplateRoleHistory() {
  const router = useRouter()

  const template_id = Number(router.query.id)
  const role = router.query.role as string

  const { data } = api.membership.getRoleHistory.useQuery(
    {
      template_id,
      role
    },
    { enabled: !isNaN(template_id) && role != undefined }
  )

  const handleViewCommittee = (committee_id: number) => {
    router.push(`${Routes.COMMITTEES}/${committee_id}`)
  }

  return (
    <AuthenticatedPage>
      <TableLayout className="role">
        {data && (
          <>
            <TemplateHistoryTableTitle {...{ template_id, role }} />
            <DataTable
              //isLoading={isLoading}
              data={data || []}
              columns={getTemplateRoleHistoryColumns(handleViewCommittee)}
              // tableFilters={<TableToolbarFilter {...propsFilters} />}
              // tableActions={<MembershipTableToolbarActions {...propsActions} />}
              column={MembershipHeaders.NAME}
            />
          </>
        )}
      </TableLayout>
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
      title={`${data?.name}: Histórico de "${props.role}"`}
    ></HistoryDetails>
  )
}
//todo arrumar essa historia aqui
export const HistoryDetails = (
  props: { title: string; isLoading?: boolean } & PropsWithChildren
) => {
  return (
    <Accordion className="mb-6" type="single" defaultValue="item-1" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <TitleLayout>{props.isLoading ? 'Loading' : props.title}</TitleLayout>
        </AccordionTrigger>
        <AccordionContent className="tracking-wide">{props.children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
