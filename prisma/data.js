const factory = require('./data.factory.js');

const employees = [
  factory.newMockEmployee(), //1
  factory.newMockEmployee(),
  factory.newMockEmployee(),
  factory.newMockEmployee(),
  factory.newMockEmployee(),
  factory.newMockEmployee(), //6
  factory.newMockEmployee('Carla Maria Dal Sasso Freitas'), //7
  factory.newMockEmployee('Luciano Paschoal Granville'),
  factory.newMockEmployee('Alexsander Borges Ribeiro'),
  factory.newMockEmployee('Cauã Roca Antunes'),
  factory.newMockEmployee('Claudia de Quadro Rocha'),
  factory.newMockEmployee('Claudio Rosito Jung'),
  factory.newMockEmployee('Fernanda G. de Lima Kastensmidt'),
  factory.newMockEmployee('Luigi Carro'),
  factory.newMockEmployee('João Cesar Netto'),
  factory.newMockEmployee('Renato Perez Ribas'),
  factory.newMockEmployee('Leila Ribeiro'),
  factory.newMockEmployee('Luciana Porcher Nedel'),
  factory.newMockEmployee('Manuel Menezes de Oliveira Neto'),
  factory.newMockEmployee('Mariana Kolberg Fernandes'),
  factory.newMockEmployee('Marcelo Walter'),
  factory.newMockEmployee('Isis Pericolo'), //21
];

const committees = [
  factory.newMockCommittee('INF', 'DIREÇÃO'), //1
  factory.newMockCommittee('CAPPADJ/INF', 'INF'), //2
  factory.newMockCommittee('INF', 'Comissão para banca de Professor Substituto'), //3
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
  factory.newTemplateCommittee([1]),
  factory.newTemplateCommittee([10, 11]),
  factory.newTemplateCommittee([12, 13]),
];

const memberships = [
  factory.newMockMembershipJSON(7, 1, 'Diretor(a)'),
  factory.newMockMembershipJSON(8, 1, 'Vice-diretor(a)'),
  factory.newMockMembershipJSON(9, 1, 'Bibliotecário(a) Chefe'),
  factory.newMockMembershipJSON(10, 1, 'Representante Discente PG'),
  factory.newMockMembershipJSON(11, 1, 'Representante TAS'),
  factory.newMockMembershipJSON(12, 1, 'Coordenador(a) PPGC'),
  factory.newMockMembershipJSON(13, 1, 'Chefe INA'),
  factory.newMockMembershipJSON(14, 1, 'Representante Docente'),
  factory.newMockMembershipJSON(15, 1, 'Coordenador(a) Substituto COMGRAD/ECP'),
  factory.newMockMembershipJSON(16, 1, 'Coordenador(a) COMEX'),
  factory.newMockMembershipJSON(17, 1, 'Chefe INT'),
  factory.newMockMembershipJSON(18, 1, 'Diretor(a) CEI'),
  factory.newMockMembershipJSON(19, 1, 'Representante Docente'),
  factory.newMockMembershipJSON(20, 1, 'Coordenador(a) COMPESQ'),
  factory.newMockMembershipJSON(21, 1, 'Coordenador(a) COMGRAD/CIC'),
  factory.newMockMembershipJSON(22, 1, 'Representante Discente'),
  factory.newMockMembershipJSON(1, 2),
  factory.newMockMembershipJSON(1, 3),
  factory.newMockMembershipJSON(1, 4),
  factory.newMockMembershipJSON(1, 5),
  factory.newMockMembershipJSON(2, 2),
  factory.newMockMembershipJSON(2, 3),
  factory.newMockMembershipJSON(2, 4),
  factory.newMockMembershipJSON(3, 2),
  factory.newMockMembershipJSON(3, 3),
  factory.newMockMembershipJSON(4, 2),
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
