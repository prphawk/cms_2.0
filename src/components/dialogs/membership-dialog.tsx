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
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { _addYears, _toLocaleString, _toString } from '~/utils/string'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command'
import { useEffect, useState } from 'react'
import { MembershipHeaders } from '~/constants/headers'
import { api } from '~/utils/api'
import { Employee, Membership } from '@prisma/client'
import React from 'react'
import {
  CommonFormItem,
  DateFormItem,
  EmployeeSelectFormItem,
  MyLabel,
  ObservationsFormItem,
  RoleSelectFormItem
} from '../form-items'

export const MembershipSchema = z
  .object({
    employee: z.object({
      id: z.number().optional(),
      name: z
        .string({ required_error: `${MembershipHeaders.NAME} é obrigatório` })
        .trim()
        .min(1, { message: `${MembershipHeaders.NAME} é obrigatório` })
    }),
    role: z
      .string({ required_error: `${MembershipHeaders.ROLE} é obrigatório` })
      .trim()
      .min(1, { message: `${MembershipHeaders.ROLE} é obrigatório` }),
    begin_date: z.coerce.date({ required_error: `${MembershipHeaders.BEGIN_DATE} é obrigatória` }),
    end_date: z.coerce.date({ required_error: `${MembershipHeaders.END_DATE} é obrigatória` }),
    observations: z.string().optional(),
    ordinance: z.string().optional()
  })
  .refine((data) => (data.begin_date || 0) < (data.end_date || new Date()), {
    message: `${MembershipHeaders.END_DATE} não pode ocorrer antes de ${MembershipHeaders.BEGIN_DATE}.`,
    path: ['end_date']
  })

export default function MembershipDialog(props: {
  open: boolean
  handleOpenDialog: (dialogEnum: number) => void
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
    props.handleOpenDialog(-1)
  }

  return (
    <Dialog open={props.open} modal={false}>
      {props.open && (
        <div className="fixed inset-0 z-50 bg-background/10 backdrop-blur data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.member ? 'Editar' : 'Criar'} Membro(s)</DialogTitle>
          <DialogDescription>
            {props.member && (
              <>
                Ao editar, os dados anteriores do órgão serão <strong>descartados</strong>.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <div
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 hover:outline-2 hover:ring-2 hover:ring-ring hover:ring-offset-2 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </div>
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
    </Dialog>
  )
}
