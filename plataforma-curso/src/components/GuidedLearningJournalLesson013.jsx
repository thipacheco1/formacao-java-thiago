import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Brain, CalendarClock, Check,
  CheckCircle2, ClipboardCheck, Clock3, Copy, Eye, FileClock, FileText,
  FolderTree, GraduationCap, History, Keyboard,
  Lightbulb, ListChecks, LockKeyhole, NotebookPen, Play, RefreshCw, RotateCcw,
  Search, ShieldCheck, Sparkles, TerminalSquare, TimerReset, Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLearningJournalLesson.css';

const STORAGE_KEY = 'guided-learning-journal-lesson-013-progress';

const FILES = [
  { id: 'diario', path: 'docs/diario-de-bordo.md', role: 'Linha do tempo pessoal: o que aconteceu, o que você entendeu e qual é o próximo passo.', example: 'Aula 013, prática, erro, solução e dúvida.' },
  { id: 'atalhos', path: 'docs/atalhos.md', role: 'Catálogo de ações recorrentes por ferramenta.', example: 'Ctrl + Shift + A, Alt + F12 e git status.' },
  { id: 'diagnostico', path: 'docs/diagnostico-inicial.md', role: 'Fotografia do ponto de partida, preservada para comparação futura.', example: 'Evidências iniciais e lacunas identificadas.' },
  { id: 'revisoes', path: 'docs/revisoes.md', role: 'Consolidação periódica do que está firme, fraco e precisa de prática.', example: 'Revisão semanal e fechamento de módulo.' },
  { id: 'decisoes', path: 'docs/decisoes.md', role: 'Escolhas técnicas que não devem ser rediscutidas sem contexto.', example: 'JDK 21, branch main, C:\\dev e Markdown.' }
];

const ENTRY_PARTS = [
  ['identidade', '## 2026-07-17 — Aula 013 — Diário de bordo'],
  ['aprendizado', '### O que consegui explicar sem consultar\n\nDiário registra o que aconteceu comigo; revisão testa o que ainda consigo recuperar; anotação guarda uma explicação reutilizável.'],
  ['pratica', '### Prática realizada\n\nCriei `docs/diario-de-bordo.md` e `docs/revisoes.md`, gerei um preview e revisei os dois arquivos com Git.'],
  ['arquivos', '### Arquivos alterados\n\n- `docs/diario-de-bordo.md`\n- `docs/atalhos.md`\n- `docs/revisoes.md`'],
  ['comandos', '### Comandos importantes\n\n```powershell\ngit status --short\ngit diff -- docs/\n```'],
  ['erro', '### Erro encontrado\n\n**Sintoma:** `java Main` informou que a classe principal não foi encontrada.\n\n**Causa:** eu estava na pasta acima de `Main.class`.\n\n**Correção:** confirmei a pasta com `Get-Location`, listei os arquivos e executei na pasta correta.\n\n**Prova:** o programa imprimiu `Diário validado`.'],
  ['atalho', '### Atalho usado\n\n`Alt + F12` abriu o terminal integrado. O catálogo permanente foi atualizado em `docs/atalhos.md`.'],
  ['duvida', '### Dúvida aberta\n\nAinda preciso praticar a diferença entre `git diff` e `git diff --staged` sem consultar a aula.'],
  ['proximo', '### Próxima ação\n\nNa próxima sessão, explicar os três estados do Git em voz alta e executar um ciclo pequeno antes de avançar.']
];

const CLASSIFICATIONS = [
  { text: 'Na aula de Git, pratiquei add e commit. Errei o diretório no primeiro teste e corrigi depois de conferir Get-Location.', answer: 'Diário', reason: 'Registra um acontecimento pessoal em sequência, com prática e erro.' },
  { text: '`git add` move mudanças selecionadas para a staging area; ele não cria um commit.', answer: 'Anotação', reason: 'É uma explicação reutilizável de um conceito, não um evento.' },
  { text: 'Sem consultar: explicar working tree, staging e repository; depois refazer restore --staged.', answer: 'Revisão', reason: 'Define recuperação e prática para fortalecer uma lacuna.' },
  { text: 'Git é um sistema de controle de versão distribuído. Nesta seção veremos todos os comandos e conceitos...', answer: 'Apostila', reason: 'Ensina o assunto para qualquer leitor; não registra sua experiência.' },
  { text: 'Usar JDK 21 LTS e branch principal main nesta formação.', answer: 'Decisão', reason: 'Registra uma escolha estável e seu contexto; pertence a decisoes.md.' },
  { text: 'Ctrl + Shift + A — buscar uma ação pelo nome no IntelliJ.', answer: 'Atalho', reason: 'É repertório operacional recorrente; pertence a atalhos.md.' }
];

const INCIDENTS = {
  classpath: {
    title: 'Classe principal não encontrada',
    attempt: 'java Main',
    message: 'Error: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main',
    inspect: 'Get-Location\nGet-ChildItem\nGet-ChildItem -Recurse -Filter Main.class',
    cause: 'O terminal estava em C:\\dev\\projects, mas Main.class estava em C:\\dev\\projects\\diario-lab.',
    fix: 'Set-Location C:\\dev\\projects\\diario-lab\njava Main',
    proof: 'Diário validado'
  },
  compile: {
    title: 'Compilação não gerou bytecode',
    attempt: 'javac Main.java',
    message: 'Main.java:3: error: \';\' expected\n        System.out.println("Diário validado")\n                                                  ^\n1 error',
    inspect: 'Get-Content .\\Main.java\nGet-ChildItem .\\Main.class',
    cause: 'Faltou ponto e vírgula na instrução; Main.class não foi criado.',
    fix: 'Corrigir a linha, salvar e executar javac Main.java novamente.',
    proof: 'Main.class aparece e java Main imprime Diário validado.'
  },
  identity: {
    title: 'Commit sem identidade configurada',
    attempt: 'git commit -m "Registra aprendizado"',
    message: 'Author identity unknown\n*** Please tell me who you are.',
    inspect: 'git config --show-origin --get user.name\ngit config --show-origin --get user.email',
    cause: 'O Git não encontrou nome e e-mail efetivos para autoria do commit.',
    fix: 'Voltar à Aula 009, configurar a identidade no escopo correto e repetir a confirmação.',
    proof: 'git log -1 mostra o commit e o autor pretendido.'
  }
};

const COMMON_ERRORS = [
  ['Não registrar nada', 'A aula termina sem evidência pessoal.', 'Escreva ao menos aprendizado, prática e próximo passo.', 'Existe uma entrada datada e específica.'],
  ['Copiar a aula inteira', 'O diário vira uma segunda apostila e deixa de ser sustentável.', 'Registre com suas palavras o que aconteceu com você.', 'A entrada cabe em poucos minutos e ainda permite revisão.'],
  ['Escrever “aprendi bastante”', 'Não há conceito, comportamento ou evidência recuperável.', 'Nomeie o que consegue explicar e o que ainda precisa praticar.', 'Outra sessão consegue testar a afirmação.'],
  ['Esconder o erro', 'Você perde o melhor roteiro de diagnóstico da sessão.', 'Registre tentativa, mensagem, causa, correção e prova.', 'O caso pode ser reproduzido sem adivinhação.'],
  ['Não versionar o diário', 'O registro fica separado da história técnica.', 'Inclua-o no commit quando fizer parte da mesma intenção.', 'git log e git show conseguem reconstruir o marco.'],
  ['Registrar segredo', 'O Git preserva e pode distribuir a informação sensível.', 'Remova antes do commit; se publicou, revogue ou rotacione primeiro.', 'Nenhuma credencial ativa aparece em diff ou histórico.'],
  ['Misturar diário e catálogo', 'Atalhos recorrentes se perdem na cronologia.', 'No diário cite o atalho usado; mantenha a definição em atalhos.md.', 'Busca pelo atalho encontra uma fonte organizada.'],
  ['Nunca revisar', 'O diário vira arquivo morto.', 'Recupere sem consultar, compare e defina uma prática curta.', 'A revisão gera uma próxima ação observável.'],
  ['Tentar preencher aulas atrasadas de memória', 'Você fabrica precisão e aumenta culpa.', 'Retome do marco atual e registre honestamente a lacuna.', 'A cronologia recomeça sem conteúdo inventado.'],
  ['Não registrar decisão', 'O mesmo debate reaparece sem contexto.', 'Mova escolhas estáveis para decisoes.md com motivo e impacto.', 'A equipe ou você no futuro entende por que a escolha existe.']
];

const steps = [
  { id: 'mapa', label: 'Transformar estudo em evidência', duration: '8 min', eyebrow: 'Comece aqui', title: 'Veja onde uma aula desaparece — e onde ela passa a deixar rastro', blocks: [{ type: 'lead', text: 'Entender durante a explicação é apenas o começo. Você aprende melhor quando tenta recuperar, explica com suas palavras, pratica, corrige e volta ao ponto fraco depois.' }, { type: 'learningTrace' }, { type: 'note', tone: 'info', title: 'Uma entrada não prova domínio sozinha', text: 'Ela registra uma hipótese honesta sobre seu entendimento. A revisão e a prática posterior testam essa hipótese.' }] },
  { id: 'sistema', label: 'Organizar o sistema', duration: '13 min', eyebrow: 'Etapa 1', title: 'Dê um único trabalho para cada arquivo de aprendizagem', blocks: [{ type: 'lead', text: 'Um arquivo gigante mistura cronologia, atalhos, decisões e revisões. A separação abaixo mantém a escrita simples e torna a busca previsível.' }, { type: 'docsSystem' }] },
  { id: 'criar', label: 'Criar os arquivos', duration: '15 min', eyebrow: 'Etapa 2', title: 'Crie ou valide a pasta docs sem sobrescrever o que já existe', blocks: [{ type: 'lead', text: 'Primeiro inspecione. Se a pasta ou os arquivos já existem, abra e preserve o conteúdo; se faltam, crie somente os ausentes.' }, { type: 'workspace' }] },
  { id: 'entrada', label: 'Escrever uma entrada real', duration: '22 min', eyebrow: 'Etapa 3', title: 'Construa a entrada da Aula 013 com evidência, não com frases genéricas', blocks: [{ type: 'lead', text: 'Comece pelo modo mínimo para criar consistência. Use o modo completo quando houver erro importante, decisão, prática significativa ou fechamento de módulo.' }, { type: 'entryBuilder' }] },
  { id: 'classificar', label: 'Separar cada registro', duration: '15 min', eyebrow: 'Etapa 4', title: 'Não deixe diário, apostila, anotação, revisão e decisão virarem a mesma coisa', blocks: [{ type: 'lead', text: 'Leia cada trecho, escolha o tipo e explique o destino. Classificar conhecimento reduz volume morto e melhora a recuperação futura.' }, { type: 'classifier' }] },
  { id: 'erro', label: 'Registrar um erro técnico', duration: '20 min', eyebrow: 'Etapa 5', title: 'Transforme falha em um roteiro reproduzível de diagnóstico', blocks: [{ type: 'lead', text: '“Deu erro e resolvi” não ensina nada ao seu eu futuro. Preserve o comando, a mensagem essencial, a causa confirmada, a correção e a prova posterior.' }, { type: 'incidentLab' }] },
  { id: 'git', label: 'Ligar registro e commit', duration: '18 min', eyebrow: 'Etapa 6', title: 'Faça o Git conectar aula, prática, arquivo, diff e intenção', blocks: [{ type: 'lead', text: 'Nem todo diário precisa de um commit isolado. Quando código, documentação e registro pertencem à mesma prática, podem formar uma entrega coerente e revisável.' }, { type: 'gitTrace' }] },
  { id: 'revisao', label: 'Revisar sem reler primeiro', duration: '22 min', eyebrow: 'Etapa 7', title: 'Tente recuperar, compare, corrija e agende a próxima prática', blocks: [{ type: 'lead', text: 'Começar relendo produz familiaridade, mas esconde o que você não consegue recuperar. Primeiro responda sem consultar; depois compare com o diário e transforme a lacuna em ação.' }, { type: 'reviewLab' }] },
  { id: 'seguranca', label: 'Publicar com critério', duration: '17 min', eyebrow: 'Etapa 8', title: 'Proteja contexto e traduza a habilidade para o trabalho profissional', blocks: [{ type: 'lead', text: 'Um diário público pode mostrar disciplina, mas não deve conter desabafo íntimo, dados pessoais, nomes internos, prints privados, credenciais ou contexto corporativo não autorizado.' }, { type: 'safetyLab' }] },
  { id: 'recuperacao', label: 'Recuperar antipadrões', duration: '19 min', eyebrow: 'Etapa 9', title: 'Corrija o sistema antes que o diário vire peso ou arquivo morto', blocks: [{ type: 'lead', text: 'Os problemas mais perigosos não são de sintaxe: são abandono, cópia, falsa precisão, ausência de revisão e informação no arquivo errado.' }, { type: 'errorClinic' }] },
  { id: 'entrega', label: 'Entregar e sustentar', duration: '20 min', eyebrow: 'Etapa 10', title: 'Registre três arquivos e assuma uma rotina que cabe na vida real', blocks: [{ type: 'lead', text: 'A entrega final atualiza diário, atalhos e revisões. O compromisso é pequeno: registrar marcos, revisar periodicamente e nunca inventar uma retrospectiva que você não registrou.' }, { type: 'delivery' }, { type: 'result', title: 'Critérios de uma entrada útil', items: ['Identifica a aula ou marco', 'Explica algo com palavras próprias', 'Registra prática e arquivo observável', 'Preserva erro, causa e prova quando relevante', 'Expõe dúvida em vez de escondê-la', 'Termina com uma próxima ação possível', 'Não contém segredo nem contexto indevido'] }, { type: 'challenge', title: 'Desafio: prove evolução sem consultar o roteiro', text: 'Escolha uma das aulas 009 a 012. Sem abrir a aula, escreva o que lembra, reproduza uma prática pequena e registre onde sua memória falhou. Só depois consulte o material, corrija a entrada e defina uma revisão.', acceptance: ['Resposta inicial foi escrita antes da consulta', 'Prática gerou uma saída, arquivo ou estado observável', 'Lacuna foi nomeada sem linguagem vaga', 'Correção distingue o que você lembrava do que revisou', 'Próxima ação possui comando ou comportamento verificável', 'Commit termina com working tree limpo'] }] }
];

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); };
  return <button type="button" className="guided-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function Highlight({ language, children, lineNumbers = false }) {
  return <SyntaxHighlighter language={language} style={vscDarkPlus} wrapLongLines showLineNumbers={lineNumbers} customStyle={{ margin: 0, padding: '15px', background: '#0d1117', fontSize: '.7rem', lineHeight: 1.58 }}>{children}</SyntaxHighlighter>;
}

function MarkdownPreview({ source }) {
  return <div className="journal13-rendered"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      if (!match) return <code {...props}>{children}</code>;
      return <Highlight language={match[1]}>{String(children).replace(/\n$/, '')}</Highlight>;
    }
  }}>{source}</ReactMarkdown></div>;
}

function JournalDocument({ source, file = 'docs/diario-de-bordo.md', caption }) {
  return <section className="journal13-document"><div><header><span><FileText size={16} /> {file}</span><CopyButton value={source} /></header><Highlight language="markdown" lineNumbers>{source}</Highlight></div><div><header><Eye size={16} /><span>Preview</span><em>Simulação didática</em></header><MarkdownPreview source={source} /></div>{caption && <footer><CheckCircle2 size={16} /> {caption}</footer>}</section>;
}

function LearningTrace() {
  const [stage, setStage] = useState(0);
  const stages = [
    ['Consumir', 'Você acompanha e entende naquele momento.', 'Ainda não existe prova de recuperação independente.'],
    ['Tentar lembrar', 'Você explica sem consultar e encontra lacunas.', 'Recuperação revela o que estava apenas familiar.'],
    ['Praticar', 'Você executa um comando, escreve código ou muda um estado.', 'A evidência sai da memória e entra no ambiente.'],
    ['Diagnosticar', 'Erro e diferença são investigados, não escondidos.', 'Causa confirmada vale mais que uma tentativa que “funcionou”.'],
    ['Registrar', 'Entrada conecta aula, ação, arquivo, erro e decisão.', 'A experiência ganha uma linha do tempo pesquisável.'],
    ['Revisar', 'Você volta depois, recupera novamente e pratica a lacuna.', 'O registro vira ferramenta de aprendizagem, não arquivo morto.']
  ];
  return <section className="journal13-trace"><div role="tablist">{stages.map((item, index) => <button type="button" role="tab" aria-selected={stage === index} className={stage === index ? 'active' : index < stage ? 'done' : ''} onClick={() => setStage(index)} key={item[0]}><span>{index < stage ? <Check size={13} /> : index + 1}</span>{item[0]}</button>)}</div><article><Brain size={31} /><small>Estado {stage + 1} de {stages.length}</small><h3>{stages[stage][1]}</h3><p>{stages[stage][2]}</p><div><span>Aula</span><ArrowRight size={16} /><span>Prática</span><ArrowRight size={16} /><span>Arquivo</span><ArrowRight size={16} /><span>Commit</span><ArrowRight size={16} /><span>Revisão</span></div></article><button type="button" disabled={stage === stages.length - 1} onClick={() => setStage(value => value + 1)}><Play size={16} /> Avançar no ciclo</button></section>;
}

function DocsSystem() {
  const [selected, setSelected] = useState(0);
  const current = FILES[selected];
  return <section className="journal13-system"><aside><header><FolderTree size={16} /> formacao-java-backend</header><strong>▾ docs</strong>{FILES.map((file, index) => <button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={file.id}><FileText size={15} />{file.path.replace('docs/', '')}</button>)}</aside><article><header><FileClock size={26} /><div><small>Responsabilidade do arquivo</small><h3>{current.path}</h3></div></header><p>{current.role}</p><div><strong>Exemplo que pertence aqui</strong><span>{current.example}</span></div><footer>{current.id === 'diario' ? 'Cronológico' : current.id === 'revisoes' ? 'Periódico' : 'Consultável'} · uma fonte previsível para cada pergunta</footer></article></section>;
}

const SETUP_STAGES = [
  { label: 'Inspecionar', command: 'Get-Location\nTest-Path .\\docs\nGet-ChildItem .\\docs -ErrorAction SilentlyContinue', output: 'Path\n----\nC:\\dev\\projects\\formacao-java-backend\nTrue\n\nMode   Name\n----   ----\n-a---  atalhos.md', proof: 'A pasta existe e atalhos.md deve ser preservado.' },
  { label: 'Criar ausentes', command: 'New-Item -ItemType Directory -Path .\\docs -Force\nNew-Item -ItemType File -Path .\\docs\\diario-de-bordo.md -ErrorAction SilentlyContinue\nNew-Item -ItemType File -Path .\\docs\\revisoes.md -ErrorAction SilentlyContinue', output: 'Directory: C:\\dev\\projects\\formacao-java-backend\n\nMode   Name\n----   ----\nd----  docs\n-a---  diario-de-bordo.md\n-a---  revisoes.md', proof: 'Somente ausentes são criados; -ErrorAction evita tratar arquivo existente como desastre.' },
  { label: 'Confirmar', command: 'Get-ChildItem .\\docs\ngit status --short', output: 'Mode   Name\n----   ----\n-a---  atalhos.md\n-a---  diario-de-bordo.md\n-a---  revisoes.md\n\n?? docs/diario-de-bordo.md\n?? docs/revisoes.md', proof: 'Os arquivos aparecem no sistema e como untracked no Git.' }
];

function Workspace() {
  const [stage, setStage] = useState(0);
  const current = SETUP_STAGES[stage];
  return <section className="journal13-workspace"><nav>{SETUP_STAGES.map((item, index) => <button type="button" className={stage === index ? 'active' : index < stage ? 'done' : ''} onClick={() => setStage(index)} key={item.label}><span>{index < stage ? <Check size={13} /> : index + 1}</span>{item.label}</button>)}</nav><div className="journal13-workspace-grid"><section className="journal13-terminal"><header><TerminalSquare size={16} /> PowerShell <em>Simulação didática</em></header><Highlight language="powershell">{current.command}</Highlight><div><small>Saída esperada ou modelo</small><pre>{current.output}</pre></div><footer><CheckCircle2 size={16} /> {current.proof}</footer></section><section className="journal13-project"><header><FolderTree size={16} /> Project <em>Simulação didática</em></header><strong>▾ formacao-java-backend</strong><span>▾ docs</span><span className="existing">M atalhos.md</span>{stage > 0 && <><span className="new">? diario-de-bordo.md</span><span className="new">? revisoes.md</span></>}<p><Keyboard size={15} /> Alternativa: selecione `docs`, use Alt + Insert → File e digite apenas o nome ausente.</p></section></div><button type="button" disabled={stage === SETUP_STAGES.length - 1} onClick={() => setStage(value => value + 1)}><Play size={16} /> Executar próxima evidência</button></section>;
}

function EntryBuilder() {
  const [mode, setMode] = useState('minimum');
  const [count, setCount] = useState(3);
  const target = mode === 'minimum' ? 5 : ENTRY_PARTS.length;
  const visibleCount = Math.min(count, target);
  const source = ['# Diário de bordo', '', 'Registro cronológico da evolução na formação Java Backend.', '', '---', '', ...ENTRY_PARTS.slice(0, visibleCount).map(part => part[1])].join('\n\n');
  const quality = [visibleCount >= 1, visibleCount >= 2, visibleCount >= 3, visibleCount >= 5, visibleCount >= 8, visibleCount >= 9];
  const labels = ['marco identificado', 'explicação própria', 'prática observável', 'comando registrado', 'dúvida exposta', 'próxima ação definida'];
  const switchMode = next => { setMode(next); setCount(next === 'minimum' ? Math.min(count, 5) : Math.max(count, 5)); };
  return <section className="journal13-entry"><header><div role="tablist"><button type="button" className={mode === 'minimum' ? 'active' : ''} onClick={() => switchMode('minimum')}><Clock3 size={16} /> Entrada mínima</button><button type="button" className={mode === 'complete' ? 'active' : ''} onClick={() => switchMode('complete')}><NotebookPen size={16} /> Marco completo</button></div><span>{mode === 'minimum' ? '5–8 minutos após uma aula comum' : 'Use após erro, decisão, prática relevante ou revisão'}</span></header><JournalDocument source={source} caption={`${visibleCount} de ${target} blocos deste modo estão visíveis.`} /><div className="journal13-entry-controls"><button type="button" disabled={visibleCount === target} onClick={() => setCount(value => value + 1)}><Play size={16} /> Adicionar próximo bloco</button><div>{quality.map((done, index) => <span className={done ? 'done' : ''} key={labels[index]}>{done ? <Check size={13} /> : <Clock3 size={13} />}{labels[index]}</span>)}</div></div></section>;
}

function Classifier() {
  const [example, setExample] = useState(0);
  const [choice, setChoice] = useState('');
  const item = CLASSIFICATIONS[example];
  const options = ['Diário', 'Anotação', 'Revisão', 'Apostila', 'Decisão', 'Atalho'];
  const correct = choice === item.answer;
  const selectExample = index => { setExample(index); setChoice(''); };
  return <section className="journal13-classifier"><nav>{CLASSIFICATIONS.map((entry, index) => <button type="button" className={example === index ? 'active' : ''} onClick={() => selectExample(index)} key={entry.text}><span>{index + 1}</span>{entry.answer === 'Diário' ? 'Experiência' : entry.answer}</button>)}</nav><article><small>Trecho para classificar</small><blockquote>{item.text}</blockquote><div role="group" aria-label="Escolha o tipo de registro">{options.map(option => <button type="button" className={choice === option ? correct ? 'correct' : 'wrong' : ''} onClick={() => setChoice(option)} key={option}>{option}</button>)}</div>{choice && <aside className={correct ? 'good' : 'danger'}>{correct ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}<div><strong>{correct ? 'Classificação coerente' : `Este trecho funciona melhor como ${item.answer}`}</strong><span>{item.reason}</span></div></aside>}</article></section>;
}

function IncidentLab() {
  const [kind, setKind] = useState('classpath');
  const item = INCIDENTS[kind];
  const source = `### Erro — ${item.title}\n\n**Tentativa**\n\n\`\`\`powershell\n${item.attempt}\n\`\`\`\n\n**Mensagem essencial**\n\n\`\`\`text\n${item.message}\n\`\`\`\n\n**Como inspecionei**\n\n\`\`\`powershell\n${item.inspect}\n\`\`\`\n\n**Causa confirmada**\n\n${item.cause}\n\n**Correção**\n\n${item.fix}\n\n**Prova posterior**\n\n${item.proof}`;
  return <section className="journal13-incident"><nav>{Object.keys(INCIDENTS).map(id => <button type="button" className={kind === id ? 'active' : ''} onClick={() => setKind(id)} key={id}>{INCIDENTS[id].title}</button>)}</nav><div className="journal13-incident-flow"><span>Tentativa</span><ArrowRight /><span>Mensagem</span><ArrowRight /><span>Inspeção</span><ArrowRight /><span>Causa</span><ArrowRight /><span>Correção</span><ArrowRight /><span>Prova</span></div><JournalDocument source={source} file="trecho da entrada atual" caption="A causa está confirmada por evidência; não é apenas a última tentativa que funcionou." /></section>;
}

const GIT_STAGES = [
  { label: 'Revisar', command: 'git status --short\ngit diff -- Main.java docs/diario-de-bordo.md', output: ' M Main.java\n M docs/diario-de-bordo.md\n\n+System.out.println("Diário validado");\n+### Erro — Classe principal não encontrada', proof: 'Código e entrada descrevem a mesma prática; nada fora do escopo aparece.' },
  { label: 'Preparar', command: 'git add Main.java docs/diario-de-bordo.md\ngit diff --staged --stat\ngit diff --staged', output: ' Main.java                    | 1 +\n docs/diario-de-bordo.md      | 18 ++++++++++++++++++\n 2 files changed, 19 insertions(+)', proof: 'A staging area contém uma intenção coerente: prática e evidência.' },
  { label: 'Registrar', command: 'git commit -m "Registra diagnostico de execucao Java"', output: '[main e83a701] Registra diagnostico de execucao Java\n 2 files changed, 19 insertions(+)', proof: 'A mensagem descreve a mudança, não apenas “aula 013”. O hash varia.' },
  { label: 'Rastrear', command: 'git status\ngit log --oneline -3', output: 'On branch main\nnothing to commit, working tree clean\n\ne83a701 Registra diagnostico de execucao Java\nd42c1a8 Documenta base de Markdown tecnico\nb6c2d10 Documenta conexao com repositorio remoto', proof: 'A linha do tempo conecta os marcos e a árvore termina limpa.' }
];

function GitTrace() {
  const [stage, setStage] = useState(0);
  const current = GIT_STAGES[stage];
  return <section className="journal13-git"><nav>{GIT_STAGES.map((item, index) => <button type="button" className={stage === index ? 'active' : index < stage ? 'done' : ''} onClick={() => setStage(index)} key={item.label}><span>{index < stage ? <Check size={13} /> : index + 1}</span>{item.label}</button>)}</nav><section className="journal13-command"><header><TerminalSquare size={16} /><span>PowerShell — raiz do repositório</span><CopyButton value={current.command} /></header><Highlight language="powershell">{current.command}</Highlight><div><small>Saída esperada ou modelo</small><pre>{current.output}</pre></div><footer><CheckCircle2 size={16} /><span><strong>O que prova:</strong> {current.proof}</span></footer></section><button type="button" disabled={stage === GIT_STAGES.length - 1} onClick={() => setStage(value => value + 1)}><Play size={16} /> Avançar na rastreabilidade</button></section>;
}

function ReviewLab() {
  const [answer, setAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [cadence, setCadence] = useState('week');
  const source = '# Revisões\n\n## Revisão 001 — M0 parcial\n\n### Recuperei sem consultar\n\n' + (answer.trim() || '_Escreva antes de abrir o diário._') + '\n\n### Comparei e corrigi\n\n- Commit registra localmente; push publica no remoto.\n- `git diff` mostra mudanças não preparadas; `git diff --staged` mostra o próximo commit.\n\n### Ponto que preciso reforçar\n\nExplicar upstream e executar um segundo ciclo sem roteiro.\n\n### Próxima ação\n\nRefazer um push em um repositório de laboratório e confirmar com `git branch -vv`.';
  const cadences = {
    lesson: ['Fim da aula', 'Registre o marco e uma dúvida enquanto a evidência está fresca.'],
    week: ['Fim da semana', 'Recupere primeiro, agrupe lacunas e escolha uma prática curta.'],
    module: ['Fim do módulo', 'Conecte conceitos, refaça pré-requisitos fracos e produza uma entrega.']
  };
  return <section className="journal13-review"><div className="journal13-recall"><header><Brain size={23} /><div><small>Passo 1 · sem consultar</small><h3>Explique commit, push e as duas formas de diff</h3></div></header><textarea value={answer} onChange={event => setAnswer(event.target.value)} placeholder="Escreva com suas palavras. Não procure perfeição; procure a lacuna." /><button type="button" onClick={() => setRevealed(true)} disabled={!answer.trim()}><Eye size={16} /> Comparar com evidências</button>{revealed && <aside><CheckCircle2 size={20} /><span><strong>Passo 2 · compare, não apenas marque certo/errado</strong>Procure conceitos ausentes, afirmações vagas e algo que você ainda não consegue executar.</span></aside>}</div><JournalDocument source={source} file="docs/revisoes.md" caption="A próxima ação transforma a lacuna em prática, não em uma promessa vaga de reler." /><div className="journal13-cadence"><nav>{Object.keys(cadences).map(id => <button type="button" className={cadence === id ? 'active' : ''} onClick={() => setCadence(id)} key={id}>{cadences[id][0]}</button>)}</nav><div><CalendarClock size={25} /><span><strong>{cadences[cadence][0]}</strong>{cadences[cadence][1]}</span></div><p>Não existe intervalo mágico igual para todo conteúdo. Volte antes que a habilidade seja necessária e ajuste pela dificuldade observada.</p></div></section>;
}

function SafetyLab() {
  const [scenario, setScenario] = useState('unsafe');
  const cases = {
    unsafe: { title: 'Entrada que não deve ser publicada', text: 'Cliente Maria Silva, CPF 000..., token ghp_REAL, URL intranet.empresa.local e print do painel de produção.', verdict: 'Pare: contém dado pessoal, credencial, endereço interno e contexto corporativo.', action: 'Não commite. Remova o conteúdo real; se um token já foi publicado, revogue ou rotacione.' },
    safe: { title: 'Exemplo técnico reduzido', text: 'Cliente A, documento fictício, token removido. O método deveria rejeitar status CONCLUIDO, mas aceitou. Caso reproduzido em laboratório local.', verdict: 'O registro preserva o comportamento técnico sem o contexto sensível.', action: 'Ainda confirme política, autorização e necessidade antes de compartilhar externamente.' },
    work: { title: 'Tradução para o trabalho', text: 'Cenário, ação executada, resultado esperado, resultado obtido, evidência de teste e decisão registrada.', verdict: 'A habilidade aparece em ticket, descrição de PR, ADR, changelog, runbook, postmortem e troubleshooting.', action: 'Não presuma que um diário pessoal deve viver no repositório corporativo.' }
  };
  const current = cases[scenario];
  return <section className="journal13-safety"><nav>{Object.keys(cases).map(id => <button type="button" className={scenario === id ? 'active' : ''} onClick={() => setScenario(id)} key={id}>{id === 'unsafe' ? <LockKeyhole size={16} /> : id === 'safe' ? <ShieldCheck size={16} /> : <GraduationCap size={16} />}{cases[id].title}</button>)}</nav><article className={scenario === 'unsafe' ? 'danger' : 'good'}>{scenario === 'unsafe' ? <AlertTriangle size={29} /> : <ShieldCheck size={29} />}<small>Cenário</small><h3>{current.title}</h3><blockquote>{current.text}</blockquote><p><strong>Leitura:</strong> {current.verdict}</p><footer>{current.action}</footer></article><div className="journal13-business"><span>Diário de estudo</span><ArrowRight /><span>clareza técnica</span><ArrowRight /><span>ticket · PR · ADR · runbook · postmortem</span></div></section>;
}

function ErrorClinic() {
  const [selected, setSelected] = useState(0);
  const item = COMMON_ERRORS[selected];
  return <section className="journal13-errors"><nav>{COMMON_ERRORS.map((error, index) => <button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={error[0]}><span>{index + 1}</span>{error[0]}</button>)}</nav><article><header><Wrench size={24} /><div><small>Diagnóstico do sistema de aprendizagem</small><h3>{item[0]}</h3></div></header><div>{[['Sintoma', item[1], Search], ['Correção', item[2], RefreshCw], ['Confirmação', item[3], CheckCircle2]].map(([title, text, Icon]) => <section key={title}><Icon size={18} /><strong>{title}</strong><p>{text}</p></section>)}</div></article></section>;
}

const DELIVERY_STAGES = [
  { label: 'Revisar', command: 'git status --short\ngit diff -- docs/diario-de-bordo.md docs/atalhos.md docs/revisoes.md', output: ' M docs/atalhos.md\n M docs/diario-de-bordo.md\n?? docs/revisoes.md', proof: 'Somente os três documentos planejados aparecem; nenhum segredo foi encontrado.' },
  { label: 'Preparar', command: 'git add docs/diario-de-bordo.md docs/atalhos.md docs/revisoes.md\ngit diff --staged --stat\ngit diff --staged', output: ' docs/atalhos.md          |  4 ++++\n docs/diario-de-bordo.md  | 28 ++++++++++++++++++++++++++++\n docs/revisoes.md         | 18 ++++++++++++++++++\n 3 files changed, 50 insertions(+)', proof: 'A staging area contém a rotina documental completa e revisada.' },
  { label: 'Registrar', command: 'git commit -m "Organiza diario de bordo e revisoes"', output: '[main f19be20] Organiza diario de bordo e revisoes\n 3 files changed, 50 insertions(+)', proof: 'A mensagem comunica a intenção; o hash e as quantidades podem variar.' },
  { label: 'Confirmar', command: 'git status\ngit log -1 --oneline', output: 'On branch main\nnothing to commit, working tree clean\n\nf19be20 Organiza diario de bordo e revisoes', proof: 'Entrega registrada e working tree limpo.' }
];

function Delivery() {
  const [stage, setStage] = useState(0);
  const [minutes, setMinutes] = useState(8);
  const current = DELIVERY_STAGES[stage];
  return <section className="journal13-delivery"><nav>{DELIVERY_STAGES.map((item, index) => <button type="button" className={stage === index ? 'active' : index < stage ? 'done' : ''} onClick={() => setStage(index)} key={item.label}><span>{index < stage ? <Check size={13} /> : index + 1}</span>{item.label}</button>)}</nav><div><section className="journal13-command"><header><TerminalSquare size={16} /><span>PowerShell — entrega final</span><CopyButton value={current.command} /></header><Highlight language="powershell">{current.command}</Highlight><div><small>Saída esperada ou modelo</small><pre>{current.output}</pre></div><footer><CheckCircle2 size={16} /><span><strong>O que prova:</strong> {current.proof}</span></footer></section><section className="journal13-commitment"><TimerReset size={26} /><div><small>Compromisso sustentável</small><strong>{minutes} minutos ao final de cada marco</strong><input aria-label="Minutos destinados ao registro" type="range" min="5" max="15" value={minutes} onChange={event => setMinutes(Number(event.target.value))} /><span>Registre aula comum no modo mínimo; use o modo completo somente quando a evidência justificar.</span></div></section></div><button type="button" disabled={stage === DELIVERY_STAGES.length - 1} onClick={() => setStage(value => value + 1)}><Play size={16} /> Executar próxima evidência</button></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  const map = { learningTrace: LearningTrace, docsSystem: DocsSystem, workspace: Workspace, entryBuilder: EntryBuilder, classifier: Classifier, incidentLab: IncidentLab, gitTrace: GitTrace, reviewLab: ReviewLab, safetyLab: SafetyLab, errorClinic: ErrorClinic, delivery: Delivery };
  if (map[block.type]) { const Component = map[block.type]; return <Component />; }
  if (block.type === 'note') { const Icon = block.tone === 'warning' || block.tone === 'danger' ? AlertTriangle : Lightbulb; return <aside className={'guided-note ' + (block.tone || 'info')}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>; }
  if (block.type === 'result') return <section className="guided-result"><h3><ClipboardCheck size={20} /> {block.title}</h3><ul>{block.items.map(item => <li key={item}><CheckCircle2 size={16} /> {item}</li>)}</ul></section>;
  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  return null;
}

export default function GuidedLearningJournalLesson013({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const normalized = useRef(false);
  const [completed, setCompleted] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return new Set(Array.isArray(saved) ? saved : []); } catch { return new Set(); } });
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed])), [completed]);
  const active = steps[activeIndex];
  const progress = Math.round((completed.size / steps.length) * 100);
  const allDone = completed.size === steps.length;
  const activeDone = completed.has(active.id);
  const lessonDone = isCompleted && allDone;
  const label = useMemo(() => completed.size + ' de ' + steps.length + ' etapas concluídas', [completed]);
  useEffect(() => { if (normalized.current) return; normalized.current = true; if (isCompleted && !allDone) onToggleCompleted(); }, [allDone, isCompleted, onToggleCompleted]);
  const select = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const toggle = () => { if (activeDone && isCompleted) onToggleCompleted(); setCompleted(previous => { const next = new Set(previous); if (next.has(active.id)) next.delete(active.id); else next.add(active.id); return next; }); };
  return <article className="guided-git-lesson guided-learning-journal-lesson">
    <header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><NotebookPen size={17} /> Mentoria de aprendizagem rastreável</span><p className="guided-sequence">013 · M0.13</p><h1>Não deixe uma aula terminar sem saber o que ficou</h1><p>Registre uma experiência real, transforme erro em evidência, revise sem se enganar e use o Git para preservar a história da sua evolução.</p></div><div className="guided-hero-status"><History size={42} /><strong>{progress}%</strong><span>{label}</span></div><div className="guided-progress-track" aria-label={'Progresso: ' + progress + '%'}><span style={{ width: progress + '%' }} /></div></header>
    <GuidedLessonFacts ariaLabel="Resultado da aula" items={[{ value: 3, label: 'arquivos entregues' }, { value: 1, label: 'entrada completa' }, { value: 10, label: 'antipadrões recuperáveis' }]} />
    <div className="guided-layout"><nav className="guided-step-nav" aria-label="Etapas da aula 013"><div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>{steps.map((step, index) => <button type="button" key={step.id} className={(index === activeIndex ? 'active ' : '') + (completed.has(step.id) ? 'done' : '')} onClick={() => select(index)}><span className="guided-step-number">{completed.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}</nav>
      <main className="guided-step-content"><div className="guided-step-heading"><span>{active.eyebrow} · {active.duration}</span><h2>{active.title}</h2></div><div className="guided-blocks">{active.blocks.map((block, index) => <ContentBlock block={block} key={active.id + '-' + block.type + '-' + index} />)}</div><div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => select(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (activeDone ? 'undo' : 'complete')} onClick={toggle}>{activeDone ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><Check size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeDone} onClick={() => select(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div></div>{allDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>{lessonDone ? 'Rotina de aprendizagem registrada' : 'Mentoria concluída'}</h3><p>{lessonDone ? 'Entrada, revisão, rastreabilidade e compromisso estão registrados.' : 'Conclua a aula para liberar o uso ético de IA.'}</p></div><button type="button" className={lessonDone ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonDone ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}</main>
    </div>
    <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 012</button><div className={'guided-course-status ' + (lessonDone ? 'completed' : allDone ? 'ready' : '')}>{lessonDone ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonDone ? 'Aula concluída' : allDone ? 'Pronta para concluir' : completed.size + ' de ' + steps.length + ' etapas'}</strong><small>{lessonDone ? 'Evolução rastreável' : allDone ? 'Use o botão acima' : 'Registre, recupere e confirme'}</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonDone}>Aula 014 <ArrowRight size={17} /></button></footer>
  </article>;
}
