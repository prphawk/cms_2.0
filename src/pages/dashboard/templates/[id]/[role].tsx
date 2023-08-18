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
import { PropsWithChildren } from 'react'
import { Routes } from '~/constants/routes'
import { TitleLayout } from '~/layouts/text-layout'

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
      <ContentLayout className="role my-6 mb-auto min-h-[89vh]">
        {data && (
          <>
            <TemplateHistoryTableTitle {...{ template_id, role }} />
            <DataTable
              data={data || []}
              columns={getTemplateRoleHistoryColumns(handleViewCommittee)}
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
      title={`${MyHeaders.TEMPLATE} ${data?.name}: Histórico de "${props.role}"`}
    ></HistoryDetails>
  )
}
//TODO arrumar essa historia aqui
export const HistoryDetails = (
  props: { title: string; isLoading?: boolean } & PropsWithChildren
) => {
  return (
    <Accordion className="mb-6" type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <TitleLayout>{props.isLoading ? 'Loading...' : props.title}</TitleLayout>
        </AccordionTrigger>
        <AccordionContent className="tracking-wide">{props.children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
