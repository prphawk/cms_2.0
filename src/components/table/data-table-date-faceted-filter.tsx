import * as React from 'react'
import { cn } from '@/lib/utils'
import { CalendarSearchIcon, Check, ListFilterIcon, SearchIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Command, CommandGroup, CommandItem } from '@/components/ui/command'
import { CommitteeHeaders } from '~/constants/headers'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { _toDate, _toLocaleString, _toString } from '~/utils/string'
import { FilterStateDatesType } from '~/types'
import { MyButton } from '../button'

export function DataTableDateFacetedFilter<TData, TValue>({
  title,
  setDatesValue,
  disabled,
  filters,
  dates
}: {
  title: string
  dates: FilterStateDatesType
  filters?: string[]
  setDatesValue: (values: FilterStateDatesType) => void
  disabled?: boolean
  date?: boolean
}) {
  const selectedDates = filters

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
          {selectedDates && selectedDates?.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selectedDates.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedDates.map((e) => (
                  <Badge
                    key={e}
                    variant="secondary"
                    className="truncate rounded-sm px-1 font-normal"
                  >
                    {e}
                  </Badge>
                ))}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <FilterDate {...{ dates, selectedDates, setDatesValue }} />
    </Popover>
  )
}

function FilterDate({
  dates,
  selectedDates,
  setDatesValue
}: {
  dates: FilterStateDatesType
  selectedDates?: string[]
  setDatesValue: (values: FilterStateDatesType) => void
}) {
  const [formDates, setFormDates] = useState(dates)

  const handleSearch = () => {
    setDatesValue(formDates)
  }

  return (
    <PopoverContent className="w-[200px] p-2" align="start">
      <Command>
        <CommandGroup>
          <div className="grid gap-4">
            <DateItem
              value={formDates.begin_date}
              label={CommitteeHeaders.BEGIN_DATE}
              handleOnChange={(value) => {
                const begin_date = value
                setFormDates({ ...dates, begin_date })
              }}
            />
            <DateItem
              value={formDates.end_date}
              label={CommitteeHeaders.END_DATE}
              handleOnChange={(value) => {
                const end_date = value
                setFormDates({ ...dates, end_date })
              }}
            />
          </div>
        </CommandGroup>
        {/* {selectedDates && selectedDates.length > 0 && (
          <>
            <CommandGroup>
              <CommandItem
                onSelect={() => setDatesValue({ begin_date: undefined, end_date: undefined })}
                className="justify-center text-center"
              >
                Limpar filtros
              </CommandItem>
            </CommandGroup>
          </>
        )} */}
        <>
          <Button
            variant="ghost"
            onClick={(e) => handleSearch()}
            className="mt-1 justify-center text-center"
          >
            <CalendarSearchIcon className="mr-1 h-4 w-4" /> Buscar
          </Button>
        </>
      </Command>
    </PopoverContent>
  )
}

const DateItem = (props: {
  value?: string
  label: string
  className?: string
  handleOnChange: (label: string) => void
}) => {
  return (
    <div className={cn('flex w-full flex-col space-y-1', props.className)}>
      <Label>{props.label}</Label>
      <Input
        type="date"
        defaultValue={props.value}
        onChange={(e) => props.handleOnChange(e.target.value)}
      />
    </div>
  )
}
