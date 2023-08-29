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
import { MinusIcon, PlusIcon, SaveIcon, XIcon } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { _addYears, _toLocaleString, _toString } from '~/utils/string'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import { MembershipHeaders } from '~/constants/headers'
import React from 'react'
import { Committee, Employee, Membership } from '@prisma/client'
import {
  CommonFormItem,
  DateFormItem,
  EmployeeSelectFormItem,
  RoleSelectFormItem
} from '../form-items'
import { MyDialog, MyDialogClose } from './my-dialog'
import { MembershipFormArraySchema } from '~/schemas/membership'
import { DialogsEnum } from '~/constants/enums'
import { PLACEHOLDER } from '~/constants/placeholders'

export default function MembershipArrayDialog(props: {
  open: boolean
  handleOpenDialog: (dialogEnum: DialogsEnum) => void
  handleSave: (data: z.infer<typeof MembershipFormArraySchema>) => void
  committee?: Committee
  members: (Membership & { employee: Employee })[]
}) {
  const newAppendedValue = () => {
    return {
      employee: {
        name: ''
      },
      role: 'Membro(a)',
      begin_date: _toString(props.committee?.begin_date || new Date()),
      end_date: _toString(props.committee?.end_date || _addYears(new Date(), 1)),
      ordinance: '',
      observations: ''
    }
  }
  const myDefaultValues = () => {
    return {
      members: props.members.map((m) => {
        return {
          employee: {
            id: m.employee.id,
            name: m.employee.name || ''
          },
          role: m.role || '',
          begin_date: _toString(props.committee?.begin_date || m.begin_date),
          end_date: _toString(props.committee?.end_date || m.end_date),
          ordinance: m.ordinance || '',
          observations: m.observations || ''
        }
      })
    }
  }

  const form = useForm<z.infer<typeof MembershipFormArraySchema>>({
    resolver: zodResolver(MembershipFormArraySchema)
  })

  useEffect(() => {
    if (props.open) form.reset(myDefaultValues() as any)
  }, [props.open, props.members])

  useEffect(() => {
    console.log(form.formState.errors)
  }, [form.formState])

  const fieldArray = useFieldArray({
    name: 'members', // unique name for your Field Array
    control: form.control // control props comes from useForm (optional: if you are using FormContext)
  })

  function onSubmit(data: z.infer<typeof MembershipFormArraySchema>) {
    console.log(data)
    props.handleSave(data)
    onClose()
  }

  function onClose() {
    form.reset()
    props.handleOpenDialog(DialogsEnum.none)
  }

  return (
    <MyDialog open={props.open}>
      <DialogContent className="max-w-[70rem] overflow-x-auto">
        <DialogHeader>
          <DialogTitle>Sucessão de Membros</DialogTitle>
          <DialogDescription>
            Apenas as participações ativas do último mandato são importadas para edição.
          </DialogDescription>
        </DialogHeader>
        <MyDialogClose onClose={onClose} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="formMembership">
            <div className="grid max-h-[65vh] gap-y-2 overflow-y-auto">
              {fieldArray.fields.map((f, index) => (
                <div key={f.id} className={'flex flex-row items-end justify-between gap-x-4'}>
                  <Button
                    className="mb-[7px] h-5 w-5"
                    onClick={() => fieldArray.remove(index)}
                    variant="ghost"
                    size="icon"
                  >
                    <MinusIcon className="h-4 w-5" />
                  </Button>
                  <EmployeeSelectFormItem
                    hideLabel={index > 0}
                    form={form}
                    fieldName={`members.${index}.employee`}
                    committee_id={props.committee?.id}
                    className="h-[275px] w-[215px]"
                  />
                  <RoleSelectFormItem
                    hideLabel={index > 0}
                    form={form}
                    fieldName={`members.${index}.role`}
                    className="h-[275px] w-[215px]"
                  />
                  <CommonFormItem
                    hideLabel={index > 0}
                    className="min-w-[128px]"
                    form={form}
                    fieldName={`members.${index}.ordinance`}
                    label={MembershipHeaders.ORDINANCE}
                    placeholder={PLACEHOLDER.BOND}
                  />
                  <DateFormItem
                    hideLabel={index > 0}
                    className="w-min"
                    form={form}
                    fieldName={`members.${index}.begin_date`}
                    label={MembershipHeaders.BEGIN_DATE}
                    required
                  />
                  <DateFormItem
                    hideLabel={index > 0}
                    className="w-min"
                    form={form}
                    fieldName={`members.${index}.end_date`}
                    label={MembershipHeaders.END_DATE}
                    required
                  />
                  <CommonFormItem
                    hideLabel={index > 0}
                    className="mr-3 min-w-[128px]"
                    form={form}
                    fieldName={`members.${index}.observations`}
                    label={MembershipHeaders.OBSERVATIONS}
                    placeholder={PLACEHOLDER.OBSERVATIONS}
                  />
                </div>
              ))}
            </div>
            <DialogFooter className="mt-6">
              <Button
                size="sm"
                className="mr-auto "
                variant="secondary"
                type="button"
                onClick={() => fieldArray.append(newAppendedValue() as any)}
              >
                <PlusIcon className="mr-2 h-5 w-5" />
                Adicionar membro(a)
              </Button>
              <Button size="sm" type="submit" form="formMembership">
                <SaveIcon className="mr-1 h-5 w-5" />
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </MyDialog>
  )
}
