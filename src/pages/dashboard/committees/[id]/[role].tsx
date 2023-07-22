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
import { DoubleDataTable } from '~/components/table/double-data-table';

export default function CommitteeRoleHistory() {
  const router = useRouter();

  const param_id = router.query.id;
  const param_role = router.query.role;

  const role = param_role as string;

  const { data: committeeTemplateData } = api.template.getOneByCommittee.useQuery({
    //TODO useMemo
    committee_id: Number(param_id),
  });

  return (
    <AuthenticatedPage>
      <PageLayout>
        <div className="committee container my-10 mb-auto text-white ">
          {committeeTemplateData ? (
            <TemplateRoleHistory param_role={param_role} />
          ) : (
            <TemporaryCommitteeRoleHistory param_committee_id={param_id} param_role={param_role} />
          )}
        </div>
      </PageLayout>
    </AuthenticatedPage>
  );
}

const TemplateRoleHistory = (props: {
  param_role?: string | string[];
  committeeTemplateData?: {
    id: number;
    name: string;
    committees: { id: number }[];
  };
}) => {
  const roleName = props.param_role as string;

  return (
    <>
      <HistoryDetails
        title={`HISTÓRICO DE CLASSE: ${props.committeeTemplateData?.name} - ${roleName}`}
      />

      <DoubleDataTable
        //isLoading={isLoading}
        data={[]}
        columns={getRoleHistoryColumns()}
        // tableFilters={<TableToolbarFilter {...propsFilters} />}
        // tableActions={<MembershipTableToolbarActions {...propsActions} />}
        column={MembershipHeaders.NAME}
      />
    </>
  );
};

const TemporaryCommitteeRoleHistory = (props: {
  param_committee_id?: string | string[];
  param_role?: string | string[];
}) => {
  const roleName = props.param_role as string;

  const { data: committeeData, isLoading } = api.membership.getRoleHistory.useQuery(
    {
      //TODO useMemo
      committee_id: Number(props.param_committee_id),
      role: roleName,
    },
    { enabled: _isNumeric(props.param_committee_id) && typeof props.param_role === 'string' },
  );

  const committeeName = committeeData?.length ? committeeData.at(0)?.committee.name || '' : '';

  return (
    <>
      <HistoryDetails title={`HISTÓRICO DE COMISSÃO: ${committeeName} - ${roleName}`} />
      <DataTable
        //isLoading={isLoading}
        data={committeeData || []}
        columns={getRoleHistoryColumns()}
        // tableFilters={<TableToolbarFilter {...propsFilters} />}
        // tableActions={<MembershipTableToolbarActions {...propsActions} />}
        column={MembershipHeaders.NAME}
      />
    </>
  );
};

const HistoryDetails = (props: { title: string }) => {
  return (
    <Accordion className="mb-6" type="single" defaultValue="item-1" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <TitleLayout>{props.title}</TitleLayout>
        </AccordionTrigger>
        <AccordionContent className="tracking-wide">Something something</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
