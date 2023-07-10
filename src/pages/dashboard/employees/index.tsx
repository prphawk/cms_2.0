import AuthenticatedPage from '~/components/authenticated-page';
import Layout, { TextLayout } from '~/layout';

export default function Employees() {
  return (
    <AuthenticatedPage>
      <Layout>
        <TextLayout>
          <h3>Employees page!</h3>
        </TextLayout>
      </Layout>
    </AuthenticatedPage>
  );
}
