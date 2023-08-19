'use client'

import { HourglassIcon } from 'lucide-react'
import { CircleOffIcon } from 'lucide-react'
import { MyHeaders } from '~/constants/headers'
import { FilterStateDatesType } from '~/types'

export type FilterStateType =
  | {
      value?: boolean
      labels?: string[]
    }
  | undefined

export const filterAProps = (sufix?: string) => {
  return {
    title: 'Status' + (sufix ? ` de ${sufix}` : ''),
    options: [
      { label: 'Ativo(a)', value: 'is_active' },
      { label: 'Inativo(a)', value: 'is_inactive', icon: CircleOffIcon }
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
    arr.push(`De: ${dates.begin_date}`)
  }
  if (dates.end_date) {
    arr.push(`Até: ${dates.end_date}`)
  }
  return arr
}
