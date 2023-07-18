// @ts-nocheck
const { PrismaClient } = require('@prisma/client');
const { employees, committees, memberships, committeesFromTemplates } = require('./data.js');
const prisma = new PrismaClient();

const load = async () => {
  try {
    await prisma.membership.deleteMany();
    console.log('Deleted records in Membership table');

    await prisma.committeeTemplate.deleteMany();
    console.log('Deleted records in CommitteeTemplate table');

    await prisma.employee.deleteMany();
    console.log('Deleted records in Employee table');

    await prisma.committee.deleteMany();
    console.log('Deleted records in Committee table');

    await prisma.$queryRaw`ALTER TABLE Employee AUTO_INCREMENT = 1`;
    console.log('reset Employee auto increment to 1');

    await prisma.$queryRaw`ALTER TABLE Committee AUTO_INCREMENT = 1`;
    console.log('reset Committee auto increment to 1');

    await prisma.$queryRaw`ALTER TABLE Membership AUTO_INCREMENT = 1`;
    console.log('reset Membership auto increment to 1');

    await prisma.$queryRaw`ALTER TABLE CommitteeTemplate AUTO_INCREMENT = 1`;
    console.log('reset CommitteeTemplate auto increment to 1');

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

    await prisma.committeeTemplate.create(committeesFromTemplates[0]);

    await prisma.committeeTemplate.create(committeesFromTemplates[1]);

    console.log('Added committeeTemplate data');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
