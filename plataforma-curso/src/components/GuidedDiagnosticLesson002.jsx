import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  BrainCircuit,
  CalendarClock,
  Check,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Code2,
  Compass,
  Copy,
  Database,
  FileText,
  GitBranch,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
  ListChecks,
  Network,
  RotateCcw,
  Scale,
  ShieldAlert,
  Target,
  Terminal
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedDiagnosticLesson.css';

const LESSON_STORAGE_KEY = 'guided-diagnostic-lesson-002-progress';
const DIAGNOSTIC_STORAGE_KEY = 'guided-diagnostic-lesson-002-answers';

const LEVELS = [
  {
    value: 1,
    short: 'Quase não conheço',
    description: 'O assunto ainda é novo. Não consigo explicar nem executar uma tarefa mínima sem um roteiro completo.',
    evidence: 'Use quando você ainda precisa começar pelo primeiro exemplo.'
  },
  {
    value: 2,
    short: 'Já vi, preciso de apoio',
    description: 'Reconheço termos ou já acompanhei alguém, mas ainda dependo de instruções para agir.',
    evidence: 'Ter visto uma aula ou ferramenta é exposição; ainda não é autonomia.'
  },
  {
    value: 3,
    short: 'Faço algo simples',
    description: 'Consigo executar uma tarefa pequena sozinho e explicar o caminho principal.',
    evidence: 'Você deve conseguir citar um exemplo concreto que fez sem copiar passo a passo.'
  },
  {
    value: 4,
    short: 'Autonomia razoável',
    description: 'Resolvo situações comuns, leio erros e encontro o próximo teste quando algo sai diferente.',
    evidence: 'A prova inclui diagnóstico, não apenas repetir o caminho feliz.'
  },
  {
    value: 5,
    short: 'Explico e diagnostico',
    description: 'Consigo aplicar, comparar alternativas, diagnosticar falhas e ensinar outra pessoa com precisão.',
    evidence: 'Cinco é uma responsabilidade alta; não significa “já ouvi falar bastante”.'
  }
];

const AREAS = {
  logic: {
    label: 'Lógica',
    icon: BrainCircuit,
    purpose: 'Transformar uma regra escrita em passos, decisões, repetições e verificações.',
    impact: 'Sem lógica, a sintaxe pode ser decorada, mas qualquer mudança na regra paralisa a implementação.',
    questions: [
      'Consigo transformar uma regra escrita em passos?',
      'Consigo usar if sem me perder?',
      'Consigo explicar um laço?',
      'Consigo procurar um item em uma lista?'
    ],
    nextFocus: 'decompor uma regra pequena antes de escrever código'
  },
  java: {
    label: 'Java básico',
    icon: Code2,
    purpose: 'Usar classe, main, variável, tipo, String, condição, laço, método e array com intenção.',
    impact: 'Pular a linguagem e correr para Spring cria endpoints copiados sem compreensão do comportamento.',
    questions: [
      'Consigo escrever uma classe simples?',
      'Consigo criar variáveis?',
      'Consigo compilar e executar?',
      'Consigo ler um erro de compilação?'
    ],
    nextFocus: 'escrever, executar e explicar um programa Java mínimo'
  },
  terminal: {
    label: 'Terminal e ambiente',
    icon: Terminal,
    purpose: 'Localizar arquivos, navegar, executar ferramentas, validar versões e ler mensagens sem depender só da IDE.',
    impact: 'Quem não enxerga pasta, processo e comando sofre para rodar projeto, teste, Maven, Git, Docker e logs.',
    questions: [
      'Consigo navegar até a pasta do projeto?',
      'Consigo listar arquivos?',
      'Consigo rodar comandos?',
      'Consigo validar versões?'
    ],
    nextFocus: 'localizar-se e confirmar o ambiente antes de executar comandos'
  },
  git: {
    label: 'Git',
    icon: GitBranch,
    purpose: 'Ver o que mudou, escolher arquivos, registrar versões, consultar histórico e evitar lixo versionado.',
    impact: 'Sem histórico confiável, mudanças causam medo; com Git bem usado, o time ganha rastreabilidade.',
    questions: [
      'Consigo ver o que mudou?',
      'Consigo adicionar arquivos?',
      'Consigo criar um commit?',
      'Consigo consultar o histórico?'
    ],
    nextFocus: 'distinguir alteração, preparação, commit e histórico'
  },
  database: {
    label: 'Banco de dados',
    icon: Database,
    purpose: 'Pensar em tabelas, colunas, linhas, chaves, relações, constraints, consultas, índices e transações.',
    impact: 'Banco guarda estado de negócio; usar JPA sem SQL transforma consistência e desempenho em mistério.',
    questions: [
      'Consigo explicar tabela e coluna?',
      'Consigo fazer um SELECT simples?',
      'Consigo explicar uma chave primária?',
      'Consigo entender um relacionamento básico?'
    ],
    nextFocus: 'representar um dado em tabela e consultá-lo com SQL simples'
  },
  http: {
    label: 'API e HTTP',
    icon: Network,
    purpose: 'Ler contratos com request, response, método, headers, body, JSON e status code.',
    impact: 'API não é apenas uma URL; sem semântica HTTP, o endpoint responde, mas o contrato fica incoerente.',
    questions: [
      'Consigo explicar request e response?',
      'Consigo diferenciar GET e POST?',
      'Consigo entender 200, 400, 404 e 500?',
      'Consigo ler um JSON?'
    ],
    nextFocus: 'explicar uma requisição e justificar método, corpo e resposta'
  },
  routine: {
    label: 'Rotina de estudo',
    icon: CalendarClock,
    purpose: 'Manter uma cadência possível com aula atenta, prática, diário, revisão, dúvidas e retomada sem culpa.',
    impact: 'Sem rotina sustentável, a formação vira intensidade de poucos dias e longos recomeços.',
    questions: [
      'Consigo estudar com frequência?',
      'Consigo registrar o que aprendi?',
      'Consigo voltar depois sem me perder?',
      'Consigo terminar uma aula com calma?'
    ],
    nextFocus: 'definir uma cadência pequena que possa ser mantida por meses'
  }
};

const EMPTY_DIAGNOSTIC = Object.fromEntries(
  Object.keys(AREAS).map(id => [id, { level: 0, evidence: '' }])
);

const BACKEND_CHAIN = [
  {
    id: 'logic', label: 'Lógica', action: 'Decide se o status atual permite reagendar.',
    future: 'Depois essa decisão será protegida por testes e regras de domínio.',
    risk: 'A regra muda e o fluxo quebra porque ninguém consegue decompô-la.'
  },
  {
    id: 'java', label: 'Java', action: 'Representa status, datas, métodos e o fluxo da decisão.',
    future: 'OO organizará OrdemServico, Atividade, Histórico e Ocorrência.',
    risk: 'A aplicação compila por cópia, mas a equipe não entende seu comportamento.'
  },
  {
    id: 'database', label: 'Banco', action: 'Atualiza atividade e registra histórico e ocorrência com consistência.',
    future: 'Transações garantirão que tudo aconteça ou que nada permaneça pela metade.',
    risk: 'A data muda, mas o histórico falha e o estado do negócio fica contraditório.'
  },
  {
    id: 'http', label: 'API/HTTP', action: 'Recebe o pedido, valida o contrato e devolve uma resposta adequada.',
    future: 'DTOs, validação e status HTTP tornarão o contrato explícito.',
    risk: 'Cliente e servidor discordam sobre entrada, sucesso e falha.'
  },
  {
    id: 'terminal', label: 'Terminal', action: 'Executa o projeto, testes e ferramentas e permite observar mensagens.',
    future: 'Maven, Docker e logs usarão essa autonomia operacional.',
    risk: 'Qualquer falha fora do botão verde da IDE vira um bloqueio.'
  },
  {
    id: 'git', label: 'Git', action: 'Registra a mudança e permite comparar, revisar e recuperar o histórico.',
    future: 'Branches, pull requests e code review ampliarão a colaboração.',
    risk: 'Uma alteração difícil de rastrear chega ao sistema sem uma volta segura.'
  },
  {
    id: 'routine', label: 'Rotina', action: 'Transforma tentativa isolada em prática, registro, revisão e melhoria.',
    future: 'A constância permitirá integrar testes, logs, produção e arquitetura.',
    risk: 'Os mesmos bloqueios retornam porque não houve prática nem evidência registrada.'
  }
];

const GAP_REWRITES = [
  {
    generic: 'Não sei Java.',
    specific: 'Ainda não consigo declarar um método com retorno e explicar de onde vem o valor retornado.',
    smallest: 'Escrever um método que soma dois inteiros, executá-lo com dois exemplos e prever a saída antes de rodar.'
  },
  {
    generic: 'Tenho dificuldade com terminal.',
    specific: 'Ainda erro ao identificar em qual pasta o terminal está antes de executar um comando.',
    smallest: 'Na aula apropriada, abrir o terminal, consultar a pasta atual e localizar um único arquivo conhecido.'
  },
  {
    generic: 'Não entendo Git.',
    specific: 'Ainda não consigo explicar a diferença entre uma alteração, a área de preparação e um commit.',
    smallest: 'Depois da Aula 10, alterar um arquivo e observar o estado antes e depois de cada ação.'
  },
  {
    generic: 'Não entendo API.',
    specific: 'Ainda confundo o que pertence à requisição e o que pertence à resposta HTTP.',
    smallest: 'Ler um exemplo com método, URL, body e status e classificar cada parte.'
  }
];

const FUTURE_GIT_COMMANDS = `git status
git add docs/diagnostico-inicial.md
git commit -m "Adiciona diagnostico inicial tecnico"
git status`;

const steps = [
  {
    id: 'pacto', label: 'O que estamos medindo', eyebrow: 'Comece aqui',
    title: 'Diagnóstico não mede valor; ele transforma bagagem em direção', duration: '7 min',
    blocks: [
      { type: 'lead', text: 'Na Aula 1 você escolheu a direção. Agora sentaremos como aluno e mentor para localizar o ponto de partida. Não existe resposta bonita: existe resposta útil, sustentada por uma evidência que você consegue mostrar.' },
      { type: 'baggage' },
      { type: 'result', title: 'Ao final desta consulta você terá', items: ['Sete áreas avaliadas sem comparação com outras pessoas', 'Forças e lacunas descritas de modo específico', 'Um horizonte possível de 30, 60 e 90 dias', 'Um arquivo que permitirá comparar evolução depois'] },
      { type: 'note', tone: 'info', title: 'Meu papel como seu professor', text: 'Eu não usarei o resultado para apressar nem rebaixar você. Ele serve para ajustar atenção, exemplos e revisão sem quebrar a sequência da formação.' }
    ]
  },
  {
    id: 'escala', label: 'Calibrar a escala', eyebrow: 'Etapa 1',
    title: 'Troque sensação por uma evidência que possa ser observada', duration: '9 min',
    blocks: [
      { type: 'calibration' },
      { type: 'note', tone: 'warning', title: 'Reconhecer não é executar', text: 'Ter visto Postman, Git ou uma classe Java pode justificar familiaridade, mas não autonomia. Para usar 3, 4 ou 5, escreva algo que você realmente consegue fazer.' },
      { type: 'result', title: 'Regra de honestidade', items: ['Se estiver entre dois níveis, escolha o menor e registre o que falta para o próximo', 'Nível 1 não é fracasso; é um começo visível', 'Nível 5 exige aplicação, diagnóstico e capacidade de explicar', 'A escala é fotografia do momento, não identidade profissional'] }
    ]
  },
  {
    id: 'logica-java', label: 'Lógica e Java', eyebrow: 'Etapa 2',
    title: 'Meça como você transforma uma regra em comportamento', duration: '13 min',
    blocks: [
      { type: 'lead', text: 'Regra de aquecimento: “se a idade for maior ou igual a 18, permitir; caso contrário, bloquear”. Antes da sintaxe, você precisa identificar entrada, comparação e dois resultados possíveis.' },
      { type: 'assessment', areaIds: ['logic', 'java'] },
      { type: 'note', tone: 'info', title: 'Não tente provar mais do que a aula pediu', text: 'Se você ainda não compila Java, isso é esperado no M0. A evidência pode ser reconhecer o que falta e descrever um exemplo que já acompanhou.' }
    ]
  },
  {
    id: 'terminal-git', label: 'Terminal e Git', eyebrow: 'Etapa 3',
    title: 'Meça sua autonomia para agir e preservar mudanças', duration: '13 min',
    blocks: [
      { type: 'assessment', areaIds: ['terminal', 'git'] },
      { type: 'note', tone: 'warning', title: 'Você ainda não precisa executar comandos', text: 'As próximas aulas prepararão Windows, terminal e Git passo a passo. Aqui você apenas registra o que já consegue fazer hoje sem transformar o diagnóstico em prova surpresa.' }
    ]
  },
  {
    id: 'dados-http', label: 'Banco e HTTP', eyebrow: 'Etapa 4',
    title: 'Meça como você enxerga estado e contrato', duration: '13 min',
    blocks: [
      { type: 'assessment', areaIds: ['database', 'http'] },
      { type: 'result', title: 'Duas perguntas que protegem o backend', items: ['Banco: que estado precisa continuar verdadeiro depois da operação?', 'HTTP: o que cliente e servidor combinaram sobre entrada, ação e resposta?'] }
    ]
  },
  {
    id: 'rotina', label: 'Rotina sustentável', eyebrow: 'Etapa 5',
    title: 'Escolha uma cadência que sobreviva à vida real', duration: '10 min',
    blocks: [
      { type: 'assessment', areaIds: ['routine'] },
      { type: 'routine' },
      { type: 'note', tone: 'info', title: 'Retomar sem culpa faz parte do método', text: 'Uma semana difícil não invalida o plano. Retome pelo último registro, faça uma revisão pequena e continue. Consistência não é perfeição.' }
    ]
  },
  {
    id: 'interpretacao', label: 'Ler o perfil', eyebrow: 'Etapa 6',
    title: 'Veja como as sete bases cooperam em uma regra real', duration: '14 min',
    blocks: [
      { type: 'profile' },
      { type: 'backendChain' },
      { type: 'errors' }
    ]
  },
  {
    id: 'plano', label: 'Plano 30 · 60 · 90', eyebrow: 'Etapa 7',
    title: 'Dê direção ao estudo sem transformar o calendário em promessa', duration: '13 min',
    blocks: [
      { type: 'plan' },
      { type: 'note', tone: 'warning', title: 'O plano não autoriza pular a formação', text: 'Uma área forte pode exigir menos revisão inicial, mas os módulos continuam construindo profundidade e integração. Ajustamos atenção e ritmo; não apagamos pré-requisitos.' }
    ]
  },
  {
    id: 'entrega', label: 'Documento e próximo passo', eyebrow: 'Etapa 8',
    title: 'Registre um ponto de partida que poderá ser comparado', duration: '15 min',
    blocks: [
      { type: 'actions', title: 'Transforme a consulta em uma entrega', items: ['Revise as sete áreas e escreva pelo menos uma evidência honesta em cada uma.', 'Copie o documento gerado e salve como docs/diagnostico-inicial.md quando sua pasta de estudos estiver pronta.', 'Abra o arquivo novamente e confirme se níveis, forças, lacunas e plano foram preservados.', 'Escolha uma lacuna genérica e reduza até existir um próximo exemplo pequeno.', 'Marque uma revisão para 30 dias; o objetivo será comparar evidências, não perseguir notas.'] },
      { type: 'document' },
      { type: 'gapWorkshop' },
      { type: 'futureGit' },
      { type: 'challenge', title: 'Desafio de honestidade técnica', text: 'Sem olhar apenas os números, explique em voz alta sua maior força, sua lacuna mais concreta e o próximo comportamento que produzirá evidência. Depois confirme se o documento diz a mesma coisa.', acceptance: ['As sete áreas têm nível ou foram explicitamente marcadas como não avaliadas', 'Cada nível preenchido possui uma evidência concreta', 'A lacuna principal foi reduzida a uma habilidade específica', 'O plano mantém um foco principal e uma rotina possível', 'Existe uma data ou intenção clara de revisão em 30 dias'] },
      { type: 'note', tone: 'info', title: 'Próxima aula: preparar o terreno', text: 'Na Aula 003 você organizará o Windows para desenvolvimento. O diagnóstico termina em direção; a próxima aula começa a transformar essa direção em ambiente real.' }
    ]
  }
];

const commonErrors = [
  ['Ir direto para Spring', 'Você pode reconhecer @RestController e @PostMapping, mas ainda precisa de Java, OO, HTTP, build, banco, validação, testes e tratamento de falha para compreender o fluxo.'],
  ['Estudar tudo ao mesmo tempo', 'Mantenha um foco principal. Java, SQL, Docker, cloud, Kafka e arquitetura abertos juntos aumentam exposição, não capacidade.'],
  ['Escolher o nível pela autoestima', 'Troque “acho que sou bom ou ruim” por “consigo demonstrar esta ação sem roteiro?”.'],
  ['Escrever “não sei nada”', 'Nomeie a habilidade exata, reduza o problema e volte ao menor exemplo que produz evidência.'],
  ['Transformar 30/60/90 em prazo rígido', 'Use o horizonte para orientar entregas. Dificuldade, rotina e evidência podem exigir ajuste.'],
  ['Comparar seu perfil com outra pessoa', 'Bagagens de QA, automação, suporte, dados ou desenvolvimento criam pontos de partida diferentes; compare seu próximo registro com o atual.']
];

function safeReadDiagnostic() {
  try {
    const saved = JSON.parse(localStorage.getItem(DIAGNOSTIC_STORAGE_KEY) || '{}');
    return {
      areas: Object.fromEntries(Object.keys(AREAS).map(id => [id, { ...EMPTY_DIAGNOSTIC[id], ...(saved.areas?.[id] || {}) }])),
      studyDays: saved.studyDays || 4,
      sessionMinutes: saved.sessionMinutes || 45
    };
  } catch {
    return { areas: EMPTY_DIAGNOSTIC, studyDays: 4, sessionMinutes: 45 };
  }
}

function CopyButton({ value, label = 'Copiar documento' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  return <button type="button" className="guided-copy" onClick={copy} aria-label={label}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function BaggageLens() {
  const [selected, setSelected] = useState('api');
  const examples = [
    { id: 'api', label: 'Já validei APIs', exposure: 'Reconhecer Postman e respostas JSON é bagagem útil.', evidence: 'Descreva uma requisição que leu e o que o status indicava.', direction: 'A formação conectará essa leitura à implementação do contrato.' },
    { id: 'qa', label: 'Venho de QA', exposure: 'Cenários, risco e reprodução de falha são ativos importantes.', evidence: 'Cite um defeito que conseguiu isolar e quais passos o reproduziam.', direction: 'Essa visão crescerá em testes automatizados, logs e arquitetura.' },
    { id: 'data', label: 'Já consultei banco', exposure: 'Conhecer tabelas ou SELECT cria um ponto de apoio.', evidence: 'Cite uma consulta que escreveu e o resultado que confirmou.', direction: 'Você aprofundará modelagem, transação, índice e persistência Java.' },
    { id: 'none', label: 'Estou começando', exposure: 'Não ter experiência anterior é uma informação válida, não um defeito.', evidence: 'Sua evidência inicial pode ser identificar termos novos e registrar dúvidas específicas.', direction: 'A sequência foi desenhada para construir o chão desde o ambiente.' }
  ];
  const current = examples.find(item => item.id === selected) || examples[0];
  return (
    <section className="diagnostic-baggage">
      <div className="diagnostic-baggage-tabs" role="tablist" aria-label="Exemplos de bagagem anterior">
        {examples.map(item => <button type="button" role="tab" aria-selected={selected === item.id} className={selected === item.id ? 'active' : ''} onClick={() => setSelected(item.id)} key={item.id}>{item.label}</button>)}
      </div>
      <div className="diagnostic-baggage-detail" role="tabpanel" aria-live="polite">
        <article><strong>O que já conta</strong><p>{current.exposure}</p></article>
        <ArrowRight size={18} aria-hidden="true" />
        <article><strong>Como provar</strong><p>{current.evidence}</p></article>
        <ArrowRight size={18} aria-hidden="true" />
        <article><strong>Como vamos usar</strong><p>{current.direction}</p></article>
      </div>
    </section>
  );
}

function CalibrationScale() {
  const [selected, setSelected] = useState(2);
  const current = LEVELS.find(level => level.value === selected) || LEVELS[0];
  return (
    <section className="diagnostic-calibration">
      <div className="diagnostic-level-scale" role="radiogroup" aria-label="Calibrador de nível">
        {LEVELS.map(level => <button type="button" role="radio" aria-checked={selected === level.value} className={selected === level.value ? 'active' : ''} onClick={() => setSelected(level.value)} key={level.value}><span>{level.value}</span><strong>{level.short}</strong></button>)}
      </div>
      <div className="diagnostic-calibration-detail" aria-live="polite">
        <div><Scale size={22} /><span>Nível {current.value}</span></div>
        <article><h3>{current.short}</h3><p>{current.description}</p><strong>Evidência mínima</strong><p>{current.evidence}</p></article>
      </div>
    </section>
  );
}

function AreaAssessment({ areaId, value, onChange }) {
  const area = AREAS[areaId];
  const Icon = area.icon;
  const selectedLevel = LEVELS.find(level => level.value === value.level);
  return (
    <section className="diagnostic-area">
      <header><span><Icon size={21} /></span><div><small>Área de base</small><h3>{area.label}</h3></div><strong>{value.level ? `${value.level}/5` : 'Não avaliada'}</strong></header>
      <p className="diagnostic-area-purpose">{area.purpose}</p>
      <div className="diagnostic-area-impact"><AlertTriangle size={17} /><span>{area.impact}</span></div>
      <fieldset>
        <legend>Qual descrição possui evidência hoje?</legend>
        <div className="diagnostic-area-levels">
          {LEVELS.map(level => <button type="button" className={value.level === level.value ? 'active' : ''} aria-pressed={value.level === level.value} onClick={() => onChange({ ...value, level: level.value })} key={level.value}><span>{level.value}</span><small>{level.short}</small></button>)}
        </div>
      </fieldset>
      {selectedLevel && <p className="diagnostic-level-hint"><ClipboardCheck size={16} /><span><strong>Para sustentar este nível:</strong> {selectedLevel.evidence}</span></p>}
      <div className="diagnostic-questions"><strong>Perguntas de checagem</strong>{area.questions.map(question => <p key={question}><CheckCircle2 size={14} />{question}</p>)}</div>
      <label className="diagnostic-evidence-label" htmlFor={`evidence-${areaId}`}>Minha evidência concreta</label>
      <textarea id={`evidence-${areaId}`} value={value.evidence} onChange={event => onChange({ ...value, evidence: event.target.value })} placeholder={`Exemplo: “Consigo...” ou “Ainda preciso de apoio para...”`} rows={3} />
      <footer><Target size={15} /><span>Próximo foco sugerido: {area.nextFocus}.</span></footer>
    </section>
  );
}

function AssessmentGroup({ areaIds, diagnostic, updateArea }) {
  return <div className={`diagnostic-assessment-grid ${areaIds.length === 1 ? 'single' : ''}`}>{areaIds.map(id => <AreaAssessment areaId={id} value={diagnostic[id]} onChange={value => updateArea(id, value)} key={id} />)}</div>;
}

function RoutineBuilder({ studyDays, sessionMinutes, onChange }) {
  const weeklyMinutes = studyDays * sessionMinutes;
  return (
    <section className="diagnostic-routine">
      <div className="diagnostic-routine-heading"><CalendarClock size={23} /><div><h3>Construa uma semana possível</h3><p>Escolha pelo que cabe na rotina comum, não pela melhor semana do ano.</p></div></div>
      <div className="diagnostic-routine-controls">
        <fieldset><legend>Dias por semana</legend><div>{[3, 4, 5].map(value => <button type="button" aria-pressed={studyDays === value} className={studyDays === value ? 'active' : ''} onClick={() => onChange(value, sessionMinutes)} key={value}>{value} dias</button>)}</div></fieldset>
        <fieldset><legend>Minutos por sessão</legend><div>{[30, 45, 60].map(value => <button type="button" aria-pressed={sessionMinutes === value} className={sessionMinutes === value ? 'active' : ''} onClick={() => onChange(studyDays, value)} key={value}>{value} min</button>)}</div></fieldset>
      </div>
      <div className="diagnostic-routine-result"><strong>{weeklyMinutes} minutos por semana</strong><span>É capacidade disponível, não uma meta de velocidade.</span><p>Aula com atenção → prática quando fizer sentido → registro no diário → revisão curta → dúvidas específicas.</p></div>
    </section>
  );
}

function getProfile(diagnostic) {
  const assessed = Object.entries(diagnostic).filter(([, value]) => value.level > 0);
  const sorted = [...assessed].sort((a, b) => a[1].level - b[1].level);
  const gaps = sorted.filter(([, value]) => value.level <= 2).slice(0, 3);
  const strengths = [...sorted].reverse().filter(([, value]) => value.level >= 3).slice(0, 3);
  return { assessed, gaps, strengths };
}

function ProfileSummary({ diagnostic }) {
  const { assessed, gaps, strengths } = getProfile(diagnostic);
  return (
    <section className="diagnostic-profile">
      <header><div><span>Seu retrato atual</span><h3>{assessed.length} de 7 áreas avaliadas</h3></div><p>Não calculamos média: uma nota geral esconderia qual dependência precisa de atenção.</p></header>
      <div className="diagnostic-profile-bars" aria-label="Níveis registrados por área">
        {Object.entries(AREAS).map(([id, area]) => <div key={id}><span>{area.label}</span><div><i style={{ width: `${(diagnostic[id].level / 5) * 100}%` }} /></div><strong>{diagnostic[id].level || '—'}</strong></div>)}
      </div>
      <div className="diagnostic-profile-reading">
        <article><strong>Forças com evidência</strong>{strengths.length ? strengths.map(([id, value]) => <p key={id}>{AREAS[id].label} · nível {value.level}</p>) : <p>Ainda não há área 3 ou superior — e isso é um começo válido.</p>}</article>
        <article><strong>Lacunas para reduzir</strong>{gaps.length ? gaps.map(([id, value]) => <p key={id}>{AREAS[id].label} · nível {value.level}</p>) : <p>Avalie as áreas ou registre onde ainda precisa de apoio.</p>}</article>
      </div>
    </section>
  );
}

function BackendChain() {
  const [selectedId, setSelectedId] = useState('logic');
  const selected = BACKEND_CHAIN.find(item => item.id === selectedId) || BACKEND_CHAIN[0];
  return (
    <section className="diagnostic-chain">
      <header><span>Cenário corporativo</span><h3>Reagendar uma atividade sem deixar o sistema incoerente</h3><p>A atividade só muda em status permitido. A operação atualiza a data, registra histórico e gera ocorrência.</p></header>
      <div className="diagnostic-chain-track" role="tablist" aria-label="Competências usadas no fluxo">
        {BACKEND_CHAIN.map((item, index) => <React.Fragment key={item.id}><button type="button" role="tab" aria-selected={selectedId === item.id} className={selectedId === item.id ? 'active' : ''} onClick={() => setSelectedId(item.id)}><span>{String(index + 1).padStart(2, '0')}</span>{item.label}</button>{index < BACKEND_CHAIN.length - 1 && <ArrowRight size={14} aria-hidden="true" />}</React.Fragment>)}
      </div>
      <div className="diagnostic-chain-detail" role="tabpanel" aria-live="polite">
        <article><strong>O que esta base faz</strong><p>{selected.action}</p></article>
        <article><strong>Como crescerá na formação</strong><p>{selected.future}</p></article>
        <article className="risk"><strong>Quando a base falta</strong><p>{selected.risk}</p></article>
      </div>
      <footer><GraduationCap size={18} /><span>Como seu mentor, quero que você enxergue a cadeia: Spring conectará essas responsabilidades; ele não substitui nenhuma delas.</span></footer>
    </section>
  );
}

function PlanGenerator({ diagnostic, studyDays, sessionMinutes }) {
  const { gaps } = getProfile(diagnostic);
  const priorities = gaps.map(([id]) => AREAS[id].label);
  const priorityText = priorities.length ? priorities.join(', ') : 'as áreas ainda não avaliadas';
  const weeklyMinutes = studyDays * sessionMinutes;
  const horizons = [
    { days: '30 dias', title: 'Base operacional e disciplina', focus: 'ambiente, rotina, terminal, Git básico, Java inicial, compilação, IDE, diário e primeiros códigos', evidence: 'Criar, executar, versionar no momento adequado e explicar códigos Java simples.' },
    { days: '60 dias', title: 'Lógica e estrutura', focus: 'variáveis, tipos, condições, laços, arrays, métodos, debug e pequenos projetos console', evidence: 'Resolver problemas pequenos sem copiar, explicar o fluxo e diagnosticar erros simples.' },
    { days: '90 dias', title: 'Base profissional inicial', focus: 'Java Core, OO inicial, coleções, Git mais seguro, testes iniciais, SQL básico e leitura de regra de negócio', evidence: 'Implementar regras com mais clareza e justificar a organização, não apenas escrever comandos.' }
  ];
  return (
    <section className="diagnostic-plan">
      <header><div><span>Horizonte adaptável</span><h3>{studyDays} sessões de {sessionMinutes} minutos</h3></div><strong>{weeklyMinutes} min/semana</strong></header>
      <p className="diagnostic-plan-priority"><Target size={17} /><span><strong>Atenção adicional inicial:</strong> {priorityText}. Isso não muda a ordem do curso; muda onde você revisará com mais cuidado.</span></p>
      <div className="diagnostic-plan-timeline">
        {horizons.map((item, index) => <article key={item.days}><span>{index + 1}</span><div><small>{item.days}</small><h4>{item.title}</h4><p><strong>Foco:</strong> {item.focus}.</p><p><strong>Evidência:</strong> {item.evidence}</p></div></article>)}
      </div>
      <footer><RotateCcw size={17} /><span>Revise em 30 dias. Se uma lacuna aparecer, ajuste duração ou revisão; não transforme atraso em abandono.</span></footer>
    </section>
  );
}

function buildDiagnosticDocument(diagnostic, studyDays, sessionMinutes) {
  const { gaps, strengths } = getProfile(diagnostic);
  const rows = Object.entries(AREAS).map(([id, area]) => {
    const answer = diagnostic[id];
    return `| ${area.label} | ${answer.level || 'Não avaliado'} | ${answer.evidence.trim() || 'Preencher com uma ação observável'} | ${area.nextFocus} |`;
  }).join('\n');
  const strengthLines = strengths.length ? strengths.map(([id, value]) => `- ${AREAS[id].label} — nível ${value.level}: ${value.evidence.trim() || 'registrar evidência'}`).join('\n') : '- Ainda vou identificar uma força com evidência.';
  const gapLines = gaps.length ? gaps.map(([id, value]) => `- ${AREAS[id].label} — nível ${value.level}: ${AREAS[id].nextFocus}.`).join('\n') : '- Ainda vou avaliar ou especificar minha principal lacuna.';
  const today = new Date().toISOString().slice(0, 10);
  return `# Diagnóstico inicial técnico

## Data
${today}

## Escala
1 = quase não conheço
2 = já vi, mas preciso de apoio
3 = consigo fazer coisas simples
4 = consigo trabalhar com autonomia razoável
5 = consigo explicar, aplicar, diagnosticar e ensinar

## Áreas

| Área | Nível atual | Evidência | Próximo foco |
|---|---:|---|---|
${rows}

## Minhas maiores forças hoje
${strengthLines}

## Minhas maiores lacunas hoje
${gapLines}

## Rotina possível
- ${studyDays} dias por semana
- ${sessionMinutes} minutos por sessão
- ${studyDays * sessionMinutes} minutos disponíveis por semana

## Plano dos próximos 30 dias
- Ambiente, rotina, terminal, Git básico, Java inicial, compilação, IDE, diário e primeiros códigos.
- Evidência: criar, executar e explicar códigos Java simples.

## Plano dos próximos 60 dias
- Variáveis, tipos, condições, laços, arrays, métodos, debug e pequenos projetos console.
- Evidência: resolver problemas pequenos sem copiar e diagnosticar erros simples.

## Plano dos próximos 90 dias
- Java Core, OO inicial, coleções, Git mais seguro, testes iniciais, SQL básico e regras de negócio.
- Evidência: implementar uma regra e justificar a organização escolhida.

## Revisão em 30 dias
- Data prevista:
- Evidências novas:
- Plano que precisa ser ajustado:

## Dúvidas específicas
-`;
}

function DiagnosticDocument({ diagnostic, studyDays, sessionMinutes }) {
  const content = useMemo(() => buildDiagnosticDocument(diagnostic, studyDays, sessionMinutes), [diagnostic, sessionMinutes, studyDays]);
  return (
    <div className="guided-file diagnostic-document">
      <div className="guided-file-title"><FileText size={17} /> docs/diagnostico-inicial.md <CopyButton value={content} /></div>
      <SyntaxHighlighter language="markdown" style={oneLight} wrapLongLines customStyle={{ margin: 0, padding: '20px', background: '#f8fafc', fontSize: '.84rem', lineHeight: 1.7 }} codeTagProps={{ style: { fontFamily: '"Cascadia Code", Consolas, monospace' } }}>{content}</SyntaxHighlighter>
    </div>
  );
}

function GapWorkshop() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = GAP_REWRITES[selectedIndex];
  return (
    <section className="diagnostic-gap-workshop">
      <header><RotateCcw size={21} /><div><h3>Quando uma lacuna aparecer, reduza antes de reagir</h3><p>Nomear → especificar → voltar ao menor exemplo.</p></div></header>
      <div className="diagnostic-gap-options" role="tablist" aria-label="Exemplos de lacunas genéricas">
        {GAP_REWRITES.map((item, index) => <button type="button" role="tab" aria-selected={selectedIndex === index} className={selectedIndex === index ? 'active' : ''} onClick={() => setSelectedIndex(index)} key={item.generic}>{item.generic}</button>)}
      </div>
      <div className="diagnostic-gap-flow" role="tabpanel" aria-live="polite">
        <article><small>Problema grande</small><strong>{selected.generic}</strong></article><ArrowRight size={18} /><article><small>Lacuna nomeada</small><strong>{selected.specific}</strong></article><ArrowRight size={18} /><article><small>Menor evidência</small><strong>{selected.smallest}</strong></article>
      </div>
    </section>
  );
}

function FutureGitReference() {
  return (
    <details className="diagnostic-future-git">
      <summary><GitBranch size={18} /><span><strong>Referência futura:</strong> registrar o diagnóstico com Git depois da Aula 10</span></summary>
      <div><p>Você não precisa executar isto agora. Depois de aprender o fluxo completo, estes comandos mostrarão o arquivo novo, prepararão a mudança, criarão o commit e confirmarão um estado limpo.</p><SyntaxHighlighter language="bash" style={oneLight} customStyle={{ margin: 0, padding: '18px', background: '#f8fafc', fontSize: '.84rem', lineHeight: 1.7 }}>{FUTURE_GIT_COMMANDS}</SyntaxHighlighter><p><strong>O que poderá variar:</strong> branch, hash e resumo do commit. <strong>Confirmação final esperada:</strong> o último status informará que não há mudanças pendentes.</p></div>
    </details>
  );
}

function ContentBlock({ block, diagnostic, updateArea, studyDays, sessionMinutes, updateRoutine }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'baggage') return <BaggageLens />;
  if (block.type === 'calibration') return <CalibrationScale />;
  if (block.type === 'assessment') return <AssessmentGroup areaIds={block.areaIds} diagnostic={diagnostic} updateArea={updateArea} />;
  if (block.type === 'routine') return <RoutineBuilder studyDays={studyDays} sessionMinutes={sessionMinutes} onChange={updateRoutine} />;
  if (block.type === 'profile') return <ProfileSummary diagnostic={diagnostic} />;
  if (block.type === 'backendChain') return <BackendChain />;
  if (block.type === 'plan') return <PlanGenerator diagnostic={diagnostic} studyDays={studyDays} sessionMinutes={sessionMinutes} />;
  if (block.type === 'document') return <DiagnosticDocument diagnostic={diagnostic} studyDays={studyDays} sessionMinutes={sessionMinutes} />;
  if (block.type === 'gapWorkshop') return <GapWorkshop />;
  if (block.type === 'futureGit') return <FutureGitReference />;

  if (block.type === 'result') return <section className="guided-result"><h3><ClipboardCheck size={20} /> {block.title}</h3><ul>{block.items.map(item => <li key={item}><CheckCircle2 size={16} /> {item}</li>)}</ul></section>;

  if (block.type === 'note') {
    const Icon = block.tone === 'danger' ? ShieldAlert : block.tone === 'warning' ? AlertTriangle : Lightbulb;
    return <aside className={`guided-note ${block.tone || 'info'}`}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>;
  }

  if (block.type === 'errors') return <section className="guided-errors"><h3><RotateCcw size={20} /> Erros que distorcem o diagnóstico</h3><div className="guided-error-grid">{commonErrors.map(([title, fix]) => <article key={title}><code>{title}</code><p>{fix}</p></article>)}</div></section>;

  if (block.type === 'actions') return <section className="diagnostic-actions"><h3><BookOpenCheck size={20} /> {block.title}</h3><ol>{block.items.map((item, index) => <li key={item}><span>{index + 1}</span><p>{item}</p></li>)}</ol></section>;

  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Compass size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;

  return null;
}

export default function GuidedDiagnosticLesson002({
  isCompleted,
  onToggleCompleted,
  onNextLesson,
  onPrevLesson,
  hasNextLesson,
  hasPrevLesson
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const completionNormalizedRef = useRef(false);
  const initialDiagnostic = useMemo(() => safeReadDiagnostic(), []);
  const [diagnostic, setDiagnostic] = useState(initialDiagnostic.areas);
  const [studyDays, setStudyDays] = useState(initialDiagnostic.studyDays);
  const [sessionMinutes, setSessionMinutes] = useState(initialDiagnostic.sessionMinutes);
  const [completedStepIds, setCompletedStepIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LESSON_STORAGE_KEY) || '[]');
      return new Set(Array.isArray(saved) ? saved : []);
    } catch {
      return new Set();
    }
  });

  useEffect(() => localStorage.setItem(LESSON_STORAGE_KEY, JSON.stringify([...completedStepIds])), [completedStepIds]);
  useEffect(() => localStorage.setItem(DIAGNOSTIC_STORAGE_KEY, JSON.stringify({ areas: diagnostic, studyDays, sessionMinutes })), [diagnostic, sessionMinutes, studyDays]);

  const activeStep = steps[activeIndex];
  const progress = Math.round((completedStepIds.size / steps.length) * 100);
  const allStepsComplete = completedStepIds.size === steps.length;
  const activeStepComplete = completedStepIds.has(activeStep.id);
  const lessonComplete = isCompleted && allStepsComplete;
  const completedLabel = useMemo(() => `${completedStepIds.size} de ${steps.length} etapas concluídas`, [completedStepIds]);
  const assessedCount = useMemo(() => Object.values(diagnostic).filter(value => value.level > 0).length, [diagnostic]);

  useEffect(() => {
    if (completionNormalizedRef.current) return;
    completionNormalizedRef.current = true;
    if (isCompleted && !allStepsComplete) onToggleCompleted();
  }, [allStepsComplete, isCompleted, onToggleCompleted]);

  const selectStep = index => {
    setActiveIndex(index);
    document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  const updateArea = (id, value) => setDiagnostic(previous => ({ ...previous, [id]: value }));
  const updateRoutine = (days, minutes) => {
    setStudyDays(days);
    setSessionMinutes(minutes);
  };

  return (
    <article className="guided-git-lesson guided-diagnostic-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker"><HeartHandshake size={17} /> Consulta com seu mentor</span>
          <p className="guided-sequence">002 · M0.02</p>
          <h1>Seu diagnóstico técnico inicial</h1>
          <p>Avalie sete bases com evidências, interprete lacunas sem julgamento e saia com um plano de estudo que cabe na sua vida real.</p>
        </div>
        <div className="guided-hero-status"><ClipboardList size={42} /><strong>{progress}%</strong><span>{completedLabel}</span></div>
        <div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}><span style={{ width: `${progress}%` }} /></div>
      </header>

      <GuidedLessonFacts ariaLabel="Estado do diagnóstico" items={[{ value: 7, label: 'áreas de base' }, { value: assessedCount, label: 'avaliadas agora' }, { value: `${studyDays}×`, label: 'por semana' }]} />

      <div className="guided-layout">
        <nav className="guided-step-nav" aria-label="Etapas da aula 002">
          <div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro guiado</div>
          {steps.map((step, index) => <button type="button" key={step.id} className={`${index === activeIndex ? 'active' : ''} ${completedStepIds.has(step.id) ? 'done' : ''}`} onClick={() => selectStep(index)}><span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}
        </nav>

        <main className="guided-step-content">
          <div className="guided-step-heading"><span>{activeStep.eyebrow} · {activeStep.duration}</span><h2>{activeStep.title}</h2></div>
          <div className="guided-blocks">{activeStep.blocks.map((block, index) => <ContentBlock block={block} diagnostic={diagnostic} updateArea={updateArea} studyDays={studyDays} sessionMinutes={sessionMinutes} updateRoutine={updateRoutine} key={`${activeStep.id}-${block.type}-${index}`} />)}</div>

          <div className="guided-step-actions">
            <button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button>
            <div className="guided-step-actions-main"><button type="button" className={`step-toggle ${activeStepComplete ? 'undo' : 'complete'}`} onClick={toggleActiveStep}>{activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><Check size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div>
          </div>

          {allStepsComplete && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>{lessonComplete ? 'Diagnóstico registrado' : 'Consulta concluída'}</h3><p>{lessonComplete ? 'Seu ponto de partida, rotina e conclusão da aula estão registrados.' : 'Conclua a aula para liberar a preparação prática do ambiente.'}</p></div><button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}
        </main>
      </div>

      <footer className="guided-course-nav">
        <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 001</button>
        <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>{lessonComplete ? <CheckCircle2 size={18} /> : <ListChecks size={18} />}<span><strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong><small>{lessonComplete ? 'Diagnóstico preservado' : allStepsComplete ? 'Use o botão acima' : 'Complete a consulta guiada'}</small></span></div>
        <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas e a aula para avançar' : 'Organizar o Windows para desenvolvimento'}>Aula 003 <ArrowRight size={17} /></button>
      </footer>
    </article>
  );
}
