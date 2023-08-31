import { cn } from '@/lib/utils'
import { PropsWithChildren } from 'react'
import LoadingLayout from './loading-layout'

export default function PageLayout(props: PropsWithChildren) {
  return (
    <main className="relative flex min-h-screen flex-col items-center  justify-center bg-gradient-to-b from-[--gradient-1] to-[--gradient-2] px-4 pb-6">
      {props.children}
    </main>
  )
}

export function ContentLayout(
  props: PropsWithChildren & { className?: string; isLoading?: boolean }
) {
  return (
    <div
      className={cn(
        'my-shadow container h-full rounded-xl bg-[--table-background] text-white',
        props.className
      )}
    >
      <LoadingLayout isLoading={props.isLoading}>{props.children}</LoadingLayout>
    </div>
  )
}
