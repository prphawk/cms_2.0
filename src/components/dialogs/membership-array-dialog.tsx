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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { CheckIcon, ChevronsUpDownIcon, PlusIcon, SaveIcon, XIcon } from 'lucide-react'
import { FieldArrayWithId, UseFieldArrayReturn, useFieldArray, useForm } from 'react-hook-form'
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
import { CommonFormItem, DateFormItem, MyLabel, ObservationsFormItem } from './committee-dialog'
import { MembershipHeaders } from '~/constants/headers'
import { api } from '~/utils/api'
import { Employee, Membership } from '@prisma/client'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { MembershipSchema } from './membership-dialog'

export const MembershipArraySchema = z.object({
  members: z.array(MembershipSchema)
})

export default function MembershipArrayDialog(props: {
  open: boolean
  handleOpenDialog: (dialogEnum: number) => void
  handleSave: (data: z.infer<typeof MembershipArraySchema>) => void
  committeeId: number
}) {
  const { data, isLoading } = api.committee.getOne.useQuery({
    id: props.committeeId,
    is_active: true
  })

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
    return data
      ? {
          members: data.members.map((m) => {
            return {
              employee: {
                id: m.employee.id,
                name: m.employee.name || ''
              },
              role: m.role || '',
              begin_date: _toString(m.begin_date || new Date()),
              end_date: _toString(m.end_date || _addYears(new Date(), 1)),
              ordinance: m.ordinance || '',
              observations: m.observations || ''
            }
          })
        }
      : {
          members: []
        }
  }

  const form = useForm<z.infer<typeof MembershipArraySchema>>({
    defaultValues: myDefaultValues() as any,
    resolver: zodResolver(MembershipArraySchema),
    mode: 'onChange'
  })

  useEffect(() => {
    form.reset(myDefaultValues as any)
  }, [props.open, data])

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
      <DialogContent className="overflow-x-auto">
        <DialogHeader>
          <DialogTitle>Sucessão de Membros</DialogTitle>
          <DialogDescription>
            Ao editar, os dados anteriores do órgão serão <strong>descartados</strong>.
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
          <form onSubmit={form.handleSubmit(onSubmit)} id="formMembership">
            {isLoading ? (
              <div className="mx-6 my-10 text-center text-muted-foregroundPage">Loading...</div>
            ) : (
              <div className="grid gap-y-2 ">
                {fieldArray.fields.map((f, index) => (
                  <div key={f.id} className={'flex flex-row items-end justify-between gap-x-4'}>
                    <Button
                      className="mb-1 h-5 w-5"
                      onClick={() => fieldArray.remove(index)}
                      variant="ghost"
                      size="icon"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                    <EmployeeSelectFormItem
                      hideLabel={index > 0}
                      form={form}
                      name={`members.${index}.employee`}
                    />
                    <RoleSelectFormItem
                      hideLabel={index > 0}
                      form={form}
                      name={`members.${index}.role`}
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
            )}
            <DialogFooter className="mt-4">
              <Button
                size="sm"
                className="mr-auto"
                variant="outline"
                type="button"
                onClick={() => fieldArray.append(newAppendedValue() as any)}
              >
                <PlusIcon className="mr-1 h-5 w-5" />
                Novo
              </Button>
              <Button size="sm" disabled={isLoading} type="submit" form="formMembership">
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

type EmployeeDataType = {
  id?: number
  name: string
}

const EmployeeSelectFormItem = (props: {
  form: any
  name: string
  disabled?: boolean
  hideLabel?: boolean
}) => {
  const [employees, setEmployees] = useState<EmployeeDataType[]>([])

  const { data, isLoading } = api.employee.getOptions.useQuery()

  useEffect(() => {
    if (data) setEmployees([...data])
  }, [data])

  const [createdIndex, setCreatedIndex] = useState<number>()

  const [commandSearch, setCommandSearch] = useState('')

  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col">
          {!props.hideLabel && (
            <MyLabel required className="pb-1">
              {MembershipHeaders.NAME}
            </MyLabel>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  disabled={props.disabled}
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'flex h-9 w-full justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                    !field.value.name && 'text-muted-foregroundPage'
                  )}
                >
                  {isLoading
                    ? 'Loading...'
                    : field.value.name
                    ? employees?.find((e) => e.name === field.value.name)?.name
                    : 'ex: Fulano(a)'}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="offset w-[249px] p-0">
              <Command isLoading={isLoading}>
                <CommandInput
                  placeholder={`Digite seu/sua ${MembershipHeaders.NAME}...`}
                  className="h-9"
                  onValueChange={(search) => setCommandSearch(search)}
                />
                {/* {isLoading && <CommandLoading>Loading...</CommandLoading>} */}
                <CommandEmpty className="p-0">
                  {commandSearch && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        if (createdIndex) employees.pop()
                        setCreatedIndex(employees.length)
                        const newItem = { name: commandSearch }
                        setEmployees([...employees, newItem])
                        props.form.setValue(props.name, newItem)
                      }}
                    >
                      <div className="truncate">
                        Criar {MembershipHeaders.NAME} "{commandSearch}"?
                      </div>
                    </Button>
                  )}
                </CommandEmpty>
                <CommandGroup className="max-h-80 overflow-y-auto">
                  {employees.map((employee, index) => (
                    <CommandItem
                      value={employee.name}
                      key={index}
                      onSelect={(value) => {
                        let found: EmployeeDataType | undefined
                        if (value === props.form.getValues(props.name)?.name.toLocaleLowerCase()) {
                          found = undefined
                        } else found = employees.find((e) => e.name.toLocaleLowerCase() === value)
                        props.form.setValue(props.name, found || { name: '' })
                      }}
                    >
                      {employee.name}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          employee.name === field.value.name ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const RoleSelectFormItem = (props: { form: any; name: string; hideLabel?: boolean }) => {
  const [roles, setRoles] = useState<string[]>([])

  const { data, isLoading } = api.membership.getRoleOptions.useQuery()

  useEffect(() => {
    if (data) setRoles([...data])
  }, [data])

  const [createdIndex, setCreatedIndex] = useState<number>()

  const [commandSearch, setCommandSearch] = useState('')

  return (
    <FormField
      //defaultValue={props.defaultValue}
      control={props.form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col">
          {!props.hideLabel && (
            <MyLabel required className="pb-1">
              {MembershipHeaders.ROLE}
            </MyLabel>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'flex h-9 w-full justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                    !field.value && 'text-muted-foregroundPage hover:text-muted-foregroundPage'
                  )}
                >
                  {isLoading
                    ? 'Loading...'
                    : field.value
                    ? roles.find((r) => r === field.value)
                    : 'ex: Membro(a)'}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="offset w-[249px] p-0">
              <Command isLoading={isLoading}>
                <CommandInput
                  placeholder={`Digite seu ${MembershipHeaders.ROLE}...`}
                  className="h-9"
                  onValueChange={(search) => setCommandSearch(search)}
                />
                <CommandEmpty className="p-0">
                  {commandSearch && (
                    <Button
                      className="max-h-full w-full "
                      variant="ghost"
                      onClick={() => {
                        if (createdIndex) roles.pop()
                        setCreatedIndex(roles.length)
                        setRoles([...roles, commandSearch])
                        props.form.setValue(props.name, commandSearch)
                      }}
                    >
                      <div className="truncate">
                        Criar {MembershipHeaders.ROLE} "{commandSearch}"?
                      </div>
                    </Button>
                  )}
                </CommandEmpty>
                <CommandGroup className="max-h-80 overflow-y-auto">
                  {roles.map((role, index) => (
                    <CommandItem
                      value={role}
                      key={index}
                      onSelect={(value) => {
                        let found: string | undefined
                        if (value === props.form.getValues(props.name)?.toLocaleLowerCase()) {
                          found = undefined
                        } else found = roles.find((r) => r.toLocaleLowerCase() === value)
                        props.form.setValue(props.name, found || '')
                      }}
                    >
                      {role}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          role === field.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
