import { z } from 'zod'
import { dialogsEnum } from '~/pages/dashboard/committees/[id]'
import { api } from '~/utils/api'
import MembershipArrayDialog, { MembershipArraySchema } from '../membership-array-dialog'
import { useEffect, useState } from 'react'
import CommitteeDialog, { CommitteeSchema } from '../committee-dialog'
import { Committee } from '@prisma/client'

export default function SuccessionDialogs(props: {
  open1st: boolean
  open2nd: boolean
  handleOpenDialog: (dialogEnum: number) => void
  handleSave: (data: z.infer<typeof MembershipArraySchema>) => void
  committeeId: number
}) {
  const { data, isLoading } = api.committee.getOne.useQuery({
    id: props.committeeId,
    is_active: true
  })

  useEffect(() => {
    console.log(data?.begin_date)
    if (data && data.end_date) data.begin_date = new Date(data.end_date)
  }, [data])

  const [data1st, setData1st] = useState<z.infer<typeof CommitteeSchema>>()

  const handleSave1st = (data1st: z.infer<typeof CommitteeSchema> & { id?: number }) => {
    setData1st(data1st)
    props.handleOpenDialog(dialogsEnum.succession2nd)
  }

  const handleSave2nd = (data2nd: z.infer<typeof MembershipArraySchema>) => {
    console.log(data1st)
    console.log(data2nd)
  }

  return (
    data && (
      <>
        <CommitteeDialog
          open={props.open1st}
          handleOpenDialog={props.handleOpenDialog}
          handleSave={handleSave1st}
          committee={data}
          succession
        />
        <MembershipArrayDialog
          open={props.open2nd}
          handleOpenDialog={props.handleOpenDialog}
          handleSave={handleSave2nd}
          committee={data1st}
          members={data.members}
        />
      </>
    )
  )
}
