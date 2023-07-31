import { useSession } from 'next-auth/react'
import Head from 'next/head'
import PageLayout, { TableLayout, TextLayout } from '~/layout'
import { AuthButton } from '~/components/login'
import { Routes } from '~/constants/routes'
import LoadingLayout from '~/components/loading-layout'
import React from 'react'
import { cn } from '@/lib/utils'
import { MyHeaders } from '~/constants/headers'
import { CMS, SignOutButton } from '~/components/top-navigation'
import { Separator } from '@/components/ui/separator'

export default function Home() {
  const { status } = useSession()

  const components = [
    {
      title: MyHeaders.COMMITTEES,
      href: Routes.COMMITTEES,
      description: 'Coisas muito legais relacionadas as órgãos colegiados e comissões do INF.',
      className: 'border-b-[1px] border-r-[1px] rounded-br-lg'
    },
    {
      title: MyHeaders.EMPLOYEES,
      href: Routes.EMPLOYEES,
      description: 'Under construction.',
      className: 'border-b-[1px] border-l-[1px] rounded-bl-lg'
    },
    {
      title: 'Tipos',
      href: Routes.TEMPLATES,
      description: 'Under construction.',
      className: 'border-t-[1px] border-r-[1px] rounded-tr-lg'
    },
    {
      title: 'Configurações',
      href: Routes.SETTINGS,
      description: 'Under construction.',
      className: 'border-l-[1px] border-t-[1px] rounded-tl-lg'
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
          <TableLayout className="flex w-[100vh] flex-col items-center justify-center">
            <div className="mt-4">
              <CMS />
              {/* <hr className="mx-3 mt-1 border-[#ffffff4f]" /> */}
            </div>
            <TextLayout className="mt-16 text-[5rem] font-extrabold">Home</TextLayout>
            <div className="mb-6 mt-4 grid grid-cols-2 p-4">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                  className={component.className}
                >
                  {component.description}
                </ListItem>
              ))}
            </div>
            <SignOutButton className="mx-auto mt-8" />
          </TableLayout>
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
        'h-24 w-48 bg-transparent px-5 py-3 text-white no-underline transition hover:bg-white/10',
        'my-auto flex select-none border-[#ffffff4f]',
        className
      )} //outline outline-1 outline-offset-8  space-y-1 rounded-md bg-transparent p-3 leading-none transition-colors no-underline hover:bg-background/10 focus:bg-background/20
    >
      <div className="m-auto text-center align-middle text-xl text-white">{title}</div>
      {/* <p className="line-clamp-2 leading-snug text-muted-foregroundPage">{children}</p> */}
    </a>
  )
}
