import { PropsWithChildren } from 'react'
import { TextLayout } from '~/layout'

export default function LoadingLayout(props: PropsWithChildren & { loading?: boolean }) {
  // You can add any UI inside Loading, including a Skeleton.
  return props.loading ? (
    <div className="container my-6 mb-auto flex h-[100vh] items-center rounded-xl bg-gray-900/20 pb-4 text-white drop-shadow-lg">
      <LoadingElement />
    </div>
  ) : (
    <>{props.children}</>
  )
}

export const LoadingElement = () => <TextLayout className="m-auto">Loading...</TextLayout>
