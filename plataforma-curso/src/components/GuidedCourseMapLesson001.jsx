import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Copy,
  FileText,
  GraduationCap,
  Lightbulb,
  ListChecks,
  Orbit,
  RotateCcw,
  ShieldAlert,
  Target,
  Telescope
} from 'lucide-react';
import {
  COURSE_MODULES,
  COURSE_MODULE_COUNT,
  COURSE_PHASES,
  COURSE_TOTAL_LESSONS
} from '../data/coursePlan';
import './guidedLesson.css';
import './guidedCourseMapLesson.css';

const LESSON_STORAGE_KEY = 'guided-course-map-lesson-001-progress';

const MODULE_GUIDE = {
  M0: {
    topics: ['JDK', 'terminal', 'IntelliJ', 'Git', 'Maven', 'Docker', 'PostgreSQL', 'cliente HTTP', 'diário'],
    mentor: 'Antes de construir sistemas, você precisa controlar a própria máquina, localizar arquivos, executar ferramentas e reconhecer quando o ambiente está errado.',
    evidence: 'Preparar, validar e diagnosticar um ambiente Java sem depender de sorte.',
    risk: 'Um ambiente opaco transforma qualquer erro futuro em tentativa e adivinhação.'
  },
  M1: {
    topics: ['variáveis', 'tipos', 'operadores', 'if', 'switch', 'laços', 'arrays', 'métodos', 'entrada de dados'],
    mentor: 'Aqui você aprende a ler fluxo e transformar regras pequenas em instruções que o computador executa.',
    evidence: 'Resolver problemas simples, prever a saída e explicar o caminho do programa.',
    risk: 'Sem lógica e sintaxe, frameworks viram anotações copiadas sem compreensão.'
  },
  M2: {
    topics: ['JVM', 'stack e heap', 'String', 'wrappers', 'BigDecimal', 'datas', 'enums', 'records', 'annotations', 'reflection', 'sealed', 'I/O'],
    mentor: 'Você deixa de apenas escrever Java e começa a entender comportamento, tipos adequados e APIs essenciais de backend.',
    evidence: 'Escolher tipos e APIs explicando memória, precisão, imutabilidade e limites.',
    risk: 'Erros de dinheiro, data, memória e exceção aparecem quando a linguagem é tratada como mágica.'
  },
  M3: {
    topics: ['entrada e saída', 'responsabilidade', 'coesão', 'nomes', 'reuso', 'refatoração', 'debug', 'projetos console'],
    mentor: 'Método passa a representar intenção. Você aprende a quebrar um problema sem esconder a lógica em um bloco gigante.',
    evidence: 'Organizar um projeto console em funções pequenas, legíveis e diagnosticáveis.',
    risk: 'Métodos enormes misturam regras, dificultam testes e preparam services gigantes.'
  },
  M4: {
    topics: ['classes', 'objetos', 'estado', 'invariantes', 'encapsulamento', 'composição', 'identidade', 'valor', 'domínio'],
    mentor: 'Orientação a objetos deixa de ser vocabulário e vira proteção de regras e modelagem de comportamento.',
    evidence: 'Criar objetos válidos que protegem estado e expressam regras do negócio.',
    risk: 'Sem modelagem, o backend acumula entidades anêmicas e regras espalhadas em services.'
  },
  M5: {
    topics: ['List', 'Set', 'Map', 'Queue', 'Deque', 'ordenação', 'Comparator', 'critério de escolha'],
    mentor: 'Backend manipula conjuntos o tempo todo. Cada estrutura oferece garantias diferentes de ordem, unicidade e acesso.',
    evidence: 'Escolher a coleção pela regra do problema e justificar custo e comportamento.',
    risk: 'Usar sempre ArrayList esconde duplicidades, buscas ruins e intenção incorreta.'
  },
  M6: {
    topics: ['Generics', 'tipos parametrizados', 'wildcards', 'extends', 'super', 'PECS', 'type erasure', 'Optional'],
    mentor: 'Tipos genéricos permitem reuso com segurança; Optional modela ausência sem virar desculpa para esconder design ruim.',
    evidence: 'Criar APIs tipadas e explicar limites de variância, erasure e ausência.',
    risk: 'Generics crus e Optional indiscriminado transferem erros para pontos mais difíceis de diagnosticar.'
  },
  M7: {
    topics: ['functional interfaces', 'lambdas', 'method references', 'streams', 'map', 'filter', 'flatMap', 'collectors'],
    mentor: 'Você aprende a expressar transformações de dados sem transformar pipelines em código indecifrável.',
    evidence: 'Montar pipelines legíveis e reconhecer quando um laço é uma escolha melhor.',
    risk: 'Streams longas e efeitos colaterais escondidos produzem código elegante apenas na aparência.'
  },
  M8: {
    topics: ['checked e unchecked', 'erros por camada', 'arquivos', 'CSV', 'java.time', 'UUID', 'utilitários modernos'],
    mentor: 'Falhas, arquivos e tempo são partes reais do backend. Você aprende a modelar e recuperar problemas sem perder contexto.',
    evidence: 'Processar dados externos, tratar falhas e representar datas e identificadores corretamente.',
    risk: 'Capturar Exception genericamente ou tratar arquivo e data como texto cria falhas silenciosas.'
  },
  M9: {
    topics: ['SRP', 'OCP', 'LSP', 'ISP', 'DIP', 'acoplamento', 'refatoração', 'leitura de design'],
    mentor: 'SOLID é usado como ferramenta de diagnóstico de mudança, não como religião nem checklist decorativo.',
    evidence: 'Identificar uma pressão de mudança e refatorar dependências com justificativa.',
    risk: 'Aplicar princípios mecanicamente gera abstrações que custam mais do que resolvem.'
  },
  M10: {
    topics: ['Strategy', 'Factory', 'Builder', 'Adapter', 'Decorator', 'Observer', 'Command', 'Composite', 'critério'],
    mentor: 'Patterns dão nomes a soluções recorrentes, mas só fazem sentido quando o problema e o custo estão claros.',
    evidence: 'Reconhecer uma força de design, escolher um padrão e explicar quando não usá-lo.',
    risk: 'Pattern sem problema real cria arquitetura teatral e aumenta o custo de leitura.'
  },
  M11: {
    topics: ['JDK', 'Maven', 'Gradle', 'Git profissional', 'JUnit 5', 'Mockito', 'Testcontainers', 'WireMock', 'ArchUnit', 'qualidade estática', 'Docker', 'CI/CD'],
    mentor: 'Projeto profissional inclui build reproduzível, histórico, testes, análise e automação — não apenas arquivos Java.',
    evidence: 'Construir, testar, empacotar e verificar um projeto por um processo repetível.',
    risk: 'Sem build e testes confiáveis, toda mudança depende da memória e do ambiente de uma pessoa.'
  },
  M12: {
    topics: ['tabelas', 'chaves', 'relacionamentos', 'joins', 'agregações', 'índices', 'EXPLAIN', 'normalização', 'transações', 'locks', 'deadlocks'],
    mentor: 'Dado é estado de negócio. Você aprende SQL antes de delegar decisões ao ORM.',
    evidence: 'Modelar, consultar e diagnosticar um banco PostgreSQL com integridade e desempenho.',
    risk: 'JPA não corrige modelo ruim, consulta cara nem transação mal definida.'
  },
  M13: {
    topics: ['JDBC', 'DAO', 'JPA', 'Hibernate', 'Spring Data', 'persistence context', 'dirty checking', 'flush', 'lazy/eager', 'N+1', 'JPQL', 'paginação', 'locks'],
    mentor: 'Você liga Java ao banco entendendo o que acontece entre objeto, SQL, transação e cache de primeiro nível.',
    evidence: 'Persistir e consultar dados explicando SQL gerado, ciclo de vida e custo.',
    risk: 'Usar repository como mágica esconde N+1, inconsistência e consumo excessivo.'
  },
  M14: {
    topics: ['injeção de dependência', 'beans', 'controllers', 'DTOs', 'validation', 'services', 'transactions', 'exception handler', 'Problem Details', 'profiles', 'filtros', 'cache', 'OpenAPI', 'testes'],
    mentor: 'Spring Boot acelera a entrega quando você entende as responsabilidades que o framework conecta.',
    evidence: 'Criar uma API REST validada, testada, documentada e diagnosticável.',
    risk: 'Sem base, annotations escondem acoplamento, regras espalhadas e contratos frágeis.'
  },
  M15: {
    topics: ['autenticação', 'autorização', 'CORS', 'CSRF', 'headers', 'BCrypt', 'JWT', 'refresh token', 'OAuth2', 'OIDC', 'PKCE', 'Keycloak', 'secrets', 'LGPD', 'OWASP'],
    mentor: 'Segurança é engenharia de risco: identidade, permissão, dados e operação precisam ser protegidos por decisões explícitas.',
    evidence: 'Proteger fluxos, testar permissões e explicar ameaças e compensações.',
    risk: 'Adicionar JWT sem modelo de ameaça produz sensação de segurança, não proteção.'
  },
  M16: {
    topics: ['timeout', 'retry', 'circuit breaker', 'bulkhead', 'idempotência', 'webhook', 'SOAP', 'XML', 'CSV', 'SFTP', 'batch', 'RabbitMQ', 'Kafka', 'DLQ', 'Outbox', 'Saga', 'CDC'],
    mentor: 'Sistemas conversam e falham parcialmente. Você aprende a projetar integração para repetição, atraso e indisponibilidade.',
    evidence: 'Construir fluxos resilientes com contratos, rastreabilidade e recuperação.',
    risk: 'Retry e mensageria sem idempotência podem duplicar cobrança, pedido ou efeito de negócio.'
  },
  M17: {
    topics: ['Docker', 'Dockerfile', 'Compose', 'GitHub Actions', 'pipelines', 'Kubernetes', 'Ingress', 'probes', 'resources', 'HPA', 'Helm', 'cloud', 'custos'],
    mentor: 'Código precisa sair da máquina e chegar a ambientes de forma repetível, observável e segura.',
    evidence: 'Containerizar, automatizar e implantar uma aplicação entendendo recursos e falhas.',
    risk: 'Software que só funciona localmente ainda não é um serviço operável.'
  },
  M18: {
    topics: ['logs estruturados', 'correlation ID', 'Actuator', 'Micrometer', 'SLI/SLO/SLA', 'Prometheus', 'Grafana', 'OpenTelemetry', 'alertas', 'runbooks', 'postmortem', 'dumps', 'GC', 'load test', 'concorrência', 'virtual threads'],
    mentor: 'Produção exige evidência. Você aprende a observar comportamento, desempenho e concorrência antes de adivinhar.',
    evidence: 'Investigar um problema com logs, métricas, traces e dados de runtime.',
    risk: 'Sem observabilidade, a equipe descobre falhas pelo cliente e corrige por tentativa.'
  },
  M19: {
    topics: ['camadas', 'Clean Architecture', 'hexagonal', 'monólito modular', 'DDD', 'aggregates', 'domain events', 'bounded contexts', 'ACL', 'event storming', 'CQRS', 'event sourcing', 'CAP/PACELC', 'consistência eventual', 'design de sistemas', 'legado', 'ADR/RFC', 'liderança'],
    mentor: 'Arquitetura conecta domínio, dados, integração, operação, custo e evolução. A decisão precisa ter contexto e consequência.',
    evidence: 'Comparar alternativas, registrar trade-offs e defender fronteiras de um sistema.',
    risk: 'Arquitetura sem chão de código e produção vira diagrama sem poder explicativo.'
  },
  M20: {
    topics: ['projeto final', 'API', 'banco', 'testes', 'segurança', 'integração', 'observabilidade', 'Docker', 'pipeline', 'arquitetura', 'README', 'diagramas', 'trade-offs', 'portfólio', 'entrevistas', 'banca'],
    mentor: 'O conhecimento precisa virar uma entrega executável, documentada e defendida — não uma lista de cursos concluídos.',
    evidence: 'Apresentar um sistema completo, executar provas e responder por suas decisões.',
    risk: 'Portfólio sem execução, testes ou justificativa não demonstra capacidade profissional.'
  }
};

const PHASE_GUIDE = {
  base: {
    title: 'Base Java e domínio',
    promise: 'Sair do ambiente desconhecido para programas e modelos que você consegue ler, executar e explicar.',
    question: 'Consigo transformar uma regra em código organizado e diagnosticar o que aconteceu?'
  },
  'modern-java': {
    title: 'Java moderno e design',
    promise: 'Escolher estruturas, tratar falhas e organizar mudanças com tipos, princípios e padrões usados com critério.',
    question: 'Minha solução continua legível, segura e modificável quando o problema cresce?'
  },
  'backend-core': {
    title: 'Dados e backend profissional',
    promise: 'Construir uma API apoiada por build, testes, SQL e persistência compreendidos por baixo do framework.',
    question: 'O contrato, a regra, o dado e o teste formam um fluxo coerente?'
  },
  production: {
    title: 'Segurança, integração e produção',
    promise: 'Operar software que protege acesso, tolera falhas, chega ao ambiente e fornece evidência do próprio comportamento.',
    question: 'O que acontece quando uma dependência falha, a carga cresce ou uma ação se repete?'
  },
  architecture: {
    title: 'Arquitetura e defesa técnica',
    promise: 'Conectar todas as competências em decisões estruturais e em uma entrega que possa ser executada e defendida.',
    question: 'Qual alternativa permite evoluir com menos risco neste contexto?'
  }
};

const DEPENDENCY_ROUTES = [
  {
    id: 'spring',
    label: 'Construir uma API Spring',
    route: ['M0', 'M1', 'M3', 'M4', 'M11', 'M12', 'M13', 'M14'],
    reason: 'Ambiente executa; Java expressa; métodos e OO organizam; ferramentas testam; SQL e persistência protegem o dado; Spring conecta o fluxo.',
    skipped: 'Pular para M14 pode produzir um controller que responde, mas não uma aplicação compreendida e sustentável.'
  },
  {
    id: 'jpa',
    label: 'Usar JPA sem trabalhar no escuro',
    route: ['M1', 'M4', 'M12', 'M13'],
    reason: 'Java representa objetos; OO modela comportamento; SQL explica o banco; JPA coordena o mapeamento e o ciclo de persistência.',
    skipped: 'Sem SQL, problemas de N+1, transação, índice e consulta viram sintomas misteriosos do framework.'
  },
  {
    id: 'production',
    label: 'Levar um serviço à produção',
    route: ['M11', 'M14', 'M15', 'M16', 'M17', 'M18'],
    reason: 'Build e testes criam confiança; a API expõe contrato; segurança controla acesso; integração trata falhas; entrega publica; observabilidade permite operar.',
    skipped: 'Deploy sem segurança, resiliência e evidência apenas move o risco para um ambiente mais caro.'
  },
  {
    id: 'architecture',
    label: 'Tomar uma decisão arquitetural',
    route: ['M4', 'M9', 'M10', 'M12', 'M14', 'M16', 'M18', 'M19'],
    reason: 'Domínio, design, dados, aplicação, integração e produção fornecem as restrições reais que uma arquitetura precisa equilibrar.',
    skipped: 'Sem contato com as consequências, arquitetura vira preferência estética ou coleção de nomes.'
  }
];

const RESPONSIBILITY_LEVELS = [
  {
    id: 'beginner', label: 'Iniciante', question: 'Onde executo e por que deu erro?',
    sees: ['status permitido', 'comparação booleana', 'mensagem final'],
    delivery: 'Consegue seguir e explicar um exemplo pequeno com apoio.',
    boundary: 'Ainda precisa de base, repetição e ajuda para decompor a regra.'
  },
  {
    id: 'junior', label: 'Júnior', question: 'Como faço o reagendamento funcionar?',
    sees: ['endpoint', 'validação básica', 'service', 'persistência simples'],
    delivery: 'Implementa uma tarefa pequena seguindo o padrão e pede direção em decisões novas.',
    boundary: 'Ainda pode não perceber transação, contrato, duplicidade e impacto lateral.'
  },
  {
    id: 'mid', label: 'Pleno', question: 'Como faço certo dentro deste sistema?',
    sees: ['DTO e contrato', 'regra de status', 'transação', 'histórico', 'testes'],
    delivery: 'Entrega o fluxo completo com autonomia razoável e integra as camadas existentes.',
    boundary: 'Precisa ampliar a visão de falhas distribuídas, operação e decisões entre times.'
  },
  {
    id: 'senior', label: 'Sênior', question: 'Que risco esta mudança cria?',
    sees: ['idempotência', 'concorrência', 'auditoria', 'compatibilidade', 'observabilidade'],
    delivery: 'Reduz risco técnico, antecipa cenários e ajuda outras pessoas a tomar decisões.',
    boundary: 'Impacto sistêmico e organizacional pode exigir atuação além do próprio serviço.'
  },
  {
    id: 'engineer', label: 'Staff/Engenheiro', question: 'Como este fluxo afeta sistemas e times?',
    sees: ['contratos entre sistemas', 'padrões da plataforma', 'estratégia de testes', 'custos', 'governança'],
    delivery: 'Melhora a saúde de múltiplos serviços e cria direção técnica reutilizável.',
    boundary: 'Precisa equilibrar padronização com autonomia e contexto de cada domínio.'
  },
  {
    id: 'architect', label: 'Arquiteto', question: 'Qual estrutura permite evoluir com menos risco?',
    sees: ['bounded context', 'sincronia vs eventos', 'consistência', 'falha parcial', 'evolução de legado'],
    delivery: 'Torna decisões estruturais explícitas, defensáveis e alinhadas ao negócio.',
    boundary: 'Não pode se afastar do código, dos dados e da operação que validam suas decisões.'
  }
];

const PERSONAL_MAP_TEMPLATE = `# Meu mapa da Formação Java Backend

## Meu destino técnico
Quero conseguir construir e explicar...

## Três módulos que mais despertam meu interesse
- M__ — porque...
- M__ — porque...
- M__ — porque...

## Três módulos que hoje parecem mais difíceis
- M__ — minha dúvida atual é...
- M__ — minha dúvida atual é...
- M__ — minha dúvida atual é...

## Uma rota de dependências que eu consigo explicar
Para chegar a M__, preciso passar por... porque...

## Evidência que quero produzir
Ao terminar essa rota, quero provar que consigo...

## O que não vou fazer
Não vou pular... porque...

## Pergunta para o diagnóstico da aula 002
Ainda não sei medir se consigo...`;

const steps = [
  {
    id: 'ler-mapa', label: 'Como ler o mapa', eyebrow: 'Comece aqui',
    title: 'Cada módulo existe para formar uma capacidade', duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Na abertura você conheceu o destino. Agora vamos abrir a engenharia do percurso. Não pergunte apenas “qual tecnologia aparece?”. Pergunte: “qual problema este módulo me ensina a resolver, qual risco ele reduz e que evidência prova que aprendi?”.' },
      { type: 'systemMap' },
      { type: 'result', title: 'Quatro escalas que você aprenderá a conectar', items: ['Java: expressar comportamento com precisão', 'Backend: proteger regra, estado e contratos', 'Engenharia: reduzir risco de mudança e operação', 'Arquitetura: decidir estrutura, fronteiras e trade-offs'] },
      { type: 'note', tone: 'info', title: 'Seu lugar agora', text: 'Você está em M0.01. Não precisa dominar os termos do final. Precisa reconhecer que eles possuem pré-requisitos e saber localizar onde serão construídos.' }
    ]
  },
  {
    id: 'dependencias', label: 'Por que existe ordem', eyebrow: 'Etapa 1',
    title: 'Selecione um destino e veja o chão necessário', duration: '9 min',
    blocks: [
      { type: 'dependencyRoutes' },
      { type: 'note', tone: 'warning', title: 'Ordem não é burocracia', text: 'Você pode encontrar um conceito avançado antes da hora. O que não deve fazer é confundir reconhecimento com domínio ou abandonar a sequência que constrói as dependências.' },
      { type: 'result', title: 'Dependências que você deve conseguir explicar', items: ['JPA depende de Java, modelagem e SQL', 'Spring depende de Java, OO, HTTP, build e persistência', 'Testes bons dependem de responsabilidade e design', 'Arquitetura depende de código, domínio, dados, integração e produção'] }
    ]
  },
  {
    id: 'base', label: 'M0–M4 · Base', eyebrow: 'Etapa 2',
    title: 'Construa autonomia, linguagem e domínio', duration: '14 min',
    blocks: [
      { type: 'moduleAtlas', phaseId: 'base', initialModule: 'M0' },
      { type: 'note', tone: 'info', title: 'Pensamento arquitetural já começou', text: 'Escolher um nome claro, separar uma responsabilidade e proteger uma regra são decisões pequenas de arquitetura. O M19 amplia esse raciocínio; ele não o inventa do nada.' }
    ]
  },
  {
    id: 'java-moderno', label: 'M5–M10 · Design', eyebrow: 'Etapa 3',
    title: 'Faça o código continuar saudável quando crescer', duration: '14 min',
    blocks: [
      { type: 'moduleAtlas', phaseId: 'modern-java', initialModule: 'M5' },
      { type: 'note', tone: 'warning', title: 'Ferramenta não substitui critério', text: 'Stream, Optional, SOLID e patterns podem melhorar uma solução ou apenas esconder complexidade. Em cada módulo, você praticará também quando não usar.' }
    ]
  },
  {
    id: 'backend', label: 'M11–M14 · Backend', eyebrow: 'Etapa 4',
    title: 'Ligue build, testes, dados e API sem magia', duration: '15 min',
    blocks: [
      { type: 'moduleAtlas', phaseId: 'backend-core', initialModule: 'M11' },
      { type: 'note', tone: 'danger', title: 'Backend não é só REST', text: 'Controller é a superfície. Regra, transação, banco, teste, contrato, falha e rastreabilidade determinam se a funcionalidade é confiável.' }
    ]
  },
  {
    id: 'producao', label: 'M15–M18 · Produção', eyebrow: 'Etapa 5',
    title: 'Projete para acesso indevido, falha parcial e operação real', duration: '15 min',
    blocks: [
      { type: 'moduleAtlas', phaseId: 'production', initialModule: 'M15' },
      { type: 'note', tone: 'info', title: 'Produção muda a pergunta', text: 'Localmente você pergunta “funcionou?”. Em produção precisa perguntar “é seguro, repetível, observável, recuperável e sustentável sob carga?”.' }
    ]
  },
  {
    id: 'arquitetura', label: 'M19–M20 · Defesa', eyebrow: 'Etapa 6',
    title: 'Una o percurso em decisões e em uma entrega defensável', duration: '12 min',
    blocks: [
      { type: 'moduleAtlas', phaseId: 'architecture', initialModule: 'M19' },
      { type: 'result', title: 'O projeto final precisa mostrar', items: ['Código e domínio compreensíveis', 'API, banco e testes executáveis', 'Segurança, integração e observabilidade verificáveis', 'Entrega reproduzível com documentação', 'Decisões e trade-offs que você consegue defender'] }
    ]
  },
  {
    id: 'senioridade', label: 'Lentes de carreira', eyebrow: 'Etapa 7',
    title: 'A mesma tarefa revela diferentes responsabilidades', duration: '13 min',
    blocks: [
      { type: 'lead', text: 'Cenário: uma atividade de ordem de serviço só pode ser reagendada em status permitido. Ao mudar a data, o sistema registra histórico, gera ocorrência e pode notificar outro sistema. Se uma parte falhar, o estado não pode ficar incoerente.' },
      { type: 'responsibilityLens' },
      { type: 'note', tone: 'warning', title: 'Senioridade não é uma pontuação do curso', text: 'O mapa apresenta capacidades que você estudará. Autonomia, impacto, comunicação e experiência em contexto real continuam sendo construídos no trabalho e em projetos sérios.' }
    ]
  },
  {
    id: 'mapa-pessoal', label: 'Seu mapa pessoal', eyebrow: 'Etapa 8',
    title: 'Escolha direção agora; meça o ponto de partida na próxima aula', duration: '14 min',
    blocks: [
      { type: 'errors' },
      { type: 'actions', title: 'Produza uma síntese que você conseguirá revisar depois', items: ['Abra o diario-formacao.md criado na abertura ou crie um arquivo mapa-formacao.md.', 'Explore novamente os módulos antes de escolher os que atraem ou preocupam você.', 'Escolha uma rota de dependências e explique cada ligação com suas palavras.', 'Defina uma evidência de capacidade, não apenas “terminar o módulo”.', 'Salve e abra novamente o arquivo para confirmar sua entrega.'] },
      { type: 'markdown', name: 'mapa-formacao.md', content: PERSONAL_MAP_TEMPLATE },
      { type: 'challenge', title: 'Desafio de leitura do mapa', text: 'Sem consultar o texto da aula, explique em voz alta por que não faz sentido começar por Spring, JPA ou arquitetura sem suas bases. Depois registre uma rota no arquivo.', acceptance: ['Você nomeou pelo menos quatro dependências reais', 'Escolheu módulos por capacidade, não por moda', 'Separou interesse atual de domínio comprovado', 'Definiu uma evidência que poderá ser executada ou explicada', 'Deixou uma pergunta específica para o diagnóstico da aula 002'] },
      { type: 'note', tone: 'info', title: 'Próxima aula: diagnóstico, não julgamento', text: 'Na aula 002 você medirá sete áreas iniciais e transformará o ponto de partida em um plano. Aqui definimos para onde o caminho leva; lá descobriremos de onde você parte.' }
    ]
  }
];

const commonErrors = [
  ['Querer pular a base', 'Volte à rota do seu destino e escreva o que cada pré-requisito evita. Velocidade sem chão reaparece como bloqueio.'],
  ['Achar que a ferramenta pensa', 'IDE, Spring e IA aceleram ações; regra, diagnóstico e decisão continuam exigindo raciocínio e evidência.'],
  ['Confundir volume com evolução', 'Troque “quantas aulas vi?” por “o que consigo produzir, executar, diagnosticar e explicar?”.'],
  ['Deixar arquitetura só para o final', 'Pratique intenção, responsabilidade e acoplamento desde os primeiros métodos; o alcance cresce ao longo do curso.'],
  ['Reduzir backend a endpoint', 'Sempre procure regra, estado, transação, segurança, integração, falha, observabilidade e operação.'],
  ['Tentar estudar tudo ao mesmo tempo', 'Mantenha um foco principal e use o mapa apenas para enxergar dependências. A aula 002 ajudará a montar o plano.']
];

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  return <button type="button" className="guided-copy" onClick={copy} aria-label="Copiar modelo do mapa">{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : 'Copiar modelo'}</button>;
}

function SystemMap() {
  const [selected, setSelected] = useState('rule');
  const nodes = [
    ['screen', 'Tela', 'Solicita reagendamento e mostra resultado; não decide sozinha a regra.'],
    ['api', 'API', 'Recebe o contrato, valida formato e coordena a resposta HTTP.'],
    ['rule', 'Domínio', 'Decide se o status permite reagendar e protege invariantes.'],
    ['data', 'Banco', 'Atualiza atividade, histórico e ocorrência com consistência.'],
    ['event', 'Integração', 'Notifica outros sistemas sem duplicar efeitos quando houver repetição.'],
    ['ops', 'Produção', 'Logs, métricas e traces permitem investigar sucesso e falha.']
  ];
  const current = nodes.find(([id]) => id === selected) || nodes[0];
  return (
    <section className="map-system">
      <div className="map-system-track" aria-label="Fluxo de uma ordem de serviço">
        {nodes.map(([id, label], index) => <React.Fragment key={id}><button type="button" className={selected === id ? 'active' : ''} aria-pressed={selected === id} onClick={() => setSelected(id)}><span>{String(index + 1).padStart(2, '0')}</span>{label}</button>{index < nodes.length - 1 && <ArrowRight size={15} aria-hidden="true" />}</React.Fragment>)}
      </div>
      <div className="map-system-detail" aria-live="polite"><strong>{current[1]}</strong><p>{current[2]}</p></div>
    </section>
  );
}

function DependencyRoutes() {
  const [selectedId, setSelectedId] = useState(DEPENDENCY_ROUTES[0].id);
  const selected = DEPENDENCY_ROUTES.find(route => route.id === selectedId) || DEPENDENCY_ROUTES[0];
  return (
    <section className="map-dependencies">
      <div className="map-dependency-tabs" role="tablist" aria-label="Destinos técnicos">
        {DEPENDENCY_ROUTES.map(route => <button type="button" role="tab" aria-selected={selectedId === route.id} className={selectedId === route.id ? 'active' : ''} onClick={() => setSelectedId(route.id)} key={route.id}>{route.label}</button>)}
      </div>
      <div className="map-route" role="tabpanel" aria-live="polite">
        <div className="map-route-line" aria-label={`Rota: ${selected.route.join(', ')}`}>{selected.route.map((moduleId, index) => <React.Fragment key={moduleId}><span>{moduleId}</span>{index < selected.route.length - 1 && <ArrowRight size={15} aria-hidden="true" />}</React.Fragment>)}</div>
        <p><strong>Por que esta rota existe:</strong> {selected.reason}</p>
        <aside><AlertTriangle size={18} /><span><strong>Se você pular o chão:</strong> {selected.skipped}</span></aside>
      </div>
    </section>
  );
}

function ModuleAtlas({ phaseId, initialModule }) {
  const [selectedId, setSelectedId] = useState(initialModule);
  const phase = COURSE_PHASES.find(item => item.id === phaseId);
  const moduleIds = (phase?.modules || []).filter(id => id !== 'P0');
  const modules = COURSE_MODULES.filter(module => moduleIds.includes(module.id));
  const selected = modules.find(module => module.id === selectedId) || modules[0];
  const guide = MODULE_GUIDE[selected.id];
  const phaseGuide = PHASE_GUIDE[phaseId];
  const lessonCount = modules.reduce((sum, module) => sum + module.lessons, 0);

  useEffect(() => setSelectedId(initialModule), [initialModule]);

  return (
    <section className="map-atlas">
      <header className="map-atlas-header">
        <div><span>{phase?.name}</span><h3>{phaseGuide.title}</h3><p>{phaseGuide.promise}</p></div>
        <div><strong>{modules.length}</strong><span>módulos</span><strong>{lessonCount}</strong><span>aulas</span></div>
      </header>
      <div className="map-atlas-body">
        <div className="map-module-list" role="tablist" aria-label={`Módulos da ${phase?.name}`}>
          {modules.map(module => <button type="button" role="tab" aria-selected={selected.id === module.id} className={selected.id === module.id ? 'active' : ''} onClick={() => setSelectedId(module.id)} key={module.id}><span>{module.id}</span><strong>{module.shortTitle}</strong><small>Aulas {module.range}</small></button>)}
        </div>
        <div className="map-module-detail" role="tabpanel" aria-live="polite">
          <div className="map-module-title"><span>{selected.id} · {selected.lessons} aulas</span><h3>{selected.title}</h3></div>
          <p className="map-mentor-voice"><GraduationCap size={20} /><span><strong>Como seu mentor, quero que você entenda:</strong> {guide.mentor}</span></p>
          <div className="map-module-topics" aria-label="Tópicos principais">{guide.topics.map(topic => <span key={topic}>{topic}</span>)}</div>
          <div className="map-module-evidence"><article><ClipboardCheck size={19} /><div><strong>Evidência de aprendizagem</strong><p>{guide.evidence}</p></div></article><article><ShieldAlert size={19} /><div><strong>Risco de pular</strong><p>{guide.risk}</p></div></article></div>
        </div>
      </div>
      <footer><Target size={16} /><span>Pergunta da fase: <strong>{phaseGuide.question}</strong></span></footer>
    </section>
  );
}

function ResponsibilityLens() {
  const [selectedId, setSelectedId] = useState(RESPONSIBILITY_LEVELS[0].id);
  const selected = RESPONSIBILITY_LEVELS.find(level => level.id === selectedId) || RESPONSIBILITY_LEVELS[0];
  return (
    <section className="map-responsibility">
      <div className="map-level-tabs" role="tablist" aria-label="Lentes de responsabilidade">
        {RESPONSIBILITY_LEVELS.map((level, index) => <button type="button" role="tab" aria-selected={selectedId === level.id} className={selectedId === level.id ? 'active' : ''} onClick={() => setSelectedId(level.id)} key={level.id}><span>{index + 1}</span>{level.label}</button>)}
      </div>
      <div className="map-level-detail" role="tabpanel" aria-live="polite">
        <span>Pergunta principal</span><blockquote>{selected.question}</blockquote>
        <div className="map-level-sees"><strong>O que esta lente enxerga</strong>{selected.sees.map(item => <span key={item}><CheckCircle2 size={14} />{item}</span>)}</div>
        <div className="map-level-boundary"><article><strong>Entrega esperada</strong><p>{selected.delivery}</p></article><article><strong>Próxima fronteira</strong><p>{selected.boundary}</p></article></div>
      </div>
    </section>
  );
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'systemMap') return <SystemMap />;
  if (block.type === 'dependencyRoutes') return <DependencyRoutes />;
  if (block.type === 'moduleAtlas') return <ModuleAtlas phaseId={block.phaseId} initialModule={block.initialModule} />;
  if (block.type === 'responsibilityLens') return <ResponsibilityLens />;

  if (block.type === 'result') return <section className="guided-result"><h3><ClipboardCheck size={20} /> {block.title}</h3><ul>{block.items.map(item => <li key={item}><CheckCircle2 size={16} /> {item}</li>)}</ul></section>;

  if (block.type === 'note') {
    const Icon = block.tone === 'danger' ? ShieldAlert : block.tone === 'warning' ? AlertTriangle : Lightbulb;
    return <aside className={`guided-note ${block.tone || 'info'}`}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>;
  }

  if (block.type === 'errors') return <section className="guided-errors"><h3><RotateCcw size={20} /> Erros de leitura do mapa e como corrigir</h3><div className="guided-error-grid">{commonErrors.map(([title, fix]) => <article key={title}><code>{title}</code><p>{fix}</p></article>)}</div></section>;

  if (block.type === 'actions') return <section className="map-actions"><h3><BookOpenCheck size={20} /> {block.title}</h3><ol>{block.items.map((item, index) => <li key={item}><span>{index + 1}</span><p>{item}</p></li>)}</ol></section>;

  if (block.type === 'markdown') return <div className="guided-file map-markdown"><div className="guided-file-title"><FileText size={17} /> {block.name}<CopyButton value={block.content} /></div><SyntaxHighlighter language="markdown" style={oneLight} wrapLongLines customStyle={{ margin: 0, padding: '20px', background: '#f8fafc', fontSize: '.84rem', lineHeight: 1.7 }} codeTagProps={{ style: { fontFamily: '"Cascadia Code", Consolas, monospace' } }}>{block.content}</SyntaxHighlighter></div>;

  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Compass size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;

  return null;
}

export default function GuidedCourseMapLesson001({
  isCompleted,
  onToggleCompleted,
  onNextLesson,
  onPrevLesson,
  hasNextLesson,
  hasPrevLesson
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const completionNormalizedRef = useRef(false);
  const [completedStepIds, setCompletedStepIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LESSON_STORAGE_KEY) || '[]');
      return new Set(Array.isArray(saved) ? saved : []);
    } catch {
      return new Set();
    }
  });

  useEffect(() => localStorage.setItem(LESSON_STORAGE_KEY, JSON.stringify([...completedStepIds])), [completedStepIds]);

  const activeStep = steps[activeIndex];
  const progress = Math.round((completedStepIds.size / steps.length) * 100);
  const allStepsComplete = completedStepIds.size === steps.length;
  const activeStepComplete = completedStepIds.has(activeStep.id);
  const lessonComplete = isCompleted && allStepsComplete;
  const completedLabel = useMemo(() => `${completedStepIds.size} de ${steps.length} etapas concluídas`, [completedStepIds]);

  useEffect(() => {
    if (completionNormalizedRef.current) return;
    completionNormalizedRef.current = true;
    if (isCompleted && !allStepsComplete) onToggleCompleted();
  }, [allStepsComplete, isCompleted, onToggleCompleted]);

  const selectStep = index => {
    setActiveIndex(index);
    document.querySelector('.content-scroll-area')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleActiveStep = () => {
    if (activeStepComplete && isCompleted) onToggleCompleted();
    setCompletedStepIds(previous => {
      const next = new Set(previous);
      if (next.has(activeStep.id)) next.delete(activeStep.id);
      else next.add(activeStep.id);
      return next;
    });
  };

  return (
    <article className="guided-git-lesson guided-map-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker"><Telescope size={17} /> Mentoria de percurso</span>
          <p className="guided-sequence">001 · M0.01</p>
          <h1>O mapa completo da formação</h1>
          <p>Explore os 21 módulos, entenda suas dependências e aprenda a reconhecer a capacidade profissional que cada etapa constrói.</p>
        </div>
        <div className="guided-hero-status"><Orbit size={42} /><strong>{progress}%</strong><span>{completedLabel}</span></div>
        <div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}><span style={{ width: `${progress}%` }} /></div>
      </header>

      <div className="map-course-facts" aria-label="Dimensão da formação"><span><strong>{COURSE_MODULE_COUNT}</strong> módulos</span><i /><span><strong>{COURSE_TOTAL_LESSONS - 1}</strong> aulas numeradas</span><i /><span><strong>5</strong> fases conectadas</span></div>

      <div className="guided-layout">
        <nav className="guided-step-nav" aria-label="Etapas da aula 001">
          <div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro guiado</div>
          {steps.map((step, index) => <button type="button" key={step.id} className={`${index === activeIndex ? 'active' : ''} ${completedStepIds.has(step.id) ? 'done' : ''}`} onClick={() => selectStep(index)}><span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}
        </nav>

        <main className="guided-step-content">
          <div className="guided-step-heading"><span>{activeStep.eyebrow} · {activeStep.duration}</span><h2>{activeStep.title}</h2></div>
          <div className="guided-blocks">{activeStep.blocks.map((block, index) => <ContentBlock block={block} key={`${activeStep.id}-${block.type}-${index}`} />)}</div>

          <div className="guided-step-actions">
            <button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button>
            <div className="guided-step-actions-main"><button type="button" className={`step-toggle ${activeStepComplete ? 'undo' : 'complete'}`} onClick={toggleActiveStep}>{activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><Check size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div>
          </div>

          {allStepsComplete && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>{lessonComplete ? 'Mapa concluído' : 'Percurso compreendido'}</h3><p>{lessonComplete ? 'Todas as etapas e a conclusão da aula estão registradas.' : 'Conclua a aula para liberar o diagnóstico do seu ponto de partida.'}</p></div><button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}
        </main>
      </div>

      <footer className="guided-course-nav">
        <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 000</button>
        <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>{lessonComplete ? <CheckCircle2 size={18} /> : <ListChecks size={18} />}<span><strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong><small>{lessonComplete ? 'Progresso registrado' : allStepsComplete ? 'Use o botão acima' : 'Complete o mapa guiado'}</small></span></div>
        <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas e a aula para avançar' : 'Abrir diagnóstico inicial'}>Aula 002 <ArrowRight size={17} /></button>
      </footer>
    </article>
  );
}
