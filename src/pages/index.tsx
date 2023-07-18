import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import PageLayout, { TextLayout } from '~/layout';
import { AuthButton, LoginComponent } from '~/components/login';
import { DecorativeButton } from '~/components/button';
import { Routes } from '~/constants/routes';
import LoadingLayout from '~/components/loading-layout';
import AuthenticatedPage from '~/components/authenticated-page';

export default function Home() {
  const { status } = useSession();

  return (
    <>
      <Head>
        <title>CMS 2.0</title>
        <meta name="description" content="Committee Management System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthenticatedPage>
        <PageLayout>
          <LoadingLayout loading={status === 'loading'}>
            <div className="flex flex-col items-center justify-center gap-3">
              <TextLayout>Home?</TextLayout>
              <AuthButton />
              <Link href={Routes.COMMITTEES}>
                <DecorativeButton>Committee</DecorativeButton>
              </Link>
              <Link href={Routes.EMPLOYEES}>
                <DecorativeButton>Employees</DecorativeButton>
              </Link>
            </div>
          </LoadingLayout>
        </PageLayout>
      </AuthenticatedPage>
    </>
  );
}
