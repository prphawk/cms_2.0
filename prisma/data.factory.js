// @ts-nocheck
const { faker } = require('@faker-js/faker');

class DataFactory {
  constructor() {}

  newMockEmployee(name) {
    return {
      name: name || faker.person.fullName(),
      is_active: true,
    };
  }

  newMockCommittee(bond, name) {
    return {
      name: name || 'Órgão ' + faker.person.fullName(),
      bond: bond || 'Vínculo ' + faker.commerce.department(),
      begin_date: faker.date.past(),
      end_date: faker.date.future(),
      ordinance: 'Portaria ' + faker.string.alphanumeric(5),
      observations: faker.lorem.sentence(),
      is_active: faker.datatype.boolean({ probability: 0.75 }),
    };
  }

  newTemplateCommittee(name, mockCommitteeIds) {
    return {
      data: {
        name,
        committees: {
          connect: mockCommitteeIds.map((c) => {
            return { id: c };
          }),
        },
      },
    };
  }

  newMockMembershipJSON(mockEmployeeId, mockCommitteeId, mockRole) {
    const date = new Date();
    date.setFullYear(new Date().getFullYear() + 1);
    return {
      employee_id: mockEmployeeId,
      committee_id: mockCommitteeId,
      ordinance: 'Portaria ' + faker.string.alphanumeric(5),
      begin_date: new Date(),
      end_date: date,
      role: mockRole,
      observations: faker.lorem.sentence(),
      is_active: faker.datatype.boolean({ probability: 0.75 }),
    };
  }
}

module.exports = new DataFactory();
