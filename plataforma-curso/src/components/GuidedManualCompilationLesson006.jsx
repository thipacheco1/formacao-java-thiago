import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Binary,
  BookOpenCheck,
  Braces,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  ClipboardCheck,
  Clock3,
  Code2,
  Compass,
  Copy,
  Cpu,
  FileCode2,
  FileText,
  Folder,
  FolderOpen,
  GitBranch,
  Layers3,
  Lightbulb,
  ListChecks,
  MonitorPlay,
  Package,
  Play,
  RefreshCw,
  RotateCcw,
  Search,
  Server,
  Terminal,
  TriangleAlert,
  Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedPowerShellLesson.css';
import './guidedJavaPlatformLesson.css';
import './guidedManualCompilationLesson.css';

const LESSON_STORAGE_KEY = 'guided-manual-compilation-lesson-006-progress';

const MAIN_CODE = [
  'public class Main {',
  '    public static void main(String[] args) {',
  '        System.out.println("Compilação manual com javac.");',
  '    }',
  '}'
].join('\n');

const BAD_SEMICOLON_CODE = [
  'public class Main {',
  '    public static void main(String[] args) {',
  '        System.out.println("Olá")',
  '    }',
  '}'
].join('\n');

const RUNTIME_ERROR_CODE = [
  'public class Main {',
  '    public static void main(String[] args) {',
  '        int resultado = 10 / 0;',
  '        System.out.println(resultado);',
  '    }',
  '}'
].join('\n');

const MENSAGEM_CODE = [
  'public class Mensagem {',
  '    public static String obterTexto() {',
  '        return "Texto vindo de outra classe.";',
  '    }',
  '}'
].join('\n');

const PROGRAMA_CODE = [
  'public class Programa {',
  '    public static void main(String[] args) {',
  '        System.out.println(Mensagem.obterTexto());',
  '    }',
  '}'
].join('\n');

const DIARY = [
  '# Aula 006 — compilação manual com javac',
  '',
  '## Fluxo que consigo explicar',
  'Main.java -> javac -> Main.class -> java -> JVM -> saída',
  '',
  '## Evidências do laboratório',
  '- [ ] Main.java foi salvo',
  '- [ ] javac Main.java terminou sem diagnóstico',
  '- [ ] Main.class foi confirmado com ls',
  '- [ ] java Main exibiu a mensagem',
  '- [ ] provoquei e corrigi um erro de compilação',
  '- [ ] distingui erro de compilação e de execução',
  '- [ ] compilei Mensagem.java e Programa.java',
  '- [ ] executei classes separadas em out com -cp',
  '',
  '## Comandos que pratiquei',
  'javac Main.java',
  'java Main',
  'javac Mensagem.java Programa.java',
  'javac -d out *.java',
  'java -cp out Programa',
  '',
  '## Diagnóstico que agora consigo fazer',
  '- Sintoma:',
  '- Fase:',
  '- Evidência:',
  '- Correção:',
  '- Confirmação:',
  '',
  '## Relação com ferramentas profissionais',
  '- IntelliJ:',
  '- Maven:',
  '- Git:',
  '- Produção:',
  '',
  '## Dúvida que ficou',
  '-'
].join('\n');

const steps = [
  {
    id: 'mapa',
    label: 'Mapa da compilação',
    duration: '9 min',
    eyebrow: 'Comece aqui',
    title: 'Separe escrever, compilar e executar antes de tocar no terminal',
    blocks: [
      { type: 'lead', text: 'Na Aula 005 você provou que a plataforma funciona. Agora eu vou abrir o processo: em cada fase, identifique entrada, ferramenta, artefato e tipo de falha possível. O objetivo não é decorar duas linhas de comando; é saber onde olhar quando algo quebra.' },
      { type: 'phaseMap' },
      { type: 'result', title: 'A pergunta que guia o diagnóstico', items: ['O arquivo fonte existe e está salvo?', 'O compilador aceitou o código e gerou o artefato?', 'O launcher encontrou a classe pedida?', 'A falha aconteceu antes ou durante a execução?'] }
    ]
  },
  {
    id: 'primeiro',
    label: 'Primeiro .class',
    duration: '18 min',
    eyebrow: 'Etapa 1',
    title: 'Compile do zero e confirme cada mudança no disco',
    blocks: [
      { type: 'lead', text: 'Abra o PowerShell e repita cada ação no seu computador. A simulação mostra o que deve mudar e o que pode variar. Quando javac fica silencioso, não adivinhe: confirme o Main.class com uma inspeção.' },
      { type: 'manualLab' },
      { type: 'note', tone: 'info', title: 'javac compila; java inicia a execução', text: 'A compilação não imprime a mensagem do programa. Ela produz bytecode. A saída do println só aparece quando java Main inicia a JVM e chama o método main.' }
    ]
  },
  {
    id: 'compilador',
    label: 'Ler o compilador',
    duration: '17 min',
    eyebrow: 'Etapa 2',
    title: 'Leia arquivo, linha, coluna e mensagem antes de corrigir',
    blocks: [
      { type: 'lead', text: 'O compilador não está dizendo apenas “deu errado”. Ele aponta onde perdeu a capacidade de entender o programa. Explore quatro falhas, veja a marca no editor e faça a correção mínima — sem reescrever tudo.' },
      { type: 'compilerClinic' },
      { type: 'note', tone: 'warning', title: 'Não confunda o ponto indicado com a causa absoluta', text: 'O acento circunflexo marca onde o compilador percebeu o problema. Uma chave ausente antes pode fazer a mensagem aparecer algumas linhas depois. Leia o entorno.' }
    ]
  },
  {
    id: 'fases',
    label: 'Falha e recompilação',
    duration: '16 min',
    eyebrow: 'Etapa 3',
    title: 'Compare erro de compilação, erro de execução e bytecode antigo',
    blocks: [
      { type: 'lead', text: 'Três sintomas podem parecer “o Java não funcionou”, mas pedem ações diferentes. Primeiro compare em qual comando a falha nasce. Depois altere a fonte e observe por que a JVM ainda pode executar uma versão anterior.' },
      { type: 'errorComparator' },
      { type: 'staleTimeline' }
    ]
  },
  {
    id: 'main',
    label: 'Ponto de entrada',
    duration: '11 min',
    eyebrow: 'Etapa 4',
    title: 'Entenda por que uma classe compila e mesmo assim pode não iniciar',
    blocks: [
      { type: 'lead', text: 'Uma classe não precisa ser um programa executável. O compilador aceita classes que servem como modelo, serviço ou biblioteca. Para java Main iniciar diretamente, a classe precisa expor o ponto de entrada esperado.' },
      { type: 'mainAnatomy' },
      { type: 'note', tone: 'info', title: 'Limite desta etapa', text: 'Você ainda não precisa dominar objetos, tipos ou argumentos. Precisa reconhecer a assinatura e saber que static permite ao launcher chamar main sem criar uma instância primeiro.' }
    ]
  },
  {
    id: 'classes',
    label: 'Duas classes',
    duration: '21 min',
    eyebrow: 'Etapa 5',
    title: 'Veja o compilador resolver uma colaboração entre arquivos',
    blocks: [
      { type: 'lead', text: 'Projetos reais não vivem em uma classe. Programa depende de Mensagem: acompanhe a seta da chamada, escolha uma estratégia de compilação e confirme quais .class nasceram.' },
      { type: 'dependencyLab' },
      { type: 'note', tone: 'warning', title: 'Compilação implícita depende de a fonte ser localizável', text: 'javac Programa.java pode localizar Mensagem.java e gerar sua classe quando a fonte está no caminho pesquisado. Para um laboratório pequeno e reproduzível, liste os arquivos ou use *.java. Maven assumirá essa coordenação depois.' }
    ]
  },
  {
    id: 'classpath',
    label: 'Saída e classpath',
    duration: '20 min',
    eyebrow: 'Etapa 6',
    title: 'Separe src de out e diga explicitamente onde a JVM deve procurar',
    blocks: [
      { type: 'lead', text: 'Até aqui, fonte e bytecode ficaram juntos para você enxergar o nascimento do .class. Agora vamos organizá-los. O compilador recebe a pasta de saída; o launcher recebe a raiz onde as classes compiladas estão.' },
      { type: 'classpathLab' },
      { type: 'note', tone: 'warning', title: 'A regra completa do padrão', text: 'Sem -cp, o launcher usa CLASSPATH se essa variável estiver definida; caso contrário, usa a pasta atual. Por isso -cp out torna a intenção visível e evita depender de configuração escondida.' }
    ]
  },
  {
    id: 'profissional',
    label: 'IDE, Maven e Git',
    duration: '14 min',
    eyebrow: 'Etapa 7',
    title: 'Reconheça o mesmo fluxo sob as ferramentas profissionais',
    blocks: [
      { type: 'lead', text: 'IntelliJ, Maven, JAR e container não apagam a compilação. Eles organizam entradas, saídas, dependências e execução. Selecione cada contexto e encontre o equivalente do laboratório.' },
      { type: 'automationMap' },
      { type: 'gitBoundary' }
    ]
  },
  {
    id: 'entrega',
    label: 'Diagnóstico e diário',
    duration: '18 min',
    eyebrow: 'Etapa 8',
    title: 'Diagnostique por evidência e deixe um registro reproduzível',
    blocks: [
      { type: 'lead', text: 'A aula termina quando você consegue receber um sintoma novo, localizar a fase e provar a recuperação. Use a clínica como revisão; depois resolva o desafio sem clicar por tentativa.' },
      { type: 'finalClinic' },
      { type: 'challenge', title: 'Desafio: recupere um build quebrado', text: 'Você recebeu uma pasta com Main.java alterado, Main.class antigo e uma subpasta out vazia. Um colega executa java Main.class e diz que a mudança não apareceu. Escreva uma sequência curta que inspeciona o estado, compila para out e executa a classe correta a partir dessa pasta.', acceptance: ['Você usa ls ou Test-Path para confirmar arquivos', 'Você não executa java Main.class', 'Você compila com javac -d out Main.java', 'Você executa com java -cp out Main', 'Você explica por que o .class antigo não representa a fonte alterada', 'Você registra a saída que confirma a recuperação'] },
      { type: 'diary' },
      { type: 'note', tone: 'info', title: 'Próxima aula: a IDE sem esconder o mecanismo', text: 'Na Aula 007 você abrirá o IntelliJ e identificará Project SDK, source root, pasta de saída, Run Configuration, working directory e terminal integrado. Cada tela terá um conceito que você acabou de operar manualmente.' }
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

function CodeWindow({ language, children, title, errorLine }) {
  return <div className="jdk-code-window cmp-code-window"><header><FileCode2 size={16} /><span>{title}</span><CopyButton value={children} /></header><div className={errorLine ? 'cmp-code-error' : ''} style={errorLine ? { '--error-line': errorLine } : undefined}><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language === 'java'} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#101827', fontSize: '.82rem', lineHeight: 1.65 }}>{children}</SyntaxHighlighter></div></div>;
}

function PhaseMap() {
  const [selected, setSelected] = useState(1);
  const phases = [
    { label: 'Fonte', actor: 'Você + editor', input: 'ideia e regras Java', output: 'Main.java salvo', proof: 'ls mostra o arquivo; o editor não indica alteração pendente.', failure: 'arquivo ausente, pasta errada ou mudança não salva', icon: FileText },
    { label: 'Compilação', actor: 'javac Main.java', input: 'código-fonte', output: 'Main.class', proof: 'javac sem diagnóstico e ls confirma o artefato.', failure: 'sintaxe, tipos, nomes ou dependências inválidas', icon: Wrench },
    { label: 'Localização', actor: 'java Main', input: 'nome da classe + classpath', output: 'classe Main carregada', proof: 'launcher encontra a classe e chama main.', failure: 'classe ausente, nome ou classpath incorreto', icon: Search },
    { label: 'Execução', actor: 'JVM', input: 'bytecode carregado', output: 'comportamento e saída', proof: 'console mostra o resultado ou uma exceção de runtime.', failure: 'dados inválidos, divisão por zero ou outra exceção', icon: Cpu }
  ];
  const current = phases[selected];
  const CurrentIcon = current.icon;
  return <section className="cmp-phase-map"><div className="cmp-phase-track" role="tablist">{phases.map((phase, index) => { const Icon = phase.icon; return <React.Fragment key={phase.label}><button type="button" role="tab" aria-selected={selected === index} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><Icon size={19} /><strong>{phase.label}</strong><small>{phase.actor}</small></button>{index < phases.length - 1 && <ChevronRight size={18} />}</React.Fragment>; })}</div><article role="tabpanel"><header><CurrentIcon size={25} /><div><small>Fase selecionada</small><h3>{current.label}</h3></div></header><div className="cmp-phase-facts"><section><span>Entrada</span><strong>{current.input}</strong></section><section><span>Saída</span><strong>{current.output}</strong></section><section><span>Como provar</span><strong>{current.proof}</strong></section></div><footer><TriangleAlert size={17} /><span><strong>Falhas desta fase:</strong> {current.failure}.</span></footer></article></section>;
}

function ManualTree({ stage }) {
  return <div className="cmp-tree"><span className="root"><FolderOpen size={16} /> compilacao-manual</span>{stage >= 2 && <span className="child"><FileText size={15} /> Main.java <em>fonte</em></span>}{stage >= 5 && <span className="child generated"><Binary size={15} /> Main.class <em>gerado por javac</em></span>}</div>;
}

function ManualLab() {
  const actions = [
    { command: 'cd C:\\dev\\labs', output: 'PS C:\\dev\\labs>', meaning: 'O prompt confirma a pasta-pai dos laboratórios.', stage: 0 },
    { command: 'mkdir compilacao-manual; cd compilacao-manual', output: 'PS C:\\dev\\labs\\compilacao-manual>', meaning: 'A prática ficou isolada em uma pasta conhecida.', stage: 1 },
    { command: 'New-Item Main.java', output: 'Mode   Length Name\n----   ------ ----\n-a---       0 Main.java', meaning: 'O arquivo fonte existe, mas ainda está vazio.', stage: 2 },
    { command: '# Cole o código no editor e salve Main.java', output: 'sem saída no terminal', meaning: 'Salvar é indispensável: javac lê o conteúdo existente no disco.', stage: 3 },
    { command: 'javac Main.java', output: 'sem saída textual', meaning: 'Não houve diagnóstico de erro. Isso ainda será confirmado pelo artefato.', stage: 4 },
    { command: 'ls', output: 'Mode   Length Name\n----   ------ ----\n-a---     446 Main.class\n-a---     150 Main.java', meaning: 'Main.class prova que a compilação gerou bytecode. Tamanho e data podem variar.', stage: 5 },
    { command: 'java Main', output: 'Compilação manual com javac.', meaning: 'O launcher encontrou Main e a JVM executou o método main.', stage: 6 }
  ];
  const [done, setDone] = useState(0);
  const current = actions[done];
  const last = done ? actions[done - 1] : null;
  return <section className="cmp-manual-lab"><div className="cmp-workbench"><CodeWindow language="java" title="C:\dev\labs\compilacao-manual\Main.java">{MAIN_CODE}</CodeWindow><aside><header><FolderOpen size={16} /> Arquivos observáveis</header><ManualTree stage={last?.stage || 0} /><p><CircleDot size={14} /> O editor, o terminal e a árvore devem contar a mesma história.</p></aside></div><div className="cmp-terminal-lab"><div className="ps-terminal"><header><Terminal size={16} /> PowerShell <span>laboratório cumulativo</span></header><div>{actions.slice(0, done).map(item => <div className="ps-entry" key={item.command}><p><span>PS C:\dev\labs\compilacao-manual&gt;</span> {item.command}</p><pre className={item.output === 'sem saída textual' || item.output === 'sem saída no terminal' ? 'silent' : ''}>{item.output}</pre></div>)}{current ? <p className="ps-cursor"><span>PS C:\dev\labs\compilacao-manual&gt;</span><i /></p> : <p className="ps-success"><CheckCircle2 size={17} /> Fonte compilada, artefato confirmado e programa executado.</p>}</div></div><aside>{current ? <><small>Ação {done + 1} de {actions.length}</small><CodeWindow language="powershell" title="Execute e observe">{current.command}</CodeWindow><button type="button" className="ps-run" onClick={() => setDone(value => value + 1)}><Play size={16} /> Executar na simulação</button></> : <div className="cmp-success"><CheckCircle2 size={28} /><strong>Fluxo comprovado</strong><span>Você não dependeu do botão Run.</span></div>}{last && <p className="cmp-proof"><strong>O que essa evidência significa:</strong> {last.meaning}</p>}<button type="button" className="ps-reset" disabled={done === 0} onClick={() => setDone(0)}><RotateCcw size={15} /> Reiniciar</button></aside></div></section>;
}

const COMPILER_CASES = [
  {
    id: 'semicolon',
    label: 'Ponto e vírgula',
    file: 'Main.java',
    code: BAD_SEMICOLON_CODE,
    line: 3,
    output: "Main.java:3: error: ';' expected\n        System.out.println(\"Olá\")\n                                   ^\n1 error",
    read: 'O compilador chegou ao final da instrução na linha 3 e esperava ponto e vírgula.',
    fix: 'Adicione ; depois do parêntese e compile novamente.',
    confirmation: 'javac Main.java termina sem diagnóstico e Main.class é atualizado.'
  },
  {
    id: 'brace',
    label: 'Chave ausente',
    file: 'Main.java',
    code: ['public class Main {', '    public static void main(String[] args) {', '        System.out.println("Olá");', '    }'].join('\n'),
    line: 4,
    output: "Main.java:4: error: reached end of file while parsing\n    }\n     ^\n1 error",
    read: 'O arquivo terminou enquanto o compilador ainda esperava fechar a classe.',
    fix: 'Feche a classe com uma segunda chave e recompile.',
    confirmation: 'O número de chaves de abertura e fechamento volta a representar a estrutura.'
  },
  {
    id: 'filename',
    label: 'Classe × arquivo',
    file: 'Main.java',
    code: ['public class Programa {', '    public static void main(String[] args) {', '        System.out.println("Olá");', '    }', '}'].join('\n'),
    line: 1,
    output: 'Main.java:1: error: class Programa is public, should be declared in a file named Programa.java\npublic class Programa {\n       ^\n1 error',
    read: 'Uma classe pública Programa precisa estar em Programa.java.',
    fix: 'Renomeie o arquivo para Programa.java ou a classe para Main.',
    confirmation: 'Nome público, arquivo e comando passam a usar a mesma identidade.'
  },
  {
    id: 'folder',
    label: 'Pasta errada',
    file: 'terminal',
    code: MAIN_CODE,
    line: 0,
    output: 'error: file not found: Main.java\nUsage: javac <options> <source files>',
    read: 'javac não encontrou o arquivo indicado na pasta atual; ainda nem analisou o código.',
    fix: 'Execute pwd e ls, navegue até a pasta que contém Main.java e tente novamente.',
    confirmation: 'ls mostra Main.java antes do novo javac.'
  }
];

function CompilerClinic() {
  const [selected, setSelected] = useState('semicolon');
  const [fixed, setFixed] = useState(false);
  const current = COMPILER_CASES.find(item => item.id === selected) || COMPILER_CASES[0];
  const fixedCode = current.id === 'filename' ? current.code.replace('Programa', 'Main') : current.id === 'brace' ? current.code + '\n}' : current.id === 'semicolon' ? current.code.replace('println("Olá")', 'println("Olá");') : current.code;
  const choose = id => { setSelected(id); setFixed(false); };
  return <section className="cmp-compiler-clinic"><div role="tablist">{COMPILER_CASES.map(item => <button type="button" role="tab" aria-selected={selected === item.id} className={selected === item.id ? 'active' : ''} onClick={() => choose(item.id)} key={item.id}><AlertTriangle size={16} />{item.label}</button>)}</div><div className="cmp-clinic-stage"><CodeWindow language="java" title={current.file} errorLine={!fixed ? current.line : 0}>{fixed ? fixedCode : current.code}</CodeWindow><div className="cmp-diagnostic"><header><Terminal size={16} /> javac Main.java <span>{fixed ? 'corrigido' : 'diagnóstico'}</span></header><pre>{fixed ? 'Sem diagnóstico. Confirme o arquivo gerado com ls.' : current.output}</pre></div><div className="cmp-reading"><section><span>1</span><strong>Leia</strong><p>{current.read}</p></section><section><span>2</span><strong>Corrija</strong><p>{current.fix}</p></section><section><span>3</span><strong>Confirme</strong><p>{current.confirmation}</p></section></div><button type="button" className={fixed ? 'fixed' : ''} onClick={() => setFixed(value => !value)}>{fixed ? <><RotateCcw size={16} /> Reproduzir o erro</> : <><Wrench size={16} /> Aplicar correção mínima</>}</button></div></section>;
}

function ErrorComparator() {
  const [mode, setMode] = useState('compile');
  const compile = mode === 'compile';
  return <section className="cmp-error-comparator"><div role="tablist"><button type="button" role="tab" aria-selected={compile} className={compile ? 'active' : ''} onClick={() => setMode('compile')}>Erro de compilação</button><button type="button" role="tab" aria-selected={!compile} className={!compile ? 'active' : ''} onClick={() => setMode('runtime')}>Erro de execução</button></div><div role="tabpanel"><CodeWindow language="java" title="Main.java" errorLine={compile ? 3 : 0}>{compile ? BAD_SEMICOLON_CODE : RUNTIME_ERROR_CODE}</CodeWindow><article><header>{compile ? <Wrench size={22} /> : <Cpu size={22} />}<div><small>O erro nasce em</small><h3>{compile ? 'javac Main.java' : 'java Main'}</h3></div></header><div className="cmp-command-chain"><span className="failed">{compile ? 'javac Main.java ✕' : 'javac Main.java ✓'}</span><ArrowRight /><span className={!compile ? 'failed' : 'blocked'}>{compile ? 'java Main nem começa' : 'java Main ✕'}</span></div><pre>{compile ? "error: ';' expected\n1 error" : 'Exception in thread "main" java.lang.ArithmeticException: / by zero\n    at Main.main(Main.java:3)'}</pre><p>{compile ? 'Nenhum bytecode novo é produzido a partir desta fonte inválida.' : 'O código virou bytecode, foi carregado e falhou enquanto executava a divisão inteira.'}</p></article></div></section>;
}

function StaleTimeline() {
  const [stage, setStage] = useState(0);
  const states = [
    { title: '09:00 · tudo alinhado', source: 'Mensagem A', bytecode: 'Mensagem A', output: 'Mensagem A', verdict: 'Fonte e classe representam a mesma versão.' },
    { title: '09:05 · fonte alterada', source: 'Mensagem B', bytecode: 'Mensagem A', output: 'Mensagem A', verdict: 'Salvar o .java não recompila no fluxo manual.' },
    { title: '09:06 · javac executado', source: 'Mensagem B', bytecode: 'Mensagem B', output: 'Mensagem B', verdict: 'A nova compilação sincronizou bytecode e fonte.' }
  ];
  const current = states[stage];
  return <section className="cmp-stale-timeline"><header><RefreshCw size={19} /><strong>Experimento do bytecode antigo</strong><span>{current.title}</span></header><div><article className="source"><FileText size={22} /><small>Main.java</small><strong>{current.source}</strong></article><ArrowRight /><article className={stage === 1 ? 'stale' : 'bytecode'}><Binary size={22} /><small>Main.class</small><strong>{current.bytecode}</strong></article><ArrowRight /><article className="output"><MonitorPlay size={22} /><small>java Main</small><strong>{current.output}</strong></article></div><footer><button type="button" disabled={stage === 0} onClick={() => setStage(value => value - 1)}><ArrowLeft size={15} /> Voltar</button><p>{current.verdict}</p><button type="button" disabled={stage === states.length - 1} onClick={() => setStage(value => value + 1)}>{stage === 1 ? 'Executar javac' : 'Avançar'} <ArrowRight size={15} /></button></footer></section>;
}

function MainAnatomy() {
  const [selected, setSelected] = useState('main');
  const parts = {
    public: { token: 'public', role: 'Acesso', explanation: 'Permite que o launcher acesse o método de fora da classe.', failure: 'Sem public, esta assinatura não é reconhecida como ponto de entrada clássico.' },
    static: { token: 'static', role: 'Chamada sem objeto', explanation: 'Permite chamar main sem construir uma instância de Main primeiro.', failure: 'Sem static, o launcher não tem o ponto de entrada esperado.' },
    void: { token: 'void', role: 'Retorno', explanation: 'Declara que o método não devolve um valor ao chamador.', failure: 'Outro retorno não corresponde à assinatura de entrada.' },
    main: { token: 'main', role: 'Nome', explanation: 'É o nome especial procurado para iniciar a aplicação pela classe.', failure: 'Uma classe com executar() pode compilar, mas java Main não encontra o main correto.' },
    args: { token: 'String[] args', role: 'Parâmetro', explanation: 'Recebe os argumentos escritos depois do nome da classe no terminal.', failure: 'Outro formato de parâmetro não corresponde à assinatura clássica.' }
  };
  const current = parts[selected];
  return <section className="cmp-main-anatomy"><div className="cmp-signature" role="tablist"><span>public class Main {'{'}</span><div>{Object.entries(parts).map(([id, item]) => <button type="button" role="tab" aria-selected={selected === id} className={selected === id ? 'active' : ''} onClick={() => setSelected(id)} key={id}>{item.token}</button>)}<span>{' {'}</span></div><span>    // a execução começa aqui</span><span>{'}'}</span></div><article role="tabpanel"><header><Braces size={24} /><div><small>{current.role}</small><h3>{current.token}</h3></div></header><p>{current.explanation}</p><footer><AlertTriangle size={16} /><span>{current.failure}</span></footer></article></section>;
}

function DependencyLab() {
  const [strategy, setStrategy] = useState('explicit');
  const [compiled, setCompiled] = useState(false);
  const strategies = {
    explicit: { command: 'javac Mensagem.java Programa.java', detail: 'Declara as duas fontes de forma explícita. É a leitura mais clara para começar.', output: ['Mensagem.class', 'Programa.class'] },
    wildcard: { command: 'javac *.java', detail: 'O PowerShell expande todos os .java da pasta. Útil em laboratório pequeno, não é um build profissional.', output: ['Mensagem.class', 'Programa.class'] },
    implicit: { command: 'javac Programa.java', detail: 'javac pode localizar Mensagem.java porque Programa a referencia e a fonte está no caminho pesquisado.', output: ['Mensagem.class', 'Programa.class'] }
  };
  const current = strategies[strategy];
  const choose = value => { setStrategy(value); setCompiled(false); };
  return <section className="cmp-dependency-lab"><div className="cmp-dependency-graph"><article><FileText size={22} /><strong>Programa.java</strong><code>Mensagem.obterTexto()</code></article><div><ArrowRight size={24} /><span>depende de</span></div><article><FileText size={22} /><strong>Mensagem.java</strong><code>return "Texto..."</code></article></div><div className="cmp-two-editors"><CodeWindow language="java" title="Mensagem.java">{MENSAGEM_CODE}</CodeWindow><CodeWindow language="java" title="Programa.java">{PROGRAMA_CODE}</CodeWindow></div><div className="cmp-strategy"><div role="tablist">{Object.keys(strategies).map(id => <button type="button" role="tab" aria-selected={strategy === id} className={strategy === id ? 'active' : ''} onClick={() => choose(id)} key={id}>{id === 'explicit' ? 'Lista explícita' : id === 'wildcard' ? '*.java' : 'Dependência implícita'}</button>)}</div><article><CodeWindow language="powershell" title="Compilação escolhida">{current.command}</CodeWindow><p>{current.detail}</p><button type="button" onClick={() => setCompiled(true)} disabled={compiled}><Play size={16} /> {compiled ? 'Compilado' : 'Compilar'}</button></article></div>{compiled && <div className="cmp-build-result"><section><FolderOpen size={18} /><strong>Arquivos gerados</strong>{current.output.map(file => <span key={file}><Binary size={14} />{file}</span>)}</section><ArrowRight /><section><Terminal size={18} /><strong>java Programa</strong><code>Texto vindo de outra classe.</code></section></div>}</section>;
}

function ClasspathLab() {
  const [stage, setStage] = useState(0);
  const stages = [
    { command: 'mkdir out', title: 'Crie a pasta de saída', tree: 1, result: 'out existe, ainda vazia.', cp: '—' },
    { command: 'javac -d out Mensagem.java Programa.java', title: 'Compile para uma raiz separada', tree: 2, result: 'javac coloca as duas classes dentro de out.', cp: '—' },
    { command: 'java Programa', title: 'Provoque o erro da pasta atual', tree: 2, result: 'Programa.class não está na raiz atual.', cp: 'pasta atual' },
    { command: 'java -cp out Programa', title: 'Declare a raiz das classes', tree: 2, result: 'Texto vindo de outra classe.', cp: 'out' }
  ];
  const current = stages[stage];
  return <section className="cmp-classpath-lab"><div className="cmp-classpath-visual"><div className="cmp-classpath-tree"><span className="root"><FolderOpen size={16} /> compilacao-manual</span><span className="child"><FileText size={14} /> Mensagem.java</span><span className="child"><FileText size={14} /> Programa.java</span>{current.tree >= 1 && <span className="child out"><FolderOpen size={14} /> out</span>}{current.tree >= 2 && <><span className="grandchild"><Binary size={13} /> Mensagem.class</span><span className="grandchild target"><Binary size={13} /> Programa.class</span></>}</div><div className="cmp-locator"><Search size={25} /><strong>java procura Programa</strong><span>raiz pesquisada: <code>{current.cp}</code></span><ArrowDown size={18} /><b className={stage === 3 ? 'found' : stage === 2 ? 'missing' : ''}>{stage === 3 ? 'out/Programa.class encontrado' : stage === 2 ? 'Programa.class não está na raiz' : 'a busca ainda não começou'}</b></div></div><div className="cmp-classpath-controls"><CodeWindow language="powershell" title={current.title}>{current.command}</CodeWindow><article className={stage === 2 ? 'error' : stage === 3 ? 'success' : ''}><small>Resultado observável</small><pre>{stage === 2 ? 'Error: Could not find or load main class Programa\nCaused by: java.lang.ClassNotFoundException: Programa' : current.result}</pre></article><footer><button type="button" disabled={stage === 0} onClick={() => setStage(value => value - 1)}><ArrowLeft size={15} /> Anterior</button><span>Passo {stage + 1} de {stages.length}</span><button type="button" disabled={stage === stages.length - 1} onClick={() => setStage(value => value + 1)}>Avançar <ArrowRight size={15} /></button></footer></div><div className="cmp-classname-rule"><section><strong>javac recebe arquivos</strong><code>javac -d out Programa.java</code></section><ArrowRight /><section><strong>java recebe classe + raiz</strong><code>java -cp out Programa</code></section><footer><AlertTriangle size={16} /> <code>java Programa.class</code> mistura nome de arquivo com nome de classe e está incorreto.</footer></div></section>;
}

function AutomationMap() {
  const [selected, setSelected] = useState('ide');
  const items = {
    ide: { label: 'IntelliJ', icon: Code2, source: 'src/Main.java', compile: 'compilador configurado pelo Project SDK', output: 'out/production/...', launch: 'Run Configuration monta classpath e chama a JVM', risk: 'Botão Run pode esconder SDK, working directory ou classe principal errados.' },
    maven: { label: 'Maven', icon: Package, source: 'src/main/java', compile: 'mvn compile / lifecycle', output: 'target/classes', launch: 'plugin, java -cp ou JAR empacotado', risk: 'Dependência, plugin ou versão do compilador podem quebrar o build.' },
    delivery: { label: 'Entrega', icon: Server, source: 'repositório + dependências', compile: 'testes e build no pipeline', output: 'JAR ou imagem de container', launch: 'java -jar ou processo dentro do container', risk: 'Runtime de produção precisa aceitar o bytecode gerado no build.' },
    domain: { label: 'Sistema real', icon: Layers3, source: 'Cliente, Produto, Serviço, Repositório...', compile: 'muitas classes e bibliotecas resolvidas juntas', output: 'hierarquia de .class', launch: 'uma classe principal inicia o conjunto', risk: 'Classe ausente pode indicar build, pacote, JAR, versão ou classpath incorreto.' }
  };
  const current = items[selected];
  const Icon = current.icon;
  return <section className="cmp-automation-map"><div role="tablist">{Object.entries(items).map(([id, item]) => { const ItemIcon = item.icon; return <button type="button" role="tab" aria-selected={selected === id} className={selected === id ? 'active' : ''} onClick={() => setSelected(id)} key={id}><ItemIcon size={18} />{item.label}</button>; })}</div><article role="tabpanel"><header><Icon size={27} /><h3>{current.label}</h3></header><div className="cmp-automation-flow"><section><small>Fonte</small><strong>{current.source}</strong></section><ArrowRight /><section><small>Compilar</small><strong>{current.compile}</strong></section><ArrowRight /><section><small>Saída</small><strong>{current.output}</strong></section><ArrowRight /><section><small>Executar</small><strong>{current.launch}</strong></section></div><footer><AlertTriangle size={16} /><span><strong>O que investigar:</strong> {current.risk}</span></footer></article></section>;
}

function GitBoundary() {
  const ignore = ['*.class', 'out/', 'target/'].join('\n');
  return <section className="cmp-git-boundary"><article><header><GitBranch size={19} /><strong>Versionar: trabalho humano</strong></header><span><FileText size={15} /> Main.java</span><span><FileText size={15} /> Mensagem.java</span><span><FileText size={15} /> Programa.java</span><p>Fonte registra decisões e deve ser preservada.</p></article><article className="generated"><header><RefreshCw size={19} /><strong>Ignorar: resultado recriável</strong></header><span><Binary size={15} /> Main.class</span><span><Folder size={15} /> out/</span><span><Folder size={15} /> target/</span><p>Apague e gere novamente com o build.</p></article><CodeWindow language="gitignore" title=".gitignore">{ignore}</CodeWindow></section>;
}

const FINAL_CASES = [
  { symptom: 'file not found: Main.java', phase: 'Antes da compilação', inspect: 'pwd; ls', fix: 'Entre na pasta correta ou corrija o nome.', confirm: 'ls mostra Main.java e javac passa a ler a fonte.' },
  { symptom: "error: ';' expected", phase: 'Compilação', inspect: 'Leia arquivo, linha, coluna e entorno.', fix: 'Corrija a instrução e recompile.', confirm: 'javac termina sem diagnóstico; .class é atualizado.' },
  { symptom: 'class Programa is public...', phase: 'Compilação', inspect: 'Compare classe pública e nome do arquivo.', fix: 'Alinhe Programa com Programa.java.', confirm: 'O artefato Programa.class nasce.' },
  { symptom: 'Could not find or load main class', phase: 'Localização', inspect: 'ls; confira nome e -cp.', fix: 'Aponte a raiz correta: java -cp out Programa.', confirm: 'O método main começa a executar.' },
  { symptom: 'Main method not found', phase: 'Inicialização', inspect: 'Leia a assinatura existente na classe.', fix: 'Use public static void main(String[] args).', confirm: 'java NomeDaClasse chama o ponto de entrada.' },
  { symptom: 'ArithmeticException: / by zero', phase: 'Execução', inspect: 'Leia exceção e primeira linha do seu código.', fix: 'Proteja ou corrija os dados/divisor.', confirm: 'A nova execução termina com o resultado esperado.' },
  { symptom: 'Mudei a mensagem, mas saiu a antiga', phase: 'Build desatualizado', inspect: 'Compare fonte, .class e comando executado.', fix: 'Recompile a fonte correta.', confirm: 'A saída representa a versão salva.' },
  { symptom: 'java Main.class', phase: 'Comando incorreto', inspect: 'Separe arquivo de classe.', fix: 'Use java Main.', confirm: 'O launcher procura a classe Main, não um nome terminado em .class.' }
];

function FinalClinic() {
  const [selected, setSelected] = useState(3);
  const current = FINAL_CASES[selected];
  return <section className="cmp-final-clinic"><div role="tablist">{FINAL_CASES.map((item, index) => <button type="button" role="tab" aria-selected={selected === index} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={item.symptom}><span>{index + 1}</span>{item.symptom}</button>)}</div><article role="tabpanel"><header><BookOpenCheck size={25} /><div><small>Fase provável</small><h3>{current.phase}</h3></div></header><blockquote>{current.symptom}</blockquote><div><section><Search size={17} /><strong>Inspecione</strong><p>{current.inspect}</p></section><section><Wrench size={17} /><strong>Corrija</strong><p>{current.fix}</p></section><section><CheckCircle2 size={17} /><strong>Confirme</strong><p>{current.confirm}</p></section></div></article></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'phaseMap') return <PhaseMap />;
  if (block.type === 'manualLab') return <ManualLab />;
  if (block.type === 'compilerClinic') return <CompilerClinic />;
  if (block.type === 'errorComparator') return <ErrorComparator />;
  if (block.type === 'staleTimeline') return <StaleTimeline />;
  if (block.type === 'mainAnatomy') return <MainAnatomy />;
  if (block.type === 'dependencyLab') return <DependencyLab />;
  if (block.type === 'classpathLab') return <ClasspathLab />;
  if (block.type === 'automationMap') return <AutomationMap />;
  if (block.type === 'gitBoundary') return <GitBoundary />;
  if (block.type === 'finalClinic') return <FinalClinic />;
  if (block.type === 'result') return <section className="guided-result"><h3><ClipboardCheck size={20} /> {block.title}</h3><ul>{block.items.map(item => <li key={item}><CheckCircle2 size={16} /> {item}</li>)}</ul></section>;
  if (block.type === 'note') {
    const Icon = block.tone === 'warning' || block.tone === 'danger' ? AlertTriangle : Lightbulb;
    return <aside className={'guided-note ' + (block.tone || 'info')}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>;
  }
  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Compass size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  if (block.type === 'diary') return <div className="guided-file cmp-diary"><div className="guided-file-title"><FileCode2 size={17} /> docs/compilacao-manual.md <CopyButton value={DIARY} label="Copiar diário" /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '20px', background: '#101827', fontSize: '.84rem', lineHeight: 1.7 }}>{DIARY}</SyntaxHighlighter></div>;
  return null;
}

export default function GuidedManualCompilationLesson006({
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

  return <article className="guided-git-lesson guided-java-platform-lesson guided-manual-compilation-lesson">
    <header className="guided-hero">
      <div className="guided-hero-copy"><span className="guided-kicker"><Binary size={17} /> Oficina de compilação Java</span><p className="guided-sequence">006 · M0.06</p><h1>Do fonte ao bytecode, com evidências</h1><p>Compile uma e duas classes, leia erros reais, controle a pasta de saída e mostre à JVM exatamente onde procurar.</p></div>
      <div className="guided-hero-status"><Wrench size={42} /><strong>{progress}%</strong><span>{completedLabel}</span></div>
      <div className="guided-progress-track" aria-label={'Progresso: ' + progress + '%'}><span style={{ width: progress + '%' }} /></div>
    </header>

    <GuidedLessonFacts ariaLabel="Resultado da aula" items={[{ value: 4, label: 'fases diagnosticáveis' }, { value: 2, label: 'classes colaborando' }, { value: 1, label: 'classpath explícito' }]} />

    <div className="guided-layout">
      <nav className="guided-step-nav" aria-label="Etapas da aula 006"><div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>{steps.map((step, index) => <button type="button" key={step.id} className={(index === activeIndex ? 'active ' : '') + (completedStepIds.has(step.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}</nav>
      <main className="guided-step-content"><div className="guided-step-heading"><span>{activeStep.eyebrow} · {activeStep.duration}</span><h2>{activeStep.title}</h2></div><div className="guided-blocks">{activeStep.blocks.map((block, index) => <ContentBlock block={block} key={activeStep.id + '-' + block.type + '-' + index} />)}</div>
        <div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (activeStepComplete ? 'undo' : 'complete')} onClick={toggleActiveStep}>{activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><Check size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div></div>
        {allStepsComplete && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>{lessonComplete ? 'Compilação registrada' : 'Laboratório concluído'}</h3><p>{lessonComplete ? 'Etapas, práticas e conclusão geral estão registradas.' : 'Conclua a aula para liberar o laboratório do IntelliJ.'}</p></div><button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}
      </main>
    </div>
    <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 005</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsComplete ? 'ready' : '')}>{lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : completedStepIds.size + ' de ' + steps.length + ' etapas'}</strong><small>{lessonComplete ? 'Build manual documentado' : allStepsComplete ? 'Use o botão acima' : 'Compile, provoque e diagnostique'}</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas e a aula para avançar' : 'Abrir a experiência do IntelliJ'}>Aula 007 <ArrowRight size={17} /></button></footer>
  </article>;
}
