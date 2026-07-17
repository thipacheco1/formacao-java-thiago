import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Braces,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Code2,
  Compass,
  Copy,
  FileCode2,
  FileText,
  Folder,
  FolderOpen,
  FolderTree,
  GitBranch,
  History,
  Keyboard,
  Layers3,
  Lightbulb,
  ListChecks,
  Monitor,
  Package,
  Play,
  RotateCcw,
  Search,
  ShieldCheck,
  Terminal,
  Trash2,
  Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedPowerShellLesson.css';

const LESSON_STORAGE_KEY = 'guided-powershell-lesson-004-progress';

const CREATE_COMMANDS = [
  {
    command: 'cd C:\\dev\\labs',
    prompt: 'PS C:\\dev>',
    nextPrompt: 'PS C:\\dev\\labs>',
    output: '',
    meaning: 'Você entrou na área de experimentos criada na aula anterior.',
    treeStage: 0
  },
  {
    command: 'mkdir terminal-basico',
    prompt: 'PS C:\\dev\\labs>',
    nextPrompt: 'PS C:\\dev\\labs>',
    output: '    Directory: C:\\dev\\labs\n\nMode   LastWriteTime       Name\n----   -------------       ----\nd----  16/07/2026 15:20   terminal-basico',
    meaning: 'O modo iniciado por d identifica um diretório. Data e hora variam.',
    treeStage: 1
  },
  {
    command: 'cd terminal-basico',
    prompt: 'PS C:\\dev\\labs>',
    nextPrompt: 'PS C:\\dev\\labs\\terminal-basico>',
    output: '',
    meaning: 'O prompt mudou: os próximos caminhos relativos nascem dentro do laboratório.',
    treeStage: 1
  },
  {
    command: 'mkdir entrada, saida, docs',
    prompt: 'PS C:\\dev\\labs\\terminal-basico>',
    nextPrompt: 'PS C:\\dev\\labs\\terminal-basico>',
    output: 'Mode   Name\n----   ----\nd----  entrada\nd----  saida\nd----  docs',
    meaning: 'Três diretórios foram criados pelo mesmo comando PowerShell.',
    treeStage: 2
  },
  {
    command: "New-Item -ItemType File -Path 'docs\\anotacoes.md'",
    prompt: 'PS C:\\dev\\labs\\terminal-basico>',
    nextPrompt: 'PS C:\\dev\\labs\\terminal-basico>',
    output: '    Directory: C:\\dev\\labs\\terminal-basico\\docs\n\nMode   Length Name\n----   ------ ----\n-a---       0 anotacoes.md',
    meaning: 'O arquivo existe e começa vazio; Length 0 é esperado.',
    treeStage: 3
  },
  {
    command: 'ls; ls .\\docs',
    prompt: 'PS C:\\dev\\labs\\terminal-basico>',
    nextPrompt: 'PS C:\\dev\\labs\\terminal-basico>',
    output: 'Mode   Name\n----   ----\nd----  docs\nd----  entrada\nd----  saida\n\nMode   Length Name\n----   ------ ----\n-a---       0 anotacoes.md',
    meaning: 'A listagem confirma tanto as pastas da raiz quanto o arquivo dentro de docs.',
    treeStage: 3
  }
];

const NAV_COMMANDS = [
  { command: 'pwd', path: 'C:\\dev', note: 'Você apenas consulta; nada muda.' },
  { command: 'cd .\\labs', path: 'C:\\dev\\labs', note: '. significa “a partir daqui”; labs é caminho relativo.' },
  { command: 'cd ..', path: 'C:\\dev', note: '.. aponta para a pasta pai.' },
  { command: 'cd .\\projects', path: 'C:\\dev\\projects', note: 'Você entra em uma pasta irmã de labs a partir de C:\\dev.' },
  { command: 'cd C:\\dev\\labs', path: 'C:\\dev\\labs', note: 'O caminho absoluto funciona sem depender do ponto de partida.' },
  { command: 'cd ..\\projects', path: 'C:\\dev\\projects', note: 'A partir de labs, .. volta a C:\\dev e projects entra na pasta irmã.' }
];

const TOOL_CASES = [
  {
    id: 'healthy', label: 'Ferramenta encontrada', tone: 'good', command: 'Get-Command java',
    output: 'CommandType  Name      Version  Source\n-----------  ----      -------  ------\nApplication  java.exe  21.0.7   C:\\Program Files\\Eclipse Adoptium\\jdk-21\\bin\\java.exe',
    diagnosis: 'O PowerShell encontrou uma aplicação chamada java no PATH. Caminho e versão variam na sua máquina.',
    next: 'Confirme o runtime com java -version. A instalação completa será validada na próxima aula.'
  },
  {
    id: 'native', label: 'Localizador do Windows', tone: 'info', command: 'where.exe java',
    output: 'C:\\Program Files\\Eclipse Adoptium\\jdk-21\\bin\\java.exe',
    diagnosis: 'O executável where.exe pesquisou o diretório atual e o PATH. O sufixo .exe evita confusão com nomes do PowerShell.',
    next: 'Se houver várias linhas, existem várias cópias acessíveis; a ordem do PATH passa a importar.'
  },
  {
    id: 'missing', label: 'Comando não encontrado', tone: 'danger', command: 'mvn -version',
    output: "mvn: The term 'mvn' is not recognized as a name of a cmdlet, function, script file, or executable program.",
    diagnosis: 'O Maven nem começou a executar. Pode faltar instalação, PATH, nome correto ou uma nova sessão do terminal.',
    next: 'Use Get-Command mvn. Se continuar ausente, inspecione $env:MAVEN_HOME e $env:Path; não altere valores por tentativa.'
  },
  {
    id: 'program', label: 'Programa executou e falhou', tone: 'warning', command: 'java Main',
    output: 'Error: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main',
    diagnosis: 'O comando java foi encontrado e iniciado. Agora o problema é classe, pasta, compilação ou classpath — não “Java ausente”.',
    next: 'Comece com pwd e ls. A Aula 005 separará compilação e execução com javac e java.'
  }
];

const BACKEND_CASES = [
  {
    id: 'pom', title: 'Maven não encontra o projeto', symptom: "The goal you specified requires a project to execute but there is no POM in this directory",
    inspect: 'pwd; ls', evidence: 'pom.xml não aparece na listagem', decision: 'Entre na raiz correta do projeto e só então repita mvn clean test.', icon: Package
  },
  {
    id: 'java', title: 'javac não encontra o arquivo', symptom: 'error: file not found: Main.java',
    inspect: 'pwd; ls *.java', evidence: 'Main.java está em outra pasta ou tem outro nome', decision: 'Navegue até o diretório do fonte; não reinstale o JDK sem evidência.', icon: Braces
  },
  {
    id: 'log', title: 'O log esperado não apareceu', symptom: 'A aplicação informa que gravou um log, mas você não o vê',
    inspect: 'pwd; ls .\\logs', evidence: 'A pasta pode ser relativa à raiz em que a aplicação iniciou', decision: 'Confirme a pasta de trabalho e procure app.log, error.log e access.log sem apagar nada.', icon: FileText
  },
  {
    id: 'permission', title: 'Acesso negado', symptom: 'Access to the path is denied',
    inspect: 'pwd; Get-Item .', evidence: 'A pasta atual pode estar em uma área protegida', decision: 'Use uma pasta de desenvolvimento sob C:\\dev ou seu usuário; não eleve privilégio como reflexo.', icon: ShieldCheck
  }
];

const DIARY = `# Aula 004 — Terminal e PowerShell

## Laboratório
- Pasta: C:\\dev\\labs\\terminal-basico
- Estado final: entrada, saida, docs e docs\\terminal.md

## Comandos que pratiquei
- pwd / Get-Location
- ls / Get-ChildItem
- cd / Set-Location
- mkdir e New-Item
- Copy-Item, Move-Item e Remove-Item
- Get-History, cls e Tab
- Get-Command e where.exe

## Evidência que sei interpretar
Antes de agir, confirmo minha localização e o que existe com pwd e ls.

## Um erro que consigo classificar
Comando não encontrado significa que o PowerShell não localizou o programa. Um erro emitido pelo programa prova que ele chegou a executar.

## Dúvida para a próxima revisão
-`;

const steps = [
  {
    id: 'modelo', label: 'Mapa do terminal', duration: '8 min', eyebrow: 'Comece aqui',
    title: 'Veja quem recebe o texto e onde cada comando acontece',
    blocks: [
      { type: 'lead', text: 'Eu não quero que você decore uma lista. Primeiro vamos tornar visível a cadeia inteira: você digita numa janela, o PowerShell interpreta e o sistema devolve uma evidência.' },
      { type: 'terminalLayers' },
      { type: 'result', title: 'O modelo que usaremos na aula inteira', items: ['Localização: em qual pasta o prompt está?', 'Comando: qual mudança ou consulta você pretende fazer?', 'Evidência: qual saída, prompt ou arquivo prova o resultado?', 'Confirmação: o estado final bate com sua intenção?'] }
    ]
  },
  {
    id: 'orientacao', label: 'Onde estou?', duration: '9 min', eyebrow: 'Etapa 1',
    title: 'Use o primeiro ciclo profissional: localizar, observar e só depois agir',
    blocks: [
      { type: 'lead', text: 'Abra o PowerShell em C:\\dev, a raiz preparada na aula anterior. Eu vou conduzir apenas duas consultas: elas não alteram arquivo algum e formam seu ponto de partida para todo diagnóstico.' },
      { type: 'orientationLab' },
      { type: 'note', tone: 'info', title: 'Aliases são atalhos', text: 'No PowerShell, pwd aponta para Get-Location; ls e dir apontam para Get-ChildItem; cd aponta para Set-Location. Você pode usar os atalhos no terminal e reconhecer os nomes completos em scripts e documentação.' }
    ]
  },
  {
    id: 'navegacao', label: 'Navegar por caminhos', duration: '13 min', eyebrow: 'Etapa 2',
    title: 'Mude de pasta sem perder a noção do ponto de partida',
    blocks: [
      { type: 'lead', text: 'Agora o prompt vai mudar de verdade. Acompanhe o breadcrumb e a árvore a cada comando; não avance até conseguir explicar se o caminho é absoluto ou relativo.' },
      { type: 'navigationLab' },
      { type: 'note', tone: 'warning', title: 'Arquivo não é pasta', text: 'cd README.md falha porque cd muda para um contêiner. Um arquivo é aberto por um editor ou programa; não é um lugar no qual o terminal entra.' }
    ]
  },
  {
    id: 'criacao', label: 'Criar pastas e arquivo', duration: '16 min', eyebrow: 'Etapa 3',
    title: 'Construa o laboratório e veja o disco mudar comando por comando',
    blocks: [
      { type: 'lead', text: 'Vamos criar a mesma estrutura prometida pelo material original, mas agora cada ação terá prompt, saída, significado e uma árvore sincronizada para você comparar com sua máquina.' },
      { type: 'creationLab' },
      { type: 'result', title: 'Estado que precisa existir antes de avançar', items: ['O prompt está em C:\\dev\\labs\\terminal-basico', 'entrada, saida e docs são diretórios', 'docs\\anotacoes.md é um arquivo vazio', 'ls e a árvore representam o mesmo estado'] }
    ]
  },
  {
    id: 'transformacao', label: 'Copiar, mover e renomear', duration: '13 min', eyebrow: 'Etapa 4',
    title: 'Diferencie três operações olhando para o estado antes e depois',
    blocks: [
      { type: 'lead', text: '“Copiar” e “mover” parecem palavras simples, mas produzem estados diferentes. Explore as três operações e sempre conte quantos arquivos permanecem depois.' },
      { type: 'transferLab' },
      { type: 'note', tone: 'info', title: 'Renomear com clareza', text: 'Move-Item consegue mover e também renomear. Em scripts de equipe, Rename-Item pode comunicar melhor a intenção quando apenas o nome muda; aqui preservamos Move-Item porque ele estava no roteiro original.' }
    ]
  },
  {
    id: 'remocao', label: 'Remover com segurança', duration: '12 min', eyebrow: 'Etapa 5',
    title: 'Transforme cuidado em um protocolo que impede adivinhação',
    blocks: [
      { type: 'lead', text: 'Apagar não começa em Remove-Item. Começa provando onde você está, qual alvo existe e se ele é exatamente a cópia criada para esta prática.' },
      { type: 'safeRemoval' },
      { type: 'note', tone: 'danger', title: 'Não copie comandos destrutivos entre shells', text: 'rm -rf pertence ao universo Unix e não deve virar tentativa automática no PowerShell. Nesta aula removemos um único arquivo conhecido; pastas recursivas exigem outra análise e outro nível de cuidado.' }
    ]
  },
  {
    id: 'eficiencia', label: 'Histórico e Tab', duration: '10 min', eyebrow: 'Etapa 6',
    title: 'Ganhe velocidade sem transformar repetição em piloto automático',
    blocks: [
      { type: 'lead', text: 'Profissionais usam teclado para reduzir digitação, não para deixar de ler. Teste cada recurso e observe o que muda na linha, na tela e no sistema de arquivos.' },
      { type: 'efficiencyLab' },
      { type: 'result', title: 'Três efeitos que não podem ser confundidos', items: ['Tab completa texto compatível; não executa', 'Setas recuperam comandos; Enter ainda é sua decisão', 'cls limpa a tela; arquivos e histórico da sessão continuam existindo'] }
    ]
  },
  {
    id: 'ferramentas', label: 'PATH e ferramentas', duration: '17 min', eyebrow: 'Etapa 7',
    title: 'Descubra se a falha está no comando, no ambiente ou no programa',
    blocks: [
      { type: 'lead', text: 'Esta é a parte que evita reinstalações aleatórias. Leia cada caso como evidência: o PowerShell encontrou um programa? Qual caminho venceu? O programa começou e devolveu seu próprio erro?' },
      { type: 'toolDiagnosis' },
      { type: 'environmentTimeline' },
      { type: 'note', tone: 'warning', title: 'Correção importante do material antigo', text: 'No PowerShell, prefira Get-Command java. Se quiser o localizador clássico do Windows, escreva where.exe java. O nome where sem .exe pode ser confundido com um nome/alias do próprio PowerShell.' }
    ]
  },
  {
    id: 'backend', label: 'Diagnóstico backend', duration: '14 min', eyebrow: 'Etapa 8',
    title: 'Leia falhas de Java, Maven e logs antes de escolher uma correção',
    blocks: [
      { type: 'lead', text: 'Agora aplique o mesmo ciclo em situações que você verá no restante da formação. Selecione um sintoma e siga a trilha: inspeção segura, evidência e decisão.' },
      { type: 'backendClinic' },
      { type: 'impactFlow' }
    ]
  },
  {
    id: 'missao', label: 'Missão e diário', duration: '18 min', eyebrow: 'Etapa 9',
    title: 'Resolva um cenário novo e deixe uma prova do seu raciocínio',
    blocks: [
      { type: 'lead', text: 'Sem copiar a sequência pronta, crie um laboratório de importação. Eu forneço o estado final e as regras; você decide a ordem dos comandos e confirma cada mudança.' },
      { type: 'challenge', title: 'Missão: importacao-clientes', text: 'Dentro de C:\\dev\\labs, crie importacao-clientes com entrada, processados e logs. Crie entrada\\clientes.csv, copie-o para processados, renomeie a cópia para clientes-processados.csv e remova somente um arquivo temporário chamado logs\\execucao.tmp.', acceptance: ['pwd confirma a raiz antes da criação', 'ls confirma cada estado importante', 'o CSV original continua em entrada', 'a cópia renomeada existe em processados', 'execucao.tmp foi inspecionado e removido sem operação recursiva', 'Get-History mostra o roteiro executado', 'você consegue classificar um erro sem adivinhar'] },
      { type: 'diary' },
      { type: 'note', tone: 'info', title: 'Ponte para a Aula 005', text: 'Você já sabe perguntar se java e javac existem e onde foram encontrados. Na próxima aula, usaremos essa autonomia para separar JDK, JRE, JVM, compilação e execução — sem antecipar o classpath agora.' }
    ]
  }
];

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return <button type="button" className="guided-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function PowerShellCode({ children, title = 'PowerShell' }) {
  return (
    <div className="ps-code-window">
      <header><Terminal size={16} /><span>{title}</span><CopyButton value={children} label="Copiar comando" /></header>
      <SyntaxHighlighter language="powershell" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#101827', fontSize: '.84rem', lineHeight: 1.65 }}>{children}</SyntaxHighlighter>
    </div>
  );
}

function TerminalLayersMock() {
  const [surface, setSurface] = useState('windows');
  return (
    <section className="ps-layers">
      <div className="ps-surface-tabs" role="tablist" aria-label="Onde usar PowerShell">
        <button type="button" role="tab" aria-selected={surface === 'windows'} className={surface === 'windows' ? 'active' : ''} onClick={() => setSurface('windows')}><Monitor size={16} /> Windows Terminal</button>
        <button type="button" role="tab" aria-selected={surface === 'intellij'} className={surface === 'intellij' ? 'active' : ''} onClick={() => setSurface('intellij')}><Code2 size={16} /> Terminal do IntelliJ</button>
      </div>
      <div className={`ps-window-mock ${surface}`} role="tabpanel">
        <header>{surface === 'windows' ? <><Terminal size={17} /> PowerShell</> : <><Code2 size={17} /> api-pedidos — IntelliJ IDEA</>}<span>— □ ×</span></header>
        {surface === 'intellij' && <div className="ps-ide-strip"><span>Project</span><span>Editor: PedidoService.java</span><strong>Terminal</strong><span>Problems</span></div>}
        <div className="ps-window-screen"><p><span className="prompt">PS C:\dev&gt;</span> <span className="command">pwd</span></p><pre>Path{`\n`}----{`\n`}C:\dev</pre><p><span className="prompt">PS C:\dev&gt;</span> <i /></p></div>
      </div>
      <div className="ps-layer-diagram" aria-label="Fluxo entre terminal, shell, sistema e resultado">
        <article><Monitor size={22} /><strong>Terminal</strong><span>A janela e a interface</span></article><ChevronRight />
        <article><Terminal size={22} /><strong>PowerShell</strong><span>Interpreta o comando</span></article><ChevronRight />
        <article><FolderTree size={22} /><strong>Sistema</strong><span>Lê ou altera o estado</span></article><ChevronRight />
        <article><ClipboardCheck size={22} /><strong>Evidência</strong><span>Saída, prompt ou arquivo</span></article>
      </div>
      <footer><Lightbulb size={16} /><span>{surface === 'windows' ? 'Abra pelo menu Iniciar e procure “PowerShell” ou “Terminal”. Para este laboratório, não use administrador.' : 'No IntelliJ, abra View → Tool Windows → Terminal ou clique na aba Terminal. O diretório inicial costuma ser a raiz do projeto; confirme com pwd.'}</span></footer>
    </section>
  );
}

function OrientationLab() {
  const [stage, setStage] = useState(0);
  const entries = [
    { command: 'pwd', output: 'Path\n----\nC:\\dev', meaning: 'A pasta atual é a raiz de desenvolvimento criada na Aula 003. Nada foi alterado.' },
    { command: 'ls', output: '    Directory: C:\\dev\n\nMode   Name\n----   ----\nd----  labs\nd----  projects\nd----  studies\nd----  temp\nd----  tools', meaning: 'Há cinco diretórios. O d no modo indica pasta; outras colunas podem variar.' }
  ];
  return (
    <section className="ps-orientation-lab">
      <div className="ps-terminal" aria-live="polite"><header><Terminal size={16} /> PowerShell <span>localização + comando</span></header><div>{entries.slice(0, stage).map(item => <div className="ps-entry" key={item.command}><p><span>PS C:\dev&gt;</span> {item.command}</p><pre>{item.output}</pre></div>)}{stage < entries.length ? <p className="ps-cursor"><span>PS C:\dev&gt;</span><i /></p> : <p className="ps-success"><CheckCircle2 size={17} /> Orientação confirmada.</p>}</div></div>
      <aside><div className="ps-cycle"><span className={stage >= 0 ? 'active' : ''}>1. localizar</span><ArrowRight /><span className={stage >= 1 ? 'active' : ''}>2. observar</span><ArrowRight /><span className={stage >= 2 ? 'active' : ''}>3. decidir</span></div>{stage < entries.length ? <><small>Próxima consulta</small><PowerShellCode>{entries[stage].command}</PowerShellCode><button type="button" className="ps-run" onClick={() => setStage(value => value + 1)}><Play size={16} /> Executar na simulação</button></> : <div className="ps-evidence"><CheckCircle2 /><strong>Agora você pode agir</strong><p>Você provou o local e viu o conteúdo antes de mudar o disco.</p></div>}{stage > 0 && <p className="ps-meaning"><strong>Leitura da última saída:</strong> {entries[stage - 1].meaning}</p>}<button type="button" className="ps-reset" onClick={() => setStage(0)} disabled={stage === 0}><RotateCcw size={15} /> Reiniciar</button></aside>
    </section>
  );
}

function PathTree({ path }) {
  const labs = path.endsWith('\\labs');
  const projects = path.endsWith('\\projects');
  const terminal = path.includes('terminal-basico');
  return <div className="ps-path-tree"><span><FolderOpen size={15} /> C:\dev</span><span className={`level ${labs ? 'current' : ''}`}><FolderOpen size={15} /> labs</span><span className={`level ${projects ? 'current' : ''}`}><FolderOpen size={15} /> projects</span><span className="level"><Folder size={14} /> studies</span>{terminal && <span className="level two"><FolderOpen size={15} /> terminal-basico</span>}</div>;
}

function NavigationLab() {
  const [index, setIndex] = useState(0);
  const current = NAV_COMMANDS[index];
  return (
    <section className="ps-navigation-lab">
      <div className="ps-navigation-visual"><div className="ps-breadcrumb" aria-label={`Pasta atual: ${current.path}`}>{current.path.split('\\').map((part, partIndex) => <React.Fragment key={`${part}-${partIndex}`}><span>{part}</span>{partIndex < current.path.split('\\').length - 1 && <ChevronRight size={13} />}</React.Fragment>)}</div><PathTree path={current.path} /></div>
      <div className="ps-navigation-controls"><small>Passo {index + 1} de {NAV_COMMANDS.length}</small><PowerShellCode>{current.command}</PowerShellCode><p>{current.note}</p><div><button type="button" onClick={() => setIndex(value => Math.max(0, value - 1))} disabled={index === 0}><ArrowLeft size={15} /> Voltar</button><button type="button" className="primary" onClick={() => setIndex(value => Math.min(NAV_COMMANDS.length - 1, value + 1))} disabled={index === NAV_COMMANDS.length - 1}>Executar e ver destino <ArrowRight size={15} /></button></div></div>
      <footer><Compass size={17} /><span><strong>{current.command.includes('C:\\') ? 'Caminho absoluto:' : current.command === 'pwd' ? 'Consulta:' : 'Caminho relativo:'}</strong> {current.command.includes('C:\\') ? 'começa na unidade C: e independe do local atual.' : current.command === 'pwd' ? 'mostra o local sem mudar de pasta.' : 'é interpretado a partir do prompt atual.'}</span></footer>
    </section>
  );
}

function LabTree({ stage, mode = 'create' }) {
  const copy = mode === 'copy';
  const moved = mode === 'move';
  const renamed = mode === 'rename';
  return <div className="ps-lab-tree"><span><FolderOpen size={15} /> C:\dev\labs</span>{stage >= 1 && <span className="one"><FolderOpen size={15} /> terminal-basico</span>}{stage >= 2 && <><span className="two"><FolderOpen size={14} /> docs</span>{stage >= 3 && <span className="three"><FileText size={14} /> {moved ? 'terminal.md' : 'anotacoes.md'}</span>}{copy && <span className="three created"><FileText size={14} /> terminal-copia.md</span>}{renamed && <span className="three created"><FileText size={14} /> terminal-renomeado.md</span>}<span className="two"><Folder size={14} /> entrada</span><span className="two"><Folder size={14} /> saida</span></>}</div>;
}

function CreationLab() {
  const [done, setDone] = useState(0);
  const current = CREATE_COMMANDS[done];
  const last = done ? CREATE_COMMANDS[done - 1] : null;
  return (
    <section className="ps-creation-lab">
      <header><div><Terminal size={18} /><strong>terminal-basico</strong><span>{done}/{CREATE_COMMANDS.length} comandos</span></div><button type="button" onClick={() => setDone(0)} disabled={done === 0}><RotateCcw size={15} /> Reiniciar</button></header>
      <div className="ps-creation-body"><div className="ps-terminal"><header>PowerShell <span>simulação didática</span></header><div>{CREATE_COMMANDS.slice(0, done).map((item, index) => <div className="ps-entry" key={`${item.command}-${index}`}><p><span>{item.prompt}</span> {item.command}</p>{item.output ? <pre>{item.output}</pre> : <small>Sem texto de saída — confirme pelo próximo prompt.</small>}</div>)}{current ? <p className="ps-cursor"><span>{done ? CREATE_COMMANDS[done - 1].nextPrompt : CREATE_COMMANDS[0].prompt}</span><i /></p> : <p className="ps-success"><CheckCircle2 size={17} /> Estrutura criada e listada.</p>}</div></div><aside><div className="ps-tree-card"><header><FolderTree size={16} /> Estado do disco</header><LabTree stage={last?.treeStage ?? 0} /></div>{current ? <><small>Próxima ação</small><PowerShellCode>{current.command}</PowerShellCode><button type="button" className="ps-run" onClick={() => setDone(value => value + 1)}><Play size={16} /> Executar na simulação</button></> : <div className="ps-evidence"><CheckCircle2 /><strong>Estado conhecido</strong><p>O terminal e a árvore contam a mesma história.</p></div>}</aside></div>
      {last && <footer><ClipboardCheck size={17} /><span><strong>O que esta ação provou:</strong> {last.meaning}</span></footer>}
    </section>
  );
}

function TransferLab() {
  const [operation, setOperation] = useState('copy');
  const operations = {
    copy: { label: 'Copiar', command: "Copy-Item 'docs\\anotacoes.md' 'docs\\terminal-copia.md'", before: ['anotacoes.md'], after: ['anotacoes.md', 'terminal-copia.md'], rule: 'A origem permanece e uma segunda entrada nasce.' },
    move: { label: 'Mover', command: "Move-Item 'docs\\anotacoes.md' 'docs\\terminal.md'", before: ['anotacoes.md'], after: ['terminal.md'], rule: 'O item deixa a origem. Aqui, o destino na mesma pasta muda o nome.' },
    rename: { label: 'Renomear cópia', command: "Move-Item 'docs\\terminal-copia.md' 'docs\\terminal-renomeado.md'", before: ['terminal-copia.md'], after: ['terminal-renomeado.md'], rule: 'Há um item antes e um depois; apenas seu nome mudou.' }
  };
  const current = operations[operation];
  return (
    <section className="ps-transfer-lab">
      <div className="ps-transfer-tabs" role="tablist" aria-label="Operações com arquivos">{Object.entries(operations).map(([id, item]) => <button type="button" role="tab" aria-selected={operation === id} className={operation === id ? 'active' : ''} onClick={() => setOperation(id)} key={id}>{item.label}</button>)}</div>
      <PowerShellCode>{current.command}</PowerShellCode>
      <div className="ps-state-compare" role="tabpanel"><article><small>Antes</small><strong>docs</strong>{current.before.map(name => <span key={name}><FileText size={15} /> {name}</span>)}</article><ArrowRight size={23} /><article className="after"><small>Depois</small><strong>docs</strong>{current.after.map(name => <span key={name}><FileText size={15} /> {name}</span>)}</article></div>
      <footer><Layers3 size={17} /><span><strong>Conte os itens:</strong> {current.rule}</span></footer>
    </section>
  );
}

function SafeRemoval() {
  const checks = [
    { command: 'pwd', result: 'C:\\dev\\labs\\terminal-basico' },
    { command: 'ls .\\docs', result: 'terminal.md  terminal-renomeado.md' },
    { command: "Test-Path '.\\docs\\terminal-renomeado.md'", result: 'True' }
  ];
  const [verified, setVerified] = useState([]);
  const [removed, setRemoved] = useState(false);
  const toggle = index => setVerified(previous => previous.includes(index) ? previous.filter(item => item !== index) : [...previous, index]);
  const unlocked = verified.length === checks.length;
  return (
    <section className="ps-safe-removal">
      <div className="ps-removal-flow">{checks.map((item, index) => <React.Fragment key={item.command}><button type="button" className={verified.includes(index) ? 'done' : ''} onClick={() => toggle(index)} aria-pressed={verified.includes(index)}><span>{verified.includes(index) ? <Check size={15} /> : index + 1}</span><code>{item.command}</code><small>{verified.includes(index) ? item.result : 'Executar e conferir'}</small></button>{index < checks.length - 1 && <ArrowRight size={17} />}</React.Fragment>)}</div>
      <div className={`ps-delete-zone ${unlocked ? 'unlocked' : ''}`}><div><Trash2 size={24} /><span><strong>{removed ? 'Cópia removida' : unlocked ? 'Alvo exato confirmado' : 'Remoção bloqueada'}</strong><small>{removed ? 'Test-Path agora retorna False' : unlocked ? 'Somente o arquivo temporário da prática será removido' : 'Faça as três inspeções acima'}</small></span></div><PowerShellCode>{removed ? "Test-Path '.\\docs\\terminal-renomeado.md'\n# False" : "Remove-Item '.\\docs\\terminal-renomeado.md'"}</PowerShellCode><button type="button" disabled={!unlocked || removed} onClick={() => setRemoved(true)}>{removed ? <><CheckCircle2 size={16} /> Confirmado</> : <><Trash2 size={16} /> Remover arquivo conhecido</>}</button></div>
      <footer><ShieldCheck size={17} /><span>Em um sistema real, remoção pode não ir para a Lixeira. Inspecionar antes e confirmar depois faz parte do comando.</span></footer>
    </section>
  );
}

function EfficiencyLab() {
  const [demo, setDemo] = useState('tab');
  const [tabDone, setTabDone] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [cleared, setCleared] = useState(false);
  const history = ['pwd', 'ls', "Copy-Item 'docs\\terminal.md' 'docs\\terminal-copia.md'", 'Get-History'];
  return (
    <section className="ps-efficiency">
      <div className="ps-efficiency-tabs" role="tablist"><button type="button" role="tab" aria-selected={demo === 'tab'} className={demo === 'tab' ? 'active' : ''} onClick={() => setDemo('tab')}><Keyboard size={16} /> Tab</button><button type="button" role="tab" aria-selected={demo === 'history'} className={demo === 'history' ? 'active' : ''} onClick={() => setDemo('history')}><History size={16} /> Histórico</button><button type="button" role="tab" aria-selected={demo === 'clear'} className={demo === 'clear' ? 'active' : ''} onClick={() => setDemo('clear')}><Terminal size={16} /> cls</button></div>
      {demo === 'tab' && <div className="ps-key-demo" role="tabpanel"><div className="ps-line-editor"><span>PS C:\dev\labs\terminal-basico&gt;</span><strong>{tabDone ? 'cd .\\docs' : 'cd .\\do'}</strong><i /></div><button type="button" onClick={() => setTabDone(value => !value)}><kbd>Tab</kbd> {tabDone ? 'Voltar ao texto parcial' : 'Completar o nome'}</button><p>Tab procura nomes compatíveis no contexto. Se houver mais de um, pressione novamente ou digite mais letras.</p></div>}
      {demo === 'history' && <div className="ps-key-demo" role="tabpanel"><div className="ps-line-editor"><span>PS C:\dev\labs\terminal-basico&gt;</span><strong>{history[historyIndex]}</strong><i /></div><div className="ps-key-row"><button type="button" onClick={() => setHistoryIndex(value => Math.max(0, value - 1))} disabled={historyIndex === 0}><kbd>↑</kbd> anterior</button><button type="button" onClick={() => setHistoryIndex(value => Math.min(history.length - 1, value + 1))} disabled={historyIndex === history.length - 1}><kbd>↓</kbd> próximo</button></div><pre>{history.map((item, index) => `${index + 1}  ${item}`).join('\n')}</pre><p><code>Get-History</code> lista a sessão. Recuperar um comando não o torna seguro: leia antes de pressionar Enter.</p></div>}
      {demo === 'clear' && <div className="ps-key-demo" role="tabpanel"><div className={`ps-mini-screen ${cleared ? 'cleared' : ''}`}>{cleared ? <p><span>PS C:\dev\labs\terminal-basico&gt;</span><i /></p> : <pre>PS C:\dev\labs\terminal-basico&gt; ls{`\n`}docs  entrada  saida{`\n`}PS C:\dev\labs\terminal-basico&gt; Get-History{`\n`}1 pwd{`\n`}2 ls</pre>}</div><button type="button" onClick={() => setCleared(value => !value)}>{cleared ? <><RotateCcw size={15} /> Restaurar demonstração</> : <><Terminal size={15} /> Executar cls</>}</button><p><code>cls</code> é alias de <code>Clear-Host</code>: limpa a visualização, não apaga arquivos nem a pasta atual.</p></div>}
    </section>
  );
}

function ToolDiagnosis() {
  const [selectedId, setSelectedId] = useState('healthy');
  const current = TOOL_CASES.find(item => item.id === selectedId) || TOOL_CASES[0];
  return (
    <section className="ps-tool-diagnosis">
      <div className="ps-tool-list" role="tablist" aria-label="Casos de diagnóstico">{TOOL_CASES.map(item => <button type="button" role="tab" aria-selected={selectedId === item.id} className={selectedId === item.id ? 'active' : ''} onClick={() => setSelectedId(item.id)} key={item.id}><span className={item.tone} />{item.label}</button>)}</div>
      <article role="tabpanel" aria-live="polite"><PowerShellCode>{current.command}</PowerShellCode><div className={`ps-tool-output ${current.tone}`}><small>Saída de exemplo</small><pre>{current.output}</pre></div><section><strong>O que esta saída prova</strong><p>{current.diagnosis}</p></section><section><strong>Próxima verificação</strong><p>{current.next}</p></section></article>
    </section>
  );
}

function EnvironmentTimeline() {
  const [session, setSession] = useState('old');
  return (
    <section className="ps-environment-timeline">
      <header><div><Wrench size={19} /><span><strong>Por que o terminal antigo não viu o PATH novo?</strong><small>Variáveis são herdadas quando o processo nasce.</small></span></div><div role="group"><button type="button" aria-pressed={session === 'old'} className={session === 'old' ? 'active' : ''} onClick={() => setSession('old')}>Sessão antiga</button><button type="button" aria-pressed={session === 'new'} className={session === 'new' ? 'active' : ''} onClick={() => setSession('new')}>Nova sessão</button></div></header>
      <div className="ps-env-flow"><article><Monitor size={21} /><strong>Windows</strong><span>PATH atualizado</span></article><ArrowRight /><article className={session === 'old' ? 'stale' : 'fresh'}><Terminal size={21} /><strong>{session === 'old' ? 'PowerShell já aberto' : 'PowerShell reaberto'}</strong><span>{session === 'old' ? 'Mantém a cópia anterior' : 'Herda o valor atualizado'}</span></article><ArrowRight /><article className={session === 'old' ? 'stale' : 'fresh'}><Search size={21} /><strong>Get-Command mvn</strong><span>{session === 'old' ? 'Não encontrou' : 'Encontra mvn.cmd'}</span></article></div>
      <footer><code>$env:JAVA_HOME</code><code>$env:MAVEN_HOME</code><code>$env:Path</code><span>Inspecione o valor na sessão atual. Fechar e reabrir o terminal é uma verificação, não uma instalação.</span></footer>
    </section>
  );
}

function BackendClinic() {
  const [selectedId, setSelectedId] = useState('pom');
  const current = BACKEND_CASES.find(item => item.id === selectedId) || BACKEND_CASES[0];
  const Icon = current.icon;
  return (
    <section className="ps-backend-clinic">
      <div className="ps-clinic-list" role="tablist">{BACKEND_CASES.map(item => { const ItemIcon = item.icon; return <button type="button" role="tab" aria-selected={selectedId === item.id} className={selectedId === item.id ? 'active' : ''} onClick={() => setSelectedId(item.id)} key={item.id}><ItemIcon size={17} />{item.title}</button>; })}</div>
      <article role="tabpanel"><header><Icon size={24} /><div><small>Sintoma selecionado</small><h3>{current.title}</h3></div></header><blockquote>{current.symptom}</blockquote><div className="ps-clinic-path"><section><span>1</span><strong>Inspecione</strong><code>{current.inspect}</code></section><ArrowRight /><section><span>2</span><strong>Leia a evidência</strong><p>{current.evidence}</p></section><ArrowRight /><section><span>3</span><strong>Decida</strong><p>{current.decision}</p></section></div></article>
    </section>
  );
}

function ImpactFlow() {
  const items = [
    { icon: Braces, name: 'Java', commands: 'javac Main.java · java Main' },
    { icon: GitBranch, name: 'Git', commands: 'git status · git log' },
    { icon: Package, name: 'Maven', commands: 'mvn clean test · mvn package' },
    { icon: Layers3, name: 'Docker', commands: 'docker ps · docker compose up' },
    { icon: FileText, name: 'Logs e produção', commands: 'localizar · ler · preservar evidência' }
  ];
  return <section className="ps-impact-flow"><header><Layers3 size={20} /><strong>O mesmo raciocínio atravessa o backend</strong></header><div>{items.map(item => { const Icon = item.icon; return <article key={item.name}><Icon size={20} /><strong>{item.name}</strong><code>{item.commands}</code></article>; })}</div><footer>Em CI/CD, servidores e containers, a interface pode mudar; localização, comando, saída e diagnóstico permanecem.</footer></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'terminalLayers') return <TerminalLayersMock />;
  if (block.type === 'orientationLab') return <OrientationLab />;
  if (block.type === 'navigationLab') return <NavigationLab />;
  if (block.type === 'creationLab') return <CreationLab />;
  if (block.type === 'transferLab') return <TransferLab />;
  if (block.type === 'safeRemoval') return <SafeRemoval />;
  if (block.type === 'efficiencyLab') return <EfficiencyLab />;
  if (block.type === 'toolDiagnosis') return <ToolDiagnosis />;
  if (block.type === 'environmentTimeline') return <EnvironmentTimeline />;
  if (block.type === 'backendClinic') return <BackendClinic />;
  if (block.type === 'impactFlow') return <ImpactFlow />;
  if (block.type === 'result') return <section className="guided-result"><h3><ClipboardCheck size={20} /> {block.title}</h3><ul>{block.items.map(item => <li key={item}><CheckCircle2 size={16} /> {item}</li>)}</ul></section>;
  if (block.type === 'note') {
    const Icon = block.tone === 'danger' ? AlertTriangle : block.tone === 'warning' ? AlertTriangle : Lightbulb;
    return <aside className={`guided-note ${block.tone || 'info'}`}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>;
  }
  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Compass size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  if (block.type === 'diary') return <div className="guided-file ps-diary"><div className="guided-file-title"><FileCode2 size={17} /> docs/diario-aula-004.md <CopyButton value={DIARY} label="Copiar diário" /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '20px', background: '#101827', fontSize: '.84rem', lineHeight: 1.7 }}>{DIARY}</SyntaxHighlighter></div>;
  return null;
}

export default function GuidedPowerShellLesson004({
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

  return (
    <article className="guided-git-lesson guided-powershell-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker"><Terminal size={17} /> Laboratório de terminal</span>
          <p className="guided-sequence">004 · M0.04</p>
          <h1>PowerShell sem adivinhação</h1>
          <p>Navegue, altere arquivos e diagnostique ferramentas comigo, vendo cada comando, saída e mudança no disco antes de seguir.</p>
        </div>
        <div className="guided-hero-status"><Terminal size={42} /><strong>{progress}%</strong><span>{completedLabel}</span></div>
        <div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}><span style={{ width: `${progress}%` }} /></div>
      </header>

      <GuidedLessonFacts ariaLabel="Resultado do laboratório" items={[{ value: 10, label: 'etapas guiadas' }, { value: 1, label: 'sistema de arquivos visível' }, { value: 3, label: 'classes de diagnóstico' }]} />

      <div className="guided-layout">
        <nav className="guided-step-nav" aria-label="Etapas da aula 004">
          <div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>
          {steps.map((step, index) => <button type="button" key={step.id} className={`${index === activeIndex ? 'active' : ''} ${completedStepIds.has(step.id) ? 'done' : ''}`} onClick={() => selectStep(index)}><span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}
        </nav>

        <main className="guided-step-content">
          <div className="guided-step-heading"><span>{activeStep.eyebrow} · {activeStep.duration}</span><h2>{activeStep.title}</h2></div>
          <div className="guided-blocks">{activeStep.blocks.map((block, index) => <ContentBlock block={block} key={`${activeStep.id}-${block.type}-${index}`} />)}</div>

          <div className="guided-step-actions">
            <button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button>
            <div className="guided-step-actions-main"><button type="button" className={`step-toggle ${activeStepComplete ? 'undo' : 'complete'}`} onClick={toggleActiveStep}>{activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><Check size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div>
          </div>

          {allStepsComplete && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>{lessonComplete ? 'Laboratório registrado' : 'Roteiro concluído'}</h3><p>{lessonComplete ? 'Etapas, diagnóstico e conclusão geral estão registrados.' : 'Conclua a aula para liberar o laboratório de JDK, JRE e JVM.'}</p></div><button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}
        </main>
      </div>

      <footer className="guided-course-nav">
        <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 003</button>
        <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>{lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong><small>{lessonComplete ? 'Autonomia registrada' : allStepsComplete ? 'Use o botão acima' : 'Pratique e confirme cada estado'}</small></span></div>
        <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas e a aula para avançar' : 'Estudar JDK, JRE e JVM'}>Aula 005 <ArrowRight size={17} /></button>
      </footer>
    </article>
  );
}
