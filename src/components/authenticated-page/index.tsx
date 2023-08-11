import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { PropsWithChildren } from 'react'
import { Routes } from '~/constants/routes'
import PageLayout from '~/layouts/page-layout'
import { TopNavigation } from '../top-navigation'
import LoadingLayout from '~/layouts/loading-layout'

export default function AuthenticatedPage(props: PropsWithChildren) {
  const { status } = useSession()
  const router = useRouter()

  if (status === 'unauthenticated') {
    router.replace(Routes.SIGN_IN)
    return <></>
  }

  return (
    <PageLayout>
      <TopNavigation />
      <LoadingLayout isLoading={status === 'loading'}>{props.children}</LoadingLayout>
    </PageLayout>
  )
}
