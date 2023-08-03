'use client'

import { HourglassIcon } from 'lucide-react'
import { CircleOffIcon } from 'lucide-react'

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
  title: 'Tipo',
  options: [
    { label: 'Permanente', value: 'is_permanent' },
    { label: 'Temporário(a)', value: 'is_temporary', icon: HourglassIcon }
  ]
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

export const getComplementaryFilterValue = (ls_key: string, label_1: string, label_2: string) => {
  const ls_value = localStorage.getItem(ls_key)
  if (ls_value) {
    const value = Boolean(ls_value)
    return {
      value,
      labels: [value ? label_1 : label_2]
    } as FilterStateType
  }
  return undefined
}
// export const getArrayFilterValue = (ls_key: string) => {
//   const ls_value = localStorage.getItem(ls_key)
//   if (ls_value) {
//     const value = ls_value.split(',')
//     return value
//   }
//   return undefined
// }
