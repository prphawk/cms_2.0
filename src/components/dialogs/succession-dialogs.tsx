import { z } from 'zod'
import { api } from '~/utils/api'
import { useEffect, useState } from 'react'
import { _addDays, _addMonths, _addYears } from '~/utils/string'
import { useRouter } from 'next/router'
import { Routes } from '~/constants/routes'
import CommitteeDialog from './committee-dialog'
import MembershipArrayDialog from './membership-array-dialog'
import { AlertDialog } from './alert-dialog'
import { CommitteeFormSchema } from '~/schemas/committee'
import { MembershipArraySchema } from '~/schemas/membership'
import { DialogsEnum } from '~/constants/enums'
import { MyHeaders } from '~/constants/headers'

export default function SuccessionDialogs(props: {
  open: DialogsEnum
  handleOpenDialog: (dialogEnum: DialogsEnum) => void
  committeeId: number
}) {
  const { data: committeeData, isLoading } = api.committee.getOne.useQuery(
    {
      id: props.committeeId,
      is_active: true
    },
    { enabled: typeof props.committeeId == 'number' }
  )

  const [successionData, setSuccessionData] = useState<any>()
  //// Committee & { template: Template} & { members: (Membership & { employee: Employee })[] }

  useEffect(() => {
    if (committeeData) {
      const newData = {
        id: undefined,
        begin_date: committeeData.begin_date,
        end_date: committeeData.end_date,
        ordinance: undefined,
        observations: undefined
      }
      setSuccessionData({ ...committeeData, ...newData } as any)
    }
  }, [committeeData])

  const router = useRouter()

  const succession = api.committee.succession.useMutation({
    onSuccess(data) {
      handleDeactivateCurrentCommittee()
      router.push(`${Routes.COMMITTEES}/${data.id}`)
    }
  })

  const deactivate = api.committee.deactivate.useMutation()

  const handleDeactivateCurrentCommittee = () => {
    deactivate.mutate({ id: props.committeeId })
  }

  const handleSave1st = (data1st: z.infer<typeof CommitteeFormSchema>) => {
    setSuccessionData({
      ...successionData,
      ...data1st
    } as any)
    props.handleOpenDialog(DialogsEnum.succession2nd)
  }

  const handleSave2nd = (data2nd: z.infer<typeof MembershipArraySchema>) => {
    const readySuccessionData = {
      old_committee_id: props.committeeId,
      ...successionData,
      ...data2nd
    }
    setSuccessionData(readySuccessionData as any)
    succession.mutate(readySuccessionData as any)
  }

  return (
    committeeData && (
      <>
        <AlertDialog
          open={props.open === DialogsEnum.succession}
          handleOpenDialog={props.handleOpenDialog}
          handleContinue={() => props.handleOpenDialog(DialogsEnum.succession1st)}
          description={
            <>
              Esta ação irá criar um <strong>novo mandato</strong> de "
              {committeeData.template?.name}", <strong>encerrando</strong> o{' '}
              {MyHeaders.COMMITTEE.toLowerCase()} atual "{committeeData.name}" e todas as suas
              participações. Deseja continuar?
            </>
          }
        />
        <CommitteeDialog
          open={props.open === DialogsEnum.succession1st}
          handleOpenDialog={props.handleOpenDialog}
          handleSave={handleSave1st}
          committee={successionData}
          succession
        />
        <MembershipArrayDialog
          open={props.open === DialogsEnum.succession2nd}
          handleOpenDialog={props.handleOpenDialog}
          handleSave={handleSave2nd}
          committee={successionData}
          members={committeeData.members}
        />
      </>
    )
  )
}
