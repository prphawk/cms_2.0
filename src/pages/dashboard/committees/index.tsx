import AuthenticatedPage from '~/components/authenticated-page';
import Layout, { TextLayout } from '~/layout';

export default function Committees() {
  return (
    <AuthenticatedPage>
      <Layout>
        <TextLayout>
          <h3>Committees page!</h3>
        </TextLayout>
      </Layout>
    </AuthenticatedPage>
  );
}
