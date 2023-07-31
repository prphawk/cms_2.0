import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { PropsWithChildren } from 'react'
import { Routes } from '~/constants/routes'
import LoadingLayout from '../loading-layout'
import PageLayout from '~/layout'
import { TopNavigation } from '../header'

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
      {props.children}
    </PageLayout>
  )
}
