const { resetDB } = require('./reset.js')
const data = require('./permanentes.json')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const comMap = new Map()

const _toDate = (str) => {
  if (str === 'PERMANENTE' || !str) return null
  const arr = str.split('/')
  return new Date(`${arr[2]}/${arr[1]}/${arr[0]}`)
}

const getExtremeDate = (currDate, otherDate, earliest) => {
  if (!currDate || !otherDate) return null
  if (earliest) return currDate < otherDate ? currDate : otherDate
  else return currDate >= otherDate ? currDate : otherDate
}

const formatData = () => {
  data.forEach((curr) => {
    const dates = curr.PERIODO.split(' a ')
    const begin_date_mem = _toDate(dates[0])
    const end_date_mem = _toDate(dates[1])
    const bond = curr.PORTARIA.split('-')[1] || ''

    if (!comMap.has(curr.ORGAO)) {
      comMap.set(curr.ORGAO, {
        name: curr.ORGAO,
        bond: bond.trim(),
        begin_date: begin_date_mem,
        end_date: end_date_mem,
        members: []
      })
    }

    const employee = {
      name: curr.MEMBRO
    }

    const currValueCom = comMap.get(curr.ORGAO)

    comMap.set(curr.ORGAO, {
      ...currValueCom,
      begin_date: getExtremeDate(currValueCom.begin_date, begin_date_mem, true),
      end_date: getExtremeDate(currValueCom.end_date, end_date_mem, false),
      members: [
        ...currValueCom.members,
        {
          begin_date: begin_date_mem,
          end_date: end_date_mem,
          ordinance: curr.PORTARIA,
          role: curr.CARGO,
          observations: curr.OBSERVACOES,
          employee
        }
      ]
    })
  })
}

const importDB = async () => {
  await resetDB()
  formatData()
  await createEntities()
}

const createEntities = async () => {
  for (const [key, value] of comMap) {
    const template = await createTemplate(key)
    await createCommittee(template.id, value)
  }
}

const createTemplate = async (key) => {
  return await prisma.template.create({
    data: {
      name: key
      //notification: { create: {} }
    }
  })
}

const findEmployee = async (name) => {
  return await prisma.employee.findFirst({
    where: { name: name }
  })
}

const populateEmployee = async (membership) => {
  const name = membership.employee.name
  let employee = await findEmployee(name)
  if (!employee) {
    employee = await prisma.employee.create({
      data: { name }
    })
  }
  return { ...membership, employee }
}

const createCommittee = async (template_id, committee) => {
  const { members, ...rest } = committee

  const promises = committee.members.map(populateEmployee)
  const membersWithEmpId = await Promise.all(promises)

  return prisma.committee.create({
    data: {
      ...rest,
      template: { connect: { id: template_id } },
      members: {
        createMany: {
          data: membersWithEmpId.map((membership) => {
            const { employee, ...rest } = membership
            return {
              employee_id: employee.id,
              ...rest
            }
          })
        }
      }
    }
  })
}

importDB()
