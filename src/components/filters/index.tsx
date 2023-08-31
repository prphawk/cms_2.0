'use client'

import { HourglassIcon } from 'lucide-react'
import { XIcon } from 'lucide-react'
import { MyHeaders } from '~/constants/headers'
import { FilterStateDatesType } from '~/types'
import { _toLocaleStringFromForm } from '~/utils/string'

export type FilterStateType =
  | {
      value?: boolean
      labels?: string[]
    }
  | undefined

export const filterAProps = (props: {
  sufix?: string
  active_label: string
  inactive_label: string
}) => {
  return {
    title: 'Status' + (props.sufix ? ` de ${props.sufix}` : ''),
    options: [
      { label: props.active_label, value: 'is_active' },
      { label: props.inactive_label, value: 'is_inactive', icon: XIcon }
    ]
  }
}

export const filterTProps = {
  title: MyHeaders.CATEGORY_F,
  options: [
    { label: 'Permanente', value: 'is_permanent' },
    { label: 'Temporário(a)', value: 'is_temporary', icon: HourglassIcon }
  ]
}
export const filterDProps = {
  title: MyHeaders.CATEGORY_D,
  dates: { begin_date: undefined, end_date: undefined },
  date: true
}

export const handleChangeComplementaryFilters = (
  ls_key: string,
  str: string,
  setFilterFn: (filter: FilterStateType) => void,
  labels?: string[]
) => {
  if (!labels?.length || labels.length >= 2) {
    setFilterFn({ value: undefined, labels })
    localStorage.removeItem(ls_key)
  } else {
    const value = labels?.includes(str)
    setFilterFn({ value, labels })
    localStorage.setItem(ls_key, value.toString())
  }
}

export const getComplementaryFilterValue = (
  ls_key: string,
  true_label: string,
  false_label: string
) => {
  const ls_value = localStorage.getItem(ls_key)
  if (ls_value) {
    const value = JSON.parse(ls_value) as boolean
    return {
      value,
      labels: [value ? true_label : false_label]
    } as FilterStateType
  }
  return undefined
}

export const getActiveDateFilterLabels = (dates: FilterStateDatesType) => {
  const arr = new Array<string>()
  if (dates.begin_date) {
    arr.push(`De: ${_toLocaleStringFromForm(dates.begin_date)}`)
  }
  if (dates.end_date) {
    arr.push(`Até: ${_toLocaleStringFromForm(dates.end_date)}`)
  }
  return arr
}
