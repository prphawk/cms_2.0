import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { AlertTriangleIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { _toLocaleString, _isDateComing } from '~/utils/string'

export const IconBadge = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <Badge className={cn('ml-2 p-[0.20rem] text-inherit', className)} variant="outline">
      {children}
    </Badge>
  )
}

export const EndDate = ({ value, isActive }: { value: Date; isActive: boolean }) => {
  return isActive ? (
    <div className="flex flex-row ">
      {_toLocaleString(value)}
      <span className="self-center ">
        {_isDateComing(value) && <AlertTriangleIcon className=" ml-2 h-4 w-4 text-yellow-500" />}
      </span>
    </div>
  ) : (
    <div>{_toLocaleString(value)}</div>
  )
}
