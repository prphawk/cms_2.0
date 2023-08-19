import * as React from 'react'
import { cn } from '@/lib/utils'
import { Check, ListFilterIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'
import { IconBadge } from '../badge'

export interface DataTableFacetedFilter<TData, TValue> {
  title?: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
    date?: boolean
  }[]
}

export function DataTableFacetedFilter<TData, TValue>({
  title,
  options,
  filters,
  setFiltersValue,
  disabled
}: DataTableFacetedFilter<TData, TValue> & {
  filters?: string[]
  setFiltersValue: (values?: string | string[]) => void
  disabled?: boolean
}) {
  const selectedValues = new Set<string>(filters)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          size="sm"
          className="h-8 border-dashed bg-transparent"
        >
          <ListFilterIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge variant="secondary" className="truncate rounded-sm px-1 font-normal">
                    {selectedValues.size} selecionados
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="truncate rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[220px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>Sem resultados.</CommandEmpty>
            <CommandGroup>
              {options.map((option, index) => (
                <GroupFilterOptions key={index} {...{ selectedValues, setFiltersValue, option }} />
              ))}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => setFiltersValue(undefined)}
                    className="justify-center text-center"
                  >
                    Limpar filtros
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function GroupFilterOptions({
  selectedValues,
  option,
  setFiltersValue
}: {
  selectedValues: Set<string>
  option: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }
  setFiltersValue: (values?: string[]) => void
}) {
  const isSelected = selectedValues.has(option.value)
  return (
    <CommandItem
      key={option.value}
      onSelect={() => {
        if (isSelected) {
          selectedValues.delete(option.value)
        } else {
          selectedValues.add(option.value)
        }
        const filterValues = Array.from(selectedValues)
        setFiltersValue(filterValues.length ? filterValues : undefined)
      }}
    >
      <div
        className={cn(
          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
          isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
        )}
      >
        <Check className={cn('h-4 w-4')} />
      </div>
      <span>{option.label}</span>
      {option.icon && (
        <IconBadge>
          <option.icon className="h-3 w-3 text-gray-600" />
        </IconBadge>
      )}
    </CommandItem>
  )
}
