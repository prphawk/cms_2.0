import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Routes } from '~/constants/routes'
import PageLayout, { ContentLayout } from '~/layouts/page-layout'

export default function ErrorPage() {
  const [counter, setCounter] = useState(4)
  const router = useRouter()

  useEffect(() => {
    if (!counter) router.replace(Routes.AUTHENTICATED)
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000)
  }, [counter])

  return (
    <PageLayout>
      <ContentLayout className="my-auto flex h-[80vh] w-[50vw] flex-col items-center justify-center text-center text-2xl font-bold">
        <div>
          Opa! Esta página não existe.
          <hr className="my-4 border-[1px] border-[#ffffff4f]" />
        </div>
        Redirecionando em {counter}...
      </ContentLayout>
    </PageLayout>
  )
}
