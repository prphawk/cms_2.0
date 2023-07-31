import { Committee, Employee, Membership } from '@prisma/client'

export type CommitteeWithMembersDataType = Committee & { members: Membership[] }
export type CommitteeWithOptionalTemplateDataType = Committee & {
  committee_template?: { name: string } | null
}
export type CommitteeWithMembershipCountDataType = Committee & {
  members_count: CountDataType
}

export type CountDataType = {
  active_count: number
  total_count: number
}
export type RawCountDataType = { _count: any; is_active: boolean }

export type MembershipWithEmployeeDataType = Membership & { employee: Employee }
export type MembershipWithEmployeeAndCommitteeDataType = MembershipWithEmployeeDataType & {
  committee: Committee
}
