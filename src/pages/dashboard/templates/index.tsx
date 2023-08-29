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
import { z } from 'zod'
import { TemplateWithCommitteeCountAndNotifDataType } from '~/types'
import SuccessionDialogs from '~/components/dialogs/succession-dialogs'
import { CreateTemplateFormSchema } from '~/schemas'
import { AlertDialog } from '~/components/dialogs/alert-dialog'
import CommitteesTableToolbarActions from '~/components/table/committees/committees-toolbar-actions'
import TemplatesTableToolbarActions from '~/components/table/templates/template-toolbar-actions'

export default function TemplatePage() {
  const router = useRouter()
  const utils = api.useContext()

  const [filter, setFilter] = useState('')
  const [openDialog, setOpenDialog] = useState(DialogsEnum.none)
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateWithCommitteeCountAndNotifDataType>()

  const handleOpenDialog = (dialogEnum: DialogsEnum) => setOpenDialog(dialogEnum)

  const { data, isLoading } = api.template.getAllWithNotifs.useQuery()

  const createTemplate = api.template.create.useMutation({
    onSuccess() {
      utils.template.getAllWithNotifs.invalidate()
    }
  })

  const updateTemplate = api.template.update.useMutation({
    onSuccess() {
      utils.template.getAllWithNotifs.invalidate()
    }
  })

  const deleteTemplate = api.template.delete.useMutation({
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

  const onCreateTemplate = () => {
    setSelectedTemplate(undefined)
    handleOpenDialog(DialogsEnum.template)
  }

  const onEditTemplate = (template: TemplateWithCommitteeCountAndNotifDataType) => {
    setSelectedTemplate(template)
    handleOpenDialog(DialogsEnum.template)
  }

  const onDeleteTemplate = (template: TemplateWithCommitteeCountAndNotifDataType) => {
    setSelectedTemplate(template)
    handleOpenDialog(DialogsEnum.alert_delete_template)
  }

  const handleDeleteTemplate = () => {
    if (selectedTemplate) deleteTemplate.mutate({ id: selectedTemplate.id })
    setSelectedTemplate(undefined)
  }

  const handleSaveTemplate = (templateSchema: z.infer<typeof CreateTemplateFormSchema>) => {
    if (selectedTemplate)
      updateTemplate.mutate({ id: selectedTemplate.id, name: templateSchema.name })
    else createTemplate.mutate({ name: templateSchema.name })
  }

  return (
    <AuthenticatedPage>
      <ContentLayout className="templates my-6 mb-auto min-h-[89vh]">
        {data && (
          <>
            <TemplateDetails {...{ isLoading }} />
            <DataTable
              globalFilter={filter}
              onChangeGlobalFilter={(value) => setFilter(value)}
              data={data as any}
              tableActions={<TemplatesTableToolbarActions onCreateTemplate={onCreateTemplate} />}
              columns={getTemplateColumns(
                handleChangeNotifValue,
                handleViewCommittee,
                handleCommitteeSuccession,
                onEditTemplate,
                onDeleteTemplate
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
            <AlertDialog
              open={openDialog == DialogsEnum.alert_delete_template}
              description={
                <>
                  Esta ação irá <strong>deletar</strong> o {MyHeaders.TEMPLATE.toLowerCase()}. Esta
                  ação não pode ser revertida. Deseja continuar?
                </>
              }
              handleOpenDialog={handleOpenDialog}
              handleContinue={handleDeleteTemplate}
            />
          </>
        )}
      </ContentLayout>
    </AuthenticatedPage>
  )
}

export const TemplateDetails = (props: { isLoading?: boolean }) => {
  return (
    <Accordion className="mb-6" type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <TitleLayout>{props.isLoading ? 'Carregando' : MyHeaders.TEMPLATES}</TitleLayout>
        </AccordionTrigger>
        <AccordionContent className="tracking-wide">
          Coleção de {MyHeaders.TEMPLATES.toLowerCase()} (modelos de comissões permanentes) e seus
          mandatos.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
