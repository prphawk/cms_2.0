import { useSession } from 'next-auth/react'
import Head from 'next/head'
import PageLayout, { TextLayout } from '~/layout'
import { AuthButton } from '~/components/login'
import { Routes } from '~/constants/routes'
import LoadingLayout from '~/components/loading-layout'
import React from 'react'
import { cn } from '@/lib/utils'
import { MyHeaders } from '~/constants/headers'

export default function Home() {
  const { status } = useSession()

  const components = [
    {
      title: MyHeaders.COMMITTEES,
      href: Routes.COMMITTEES,
      description: 'Coisas muito legais relacionadas as órgãos colegiados e comissões do INF.'
    },
    {
      title: MyHeaders.EMPLOYEES,
      href: Routes.EMPLOYEES,
      description: 'Under construction.'
    },
    {
      title: 'Tipos',
      href: Routes.TEMPLATES,
      description: 'Under construction.'
    },
    {
      title: 'Configurações',
      href: Routes.SETTINGS,
      description: 'Under construction.'
    }
  ]
  return (
    <>
      <Head>
        <title>CMS 2.0</title>
        <meta name="description" content="Committee Management System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <LoadingLayout loading={status === 'loading'}>
          <TextLayout className="text-[5rem] font-extrabold">Home</TextLayout>
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
    </>
  )
}

const ListItem = ({
  className,
  title,
  children,
  href
}: {
  className?: string
  title: string
  children: any
  href: string
}) => {
  return (
    <a
      href={href}
      className={cn(
        'w-64',
        'rounded-lg bg-transparent px-5 py-3 font-semibold text-white no-underline transition hover:bg-white/10',
        'block select-none font-light outline outline-1 outline-[#ffffff4f]',
        className
      )} //space-y-1 rounded-md bg-transparent p-3 leading-none transition-colors no-underline hover:bg-background/10 focus:bg-background/20
    >
      <div className="mb-5 text-2xl leading-none tracking-normal text-white">{title}</div>
      <p className="line-clamp-2 leading-snug text-muted-foregroundPage">{children}</p>
    </a>
  )
}
