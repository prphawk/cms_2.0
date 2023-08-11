import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'
import { _toLocaleString, _isDateComing } from '~/utils/string'

export const IconBadge = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <Badge className={cn('ml-2 p-[0.20rem] text-inherit', className)} variant="outline">
      {children}
    </Badge>
  )
}
