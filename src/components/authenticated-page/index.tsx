import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { PropsWithChildren } from 'react'
import { Routes } from '~/constants/routes'
import LoadingLayout from '../loading-layout'
import PageLayout from '~/layout'
import { TopNavigation } from '../top-navigation'
import { MyHeaders } from '~/constants/headers'
import { Dot } from '../dot'

export default function AuthenticatedPage(props: PropsWithChildren) {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <PageLayout>
        <TopNavigation />
        <LoadingLayout />
      </PageLayout>
    )
  } else if (status === 'unauthenticated') {
    router.replace(Routes.SIGN_IN)
    return <></>
  }

  return (
    <PageLayout>
      <TopNavigation />
      <div className="flex flex-row gap-x-8">
        {/* <LeftNavigation /> */}
        {props.children}
      </div>
    </PageLayout>
  )
}

const LeftNavigation = () => {
  return (
    <div className="mt-6 flex h-min flex-col space-x-2 space-y-4 rounded-xl bg-[--table-background] p-4 text-white shadow-lg">
      <a className="font-semibold tracking-wider hover:underline" href={Routes.COMMITTEES}>
        {MyHeaders.COMMITTEES}
      </a>
      <a className=" font-semibold tracking-wider hover:underline" href={Routes.EMPLOYEES}>
        {MyHeaders.EMPLOYEES}
      </a>
      <a className=" font-semibold tracking-wider hover:underline" href={Routes.TEMPLATES}>
        {MyHeaders.TEMPLATES}
      </a>
      <a className="font-semibold tracking-wider hover:underline" href={Routes.SETTINGS}>
        Configurações
      </a>
    </div>
  )
}
