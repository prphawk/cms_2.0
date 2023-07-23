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
import { DataTable } from '~/components/table/data-table';
import { TableToolbarFilter } from '~/components/table/data-table-toolbar';
import { getMembershipColumns } from '~/components/table/membership/membership-columns';
import MembershipTableToolbarActions from '~/components/table/membership/membership-toolbar-actions';
import { MembershipHeaders } from '~/constants/headers';
import {
  getCommitteeRoleHistoryColumns,
  getFirstTemplateRoleHistoryColumns,
  getSecondTemplateRoleHistoryColumns,
} from '~/components/table/role-history/role-history-columns';
import { DoubleDataTable } from '~/components/table/double-data-table';
import { getCommitteesColumns } from '~/components/table/committees/committees-columns';

export default function TemplateRoleHistory() {
  const router = useRouter();

  const param_template_id = router.query.id;
  const param_role = router.query.role;

  const roleName = param_role as string;

  const { data: committeeTemplateData } = api.template.getRoleHistory.useQuery({
    //TODO useMemo
    template_id: Number(param_template_id),
    role: roleName,
  });

  return (
    <AuthenticatedPage>
      <PageLayout>
        <div className="committee container my-10 mb-auto text-white ">
          {committeeTemplateData && (
            <>
              <HistoryDetails
                title={`HISTÓRICO DE CLASSE: ${committeeTemplateData.name} - ${roleName}`}
              />
              <DoubleDataTable
                //isLoading={isLoading}
                data={committeeTemplateData.committees || []}
                columns={getFirstTemplateRoleHistoryColumns()}
                secondColumns={getSecondTemplateRoleHistoryColumns()}
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
