import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { PropsWithChildren } from 'react'
import AuthenticatedPage from '~/components/authenticated-page'
import { CMS, SignOutButton } from '~/components/top-navigation'
import { MyHeaders } from '~/constants/headers'
import { Routes } from '~/constants/routes'
import { LoadingElement } from '~/layouts/loading-layout'
import { ContentLayout } from '~/layouts/page-layout'

export default function Home() {
  const { status } = useSession()
  const components = [
    {
      title: MyHeaders.COMMITTEES,
      href: Routes.COMMITTEES,
      className: 'border-b-[1px] border-r-[1px] rounded-br-lg'
    },
    {
      title: MyHeaders.EMPLOYEES,
      href: Routes.EMPLOYEES,
      className: 'border-b-[1px] border-l-[1px] rounded-bl-lg'
    },
    {
      title: MyHeaders.TEMPLATES_MENU,
      href: Routes.TEMPLATES,
      className: 'border-t-[1px] border-r-[1px] rounded-tr-lg p-1'
    },
    {
      title: MyHeaders.ABOUT,
      href: Routes.ABOUT,
      className: 'border-l-[1px] border-t-[1px] rounded-tl-lg p-1'
    }
  ]
  return (
    <AuthenticatedPage hideTopNav>
      <ContentLayout className="flex h-full w-[550px] flex-col justify-center p-10">
        {status == 'loading' ? (
          <LoadingElement />
        ) : (
          <div className=" flex h-[80vh] flex-col items-center gap-y-4 border-2 border-solid border-[#ffffff4f] py-[8vh]">
            <div className="my-[6vh]">
              <CMS className="text-[48px]" />
              <hr className="mx-3 mt-1 border-[#ffffff4f]" />
            </div>
            <div className="mb-4 mt-auto grid grid-cols-2 p-4 pt-4">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                  className={component.className}
                />
              ))}
            </div>
            <SignOutButton className="mx-auto mt-auto pt-8" />
          </div>
        )}
      </ContentLayout>
    </AuthenticatedPage>
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
