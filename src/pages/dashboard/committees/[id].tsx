import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/router';
import { useState } from 'react';
import AuthenticatedPage from '~/components/authenticated-page';
import { getColumns } from '~/components/table/committee/columns';
import { DataTableToolbarFilter } from '~/components/table/committees/data-table-toolbar';
import { DataTable } from '~/components/table/data-table';
import PageLayout, { TextLayout, TitleLayout } from '~/layout';
import { api } from '~/utils/api';
import { _isNumeric } from '~/utils/string';

export default function Committee() {
  const router = useRouter();
  const param_id = router.query.id;
  const { data, isFetching, isLoading, isError } = api.committee.getOne.useQuery(
    {
      //TODO useMemo
      id: Number(param_id),
      // is_active: filters?.is_active,
      // is_temporary: filters?.is_temporary,
    },
    { enabled: _isNumeric(param_id) },
  );

  const [filters, setFilters] = useState<{ is_active?: boolean; is_temporary?: boolean }>();
  const [filterLabelsA, setFilterLabelsA] = useState<string[]>([]);
  const [filterLabelsT, setFilterLabelsT] = useState<string[]>([]);

  const utils = api.useContext();

  //   const deactivate = api.committee.deactivate.useMutation({
  //     onMutate() {
  //       return utils.committee.getAll.cancel();
  //     },
  //     // TODO onError
  //     onSettled(data) {
  //       console.log(data);
  //       return utils.committee.getAll.invalidate();
  //     },
  //   });

  //   function handleDeactivateCommittees(ids: number[]) {
  //     ids.forEach((id) => deactivate.mutate({ id }));
  //   }

  //   function handleViewCommittee(id: number) {
  //     router.push(`${Routes.COMMITTEES}/${id}`);
  //   }

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

  const props = {
    _setIsTemporaryFilterValues,
    _setIsActiveFilterValues,
    isActiveFilters: filterLabelsA,
    isTemporaryFilters: filterLabelsT,
  };
  return (
    <AuthenticatedPage>
      <PageLayout>
        <div className="committee container my-10 mb-auto text-white ">
          <Accordion className="mb-4" type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <TitleLayout>{data?.name}</TitleLayout>
              </AccordionTrigger>
              <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
            </AccordionItem>
          </Accordion>

          <DataTable
            data={data?.members || []}
            isLoading={isFetching || isLoading}
            columns={getColumns()}
          >
            <DataTableToolbarFilter {...props} />
          </DataTable>
        </div>
      </PageLayout>
    </AuthenticatedPage>
  );
}
