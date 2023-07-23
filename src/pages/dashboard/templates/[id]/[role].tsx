import { useRouter } from 'next/router';
import AuthenticatedPage from '~/components/authenticated-page';
import PageLayout, { TitleLayout } from '~/layout';
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
import { getTemplateRoleHistoryColumns } from '~/components/table/role-history/role-history-columns';
import { HistoryDetails } from '../../committees/[id]/[role]';

export default function TemplateRoleHistory() {
  const router = useRouter();

  const template_id = Number(router.query.id);
  const role = router.query.role as string;

  const { data } = api.membership.getRoleHistory.useQuery({
    //TODO useMemo
    template_id,
    role,
  });

  return (
    <AuthenticatedPage>
      <PageLayout>
        <div className="committee container my-10 mb-auto text-white ">
          {data && (
            <>
              <TemplateHistoryDetails {...{ template_id, role }} />
              <DataTable
                //isLoading={isLoading}
                data={data || []}
                columns={getTemplateRoleHistoryColumns()}
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

const TemplateHistoryDetails = (props: { template_id: number; role: string }) => {
  const { data, isLoading } = api.template.getOne.useQuery({
    //TODO useMemo
    template_id: props.template_id,
  });
  return (
    <HistoryDetails isLoading={isLoading} title={`Classe ${data?.name}: "${props.role}"`}>
      Something something
    </HistoryDetails>
  );
};
