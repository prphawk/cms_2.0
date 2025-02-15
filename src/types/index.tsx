import { Committee, Employee, Membership, Notification, Template } from '@prisma/client'

export type CommitteeWithMembersDataType = Committee & { members: Membership[] }
export type CommitteeWithOptionalTemplateDataType = Committee & {
  template?: Template | null
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

type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

type EmployeeWithMergedMembershipCountDataType = Id<Employee & { _count: { committees: number } }>
export type MembershipWithEmployeeCommitteeAndMembershipCountDataType = Membership & {
  committee: Committee
} & {
  employee: EmployeeWithMergedMembershipCountDataType
}

export type TemplateWithCommitteeCountAndNotifDataType = Id<
  Template & { _count: { committees: number } }
> & { committee?: Committee | null } & {
  notification?: Notification | null
}

export type FilterStateDatesType = {
  begin_date?: string
  end_date?: string
}
