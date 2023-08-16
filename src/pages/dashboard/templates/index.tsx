import { useRouter } from 'next/router'
import AuthenticatedPage from '~/components/authenticated-page'
import { api } from '~/utils/api'
import { _isNumeric, _toLocaleString } from '~/utils/string'
import { DataTable } from '~/components/table/data-table'
import { MyHeaders } from '~/constants/headers'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { PropsWithChildren, useState } from 'react'
import { Routes } from '~/constants/routes'
import { TemplateType, getTemplateColumns } from '~/components/table/templates/template-columns'
import { ContentLayout } from '~/layouts/page-layout'
import { TitleLayout } from '~/layouts/text-layout'
import TemplateDialog from '~/components/dialogs/template-dialog'
import { DialogsEnum } from '~/constants/enums'
import { TemplateSchema } from '~/schemas/committee'
import { z } from 'zod'

export default function TemplatePage() {
  const router = useRouter()
  const utils = api.useContext()

  const [openDialog, setOpenDialog] = useState(DialogsEnum.none)
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>()

  const handleOpenDialog = (dialogEnum: DialogsEnum) => setOpenDialog(dialogEnum)

  const { data, isLoading } = api.template.getAll.useQuery()

  const updateTemplate = api.template.update.useMutation({
    onSuccess() {
      utils.template.getAll.invalidate()
    }
  })

  const handleViewCommittee = (committee_id: number) => {
    router.push(`${Routes.COMMITTEES}/${committee_id}`)
  }
  const handleChangeNotifValue = (template: TemplateType, value: boolean) => {
    updateTemplate.mutate({ id: template.id, notification: { isOn: value } })
    if (template.notification) template.notification.isOn = value
  }

  const onEditTemplate = (template: TemplateType) => {
    setSelectedTemplate(template)
    handleOpenDialog(DialogsEnum.template)
  }

  const handleSaveTemplate = (templateSchema: z.infer<typeof TemplateSchema>) => {
    if (selectedTemplate)
      updateTemplate.mutate({ id: selectedTemplate.id, name: templateSchema.name })
  }

  return (
    <AuthenticatedPage>
      <ContentLayout className="templates my-6 mb-auto min-h-[90vh]">
        {data && (
          <>
            <TemplateDetails {...{ isLoading }} />
            <DataTable
              data={data as any}
              columns={getTemplateColumns(
                handleChangeNotifValue,
                handleViewCommittee,
                onEditTemplate
              )}
            />
            <TemplateDialog
              open={openDialog == DialogsEnum.template}
              handleOpenDialog={handleOpenDialog}
              handleSave={handleSaveTemplate}
              template={selectedTemplate}
            />
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
