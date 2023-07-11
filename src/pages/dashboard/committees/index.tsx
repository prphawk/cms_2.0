import AuthenticatedPage from '~/components/authenticated-page';
import PageLayout, { TextLayout } from '~/layout';

export default function Committees() {
  return (
    <AuthenticatedPage>
      <PageLayout>
        <TextLayout>
          <h3>Committees page!</h3>
        </TextLayout>
      </PageLayout>
    </AuthenticatedPage>
  );
}
