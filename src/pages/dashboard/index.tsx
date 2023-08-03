import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { Head } from 'next/document'
import { PropsWithChildren } from 'react'
import { LoadingElement } from '~/components/loading-layout'
import { CMS, SignOutButton } from '~/components/top-navigation'
import { MyHeaders } from '~/constants/headers'
import { Routes } from '~/constants/routes'
import PageLayout, { ContentLayout, TextLayout } from '~/layout'

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
      title: MyHeaders.TEMPLATES,
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
    <PageLayout>
      <ContentLayout className="flex w-[80vh] flex-col items-center justify-center">
        {status == 'loading' ? (
          <LoadingElement />
        ) : (
          <>
            <div className="mt-4">
              <CMS />
              {/* <hr className="mx-3 mt-1 border-[#ffffff4f]" /> */}
            </div>
            <TextLayout className="mb-2 mt-16 text-[5rem] font-extrabold">Home</TextLayout>
            <div className="mb-6 mt-5 grid grid-cols-2 p-4">
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
          </>
        )}
      </ContentLayout>
    </PageLayout>
  )
}

const ListItem = ({
  className,
  title,
  href
}: {
  className?: string
  title: string
  href: string
} & PropsWithChildren) => {
  return (
    <a
      href={href}
      className={cn(
        'h-[72px] w-[170px] bg-transparent text-white no-underline transition hover:bg-white/10',
        'my-auto flex select-none border-[#ffffff4f] font-bold',
        className
      )} //outline outline-1 outline-offset-8  space-y-1 rounded-md bg-transparent p-3 leading-none transition-colors no-underline hover:bg-background/10 focus:bg-background/20
    >
      <div className="m-auto text-center align-middle text-xl tracking-tight text-white">
        {title}
      </div>
      {/* <p className="line-clamp-2 leading-snug text-muted-foregroundPage">{children}</p> */}
    </a>
  )
}
