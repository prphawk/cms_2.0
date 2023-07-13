import AuthenticatedPage from '~/components/authenticated-page';
import LoadingLayout from '~/components/loading-layout';
import { columns } from '~/components/table/columns';
import { DataTable } from '~/components/table/data-table';
import PageLayout, { TextLayout } from '~/layout';
import { api } from '~/utils/api';

export default function Committees() {
  const { data, isLoading, isError } = api.committee.getAllActive.useQuery();

  if (isError) {
    return <span>Error: sowwyyyy</span>;
  }

  return (
    <AuthenticatedPage>
      <PageLayout>
        <LoadingLayout loading={isLoading}>
          <div className="text-white">
            <DataTable columns={columns} data={data!} />
          </div>
        </LoadingLayout>
      </PageLayout>
    </AuthenticatedPage>
  );
}
