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
  factory.newMockCommittee('CAPPADJ/INF', 'INF'), //1
  factory.newMockCommittee('INF', 'Comissão para banca de Professor Substituto'), //2
  factory.newMockCommittee('UFRGS', 'DIREÇÃO'), //3
  factory.newMockCommittee('INF', 'CONINF'), //4
  factory.newMockCommittee('UFRGS', 'DEP. INA'), //5
  factory.newMockCommittee('INF', 'COMGRAD CIC'), //6
  factory.newMockCommittee('INF', 'COMGRAD ECP'), //7
  factory.newMockCommittee('UFRGS', 'PPGC'), //8
  factory.newMockCommittee('INF', 'Comissão representante para congresso X'), //9
  factory.newMockCommittee('INF', 'Comissão A 2022/1'), //10
  factory.newMockCommittee('INF', 'Comissão A 2022/2'), //11
  factory.newMockCommittee('INF', 'Comissão B 2022/1'), //12
  factory.newMockCommittee('INF', 'Comissão B 2022/2'), //13
  factory.newMockCommittee('INF', 'Comissão C'), //14
  factory.newMockCommittee('INF', 'Comissão D'), //15
  factory.newMockCommittee('INF', 'Comissão E'), //16
  factory.newMockCommittee('INF', 'Comissão F'), //17
  factory.newMockCommittee('INF', 'Comissão G'), //18
  factory.newMockCommittee('INF', 'Comissão H'), //19
];

const committeesFromTemplates = [
  factory.newTemplateCommittee([10, 11]),
  factory.newTemplateCommittee([12, 13]),
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
  factory.newMockMembershipJSON(1, 6),
  factory.newMockMembershipJSON(2, 6),
  factory.newMockMembershipJSON(3, 6),
  factory.newMockMembershipJSON(4, 6),
  factory.newMockMembershipJSON(1, 7),
  factory.newMockMembershipJSON(2, 7),
  factory.newMockMembershipJSON(3, 7),
  factory.newMockMembershipJSON(1, 8),
  factory.newMockMembershipJSON(2, 8),
  factory.newMockMembershipJSON(3, 9),
];

module.exports = {
  employees,
  committees,
  memberships,
  committeesFromTemplates,
};
