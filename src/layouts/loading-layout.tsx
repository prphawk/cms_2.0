import { PropsWithChildren } from 'react'
import { TextLayout } from './text-layout'
import { PLACEHOLDER } from '~/constants/placeholders'

export default function LoadingLayout(props: PropsWithChildren & { isLoading?: boolean }) {
  // You can add any UI inside Loading, including a Skeleton.
  return props.isLoading ? (
    <div className="my-auto flex h-full items-center">
      <LoadingElement />
    </div>
  ) : (
    <>{props.children}</>
  )
}

export const LoadingElement = () => (
  <TextLayout className="m-auto">{PLACEHOLDER.LOADING}</TextLayout>
)
