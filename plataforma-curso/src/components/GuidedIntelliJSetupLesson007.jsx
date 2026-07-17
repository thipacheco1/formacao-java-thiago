import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Binary,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDot,
  ClipboardCheck,
  Clock3,
  Code2,
  Compass,
  Copy,
  Cpu,
  Download,
  FileCode2,
  FileCog,
  FileText,
  Folder,
  FolderOpen,
  GitBranch,
  HardDrive,
  Keyboard,
  Layers3,
  Lightbulb,
  ListChecks,
  Menu,
  MonitorPlay,
  Package,
  Play,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  Sparkles,
  WandSparkles,
  Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedPowerShellLesson.css';
import './guidedJavaPlatformLesson.css';
import './guidedIntelliJLesson.css';
import './guidedIntelliJSetupLesson.css';

const LESSON_STORAGE_KEY = 'guided-intellij-setup-lesson-007-progress';

const MAIN_CODE = [
  'public class Main {',
  '    public static void main(String[] args) {',
  '        System.out.println("Projeto aberto no IntelliJ IDEA.");',
  '        System.out.println("JDK 21, src e Run estão coerentes.");',
  '    }',
  '}'
].join('\n');

const PATH_CODE = [
  'import java.nio.file.Path;',
  '',
  'public class Main {',
  '    public static void main(String[] args) {',
  '        Path arquivo = Path.of("dados/clientes.csv");',
  '        System.out.println(arquivo.toAbsolutePath());',
  '    }',
  '}'
].join('\n');

const SHORTCUTS_DOC = [
  '# IntelliJ IDEA — ações que pratiquei',
  '',
  '| Objetivo | Ação / atalho no Windows | O que confirmei |',
  '|---|---|---|',
  '| Abrir Project | Alt+1 | A raiz e os arquivos do projeto |',
  '| Buscar ação | Ctrl+Shift+A | Encontrei comandos sem decorar menus |',
  '| Reformatar | Ctrl+Alt+L | O código seguiu o estilo configurado |',
  '| Otimizar imports | Ctrl+Alt+O | Imports não usados foram removidos |',
  '| Renomear com segurança | Shift+F6 | As referências foram atualizadas |',
  '| Abrir Terminal | Alt+F12 | O shell abriu na raiz esperada |',
  '| Executar contexto atual | Shift+F10 | A Run Configuration foi usada |',
  '| Iniciar Debug | Shift+F9 | Reservado para a Aula 008 |',
  '',
  '## Ambiente validado',
  '- Project SDK: JDK 21',
  '- Module SDK: herdado do projeto',
  '- Sources Root: src',
  '- Classe principal: Main',
  '- Working directory: raiz do projeto',
  '- Terminal pwd:',
  '- java -version:',
  '- javac -version:',
  '',
  '## Algo que agora consigo diagnosticar',
  '- Sintoma:',
  '- Configuração inspecionada:',
  '- Correção:',
  '- Evidência final:'
].join('\n');

const steps = [
  {
    id: 'mapa',
    label: 'Conhecer a IDE atual',
    duration: '9 min',
    eyebrow: 'Comece aqui',
    title: 'Reconheça o IntelliJ atual e o trabalho que ele reúne',
    blocks: [
      { type: 'lead', text: 'O nome Community ainda aparece em aulas e instalações antigas, mas desde a versão 2025.3 existe uma única distribuição do IntelliJ IDEA. Os recursos essenciais de Java continuam gratuitos. Antes de clicar, vamos separar produto, assinatura e o mecanismo Java que a IDE coordena.' },
      { type: 'productMap' },
      { type: 'note', tone: 'info', title: 'Baseline deliberada do curso', text: 'A documentação recente da JetBrains pode usar Java 25 em exemplos. Nesta formação, selecione JDK 21 para manter todas as aulas e projetos coerentes. A IDE atual e a versão do projeto são decisões diferentes.' }
    ]
  },
  {
    id: 'instalar',
    label: 'Instalar e iniciar',
    duration: '13 min',
    eyebrow: 'Etapa 1',
    title: 'Chegue à tela inicial sem escolher opções por adivinhação',
    blocks: [
      { type: 'lead', text: 'Se o IntelliJ já abre no seu computador, use esta etapa como auditoria. Se ainda não está instalado, siga a ordem e compare cada tela. A aparência pode mudar um pouco, mas o objetivo de cada escolha permanece.' },
      { type: 'installFlow' },
      { type: 'note', tone: 'warning', title: 'Não aceite uma troca de baseline escondida', text: 'O IntelliJ pode oferecer Download JDK e sugerir a versão mais recente. Para o curso, selecione ou adicione JDK 21. Baixar o IDE e escolher o JDK do projeto são etapas distintas.' }
    ]
  },
  {
    id: 'abrir',
    label: 'Abrir pela raiz',
    duration: '14 min',
    eyebrow: 'Etapa 2',
    title: 'Abra o projeto inteiro, não apenas src nem um arquivo isolado',
    blocks: [
      { type: 'lead', text: 'Na tela Welcome, você pode criar algo novo ou abrir uma pasta existente. Nesta formação, o projeto já possui docs, src e arquivos de configuração. Selecione a raiz formacao-java-backend para que IDE, terminal e Git compartilhem o mesmo contexto.' },
      { type: 'welcomeOpen' },
      { type: 'note', tone: 'warning', title: 'A pasta selecionada define o que a IDE enxerga', text: 'Se você abrir apenas src, README, .gitignore e docs ficam fora do projeto; o terminal também tende a começar na raiz errada. Feche e reabra pela pasta superior correta.' }
    ]
  },
  {
    id: 'jdk',
    label: 'Configurar JDK 21',
    duration: '18 min',
    eyebrow: 'Etapa 3',
    title: 'Configure Project SDK, módulo e nível da linguagem com intenção',
    blocks: [
      { type: 'lead', text: 'Abra File → Project Structure. O Project SDK fornece ferramentas e runtime; o módulo pode herdar esse SDK ou sobrescrevê-lo; o language level controla quais construções de Java o editor e o compilador aceitam.' },
      { type: 'projectStructure' },
      { type: 'environmentMatrix' }
    ]
  },
  {
    id: 'fontes',
    label: 'Reconhecer src',
    duration: '13 min',
    eyebrow: 'Etapa 4',
    title: 'Mostre à IDE onde começa o código-fonte e onde termina o artefato',
    blocks: [
      { type: 'lead', text: 'Uma pasta chamada src não ganha significado apenas pelo nome. Em projeto simples, marque-a como Sources Root. A IDE então trata classes e pacotes dentro dela como fonte e envia o bytecode para a pasta de saída.' },
      { type: 'sourcesRoot' },
      { type: 'note', tone: 'info', title: 'Quando Maven chegar', text: 'Em projeto importado pelo pom.xml, src/main/java e src/test/java normalmente são reconhecidos pelo modelo Maven. Não fique remarcando pastas para esconder uma importação quebrada; corrija a sincronização do build.' }
    ]
  },
  {
    id: 'executar',
    label: 'Criar e executar Main',
    duration: '20 min',
    eyebrow: 'Etapa 5',
    title: 'Crie a classe pelo Project, execute pelo gutter e leia o console',
    blocks: [
      { type: 'lead', text: 'Agora você vai operar a IDE completa. Crie Main dentro de src, observe o ícone verde ao lado de main e execute. O simulador mostra o que muda no Project, editor, toolbar e janela Run.' },
      { type: 'ideaWorkspace' },
      { type: 'note', tone: 'warning', title: 'Run e Debug não são o mesmo botão', text: 'Run confirma o resultado. Debug permite pausa e inspeção e será praticado na Aula 008. Nesta etapa, use Run e confirme a saída antes de avançar.' }
    ]
  },
  {
    id: 'configuracao',
    label: 'Ler a execução',
    duration: '17 min',
    eyebrow: 'Etapa 6',
    title: 'Abra a Run Configuration e encontre o equivalente dos comandos manuais',
    blocks: [
      { type: 'lead', text: 'Quando você executa Main, o IntelliJ cria ou usa uma configuração. Ela declara qual classe começa, qual JRE executa, em qual módulo procurar classes, quais argumentos chegam ao programa e de qual pasta caminhos relativos partem.' },
      { type: 'runConfiguration' },
      { type: 'workingDirectory' }
    ]
  },
  {
    id: 'terminal',
    label: 'Terminal integrado',
    duration: '15 min',
    eyebrow: 'Etapa 7',
    title: 'Prove que terminal, projeto e SDK contam histórias compatíveis',
    blocks: [
      { type: 'lead', text: 'Abra View → Tool Windows → Terminal ou Alt+F12. Por padrão, ele costuma iniciar na raiz do projeto, mas a prova é o prompt e pwd. O Project SDK da IDE não muda automaticamente o java encontrado pelo PATH do PowerShell.' },
      { type: 'terminalAudit' },
      { type: 'note', tone: 'warning', title: 'IDE funcionando não valida o terminal', text: 'É possível ter Project SDK 21 e java 25 no PATH. Isso pode ser intencional, mas precisa ser conhecido. Compare as origens antes de culpar o código.' }
    ]
  },
  {
    id: 'assistencia',
    label: 'Editar com intenção',
    duration: '19 min',
    eyebrow: 'Etapa 8',
    title: 'Use completion, import, formato, navegação e Rename sem terceirizar decisões',
    blocks: [
      { type: 'lead', text: 'A produtividade da IDE vem de conhecer o código, não de aceitar qualquer sugestão. Explore cada ferramenta e observe o tipo de mudança que ela propõe. Uma refatoração conhece referências; uma edição textual cega não conhece.' },
      { type: 'editingToolkit' },
      { type: 'note', tone: 'info', title: 'Sobre salvar arquivos', text: 'O IntelliJ salva automaticamente em vários eventos. Ctrl+S continua válido como Save All e pode disparar ações configuradas ao salvar. A confirmação real é o estado do editor e o resultado do build, não apertar o atalho repetidamente.' }
    ]
  },
  {
    id: 'entrega',
    label: 'Auditar e registrar',
    duration: '18 min',
    eyebrow: 'Etapa 9',
    title: 'Recupere uma configuração incoerente e deixe um registro revisável',
    blocks: [
      { type: 'lead', text: 'Antes do debug, faça uma auditoria final. Projeto bem aberto, SDK, Sources Root, classe principal, terminal e arquivos versionados precisam concordar. Use a clínica para revisar os sintomas e depois resolva o cenário sem tentativa aleatória.' },
      { type: 'diagnosisClinic' },
      { type: 'hygieneMap' },
      { type: 'challenge', title: 'Desafio: recupere o projeto do novo integrante', text: 'A pessoa abriu apenas a pasta src, escolheu JDK 25 no Project SDK, deixou src como pasta comum e o terminal abriu em C:\\dev\\projects. O projeto da equipe usa Java 21 e sua raiz é C:\\dev\\projects\\formacao-java-backend. Descreva a ordem de recuperação e as evidências finais.', acceptance: ['Você reabre a pasta formacao-java-backend pela raiz', 'Você seleciona ou adiciona JDK 21 no Project SDK', 'O módulo herda o SDK correto e src vira Sources Root', 'Main executa e a janela Run termina com exit code 0', 'pwd e ls confirmam a raiz no terminal', 'java e javac do terminal são registrados, mesmo se diferirem da IDE', 'git status não inclui out nem arquivos class', 'Você não começa a debugar enquanto existirem erros de configuração'] },
      { type: 'shortcutsDoc' },
      { type: 'note', tone: 'info', title: 'Próxima aula: observar o programa por dentro', text: 'Com a IDE configurada, a Aula 008 usará breakpoint, linha atual, Step Over, Step Into, Step Out, Variables, Watches, Call Stack e Console em uma regra de negócio. Agora o botão Debug terá uma base real.' }
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

function CodeWindow({ language, children, title }) {
  return <div className="jdk-code-window idea7-code-window"><header><FileCode2 size={16} /><span>{title}</span><CopyButton value={children} /></header><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language === 'java'} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#101827', fontSize: '.82rem', lineHeight: 1.65 }}>{children}</SyntaxHighlighter></div>;
}

function ProductMap() {
  const [selected, setSelected] = useState('free');
  const items = {
    free: { label: 'Uso gratuito', icon: CheckCircle2, title: 'Recursos essenciais continuam gratuitos', detail: 'Java e Kotlin, editor inteligente, compilação, Run, Debug, terminal, Git, Maven/Gradle e outras ferramentas-base permanecem disponíveis sem assinatura.', boundary: 'É o conjunto suficiente para esta formação.' },
    subscription: { label: 'Assinatura', icon: Sparkles, title: 'Recursos estendidos são desbloqueados', detail: 'Ferramentas avançadas de frameworks, bancos, profiler, desenvolvimento remoto e outras integrações podem depender da assinatura e da versão.', boundary: 'A formação não deve depender de um clique pago para ensinar fundamentos.' },
    opensource: { label: 'Código aberto', icon: Code2, title: 'A base aberta continua existindo', detail: 'A JetBrains mantém o código aberto e também publica builds formados apenas pelos componentes open source.', boundary: 'Distribuição gratuita e build puramente open source não são exatamente a mesma coisa.' }
  };
  const current = items[selected];
  const Icon = current.icon;
  return <section className="idea7-product-map"><div className="idea7-product-history"><article><strong>Até 2025.2</strong><span>Community Edition</span><span>Ultimate Edition</span></article><ArrowRight /><article className="current"><strong>Desde 2025.3</strong><span>IntelliJ IDEA</span><small>uma distribuição</small></article></div><div className="idea7-product-tabs" role="tablist">{Object.entries(items).map(([id, item]) => { const ItemIcon = item.icon; return <button type="button" role="tab" aria-selected={selected === id} className={selected === id ? 'active' : ''} onClick={() => setSelected(id)} key={id}><ItemIcon size={18} />{item.label}</button>; })}</div><article className="idea7-product-detail" role="tabpanel"><header><Icon size={25} /><h3>{current.title}</h3></header><p>{current.detail}</p><footer><CircleDot size={15} />{current.boundary}</footer></article><div className="idea7-under-run"><FileText size={17} /><span>Main.java</span><ChevronRight /><Wrench size={17} /><span>compilar</span><ChevronRight /><Binary size={17} /><span>out</span><ChevronRight /><Cpu size={17} /><span>JVM</span><ChevronRight /><MonitorPlay size={17} /><span>Run</span></div></section>;
}

function InstallFlow() {
  const [stage, setStage] = useState(0);
  const stages = [
    { title: 'Baixe da origem oficial', action: 'Acesse jetbrains.com/idea/download', screen: 'download', proof: 'O produto exibido é IntelliJ IDEA; não é necessário procurar um instalador Community separado.' },
    { title: 'Execute o instalador do Windows', action: 'Abra o arquivo baixado e avance pelo assistente', screen: 'installer', proof: 'O diretório de instalação é explícito e o atalho pode ser criado sem alterar o JDK do projeto.' },
    { title: 'Conclua e inicie a IDE', action: 'Finalize a instalação e abra IntelliJ IDEA', screen: 'launch', proof: 'A tela Welcome apresenta New Project, Open e Get from VCS.' },
    { title: 'Continue com recursos gratuitos', action: 'Use o conjunto gratuito ou ignore o trial', screen: 'license', proof: 'A IDE continua funcional para Java sem exigir uma assinatura Ultimate.' }
  ];
  const current = stages[stage];
  return <section className="idea7-install-flow"><div className="idea7-install-track">{stages.map((item, index) => <button type="button" className={index === stage ? 'active' : index < stage ? 'done' : ''} onClick={() => setStage(index)} key={item.title}><span>{index < stage ? <Check size={14} /> : index + 1}</span><strong>{item.title}</strong></button>)}</div><div className="idea7-install-screen"><div className="idea7-window-title"><span className="idea-app-mark">IJ</span><strong>{current.screen === 'installer' ? 'IntelliJ IDEA Setup' : 'IntelliJ IDEA'}</strong><span>— □ ×</span></div>{current.screen === 'download' && <div className="idea7-download"><Download size={38} /><h3>IntelliJ IDEA</h3><p>Windows · instalador unificado</p><button type="button">Download</button></div>}{current.screen === 'installer' && <div className="idea7-installer"><HardDrive size={33} /><strong>Destination Folder</strong><code>C:\Program Files\JetBrains\IntelliJ IDEA</code><div><span className="checked"><Check size={13} /> Criar atalho</span><span>Associar arquivos .java — opcional</span></div><button type="button">Next</button></div>}{current.screen === 'launch' && <div className="idea7-welcome-mini"><span className="idea-app-mark">IJ</span><h3>Welcome to IntelliJ IDEA</h3><button type="button">New Project</button><button type="button">Open</button><button type="button">Get from VCS</button></div>}{current.screen === 'license' && <div className="idea7-license"><CheckCircle2 size={36} /><h3>Recursos gratuitos disponíveis</h3><p>Continue aprendendo Java sem trocar de instalador.</p><button type="button">Continue</button></div>}</div><article><small>Ação guiada</small><h3>{current.action}</h3><p><strong>Evidência:</strong> {current.proof}</p><div><button type="button" disabled={stage === 0} onClick={() => setStage(value => value - 1)}><ArrowLeft size={15} /> Voltar</button><button type="button" disabled={stage === stages.length - 1} onClick={() => setStage(value => value + 1)}>Avançar <ArrowRight size={15} /></button></div></article></section>;
}

function WelcomeOpen() {
  const [choice, setChoice] = useState('root');
  const cases = {
    root: { path: 'C:\\dev\\projects\\formacao-java-backend', verdict: 'Projeto completo', tone: 'good', visible: ['.git', 'docs', 'src', '.gitignore', 'README.md'], terminal: 'PS C:\\dev\\projects\\formacao-java-backend>', explanation: 'A raiz reúne código, documentação e controle de versão.' },
    src: { path: 'C:\\dev\\projects\\formacao-java-backend\\src', verdict: 'Raiz estreita demais', tone: 'bad', visible: ['Main.java'], terminal: 'PS C:\\dev\\projects\\formacao-java-backend\\src>', explanation: 'Git, docs e configuração ficaram fora do contexto aberto.' },
    parent: { path: 'C:\\dev\\projects', verdict: 'Raiz ampla demais', tone: 'warning', visible: ['formacao-java-backend', 'outro-projeto', 'rascunhos'], terminal: 'PS C:\\dev\\projects>', explanation: 'A IDE mistura projetos independentes e o terminal não começa na aplicação.' }
  };
  const current = cases[choice];
  return <section className="idea7-welcome-open"><div className="idea7-welcome"><header><span className="idea-app-mark">IJ</span><strong>Welcome to IntelliJ IDEA</strong></header><div><button type="button"><FileText size={18} /> New Project</button><button type="button" className="primary"><FolderOpen size={18} /> Open</button><button type="button"><GitBranch size={18} /> Get from VCS</button></div><footer>Escolha Open porque o projeto já existe no disco.</footer></div><div className="idea7-folder-picker"><header><FolderOpen size={17} /> Select Folder</header><div role="tablist">{Object.keys(cases).map(id => <button type="button" role="tab" aria-selected={choice === id} className={choice === id ? 'active' : ''} onClick={() => setChoice(id)} key={id}>{id === 'root' ? 'Raiz correta' : id === 'src' ? 'Somente src' : 'Pasta projects'}</button>)}</div><code>{current.path}</code><div className="idea7-picked-tree">{current.visible.map((item, index) => <span key={item}>{index < current.visible.length - 2 ? <Folder size={14} /> : <FileText size={14} />}{item}</span>)}</div><footer className={current.tone}><strong>{current.verdict}</strong><span>{current.explanation}</span><code>{current.terminal}</code></footer></div></section>;
}

function ProjectStructure() {
  const [sdk, setSdk] = useState('21');
  const [moduleMode, setModuleMode] = useState('inherit');
  const [tab, setTab] = useState('project');
  const healthy = sdk === '21' && moduleMode === 'inherit';
  return <section className="idea7-project-structure"><div className="idea7-dialog-title"><Settings size={17} /><strong>Project Structure</strong><span>Ctrl+Alt+Shift+S</span></div><div className="idea7-dialog-body"><nav><strong>Project Settings</strong><button type="button" className={tab === 'project' ? 'active' : ''} onClick={() => setTab('project')}>Project</button><button type="button" className={tab === 'modules' ? 'active' : ''} onClick={() => setTab('modules')}>Modules</button><button type="button">Libraries</button><strong>Platform Settings</strong><button type="button">SDKs</button></nav><main>{tab === 'project' ? <><header><h3>Project</h3><span>Configuração compartilhada</span></header><label>SDK do projeto</label><div className="idea7-sdk-options">{['none', '21', '25'].map(value => <button type="button" className={sdk === value ? 'active' : ''} onClick={() => setSdk(value)} key={value}>{value === 'none' ? 'No SDK' : 'Eclipse Temurin ' + value}</button>)}</div><label>Language level</label><div className="idea7-field">{sdk === '21' ? '21 — recursos da baseline do curso' : sdk === '25' ? '25 — acima da baseline do curso' : 'SDK default — indefinido'}</div><aside><Wrench size={16} /><span><strong>Add SDK → JDK from Disk</strong><code>C:\Program Files\Eclipse Adoptium\jdk-21</code></span></aside></> : <><header><h3>Modules → formacao-java-backend</h3><span>Configuração do módulo</span></header><label>Module SDK</label><div className="idea7-sdk-options"><button type="button" className={moduleMode === 'inherit' ? 'active' : ''} onClick={() => setModuleMode('inherit')}>Project SDK</button><button type="button" className={moduleMode === 'override' ? 'active' : ''} onClick={() => setModuleMode('override')}>JDK 17 override</button></div><label>Compiler output</label><div className="idea7-field">C:\dev\projects\formacao-java-backend\out</div><p>O módulo deve herdar o Project SDK neste projeto simples. Um override é possível, mas precisa ser uma decisão explícita.</p></>}</main></div><footer><div className={healthy ? 'healthy' : 'warning'}>{healthy ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}<span><strong>{healthy ? 'Configuração coerente com o curso' : 'Existe uma divergência para corrigir'}</strong><small>{sdk !== '21' ? 'Selecione JDK 21 no Project.' : moduleMode !== 'inherit' ? 'Faça o módulo herdar o Project SDK.' : 'SDK, módulo e linguagem estão alinhados.'}</small></span></div><button type="button">Cancel</button><button type="button" className="primary">Apply</button><button type="button" className="primary">OK</button></footer></section>;
}

function EnvironmentMatrix() {
  const rows = [
    ['Project SDK', 'File → Project Structure', 'JDK usado como padrão pela IDE'],
    ['Module SDK', 'Modules → Dependencies', 'pode herdar ou sobrescrever o projeto'],
    ['Language level', 'Project / Module', 'recursos de sintaxe e análise permitidos'],
    ['Compiler target', 'Java Compiler / build', 'versão de bytecode produzida'],
    ['Terminal', 'java e javac pelo PATH', 'ambiente do shell, independente da seleção visual'],
    ['Maven/Gradle', 'pom, toolchain ou Gradle JVM', 'build pode declarar outra versão']
  ];
  return <section className="idea7-env-matrix"><header><Layers3 size={19} /><strong>“A IDE está em Java 21” pode significar configurações diferentes</strong></header><div role="table"><div role="row" className="head"><span>Camada</span><span>Onde conferir</span><span>O que controla</span></div>{rows.map(row => <div role="row" key={row[0]}>{row.map(cell => <span role="cell" key={cell}>{cell}</span>)}</div>)}</div></section>;
}

function SourcesRoot() {
  const [marked, setMarked] = useState(false);
  return <section className="idea7-sources-root"><div className="idea7-project-tree"><header><FolderOpen size={16} /> Project</header><span className="root"><ChevronDown size={14} /><FolderOpen size={15} /> formacao-java-backend</span><button type="button" className={marked ? 'source' : ''} onClick={() => setMarked(value => !value)}><ChevronDown size={14} /><FolderOpen size={15} /> src {marked && <em>Sources Root</em>}</button><span className="child"><FileText size={14} /> Main.java</span><span><Folder size={15} /> docs</span>{marked && <><span className="generated"><Folder size={15} /> out</span><span className="child generated"><Binary size={14} /> Main.class</span></>}</div><div className="idea7-context-menu"><small>Clique direito em src</small><button type="button">New <ChevronRight size={14} /></button><button type="button" className="selected" onClick={() => setMarked(true)}>Mark Directory as <ChevronRight size={14} /></button><button type="button" className={marked ? 'selected' : ''} onClick={() => setMarked(true)}>Sources Root</button><button type="button" onClick={() => setMarked(false)}>Unmark as Sources Root</button></div><article className={marked ? 'good' : 'warning'}>{marked ? <CheckCircle2 size={28} /> : <AlertTriangle size={28} />}<h3>{marked ? 'src agora tem significado' : 'src ainda é uma pasta comum'}</h3><p>{marked ? 'A IDE resolve classes e pacotes a partir desta raiz e envia compilados para out.' : 'O nome parece correto para você, mas a IDE ainda não recebeu a função da pasta.'}</p><div><span><FileText size={16} /> Fonte: src/Main.java</span><span><Binary size={16} /> Gerado: out/.../Main.class</span></div></article></section>;
}

function IdeaWorkspace() {
  const [stage, setStage] = useState(0);
  const stages = [
    { label: 'Projeto aberto', status: 'Ready', file: false, run: false, output: '', proof: 'A árvore mostra a raiz e src como fonte.' },
    { label: 'Classe criada', status: 'Indexing complete', file: true, run: false, output: '', proof: 'Main.java aparece dentro de src e o editor reconhece main.' },
    { label: 'Run iniciado', status: 'Building...', file: true, run: true, output: 'Compiling Java...\n', proof: 'A IDE compila usando o SDK e a saída configurada.' },
    { label: 'Programa concluído', status: 'Process finished', file: true, run: true, output: 'Projeto aberto no IntelliJ IDEA.\nJDK 21, src e Run estão coerentes.\n\nProcess finished with exit code 0', proof: 'O console mostra as mensagens e código de saída zero.' }
  ];
  const current = stages[stage];
  return <figure className="idea7-workspace"><div className="idea7-idea-title"><span className="idea-app-mark">IJ</span><strong>formacao-java-backend — IntelliJ IDEA</strong><span>— □ ×</span></div><div className="idea7-idea-toolbar"><button type="button"><Menu size={15} /></button><span className="idea7-run-name">{current.file ? 'Main' : 'Current File'} <ChevronDown size={13} /></span><button type="button" className="run" disabled={!current.file} onClick={() => setStage(Math.max(stage, 2))}><Play size={16} /> Run</button><button type="button" className="debug" disabled={!current.file}><Code2 size={16} /> Debug</button><span className="status">{current.status}</span></div><div className="idea7-idea-main"><aside><header>Project</header><span><ChevronDown size={13} /><FolderOpen size={14} /> formacao-java-backend</span><span className="one source"><ChevronDown size={13} /><FolderOpen size={14} /> src</span>{current.file && <span className="two active"><FileText size={14} /> Main.java</span>}<span className="one"><Folder size={14} /> docs</span>{stage >= 2 && <><span className="one generated"><Folder size={14} /> out</span><span className="two generated"><Binary size={13} /> Main.class</span></>}</aside><main><header><span>{current.file ? 'Main.java' : 'README.md'}</span></header>{current.file ? <div className="idea7-editor"><button type="button" className="gutter-run" onClick={() => setStage(Math.max(stage, 2))} aria-label="Executar Main"><Play size={13} /></button><SyntaxHighlighter language="java" style={vscDarkPlus} showLineNumbers wrapLongLines customStyle={{ margin: 0, padding: '16px 12px 16px 0', background: '#1e222c', fontSize: '.72rem', lineHeight: 1.65 }}>{MAIN_CODE}</SyntaxHighlighter></div> : <div className="idea7-empty-editor"><FileText size={35} /><strong>Crie Main.java dentro de src</strong><button type="button" onClick={() => setStage(1)}>New → Java Class → Main</button></div>}{current.run && <div className="idea7-run-panel"><header><Play size={14} /> Run: Main <span>Console</span></header><pre>{current.output}</pre>{stage === 2 && <button type="button" onClick={() => setStage(3)}>Concluir execução</button>}</div>}</main></div><div className="idea7-tool-tabs"><span>Run</span><span>Debug</span><span>Terminal</span><span>Problems</span><span>Git</span></div><figcaption><strong>{current.label}:</strong> {current.proof}</figcaption><div className="idea7-workspace-controls"><button type="button" disabled={stage === 0} onClick={() => setStage(value => value - 1)}><ArrowLeft size={15} /> Voltar</button><span>Estado {stage + 1} de {stages.length}</span><button type="button" disabled={stage === stages.length - 1} onClick={() => setStage(value => value + 1)}>Avançar <ArrowRight size={15} /></button></div></figure>;
}

function RunConfiguration() {
  const [jre, setJre] = useState('21');
  const [mainClass, setMainClass] = useState('Main');
  const [working, setWorking] = useState('root');
  const [args, setArgs] = useState('');
  const healthy = jre === '21' && mainClass === 'Main' && working === 'root';
  return <section className="idea7-run-config"><div className="idea7-dialog-title"><MonitorPlay size={17} /><strong>Run/Debug Configurations</strong><span>Application</span></div><div className="idea7-run-config-body"><aside><button type="button" className="active"><Play size={14} /> Main</button><button type="button">+ Add new...</button></aside><main><label>Name</label><div className="idea7-field">Main</div><label>Main class</label><div className="idea7-choice-row"><button type="button" className={mainClass === 'Main' ? 'active' : ''} onClick={() => setMainClass('Main')}>Main</button><button type="button" className={mainClass === 'Wrong' ? 'active' : ''} onClick={() => setMainClass('Wrong')}>ProgramaInexistente</button></div><label>JRE</label><div className="idea7-choice-row"><button type="button" className={jre === '21' ? 'active' : ''} onClick={() => setJre('21')}>Project SDK 21</button><button type="button" className={jre === '17' ? 'active' : ''} onClick={() => setJre('17')}>JDK 17</button></div><label>Program arguments</label><input value={args} onChange={event => setArgs(event.target.value)} placeholder="Ex.: cliente-42 --verbose" /><label>Working directory</label><div className="idea7-choice-row"><button type="button" className={working === 'root' ? 'active' : ''} onClick={() => setWorking('root')}>$PROJECT_DIR$</button><button type="button" className={working === 'src' ? 'active' : ''} onClick={() => setWorking('src')}>$PROJECT_DIR$\src</button></div></main></div><footer><div className={healthy ? 'healthy' : 'warning'}>{healthy ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}<span><strong>{healthy ? 'Executará a classe correta na baseline' : 'A configuração produzirá um resultado diferente'}</strong><small>{mainClass !== 'Main' ? 'A classe principal não existe.' : jre !== '21' ? 'O runtime diverge da baseline.' : 'O caminho relativo partirá de src, não da raiz.'}</small></span></div><button type="button">Cancel</button><button type="button" className="primary">Run</button></footer><div className="idea7-run-equivalent"><section><small>Aula 006 — explícito</small><code>java -cp out Main {args}</code></section><ArrowRight /><section><small>IntelliJ — configuração</small><code>JRE {jre} · {mainClass} · {working === 'root' ? 'raiz' : 'src'}</code></section></div></section>;
}

function WorkingDirectory() {
  const [working, setWorking] = useState('root');
  const path = working === 'root' ? 'C:\\dev\\projects\\formacao-java-backend\\dados\\clientes.csv' : 'C:\\dev\\projects\\formacao-java-backend\\src\\dados\\clientes.csv';
  return <section className="idea7-working-directory"><CodeWindow language="java" title="src/Main.java">{PATH_CODE}</CodeWindow><article><header><FolderOpen size={20} /><strong>De onde parte dados/clientes.csv?</strong></header><div role="tablist"><button type="button" role="tab" aria-selected={working === 'root'} className={working === 'root' ? 'active' : ''} onClick={() => setWorking('root')}>$PROJECT_DIR$</button><button type="button" role="tab" aria-selected={working === 'src'} className={working === 'src' ? 'active' : ''} onClick={() => setWorking('src')}>$PROJECT_DIR$\src</button></div><div className="idea7-path-result"><span>Path.of relativo</span><ArrowRight /><code>{path}</code></div><p>{working === 'root' ? 'A raiz do projeto contém a pasta dados: o caminho representa a intenção.' : 'A IDE procura dados dentro de src. O código é o mesmo; a configuração mudou a resolução.'}</p></article></section>;
}

function TerminalAudit() {
  const commands = [
    { command: 'pwd', output: 'Path\n----\nC:\\dev\\projects\\formacao-java-backend', meaning: 'O shell iniciou na mesma raiz aberta no Project.' },
    { command: 'ls', output: 'docs    src    .gitignore    README.md', meaning: 'Os arquivos principais confirmam a raiz.' },
    { command: 'java -version', output: 'openjdk version "21.0.x" LTS\nOpenJDK Runtime Environment Temurin-21.0.x', meaning: 'O launcher do PATH pertence à baseline 21 neste exemplo.' },
    { command: 'javac -version', output: 'javac 21.0.x', meaning: 'O compilador do terminal é coerente com o runtime.' },
    { command: 'Get-Command java, javac | Select-Object Name, Source', output: 'Name       Source\n----       ------\njava.exe   C:\\Program Files\\Eclipse Adoptium\\jdk-21\\bin\\java.exe\njavac.exe  C:\\Program Files\\Eclipse Adoptium\\jdk-21\\bin\\javac.exe', meaning: 'As origens mostram qual instalação o PATH escolheu.' }
  ];
  const [done, setDone] = useState(0);
  const current = commands[done];
  const last = done ? commands[done - 1] : null;
  return <section className="idea7-terminal-audit"><div className="idea7-terminal-window"><header><span>Terminal</span><strong>Local: PowerShell</strong><button type="button">+</button></header><div>{commands.slice(0, done).map(item => <div className="ps-entry" key={item.command}><p><span>PS C:\dev\projects\formacao-java-backend&gt;</span> {item.command}</p><pre>{item.output}</pre></div>)}{current ? <p className="ps-cursor"><span>PS C:\dev\projects\formacao-java-backend&gt;</span><i /></p> : <p className="ps-success"><CheckCircle2 size={17} /> Raiz, runtime, compilador e origens registrados.</p>}</div><footer><span>Run</span><span>Debug</span><strong>Terminal</strong><span>Problems</span></footer></div><aside>{current ? <><small>Inspeção {done + 1} de {commands.length}</small><CodeWindow language="powershell" title="Execute no terminal integrado">{current.command}</CodeWindow><button type="button" className="ps-run" onClick={() => setDone(value => value + 1)}><Play size={16} /> Executar na simulação</button></> : <div className="idea7-audit-ok"><CheckCircle2 size={29} /><strong>Terminal documentado</strong><span>Agora compare com Project Structure.</span></div>}{last && <p className="idea7-terminal-proof"><strong>O que prova:</strong> {last.meaning}</p>}<button type="button" className="ps-reset" disabled={done === 0} onClick={() => setDone(0)}><RotateCcw size={15} /> Reiniciar</button></aside></section>;
}

function EditingToolkit() {
  const [tool, setTool] = useState('completion');
  const [applied, setApplied] = useState(false);
  const tools = {
    completion: { label: 'Completion', icon: Sparkles, objective: 'Completar uma chamada conhecendo tipo, parâmetros e retorno.', before: 'System.out.pri', after: 'System.out.println("Olá");', action: 'Ctrl+Space', evidence: 'A lista distingue println, printf e outros membros; você aceita a assinatura desejada.' },
    import: { label: 'Import', icon: Package, objective: 'Referenciar Path pelo nome simples sem inventar biblioteca.', before: 'Path arquivo = Path.of("dados/a.csv");', after: 'import java.nio.file.Path;\n\nPath arquivo = Path.of("dados/a.csv");', action: 'Alt+Enter / Ctrl+Alt+O', evidence: 'A IDE insere java.nio.file.Path e pode remover imports não usados.' },
    format: { label: 'Reformat', icon: WandSparkles, objective: 'Aplicar o estilo configurado sem mudar a lógica.', before: 'if(true){System.out.println("ok");}', after: 'if (true) {\n    System.out.println("ok");\n}', action: 'Ctrl+Alt+L', evidence: 'Espaços, recuo e quebras mudam; o comportamento não.' },
    navigate: { label: 'Navegação', icon: Search, objective: 'Sair da chamada e chegar à declaração correta.', before: 'int total = calcularTotal(80, 4);', after: 'static int calcularTotal(int preco, int quantidade) {\n    return preco * quantidade;\n}', action: 'Ctrl+clique', evidence: 'A IDE usa o símbolo resolvido; não é uma busca textual pelo mesmo nome.' },
    rename: { label: 'Rename', icon: RefreshCw, objective: 'Renomear símbolo e referências com preview.', before: 'int qtd = 4;\ncalcularTotal(preco, qtd);', after: 'int quantidade = 4;\ncalcularTotal(preco, quantidade);', action: 'Shift+F6', evidence: 'O preview mostra as referências afetadas antes de confirmar.' }
  };
  const current = tools[tool];
  const Icon = current.icon;
  const choose = id => { setTool(id); setApplied(false); };
  return <section className="idea7-editing-toolkit"><div role="tablist">{Object.entries(tools).map(([id, item]) => { const ItemIcon = item.icon; return <button type="button" role="tab" aria-selected={tool === id} className={tool === id ? 'active' : ''} onClick={() => choose(id)} key={id}><ItemIcon size={17} />{item.label}</button>; })}</div><article role="tabpanel"><header><Icon size={24} /><div><small>Objetivo</small><h3>{current.objective}</h3></div><kbd>{current.action}</kbd></header><div className="idea7-editor-tool"><div><small>{applied ? 'Depois da ação' : 'Antes da ação'}</small><pre>{applied ? current.after : current.before}</pre>{tool === 'completion' && !applied && <div className="idea7-completion-popup"><strong>println(String x)</strong><span>printf(String format, Object... args)</span><span>print(Object obj)</span></div>}{tool === 'rename' && applied && <div className="idea7-rename-preview"><strong>2 usages found</strong><span>Main.java:2 — declaração</span><span>Main.java:3 — argumento</span></div>}</div><button type="button" onClick={() => setApplied(value => !value)}>{applied ? <><RotateCcw size={15} /> Desfazer simulação</> : <><Keyboard size={15} /> Aplicar {current.action}</>}</button></div><footer><CheckCircle2 size={16} /><span><strong>Evidência:</strong> {current.evidence}</span></footer></article></section>;
}

const DIAGNOSIS_CASES = [
  { symptom: 'No SDK / código Java vermelho', area: 'Project Structure', inspect: 'Project SDK, Module SDK e caminho do JDK', fix: 'Adicione JDK 21 e faça o módulo herdar.', confirm: 'Main é reconhecida e Run fica disponível.' },
  { symptom: 'src aparece como pasta comum', area: 'Project tool window', inspect: 'Cor da pasta e Mark Directory As', fix: 'Marque src como Sources Root no projeto simples.', confirm: 'Classes e pacotes passam a ser resolvidos.' },
  { symptom: 'Run executa a classe errada', area: 'Run Configuration', inspect: 'Nome da configuração e Main class', fix: 'Selecione a classe principal correta.', confirm: 'O console mostra a saída de Main.' },
  { symptom: 'Arquivo relativo não foi encontrado', area: 'Run Configuration', inspect: 'Working directory e caminho usado no código', fix: 'Alinhe a raiz ou torne o caminho explícito.', confirm: 'toAbsolutePath aponta para o arquivo pretendido.' },
  { symptom: 'IDE usa 21; terminal mostra 25', area: 'Ambientes diferentes', inspect: 'Project SDK e Get-Command java', fix: 'Decida e alinhe quando o build exigir; não presuma.', confirm: 'As versões escolhidas ficam documentadas.' },
  { symptom: 'Terminal abriu fora do projeto', area: 'Terminal', inspect: 'pwd e ls', fix: 'cd para a raiz ou abra terminal pelo projeto.', confirm: 'Prompt e Project mostram a mesma pasta.' },
  { symptom: 'Rename quebrou referências', area: 'Refatoração', inspect: 'Se foi edição textual ou Shift+F6', fix: 'Use Rename e revise o preview.', confirm: 'Usages resolvidos e build sem erro.' },
  { symptom: 'out e class aparecem no Git', area: 'Higiene', inspect: 'git status e .gitignore', fix: 'Ignore gerados conforme a política do repositório.', confirm: 'git status mostra apenas arquivos intencionais.' }
];

function DiagnosisClinic() {
  const [selected, setSelected] = useState(0);
  const current = DIAGNOSIS_CASES[selected];
  return <section className="idea7-diagnosis"><div role="tablist">{DIAGNOSIS_CASES.map((item, index) => <button type="button" role="tab" aria-selected={selected === index} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={item.symptom}><span>{index + 1}</span>{item.symptom}</button>)}</div><article role="tabpanel"><header><BookOpenCheck size={25} /><div><small>Onde investigar</small><h3>{current.area}</h3></div></header><blockquote>{current.symptom}</blockquote><div><section><Search size={17} /><strong>Inspecione</strong><p>{current.inspect}</p></section><section><Wrench size={17} /><strong>Corrija</strong><p>{current.fix}</p></section><section><CheckCircle2 size={17} /><strong>Confirme</strong><p>{current.confirm}</p></section></div></article></section>;
}

function HygieneMap() {
  const [policy, setPolicy] = useState('course');
  return <section className="idea7-hygiene"><div className="idea7-hygiene-columns"><article><header><GitBranch size={18} /><strong>Versionar</strong></header><span><FileText size={14} /> src/Main.java</span><span><FileText size={14} /> docs/atalhos.md</span><span><FileText size={14} /> README.md</span><span><FileCog size={14} /> .gitignore</span><p>Fonte, documentação e decisões compartilháveis.</p></article><article className="ignore"><header><RefreshCw size={18} /><strong>Ignorar na regra inicial</strong></header><span><Folder size={14} /> .idea/</span><span><FileCog size={14} /> *.iml</span><span><Folder size={14} /> out/</span><span><Binary size={14} /> *.class</span><span><Folder size={14} /> target/</span><p>Configuração local ampla e artefatos recriáveis.</p></article></div><div className="idea7-policy"><div role="tablist"><button type="button" className={policy === 'course' ? 'active' : ''} onClick={() => setPolicy('course')}>Regra da formação</button><button type="button" className={policy === 'team' ? 'active' : ''} onClick={() => setPolicy('team')}>Nuance profissional</button></div>{policy === 'course' ? <p>Ignore toda .idea enquanto aprende para evitar ruído local. Confirme com git status antes do commit.</p> : <p>Alguns times versionam partes compartilháveis da configuração, como inspeções ou Run Configurations. A política deve ser explícita; nunca inclua workspace.xml e preferências pessoais por acidente.</p>}</div></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'productMap') return <ProductMap />;
  if (block.type === 'installFlow') return <InstallFlow />;
  if (block.type === 'welcomeOpen') return <WelcomeOpen />;
  if (block.type === 'projectStructure') return <ProjectStructure />;
  if (block.type === 'environmentMatrix') return <EnvironmentMatrix />;
  if (block.type === 'sourcesRoot') return <SourcesRoot />;
  if (block.type === 'ideaWorkspace') return <IdeaWorkspace />;
  if (block.type === 'runConfiguration') return <RunConfiguration />;
  if (block.type === 'workingDirectory') return <WorkingDirectory />;
  if (block.type === 'terminalAudit') return <TerminalAudit />;
  if (block.type === 'editingToolkit') return <EditingToolkit />;
  if (block.type === 'diagnosisClinic') return <DiagnosisClinic />;
  if (block.type === 'hygieneMap') return <HygieneMap />;
  if (block.type === 'result') return <section className="guided-result"><h3><ClipboardCheck size={20} /> {block.title}</h3><ul>{block.items.map(item => <li key={item}><CheckCircle2 size={16} /> {item}</li>)}</ul></section>;
  if (block.type === 'note') {
    const Icon = block.tone === 'warning' || block.tone === 'danger' ? AlertTriangle : Lightbulb;
    return <aside className={'guided-note ' + (block.tone || 'info')}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>;
  }
  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Compass size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  if (block.type === 'shortcutsDoc') return <div className="guided-file idea7-shortcuts"><div className="guided-file-title"><FileCode2 size={17} /> docs/atalhos.md <CopyButton value={SHORTCUTS_DOC} label="Copiar documento" /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '20px', background: '#101827', fontSize: '.84rem', lineHeight: 1.7 }}>{SHORTCUTS_DOC}</SyntaxHighlighter></div>;
  return null;
}

export default function GuidedIntelliJSetupLesson007({
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
  const completedLabel = useMemo(() => completedStepIds.size + ' de ' + steps.length + ' etapas concluídas', [completedStepIds]);

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

  return <article className="guided-git-lesson guided-idea-lesson guided-intellij-setup-lesson">
    <header className="guided-hero">
      <div className="guided-hero-copy"><span className="guided-kicker"><Code2 size={17} /> Laboratório de ambientação no IntelliJ</span><p className="guided-sequence">007 · M0.07</p><h1>Abra a IDE sem fechar a caixa-preta</h1><p>Instale, abra pela raiz, configure o JDK 21, organize fontes, execute Main e audite cada configuração que o botão Run utiliza.</p></div>
      <div className="guided-hero-status"><Code2 size={42} /><strong>{progress}%</strong><span>{completedLabel}</span></div>
      <div className="guided-progress-track" aria-label={'Progresso: ' + progress + '%'}><span style={{ width: progress + '%' }} /></div>
    </header>

    <GuidedLessonFacts ariaLabel="Resultado da aula" items={[{ value: 1, label: 'projeto coerente' }, { value: 5, label: 'áreas da IDE' }, { value: 8, label: 'falhas diagnosticáveis' }]} />

    <div className="guided-layout">
      <nav className="guided-step-nav" aria-label="Etapas da aula 007"><div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>{steps.map((step, index) => <button type="button" key={step.id} className={(index === activeIndex ? 'active ' : '') + (completedStepIds.has(step.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}</nav>
      <main className="guided-step-content"><div className="guided-step-heading"><span>{activeStep.eyebrow} · {activeStep.duration}</span><h2>{activeStep.title}</h2></div><div className="guided-blocks">{activeStep.blocks.map((block, index) => <ContentBlock block={block} key={activeStep.id + '-' + block.type + '-' + index} />)}</div>
        <div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (activeStepComplete ? 'undo' : 'complete')} onClick={toggleActiveStep}>{activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><Check size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div></div>
        {allStepsComplete && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>{lessonComplete ? 'IDE registrada' : 'Auditoria do IntelliJ concluída'}</h3><p>{lessonComplete ? 'Etapas, configurações e conclusão geral estão registradas.' : 'Conclua a aula para liberar o laboratório de debug.'}</p></div><button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}
      </main>
    </div>
    <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 006</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsComplete ? 'ready' : '')}>{lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : completedStepIds.size + ' de ' + steps.length + ' etapas'}</strong><small>{lessonComplete ? 'IntelliJ auditado' : allStepsComplete ? 'Use o botão acima' : 'Configure e confirme cada área'}</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas e a aula para avançar' : 'Abrir o laboratório de debug'}>Aula 008 <ArrowRight size={17} /></button></footer>
  </article>;
}
