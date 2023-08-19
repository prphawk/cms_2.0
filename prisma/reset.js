const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const resetDB = async () => {
  try {
    await prisma.membership.deleteMany()
    console.log('Deleted records in Membership table')

    await prisma.template.deleteMany()
    console.log('Deleted records in Template table')

    await prisma.employee.deleteMany()
    console.log('Deleted records in Employee table')

    await prisma.committee.deleteMany()
    console.log('Deleted records in Committee table')

    await prisma.$queryRaw`ALTER TABLE Employee AUTO_INCREMENT = 1`
    console.log('reset Employee auto increment to 1')

    await prisma.$queryRaw`ALTER TABLE Committee AUTO_INCREMENT = 1`
    console.log('reset Committee auto increment to 1')

    await prisma.$queryRaw`ALTER TABLE Membership AUTO_INCREMENT = 1`
    console.log('reset Membership auto increment to 1')

    await prisma.$queryRaw`ALTER TABLE Template AUTO_INCREMENT = 1`
    console.log('reset Template auto increment to 1')

    await prisma.$queryRaw`ALTER TABLE Notification AUTO_INCREMENT = 1`
    console.log('reset Notification auto increment to 1')
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

module.exports = { resetDB }
