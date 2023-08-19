import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export const Ordinance = (value: string) => {
  return <div className="truncate">{value || '-'}</div>
}

export const Observations = (value: string) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="max-w-[100px] truncate">{value || '-'}</div>
        </TooltipTrigger>
        {value && <TooltipContent>{value}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  )
}
