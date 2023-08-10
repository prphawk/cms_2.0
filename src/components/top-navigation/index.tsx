import { cn } from '@/lib/utils'
import { ArrowLeftIcon, Dot, LogOutIcon } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { MyHeaders } from '~/constants/headers'
import { Routes } from '~/constants/routes'

export const TopNavigation = () => {
  const router = useRouter()
  return (
    <div className="m-auto mb-16 flex justify-center">
      <div className="container absolute top-0 m-auto flex h-[4rem] w-full flex-row items-center rounded-b-xl bg-[--top-navigation-background] p-6 tracking-wide text-white shadow-lg">
        <button onClick={() => router.back()}>
          <ArrowLeftIcon className="mr-2 h-6 w-6" />
        </button>
        <CMS className="text-[24px]" />
        <div className="ml-4 flex flex-row items-center space-x-2 pt-[4px]">
          <a
            className="text-sm font-semibold tracking-wider hover:underline "
            href={Routes.COMMITTEES}
          >
            {MyHeaders.COMMITTEES}
          </a>
          <Dot className="p-1" />
          <a
            className="text-sm font-semibold tracking-wider hover:underline"
            href={Routes.EMPLOYEES}
          >
            {MyHeaders.EMPLOYEES}
          </a>
          <Dot className="p-1" />

          <a
            className="text-sm font-semibold tracking-wider hover:underline"
            href={Routes.TEMPLATES}
          >
            {MyHeaders.TEMPLATES}
          </a>
          <Dot className="p-1" />
          <a
            className="text-sm font-semibold tracking-wider hover:underline"
            href={Routes.SETTINGS}
          >
            Configurações
          </a>
        </div>
        <SignOutButton />
      </div>
    </div>
  )
}

export const CMS = ({ className }: { className?: string }) => {
  return (
    <h1 className={cn('mx-4 font-extrabold', className)}>
      CMS 2<span className="text-[#fa7b7f]">.</span>0
    </h1>
  )
}

export const SignOutButton = ({ className }: { className?: string }) => {
  return (
    <button
      className={cn(
        'ml-auto flex flex-row items-center text-sm font-semibold tracking-wider hover:underline',
        className
      )}
      onClick={() => signOut()}
    >
      Sign Out
      <LogOutIcon className="ml-4" />
    </button>
  )
}
