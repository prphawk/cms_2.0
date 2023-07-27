import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { ChevronsUpDownIcon, CheckIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { MembershipHeaders } from '~/constants/headers'
import { api } from '~/utils/api'
import { MyLabel } from '../dialogs/committee-dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command'
import { UseFormReturn } from 'react-hook-form'

type FormType = UseFormReturn<
  {
    members: {
      employee: {
        name: string
        id?: number | undefined
      }
      role: string
      begin_date: Date
      end_date: Date
      observations?: string | undefined
      ordinance?: string | undefined
    }[]
  },
  any,
  undefined
>

export const RoleSelectFormItem = (props: {
  form: FormType
  fieldName: `members.${number}.role`
  hideLabel?: boolean
}) => {
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
      name={props.fieldName}
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
                        props.form.setValue(props.fieldName, commandSearch)
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
                        if (value === props.form.getValues(props.fieldName)?.toLocaleLowerCase()) {
                          found = undefined
                        } else found = roles.find((r) => r.toLocaleLowerCase() === value)
                        props.form.setValue(props.fieldName, found || '')
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

type EmployeeDataType = {
  id?: number
  name: string
}

export const EmployeeSelectFormItem = (props: {
  form: FormType
  fieldName: `members.${number}.employee`
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
      name={props.fieldName}
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
                        props.form.setValue(props.fieldName, newItem)
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
                        if (
                          value === props.form.getValues(props.fieldName)?.name.toLocaleLowerCase()
                        ) {
                          found = undefined
                        } else found = employees.find((e) => e.name.toLocaleLowerCase() === value)
                        props.form.setValue(props.fieldName, found || { name: '' })
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
