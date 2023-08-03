import { cn } from '@/lib/utils'
import { PropsWithChildren } from 'react'

export default function PageLayout(props: PropsWithChildren) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#453aa3] to-[#8d2b2b] px-4 pb-6">
      {props.children}
      {/*  from-[#3d3db9] to-[#922b2b]
      from-[#b89393] to-[#7f4930] " 
        from-[#5d5bd2] to-[#992005] */}
    </main>
  )
}

export function ContentLayout(props: PropsWithChildren & { className?: string }) {
  return (
    <div
      className={cn(
        'container my-6 mb-auto min-h-[90vh] rounded-xl bg-gray-900/30 pb-4 text-white shadow-lg',
        props.className
      )}
    >
      {props.children}
    </div>
  )
}

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
      <main className="mb-[-6px] font-extrabold tracking-tight text-white sm:text-[1.6rem]">
        {props.children}
      </main>
    </>
  )
}
