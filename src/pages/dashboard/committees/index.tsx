import AuthenticatedPage from '~/components/authenticated-page';
import LoadingLayout from '~/components/loading-layout';
import { getCommitteesColumns } from '~/components/table/committees/committees-columns';
import { DataTable } from '~/components/table/data-table';
import PageLayout, { TitleLayout } from '~/layout';
import { api } from '~/utils/api';
import { useState } from 'react';
import { TableToolbarFilter } from '../../../components/table/data-table-toolbar';
import { useRouter } from 'next/router';
import { Routes } from '~/constants/routes';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { _toLocaleString } from '~/utils/string';
import { Dot } from '~/components/dot';
import CommitteesTableToolbarActions from '~/components/table/committees/committees-toolbar-actions';

export default function Committees() {
  const router = useRouter();
  const [filters, setFilters] = useState<{ is_active?: boolean; is_temporary?: boolean }>();
  const [filterLabelsA, setFilterLabelsA] = useState<string[]>([]);
  const [filterLabelsT, setFilterLabelsT] = useState<string[]>([]);

  const utils = api.useContext();

  const { data, isFetching, isLoading, isError } = api.committee.getAll.useQuery({
    //TODO useMemo
    is_active: filters?.is_active,
    is_temporary: filters?.is_temporary,
  });

  const deactivate = api.committee.deactivate.useMutation({
    onMutate() {
      return utils.committee.getAll.cancel();
    },
    // TODO onError
    onSettled(data) {
      console.log(data);
      return utils.committee.getAll.invalidate();
    },
  });

  function handleDeactivateCommittees(ids: number[]) {
    ids.forEach((id) => deactivate.mutate({ id }));
  }

  function handleViewCommittee(id: number) {
    router.push(`${Routes.COMMITTEES}/${id}`);
  }

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

  if (isError || deactivate.isError) {
    return <span>Error: sowwyyyy</span>;
  }

  const filterProps = {
    _setIsTemporaryFilterValues,
    _setIsActiveFilterValues,
    isActiveFilters: filterLabelsA,
    isTemporaryFilters: filterLabelsT,
  };
  const actionProps = {
    handleCreateCommittee: () => {},
  };

  return (
    <AuthenticatedPage>
      <PageLayout>
        {/* <LoadingLayout loading={isLoading}> */}
        <div className="committees container my-10 mb-auto text-white ">
          <Header />
          <DataTable
            data={data || []}
            isLoading={isFetching || isLoading}
            columns={getCommitteesColumns(handleDeactivateCommittees, handleViewCommittee)}
            tableFilters={<TableToolbarFilter {...filterProps} />}
            tableActions={<CommitteesTableToolbarActions {...actionProps} />}
          />
        </div>
        {/* </LoadingLayout> */}
      </PageLayout>
    </AuthenticatedPage>
  );
}

const Header = () => {
  const { data: countData, isLoading } = api.committee.groupByActivity.useQuery();

  const { active_count, total_count } = formatCount(isLoading, countData);

  return (
    <>
      <Accordion className="mb-6" type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <TitleLayout>Órgãos Colegiados</TitleLayout>
          </AccordionTrigger>
          <AccordionContent className="tracking-wide">
            <strong>Órgãos ativos: </strong>
            {active_count}
            <Dot />
            <strong>Órgãos: </strong>
            {total_count}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export const formatCount = (
  isLoading: boolean,
  data: any[] | undefined,
): { active_count: string; total_count: string } => {
  let active, inactive;
  if (isLoading || !data) active = inactive = 0;
  else {
    active = data.at(0)._count.is_active;
    inactive = data.at(1)._count.is_active;
  }
  return { active_count: active || 'Loading...', total_count: active + inactive || 'Loading...' };
};
