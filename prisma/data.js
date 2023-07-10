const factory = require('./data.factory.js');

const employees = [
  factory.newMockEmployee(), //1
  factory.newMockEmployee(),
  factory.newMockEmployee(),
  factory.newMockEmployee(),
  factory.newMockEmployee(),
  factory.newMockEmployee(), //6
];

const committees = [
  factory.newMockCommittee(), //1
  factory.newMockCommittee(), //2
  factory.newMockCommittee(), //3
  factory.newMockCommittee(), //4
  factory.newMockCommittee(), //5
  factory.newMockCommittee(), //6
];

const memberships = [
  factory.newMockMembershipJSON(1, 1),
  factory.newMockMembershipJSON(1, 2),
  factory.newMockMembershipJSON(1, 3),
  factory.newMockMembershipJSON(1, 4),
  factory.newMockMembershipJSON(1, 5),
  factory.newMockMembershipJSON(2, 1),
  factory.newMockMembershipJSON(2, 2),
  factory.newMockMembershipJSON(2, 3),
  factory.newMockMembershipJSON(2, 4),
  factory.newMockMembershipJSON(3, 1),
  factory.newMockMembershipJSON(3, 2),
  factory.newMockMembershipJSON(3, 3),
  factory.newMockMembershipJSON(4, 1),
  factory.newMockMembershipJSON(4, 2),
  factory.newMockMembershipJSON(5, 1),
];

module.exports = {
  employees,
  committees,
  memberships,
};
