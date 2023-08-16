const { resetDB } = require('./reset.js')
const data = require('./permanentes.json')

const _toDate = (str) => {
  if (str === 'PERMANENTE' || !str) return null
  const arr = str.split('/')
  return new Date(`${arr[2]}/${arr[1]}/${arr[0]}`)
}

const importDB = async () => {
  //await resetDB()
  const map = new Map()
  data.forEach((curr) => {
    const dates = curr.PERIODO.split(' a ')
    const begin_date = _toDate(dates[0])
    const end_date = _toDate(dates[1])
    const bond = curr.PORTARIA.split('-')[1]

    if (!map.has(curr.ORGAO)) map.set(curr.ORGAO, [])

    map.set(curr.ORGAO, [
      ...map.get(curr.ORGAO),
      {
        name: curr.ORGAO,
        bond,
        begin_date,
        end_date,
        ordinance: curr.PORTARIA,
        observations: curr.OBSERVACOES,
        member_name: curr.MEMBRO
      }
    ])
  })
  console.log(map)
  //createData(newData)
}
// {
//    bond: string;
//    name: string;
//    begin_date?: string | Date | null | undefined;
//    end_date?: string | Date | null | undefined;
//    ordinance?: string | null | undefined;
//    observations?: string | ... 1 more ... | undefined;
//    is_active?: boolean | undefined;
//    members?: Prisma.MembershipCreateNestedManyWithoutCommitteeInput | undefined;
//    template?: Prisma.TemplateCreateNestedOneWithoutCommitteesInput | undefined;
// }

const createTemplate = async (item) => {
  // create template

  const name = item.key
  const template = await prisma.template.create({
    data: {
      name,
      notification: { create: {} }
    }
  })
}

const createCommittee = async (template_id, membership) => {
  //find or create employee

  const committee = await prisma.committee.create({
    data: {
      ...data,
      template: { connect: { id: template_id } },
      members: { createMany: { data: reduceResult.membershipsWithEmployee } }
    }
  })

  const promises = reduceResult.membershipsWithoutEmployee.map((m) => {
    const { employee, employee_id, ...rest } = m
    return prisma.membership.create({
      data: {
        ...rest,
        employee: { create: { name: employee.name } },
        committee: { connect: { id: committee.id } }
      }
    })
  })

  await Promise.all(promises)
}

importDB()
