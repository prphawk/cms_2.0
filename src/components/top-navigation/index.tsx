import { cn } from '@/lib/utils'
import { ArrowLeftIcon, Dot, LogOutIcon } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { PropsWithChildren } from 'react'
import { MyHeaders } from '~/constants/headers'
import { Routes } from '~/constants/routes'

export const TopNavigation = () => {
  const router = useRouter()
  const session = useSession()
  return (
    <div className="mb-16 flex items-center justify-center">
      <div className="absolute top-0 m-auto flex h-[4rem] w-full bg-[--top-navigation-background] py-6 tracking-wide text-white shadow-lg">
        <div className="container flex flex-row items-center">
          <button onClick={() => router.back()}>
            <ArrowLeftIcon className=" mr-4 h-8 w-8 pt-1" />
          </button>
          <CMS className="text-[26px]" />
          <div className="ml-4 flex flex-row items-center space-x-2 pt-[4px]">
            <a className="font-semibold tracking-wider hover:underline " href={Routes.COMMITTEES}>
              {MyHeaders.COMMITTEES}
            </a>
            <Dot className="pt-1" />
            <a className=" font-semibold tracking-wider hover:underline" href={Routes.EMPLOYEES}>
              {MyHeaders.EMPLOYEES}
            </a>
            <Dot className="pt-1" />

            <a className=" font-semibold tracking-wider hover:underline" href={Routes.TEMPLATES}>
              {MyHeaders.TEMPLATES}
            </a>
            <Dot className="pt-1" />
            <a className="font-semibold tracking-wider hover:underline" href={Routes.ABOUT}>
              {MyHeaders.ABOUT}
            </a>
          </div>
          <SignOutButton className="ml-auto">
            <div className="mx-0.5">
              {session.data?.user.email}
              <span className="ml-2">|</span>
            </div>
          </SignOutButton>
        </div>
      </div>
    </div>
  )
}

export const CMS = ({ className }: { className?: string }) => {
  return (
    <h1 className={cn('mx-4 font-extrabold', className)}>
      CMS 2<span className="text-[#e18d8d]">.</span>0
    </h1>
  )
}

export const SignOutButton = ({
  className,
  children
}: { className?: string } & PropsWithChildren) => {
  return (
    <div className={cn('flex flex-row items-center gap-x-2 text-sm', className)}>
      {children}
      <button
        className={cn(
          'ml-auto flex flex-row items-center text-base font-semibold tracking-wider hover:underline'
        )}
        onClick={() => signOut()}
      >
        Sair
        <LogOutIcon className="ml-3 pt-0.5" />
      </button>
    </div>
  )
}
