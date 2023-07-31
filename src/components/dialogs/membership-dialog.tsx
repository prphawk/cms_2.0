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
import { MembershipHeaders, MyHeaders } from '~/constants/headers'
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

export default function MembershipDialog(props: {
  open: boolean
  handleOpenDialog: (dialogEnum: DialogsEnum) => void
  member?: Membership & { employee: Employee }
  handleSave: (membershipSchema: z.infer<typeof MembershipSchema>) => void
  committee: { id: number; begin_date: Date | null; end_date: Date | null }
}) {
  const myDefaultValues = () => {
    return {
      employee: {
        id: props.member?.employee.id,
        name: props.member?.employee.name || ''
      },
      role: props.member?.role || '',
      begin_date: _toString(props.member?.begin_date || props.committee.begin_date || new Date()),
      end_date: _toString(
        props.member?.end_date || props.committee.end_date || _addYears(new Date(), 1)
      ),
      ordinance: props.member?.ordinance || '',
      observations: props.member?.observations || ''
    }
  }

  const form = useForm<z.infer<typeof MembershipSchema>>({
    resolver: zodResolver(MembershipSchema)
  })

  useEffect(() => {
    if (props.open) form.reset(myDefaultValues() as any)
  }, [props.open, props.member])

  function onSubmit(membershipSchema: z.infer<typeof MembershipSchema>) {
    props.handleSave(membershipSchema)
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
          <DialogTitle>{props.member ? 'Editar' : 'Criar'} Membro(s)</DialogTitle>
          <DialogDescription>
            {props.member && (
              <>
                Ao editar, os dados anteriores do {MyHeaders.COMMITTEE.toLowerCase()} serão{' '}
                <strong>descartados</strong>.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <MyDialogClose onClose={onClose} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3" id="formMembership">
            <div className="grid grid-cols-2 items-baseline justify-between gap-x-4">
              {/* {props.members?.map((e, index) => ( */}
              <EmployeeSelectFormItem
                fieldName="employee"
                form={form}
                disabled={props.member?.employee.id !== undefined}
              />
              <RoleSelectFormItem form={form} fieldName="role" />
            </div>
            <CommonFormItem
              form={form}
              fieldName="ordinance"
              label={MembershipHeaders.ORDINANCE}
              placeholder="ex: Portaria"
            />
            <div className="grid grid-cols-2 items-baseline justify-between gap-x-4 pt-2">
              <DateFormItem
                form={form}
                fieldName="begin_date"
                label={MembershipHeaders.BEGIN_DATE}
                required
              />
              <DateFormItem
                form={form}
                fieldName="end_date"
                label={MembershipHeaders.END_DATE}
                required
              />
            </div>
            <ObservationsFormItem
              fieldName="observations"
              form={form}
              label={MembershipHeaders.OBSERVATIONS}
            />
            <DialogFooter>
              <Button type="submit" form="formMembership">
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </MyDialog>
  )
}
