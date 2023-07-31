import { HourglassIcon } from 'lucide-react'
import { CircleOffIcon } from 'lucide-react'

export type FilterStateType =
  | {
      value?: boolean
      labels?: string[]
    }
  | undefined

export const filterAProps = {
  title: 'Status',
  options: [
    { label: 'Ativo(a)', value: 'is_active' },
    { label: 'Inativo(a)', value: 'is_inactive', icon: CircleOffIcon }
  ]
}

export const filterTProps = {
  title: 'Tipo',
  options: [
    { label: 'Permanente', value: 'is_permanent' },
    { label: 'Temporário(a)', value: 'is_temporary', icon: HourglassIcon }
  ]
}

export const handleChangeComplementaryFilters = (
  str: string,
  setFilterFn: (filter: FilterStateType) => void,
  labels?: string[]
) => {
  if (!labels?.length || labels.length >= 2) {
    setFilterFn({ value: undefined, labels })
  } else {
    setFilterFn({ value: labels?.includes(str), labels })
  }
}
