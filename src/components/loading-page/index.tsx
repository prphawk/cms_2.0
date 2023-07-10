import Layout, { TextLayout } from '~/layout';

export default function LoadingPage() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <Layout>
      <TextLayout>
        <h3>Loading...</h3>
      </TextLayout>
    </Layout>
  );
}
