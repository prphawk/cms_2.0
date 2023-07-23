import { useRouter } from 'next/router';
import AuthenticatedPage from '~/components/authenticated-page';
import PageLayout, { TitleLayout } from '~/layout';
import { PropsWithChildren } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { api } from '~/utils/api';
import { _isNumeric, _toLocaleString } from '~/utils/string';
import { DataTable } from '~/components/table/data-table';
import { MembershipHeaders } from '~/constants/headers';
import { getCommitteeRoleHistoryColumns } from '~/components/table/role-history/role-history-columns';

export default function CommitteeRoleHistory() {
  const router = useRouter();

  const param_id = router.query.id;
  const param_role = router.query.role;

  const roleName = param_role as string;

  const { data: committeeData } = api.committee.getRoleHistory.useQuery({
    //TODO useMemo
    committee_id: Number(param_id),
    role: roleName,
  });

  return (
    <AuthenticatedPage>
      <PageLayout>
        <div className="container my-10 mb-auto text-white ">
          {committeeData && (
            <>
              <HistoryDetails title={`Órgão Colegiado ${committeeData.name}: "${roleName}"`}>
                something something
              </HistoryDetails>
              <DataTable
                //isLoading={isLoading}
                data={committeeData.members || []}
                columns={getCommitteeRoleHistoryColumns()}
                // tableFilters={<TableToolbarFilter {...propsFilters} />}
                // tableActions={<MembershipTableToolbarActions {...propsActions} />}
                column={MembershipHeaders.NAME}
              />
            </>
          )}
        </div>
      </PageLayout>
    </AuthenticatedPage>
  );
}

export const HistoryDetails = (
  props: { title: string; isLoading?: boolean } & PropsWithChildren,
) => {
  return (
    <Accordion className="mb-6" type="single" defaultValue="item-1" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <TitleLayout>{props.isLoading ? 'Loading' : props.title}</TitleLayout>
        </AccordionTrigger>
        <AccordionContent className="tracking-wide">{props.children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
