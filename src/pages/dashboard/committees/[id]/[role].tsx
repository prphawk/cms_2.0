import { useRouter } from 'next/router';
import AuthenticatedPage from '~/components/authenticated-page';
import PageLayout, { TextLayout } from '~/layout';

export default function CommitteeRoleHistory() {
  const router = useRouter();

  const param_id = router.query.id;
  return (
    <AuthenticatedPage>
      <PageLayout>
        <TextLayout>
          {router.query.id} / {router.query.role}
        </TextLayout>
      </PageLayout>
    </AuthenticatedPage>
  );
}
