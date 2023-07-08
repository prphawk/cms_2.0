import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { TextLayout } from '~/components/layout';
import { AuthButton, LoginComponent } from '~/components/login';

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
          <h3>Loading, please wait...</h3>
        ) : status === 'unauthenticated' ? (
          <LoginComponent />
        ) : (
          <div>
            <TextLayout>Home?</TextLayout>
            <AuthButton />
          </div>
        )}
      </main>
    </>
  );
}
