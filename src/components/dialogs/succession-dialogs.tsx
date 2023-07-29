import { z } from 'zod'
import { dialogsEnum } from '~/pages/dashboard/committees/[id]'
import { api } from '~/utils/api'
import { useEffect, useState } from 'react'
import { Committee, CommitteeTemplate, Employee, Membership } from '@prisma/client'
import { _addDays, _addMonths, _addYears } from '~/utils/string'
import { useRouter } from 'next/router'
import { Routes } from '~/constants/routes'
import CommitteeDialog, { CommitteeSchema } from './committee-dialog'
import MembershipArrayDialog, { MembershipArraySchema } from './membership-array-dialog'
import { AlertDialog } from './alert-dialog'

export default function SuccessionDialogs(props: {
  open: dialogsEnum
  handleOpenDialog: (dialogEnum: number) => void
  handleSave: (data: z.infer<typeof MembershipArraySchema>) => void
  committeeId: number
}) {
  const { data: committeeData, isLoading } = api.committee.getOne.useQuery({
    id: props.committeeId,
    is_active: true
  })

  const [successionData, setSuccessionData] = useState<any>()
  //// Committee & { committee_template: CommitteeTemplate} & { members: (Membership & { employee: Employee })[] }

  useEffect(() => {
    if (committeeData) {
      const newData = {
        id: undefined,
        begin_date: _addDays(committeeData.end_date!, 1),
        end_date: _addDays(committeeData.end_date!, 1),
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

  const handleSave1st = (data1st: z.infer<typeof CommitteeSchema>) => {
    setSuccessionData({
      ...successionData,
      ...data1st
    } as any)
    props.handleOpenDialog(dialogsEnum.succession2nd)
  }

  const handleSave2nd = (data2nd: z.infer<typeof MembershipArraySchema>) => {
    const readySuccessionData = { ...successionData, ...data2nd }
    setSuccessionData(readySuccessionData as any)
    succession.mutate(readySuccessionData as any)
  }

  return (
    committeeData && (
      <>
        <AlertDialog
          open={props.open === dialogsEnum.succession}
          handleOpenDialog={props.handleOpenDialog}
          handleContinue={() => props.handleOpenDialog(dialogsEnum.succession1st)}
        />
        <CommitteeDialog
          open={props.open === dialogsEnum.succession1st}
          handleOpenDialog={props.handleOpenDialog}
          handleSave={handleSave1st}
          committee={successionData}
          succession
        />
        <MembershipArrayDialog
          open={props.open === dialogsEnum.succession2nd}
          handleOpenDialog={props.handleOpenDialog}
          handleSave={handleSave2nd}
          committee={successionData}
          members={committeeData.members}
        />
      </>
    )
  )
}
