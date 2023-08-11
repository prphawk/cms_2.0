import { useRouter } from 'next/router'
import AuthenticatedPage from '~/components/authenticated-page'
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
import { getTemplateColumns } from '~/components/table/templates/template-columns'
import { ContentLayout } from '~/layouts/page-layout'
import { TitleLayout } from '~/layouts/text-layout'

export default function TemplatePage() {
  const router = useRouter()

  const { data, isLoading } = api.template.getAll.useQuery()

  const handleViewCommittee = (committee_id: number) => {
    router.push(`${Routes.COMMITTEES}/${committee_id}`)
  }

  return (
    <AuthenticatedPage>
      <ContentLayout className="templates my-6 mb-auto min-h-[90vh]">
        {data && (
          <>
            <TemplateDetails {...{ isLoading }} />
            <DataTable data={data} columns={getTemplateColumns(handleViewCommittee)} />
          </>
        )}
      </ContentLayout>
    </AuthenticatedPage>
  )
}

//TODO arrumar essa historia aqui
export const TemplateDetails = (props: { isLoading?: boolean } & PropsWithChildren) => {
  return (
    <Accordion className="mb-6" type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <TitleLayout>{props.isLoading ? 'Loading' : MyHeaders.TEMPLATES}</TitleLayout>
        </AccordionTrigger>
        <AccordionContent className="tracking-wide">{props.children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
