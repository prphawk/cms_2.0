// @ts-nocheck
const { faker } = require('@faker-js/faker');

class DataFactory {
  constructor() {}

  newMockEmployee() {
    return {
      name: faker.person.fullName(),
      is_active: true,
    };
  }

  newMockEmployeeWithId() {
    const mock = this.newMockEmployee();
    mock.id = +faker.number.int(3);
    return mock;
  }

  newMockCommittee() {
    return {
      name: 'Órgão ' + faker.person.fullName(),
      bond: 'Vínculo ' + faker.commerce.department(),
      begin_date: faker.date.past(),
      end_date: faker.date.future(),
      ordinance: 'Portaria ' + faker.string.alphanumeric(5),
      observations: faker.lorem.sentence(),
      is_active: faker.datatype.boolean({ probability: 0.75 }),
    };
  }

  newMockCommitteeWithId() {
    const mock = this.newMockCommittee();
    mock.id = +faker.number.int(3);
    return mock;
  }

  newMockMembershipJSON(mockEmployeeId, mockCommitteeId) {
    return {
      employee_id: mockEmployeeId,
      committee_id: mockCommitteeId,
      begin_date: faker.date.past(),
      term: +faker.number.int({ min: 1, max: 10 }),
      observations: faker.lorem.sentence(),
      is_active: faker.datatype.boolean({ probability: 0.75 }),
    };
  }
}

module.exports = new DataFactory();
