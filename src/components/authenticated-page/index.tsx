import { useSession, getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { PropsWithChildren } from 'react'
import { Routes } from '~/constants/routes'
import LoadingLayout from '../loading-layout'
import PageLayout from '~/layout'
import { MyButton } from '../button'
import { Button } from '@/components/ui/button'
import { Headers } from '~/constants/headers'
import { ArrowLeftIcon, Dot, LogOutIcon } from 'lucide-react'

export default function AuthenticatedPage(props: PropsWithChildren) {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <PageLayout>
        <LoadingLayout />
      </PageLayout>
    )
  } else if (status === 'unauthenticated') {
    router.replace(Routes.SIGN_IN)
    return <></>
  }

  return (
    <PageLayout>
      <div className="container m-auto flex h-[4rem] w-full flex-row items-center rounded-b-xl bg-gray-800/30 p-6 tracking-wide text-white drop-shadow-md">
        <ArrowLeftIcon className="mr-2 h-6 w-6" />
        <h1 className="mx-4 text-[1.5rem] font-extrabold">CMS 2.0</h1>
        <div className="ml-4 flex flex-row items-center space-x-2 pt-[4px]">
          <a className="text-sm uppercase tracking-wider hover:underline " href={Routes.COMMITTEES}>
            {Headers.COMMITTEES}
          </a>
          <Dot className="p-1" />
          <a className="text-sm uppercase tracking-wider hover:underline" href={Routes.EMPLOYEES}>
            {Headers.EMPLOYEES}
          </a>
          <Dot className="p-1" />
          <a className="text-sm uppercase tracking-wider hover:underline" href={Routes.SETTINGS}>
            Configurações
          </a>
        </div>
        <div className="ml-auto flex flex-row items-center">
          <a className="mr-4 text-sm font-thin uppercase hover:underline" href={Routes.SETTINGS}>
            Sign Out
          </a>
          <LogOutIcon />
        </div>
      </div>
      {props.children}
    </PageLayout>
  )
}
