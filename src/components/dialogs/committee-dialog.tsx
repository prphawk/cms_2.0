'use client'

import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Committee } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { CommitteeHeaders, MyHeaders } from '~/constants/headers'
import { _addYears, _toLocaleString, _toString } from '~/utils/string'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import {
  CommonFormItem,
  DateFormItem,
  ObservationsFormItem,
  TemplateSelectFormItem
} from '../form-items'
import { MyDialog, MyDialogClose } from './my-dialog'
import { CommitteeSchema } from '~/schemas/committee'
import { DialogsEnum } from '~/constants/enums'
import { CommitteeWithOptionalTemplateDataType } from '~/types'

export default function CommitteeDialog(props: {
  open: boolean
  handleOpenDialog: (dialogEnum: DialogsEnum) => void
  committee?: CommitteeWithOptionalTemplateDataType
  handleSave: (data: z.infer<typeof CommitteeSchema> & { id?: number }) => void
  succession?: boolean
}) {
  const myDefaultValues = () => {
    return {
      bond: props.committee?.bond || '',
      name: props.committee?.name || '',
      begin_date: _toString(props.committee?.begin_date || new Date()),
      end_date: _toString(props.committee?.end_date || _addYears(new Date(), 1)),
      ordinance: props.committee?.ordinance || '',
      observations: props.committee?.observations || '',
      template_name: props.committee?.template?.name || ''
    }
  }

  const form = useForm<z.infer<typeof CommitteeSchema>>({
    resolver: zodResolver(CommitteeSchema)
  })

  useEffect(() => {
    if (props.open) form.reset(myDefaultValues() as any)
  }, [props.open])

  function onSubmit(data: z.infer<typeof CommitteeSchema>) {
    onClose()
    props.handleSave({ id: props.committee?.id || undefined, ...data })
  }

  function onClose() {
    form.reset()
    props.handleOpenDialog(DialogsEnum.none)
  }

  return (
    <MyDialog open={props.open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`${
            props.succession ? 'Sucessão de ' : props.committee ? 'Editar' : 'Criar'
          } ${MyHeaders.COMMITTEE}`}</DialogTitle>
          <DialogDescription>
            {props.succession ? (
              <>
                {`Novo mandato de ${props.committee?.name} (${_toLocaleString(
                  props.committee?.begin_date
                )} a ${_toLocaleString(props.committee?.end_date)}`}
                )
              </>
            ) : (
              props.committee && (
                <>
                  Ao editar, os dados anteriores do {MyHeaders.COMMITTEE.toLowerCase()} serão{' '}
                  <strong>descartados</strong>.
                </>
              )
            )}
          </DialogDescription>
        </DialogHeader>
        <MyDialogClose onClose={onClose} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" id="formCommittee">
            <CommonFormItem
              form={form}
              fieldName="name"
              label={CommitteeHeaders.NAME}
              placeholder="ex: Direção INF (2023)"
              required
            />
            <CommonFormItem
              form={form}
              fieldName="bond"
              label={CommitteeHeaders.BOND}
              placeholder="ex: Órgão"
              required
            />
            <CommonFormItem
              form={form}
              fieldName="ordinance"
              label={CommitteeHeaders.ORDINANCE}
              placeholder="ex: Portaria"
            />
            <div className="flex flex-row justify-between gap-x-4 pt-2">
              <DateFormItem
                form={form}
                fieldName="begin_date"
                label={CommitteeHeaders.BEGIN_DATE}
                required
              />
              <DateFormItem
                form={form}
                fieldName="end_date"
                label={CommitteeHeaders.END_DATE}
                required
              />
            </div>
            <ObservationsFormItem
              fieldName="observations"
              form={form}
              label={CommitteeHeaders.OBSERVATIONS}
            />
            <TemplateSelectFormItem form={form} disabled={props.succession} />
            <DialogFooter>
              <Button type="submit" form="formCommittee">
                {props.succession ? 'Próximo' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </MyDialog>
  )
}
