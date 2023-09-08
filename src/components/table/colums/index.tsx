import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { IconBadge, InactiveBadge, MyTooltip, TemporaryBadge } from '~/components/badge'

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

export const CommitteeTooltipValue = (props: {
  value: string
  is_inactive: boolean
  is_temporary: boolean
}) => {
  return (
    <MyTooltip
      tooltip={
        <div className="text-xs">
          <span className="font-normal">{props.value}</span>
          {props.is_temporary && <IconBadge className="border-gray-300">Temporária</IconBadge>}
          {props.is_inactive && <IconBadge className="border-gray-300">Encerrada</IconBadge>}
        </div>
      }
    >
      <div className="flex flex-row truncate">
        <strong className="truncate">{props.value}</strong>
        <span className="flex flex-row ">
          <div>{props.is_temporary && <TemporaryBadge />}</div>
          <div>{props.is_inactive && <InactiveBadge />}</div>
        </span>
      </div>
    </MyTooltip>
  )
}
export const MembershipTooltipValue = (props: { value: string; is_inactive: boolean }) => {
  return (
    <MyTooltip
      tooltip={
        <div className="text-xs">
          <span className="font-normal">{props.value}</span>
          {props.is_inactive && (
            <IconBadge className="border-gray-300">Participação Encerrada</IconBadge>
          )}
        </div>
      }
    >
      <div className="flex flex-row truncate">
        <span className="truncate">{props.value}</span>
        <span>
          <div>{props.is_inactive && <InactiveBadge />}</div>
        </span>
      </div>
    </MyTooltip>
  )
}

export const EmployeeTooltipValue = (props: { value: string; is_inactive: boolean }) => {
  return (
    <MyTooltip
      tooltip={
        <div className="text-xs">
          <strong className="font-normal">{props.value}</strong>
          {props.is_inactive && (
            <IconBadge className="border-gray-300">Servidor(a) Desativado</IconBadge>
          )}
        </div>
      }
    >
      <div className="flex flex-row truncate">
        <strong className="truncate">{props.value}</strong>
        <span>
          <div>{props.is_inactive && <InactiveBadge />}</div>
        </span>
      </div>
    </MyTooltip>
  )
}
