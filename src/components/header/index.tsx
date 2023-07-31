import { ArrowLeftIcon, Dot, LogOutIcon } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { MyHeaders } from '~/constants/headers'
import { Routes } from '~/constants/routes'

export const TopNavigation = () => {
  const router = useRouter()
  return (
    <div className="m-auto mb-16 flex justify-center">
      <div className="container absolute top-0 m-auto flex h-[4rem] w-full flex-row items-center rounded-b-xl bg-gray-800/30 p-6 tracking-wide text-white drop-shadow-md">
        <button onClick={() => router.back()}>
          <ArrowLeftIcon className="mr-2 h-6 w-6" />
        </button>
        <h1 className="mx-4 text-[1.5rem] font-extrabold">CMS 2.0</h1>
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
            href={Routes.SETTINGS}
          >
            Configurações
          </a>
        </div>
        <button
          className="ml-auto flex flex-row items-center text-sm font-semibold tracking-wider hover:underline"
          onClick={() => signOut()}
        >
          Sign Out
          <LogOutIcon className="ml-4" />
        </button>
      </div>
    </div>
  )
}
