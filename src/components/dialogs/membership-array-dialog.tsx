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
import { PlusIcon, SaveIcon, XIcon } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { _addYears, _toLocaleString, _toString } from '~/utils/string'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import { CommitteeSchema } from './committee-dialog'
import { MembershipHeaders } from '~/constants/headers'
import React from 'react'
import { MembershipSchema } from './membership-dialog'
import { Committee, Employee, Membership } from '@prisma/client'
import {
  CommonFormItem,
  DateFormItem,
  EmployeeSelectFormItem,
  RoleSelectFormItem
} from '../form-items'

export const MembershipArraySchema = z.object({
  members: z.array(MembershipSchema)
})

export default function MembershipArrayDialog(props: {
  open: boolean
  handleOpenDialog: (dialogEnum: number) => void
  handleSave: (data: z.infer<typeof MembershipArraySchema>) => void
  committee?: Committee
  members: (Membership & { employee: Employee })[]
}) {
  const newAppendedValue = () => {
    return {
      employee: {
        name: ''
      },
      role: '',
      begin_date: _toString(new Date()),
      end_date: _toString(_addYears(new Date(), 1)),
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

  const form = useForm<z.infer<typeof MembershipArraySchema>>({
    //defaultValues: myDefaultValues() as any,
    resolver: zodResolver(MembershipArraySchema),
    mode: 'onChange'
  })

  useEffect(() => {
    if (props.open) form.reset(myDefaultValues() as any)
  }, [props.open, props.members])

  const fieldArray = useFieldArray({
    name: 'members', // unique name for your Field Array
    control: form.control // control props comes from useForm (optional: if you are using FormContext)
  })

  function onSubmit(data: z.infer<typeof MembershipArraySchema>) {
    props.handleSave(data)
    onClose()
  }

  function onClose() {
    form.reset()
    props.handleOpenDialog(-1)
  }

  return (
    <Dialog open={props.open} modal={false}>
      {props.open && (
        <div className="fixed inset-0 z-50 bg-background/10 backdrop-blur data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      )}
      <DialogContent className="max-w-[64rem] overflow-x-auto">
        <DialogHeader>
          <DialogTitle>Sucessão de Membros</DialogTitle>
          <DialogDescription>Outra coisa sobre sucessão de membros.</DialogDescription>
        </DialogHeader>
        <div
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 hover:outline-2 hover:ring-2 hover:ring-ring hover:ring-offset-2 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="formMembership">
            <div className="grid max-h-[70vh] gap-y-2 overflow-y-auto">
              {fieldArray.fields.map((f, index) => (
                <div key={f.id} className={'flex flex-row items-end justify-between gap-x-4'}>
                  <Button
                    className="mb-[7px] h-5 w-5"
                    onClick={() => fieldArray.remove(index)}
                    variant="outline"
                    size="icon"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                  <EmployeeSelectFormItem
                    hideLabel={index > 0}
                    form={form}
                    fieldName={`members.${index}.employee`}
                  />
                  <RoleSelectFormItem
                    hideLabel={index > 0}
                    form={form}
                    fieldName={`members.${index}.role`}
                  />
                  <CommonFormItem
                    hideLabel={index > 0}
                    className="min-w-[128px]"
                    form={form}
                    fieldName={`members.${index}.ordinance`}
                    label={MembershipHeaders.ORDINANCE}
                    placeholder="ex: Portaria"
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
                    className="min-w-[128px]"
                    form={form}
                    fieldName={`members.${index}.observations`}
                    label={MembershipHeaders.OBSERVATIONS}
                    placeholder="ex: Something something"
                  />
                </div>
              ))}
            </div>
            <DialogFooter className="mt-4">
              <Button
                size="sm"
                className="mr-auto"
                variant="outline"
                type="button"
                onClick={() => fieldArray.append(newAppendedValue() as any)}
              >
                <PlusIcon className="mr-2 h-5 w-5" />
                Criar novo(a) membro(a)
              </Button>
              <Button size="sm" type="submit" form="formMembership">
                <SaveIcon className="mr-1 h-5 w-5" />
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
