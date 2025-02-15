import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { PropsWithChildren } from 'react'
import { Routes } from '~/constants/routes'
import PageLayout from '~/layouts/page-layout'
import { TopNavigation } from '../top-navigation'
import LoadingLayout from '~/layouts/loading-layout'
import { Footer } from '../footer'

export default function AuthenticatedPage(props: PropsWithChildren & { hideTopNav?: boolean }) {
  const { status } = useSession()
  const router = useRouter()

  if (status === 'unauthenticated') {
    router.replace(Routes.SIGN_IN)
    return <></>
  }

  return (
    <PageLayout>
      {!props.hideTopNav && <TopNavigation />}
      <LoadingLayout isLoading={status === 'loading'}>{props.children}</LoadingLayout>
      {!props.hideTopNav && <Footer />}
    </PageLayout>
  )
}
