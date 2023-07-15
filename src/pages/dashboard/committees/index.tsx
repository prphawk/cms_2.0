import AuthenticatedPage from '~/components/authenticated-page';
import LoadingLayout from '~/components/loading-layout';
import { columns } from '~/components/table/committees/columns';
import { DataTable } from '~/components/table/data-table';
import PageLayout, { TextLayout } from '~/layout';
import { api } from '~/utils/api';
import { useState } from 'react';
import { DataTableToolbarFilter } from '../../../components/table/committees/data-table-toolbar';

export default function Committees() {
  const [filters, setFilters] = useState<{ is_active?: boolean; is_temporary?: boolean }>();
  const [filterLabelsA, setFilterLabelsA] = useState<string[]>([]);
  const [filterLabelsT, setFilterLabelsT] = useState<string[]>([]);

  const { data, isLoading, isError } = api.committee.getAll.useQuery({
    is_active: filters?.is_active,
    is_temporary: filters?.is_temporary,
  });

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

  if (isError) {
    return <span>Error: sowwyyyy</span>;
  }

  const props = {
    _setIsTemporaryFilterValues,
    _setIsActiveFilterValues,
    isActiveFilters: filterLabelsA,
    isTemporaryFilters: filterLabelsT,
  };

  return (
    <AuthenticatedPage>
      <PageLayout>
        {/* <LoadingLayout loading={isLoading}> */}
        <div className="committee container my-10 mb-auto text-white ">
          <DataTable columns={columns} data={data || []} isLoading={isLoading}>
            <DataTableToolbarFilter {...props} />
          </DataTable>
        </div>
        {/* </LoadingLayout> */}
      </PageLayout>
    </AuthenticatedPage>
  );
}
