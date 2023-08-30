import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { HourglassIcon, XIcon } from 'lucide-react'
import { PropsWithChildren, ReactNode } from 'react'
import { _toLocaleString, _isDateComing } from '~/utils/string'

export const IconBadge = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <Badge className={cn('ml-2 p-[3px] text-inherit', className)} variant="outline">
      {children}
    </Badge>
  )
}

export const InactiveBadge = (props: { className?: string; label?: string; large?: boolean }) => {
  return (
    <IconBadge className={cn(props.className)}>
      <XIcon className={cn('h-3 w-3 text-white', props.large && 'h-4 w-4')} />
      {props.label && <span className="m-[2px] text-xs">{props.label}</span>}
    </IconBadge>
  )
}
export const TemporaryBadge = (props: { className?: string; label?: string; large?: boolean }) => {
  return (
    <IconBadge className={props.className}>
      <HourglassIcon className={cn('h-3 w-3 text-white', props.large && 'h-4 w-4')} />
      {props.label && <span className="m-[2px] text-xs ">{props.label}</span>}
    </IconBadge>
  )
}

export const MyTooltip = (props: { tooltip: JSX.Element | string } & PropsWithChildren) => (
  <div>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{props.children}</TooltipTrigger>
        <TooltipContent>{props.tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
)
