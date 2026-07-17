import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Bot,
  BrainCircuit,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  Copy,
  Database,
  FileText,
  GitCommitHorizontal,
  GraduationCap,
  Layers3,
  Lightbulb,
  ListChecks,
  Network,
  Play,
  RotateCcw,
  Route,
  ServerCog,
  ShieldAlert,
  Sparkles,
  Target,
  TerminalSquare,
  Wrench
} from 'lucide-react';
import { COURSE_MODULES, COURSE_PHASES, COURSE_TOTAL_LESSONS } from '../data/coursePlan';
import './guidedLesson.css';
import './guidedCourseOpeningLesson.css';

const LESSON_STORAGE_KEY = 'guided-course-opening-lesson-000-progress';

const PHASE_PRESENTATION = {
  base: {
    title: 'Base Java',
    description: 'Ambiente, lógica, Java Core, métodos e orientação a objetos.',
    evidence: 'Você lê, executa, organiza e explica programas Java sem depender de receitas.'
  },
  'modern-java': {
    title: 'Java moderno',
    description: 'Collections, Generics, Streams, exceções, SOLID e padrões.',
    evidence: 'Você escolhe estruturas e organiza código pensando em manutenção e testes.'
  },
  'backend-core': {
    title: 'Backend core',
    description: 'Ferramentas profissionais, SQL, persistência, Spring Boot e APIs REST.',
    evidence: 'Você constrói um backend com dados, validação, testes e contratos claros.'
  },
  production: {
    title: 'Produção',
    description: 'Segurança, integrações, mensageria, containers, cloud e observabilidade.',
    evidence: 'Você entende como o sistema falha, opera, escala e precisa ser protegido.'
  },
  architecture: {
    title: 'Arquitetura',
    description: 'DDD, sistemas distribuídos, decisões técnicas, projeto final e carreira.',
    evidence: 'Você compara trade-offs, documenta decisões e defende uma solução completa.'
  }
};

const BACKEND_FLOW = [
  { id: 'request', label: 'Pedido', icon: Play, detail: 'Uma tela ou outro sistema envia dados e espera uma resposta previsível.' },
  { id: 'api', label: 'API Java', icon: ServerCog, detail: 'O backend recebe, valida e transforma a intenção em uma operação segura.' },
  { id: 'rule', label: 'Regra', icon: BrainCircuit, detail: 'O domínio decide o que é permitido. Backend real não é apenas salvar campos.' },
  { id: 'data', label: 'Dados', icon: Database, detail: 'O banco preserva estado, relações e consistência mesmo quando algo falha.' },
  { id: 'integration', label: 'Integração', icon: Network, detail: 'Pagamento, estoque ou notificação podem participar do fluxo e falhar parcialmente.' },
  { id: 'operation', label: 'Operação', icon: TerminalSquare, detail: 'Logs, métricas e alertas permitem descobrir o que aconteceu em produção.' }
];

const CAREER_LEVELS = [
  { id: 'junior', label: 'Júnior', question: 'Como faço funcionar?', response: 'Cria o endpoint seguindo o padrão existente e pede direção quando encontra uma decisão nova.' },
  { id: 'pleno', label: 'Pleno', question: 'Como faço certo neste contexto?', response: 'Considera DTO, validação, regra, transação, resposta HTTP, banco e testes.' },
  { id: 'senior', label: 'Sênior', question: 'Qual risco esta mudança cria?', response: 'Investiga duplicidade, idempotência, contrato, auditoria, concorrência e manutenção.' },
  { id: 'engineer', label: 'Engenheiro', question: 'Como o fluxo inteiro será operado?', response: 'Relaciona estoque, pagamento, eventos, falhas, observabilidade, segurança e custo.' },
  { id: 'architect', label: 'Arquiteto', question: 'Qual estrutura permite evoluir com menos risco?', response: 'Define fronteiras, consistência, integração e trade-offs sem se afastar da realidade do código.' }
];

const STUDY_CYCLE = [
  { label: 'Entender', action: 'Leia o objetivo e preveja o resultado.', evidence: 'Você consegue dizer o que está tentando provar.' },
  { label: 'Fazer', action: 'Digite, clique ou configure por conta própria.', evidence: 'Existe código, saída ou estado produzido por você.' },
  { label: 'Observar', action: 'Compare o resultado com a evidência da aula.', evidence: 'Você sabe quais valores podem variar e o que significa sucesso.' },
  { label: 'Quebrar', action: 'Mude uma condição de propósito e leia o erro.', evidence: 'Você identifica causa, não apenas copia uma correção.' },
  { label: 'Explicar', action: 'Corrija e descreva por que voltou a funcionar.', evidence: 'A explicação entra no diário e a prática relevante vira histórico.' }
];

const AI_SCENARIOS = [
  {
    id: 'before',
    title: 'Você ainda não tentou o exercício',
    prompt: '“Crie toda a solução pronta para eu colar.”',
    correct: 'outsource',
    goodFeedback: 'Isso terceiriza exatamente o raciocínio que a atividade pretende treinar. Primeiro tente e registre onde travou.',
    alternative: 'Peça uma pergunta-guia ou um exemplo menor, sem solicitar a solução final.'
  },
  {
    id: 'error',
    title: 'Seu código falhou e você já investigou',
    prompt: '“Explique esta mensagem, mostre hipóteses e me ajude a escolher uma verificação.”',
    correct: 'assist',
    goodFeedback: 'Aqui a IA ajuda a estruturar o diagnóstico, mas a confirmação ainda acontece no seu ambiente.',
    alternative: 'Forneça o erro, o trecho mínimo e o que você já testou; nunca esconda a evidência.'
  },
  {
    id: 'review',
    title: 'Você terminou uma solução própria',
    prompt: '“Revise meu código, aponte riscos e sugira casos de teste sem reescrevê-lo.”',
    correct: 'assist',
    goodFeedback: 'A revisão amplia seu olhar depois que você já tomou decisões e consegue avaliar as sugestões.',
    alternative: 'Aceite somente mudanças que você consiga explicar e validar com execução ou teste.'
  },
  {
    id: 'blind',
    title: 'A resposta parece convincente',
    prompt: '“Vou aceitar a sugestão sem executar porque a explicação parece correta.”',
    correct: 'outsource',
    goodFeedback: 'Texto convincente não é evidência. Código precisa compilar, executar e atender aos critérios observáveis.',
    alternative: 'Valide no projeto, leia a saída e registre qualquer diferença encontrada.'
  }
];

const JOURNAL_TEMPLATE = `# Início da Formação Java Backend

## Meu objetivo
Quero chegar ao ponto de...

## O que eu já sei fazer sozinho
...

## Onde provavelmente vou precisar de mais prática
...

## Meu método a partir de hoje
Vou praticar, observar, provocar erros, corrigir e explicar.

## Meu pacto com a formação
Quando eu travar, vou tentar localizar a dúvida antes de pedir uma solução pronta.`;

const steps = [
  {
    id: 'destino',
    label: 'O destino',
    eyebrow: 'Comece aqui',
    title: 'Você não entrou em uma coleção de textos',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'Esta formação existe para transformar uma pessoa que ainda depende de instruções em alguém capaz de construir, investigar, operar e explicar sistemas Java Backend. O caminho é longo porque a responsabilidade também cresce.' },
      { type: 'outcome' },
      { type: 'result', title: 'O que você vai aprender a produzir', items: ['Programas Java que você consegue explicar', 'Backends com regras, dados, testes e segurança', 'Diagnósticos baseados em evidência', 'Decisões técnicas com trade-offs explícitos', 'Um projeto final que possa ser executado e defendido'] },
      { type: 'note', tone: 'warning', title: 'Uma promessa honesta', text: 'Concluir aulas não concede automaticamente um cargo. A formação cobre capacidades de júnior a engenharia e arquitetura; senioridade real também exige prática deliberada, experiência, contexto e responsabilidade em projetos.' }
    ]
  },
  {
    id: 'java-backend',
    label: 'Java e backend',
    eyebrow: 'Etapa 1',
    title: 'Veja o que existe por trás de um simples pedido',
    duration: '7 min',
    blocks: [
      { type: 'lead', text: 'Java é uma das bases mais presentes em sistemas corporativos que precisam durar, integrar e operar com previsibilidade. Bancos, saúde, logística, seguros e comércio não precisam apenas de telas: precisam proteger regras e dados ao longo de muitos anos.' },
      { type: 'backendFlow' },
      { type: 'layers' },
      { type: 'note', tone: 'info', title: 'A linguagem é o começo', text: 'Aprender sintaxe responde “como escrever”. Backend acrescenta estado e fluxo. Engenharia acrescenta qualidade, risco e operação. Arquitetura organiza decisões estruturais e seus trade-offs.' }
    ]
  },
  {
    id: 'fases',
    label: 'As cinco fases',
    eyebrow: 'Etapa 2',
    title: 'Explore a progressão antes de caminhar',
    duration: '10 min',
    blocks: [
      { type: 'roadmap' },
      { type: 'note', tone: 'info', title: 'Por que não detalhar os 21 módulos agora?', text: 'A abertura mostra o sentido do caminho. A aula 001 abre o mapa técnico completo e explica a função de cada módulo sem transformar seu primeiro contato em uma lista interminável.' },
      { type: 'result', title: 'A ordem protege sua aprendizagem', items: ['Java básico sustenta Spring', 'Orientação a objetos sustenta modelagem', 'SQL sustenta JPA', 'Testes sustentam mudanças', 'Produção sustenta decisões de arquitetura'] }
    ]
  },
  {
    id: 'evolucao',
    label: 'Evolução técnica',
    eyebrow: 'Etapa 3',
    title: 'A senioridade aparece na qualidade das perguntas',
    duration: '10 min',
    blocks: [
      { type: 'lead', text: 'Considere a mesma tarefa em todos os níveis: criar um endpoint para cadastrar um pedido. O código pode começar parecido; a quantidade de consequências enxergadas muda.' },
      { type: 'career' },
      { type: 'note', tone: 'warning', title: 'Cargo não é uma prova escolar', text: 'Empresas usam títulos de maneiras diferentes. Use esta escada para medir capacidade e responsabilidade, não para prometer um cargo por tempo de curso.' }
    ]
  },
  {
    id: 'metodo',
    label: 'Método de estudo',
    eyebrow: 'Etapa 4',
    title: 'Transforme cada aula em evidência de aprendizagem',
    duration: '12 min',
    blocks: [
      { type: 'studyCycle' },
      { type: 'compare', title: 'Dois alunos podem concluir a mesma aula', goodTitle: 'Desenvolvedor em construção', good: ['digita e executa', 'prevê e compara a saída', 'provoca e diagnostica erros', 'explica e registra'], badTitle: 'Colecionador de aulas', bad: ['avança sem praticar', 'copia sem ler', 'ignora resultados diferentes', 'confunde conclusão com domínio'] },
      { type: 'recovery' }
    ]
  },
  {
    id: 'registro',
    label: 'Diário e histórico',
    eyebrow: 'Etapa 5',
    title: 'Crie sua primeira evidência antes do primeiro código',
    duration: '10 min',
    blocks: [
      { type: 'timeline' },
      { type: 'actions', title: 'Faça agora, sem depender de ferramenta nova', items: ['Abra um editor de texto que você já saiba usar.', 'Crie um arquivo chamado diario-formacao.md em uma pasta que você não apagará.', 'Use o modelo abaixo e complete com palavras suas.', 'Salve o arquivo e confirme que consegue abri-lo novamente.'] },
      { type: 'markdown', name: 'diario-formacao.md', content: JOURNAL_TEMPLATE },
      { type: 'note', tone: 'info', title: 'E o commit?', text: 'O Git será preparado passo a passo no M0. Até lá, salve o diário com cuidado. Depois, práticas relevantes entrarão no repositório para criar histórico e prova de evolução.' }
    ]
  },
  {
    id: 'ia',
    label: 'IA com critério',
    eyebrow: 'Etapa 6',
    title: 'Decida quando a IA ajuda e quando ela rouba a prática',
    duration: '10 min',
    blocks: [
      { type: 'lead', text: 'A regra não é “usar” ou “não usar” IA. A pergunta é: depois desta ajuda, quem fez o raciocínio que a atividade precisava treinar?' },
      { type: 'aiLab' },
      { type: 'result', title: 'Uso profissional responsável', items: ['Peça explicação, hipóteses, revisão e casos de teste', 'Mostre o que você tentou e a evidência observada', 'Valide toda sugestão no ambiente real', 'Não envie senhas, tokens nem dados reais de pessoas ou empresas'] }
    ]
  },
  {
    id: 'pacto',
    label: 'Seu pacto',
    eyebrow: 'Etapa 7',
    title: 'Assuma um compromisso verificável e libere o mapa completo',
    duration: '12 min',
    blocks: [
      { type: 'toolBench' },
      { type: 'pact' },
      { type: 'errors' },
      { type: 'challenge', title: 'Primeiro compromisso da formação', text: 'Complete o arquivo diario-formacao.md sem copiar a formulação desta aula. Escreva um objetivo, uma dificuldade provável, seu método para lidar com dúvidas e uma regra pessoal para usar IA.', acceptance: ['O arquivo existe e abre novamente', 'O texto usa suas próprias palavras', 'Existe uma ação concreta para quando você travar', 'Existe uma regra clara para não terceirizar exercícios', 'Você consegue explicar por que não deve pular o M0'] },
      { type: 'note', tone: 'info', title: 'Próxima aula', text: 'A aula 001 apresenta o mapa técnico completo: os 21 módulos, a progressão de dificuldade e o papel de cada parte na formação de um profissional Java Backend.' }
    ]
  }
];

const commonErrors = [
  ['“A formação parece grande demais”', 'Olhe apenas a etapa atual. O mapa serve para orientar, não para exigir que você domine o final hoje.'],
  ['“Ainda não tenho as ferramentas”', 'Isso é esperado. O M0 prepara e valida cada ferramenta; não instale tudo às pressas nesta abertura.'],
  ['“Não entendi uma explicação”', 'Localize a frase, formule uma pergunta específica, procure uma evidência e só então peça ajuda.'],
  ['“Quero pular direto para Spring”', 'Pare. Sem Java, OO, testes e SQL, o framework vira uma sequência de anotações copiadas.'],
  ['“Meu resultado ficou diferente”', 'Não esconda a diferença. Registre o que apareceu, compare o estado e diagnostique antes de avançar.'],
  ['“A IA entregou uma solução melhor”', 'Execute, teste e explique cada decisão. Se você não consegue justificar a mudança, ainda não a incorporou.']
];

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button type="button" className="guided-copy" onClick={copy} aria-label="Copiar modelo do diário">
      {copied ? <Check size={15} /> : <Copy size={15} />}
      {copied ? 'Copiado' : 'Copiar modelo'}
    </button>
  );
}

function OutcomeBoard() {
  return (
    <section className="opening-outcome" aria-label="Transformação proposta pela formação">
      <div className="opening-outcome-side start">
        <span>Seu ponto de partida</span>
        <strong>“Preciso de um roteiro para cada passo.”</strong>
        <small>É normal começar sem ambiente, vocabulário ou segurança.</small>
      </div>
      <div className="opening-outcome-route" aria-hidden="true"><Route size={24} /><ArrowRight size={18} /></div>
      <div className="opening-outcome-side finish">
        <span>Capacidade construída</span>
        <strong>“Consigo projetar, testar, diagnosticar e defender decisões.”</strong>
        <small>O resultado vem de prática acumulada, não de leitura passiva.</small>
      </div>
    </section>
  );
}

function BackendFlowExplorer() {
  const [selectedId, setSelectedId] = useState(BACKEND_FLOW[0].id);
  const selected = BACKEND_FLOW.find(item => item.id === selectedId) || BACKEND_FLOW[0];

  return (
    <section className="opening-flow-explorer">
      <div className="opening-flow-track" aria-label="Fluxo simplificado de um sistema backend">
        {BACKEND_FLOW.map((item, index) => {
          const Icon = item.icon;
          return (
            <React.Fragment key={item.id}>
              <button type="button" className={selectedId === item.id ? 'active' : ''} onClick={() => setSelectedId(item.id)} aria-pressed={selectedId === item.id}>
                <Icon size={19} /><span>{item.label}</span>
              </button>
              {index < BACKEND_FLOW.length - 1 && <ArrowRight size={15} aria-hidden="true" />}
            </React.Fragment>
          );
        })}
      </div>
      <div className="opening-selected-detail" aria-live="polite"><strong>{selected.label}</strong><p>{selected.detail}</p></div>
    </section>
  );
}

function ConceptLayers() {
  const layers = [
    ['Java', 'expressa instruções e modelos'],
    ['Backend', 'protege regra, estado e integração'],
    ['Engenharia', 'reduz risco com qualidade e operação'],
    ['Arquitetura', 'organiza decisões e fronteiras']
  ];
  return <div className="opening-concept-layers">{layers.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{title}</strong><p>{text}</p></div></article>)}</div>;
}

function RoadmapExplorer() {
  const [selectedId, setSelectedId] = useState(COURSE_PHASES[0].id);
  const phases = COURSE_PHASES.map((phase, index) => {
    const modules = COURSE_MODULES.filter(module => module.id !== 'P0' && phase.modules.includes(module.id));
    const lessonCount = modules.reduce((sum, module) => sum + module.lessons, 0);
    return { ...phase, ...PHASE_PRESENTATION[phase.id], number: index + 1, moduleCount: modules.length, lessonCount, moduleRange: `${modules[0]?.id}–${modules[modules.length - 1]?.id}` };
  });
  const selected = phases.find(phase => phase.id === selectedId) || phases[0];

  return (
    <section className="opening-roadmap">
      <div className="opening-roadmap-tabs" role="tablist" aria-label="Cinco fases da formação">
        {phases.map(phase => (
          <button key={phase.id} type="button" role="tab" aria-selected={selectedId === phase.id} className={selectedId === phase.id ? 'active' : ''} onClick={() => setSelectedId(phase.id)}>
            <span>{String(phase.number).padStart(2, '0')}</span><strong>{phase.title}</strong><small>{phase.lessonCount} aulas</small>
          </button>
        ))}
      </div>
      <div className="opening-roadmap-detail" role="tabpanel" aria-live="polite">
        <span>Fase {selected.number} · {selected.moduleRange}</span>
        <h3>{selected.title}</h3>
        <p>{selected.description}</p>
        <div><strong>{selected.moduleCount} módulos</strong><strong>{selected.lessonCount} aulas</strong></div>
        <small><CheckCircle2 size={15} /> Evidência ao final: {selected.evidence}</small>
      </div>
      <p className="opening-roadmap-total"><Layers3 size={16} /> Cinco fases · 21 módulos · {COURSE_TOTAL_LESSONS - 1} aulas numeradas, além desta abertura</p>
    </section>
  );
}

function CareerExplorer() {
  const [selectedId, setSelectedId] = useState(CAREER_LEVELS[0].id);
  const selected = CAREER_LEVELS.find(level => level.id === selectedId) || CAREER_LEVELS[0];

  return (
    <section className="opening-career">
      <div className="opening-career-levels" role="tablist" aria-label="Níveis de evolução técnica">
        {CAREER_LEVELS.map((level, index) => <button type="button" role="tab" aria-selected={selectedId === level.id} className={selectedId === level.id ? 'active' : ''} onClick={() => setSelectedId(level.id)} key={level.id}><span>{index + 1}</span>{level.label}</button>)}
      </div>
      <div className="opening-career-detail" role="tabpanel" aria-live="polite">
        <span>Ao receber “crie um endpoint para cadastrar pedido”</span>
        <blockquote>{selected.question}</blockquote>
        <p>{selected.response}</p>
      </div>
    </section>
  );
}

function StudyCycleSimulator() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = STUDY_CYCLE[selectedIndex];

  return (
    <section className="opening-study-cycle">
      <div className="opening-cycle-track" aria-label="Ciclo prático de estudo">
        {STUDY_CYCLE.map((item, index) => <button type="button" className={selectedIndex === index ? 'active' : ''} aria-pressed={selectedIndex === index} onClick={() => setSelectedIndex(index)} key={item.label}><span>{index + 1}</span>{item.label}</button>)}
      </div>
      <div className="opening-cycle-detail" aria-live="polite">
        <div><Target size={21} /><span>O que fazer</span><strong>{selected.action}</strong></div>
        <ArrowRight size={18} aria-hidden="true" />
        <div><ClipboardCheck size={21} /><span>Como provar</span><strong>{selected.evidence}</strong></div>
      </div>
      <p>Selecione cada passo. Uma aula só termina quando o ciclo produz evidência, não quando a barra chega ao fim.</p>
    </section>
  );
}

function EvidenceTimeline() {
  const items = [
    [BookOpenCheck, 'Aula', 'define uma transformação'],
    [Code2, 'Prática', 'produz um estado observável'],
    [ShieldAlert, 'Erro', 'revela uma lacuna real'],
    [FileText, 'Diário', 'registra causa e correção'],
    [GitCommitHorizontal, 'Commit', 'preserva uma evolução relevante']
  ];
  return <div className="opening-evidence-timeline" aria-label="Ciclo de evidências da formação">{items.map(([Icon, title, text], index) => <React.Fragment key={title}><article><Icon size={20} /><strong>{title}</strong><small>{text}</small></article>{index < items.length - 1 && <ArrowRight size={15} aria-hidden="true" />}</React.Fragment>)}</div>;
}

function AIDecisionLab() {
  const [activeId, setActiveId] = useState(AI_SCENARIOS[0].id);
  const [answers, setAnswers] = useState({});
  const active = AI_SCENARIOS.find(item => item.id === activeId) || AI_SCENARIOS[0];
  const answer = answers[active.id];
  const isCorrect = answer === active.correct;

  const decide = value => setAnswers(previous => ({ ...previous, [active.id]: value }));

  return (
    <section className="opening-ai-lab">
      <div className="opening-ai-scenarios" role="tablist" aria-label="Situações de uso de IA">
        {AI_SCENARIOS.map((scenario, index) => <button type="button" role="tab" aria-selected={activeId === scenario.id} className={`${activeId === scenario.id ? 'active' : ''} ${answers[scenario.id] === scenario.correct ? 'answered' : ''}`} onClick={() => setActiveId(scenario.id)} key={scenario.id}>{answers[scenario.id] === scenario.correct ? <Check size={15} /> : index + 1}<span>{scenario.title}</span></button>)}
      </div>
      <div className="opening-ai-question" role="tabpanel">
        <Bot size={30} />
        <blockquote>{active.prompt}</blockquote>
        <div>
          <button type="button" className={answer === 'assist' ? 'selected' : ''} onClick={() => decide('assist')} aria-pressed={answer === 'assist'}>Ajuda a pensar</button>
          <button type="button" className={answer === 'outsource' ? 'selected' : ''} onClick={() => decide('outsource')} aria-pressed={answer === 'outsource'}>Terceiriza a prática</button>
        </div>
      </div>
      {answer && <div className={`opening-ai-feedback ${isCorrect ? 'correct' : 'incorrect'}`} aria-live="polite"><strong>{isCorrect ? 'Boa leitura da situação' : 'Reavalie a consequência'}</strong><p>{active.goodFeedback}</p><small><Lightbulb size={15} /> Alternativa: {active.alternative}</small></div>}
    </section>
  );
}

function ToolBench() {
  const tools = [
    ['JDK 21 LTS', 'executar e compilar Java'],
    ['IntelliJ IDEA', 'escrever e investigar código'],
    ['Git', 'registrar e colaborar'],
    ['Maven', 'construir e testar projetos'],
    ['Docker', 'executar serviços isolados'],
    ['PostgreSQL + DBeaver', 'persistir e inspecionar dados'],
    ['Postman ou Insomnia', 'enviar e validar requisições HTTP']
  ];
  return <section className="opening-tool-bench"><div><Wrench size={22} /><h3>Sua bancada será montada no M0</h3><p>Você não precisa instalar tudo nesta tela. Cada ferramenta terá preparação, teste e recuperação de erro.</p></div><ul>{tools.map(([name, purpose]) => <li key={name}><CheckCircle2 size={15} /><span><strong>{name}</strong><small>{purpose}</small></span></li>)}</ul></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'outcome') return <OutcomeBoard />;
  if (block.type === 'backendFlow') return <BackendFlowExplorer />;
  if (block.type === 'layers') return <ConceptLayers />;
  if (block.type === 'roadmap') return <RoadmapExplorer />;
  if (block.type === 'career') return <CareerExplorer />;
  if (block.type === 'studyCycle') return <StudyCycleSimulator />;
  if (block.type === 'timeline') return <EvidenceTimeline />;
  if (block.type === 'aiLab') return <AIDecisionLab />;
  if (block.type === 'toolBench') return <ToolBench />;

  if (block.type === 'result') {
    return <section className="guided-result"><h3><ClipboardCheck size={20} /> {block.title}</h3><ul>{block.items.map(item => <li key={item}><CheckCircle2 size={16} /> {item}</li>)}</ul></section>;
  }

  if (block.type === 'note') {
    const Icon = block.tone === 'danger' ? ShieldAlert : block.tone === 'warning' ? AlertTriangle : Lightbulb;
    return <aside className={`guided-note ${block.tone || 'info'}`}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>;
  }

  if (block.type === 'compare') {
    return <section className="guided-compare"><h3>{block.title}</h3><div className="guided-compare-grid"><div className="good"><strong>{block.goodTitle}</strong>{block.good.map(item => <code key={item}>{item}</code>)}</div><div className="bad"><strong>{block.badTitle}</strong>{block.bad.map(item => <code key={item}>{item}</code>)}</div></div></section>;
  }

  if (block.type === 'recovery') {
    return <section className="opening-recovery"><h3><ShieldAlert size={20} /> Não avance com uma dúvida escondida</h3><ol>{['Pare e escreva exatamente o que não entendeu.', 'Localize a entrada, ação e saída relacionadas.', 'Faça uma verificação pequena no seu ambiente.', 'Peça ajuda mostrando o que tentou e o que apareceu.', 'Confirme a explicação com uma nova execução.'].map((item, index) => <li key={item}><span>{index + 1}</span>{item}</li>)}</ol></section>;
  }

  if (block.type === 'actions') {
    return <section className="idea-actions opening-actions"><h3><FileText size={20} /> {block.title}</h3><ol>{block.items.map((item, index) => <li key={item}><span>{index + 1}</span><p>{item}</p></li>)}</ol></section>;
  }

  if (block.type === 'markdown') {
    return <div className="guided-file opening-markdown"><div className="guided-file-title"><FileText size={17} /> {block.name}<CopyButton value={block.content} /></div><SyntaxHighlighter language="markdown" style={oneLight} wrapLongLines customStyle={{ margin: 0, padding: '20px', background: '#f8fafc', fontSize: '.84rem', lineHeight: 1.7 }} codeTagProps={{ style: { fontFamily: '"Cascadia Code", Consolas, monospace' } }}>{block.content}</SyntaxHighlighter></div>;
  }

  if (block.type === 'pact') {
    return <section className="opening-pact"><div><GraduationCap size={25} /><h3>Seu compromisso</h3><ul>{['Praticar antes de concluir', 'Registrar erros e correções', 'Pedir ajuda com contexto', 'Consolidar antes de avançar'].map(item => <li key={item}><Check size={15} />{item}</li>)}</ul></div><div><Sparkles size={25} /><h3>Compromisso da formação</h3><ul>{['Ensinar com profundidade e sequência', 'Mostrar evidências e erros reais', 'Conectar conteúdo ao trabalho', 'Definir critérios claros de avanço'].map(item => <li key={item}><Check size={15} />{item}</li>)}</ul></div></section>;
  }

  if (block.type === 'errors') {
    return <section className="guided-errors"><h3><RotateCcw size={20} /> Se você travar antes de começar</h3><div className="guided-error-grid">{commonErrors.map(([title, fix]) => <article key={title}><code>{title}</code><p>{fix}</p></article>)}</div></section>;
  }

  if (block.type === 'challenge') {
    return <section className="guided-challenge"><div className="guided-challenge-title"><Target size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  }

  return null;
}

export default function GuidedCourseOpeningLesson000({
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

  useEffect(() => {
    localStorage.setItem(LESSON_STORAGE_KEY, JSON.stringify([...completedStepIds]));
  }, [completedStepIds]);

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
    <article className="guided-git-lesson guided-opening-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker"><Route size={17} /> Abertura guiada</span>
          <p className="guided-sequence">000 · Ponto de partida</p>
          <h1>Seu caminho em Java Backend</h1>
          <p>Entenda o destino, pratique o método de estudo e assuma um pacto que transforme aulas em capacidade real.</p>
        </div>
        <div className="guided-hero-status"><GraduationCap size={42} /><strong>{progress}%</strong><span>{completedLabel}</span></div>
        <div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}><span style={{ width: `${progress}%` }} /></div>
      </header>

      <div className="guided-layout">
        <nav className="guided-step-nav" aria-label="Etapas da aula de abertura">
          <div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro de abertura</div>
          {steps.map((step, index) => (
            <button type="button" key={step.id} className={`${index === activeIndex ? 'active' : ''} ${completedStepIds.has(step.id) ? 'done' : ''}`} onClick={() => selectStep(index)}>
              <span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span>
              <span><strong>{step.label}</strong><small>{step.duration}</small></span>
            </button>
          ))}
        </nav>

        <main className="guided-step-content">
          <div className="guided-step-heading"><span>{activeStep.eyebrow} · {activeStep.duration}</span><h2>{activeStep.title}</h2></div>
          <div className="guided-blocks">{activeStep.blocks.map((block, index) => <ContentBlock block={block} key={`${activeStep.id}-${block.type}-${index}`} />)}</div>

          <div className="guided-step-actions">
            <button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button>
            <div className="guided-step-actions-main">
              <button type="button" className={`step-toggle ${activeStepComplete ? 'undo' : 'complete'}`} onClick={toggleActiveStep}>{activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><Check size={16} /> Concluir etapa</>}</button>
              {activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}
            </div>
          </div>

          {allStepsComplete && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>{lessonComplete ? 'Abertura concluída' : 'Pacto preparado'}</h3><p>{lessonComplete ? 'Seu compromisso e todas as etapas estão registrados.' : 'Revise seu diário e conclua a abertura para liberar o mapa técnico.'}</p></div><button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}
        </main>
      </div>

      <footer className="guided-course-nav">
        <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula anterior</button>
        <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>{lessonComplete ? <CheckCircle2 size={18} /> : <ListChecks size={18} />}<span><strong>{lessonComplete ? 'Abertura concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong><small>{lessonComplete ? 'Progresso registrado' : allStepsComplete ? 'Use o botão acima' : 'Complete o roteiro de abertura'}</small></span></div>
        <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas e a abertura para avançar' : 'Abrir o mapa completo'}>Aula 001 <ArrowRight size={17} /></button>
      </footer>
    </article>
  );
}
