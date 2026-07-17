import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Binary,
  Braces,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  ClipboardCheck,
  Clock3,
  Code2,
  Compass,
  Container,
  Copy,
  Cpu,
  FileCode2,
  FileText,
  Folder,
  FolderOpen,
  GitBranch,
  HardDrive,
  Layers3,
  Lightbulb,
  ListChecks,
  Monitor,
  Package,
  Play,
  RefreshCw,
  RotateCcw,
  Search,
  Server,
  ShieldCheck,
  Terminal,
  Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedPowerShellLesson.css';
import './guidedJavaPlatformLesson.css';

const LESSON_STORAGE_KEY = 'guided-java-platform-lesson-005-progress';

const MAIN_CODE = `public class Main {
    public static void main(String[] args) {
        System.out.println("JDK compila. JVM executa.");
        System.out.println("A plataforma Java está funcionando.");
    }
}`;

const UPDATED_CODE = `public class Main {
    public static void main(String[] args) {
        System.out.println("Código-fonte alterado: compile novamente.");
    }
}`;

const DIARY = `# Aula 005 — JDK, runtime, JVM e LTS

## Baseline da formação
- Versão principal: Java 21 LTS
- Motivo: consistência entre aulas, ferramentas e projetos
- Observação atual: Java 25 também é LTS e é mais recente

## Validação do meu ambiente
- java -version:
- javac -version:
- Get-Command java:
- Get-Command javac:
- JAVA_HOME:

## Fluxo que consigo explicar
Main.java -> javac -> Main.class -> JVM -> saída

## Responsabilidades
- JDK:
- runtime/JRE:
- JVM:
- bytecode:

## Evidência prática
- [ ] Main.java existe
- [ ] Main.class foi gerado
- [ ] java Main exibiu as duas mensagens
- [ ] java e javac usam a mesma versão principal

## Erro que agora consigo diagnosticar
-

## Dúvida
-`;

const VALIDATION_COMMANDS = [
  {
    command: 'java -version',
    output: 'openjdk version "21.0.x" 2026-xx-xx LTS\nOpenJDK Runtime Environment Temurin-21.0.x+yy (build 21.0.x+yy-LTS)\nOpenJDK 64-Bit Server VM Temurin-21.0.x+yy (build 21.0.x+yy-LTS, mixed mode, sharing)',
    proof: 'O launcher java foi encontrado e iniciou um runtime Java 21.',
    variable: 'Distribuição, patch, data, build e texto exato variam. Compare principalmente a versão principal: 21.'
  },
  {
    command: 'javac -version',
    output: 'javac 21.0.x',
    proof: 'O compilador do JDK está acessível e pertence à mesma família principal do runtime.',
    variable: 'O patch pode ser diferente do exemplo, mas java e javac devem ser coerentes.'
  },
  {
    command: 'Get-Command java, javac | Select-Object Name, Source',
    output: 'Name       Source\n----       ------\njava.exe   C:\\Program Files\\Eclipse Adoptium\\jdk-21\\bin\\java.exe\njavac.exe  C:\\Program Files\\Eclipse Adoptium\\jdk-21\\bin\\javac.exe',
    proof: 'Os dois comandos vieram da mesma instalação do JDK.',
    variable: 'Fornecedor e pasta mudam. O importante é reconhecer a origem efetiva escolhida pelo PATH.'
  },
  {
    command: 'where.exe java; where.exe javac',
    output: 'C:\\Program Files\\Eclipse Adoptium\\jdk-21\\bin\\java.exe\nC:\\Program Files\\Eclipse Adoptium\\jdk-21\\bin\\javac.exe',
    proof: 'O localizador do Windows encontrou os executáveis acessíveis pelo diretório atual/PATH.',
    variable: 'Mais de uma linha revela múltiplas instalações acessíveis. A primeira normalmente vence.'
  },
  {
    command: '$env:JAVA_HOME',
    output: 'C:\\Program Files\\Eclipse Adoptium\\jdk-21',
    proof: 'JAVA_HOME aponta para a raiz do JDK; a pasta bin existe dentro dela.',
    variable: 'java pode funcionar por um PATH direto mesmo com JAVA_HOME ausente; Maven, Gradle e outras ferramentas podem consultar essa variável.'
  }
];

const ENVIRONMENT_CASES = [
  {
    id: 'healthy', label: 'Coerente', tone: 'good', java: '21.0.x', javac: '21.0.x', home: '...\\jdk-21', origins: 'mesma raiz',
    verdict: 'Apto para a formação', diagnosis: 'Runtime, compilador e raiz apontam para a baseline 21.',
    action: 'Registre as saídas e siga para a compilação mínima.'
  },
  {
    id: 'mixed', label: '21 × 17', tone: 'danger', java: '21.0.x', javac: '17.0.x', home: '...\\jdk-21', origins: 'raízes diferentes',
    verdict: 'Ambiente inconsistente', diagnosis: 'PATH encontra runtime e compilador de instalações diferentes.',
    action: 'Use Get-Command -All java e Get-Command -All javac, corrija a ordem do PATH e abra uma nova sessão.'
  },
  {
    id: 'runtime', label: 'Sem javac', tone: 'warning', java: '21.0.x', javac: 'não encontrado', home: 'vazio ou runtime', origins: 'somente java',
    verdict: 'Executa, mas não desenvolve', diagnosis: 'Há um runtime acessível, porém o compilador do JDK não está disponível.',
    action: 'Instale/configure um JDK completo e confirme javac antes de compilar.'
  },
  {
    id: 'bin', label: 'HOME em bin', tone: 'warning', java: '21.0.x', javac: '21.0.x', home: '...\\jdk-21\\bin', origins: 'mesma raiz',
    verdict: 'Variável conceitualmente errada', diagnosis: 'JAVA_HOME deveria representar a casa do JDK, não seu subdiretório de executáveis.',
    action: 'Aponte JAVA_HOME para ...\\jdk-21; deixe o PATH alcançar %JAVA_HOME%\\bin.'
  },
  {
    id: 'multiple', label: 'Dois Javas', tone: 'info', java: '21.0.x', javac: '21.0.x', home: '...\\jdk-21', origins: 'jdk-21 e jdk-25',
    verdict: 'Funciona, mas exige intenção', diagnosis: 'Múltiplos JDKs são válidos; o risco é não saber qual comando cada ambiente escolheu.',
    action: 'Compare terminal, Project SDK da IDE, build e container. Não misture versões sem decisão explícita.'
  }
];

const ERROR_CASES = [
  { id: 'notfound', symptom: "javac: The term 'javac' is not recognized", phase: 'Ambiente', inspect: 'Get-Command javac; $env:JAVA_HOME', fix: 'Disponibilize o JDK no PATH e reabra o terminal.', confirm: 'javac -version' },
  { id: 'classfile', symptom: 'java Main.class', phase: 'Execução', inspect: 'Observe o argumento passado ao launcher', fix: 'Passe o nome da classe: java Main.', confirm: 'A saída do programa aparece.' },
  { id: 'stale', symptom: 'Mudei a fonte, mas a saída continua antiga', phase: 'Build', inspect: 'Compare Main.java e a data de Main.class', fix: 'Compile novamente com javac Main.java.', confirm: 'java Main mostra a nova mensagem.' },
  { id: 'name', symptom: 'class Programa is public, should be declared in a file named Programa.java', phase: 'Compilação', inspect: 'Compare Main.java com public class Programa', fix: 'Renomeie o arquivo ou a classe pública.', confirm: 'javac termina sem erro e gera o .class correto.' },
  { id: 'oldsession', symptom: 'Configurei o PATH, mas o terminal ainda não encontra java', phase: 'Sessão', inspect: '$env:Path; Get-Command java', fix: 'Feche e abra o terminal para herdar o ambiente atualizado.', confirm: 'Get-Command java mostra a nova origem.' },
  { id: 'projectjdk', symptom: 'No IntelliJ funciona; no terminal falha', phase: 'Configuração', inspect: 'Compare Project SDK com java -version e Get-Command java', fix: 'Alinhe conscientemente os ambientes; não presuma que a IDE usa o PATH.', confirm: 'IDE e terminal exibem a baseline decidida.' }
];

const steps = [
  {
    id: 'mapa', label: 'Mapa da plataforma', duration: '8 min', eyebrow: 'Comece aqui',
    title: 'Separe linguagem, plataforma e ecossistema antes de instalar qualquer coisa',
    blocks: [
      { type: 'lead', text: 'Quando alguém diz “Java”, pode estar falando do código que você escreve, da máquina que executa ou das ferramentas ao redor. Vamos colocar cada peça no lugar e seguir uma única transformação observável.' },
      { type: 'javaMap' },
      { type: 'result', title: 'A transformação desta aula', items: ['Siglas soltas → responsabilidades que você consegue apontar', 'Instalação presumida → ambiente validado por cinco evidências', 'Botão Run → fonte, compilador, bytecode, JVM e saída visíveis', 'Versão “mais nova” → baseline escolhida e coerente entre ambientes'] }
    ]
  },
  {
    id: 'camadas', label: 'JDK, runtime e JVM', duration: '14 min', eyebrow: 'Etapa 1',
    title: 'Monte o modelo sem transformar as siglas em três caixas mágicas',
    blocks: [
      { type: 'lead', text: 'Agora vamos distinguir responsabilidade conceitual de pacote instalado. Selecione cada camada, veja o que ela oferece e depois acompanhe o mesmo bytecode passando por sistemas operacionais diferentes.' },
      { type: 'platformLayers' },
      { type: 'portabilityDiagram' },
      { type: 'note', tone: 'warning', title: 'JRE: termo importante, distribuição que mudou', text: 'Historicamente era comum instalar um JRE separado. Em Java moderno, o JDK contém uma imagem de runtime modular e aplicações podem levar runtimes personalizados. Use “runtime/JRE” para entender a função de execução, sem imaginar obrigatoriamente uma pasta separada.' }
    ]
  },
  {
    id: 'pipeline', label: 'Fonte até execução', duration: '13 min', eyebrow: 'Etapa 2',
    title: 'Percorra o caminho do código-fonte até a saída da JVM',
    blocks: [
      { type: 'lead', text: 'Clique em avançar e pare em cada mudança de estado. Eu quero que você consiga dizer qual ferramenta agiu, qual artefato nasceu e em qual fase um erro apareceria.' },
      { type: 'compilePipeline' },
      { type: 'sourceMode' }
    ]
  },
  {
    id: 'lts', label: 'Escolher a versão LTS', duration: '11 min', eyebrow: 'Etapa 3',
    title: 'Diferencie versão mais recente de baseline deliberada',
    blocks: [
      { type: 'lead', text: 'Em julho de 2026, Java 25 já é LTS. Mesmo assim, esta formação continua fixada em Java 21 para que aulas, plugins e projetos compartilhem a mesma baseline. Veja a linha do tempo antes de concluir que isso é contradição.' },
      { type: 'ltsTimeline' },
      { type: 'note', tone: 'info', title: 'Regra desta formação', text: 'Use JDK 21 LTS nos laboratórios até existir uma migração curricular explícita. Você pode ter JDK 25 instalado, mas precisa saber qual versão o terminal, a IDE, o build e o container escolheram.' }
    ]
  },
  {
    id: 'validacao', label: 'Validar o JDK', duration: '18 min', eyebrow: 'Etapa 4',
    title: 'Colete cinco evidências antes de chamar o ambiente de saudável',
    blocks: [
      { type: 'lead', text: 'Abra uma nova sessão do PowerShell. Execute uma inspeção por vez e compare a sua saída com o significado — não com cada caractere do exemplo, porque fornecedor, patch e caminho variam.' },
      { type: 'validationLab' },
      { type: 'jdkDirectory' },
      { type: 'windowsEnvironmentMock' }
    ]
  },
  {
    id: 'coerencia', label: 'Diagnosticar coerência', duration: '14 min', eyebrow: 'Etapa 5',
    title: 'Cruze versão, origem e variável em vez de confiar em um único comando',
    blocks: [
      { type: 'lead', text: 'Um java -version bem-sucedido não prova que você consegue desenvolver. Explore os cenários e escolha a próxima verificação com base no que realmente apareceu.' },
      { type: 'environmentCases' },
      { type: 'note', tone: 'warning', title: 'Nova sessão depois da configuração', text: 'Como você viu na Aula 004, o terminal herda variáveis quando nasce. Se o PATH mudou, feche e abra o PowerShell antes de concluir que a configuração falhou.' }
    ]
  },
  {
    id: 'laboratorio', label: 'Compilar e executar', duration: '20 min', eyebrow: 'Etapa 6',
    title: 'Prove a plataforma com um arquivo, um bytecode e duas mensagens',
    blocks: [
      { type: 'lead', text: 'Agora construiremos uma prova completa dentro de C:\\dev\\labs\\java-plataforma. O editor, o terminal, a árvore e o console mudarão juntos; reproduza cada passo na sua máquina.' },
      { type: 'firstProgramLab' },
      { type: 'result', title: 'O que o resultado realmente prova', items: ['O JDK e o compilador javac estão acessíveis', 'Main.java possui código-fonte válido e nome coerente', 'Main.class foi gerado como bytecode', 'O launcher java iniciou uma JVM e encontrou Main', 'A pasta atual e a saída pertencem ao mesmo laboratório'] }
    ]
  },
  {
    id: 'falhas', label: 'Fonte e bytecode antigo', duration: '14 min', eyebrow: 'Etapa 7',
    title: 'Veja por que salvar o .java não atualiza automaticamente o .class',
    blocks: [
      { type: 'lead', text: 'Vamos alterar o código-fonte e executar sem recompilar de propósito. A saída antiga não é “cache misterioso”: é o bytecode anterior sendo executado exatamente como foi gerado.' },
      { type: 'staleBytecode' },
      { type: 'errorClinic' }
    ]
  },
  {
    id: 'profissional', label: 'IDE, build e produção', duration: '13 min', eyebrow: 'Etapa 8',
    title: 'Encontre o mesmo pipeline escondido sob as ferramentas profissionais',
    blocks: [
      { type: 'lead', text: 'A IDE, Maven, Gradle e Docker não substituem a plataforma Java. Eles automatizam, organizam ou empacotam etapas. Selecione um ambiente e veja qual responsabilidade continua existindo.' },
      { type: 'professionalMap' },
      { type: 'environmentMatrix' }
    ]
  },
  {
    id: 'entrega', label: 'Auditoria e diário', duration: '17 min', eyebrow: 'Etapa 9',
    title: 'Audite um ambiente novo e registre evidências que outra pessoa possa revisar',
    blocks: [
      { type: 'lead', text: 'O desafio final não é repetir Main.java. Você receberá três ambientes e precisará decidir qual está apto, qual apenas executa e qual pode produzir divergência entre local e pipeline.' },
      { type: 'challenge', title: 'Desafio: escolha o ambiente de um novo integrante', text: 'O projeto da equipe declara Java 21. Ambiente A: java 21, javac 21, mesma origem e JAVA_HOME na raiz. Ambiente B: java 25, javac 25, IntelliJ em 21. Ambiente C: java 21, javac ausente e JAVA_HOME vazio. Classifique os três, escolha o único pronto sem ajuste e escreva quais comandos provam sua decisão.', acceptance: ['A é identificado como pronto para a baseline da equipe', 'B é tratado como potencialmente válido, mas inconsistente com o Project SDK', 'C é reconhecido como incapaz de compilar', 'Get-Command e versões são usados como evidência', 'A decisão não depende apenas de “ser a versão mais nova”', 'Você explica por que JAVA_HOME aponta para a raiz e PATH alcança bin'] },
      { type: 'diary' },
      { type: 'note', tone: 'info', title: 'Próxima aula: abrir a caixa da compilação', text: 'Na Aula 006 você provocará erros de compilação e execução, trabalhará com mais de uma classe e começará a controlar onde a JVM procura classes. Hoje garantimos que a plataforma e o primeiro fluxo estão sólidos.' }
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

function CodeWindow({ language, children, title, copyLabel = 'Copiar' }) {
  return <div className="jdk-code-window"><header><FileCode2 size={16} /><span>{title}</span><CopyButton value={children} label={copyLabel} /></header><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language === 'java'} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#101827', fontSize: '.82rem', lineHeight: 1.65 }}>{children}</SyntaxHighlighter></div>;
}

function JavaMap() {
  const [selected, setSelected] = useState('platform');
  const data = {
    language: { label: 'Linguagem', icon: Braces, examples: ['classes', 'métodos', 'if', 'records', 'streams'], role: 'Regras e construções usadas para escrever o código-fonte.', boundary: 'Não instala, compila ou executa sozinha.' },
    platform: { label: 'Plataforma', icon: Cpu, examples: ['JDK', 'javac', 'bytecode', 'runtime', 'JVM'], role: 'Ferramentas e ambiente que transformam e executam o programa.', boundary: 'É o foco desta aula.' },
    ecosystem: { label: 'Ecossistema', icon: Layers3, examples: ['Maven', 'Spring', 'JUnit', 'Kafka', 'Docker'], role: 'Bibliotecas e ferramentas construídas ao redor da plataforma.', boundary: 'Automatiza e amplia; não elimina o fluxo fundamental.' }
  };
  const item = data[selected];
  const Icon = item.icon;
  return <section className="jdk-java-map"><div role="tablist">{Object.entries(data).map(([id, value]) => { const ItemIcon = value.icon; return <button type="button" role="tab" aria-selected={selected === id} className={selected === id ? 'active' : ''} onClick={() => setSelected(id)} key={id}><ItemIcon size={19} /><strong>{value.label}</strong></button>; })}</div><article role="tabpanel"><header><Icon size={27} /><div><small>Camada selecionada</small><h3>{item.label}</h3></div></header><div className="jdk-map-examples">{item.examples.map(example => <code key={example}>{example}</code>)}</div><p><strong>Papel:</strong> {item.role}</p><p><strong>Fronteira:</strong> {item.boundary}</p></article><footer><FileText size={18} /><span>Main.java</span><ChevronRight /><Wrench size={18} /><span>javac</span><ChevronRight /><Binary size={18} /><span>Main.class</span><ChevronRight /><Cpu size={18} /><span>JVM</span><ChevronRight /><Monitor size={18} /><span>saída</span></footer></section>;
}

function PlatformLayers() {
  const [selected, setSelected] = useState('jdk');
  const layers = {
    jdk: { label: 'JDK', full: 'Java Development Kit', icon: Wrench, purpose: 'Desenvolver, compilar, documentar, empacotar e executar.', pieces: ['javac', 'java', 'jar', 'javadoc', 'runtime modular'], question: 'Consigo criar e transformar código Java?' },
    runtime: { label: 'runtime / JRE', full: 'Ambiente de execução', icon: Package, purpose: 'Fornecer bibliotecas, módulos e implementação necessários para rodar a aplicação.', pieces: ['módulos Java SE', 'bibliotecas', 'configuração', 'JVM implementada'], question: 'Tenho o necessário para executar esta aplicação?' },
    jvm: { label: 'JVM', full: 'Java Virtual Machine', icon: Cpu, purpose: 'Carregar, verificar e executar bytecode conforme a especificação da máquina virtual.', pieces: ['carregamento', 'verificação', 'execução', 'memória e GC'], question: 'Como este bytecode será executado nesta plataforma?' }
  };
  const item = layers[selected];
  const Icon = item.icon;
  return <section className="jdk-platform-layers"><div className="jdk-layer-stack" role="tablist">{Object.entries(layers).map(([id, value]) => { const ItemIcon = value.icon; return <button type="button" role="tab" aria-selected={selected === id} className={`${id} ${selected === id ? 'active' : ''}`} onClick={() => setSelected(id)} key={id}><ItemIcon size={21} /><span><strong>{value.label}</strong><small>{value.full}</small></span></button>; })}</div><article role="tabpanel"><header><Icon size={28} /><div><small>Responsabilidade</small><h3>{item.label}</h3></div></header><p>{item.purpose}</p><div>{item.pieces.map(piece => <span key={piece}><Check size={13} />{piece}</span>)}</div><blockquote>{item.question}</blockquote></article></section>;
}

function PortabilityDiagram() {
  const [os, setOs] = useState('windows');
  const systems = { windows: { label: 'Windows', detail: 'JVM para Windows x64', icon: Monitor }, linux: { label: 'Linux', detail: 'JVM para Linux x64/ARM', icon: Server }, macos: { label: 'macOS', detail: 'JVM para macOS x64/ARM', icon: HardDrive } };
  const current = systems[os];
  const Icon = current.icon;
  return <section className="jdk-portability"><header><strong>O bytecode pode ser o mesmo; a implementação da JVM conhece o sistema</strong><div role="tablist">{Object.entries(systems).map(([id, value]) => <button type="button" role="tab" aria-selected={os === id} className={os === id ? 'active' : ''} onClick={() => setOs(id)} key={id}>{value.label}</button>)}</div></header><div><article><Binary size={26} /><strong>Main.class</strong><span>bytecode</span></article><ArrowRight /><article className="selected"><Cpu size={26} /><strong>{current.detail}</strong><span>implementação/runtime</span></article><ArrowRight /><article><Icon size={26} /><strong>{current.label}</strong><span>sistema + arquitetura</span></article></div><footer>Portabilidade não apaga dependências nativas, arquivos, arquitetura, permissões ou configuração. Ela cria uma camada comum para o bytecode.</footer></section>;
}

function CompilePipeline() {
  const [stage, setStage] = useState(0);
  const states = [
    { label: 'Código-fonte escrito', actor: 'Você + editor', artifact: 'Main.java', detail: 'Código Java legível, ainda sem Main.class.', phase: 'fonte' },
    { label: 'Compilação', actor: 'javac Main.java', artifact: 'Main.class', detail: 'O compilador valida e gera bytecode.', phase: 'compile' },
    { label: 'Inicialização', actor: 'java Main', artifact: 'JVM + classe Main', detail: 'O launcher inicia a JVM e pede a classe pelo nome.', phase: 'launch' },
    { label: 'Execução', actor: 'JVM', artifact: 'saída no console', detail: 'O bytecode roda e System.out.println produz texto.', phase: 'run' }
  ];
  const current = states[stage];
  return <section className="jdk-compile-pipeline"><div className="jdk-pipeline-track">{states.map((item, index) => <React.Fragment key={item.label}><button type="button" className={`${index === stage ? 'active' : ''} ${index < stage ? 'done' : ''}`} onClick={() => setStage(index)}><span>{index < stage ? <Check size={14} /> : index + 1}</span><strong>{item.label}</strong><small>{item.actor}</small></button>{index < states.length - 1 && <ArrowRight size={17} />}</React.Fragment>)}</div><div className="jdk-pipeline-stage"><article><small>Entrada / artefato</small><strong>{current.artifact}</strong><p>{current.detail}</p></article><div className="jdk-artifact-preview">{current.phase === 'fonte' && <CodeWindow language="java" title="Main.java">{MAIN_CODE}</CodeWindow>}{current.phase === 'compile' && <div className="jdk-bytecode"><Binary size={35} /><strong>CA FE BA BE · bytecode</strong><span>Não edite o .class; ele é artefato gerado.</span></div>}{current.phase === 'launch' && <div className="jdk-launch"><Terminal size={27} /><code>java Main</code><span>Nome da classe, sem .class</span></div>}{current.phase === 'run' && <div className="jdk-console"><span>JDK compila. JVM executa.</span><span>A plataforma Java está funcionando.</span></div>}</div></div><footer><button type="button" onClick={() => setStage(value => Math.max(0, value - 1))} disabled={stage === 0}><ArrowLeft size={15} /> Anterior</button><span><strong>{current.actor}</strong> é responsável por esta fase.</span><button type="button" className="primary" onClick={() => setStage(value => Math.min(states.length - 1, value + 1))} disabled={stage === states.length - 1}>Avançar <ArrowRight size={15} /></button></footer></section>;
}

function SourceMode() {
  const [mode, setMode] = useState('explicit');
  return <section className="jdk-source-mode"><div role="tablist"><button type="button" role="tab" aria-selected={mode === 'explicit'} className={mode === 'explicit' ? 'active' : ''} onClick={() => setMode('explicit')}>Fluxo que treinaremos</button><button type="button" role="tab" aria-selected={mode === 'source'} className={mode === 'source' ? 'active' : ''} onClick={() => setMode('source')}>Atalho moderno</button></div>{mode === 'explicit' ? <article role="tabpanel"><CodeWindow language="powershell" title="Duas fases visíveis">{'javac Main.java\njava Main'}</CodeWindow><p>O <code>Main.class</code> fica visível no disco. Esse fluxo separa compilação e execução e prepara a Aula 006.</p></article> : <article role="tabpanel"><CodeWindow language="powershell" title="Source-file mode">{'java Main.java'}</CodeWindow><p>Desde Java 11, o launcher pode compilar um programa de arquivo único em memória e executá-lo. Isso é válido, mas esconde o artefato que queremos observar hoje.</p></article>}</section>;
}

function LtsTimeline() {
  const [selected, setSelected] = useState(21);
  const versions = [
    { version: 8, year: 2014, lts: true, note: 'Legado muito difundido; importante para leitura, não baseline nova.' },
    { version: 11, year: 2018, lts: true, note: 'Primeira LTS após a modularização do JDK.' },
    { version: 17, year: 2021, lts: true, note: 'Baseline ainda comum em muitos projetos corporativos.' },
    { version: 21, year: 2023, lts: true, note: 'Baseline desta formação: moderna, estável e coerente com o roteiro.' },
    { version: 25, year: 2025, lts: true, note: 'LTS mais recente em 2026; opção de migração, não troca silenciosa.' }
  ];
  const current = versions.find(item => item.version === selected) || versions[3];
  return <section className="jdk-lts-timeline"><div className="jdk-version-line" role="tablist">{versions.map(item => <button type="button" role="tab" aria-selected={selected === item.version} className={`${selected === item.version ? 'active' : ''} ${item.version === 21 ? 'baseline' : ''}`} onClick={() => setSelected(item.version)} key={item.version}><span>{item.version}</span><small>{item.year}</small>{item.version === 21 && <em>curso</em>}</button>)}</div><article role="tabpanel"><header><span>Java {current.version}</span><strong>{current.lts ? 'LTS' : 'não LTS'}</strong></header><p>{current.note}</p><div className="jdk-lts-decision"><section><ShieldCheck size={20} /><span><strong>LTS</strong><small>janela de suporte definida pelo fornecedor</small></span></section><section><GitBranch size={20} /><span><strong>Baseline</strong><small>versão decidida pelo projeto e suas ferramentas</small></span></section><section><RefreshCw size={20} /><span><strong>Migração</strong><small>mudança testada, não atualização por impulso</small></span></section></div></article></section>;
}

function ValidationLab() {
  const [done, setDone] = useState(0);
  const current = VALIDATION_COMMANDS[done];
  const last = done ? VALIDATION_COMMANDS[done - 1] : null;
  return <section className="jdk-validation-lab"><div className="ps-terminal"><header><Terminal size={16} /> PowerShell <span>auditoria do JDK</span></header><div>{VALIDATION_COMMANDS.slice(0, done).map((item, index) => <div className="ps-entry" key={`${item.command}-${index}`}><p><span>PS C:\dev&gt;</span> {item.command}</p><pre>{item.output}</pre></div>)}{current ? <p className="ps-cursor"><span>PS C:\dev&gt;</span><i /></p> : <p className="ps-success"><CheckCircle2 size={17} /> Cinco evidências coletadas.</p>}</div></div><aside>{current ? <><small>Inspeção {done + 1} de {VALIDATION_COMMANDS.length}</small><CodeWindow language="powershell" title="Próximo comando">{current.command}</CodeWindow><button type="button" className="ps-run" onClick={() => setDone(value => value + 1)}><Play size={16} /> Executar na simulação</button></> : <div className="jdk-audit-complete"><ShieldCheck size={29} /><strong>Agora cruze as evidências</strong><p>Comandos isolados funcionam; a próxima etapa verifica se pertencem ao mesmo JDK.</p></div>}{last && <div className="jdk-output-reading"><strong>O que prova</strong><p>{last.proof}</p><strong>O que pode variar</strong><p>{last.variable}</p></div>}<button type="button" className="ps-reset" onClick={() => setDone(0)} disabled={done === 0}><RotateCcw size={15} /> Reiniciar</button></aside></section>;
}

function JdkDirectory() {
  const [homeCorrect, setHomeCorrect] = useState(true);
  return <section className="jdk-directory"><header><div><FolderOpen size={18} /><span><strong>{homeCorrect ? 'JAVA_HOME correto' : 'JAVA_HOME incorreto'}</strong><code>{homeCorrect ? 'C:\\Program Files\\Eclipse Adoptium\\jdk-21' : 'C:\\Program Files\\Eclipse Adoptium\\jdk-21\\bin'}</code></span></div><button type="button" onClick={() => setHomeCorrect(value => !value)}>{homeCorrect ? 'Ver erro comum' : 'Voltar ao correto'}</button></header><div className="jdk-directory-tree"><span className="root"><FolderOpen size={16} /> jdk-21 <em>← JAVA_HOME</em></span><span><FolderOpen size={15} /> bin <em>← PATH encontra executáveis</em></span><span className="file"><Terminal size={14} /> java.exe</span><span className="file"><Wrench size={14} /> javac.exe</span><span><Folder size={15} /> conf</span><span><Folder size={15} /> jmods</span><span><Folder size={15} /> lib</span></div><footer><strong>Responsabilidades diferentes:</strong> <code>PATH</code> localiza comandos; <code>JAVA_HOME</code> oferece a raiz do JDK para ferramentas que a consultam.</footer></section>;
}

function WindowsEnvironmentMock() {
  const [screen, setScreen] = useState('variables');
  return <section className="jdk-windows-mock" aria-label="Simulação didática da tela de variáveis do Windows"><header><Monitor size={17} /> Propriedades do Sistema <span>Simulação didática</span></header><div className="jdk-windows-tabs" role="tablist"><button type="button" role="tab" aria-selected={screen === 'variables'} className={screen === 'variables' ? 'active' : ''} onClick={() => setScreen('variables')}>Variáveis de Ambiente</button><button type="button" role="tab" aria-selected={screen === 'path'} className={screen === 'path' ? 'active' : ''} onClick={() => setScreen('path')}>Editar Path</button></div>{screen === 'variables' ? <div className="jdk-variable-table" role="tabpanel"><div><strong>Variáveis do usuário</strong><span>Nome</span><span>Valor</span><b>JAVA_HOME</b><code>C:\Program Files\Eclipse Adoptium\jdk-21</code><b>Path</b><code>…</code></div><ol><li>Pesquise “variáveis de ambiente” no menu Iniciar.</li><li>Abra <strong>Editar as variáveis de ambiente do sistema</strong>.</li><li>Clique em <strong>Variáveis de Ambiente…</strong>.</li><li>Confirme a raiz; não altere valores por tentativa.</li></ol></div> : <div className="jdk-path-editor" role="tabpanel"><div><strong>Editar variável de ambiente</strong><span className="selected">%JAVA_HOME%\bin</span><span>C:\Windows\System32</span><span>…</span></div><ol><li>Selecione <strong>Path</strong> e clique em Editar.</li><li>Adicione <code>%JAVA_HOME%\bin</code> se a instalação escolhida exigir configuração manual.</li><li>Confirme as janelas.</li><li>Abra um PowerShell novo e valide — não confie apenas na tela.</li></ol></div>}<footer>A aparência e os nomes podem variar entre Windows 10/11 e políticas corporativas. A prova final continua sendo o terminal.</footer></section>;
}

function EnvironmentCases() {
  const [selected, setSelected] = useState('healthy');
  const current = ENVIRONMENT_CASES.find(item => item.id === selected) || ENVIRONMENT_CASES[0];
  return <section className="jdk-environment-cases"><div role="tablist">{ENVIRONMENT_CASES.map(item => <button type="button" role="tab" aria-selected={selected === item.id} className={selected === item.id ? 'active' : ''} onClick={() => setSelected(item.id)} key={item.id}><span className={item.tone} />{item.label}</button>)}</div><article role="tabpanel"><div className="jdk-coherence-grid"><section><small>java</small><strong>{current.java}</strong></section><section><small>javac</small><strong>{current.javac}</strong></section><section><small>JAVA_HOME</small><strong>{current.home}</strong></section><section><small>origens</small><strong>{current.origins}</strong></section></div><header className={current.tone}><CircleDot size={18} /><span><strong>{current.verdict}</strong><small>{current.diagnosis}</small></span></header><footer><Search size={17} /><span><strong>Próxima ação:</strong> {current.action}</span></footer></article></section>;
}

function FirstProgramTree({ stage }) {
  return <div className="jdk-program-tree"><span><FolderOpen size={15} /> java-plataforma</span>{stage >= 2 && <span className="one"><FileText size={14} /> Main.java</span>}{stage >= 4 && <span className="one generated"><Binary size={14} /> Main.class</span>}</div>;
}

function FirstProgramLab() {
  const actions = [
    { command: 'cd C:\\dev\\labs; mkdir java-plataforma; cd java-plataforma', output: '', proof: 'O prompt passa a apontar para o laboratório isolado.', stage: 1 },
    { command: "New-Item -ItemType File -Path 'Main.java'", output: 'Mode   Length Name\n----   ------ ----\n-a---       0 Main.java', proof: 'O arquivo de código-fonte existe e começa vazio.', stage: 2 },
    { command: '# Abra Main.java, cole o código ao lado e salve', output: '', proof: 'O editor contém uma classe pública Main no arquivo Main.java.', stage: 3 },
    { command: 'javac Main.java', output: '', proof: 'Ausência de erro significa que a compilação terminou; confirme o artefato com ls.', stage: 4 },
    { command: 'ls', output: 'Mode   Length Name\n----   ------ ----\n-a---     536 Main.class\n-a---     224 Main.java', proof: 'Fonte e bytecode agora existem. Tamanhos, datas e colunas variam.', stage: 5 },
    { command: 'java Main', output: 'JDK compila. JVM executa.\nA plataforma Java está funcionando.', proof: 'A JVM encontrou Main e executou o método main.', stage: 6 }
  ];
  const [done, setDone] = useState(0);
  const current = actions[done];
  const last = done ? actions[done - 1] : null;
  return <section className="jdk-first-program"><div className="jdk-program-workbench"><CodeWindow language="java" title="C:\dev\labs\java-plataforma\Main.java" copyLabel="Copiar código">{MAIN_CODE}</CodeWindow><div className="jdk-program-side"><header><FolderOpen size={16} /> Project</header><FirstProgramTree stage={last?.stage ?? 0} /></div></div><div className="jdk-program-terminal"><div className="ps-terminal"><header><Terminal size={16} /> PowerShell <span>java-plataforma</span></header><div>{actions.slice(0, done).map((item, index) => <div className="ps-entry" key={`${item.command}-${index}`}><p><span>{index === 0 ? 'PS C:\\dev&gt;' : 'PS C:\\dev\\labs\\java-plataforma&gt;'}</span> {item.command}</p>{item.output ? <pre>{item.output}</pre> : <small>Sem saída textual — use o prompt ou a próxima confirmação.</small>}</div>)}{current ? <p className="ps-cursor"><span>{done === 0 ? 'PS C:\\dev&gt;' : 'PS C:\\dev\\labs\\java-plataforma&gt;'}</span><i /></p> : <p className="ps-success"><CheckCircle2 size={17} /> Código-fonte compilado e executado.</p>}</div></div><aside>{current ? <><small>Próxima ação</small><CodeWindow language="powershell" title={`Passo ${done + 1}`}>{current.command}</CodeWindow><button type="button" className="ps-run" onClick={() => setDone(value => value + 1)}><Play size={16} /> Executar na simulação</button></> : <div className="jdk-audit-complete"><CheckCircle2 size={29} /><strong>Plataforma comprovada</strong><p>O mesmo estado aparece no editor, árvore, terminal e console.</p></div>}{last && <p className="jdk-last-proof"><strong>Evidência:</strong> {last.proof}</p>}<button type="button" className="ps-reset" disabled={done === 0} onClick={() => setDone(0)}><RotateCcw size={15} /> Reiniciar</button></aside></div></section>;
}

function StaleBytecode() {
  const [compiled, setCompiled] = useState(false);
  return <section className="jdk-stale-bytecode"><div className="jdk-source-bytecode"><article><header><FileText size={17} /><strong>Main.java</strong><span>salvo agora</span></header><CodeWindow language="java" title="Código-fonte alterado">{UPDATED_CODE}</CodeWindow></article><ArrowRight /><article><header><Binary size={17} /><strong>Main.class</strong><span>{compiled ? 'regenerado agora' : 'gerado antes'}</span></header><div className={compiled ? 'fresh' : 'stale'}><Binary size={33} /><strong>{compiled ? 'bytecode da mensagem nova' : 'bytecode das duas mensagens antigas'}</strong><small>Salvar o .java não altera este arquivo.</small></div></article></div><div className="jdk-stale-console"><code>java Main</code><pre>{compiled ? 'Código-fonte alterado: compile novamente.' : 'JDK compila. JVM executa.\nA plataforma Java está funcionando.'}</pre><button type="button" onClick={() => setCompiled(value => !value)}>{compiled ? <><RotateCcw size={15} /> Voltar ao .class antigo</> : <><Wrench size={15} /> Executar javac Main.java</>}</button></div><footer><strong>{compiled ? 'Depois de recompilar:' : 'Antes de recompilar:'}</strong> {compiled ? 'código-fonte e bytecode voltaram a representar a mesma versão.' : 'java Main executa corretamente o artefato antigo; ele não lê o .java para adivinhar a mudança.'}</footer></section>;
}

function ErrorClinic() {
  const [selected, setSelected] = useState('notfound');
  const current = ERROR_CASES.find(item => item.id === selected) || ERROR_CASES[0];
  return <section className="jdk-error-clinic"><div role="tablist">{ERROR_CASES.map(item => <button type="button" role="tab" aria-selected={selected === item.id} className={selected === item.id ? 'active' : ''} onClick={() => setSelected(item.id)} key={item.id}>{item.symptom}</button>)}</div><article role="tabpanel"><header><AlertTriangle size={22} /><div><small>Fase provável</small><h3>{current.phase}</h3></div></header><blockquote>{current.symptom}</blockquote><div><section><span>1</span><strong>Inspecione</strong><code>{current.inspect}</code></section><section><span>2</span><strong>Corrija</strong><p>{current.fix}</p></section><section><span>3</span><strong>Confirme</strong><p>{current.confirm}</p></section></div></article></section>;
}

function ProfessionalMap() {
  const [selected, setSelected] = useState('ide');
  const items = {
    ide: { label: 'IntelliJ', icon: Code2, visible: 'Run, Project SDK, out/', hidden: 'compila, monta classpath e inicia a JVM', risk: 'Project SDK pode diferir do java do terminal.' },
    build: { label: 'Maven/Gradle', icon: Package, visible: 'mvn test, gradle build, target/', hidden: 'chama compilador, resolve dependências e organiza classes', risk: 'Plugin ou toolchain pode escolher outra versão.' },
    docker: { label: 'Docker', icon: Container, visible: 'imagem, JAR, java -jar', hidden: 'leva um runtime compatível para o container', risk: 'Artefato compilado numa versão nova pode falhar em runtime antigo.' },
    production: { label: 'Produção', icon: Server, visible: 'processo, logs, métricas e alertas', hidden: 'JVM gerencia execução, memória, GC e threads', risk: 'Local, pipeline e produção precisam declarar versões coerentes.' }
  };
  const current = items[selected];
  const Icon = current.icon;
  return <section className="jdk-professional-map"><div role="tablist">{Object.entries(items).map(([id, item]) => { const ItemIcon = item.icon; return <button type="button" role="tab" aria-selected={selected === id} className={selected === id ? 'active' : ''} onClick={() => setSelected(id)} key={id}><ItemIcon size={18} />{item.label}</button>; })}</div><article role="tabpanel"><header><Icon size={27} /><h3>{current.label}</h3></header><div><section><small>O que você vê</small><p>{current.visible}</p></section><ArrowRight /><section><small>O que continua acontecendo</small><p>{current.hidden}</p></section></div><footer><AlertTriangle size={16} /><span><strong>Risco:</strong> {current.risk}</span></footer></article></section>;
}

function EnvironmentMatrix() {
  const rows = [
    ['Terminal local', 'java -version / javac -version', 'JDK encontrado pelo PATH'],
    ['IntelliJ', 'Project SDK / Gradle JVM', 'JDK escolhido pela IDE'],
    ['Pipeline', 'setup-java / toolchain / imagem', 'JDK do agente de CI'],
    ['Container', 'FROM ... / java -version', 'runtime dentro da imagem'],
    ['Produção', 'imagem implantada + métricas', 'JVM que executa o serviço']
  ];
  return <section className="jdk-environment-matrix"><header><Layers3 size={19} /><strong>“Na minha máquina funciona” não prova coerência</strong></header><div role="table"><div role="row" className="head"><span>Ambiente</span><span>Evidência</span><span>Origem da versão</span></div>{rows.map(row => <div role="row" key={row[0]}>{row.map(cell => <span role="cell" key={cell}>{cell}</span>)}</div>)}</div><footer>Uma baseline é uma decisão repetida em cada ambiente, não apenas o número exibido no seu notebook.</footer></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'javaMap') return <JavaMap />;
  if (block.type === 'platformLayers') return <PlatformLayers />;
  if (block.type === 'portabilityDiagram') return <PortabilityDiagram />;
  if (block.type === 'compilePipeline') return <CompilePipeline />;
  if (block.type === 'sourceMode') return <SourceMode />;
  if (block.type === 'ltsTimeline') return <LtsTimeline />;
  if (block.type === 'validationLab') return <ValidationLab />;
  if (block.type === 'jdkDirectory') return <JdkDirectory />;
  if (block.type === 'windowsEnvironmentMock') return <WindowsEnvironmentMock />;
  if (block.type === 'environmentCases') return <EnvironmentCases />;
  if (block.type === 'firstProgramLab') return <FirstProgramLab />;
  if (block.type === 'staleBytecode') return <StaleBytecode />;
  if (block.type === 'errorClinic') return <ErrorClinic />;
  if (block.type === 'professionalMap') return <ProfessionalMap />;
  if (block.type === 'environmentMatrix') return <EnvironmentMatrix />;
  if (block.type === 'result') return <section className="guided-result"><h3><ClipboardCheck size={20} /> {block.title}</h3><ul>{block.items.map(item => <li key={item}><CheckCircle2 size={16} /> {item}</li>)}</ul></section>;
  if (block.type === 'note') {
    const Icon = block.tone === 'warning' || block.tone === 'danger' ? AlertTriangle : Lightbulb;
    return <aside className={`guided-note ${block.tone || 'info'}`}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>;
  }
  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Compass size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  if (block.type === 'diary') return <div className="guided-file jdk-diary"><div className="guided-file-title"><FileCode2 size={17} /> docs/validacao-java.md <CopyButton value={DIARY} label="Copiar diário" /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '20px', background: '#101827', fontSize: '.84rem', lineHeight: 1.7 }}>{DIARY}</SyntaxHighlighter></div>;
  return null;
}

export default function GuidedJavaPlatformLesson005({
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

  return <article className="guided-git-lesson guided-java-platform-lesson">
    <header className="guided-hero">
      <div className="guided-hero-copy"><span className="guided-kicker"><Cpu size={17} /> Laboratório da plataforma Java</span><p className="guided-sequence">005 · M0.05</p><h1>Do JDK à JVM, sem mágica</h1><p>Valide seu ambiente, acompanhe o código-fonte virar bytecode e prove qual Java realmente compila e executa o programa.</p></div>
      <div className="guided-hero-status"><Cpu size={42} /><strong>{progress}%</strong><span>{completedLabel}</span></div>
      <div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}><span style={{ width: `${progress}%` }} /></div>
    </header>

    <GuidedLessonFacts ariaLabel="Resultado da aula" items={[{ value: 1, label: 'pipeline visível' }, { value: 5, label: 'evidências do JDK' }, { value: 2, label: 'LTS contextualizadas' }]} />

    <div className="guided-layout">
      <nav className="guided-step-nav" aria-label="Etapas da aula 005"><div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>{steps.map((step, index) => <button type="button" key={step.id} className={`${index === activeIndex ? 'active' : ''} ${completedStepIds.has(step.id) ? 'done' : ''}`} onClick={() => selectStep(index)}><span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}</nav>
      <main className="guided-step-content"><div className="guided-step-heading"><span>{activeStep.eyebrow} · {activeStep.duration}</span><h2>{activeStep.title}</h2></div><div className="guided-blocks">{activeStep.blocks.map((block, index) => <ContentBlock block={block} key={`${activeStep.id}-${block.type}-${index}`} />)}</div>
        <div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${activeStepComplete ? 'undo' : 'complete'}`} onClick={toggleActiveStep}>{activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><Check size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div></div>
        {allStepsComplete && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>{lessonComplete ? 'Plataforma registrada' : 'Auditoria concluída'}</h3><p>{lessonComplete ? 'Etapas, evidências e conclusão geral estão registradas.' : 'Conclua a aula para liberar a compilação manual aprofundada.'}</p></div><button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}
      </main>
    </div>
    <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 004</button><div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>{lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong><small>{lessonComplete ? 'Ambiente documentado' : allStepsComplete ? 'Use o botão acima' : 'Colete e interprete as evidências'}</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas e a aula para avançar' : 'Aprofundar compilação manual'}>Aula 006 <ArrowRight size={17} /></button></footer>
  </article>;
}
