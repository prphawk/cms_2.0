import AuthenticatedPage from '~/components/authenticated-page';
import { getCommitteesColumns } from '~/components/table/committees/committees-columns';
import { DataTable } from '~/components/table/data-table';
import PageLayout, { TitleLayout } from '~/layout';
import { api } from '~/utils/api';
import { useState } from 'react';
import { IFilter, TableToolbarFilter } from '../../../components/table/data-table-toolbar';
import { useRouter } from 'next/router';
import { Routes } from '~/constants/routes';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { _toLocaleString, _formatCount } from '~/utils/string';
import { Dot } from '~/components/dot';
import CommitteesTableToolbarActions from '~/components/table/committees/committees-toolbar-actions';
import CommitteeDialog, { CommitteeSchema } from '~/components/table/committees/committee-dialog';
import { z } from 'zod';
import { CommitteeHeaders } from '~/constants/headers';
import { dialogsEnum } from './[id]';
import {
  FilterStateType,
  filterAProps,
  filterTProps,
  handleChangeActiveFilters,
} from '~/components/filters';

export default function Committees() {
  const router = useRouter();

  const [open, setOpen] = useState(-1);

  const handleOpenDialog = (dialogEnum: number) => setOpen(dialogEnum);

  const [filterA, setFilterA] = useState<FilterStateType>();
  const [filterT, setFilterT] = useState<FilterStateType>();

  const utils = api.useContext();

  const { data, isLoading, isError } = api.committee.getAll.useQuery({
    is_active: filterA?.value,
    is_temporary: filterT?.value,
  });

  if (isError) {
    return <span>Error: sowwyyyy</span>;
  }

  const propsFilters: IFilter[] = [
    {
      ...filterAProps,
      activeFilters: filterA?.labels,
      handleChangeActiveFilters: (labels) =>
        handleChangeActiveFilters('is_active', setFilterA, labels),
    },
    {
      ...filterTProps,
      activeFilters: filterT?.labels,
      handleChangeActiveFilters: (labels) =>
        handleChangeActiveFilters('is_temporary', setFilterT, labels),
    },
  ];

  const deactivate = api.committee.deactivate.useMutation({
    onMutate() {
      return utils.committee.getAll.cancel();
    },
    // TODO onError
    onSettled(data) {
      return utils.committee.getAll.invalidate();
    },
  });

  const create = api.committee.create.useMutation({
    // TODO onError
    onSettled(data) {
      return utils.committee.getAll.invalidate();
    },
  });

  function handleDeactivateCommittees(ids: number[]) {
    //TODO pelo amor de deus vai invalidar tudo 500 vezes
    // faz a função no prisma com IN pra ver os ids
    ids.forEach((id) => deactivate.mutate({ id }));
  }

  function handleViewCommittee(id: number) {
    router.push(`${Routes.COMMITTEES}/${id}`);
  }

  const handleSaveCommittee = (data: z.infer<typeof CommitteeSchema>) => {
    create.mutate(data);
  };

  return (
    <AuthenticatedPage>
      <PageLayout>
        {/* <LoadingLayout loading={isLoading}> */}
        <div className="committees container my-10 mb-auto text-white ">
          <Header />
          <DataTable
            data={data || []}
            isLoading={isLoading}
            columns={getCommitteesColumns(handleDeactivateCommittees, handleViewCommittee)}
            tableFilters={<TableToolbarFilter filters={propsFilters} />}
            tableActions={
              <CommitteesTableToolbarActions
                handleCreateCommittee={() => handleOpenDialog(dialogsEnum.committee)}
              />
            }
            column={CommitteeHeaders.NAME}
          />
          <CommitteeDialog
            open={open === dialogsEnum.committee}
            handleOpenDialog={handleOpenDialog}
            handleSave={handleSaveCommittee}
          />
        </div>
        {/* </LoadingLayout> */}
      </PageLayout>
    </AuthenticatedPage>
  );
}

const Header = () => {
  const { data: countData, isLoading } = api.committee.groupByActivity.useQuery();

  const { active_count, total_count } = _formatCount(isLoading, countData);

  return (
    <>
      <Accordion className="mb-6" type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <TitleLayout>Órgãos Colegiados</TitleLayout>
          </AccordionTrigger>
          <AccordionContent className="tracking-wide">
            <strong>Órgãos: </strong>
            {total_count}
            <Dot />
            <strong>Órgãos ativos: </strong>
            {active_count}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};
