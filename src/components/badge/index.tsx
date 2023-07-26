import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export const IconBadge = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <Badge className={cn('ml-2 px-1 py-0.5 text-inherit', className)} variant="outline">
      {children}
    </Badge>
  );
};
