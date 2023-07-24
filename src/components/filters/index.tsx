import { CircleIcon, CircleOffIcon, RefreshCwIcon, RefreshCwOffIcon } from 'lucide-react';

export type FilterStateType =
  | {
      value?: boolean;
      labels?: string[];
    }
  | undefined;

export const filterAProps = {
  title: 'Status',
  options: [
    { label: 'Ativo(a)', value: 'is_active', icon: CircleIcon },
    { label: 'Inativo(a)', value: 'is_inactive', icon: CircleOffIcon },
  ],
};

export const filterTProps = {
  title: 'Tipo',
  options: [
    { label: 'Permanente', value: 'is_permanent', icon: RefreshCwIcon },
    { label: 'Temporário(a)', value: 'is_temporary', icon: RefreshCwOffIcon },
  ],
};

export const handleChangeActiveFilters = (
  str: string,
  setFilterFn: (filter: FilterStateType) => void,
  labels?: string[],
) => {
  if (!labels?.length || labels.length >= 2) {
    setFilterFn(undefined);
  } else {
    setFilterFn({ value: labels?.includes(str), labels });
  }
};
