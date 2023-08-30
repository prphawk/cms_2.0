import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { HourglassIcon, XIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { _toLocaleString, _isDateComing } from '~/utils/string'

export const IconBadge = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <Badge className={cn('ml-2 p-[3px] text-inherit', className)} variant="outline">
      {children}
    </Badge>
  )
}

export const InactiveBadge = ({ className }: { className?: string }) => {
  return (
    <IconBadge>
      <XIcon className={cn('h-3 w-3 text-white', className)} />
    </IconBadge>
  )
}
export const TemporaryBadge = ({ className }: { className?: string }) => {
  return (
    <IconBadge>
      <HourglassIcon className={cn('h-3 w-3 text-white', className)} />
    </IconBadge>
  )
}
