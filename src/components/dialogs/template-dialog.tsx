'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { _addYears, _toLocaleString, _toString } from '~/utils/string'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import { CommitteeHeaders, MembershipHeaders, MyHeaders } from '~/constants/headers'
import { Employee, Membership } from '@prisma/client'
import React from 'react'
import {
  CommonFormItem,
  DateFormItem,
  EmployeeSelectFormItem,
  ObservationsFormItem,
  RoleSelectFormItem
} from '../form-items'
import { MyDialog, MyDialogClose } from './my-dialog'
import { MembershipSchema } from '~/schemas/membership'
import { DialogsEnum } from '~/constants/enums'
import { TemplateType } from '../table/templates/template-columns'
import { TemplateSchema } from '~/schemas/committee'

export default function TemplateDialog(props: {
  open: boolean
  handleOpenDialog: (dialogEnum: DialogsEnum) => void
  template?: TemplateType
  handleSave: (templateSchema: z.infer<typeof TemplateSchema>) => void
}) {
  const myDefaultValues = () => {
    return {
      name: props.template?.name || ''
    }
  }

  const form = useForm<z.infer<typeof TemplateSchema>>({
    resolver: zodResolver(TemplateSchema)
  })

  useEffect(() => {
    if (props.open) form.reset(myDefaultValues() as any)
  }, [props.open])

  function onSubmit(templateSchema: z.infer<typeof TemplateSchema>) {
    props.handleSave(templateSchema)
    onClose()
  }

  function onClose() {
    form.reset()
    props.handleOpenDialog(DialogsEnum.none)
  }

  return (
    <MyDialog open={props.open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {props.template ? 'Editar' : 'Criar'} {CommitteeHeaders.TEMPLATE}
          </DialogTitle>
          <DialogDescription>
            {props.template && (
              <>
                Ao editar, os dados anteriores do {CommitteeHeaders.TEMPLATE.toLowerCase()} serão{' '}
                <strong>descartados</strong>.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <MyDialogClose onClose={onClose} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3" id="formTemplate">
            <CommonFormItem
              form={form}
              fieldName="name"
              label={CommitteeHeaders.TEMPLATE_NAME}
              placeholder="ex: Direção"
            />

            <DialogFooter>
              <Button type="submit" form="formTemplate">
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </MyDialog>
  )
}
