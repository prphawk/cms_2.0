import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import { Routes } from '~/constants/routes';
import LoadingPage from '../loading-page';
import Layout from '~/layout';

export default function AuthenticatedPage(props: PropsWithChildren) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <Layout>
        <LoadingPage />
      </Layout>
    );
  } else if (status === 'unauthenticated') {
    router.replace(Routes.SIGN_IN);
    return <></>;
  }

  return <>{props.children}</>;
}
