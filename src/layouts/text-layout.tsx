import { cn } from '@/lib/utils'
import { PropsWithChildren } from 'react'

export function TextLayout(props: PropsWithChildren & { className?: string }) {
  return (
    <div className={cn('text-lg font-bold tracking-tight text-white', props.className)}>
      {props.children}
    </div>
  )
}

export function TitleLayout(props: PropsWithChildren) {
  return (
    <>
      <main className="mb-[-6px] font-extrabold tracking-normal text-white sm:text-[1.6rem]">
        {props.children}
      </main>
    </>
  )
}
