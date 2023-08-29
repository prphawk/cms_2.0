import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import AuthenticatedPage from '~/components/authenticated-page'
import { AlertDialog } from '~/components/dialogs/alert-dialog'
import EmployeeDialog from '~/components/dialogs/employee-dialog'
import {
  FilterStateType,
  filterAProps,
  filterDProps,
  getActiveDateFilterLabels,
  getComplementaryFilterValue,
  handleChangeComplementaryFilters
} from '~/components/filters'
import { DataTable } from '~/components/table/data-table'
import { IFilter, IFilterOptions, TableToolbarFilter } from '~/components/table/data-table-toolbar'
import TableToolbarCreateButton from '~/components/table/data-table-toolbar-create-button'
import { getEmployeesColumns } from '~/components/table/employees/employees-columns'
import { DialogsEnum } from '~/constants/enums'
import { MembershipHeaders, MyHeaders } from '~/constants/headers'
import { LS } from '~/constants/local_storage'
import { Routes } from '~/constants/routes'
import { ContentLayout } from '~/layouts/page-layout'
import { TitleLayout } from '~/layouts/text-layout'
import ErrorPage from '~/pages/500'
import { CreateEmployeeFormSchema } from '~/schemas'
import {
  FilterStateDatesType,
  MembershipWithEmployeeCommitteeAndMembershipCountDataType
} from '~/types'
import { api } from '~/utils/api'
import { _toLocaleString } from '~/utils/string'

export default function Employees() {
  const router = useRouter()

  const [openDialog, setOpenDialog] = useState(DialogsEnum.none)

  const [selectedMembership, setSelectedMembership] =
    useState<MembershipWithEmployeeCommitteeAndMembershipCountDataType>()

  const handleOpenDialog = (dialogEnum: DialogsEnum) => setOpenDialog(dialogEnum)

  const [filter, setFilter] = useState('')
  const [filterAM, setFilterAM] = useState<FilterStateType>()
  const [filterAE, setFilterAE] = useState<FilterStateType>()
  const [filterC, setFilterC] = useState<string[]>()
  const [filterD, setFilterD] = useState<FilterStateDatesType>({
    begin_date: undefined,
    end_date: undefined
  })

  const handleChangeActiveFiltersC = (values?: string[]) => {
    setFilterC(!values?.length ? undefined : values)
  }

  const handleChangeActiveFiltersD = (values: FilterStateDatesType) => {
    setFilterD({ ...values })
  }

  const { data: roleOptions } = api.membership.getRoleOptions.useQuery({ filterFormat: true })

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
      activeFilters: getActiveDateFilterLabels(filterD),
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
    roles: filterC,
    dates: filterD
  })

  const createEmployee = api.employee.create.useMutation({})

  const updateEmployee = api.employee.update.useMutation({
    onSuccess() {
      utils.membership.getAll.invalidate()
    }
  })

  if (isError) {
    return <ErrorPage />
  }

  const onCreateEmployee = () => {
    setSelectedMembership(undefined)
    handleOpenDialog(DialogsEnum.employee)
  }

  const onEditEmployee = (
    membership: MembershipWithEmployeeCommitteeAndMembershipCountDataType
  ) => {
    setSelectedMembership(membership)
    handleOpenDialog(DialogsEnum.employee)
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

  const handleSaveEmployee = (employeeSchema: z.infer<typeof CreateEmployeeFormSchema>) => {
    if (selectedMembership)
      updateEmployee.mutate({ id: selectedMembership.employee.id, name: employeeSchema.name })
    else createEmployee.mutate({ name: employeeSchema.name })
  }

  return (
    <AuthenticatedPage>
      <ContentLayout className="employees my-6 mb-auto min-h-[89vh]">
        {data && (
          <>
            <EmployeesTableTitle data={data} />
            <DataTable
              data={data}
              isLoading={isLoading}
              globalFilter={filter}
              onChangeGlobalFilter={(value) => setFilter(value)}
              tableActions={
                <TableToolbarCreateButton
                  onCreate={onCreateEmployee}
                  label={MembershipHeaders.MEMBER}
                />
              }
              columns={getEmployeesColumns(
                handleViewCommittee,
                onEditEmployee,
                onDeactivateMembership,
                onDeactivateEmployee
              )}
              tableFilters={<TableToolbarFilter filters={propsFilters} />}
            />
            <EmployeeDialog
              open={openDialog == DialogsEnum.employee}
              handleOpenDialog={handleOpenDialog}
              handleSave={handleSaveEmployee}
              employee={selectedMembership?.employee}
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
