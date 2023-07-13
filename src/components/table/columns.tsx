'use client';

import { Committee } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { CommitteeHeaders } from '~/constants/headers';

export const columns: ColumnDef<Committee>[] = [
  {
    accessorKey: 'bond',
    header: CommitteeHeaders.BOND,
  },
  {
    accessorKey: 'name',
    header: CommitteeHeaders.NAME,
  },
  {
    accessorKey: 'begin_date',
    header: CommitteeHeaders.BEGIN_DATE,
  },
  {
    accessorKey: 'end_date',
    header: CommitteeHeaders.END_DATE,
  },
  {
    accessorKey: 'ordinance',
    header: CommitteeHeaders.ORDINANCE,
  },
];
