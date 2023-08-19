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
import { getTemplateColumns } from '~/components/table/templates/template-columns'
import { ContentLayout } from '~/layouts/page-layout'
import { TitleLayout } from '~/layouts/text-layout'
import TemplateDialog from '~/components/dialogs/template-dialog'
import { DialogsEnum } from '~/constants/enums'
import { TemplateSchema } from '~/schemas/committee'
import { z } from 'zod'
import { TemplateWithCommitteeCountAndNotifDataType } from '~/types'
import SuccessionDialogs from '~/components/dialogs/succession-dialogs'

export default function TemplatePage() {
  const router = useRouter()
  const utils = api.useContext()

  const [openDialog, setOpenDialog] = useState(DialogsEnum.none)
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateWithCommitteeCountAndNotifDataType>()

  const handleOpenDialog = (dialogEnum: DialogsEnum) => setOpenDialog(dialogEnum)

  const { data, isLoading } = api.template.getAllWithNotifs.useQuery()

  const updateTemplate = api.template.update.useMutation({
    onSuccess() {
      utils.template.getAllWithNotifs.invalidate()
    }
  })
  const updateNotification = api.notification.update.useMutation({})
  const createNotification = api.notification.create.useMutation({})

  const handleViewCommittee = (committee_id: number) => {
    router.push(`${Routes.COMMITTEES}/${committee_id}`)
  }

  const handleChangeNotifValue = async (
    template: TemplateWithCommitteeCountAndNotifDataType,
    value: boolean
  ) => {
    if (!!template.notification) {
      updateNotification.mutate({ id: template.notification.id, isOn: value })
      template.notification.isOn = value
    } else if (template.committee) {
      createNotification.mutate({
        committee: { id: template.committee.id, end_date: template.committee.end_date! },
        isOn: value
      })
    }
  }

  const handleCommitteeSuccession = (template: TemplateWithCommitteeCountAndNotifDataType) => {
    setSelectedTemplate(template)
    handleOpenDialog(DialogsEnum.succession)
  }

  const onEditTemplate = (template: TemplateWithCommitteeCountAndNotifDataType) => {
    setSelectedTemplate(template)
    handleOpenDialog(DialogsEnum.template)
  }

  const handleSaveTemplate = (templateSchema: z.infer<typeof TemplateSchema>) => {
    if (selectedTemplate)
      updateTemplate.mutate({ id: selectedTemplate.id, name: templateSchema.name })
  }

  return (
    <AuthenticatedPage>
      <ContentLayout className="templates my-6 mb-auto min-h-[89vh]">
        {data && (
          <>
            <TemplateDetails {...{ isLoading }} />
            <DataTable
              data={data as any}
              columns={getTemplateColumns(
                handleChangeNotifValue,
                handleViewCommittee,
                handleCommitteeSuccession,
                onEditTemplate
              )}
            />
            <TemplateDialog
              open={openDialog == DialogsEnum.template}
              handleOpenDialog={handleOpenDialog}
              handleSave={handleSaveTemplate}
              template={selectedTemplate}
            />
            {selectedTemplate?.committee && (
              <SuccessionDialogs
                open={openDialog}
                handleOpenDialog={handleOpenDialog}
                committeeId={selectedTemplate.committee.id}
              />
            )}
          </>
        )}
      </ContentLayout>
    </AuthenticatedPage>
  )
}

export const TemplateDetails = (props: { isLoading?: boolean } & PropsWithChildren) => {
  return (
    <Accordion className="mb-6" type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <TitleLayout>{props.isLoading ? 'Carregando' : MyHeaders.TEMPLATES}</TitleLayout>
        </AccordionTrigger>
        <AccordionContent className="tracking-wide">{props.children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
