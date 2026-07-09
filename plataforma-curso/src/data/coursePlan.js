export const COURSE_TOTAL_LESSONS = 721;
export const COURSE_MODULE_COUNT = 21;

export const COURSE_MODULES = [
  {
    id: 'P0',
    label: 'Abertura',
    title: 'Abertura da formacao',
    shortTitle: 'Abertura',
    lessons: 1,
    range: '000',
    focus: 'Visao completa, metodo de estudo e pacto tecnico da jornada.',
    highlights: ['Metodo', 'carreira', 'rotina']
  },
  {
    id: 'M0',
    label: 'M0',
    title: 'Ambiente, metodo e ferramentas',
    shortTitle: 'Ambiente e metodo',
    lessons: 20,
    range: '001-020',
    focus: 'Preparacao profissional do ambiente, terminal, IDE, Git, Docker e rotina.',
    highlights: ['JDK', 'IntelliJ', 'Git', 'Docker']
  },
  {
    id: 'M1',
    label: 'M1',
    title: 'Java fundamentos absolutos',
    shortTitle: 'Fundamentos Java',
    lessons: 41,
    range: '021-061',
    focus: 'Sintaxe, variaveis, operadores, controle de fluxo, arrays e metodos.',
    highlights: ['Sintaxe', 'loops', 'arrays', 'metodos']
  },
  {
    id: 'M2',
    label: 'M2',
    title: 'Java Core profundo',
    shortTitle: 'Java Core profundo',
    lessons: 28,
    range: '062-089',
    focus: 'JVM, memoria, tipos modernos, exceptions iniciais, I/O e leitura de documentacao.',
    highlights: ['JVM', 'memoria', 'records', 'I/O']
  },
  {
    id: 'M3',
    label: 'M3',
    title: 'Metodos, organizacao procedural e projetos console',
    shortTitle: 'Metodos e projetos console',
    lessons: 15,
    range: '090-104',
    focus: 'Quebra de responsabilidades, coesao, refatoracao e projetos de console.',
    highlights: ['coesao', 'refatoracao', 'debug']
  },
  {
    id: 'M4',
    label: 'M4',
    title: 'Orientacao a Objetos e dominio',
    shortTitle: 'OO e dominio',
    lessons: 41,
    range: '105-145',
    focus: 'Modelagem OO, encapsulamento, objetos validos, dominio e mini-projetos.',
    highlights: ['classes', 'dominio', 'imutabilidade', 'servicos']
  },
  {
    id: 'M5',
    label: 'M5',
    title: 'Collections Framework',
    shortTitle: 'Collections',
    lessons: 26,
    range: '146-171',
    focus: 'List, Set, Map, filas, ordenacao, criterios de escolha e projetos integradores.',
    highlights: ['List', 'Set', 'Map', 'Comparator']
  },
  {
    id: 'M6',
    label: 'M6',
    title: 'Generics e Optional',
    shortTitle: 'Generics e Optional',
    lessons: 14,
    range: '172-185',
    focus: 'Tipos genericos, wildcards, type erasure, Optional e repositorios tipados.',
    highlights: ['Generics', 'PECS', 'Optional']
  },
  {
    id: 'M7',
    label: 'M7',
    title: 'Functional Interfaces, Lambdas e Streams',
    shortTitle: 'Lambdas e Streams',
    lessons: 15,
    range: '186-200',
    focus: 'Programacao funcional moderna com lambdas, method references, streams e collectors.',
    highlights: ['lambdas', 'streams', 'collectors']
  },
  {
    id: 'M8',
    label: 'M8',
    title: 'Exceptions, I/O, CSV, Date/Time e utilitarios modernos',
    shortTitle: 'Exceptions e utilitarios',
    lessons: 14,
    range: '201-214',
    focus: 'Erros por camada, arquivos, CSV robusto, datas, UUID e utilitarios modernos.',
    highlights: ['exceptions', 'CSV', 'java.time']
  },
  {
    id: 'M9',
    label: 'M9',
    title: 'SOLID',
    shortTitle: 'SOLID',
    lessons: 8,
    range: '215-222',
    focus: 'Principios SOLID aplicados com refatoracao e leitura de design backend.',
    highlights: ['SRP', 'OCP', 'DIP']
  },
  {
    id: 'M10',
    label: 'M10',
    title: 'Design Patterns aplicados ao backend',
    shortTitle: 'Design Patterns',
    lessons: 22,
    range: '223-244',
    focus: 'Patterns GoF usados com criterio em fluxos reais de backend.',
    highlights: ['Strategy', 'Factory', 'Adapter', 'Observer']
  },
  {
    id: 'M11',
    label: 'M11',
    title: 'Ferramentas essenciais do Java Backend profissional',
    shortTitle: 'Ferramentas backend',
    lessons: 26,
    range: '245-270',
    focus: 'JDK, Maven, Gradle, Git, testes, qualidade, Docker, CI/CD e governanca.',
    highlights: ['Maven', 'JUnit', 'Docker', 'CI/CD']
  },
  {
    id: 'M12',
    label: 'M12',
    title: 'SQL, PostgreSQL e modelagem relacional',
    shortTitle: 'SQL e PostgreSQL',
    lessons: 40,
    range: '271-310',
    focus: 'Modelagem relacional, consultas, indices, transacoes e diagnostico SQL.',
    highlights: ['SQL', 'PostgreSQL', 'indices', 'transacoes']
  },
  {
    id: 'M13',
    label: 'M13',
    title: 'Persistencia Java: JDBC, JPA, Hibernate e Spring Data',
    shortTitle: 'Persistencia Java',
    lessons: 45,
    range: '311-355',
    focus: 'Persistencia real com JDBC, JPA, Hibernate, Spring Data e performance.',
    highlights: ['JDBC', 'JPA', 'Hibernate', 'Spring Data']
  },
  {
    id: 'M14',
    label: 'M14',
    title: 'Spring Boot, REST APIs e backend profissional',
    shortTitle: 'Spring Boot e REST',
    lessons: 55,
    range: '356-410',
    focus: 'APIs REST profissionais com Spring Boot, validacao, erros, docs e testes.',
    highlights: ['REST', 'DTOs', 'Validation', 'OpenAPI']
  },
  {
    id: 'M15',
    label: 'M15',
    title: 'Seguranca de aplicacoes Java',
    shortTitle: 'Seguranca',
    lessons: 45,
    range: '411-455',
    focus: 'Seguranca como engenharia de risco: Spring Security, JWT, OAuth2 e OWASP.',
    highlights: ['Spring Security', 'JWT', 'OAuth2', 'OWASP']
  },
  {
    id: 'M16',
    label: 'M16',
    title: 'Integracoes, mensageria, eventos e resiliencia',
    shortTitle: 'Integracoes e eventos',
    lessons: 50,
    range: '456-505',
    focus: 'APIs externas, eventos, filas, resiliencia, idempotencia e consistencia.',
    highlights: ['RabbitMQ', 'Kafka', 'SAGA', 'Outbox']
  },
  {
    id: 'M17',
    label: 'M17',
    title: 'DevOps, CI/CD, Kubernetes e Cloud',
    shortTitle: 'DevOps e Cloud',
    lessons: 50,
    range: '506-555',
    focus: 'Entrega profissional com containers, pipelines, Kubernetes, cloud e deploy.',
    highlights: ['Kubernetes', 'pipelines', 'cloud', 'deploy']
  },
  {
    id: 'M18',
    label: 'M18',
    title: 'Observabilidade, performance, concorrencia e producao',
    shortTitle: 'Producao e performance',
    lessons: 55,
    range: '556-610',
    focus: 'Logs, metricas, tracing, tuning, concorrencia e operacao em producao.',
    highlights: ['logs', 'metricas', 'tracing', 'tuning']
  },
  {
    id: 'M19',
    label: 'M19',
    title: 'Arquitetura, DDD, sistemas distribuidos e lideranca tecnica',
    shortTitle: 'Arquitetura e DDD',
    lessons: 60,
    range: '611-670',
    focus: 'Arquitetura, DDD, sistemas distribuidos, decisoes tecnicas e lideranca.',
    highlights: ['DDD', 'arquitetura', 'distribuidos']
  },
  {
    id: 'M20',
    label: 'M20',
    title: 'Projeto final, carreira, entrevistas e defesa tecnica',
    shortTitle: 'Projeto final e carreira',
    lessons: 50,
    range: '671-720',
    focus: 'Projeto final defensavel, portfolio, entrevistas, banca tecnica e carreira.',
    highlights: ['portfolio', 'entrevistas', 'banca tecnica']
  }
];

export const COURSE_PHASES = [
  {
    id: 'base',
    name: 'Fase 1: Base Java e dominio',
    shortName: 'Base Java',
    modules: ['P0', 'M0', 'M1', 'M2', 'M3', 'M4'],
    subtitle: 'Do zero ao Java Core, organizacao de codigo, projetos console e modelagem orientada a objetos.'
  },
  {
    id: 'modern-java',
    name: 'Fase 2: Java moderno e design',
    shortName: 'Java moderno',
    modules: ['M5', 'M6', 'M7', 'M8', 'M9', 'M10'],
    subtitle: 'Collections, Generics, Optional, Streams, exceptions, SOLID e design patterns aplicados.'
  },
  {
    id: 'backend-core',
    name: 'Fase 3: Ferramentas, banco e Spring',
    shortName: 'Backend core',
    modules: ['M11', 'M12', 'M13', 'M14'],
    subtitle: 'Ferramentas profissionais, SQL/PostgreSQL, persistencia Java e APIs REST com Spring Boot.'
  },
  {
    id: 'production',
    name: 'Fase 4: Seguranca, integracoes e producao',
    shortName: 'Producao',
    modules: ['M15', 'M16', 'M17', 'M18'],
    subtitle: 'Seguranca, mensageria, resiliencia, CI/CD, Kubernetes, cloud, observabilidade e performance.'
  },
  {
    id: 'architecture',
    name: 'Fase 5: Arquitetura e defesa tecnica',
    shortName: 'Arquitetura',
    modules: ['M19', 'M20'],
    subtitle: 'DDD, sistemas distribuidos, lideranca tecnica, projeto final, portfolio e entrevistas.'
  }
];

export const getModuleFromLessonTitle = (title = '') => {
  if (title.startsWith('000_')) return 'P0';

  const match = title.match(/^\d+_(M\d+)_/i);
  if (match) return match[1].toUpperCase();

  const parts = title.split('_');
  return parts.length >= 4 ? parts[1] : 'Outros';
};

export const getModulePlan = (moduleId) => (
  COURSE_MODULES.find(module => module.id === moduleId) || null
);

export const getPhaseForModule = (moduleId) => (
  COURSE_PHASES.find(phase => phase.modules.includes(moduleId)) || null
);

export const sortModulesByPlan = (a, b) => {
  const indexA = COURSE_MODULES.findIndex(module => module.id === a);
  const indexB = COURSE_MODULES.findIndex(module => module.id === b);

  if (indexA === -1 && indexB === -1) return a.localeCompare(b);
  if (indexA === -1) return 1;
  if (indexB === -1) return -1;
  return indexA - indexB;
};
