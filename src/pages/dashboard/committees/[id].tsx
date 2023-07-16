import { useRouter } from 'next/router';
import AuthenticatedPage from '~/components/authenticated-page';
import PageLayout, { TextLayout } from '~/layout';
import { api } from '~/utils/api';

export default function Committee() {
  const router = useRouter();
  const param_id = router.query.id;
  const { data, isFetching, isLoading, isError } = api.committee.getOne.useQuery(
    {
      //TODO useMemo
      id: Number(param_id),
    },
    { enabled: !(!param_id || Number.isNaN(Number(param_id))) },
  );
  return (
    <AuthenticatedPage>
      <PageLayout>
        <TextLayout>
          {data?.members.map((e) => (
            <>{e.role}</>
          ))}
        </TextLayout>
      </PageLayout>
    </AuthenticatedPage>
  );
}
