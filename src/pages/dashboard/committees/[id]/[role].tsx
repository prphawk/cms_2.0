import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/router';
import { Label } from '@/components/ui/label';
import AuthenticatedPage from '~/components/authenticated-page';
import PageLayout, { TextLayout, TitleLayout } from '~/layout';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Committee, Membership } from '@prisma/client';
import { Dot } from 'lucide-react';
import { api } from '~/utils/api';
import { _isNumeric, _toLocaleString } from '~/utils/string';
import { formatCount } from '..';
import { DataTable } from '~/components/table/data-table';
import { TableToolbarFilter } from '~/components/table/data-table-toolbar';
import { getMembershipColumns } from '~/components/table/membership/membership-columns';
import MembershipTableToolbarActions from '~/components/table/membership/membership-toolbar-actions';
import { MembershipHeaders } from '~/constants/headers';
import { getRoleHistoryColumns } from '~/components/table/role-history/role-history-columns';

export default function CommitteeRoleHistory() {
  const router = useRouter();

  const param_id = router.query.id;
  const param_role = router.query.role;

  const role = param_role as string;

  const { data, isLoading, isError } = api.membership.getRoleHistory.useQuery(
    {
      //TODO useMemo
      committee_id: Number(param_id),
      role,
      // is_active: filters?.is_active,
      // is_temporary: filters?.is_temporary,
    },
    { enabled: _isNumeric(param_id) && typeof param_role === 'string' },
  );

  const committeeName = data?.length
    ? data.at(0)?.committee?.committee_template?.name || data.at(0)?.committee.name || ''
    : '';

  return (
    <AuthenticatedPage>
      <PageLayout>
        <div className="committee container my-10 mb-auto text-white ">
          {data && (
            <>
              <HistoryDetails committee={committeeName} role={role} />
              <DataTable
                //isLoading={isLoading}
                data={data || []}
                columns={getRoleHistoryColumns()}
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

const HistoryDetails = (props: { committee: string; role: string }) => {
  return (
    <Accordion className="mb-6" type="single" defaultValue="item-1" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <TitleLayout>
            HISTÓRICO: {props.committee} - {props.role}
          </TitleLayout>
        </AccordionTrigger>
        <AccordionContent className="tracking-wide">Something something</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
