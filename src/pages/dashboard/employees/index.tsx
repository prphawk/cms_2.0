import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AuthenticatedPage from '~/components/authenticated-page'
import { AlertDialog } from '~/components/dialogs/alert-dialog'
import {
  FilterStateType,
  filterAProps,
  filterDProps,
  getComplementaryFilterValue,
  handleChangeComplementaryFilters
} from '~/components/filters'
import { DataTable } from '~/components/table/data-table'
import { IFilter, IFilterOptions, TableToolbarFilter } from '~/components/table/data-table-toolbar'
import { getEmployeesColumns } from '~/components/table/employees/employees-columns'
import { DialogsEnum } from '~/constants/enums'
import { MyHeaders } from '~/constants/headers'
import { LS } from '~/constants/local_storage'
import { Routes } from '~/constants/routes'
import { ContentLayout } from '~/layouts/page-layout'
import { TitleLayout } from '~/layouts/text-layout'
import ErrorPage from '~/pages/500'
import { MembershipWithEmployeeCommitteeAndMembershipCountDataType } from '~/types'
import { api } from '~/utils/api'
import { _toLocaleString } from '~/utils/string'

export default function Employees() {
  const router = useRouter()

  const [openDialog, setOpenDialog] = useState(DialogsEnum.none)

  const [selectedMembership, setSelectedMembership] =
    useState<MembershipWithEmployeeCommitteeAndMembershipCountDataType>()

  const handleOpenDialog = (dialogEnum: DialogsEnum) => setOpenDialog(dialogEnum)

  const [filterAM, setFilterAM] = useState<FilterStateType>()
  const [filterAE, setFilterAE] = useState<FilterStateType>()
  const [filterC, setFilterC] = useState<string[]>()
  const [filterD, setFilterD] = useState<{ begin_date?: string; end_date?: string }>({
    begin_date: undefined,
    end_date: undefined
  })

  const { data: roleOptions } = api.membership.getRoleOptions.useQuery({ filterFormat: true })

  const handleChangeActiveFiltersC = (values?: string[]) => {
    setFilterC(!values?.length ? undefined : values)
  }

  const handleChangeActiveFiltersD = (values: { begin_date?: string; end_date?: string }) => {
    console.log(values)
    setFilterD({ ...values })
  }

  const getActiveDateFilterLabels = () => {
    const arr = new Array<string>()
    if (filterD.begin_date) {
      arr.push(`De: ${filterD.begin_date}`)
    }
    if (filterD.end_date) {
      arr.push(`Até: ${filterD.end_date}`)
    }
    return arr
  }

  const propsFilters: IFilter[] = [
    {
      ...filterAProps(`${MyHeaders.EMPLOYEE}`),
      activeFilters: filterAE?.labels,
      handleChangeActiveFilters: (labels) =>
        handleChangeComplementaryFilters(LS.EMPLOYEE_AE, 'is_active', setFilterAE, labels)
    },
    {
      ...filterAProps(`${MyHeaders.MEMBERSHIP}`),
      activeFilters: filterAM?.labels,
      handleChangeActiveFilters: (labels) =>
        handleChangeComplementaryFilters(LS.EMPLOYEE_AM, 'is_active', setFilterAM, labels)
    },
    {
      title: 'Cargo',
      options: roleOptions?.length ? (roleOptions as IFilterOptions[]) : [],
      activeFilters: filterC,
      handleChangeActiveFilters: handleChangeActiveFiltersC
    },
    {
      ...filterDProps,
      dates: filterD,
      activeFilters: getActiveDateFilterLabels(),
      handleChangeActiveFilters: handleChangeActiveFiltersD
    }
  ]

  useEffect(() => {
    const valueAM = getComplementaryFilterValue(LS.EMPLOYEE_AM, 'is_active', 'is_inactive')
    const valueAE = getComplementaryFilterValue(LS.EMPLOYEE_AE, 'is_active', 'is_inactive')
    if (valueAM || valueAE) {
      utils.membership.getAll.cancel()
      setFilterAM(valueAM)
      setFilterAE(valueAE)
    }
  }, [])

  const utils = api.useContext()

  const { data, isLoading, isError } = api.membership.getAll.useQuery({
    is_membership_active: filterAM?.value,
    is_employee_active: filterAE?.value,
    roles: filterC
  })

  if (isError) {
    return <ErrorPage />
  }

  const handleViewCommittee = (
    membership: MembershipWithEmployeeCommitteeAndMembershipCountDataType
  ) => {
    router.push(`${Routes.COMMITTEES}/${membership.committee_id}`)
  }

  const onDeactivateMembership = (
    membership: MembershipWithEmployeeCommitteeAndMembershipCountDataType
  ) => {
    setSelectedMembership({ ...membership })
    setOpenDialog(DialogsEnum.alert_deactivate)
  }

  const onDeactivateEmployee = (
    membership: MembershipWithEmployeeCommitteeAndMembershipCountDataType
  ) => {
    setSelectedMembership({ ...membership })
    setOpenDialog(DialogsEnum.alert_deactivate_employee)
  }

  const deactivateEmployee = api.employee.deactivate.useMutation({
    onSuccess() {
      utils.membership.getAll.invalidate() //TODO ver aquele negócio de mudar o resultado da chamada pra so mudar o status dessa comissão
    }
  })
  const deactivateMembership = api.membership.deactivate.useMutation({
    onSuccess() {
      utils.membership.getAll.invalidate()
    }
  })

  const handleDeactivateMembership = () => {
    if (selectedMembership) deactivateMembership.mutate({ id: selectedMembership.id })
  }

  const handleDeactivateEmployee = () => {
    if (selectedMembership) deactivateEmployee.mutate({ id: selectedMembership.employee_id })
  }

  return (
    <AuthenticatedPage>
      <ContentLayout className="employees my-6 mb-auto min-h-[89vh]">
        {data && (
          <>
            <EmployeesTableTitle data={data} />
            <DataTable
              isLoading={isLoading}
              data={data}
              columns={getEmployeesColumns(
                handleViewCommittee,
                onDeactivateMembership,
                onDeactivateEmployee
              )}
              tableFilters={<TableToolbarFilter filters={propsFilters} />}
            />
            <AlertDialog
              open={openDialog == DialogsEnum.alert_deactivate_employee}
              description={
                <>
                  Esta ação irá <strong>desativar</strong> o {MyHeaders.EMPLOYEE.toLowerCase()}{' '}
                  atual e <strong>encerrar</strong> todas as suas participações ativas. Deseja
                  continuar?
                </>
              }
              handleOpenDialog={handleOpenDialog}
              handleContinue={handleDeactivateEmployee}
            />
            <AlertDialog
              open={openDialog == DialogsEnum.alert_deactivate}
              description={
                <>
                  Esta ação irá <strong>encerrar</strong> esta participação. Deseja continuar?
                </>
              }
              handleOpenDialog={handleOpenDialog}
              handleContinue={handleDeactivateMembership}
            />
          </>
        )}
      </ContentLayout>
    </AuthenticatedPage>
  )
}

const EmployeesTableTitle = ({
  data
}: {
  data: MembershipWithEmployeeCommitteeAndMembershipCountDataType[]
}) => {
  return (
    <Accordion className="mb-6" type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <TitleLayout>{MyHeaders.EMPLOYEES}</TitleLayout>
        </AccordionTrigger>
        <AccordionContent className="tracking-wide"></AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
