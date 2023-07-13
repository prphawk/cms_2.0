import AuthenticatedPage from '~/components/authenticated-page';
import PageLayout, { TextLayout } from '~/layout';
import { api } from '~/utils/api';

export default function Committees() {
  const { data, isLoading, isError } = api.committee.getAllActive.useQuery();

  if (isError) {
    return <span>Error: sowwyyyy</span>;
  }

  return (
    <AuthenticatedPage>
      <PageLayout></PageLayout>
    </AuthenticatedPage>
  );
}
