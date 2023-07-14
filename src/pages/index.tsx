import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { TextLayout } from '~/layout';
import { AuthButton, LoginComponent } from '~/components/login';
import { DecorativeButton } from '~/components/button';
import { Routes } from '~/constants/routes';
import LoadingLayout from '~/components/loading-layout';

export default function Home() {
  const { status } = useSession();

  return (
    <>
      <Head>
        <title>CMS 2.0</title>
        <meta name="description" content="Committee Management System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#6d0202] to-[#15162c]">
        {status === 'loading' ? (
          <LoadingLayout />
        ) : status === 'unauthenticated' ? (
          <LoginComponent />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3">
            <TextLayout>Home?</TextLayout>
            <AuthButton />
            <Link href={Routes.COMMITEES}>
              <DecorativeButton>Committee</DecorativeButton>
            </Link>
            <Link href={Routes.EMPLOYEES}>
              <DecorativeButton>Employees</DecorativeButton>
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
