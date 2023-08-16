// @ts-nocheck
const { faker } = require('@faker-js/faker')

class DataFactory {
  constructor() {}

  newMockEmployee(name) {
    return {
      name: name || faker.person.fullName(),
      is_active: true
    }
  }

  newMockCommittee(bond, name) {
    const date = faker.date.past()
    const isEven = date.getTime() % 2 === 0
    return {
      name: name || 'Órgão ' + faker.person.fullName(),
      bond: bond || 'Vínculo ' + faker.commerce.department(),
      begin_date: isEven ? faker.date.past() : null,
      end_date: isEven ? faker.date.future() : null,
      ordinance: 'Portaria ' + faker.string.alphanumeric(5),
      observations: faker.lorem.sentence(),
      is_active: faker.datatype.boolean({ probability: 0.75 })
    }
  }

  newTemplate(name, mockCommitteeIds) {
    return {
      data: {
        name,
        committees: {
          connect: mockCommitteeIds.map((c) => {
            return { id: c }
          })
        }
        //notification: { create: {} }
      }
    }
  }

  newMockMembershipJSON(mockEmployeeId, mockCommitteeId, mockRole) {
    const date = new Date()
    const isEven = date.getTime() % 2 === 0
    date.setFullYear(new Date().getFullYear() + 1)
    return {
      employee_id: mockEmployeeId,
      committee_id: mockCommitteeId,
      ordinance: 'Portaria ' + faker.string.alphanumeric(5),
      begin_date: isEven ? new Date() : null,
      end_date: isEven ? date : null,
      role: mockRole,
      observations: faker.lorem.sentence(),
      is_active: faker.datatype.boolean({ probability: 0.75 })
    }
  }
}

module.exports = new DataFactory()
