'use client';

import { Committee } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { CommitteeHeaders } from '~/constants/headers';
import { _toLocaleString } from '~/utils/string';

export const columns: ColumnDef<Committee>[] = [
  {
    accessorKey: 'name',
    header: () => <strong>{CommitteeHeaders.NAME}</strong>,
  },
  {
    accessorKey: 'bond',
    header: () => <strong>{CommitteeHeaders.BOND}</strong>,
    cell: ({ row }) => {
      const value = row.getValue('bond') as string;
      return <div className="text-center">{value}</div>;
    },
  },
  {
    accessorKey: 'begin_date',
    header: () => <strong>{CommitteeHeaders.BEGIN_DATE}</strong>,
    cell: ({ row }) => {
      const date = row.getValue('begin_date') as Date;
      return <div className="text-center">{_toLocaleString(date)}</div>; // pode retornar JSX tbm
    },
  },
  {
    accessorKey: 'end_date',
    header: () => <strong>{CommitteeHeaders.END_DATE}</strong>,
    cell: ({ row }) => {
      const date = row.getValue('end_date') as Date;
      return <div className="text-center">{_toLocaleString(date)}</div>;
    },
  },
  {
    accessorKey: 'ordinance',
    header: () => <strong>{CommitteeHeaders.ORDINANCE}</strong>,
    cell: ({ row }) => {
      const value = row.getValue('ordinance') as string;
      return <div className="text-center">{value}</div>;
    },
  },
];
