import AuthenticatedPage from '~/components/authenticated-page';
import LoadingLayout from '~/components/loading-page';
import PageLayout, { TextLayout } from '~/layout';
import { api } from '~/utils/api';

export default function Employees() {
  const { data, isLoading } = api.employee.getAll.useQuery();

  return (
    <AuthenticatedPage>
      {/* TODO use suspense here while it loads? */}
      <PageLayout>
        <LoadingLayout loading={isLoading}>
          <div>
            <TextLayout>
              <h3>Employees page!</h3>
            </TextLayout>
            {data?.map((e) => (
              <div>
                Employee: {e.name} - Committees:{' '}
                {e.committees.map((c) => c.committee.name).toString()}
              </div>
            ))}
          </div>
        </LoadingLayout>
      </PageLayout>
    </AuthenticatedPage>
  );
}
