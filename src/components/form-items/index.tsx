import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { ChevronsUpDownIcon, CheckIcon, HelpCircleIcon } from 'lucide-react'
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Checkbox } from '@/components/ui/checkbox'
import { z } from 'zod'
import { CommitteeTemplateFormSchema } from '~/schemas/committee'
import { PLACEHOLDER } from '~/constants/placeholders'

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
                    'flex h-9 w-full justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                  )}
                >
                  <span
                    className={cn(
                      'max-w-[149px] truncate',
                      !field.value && 'text-muted-foregroundPage hover:text-muted-foregroundPage'
                    )}
                  >
                    {isLoading
                      ? PLACEHOLDER.LOADING
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
                    'flex h-9 justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                  )}
                >
                  <span
                    className={cn(
                      'max-w-[149px] truncate',
                      !field.value.name && 'text-muted-foregroundPage'
                    )}
                  >
                    {isLoading
                      ? PLACEHOLDER.LOADING
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
                {/* {isLoading && <CommandLoading>Carregando...</CommandLoading>} */}
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
              placeholder="ex: 2º mandato"
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

const TemplateTooltip = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircleIcon className="ml-1 h-4 w-4 p-[2px]" />
        </TooltipTrigger>
        <TooltipContent className="max-w-[52ch] bg-black text-center text-white">
          {`Mandatos de comissões regimentais (permantentes) devem ser incluidos em seu ${MyHeaders.TEMPLATE.toLowerCase()}.`}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const TemplateSelectFormItem = (props: { form: any; disabled?: boolean }) => {
  type OptionType = {
    id?: number
    name: string
    committees?: {
      id: number
    }[]
  }
  const [options, setOptions] = useState<OptionType[]>([])

  const { data, isLoading } = api.template.getOptions.useQuery()

  useEffect(() => {
    if (data) setOptions([...data])
  }, [data])

  const [createdIndex, setCreatedIndex] = useState<number>()

  const [searchValue, setSearchValue] = useState('')

  const handleChangeFormValue = (value?: z.infer<typeof CommitteeTemplateFormSchema>) => {
    props.form.setValue('template', value)
    console.log(props.form.getValues('template'))
    console.log(
      props.form.getValues('is_active') && !!props.form.getValues('template')?.committees?.length
    )
    const formNameValue = props.form.getValues('name')
    if (!formNameValue) props.form.setValue('name', value?.name)
  }

  const handleClickCreateOption = () => {
    if (createdIndex) options.shift()
    setCreatedIndex(options.length)
    const newOption = { name: searchValue }
    setOptions([newOption, ...options])
    handleChangeFormValue(newOption)
  }

  const handleClickOption = (clickedOption: OptionType, clickedOptionIndex: number) => {
    const fieldValue = props.form.getValues('template')
    const fieldValueName = fieldValue?.name
    if (clickedOption.name === fieldValueName) {
      handleChangeFormValue(undefined)
    } else {
      const newFieldValue = options[clickedOptionIndex]
      handleChangeFormValue(newFieldValue)
    }
  }

  const handleChangeSearchValue = (value: string) => {
    setSearchValue(value)
  }

  const getButtonValue = (fieldValue: OptionType) => {
    if (isLoading) return PLACEHOLDER.LOADING

    if (fieldValue?.name) {
      const searchResult = options.find((option) => option.name === fieldValue.name)
      if (searchResult) return searchResult.name
    }

    return PLACEHOLDER.TEMPLATE
  }

  return (
    <FormField
      control={props.form.control}
      name="template"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <span className="flex flex-row">
            <FormLabel className="pb-1">{MyHeaders.TEMPLATE}</FormLabel>
            <TemplateTooltip />
          </span>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  disabled={props.disabled}
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'flex h-9 w-full justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                  )}
                >
                  <span className={!field.value?.name ? 'text-muted-foregroundPage' : ''}>
                    {getButtonValue(field.value)}
                  </span>
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="offset w-[462px] p-0">
              <Command isLoading={isLoading}>
                <CommandInput
                  placeholder={`Digite o nome de um ${CommitteeHeaders.TEMPLATE.toLowerCase()}...`}
                  className="h-9"
                  onValueChange={handleChangeSearchValue}
                />
                <CommandEmpty className="p-0">
                  {isLoading
                    ? PLACEHOLDER.LOADING
                    : searchValue && (
                        <Button
                          className="max-h-full w-full "
                          variant="ghost"
                          onClick={handleClickCreateOption}
                        >
                          <div className="truncate">
                            Criar {CommitteeHeaders.TEMPLATE.toLowerCase()} "{searchValue}"?
                          </div>
                        </Button>
                      )}
                </CommandEmpty>
                <CommandGroup className="max-h-64 overflow-y-auto">
                  {options.map((option, index) => (
                    <CommandItem
                      value={option.name}
                      key={option.name}
                      onSelect={() => handleClickOption(option, index)}
                    >
                      {option.name}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          option.name === field.value?.name ? 'opacity-100' : 'opacity-0'
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

export const CheckBoxFormItem = (props: {
  form: any
  fieldName: string
  label: string
  disabled?: boolean
}) => {
  return (
    <FormField
      control={props.form.control}
      name={props.fieldName}
      render={({ field }) => (
        <FormItem
          className={cn(
            'flex w-full flex-row items-start space-x-3 space-y-0 rounded-md border p-2',
            props.disabled ? 'opacity-50' : undefined
          )}
        >
          <FormControl>
            <Checkbox
              className="h-5 w-5"
              disabled={props.disabled}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{props.label}</FormLabel>
            {/* <FormDescription>You can manage your mobile notifications in the</FormDescription> */}
          </div>
        </FormItem>
      )}
    />
  )
}

// export const SelectFormItem = (
//   props: {
//     form: any
//     fieldName: string
//     label: string
//     onChangeValue: (value?: { id: number; name: string }) => void
//     options: { id: number; name: string }[]
//     onSelectOption: () => void
//     searchValue: string
//     onChangeSearchValue: (value: string) => void
//     disabled?: boolean
//     isLoading?: boolean
//   } & PropsWithChildren
// ) => {
//   return (
//     <FormField
//       control={props.form.control}
//       name={props.fieldName}
//       render={({ field }) => (
//         <FormItem className="flex flex-col">
//           <span className="flex flex-row">
//             <FormLabel className="pb-1">{props.label}</FormLabel>
//             {props.children}
//           </span>
//           <Popover>
//             <PopoverTrigger asChild>
//               <FormControl>
//                 <Button
//                   disabled={props.disabled}
//                   variant="outline"
//                   role="combobox"
//                   className={cn(
//                     'flex h-9 w-full justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
//                     !field.value && 'text-muted-foregroundPage hover:text-muted-foregroundPage'
//                   )}
//                 >
//                   {props.isLoading
//                     ? 'Carregando...'
//                     : field.value.name
//                     ? props.options.find((option) => option.name === field.value.name)
//                     : 'ex: Direção'}
//                   <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                 </Button>
//               </FormControl>
//             </PopoverTrigger>
//             <PopoverContent className="offset w-[462px] p-0">
//               <Command isLoading={props.isLoading}>
//                 <CommandInput
//                   placeholder={`Procure um valor`}
//                   className="h-9"
//                   onValueChange={props.onChangeSearchValue}
//                 />
//                 <CommandEmpty className="p-0">
//                   {props.isLoading
//                     ? 'Carregando...'
//                     : props.searchValue && (
//                         <Button
//                           className="max-h-full w-full "
//                           variant="ghost"
//                           onClick={props.onSelectOption}
//                         >
//                           <div className="truncate">
//                             Criar {props.label.toLowerCase()} "{props.searchValue}"?
//                           </div>
//                         </Button>
//                       )}
//                 </CommandEmpty>
//                 <CommandGroup className="max-h-64 overflow-y-auto ">
//                   {props.options.map((option) => (
//                     <CommandItem
//                       value={option}
//                       key={option}
//                       onSelect={(value) => {
//                         let found: string | undefined
//                         if (value === props.form.getValues(props.fieldName)?.toLocaleLowerCase()) {
//                           found = undefined
//                         } else found = props.options.find((o) => o.toLocaleLowerCase() === value)
//                         props.onChangeValue(found)
//                       }}
//                     >
//                       {option}
//                       <CheckIcon
//                         className={cn(
//                           'ml-auto h-4 w-4',
//                           option === field.value ? 'opacity-100' : 'opacity-0'
//                         )}
//                       />
//                     </CommandItem>
//                   ))}
//                 </CommandGroup>
//               </Command>
//             </PopoverContent>
//           </Popover>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   )
// }
