import { Button } from '@/components/ui/button'
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
  FormDescription
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { ChevronsUpDownIcon, CheckIcon } from 'lucide-react'
import { useState, useEffect, PropsWithChildren } from 'react'
import { CommitteeHeaders, MembershipHeaders, MyHeaders } from '~/constants/headers'
import { api } from '~/utils/api'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

export const RoleSelectFormItem = (props: {
  form: any
  fieldName: 'role' | `members.${number}.role`
  hideLabel?: boolean
}) => {
  const [roles, setRoles] = useState<string[]>([])

  const { data, isLoading } = api.membership.getRoleOptions.useQuery()

  useEffect(() => {
    if (data) setRoles([...(data as string[])])
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
                  <span className="max-w-[149px] truncate">
                    {isLoading
                      ? 'Loading...'
                      : field.value
                      ? roles.find((r) => r === field.value)
                      : 'ex: Membro(a)'}
                  </span>

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
                        Criar {MembershipHeaders.ROLE.toLowerCase()} "{commandSearch}"?
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

export const EmployeeSelectFormItem = (props: {
  form: any
  fieldName: `members.${number}.employee` | 'employee'
  disabled?: boolean
  hideLabel?: boolean
}) => {
  type EmployeeDataType = {
    id?: number
    name: string
  }

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
                    'flex h-9 justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                    !field.value.name && 'text-muted-foregroundPage'
                  )}
                >
                  <span className="max-w-[149px] truncate">
                    {isLoading
                      ? 'Loading...'
                      : field.value.name
                      ? employees?.find((e) => e.name === field.value.name)?.name
                      : 'ex: Fulano(a)'}
                  </span>
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
                        Criar {MembershipHeaders.NAME.toLowerCase()} "{commandSearch}"?
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

export const ObservationsFormItem = (props: { form: any; label: string; fieldName: string }) => {
  return (
    <FormField
      control={props.form.control}
      name={props.fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <Textarea
              rows={1}
              placeholder="Something something..."
              className="resize-y placeholder:text-muted-foregroundPage"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export const MyLabel = (props: { required?: boolean; className?: string } & PropsWithChildren) => {
  return (
    <FormLabel className={props.className}>
      {props.children}
      {props.required ? <span className="ml-1 text-red-700">*</span> : <></>}
    </FormLabel>
  )
}

export const CommonFormItem = (props: {
  form: any
  fieldName: string
  label: string
  placeholder?: string
  required?: boolean
  className?: string
  hideLabel?: boolean
}) => {
  return (
    <FormField
      control={props.form.control}
      name={props.fieldName}
      render={({ field }) => (
        <FormItem className={cn('mt-1', props.className)}>
          {!props.hideLabel && <MyLabel required={props.required}>{props.label}</MyLabel>}{' '}
          <FormControl>
            <Input
              // required={props.required}
              className="placeholder:text-muted-foregroundPage"
              {...field}
              placeholder={props.placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export const DateFormItem = (props: {
  form: any
  fieldName: string
  label: string
  required?: boolean
  className?: string
  hideLabel?: boolean
}) => {
  return (
    <FormField
      control={props.form.control}
      name={props.fieldName}
      render={({ field }) => (
        <FormItem className={cn('flex w-full flex-col', props.className)}>
          {!props.hideLabel && <MyLabel required={props.required}>{props.label}</MyLabel>}
          <Input type="date" {...field} />
          <FormMessage />
        </FormItem>
      )}
    ></FormField>
  )
}

export const TemplateSelectFormItem = (props: { form: any; disabled?: boolean }) => {
  const [templates, setTemplates] = useState<string[]>([])

  const { data, isLoading } = api.template.getOptions.useQuery()

  useEffect(() => {
    if (data) setTemplates([...data.map((e) => e.name)])
  }, [data])

  const [createdIndex, setCreatedIndex] = useState<number>()

  const [commandSearch, setCommandSearch] = useState('')

  return (
    <FormField
      control={props.form.control}
      name="template_name"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="pb-1">{MyHeaders.TEMPLATE}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  disabled={props.disabled}
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
                    ? templates.find((template) => template === field.value)
                    : 'ex: Direção INF'}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="offset w-96 p-0">
              <Command isLoading={isLoading}>
                <CommandInput
                  placeholder={`Digite seu ${CommitteeHeaders.TEMPLATE}...`}
                  className="h-9"
                  onValueChange={(search) => setCommandSearch(search)}
                />
                <CommandEmpty className="p-0">
                  {isLoading
                    ? 'Loading...'
                    : commandSearch && (
                        <Button
                          className="max-h-full w-full "
                          variant="ghost"
                          onClick={() => {
                            if (createdIndex) templates.pop()
                            setCreatedIndex(templates.length)
                            setTemplates([...templates, commandSearch])
                            props.form.setValue('template_name', commandSearch)
                          }}
                        >
                          <div className="truncate">
                            Criar {CommitteeHeaders.TEMPLATE.toLowerCase()} "{commandSearch}"?
                          </div>
                        </Button>
                      )}
                </CommandEmpty>
                <CommandGroup className="max-h-64 overflow-y-auto">
                  {templates.map((template) => (
                    <CommandItem
                      value={template}
                      key={template}
                      onSelect={(value) => {
                        let found: string | undefined
                        if (value === props.form.getValues('template_name')?.toLocaleLowerCase()) {
                          found = undefined
                        } else found = templates.find((t) => t.toLocaleLowerCase() === value)
                        props.form.setValue('template_name', found || '')
                      }}
                    >
                      {template}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          template === field.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          {/* <FormDescription className="-mb-1.5">
            Instâncias de comissões <strong>permanentes</strong> devem pertencer a sua{' '}
            {CommitteeHeaders.TEMPLATE}.
          </FormDescription> */}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
