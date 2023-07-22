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
import { Committee, Employee, Membership } from '@prisma/client';
import MembershipTableToolbarActions from '~/components/table/membership/membership-toolbar-actions';
import { Dot } from '~/components/dot';
import { formatCount } from '.';
import CommitteeDialog, { CommitteeSchema } from '~/components/table/committees/committee-dialog';
import { z } from 'zod';
import MembershipDialog, {
  MembershipSchema,
} from '~/components/table/membership/membership-dialog';
import { MembershipHeaders } from '~/constants/headers';

export enum dialogsEnum {
  committee,
  membership,
}

export default function CommitteeMembership() {
  const router = useRouter();
  const param_id = router.query.id;
  const [selectedMembership, setSelectedMembership] = useState<
    Membership & { employee: Employee }
  >();
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
  const updateCommittee = api.committee.update.useMutation({
    // TODO onError
    onSettled(data) {
      console.log(data);
      return utils.committee.getOne.invalidate();
    },
  });

  //TODO upsert?
  const updateMembership = api.membership.update.useMutation({
    // TODO onError
    onSettled(data) {
      return utils.committee.getOne.invalidate();
    },
  });

  const createMembership = api.membership.create.useMutation({
    // TODO onError
    onSuccess() {
      utils.employee.getOptions.invalidate(); //caso tenha criado um novo servidor no processo, atualiza a lista de opções do diálogo
    },
    onSettled(data) {
      utils.committee.getOne.invalidate();
    },
  });

  const handleSaveCommittee = (committee: z.infer<typeof CommitteeSchema> & { id?: number }) => {
    if (committee.id) updateCommittee.mutate(committee as any);
  };

  const handleSaveMembership = (membership: z.infer<typeof MembershipSchema>) => {
    if (!data?.id) return;
    if (membership.employee.id)
      updateMembership.mutate({ committee_id: data.id!, ...membership } as any);
    else createMembership.mutate({ committee_id: data.id!, ...membership });
  };

  const handleClickAddMembershipButton = () => {
    setSelectedMembership(undefined);
  };

  const propsActions = {
    committee: data!,
    handleOpenDialog,
    handleClickAddMembershipButton,
    handleDeactivateCommittees: () => {},
  };

  const handleChangeMembership = (membership: Membership & { employee: Employee }) => {
    handleOpenDialog(dialogsEnum.membership);
    setSelectedMembership({ ...membership });
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
                columns={getMembershipColumns(
                  handleChangeMembership,
                  data.begin_date,
                  data.end_date,
                )}
                tableFilters={<TableToolbarFilter {...propsFilters} />}
                tableActions={<MembershipTableToolbarActions {...propsActions} />}
                column={MembershipHeaders.NAME}
              />
              <CommitteeDialog
                committee={data}
                open={openDialog == dialogsEnum.committee}
                handleOpenDialog={handleOpenDialog}
                handleSave={handleSaveCommittee}
              />
              <MembershipDialog
                member={selectedMembership}
                open={openDialog == dialogsEnum.membership}
                handleOpenDialog={handleOpenDialog}
                handleSave={handleSaveMembership}
                committeeDates={{ begin_date: data.begin_date, end_date: data.end_date }}
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
