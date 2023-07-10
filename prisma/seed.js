const { PrismaClient } = require('@prisma/client');
const { employees, committees, memberships } = require('./data.js');
const prisma = new PrismaClient();

const load = async () => {
  try {
    await prisma.membership.deleteMany();
    console.log('Deleted records in membership table');

    await prisma.employee.deleteMany();
    console.log('Deleted records in employee table');

    await prisma.committee.deleteMany();
    console.log('Deleted records in committee table');

    await prisma.$queryRaw`ALTER TABLE Employee AUTO_INCREMENT = 1`;
    console.log('reset category auto increment to 1');

    await prisma.$queryRaw`ALTER TABLE Committee AUTO_INCREMENT = 1`;
    console.log('reset product auto increment to 1');

    await prisma.$queryRaw`ALTER TABLE Membership AUTO_INCREMENT = 1`;
    console.log('reset product auto increment to 1');

    await prisma.employee.createMany({
      data: employees,
    });
    console.log('Added employee data');

    await prisma.committee.createMany({
      data: committees,
    });
    console.log('Added committee data');

    await prisma.membership.createMany({
      data: memberships,
    });
    console.log('Added membership data');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
