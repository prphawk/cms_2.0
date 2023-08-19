import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { XIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { _toLocaleString, _isDateComing } from '~/utils/string'

export const IconBadge = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <Badge className={cn('ml-2 p-[3px] text-inherit', className)} variant="outline">
      {children}
    </Badge>
  )
}

export const InactiveIcon = () => {
  return (
     <IconBadge>
             <XIcon className="h-3 w-3 text-white" />
           </IconBadge>
  )
}
