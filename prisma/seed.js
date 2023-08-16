// @ts-nocheck
const { PrismaClient } = require('@prisma/client')
const { employees, committees, memberships, templates } = require('./data.js')
const { resetDB } = require('./reset.js')

const prisma = new PrismaClient()

const load = async () => {
  try {
    await resetDB()

    await prisma.employee.createMany({
      data: employees
    })
    console.log('Added employee data')

    await prisma.committee.createMany({
      data: committees
    })
    console.log('Added committee data')

    await prisma.membership.createMany({
      data: memberships
    })
    console.log('Added membership data')

    await prisma.template.create(templates[0])

    await prisma.template.create(templates[1])

    console.log('Added template data')
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

load()
