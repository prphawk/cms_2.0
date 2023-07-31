import { useSession } from 'next-auth/react'
import Head from 'next/head'
import PageLayout from '~/layout'
import { Routes } from '~/constants/routes'
import React from 'react'
import { useRouter } from 'next/router'

export default function Main() {
  const { status } = useSession()
  const router = useRouter()

  if (status === 'authenticated') {
    router.replace(Routes.AUTHENTICATED)
  } else if (status === 'unauthenticated') {
    router.replace(Routes.SIGN_IN)
  }

  return (
    <>
      <Head>
        <title>CMS 2.0</title>
        <meta name="description" content="Committee Management System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout />
    </>
  )
}
