import { useRouter } from 'next/router';
import AuthenticatedPage from '~/components/authenticated-page';
import PageLayout, { TitleLayout } from '~/layout';
import { api } from '~/utils/api';
import { _isNumeric, _toLocaleString } from '~/utils/string';
import { DataTable } from '~/components/table/data-table';
import { MembershipHeaders } from '~/constants/headers';
import { getTemplateRoleHistoryColumns } from '~/components/table/role-history/role-history-columns';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { PropsWithChildren } from 'react';

export default function TemplateRoleHistory() {
  const router = useRouter();

  const template_id = Number(router.query.id);
  const role = router.query.role as string;

  const { data } = api.membership.getRoleHistory.useQuery({
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
    template_id: props.template_id,
  });
  return (
    <HistoryDetails isLoading={isLoading} title={`Classe ${data?.name}: "${props.role}"`}>
      Something something
    </HistoryDetails>
  );
};
//todo arrumar essa historia aqui
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
