import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout, { TextLayout } from '~/components/layout';

export default function Committees() {
  const { status } = useSession();
  const router = useRouter();

  if (status == 'unauthenticated') router.push('/');

  return (
    <Layout>
      <TextLayout>
        <h3>Committees page!</h3>
      </TextLayout>
    </Layout>
  );
}
