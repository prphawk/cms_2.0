import { useRouter } from 'next/router';
import AuthenticatedPage from '~/components/authenticated-page';
import PageLayout, { TextLayout } from '~/layout';

export default function Committee() {
  const router = useRouter();
  return (
    <AuthenticatedPage>
      <PageLayout>
        <TextLayout>{router.query.id}</TextLayout>
      </PageLayout>
    </AuthenticatedPage>
  );
}
