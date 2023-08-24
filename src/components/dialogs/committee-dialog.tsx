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
import { useForm } from 'react-hook-form'
import { CommitteeHeaders, MyHeaders } from '~/constants/headers'
import {
  _addDays,
  _addMonths,
  _addYears,
  _diffMonths,
  _toLocaleString,
  _toString
} from '~/utils/string'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import {
  CheckBoxFormItem,
  CommonFormItem,
  DateFormItem,
  ObservationsFormItem,
  TemplateSelectFormItem
} from '../form-items'
import { MyDialog, MyDialogClose } from './my-dialog'
import { CommitteeFormSchema, CommitteeFormSchemaEffect } from '~/schemas/committee'
import { DialogsEnum } from '~/constants/enums'
import { CommitteeWithOptionalTemplateDataType } from '~/types'
import { PLACEHOLDER } from '~/constants/placeholders'

export default function CommitteeDialog(props: {
  open: boolean
  handleOpenDialog: (dialogEnum: DialogsEnum) => void
  committee?: CommitteeWithOptionalTemplateDataType
  handleSave: (data: z.infer<typeof CommitteeFormSchema>) => void
  succession?: boolean
}) {
  const myDefaultValues = () => {
    let diffMonths
    let begin_date = props.committee?.begin_date
    let end_date = props.committee?.end_date
    if (props.succession && begin_date && end_date) {
      diffMonths = _diffMonths(begin_date, end_date)
      begin_date = _addDays(end_date, 1)
      end_date = _addMonths(begin_date, diffMonths)
    }
    return {
      bond: props.committee?.bond || '',
      name: props.committee?.name || '',
      begin_date: _toString(begin_date || new Date()),
      end_date: _toString(end_date || _addYears(new Date(), 2)),
      ordinance: props.committee?.ordinance || '',
      observations: props.committee?.observations || '',
      template: props.committee?.template || undefined,
      is_active: props.committee ? props.committee.is_active : true
    }
  }

  const form = useForm<z.infer<typeof CommitteeFormSchema>>({
    resolver: zodResolver(CommitteeFormSchemaEffect)
  })

  useEffect(() => {
    if (props.open) {
      form.reset(myDefaultValues() as any)
    }
  }, [props.open])

  // useEffect(() => {
  //   const subscription = form.watch((template, { name, type }) => console.log(template.name))
  //   return () => subscription.unsubscribe()
  // }, [form.watch])

  function onSubmit(data: z.infer<typeof CommitteeFormSchema>) {
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
          } ${MyHeaders.INSTANCE}`}</DialogTitle>
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
            <TemplateSelectFormItem
              form={form}
              disabled={props.succession}
              committee_id={props.committee?.id}
            />
            <CommonFormItem
              form={form}
              fieldName="name"
              label={CommitteeHeaders.NAME}
              placeholder={PLACEHOLDER.COMMITTEE}
              required
            />
            <CommonFormItem
              form={form}
              fieldName="bond"
              label={CommitteeHeaders.BOND}
              placeholder={PLACEHOLDER.BOND}
              required
            />
            <CommonFormItem
              form={form}
              fieldName="ordinance"
              label={CommitteeHeaders.ORDINANCE}
              placeholder={PLACEHOLDER.ORDINANCE}
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
            <DialogFooter className="items-center pt-2">
              <span className="mr-auto flex items-center">
                <CheckBoxFormItem
                  form={form}
                  fieldName="is_active"
                  label="Mandato ativo"
                  disabled={!!props.committee || props.succession}
                />
              </span>
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
