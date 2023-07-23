import { CircleIcon, CircleOffIcon, RefreshCwIcon, RefreshCwOffIcon } from 'lucide-react';

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
