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
import { MembershipHeaders } from '~/constants/headers'
import React from 'react'
import { CommonFormItem } from '../form-items'
import { MyDialog, MyDialogClose } from './my-dialog'
import { DialogsEnum } from '~/constants/enums'
import { CreateEmployeeFormSchema } from '~/schemas'
import { PLACEHOLDER } from '~/constants/placeholders'
import { Employee } from '@prisma/client'

export default function EmployeeDialog(props: {
  open: boolean
  handleOpenDialog: (dialogEnum: DialogsEnum) => void
  employee?: Employee
  handleSave: (employeeSchema: z.infer<typeof CreateEmployeeFormSchema>) => void
}) {
  const myDefaultValues = () => {
    return {
      name: props.employee?.name || ''
    }
  }

  const form = useForm<z.infer<typeof CreateEmployeeFormSchema>>({
    resolver: zodResolver(CreateEmployeeFormSchema)
  })

  useEffect(() => {
    if (props.open) form.reset(myDefaultValues() as any)
  }, [props.open])

  function onSubmit(employeeSchema: z.infer<typeof CreateEmployeeFormSchema>) {
    props.handleSave(employeeSchema)
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
            {props.employee ? 'Editar' : 'Criar'} {MembershipHeaders.MEMBER}
          </DialogTitle>
          <DialogDescription>
            {props.employee && (
              <>
                Ao editar, os dados anteriores do(a) {MembershipHeaders.MEMBER.toLowerCase()} serão{' '}
                <strong>descartados</strong>.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <MyDialogClose onClose={onClose} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3" id="formTemplate">
            <CommonFormItem
              required
              form={form}
              fieldName="name"
              label={MembershipHeaders.EMPLOYEE_NAME}
              placeholder={PLACEHOLDER.MEMBER}
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
