import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import { Routes } from '~/constants/routes';
import LoadingPage from '../loading-page';

export default function AuthenticatedPage(props: PropsWithChildren) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <LoadingPage />;
  } else if (status === 'unauthenticated') {
    router.replace(Routes.SIGN_IN);
    return <></>;
  }

  return <>{props.children}</>;
}
