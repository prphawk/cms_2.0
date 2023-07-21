import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useRouter } from 'next/router';
import { useState } from 'react';
import AuthenticatedPage from '~/components/authenticated-page';
import { getMembershipColumns } from '~/components/table/membership/membership-columns';
import { TableToolbarFilter } from '~/components/table/data-table-toolbar';
import { DataTable } from '~/components/table/data-table';
import PageLayout, { TitleLayout } from '~/layout';
import { api } from '~/utils/api';
import { _isNumeric, _toLocaleString } from '~/utils/string';
import { Committee, Membership } from '@prisma/client';
import MembershipTableToolbarActions from '~/components/table/membership/membership-toolbar-actions';
import { Dot } from '~/components/dot';
import { formatCount } from '.';
import CommitteeDialog, { CommitteeSchema } from '~/components/table/committees/committee-dialog';
import { z } from 'zod';
import MembershipDialog from '~/components/table/membership/membership-dialog';

export enum dialogsEnum {
  committee,
  membership,
}

export default function CommitteeMembership() {
  const router = useRouter();
  const param_id = router.query.id;
  const [filters, setFilters] = useState<{ is_active?: boolean; is_temporary?: boolean }>();
  const [filterLabelsA, setFilterLabelsA] = useState<string[]>([]);
  const [filterLabelsT, setFilterLabelsT] = useState<string[]>([]);
  const { data, isLoading, isError } = api.committee.getOne.useQuery(
    {
      //TODO useMemo
      id: Number(param_id),
      is_active: filters?.is_active,
      is_temporary: filters?.is_temporary,
    },
    { enabled: _isNumeric(param_id) },
  );

  const _setIsActiveFilterValues = (values?: string[]) => {
    if (!values?.length || values.length >= 2) {
      setFilters({ ...filters, is_active: undefined });
      setFilterLabelsA(values || []);
    } else {
      setFilters({ ...filters, is_active: values?.includes('is_active') });
      setFilterLabelsA(values!);
    }
  };

  const _setIsTemporaryFilterValues = (values?: string[]) => {
    if (!values?.length || values.length >= 2) {
      setFilters({ ...filters, is_temporary: undefined });
      setFilterLabelsT(values || []);
    } else {
      setFilters({ ...filters, is_temporary: values?.includes('is_temporary') });
      setFilterLabelsT(values!);
    }
  };

  if (
    isError
    //|| deactivate.isError
  ) {
    return <span>Error: sowwyyyy</span>;
  }

  const propsFilters = {
    _setIsTemporaryFilterValues,
    _setIsActiveFilterValues,
    isActiveFilters: filterLabelsA,
    isTemporaryFilters: filterLabelsT,
  };
  const [openDialog, setOpenDialog] = useState(-1);

  const handleOpenDialog = (dialogEnum: number) => {
    setOpenDialog(dialogEnum);
  };

  const utils = api.useContext();

  //TODO replace w/ upsert? that would b cool
  const update = api.committee.update.useMutation({
    // TODO onError
    onSettled(data) {
      console.log(data);
      return utils.committee.getOne.invalidate();
    },
  });

  const handleSave = (data: z.infer<typeof CommitteeSchema> & { id?: number }) => {
    if (data.id) update.mutate(data as any);
  };

  const propsActions = {
    committee: data!,
    handleOpenDialog,
    handleDeactivateCommittees: () => {},
  };

  return (
    <AuthenticatedPage>
      <PageLayout>
        <div className="committee container my-10 mb-auto text-white ">
          {data && (
            <>
              <CommitteeDetails data={data} />
              <DataTable
                isLoading={isLoading}
                data={data?.members || []}
                columns={getMembershipColumns(data.begin_date, data.end_date)}
                tableFilters={<TableToolbarFilter {...propsFilters} />}
                tableActions={<MembershipTableToolbarActions {...propsActions} />}
              />
              <CommitteeDialog
                committee={data}
                open={openDialog == dialogsEnum.committee}
                handleOpenDialog={handleOpenDialog}
                handleSave={handleSave}
              />
              <MembershipDialog
                members={data.members}
                open={openDialog == dialogsEnum.membership}
                handleOpenDialog={handleOpenDialog}
                //handleSave={handleSave}
              />
            </>
          )}
        </div>
      </PageLayout>
    </AuthenticatedPage>
  );
}

export type CommitteeDataType = Committee & { members: Membership[] };

const CommitteeDetails = ({ data }: { data: CommitteeDataType }) => {
  const { data: countData, isLoading } = api.membership.groupByActivity.useQuery({
    committee_id: data.id,
  });

  const { active_count, total_count } = formatCount(isLoading, countData);
  return (
    <Accordion className="mb-6" type="single" defaultValue="item-1" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <TitleLayout>{data?.name}</TitleLayout>
        </AccordionTrigger>
        <AccordionContent className="tracking-wide">
          <strong>Vínculo: </strong> {data?.bond}
          <Dot />
          <strong>Portaria: </strong>
          {data?.ordinance || '-'}
          <Dot />
          <strong>Data de Início: </strong>
          {_toLocaleString(data?.begin_date)}
          <Dot />
          <strong>Data de Fim: </strong>
          {_toLocaleString(data?.end_date)}
          <Dot />
          {data.observations && (
            <>
              <strong>Observações: </strong> "{data.observations}"
              <Dot />
            </>
          )}
          <strong>Tipo: </strong>Órgão
          {data?.committee_template_id ? ' Permanente' : ' Temporário'}
          <Dot />
          <strong>Status: </strong> {data?.is_active ? 'Ativa' : 'Inativa'}
          <Dot />
          <strong>Membros: </strong> {total_count}
          <Dot />
          <strong>Membros ativos: </strong> {active_count}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
