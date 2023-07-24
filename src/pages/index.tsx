import { useSession } from 'next-auth/react';
import Head from 'next/head';
import PageLayout, { TextLayout } from '~/layout';
import { AuthButton } from '~/components/login';
import { Routes } from '~/constants/routes';
import LoadingLayout from '~/components/loading-layout';
import AuthenticatedPage from '~/components/authenticated-page';
import React from 'react';
import { cn } from '@/lib/utils';

export default function Home() {
  const { status } = useSession();

  const components = [
    {
      title: 'Comissões',
      href: Routes.COMMITTEES,
      description:
        'A modal dialog that interrupts the user with important content and expects a response.',
    },
    {
      title: 'Servidores',
      href: Routes.EMPLOYEES,
      description:
        'A modal dialog that interrupts the user with important content and expects a response.',
    },
    {
      title: 'Classes',
      href: Routes.TEMPLATES,
      description:
        'A modal dialog that interrupts the user with important content and expects a response.',
    },
    {
      title: 'Configurações',
      href: Routes.SETTINGS,
      description:
        'A modal dialog that interrupts the user with important content and expects a response.',
    },
  ];
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
            <TextLayout>Home</TextLayout>
            <div className="grid grid-cols-2 gap-4 p-4 ">
              {components.map((component) => (
                <ListItem key={component.title} title={component.title} href={component.href}>
                  {component.description}
                </ListItem>
              ))}
            </div>
            <AuthButton />
          </LoadingLayout>
        </PageLayout>
      </AuthenticatedPage>
    </>
  );
}

const ListItem = ({
  className,
  title,
  children,
  href,
}: {
  className?: string;
  title: string;
  children: any;
  href: string;
}) => {
  return (
    <a
      href={href}
      className={cn(
        'w-64',
        'rounded-lg bg-transparent px-5 py-3 font-semibold text-white no-underline transition hover:bg-white/10',
        'block select-none font-light outline outline-1 outline-[#ffffff4f]',
        className,
      )} //space-y-1 rounded-md bg-transparent p-3 leading-none transition-colors no-underline hover:bg-background/10 focus:bg-background/20
    >
      <div className="mb-5 text-2xl leading-none tracking-normal text-white">{title}</div>
      <p className="line-clamp-2 leading-snug text-muted-foregroundPage">{children}</p>
    </a>
  );
};
