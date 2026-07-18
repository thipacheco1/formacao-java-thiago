import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Boxes,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Code2,
  Copy,
  Cpu,
  FileCode2,
  Flame,
  FolderTree,
  Gauge,
  Lightbulb,
  ListChecks,
  Package,
  Play,
  RotateCcw,
  Server,
  Sparkles,
  Terminal,
  Wrench,
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedJvmBytecodeLesson.css';

const STORAGE_KEY = 'guided-jvm-bytecode-lesson-062-progress';

const MAIN_PROGRAM = `public class CalculadoraBytecode {
    public static void main(String[] args) {
        int primeiro = 10;
        int segundo = 20;
        int resultado = somar(primeiro, segundo);

        System.out.println("Resultado: " + resultado);
    }

    public static int somar(int primeiro, int segundo) {
        return primeiro + segundo;
    }
}`;

const JAVAP_OUTPUT = `Compiled from "CalculadoraBytecode.java"
public class CalculadoraBytecode {
  public static void main(java.lang.String[]);
    Code:
       0: bipush        10
       3: bipush        20
       6: invokestatic  #7   // Method somar:(II)I
       9: istore_3
      10: getstatic     #13  // Field System.out
      13: iload_3
      14: invokedynamic #19  // makeConcatWithConstants
      19: invokevirtual #23  // Method PrintStream.println
      22: return

  public static int somar(int, int);
    Code:
       0: iload_0
       1: iload_1
       2: iadd
       3: ireturn
}`;

const TWO_CLASSES = `// Mensagem.java
public class Mensagem {
    public static void exibir() {
        System.out.println("Mensagem carregada por outra classe.");
    }
}

// ProgramaComDuasClasses.java
public class ProgramaComDuasClasses {
    public static void main(String[] args) {
        Mensagem.exibir();
    }
}`;

const LOOP_PROGRAM = `public class LoopQuente {
    public static void main(String[] args) {
        long soma = 0L;

        for (int indice = 0; indice < 10_000_000; indice++) {
            soma += indice;
        }

        System.out.println("Soma: " + soma);
    }
}`;

const EVIDENCE = `# Aula 062 — JVM, bytecode e execução

- [ ] Provei o nascimento do arquivo .class
- [ ] Executei a classe sem extensão
- [ ] Inspecionei main e somar com javap -c
- [ ] Diferenciei falha do javac e falha da JVM
- [ ] Provoquei main ausente e classe ausente
- [ ] Expliquei classloader e classpath
- [ ] Registrei a nuance de java Main.java
- [ ] Expliquei portabilidade e compatibilidade de versão
- [ ] Relacionei interpretação, código quente e JIT
- [ ] Comparei java Main com java -jar app.jar
- [ ] Usei Step Into e comparei com o bytecode
- [ ] Revisei .gitignore, diff e commit`;

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return (
    <button type="button" className="jvm62-copy" onClick={copy}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Copiado' : label}
    </button>
  );
}

function CodePanel({ name, code, language = 'java' }) {
  return (
    <section className="guided-file jvm62-code">
      <div className="guided-file-title">
        <FileCode2 size={16} />
        {name}
        <CopyButton value={code} />
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={language === 'java'}
        wrapLongLines
        customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}
      >
        {code}
      </SyntaxHighlighter>
    </section>
  );
}

const PIPELINE = [
  { name: 'CalculadoraBytecode.java', role: 'fonte legível', tool: 'javac', evidence: 'arquivo escrito por você' },
  { name: 'CalculadoraBytecode.class', role: 'bytecode binário', tool: 'java', evidence: 'artefato criado pelo compilador' },
  { name: 'JVM', role: 'runtime ativo', tool: 'classloader', evidence: 'classe localizada, verificada e carregada' },
  { name: 'main', role: 'ponto de entrada', tool: 'execução', evidence: 'Resultado: 30' },
];

function PipelineLab() {
  const [stage, setStage] = useState(0);
  const current = PIPELINE[stage];
  return (
    <section className="jvm62-pipeline-lab">
      <div className="jvm62-pipeline" role="img" aria-label="Fluxo do código-fonte até a saída do programa">
        {PIPELINE.map((item, index) => (
          <React.Fragment key={item.name}>
            <button
              type="button"
              className={index === stage ? 'active' : index < stage ? 'visited' : ''}
              onClick={() => setStage(index)}
            >
              <span>{index + 1}</span>
              <strong>{item.name}</strong>
              <small>{item.role}</small>
            </button>
            {index < PIPELINE.length - 1 && <ChevronRight aria-hidden="true" />}
          </React.Fragment>
        ))}
      </div>
      <div className="jvm62-stage-detail" aria-live="polite">
        <div><small>Ferramenta ou mecanismo</small><strong>{current.tool}</strong></div>
        <div><small>Evidência que você procura</small><strong>{current.evidence}</strong></div>
      </div>
      <aside className="guided-note info">
        <Lightbulb size={20} />
        <div>
          <strong>Fluxo clássico e explícito</strong>
          <p><code>java Arquivo.java</code> existe em Java moderno para programas-fonte simples. Aqui usamos <code>javac</code> seguido de <code>java NomeDaClasse</code> porque queremos enxergar o <code>.class</code> e separar compilação de execução.</p>
        </div>
      </aside>
    </section>
  );
}

const TOOLKIT = [
  ['JDK', 'Desenvolver', 'Inclui javac, java, javap, jar, javadoc, jshell e ferramentas de diagnóstico.'],
  ['Runtime / JRE', 'Executar', 'Conceito do ambiente de execução: JVM e bibliotecas. Distribuições modernas podem não entregar um JRE separado.'],
  ['JVM', 'Executar bytecode', 'Carrega e verifica classes, executa instruções, gerencia memória, threads, exceções, GC e otimizações JIT.'],
  ['javac', '.java → .class', 'Compila e rejeita erros que impedem a criação de bytecode válido.'],
  ['java', 'Iniciar o runtime', 'Localiza a classe informada, inicia a JVM e procura um ponto de entrada compatível.'],
  ['javap', 'Inspecionar classes', 'Mostra estrutura compilada; com -c, desmonta instruções do bytecode em forma legível.'],
];

function ToolkitLab() {
  const [selected, setSelected] = useState(0);
  const item = TOOLKIT[selected];
  return (
    <section className="jvm62-toolkit">
      <div className="jvm62-tool-list">
        {TOOLKIT.map((tool, index) => (
          <button type="button" key={tool[0]} className={index === selected ? 'active' : ''} onClick={() => setSelected(index)}>
            <strong>{tool[0]}</strong><small>{tool[1]}</small>
          </button>
        ))}
      </div>
      <article>
        <span>Responsabilidade</span>
        <h3>{item[0]} — {item[1]}</h3>
        <p>{item[2]}</p>
        <div className="jvm62-versions">
          <code>java -version</code>
          <code>javac -version</code>
        </div>
        <p className="jvm62-caption">As versões precisam ser compatíveis. Bytecode criado para uma versão mais nova pode não executar em uma JVM antiga.</p>
      </article>
    </section>
  );
}

const TERMINAL_RUNS = [
  {
    label: '1 · Criar e compilar',
    command: 'javac CalculadoraBytecode.java',
    output: '(nenhuma saída quando a compilação termina com sucesso)',
    files: ['CalculadoraBytecode.java', 'CalculadoraBytecode.class'],
    meaning: 'O silêncio é sucesso porque o .class apareceu. Confirme com dir.',
  },
  {
    label: '2 · Executar',
    command: 'java CalculadoraBytecode',
    output: 'Resultado: 30',
    files: ['CalculadoraBytecode.java', 'CalculadoraBytecode.class'],
    meaning: 'java recebeu o nome binário da classe, sem .class, e a JVM encontrou main.',
  },
  {
    label: '3 · Inspecionar',
    command: 'javap -c CalculadoraBytecode',
    output: 'main → invokestatic somar → invokevirtual println → return',
    files: ['CalculadoraBytecode.java', 'CalculadoraBytecode.class'],
    meaning: 'O método Java virou instruções intermediárias; javap não recupera o fonte original.',
  },
  {
    label: '4 · Alterar sem compilar',
    command: 'java CalculadoraBytecode',
    output: 'Resultado: 30  ← ainda é o .class antigo',
    files: ['CalculadoraBytecode.java (alterado)', 'CalculadoraBytecode.class (antigo)'],
    meaning: 'Editar .java não modifica o bytecode. Recompile e execute novamente.',
  },
];

function TerminalLab() {
  const [selected, setSelected] = useState(0);
  const run = TERMINAL_RUNS[selected];
  return (
    <section className="jvm62-terminal-lab">
      <div className="jvm62-run-tabs">
        {TERMINAL_RUNS.map((item, index) => (
          <button type="button" key={item.label} className={index === selected ? 'active' : ''} onClick={() => setSelected(index)}>{item.label}</button>
        ))}
      </div>
      <div className="jvm62-workbench">
        <div className="jvm62-tree">
          <header><FolderTree size={15} />Arquivos</header>
          {run.files.map(file => <span key={file}><FileCode2 size={14} />{file}</span>)}
        </div>
        <div className="jvm62-terminal">
          <header><Terminal size={15} />PowerShell</header>
          <pre><b>PS C:\labs\m2\aula-062&gt;</b> {run.command}{'\n'}<span>{run.output}</span></pre>
        </div>
      </div>
      <p className="jvm62-evidence"><CheckCircle2 size={18} /><strong>Como interpretar:</strong> {run.meaning}</p>
      <CodePanel name="CalculadoraBytecode.java" code={MAIN_PROGRAM} />
    </section>
  );
}

const BYTECODE_ROWS = [
  ['bipush 10 / 20', 'coloca os dois inteiros na pilha de operandos', 'int primeiro = 10; int segundo = 20;'],
  ['invokestatic somar', 'chama o método estático com dois inteiros', 'somar(primeiro, segundo)'],
  ['iload_0 / iload_1', 'carrega os parâmetros do método', 'primeiro e segundo'],
  ['iadd', 'soma os dois valores inteiros', 'primeiro + segundo'],
  ['ireturn', 'devolve um int ao chamador', 'return ...'],
  ['invokevirtual println', 'chama println no objeto System.out', 'System.out.println(...)'],
  ['return', 'encerra main, que retorna void', 'fim do método main'],
];

function BytecodeLab() {
  const [selected, setSelected] = useState(0);
  const row = BYTECODE_ROWS[selected];
  return (
    <section className="jvm62-bytecode-lab">
      <div className="jvm62-bytecode-grid">
        <CodePanel name="saída aproximada · javap -c CalculadoraBytecode" code={JAVAP_OUTPUT} language="text" />
        <div className="jvm62-instruction-list">
          {BYTECODE_ROWS.map((item, index) => (
            <button type="button" key={item[0]} className={index === selected ? 'active' : ''} onClick={() => setSelected(index)}>
              <code>{item[0]}</code><span>{item[2]}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="jvm62-stage-detail" aria-live="polite">
        <div><small>Instrução observada</small><strong>{row[0]}</strong></div>
        <div><small>Leitura conceitual, sem decorar opcode</small><strong>{row[1]}</strong></div>
      </div>
      <p className="jvm62-caption">Índices de pool constante e algumas instruções podem variar conforme a versão do JDK. O contrato importante é reconhecer carregamento, chamada, operação e retorno.</p>
    </section>
  );
}

const LOADING_STAGES = [
  ['Solicitação', 'java ProgramaComDuasClasses pede a classe inicial.'],
  ['Localização', 'O classloader consulta o classpath, que inclui o diretório atual neste laboratório.'],
  ['Carregamento', 'ProgramaComDuasClasses.class entra no runtime e referencia Mensagem.'],
  ['Dependência', 'Mensagem.class também precisa ser localizada e carregada.'],
  ['Entrada', 'A JVM encontra public static void main(String[] args).'],
  ['Execução', 'Mensagem.exibir produz a saída no console.'],
];

function ClassLoadingLab() {
  const [stage, setStage] = useState(0);
  return (
    <section className="jvm62-loading-lab">
      <div className="jvm62-loading-map">
        {LOADING_STAGES.map((item, index) => (
          <button type="button" key={item[0]} className={index === stage ? 'active' : index < stage ? 'visited' : ''} onClick={() => setStage(index)}>
            <span>{index + 1}</span><strong>{item[0]}</strong>
          </button>
        ))}
      </div>
      <article aria-live="polite">
        <FolderTree size={28} />
        <h3>{LOADING_STAGES[stage][0]}</h3>
        <p>{LOADING_STAGES[stage][1]}</p>
        <code>java -cp . ProgramaComDuasClasses</code>
      </article>
      <CodePanel name="duas classes · salve cada public class em seu arquivo" code={TWO_CLASSES} />
      <aside className="guided-note warning">
        <AlertTriangle size={20} />
        <div><strong>Apague Mensagem.class depois de compilar</strong><p>A classe inicial ainda pode existir, mas a execução falha quando a JVM tenta resolver a dependência. Isso aproxima o diagnóstico de JAR ausente, pacote incorreto ou classpath incompleto.</p></div>
      </aside>
    </section>
  );
}

const FAILURE_CASES = [
  {
    label: 'Compilação', command: 'javac ErroCompilacao.java',
    output: "ErroCompilacao.java:3: error: ';' expected", phase: 'javac',
    diagnosis: 'O compilador não conseguiu produzir bytecode válido. Corrija o fonte antes de usar java.',
  },
  {
    label: 'Execução', command: 'java ErroExecucao',
    output: 'Exception in thread "main" java.lang.ArithmeticException: / by zero', phase: 'JVM',
    diagnosis: 'O .class existe e main começou; a falha ocorreu enquanto uma instrução era executada.',
  },
  {
    label: 'main ausente', command: 'java SemMain',
    output: 'Error: Main method not found in class SemMain', phase: 'launcher / JVM',
    diagnosis: 'A classe pode compilar como biblioteca, mas não possui o ponto de entrada solicitado.',
  },
  {
    label: 'Classe ausente', command: 'java ProgramaComDuasClasses',
    output: 'java.lang.NoClassDefFoundError: Mensagem', phase: 'classloading',
    diagnosis: 'A classe inicial foi encontrada, mas uma dependência necessária não está disponível.',
  },
  {
    label: 'Versão incompatível', command: 'java Aplicacao',
    output: 'UnsupportedClassVersionError: ... class file version ...', phase: 'verificação / runtime',
    diagnosis: 'O bytecode foi criado para uma versão mais nova do que a JVM que tenta executá-lo.',
  },
];

function FailureLab() {
  const [selected, setSelected] = useState(0);
  const item = FAILURE_CASES[selected];
  return (
    <section className="jvm62-failure-lab">
      <div className="jvm62-failure-tabs">
        {FAILURE_CASES.map((entry, index) => <button type="button" key={entry.label} className={index === selected ? 'active' : ''} onClick={() => setSelected(index)}>{entry.label}</button>)}
      </div>
      <div className="jvm62-terminal danger">
        <header><AlertTriangle size={15} />Falha intencional · fase: {item.phase}</header>
        <pre><b>PS&gt;</b> {item.command}{'\n'}<span>{item.output}</span></pre>
      </div>
      <p className="jvm62-evidence"><Wrench size={18} /><strong>Diagnóstico:</strong> {item.diagnosis}</p>
      <div className="jvm62-rule-grid">
        <article><strong>Nome público</strong><p><code>public class Main</code> deve estar em <code>Main.java</code>.</p></article>
        <article><strong>Classe no comando</strong><p>Use <code>java Main</code>, nunca <code>java Main.class</code>.</p></article>
        <article><strong>Bytecode atual</strong><p>Alterou o <code>.java</code>? Execute <code>javac</code> novamente.</p></article>
      </div>
    </section>
  );
}

function RuntimeLab() {
  const [mode, setMode] = useState('cold');
  const hot = mode === 'hot';
  return (
    <section className="jvm62-runtime-lab">
      <div className="jvm62-runtime-controls">
        <button type="button" className={!hot ? 'active' : ''} onClick={() => setMode('cold')}><Play size={16} />Início da aplicação</button>
        <button type="button" className={hot ? 'active' : ''} onClick={() => setMode('hot')}><Flame size={16} />Trecho muito executado</button>
      </div>
      <div className="jvm62-runtime-map">
        <article className="portable"><Boxes size={28} /><strong>Bytecode portável</strong><span>O mesmo .class pode chegar a runtimes compatíveis.</span></article>
        <ChevronRight />
        <article className={hot ? '' : 'active'}><Cpu size={28} /><strong>Interpretação</strong><span>A JVM pode começar executando instruções intermediárias.</span></article>
        <ChevronRight />
        <article className={hot ? 'active hot' : ''}><Gauge size={28} /><strong>JIT</strong><span>Trechos quentes podem ser compilados e otimizados em runtime.</span></article>
      </div>
      <div className="jvm62-stage-detail" aria-live="polite">
        <div><small>Estado selecionado</small><strong>{hot ? 'Método ou loop observado muitas vezes' : 'Aplicação acabou de iniciar'}</strong></div>
        <div><small>Conclusão segura</small><strong>{hot ? 'A JVM pode otimizar; isso não prova performance sem benchmark.' : 'Java não é apenas “interpretado” nem apenas compilado antecipadamente.'}</strong></div>
      </div>
      <CodePanel name="LoopQuente.java · exemplo conceitual, não benchmark" code={LOOP_PROGRAM} />
      <aside className="guided-note warning"><AlertTriangle size={20} /><div><strong>Não cronometre com conclusões rápidas</strong><p><code>System.currentTimeMillis()</code> em uma única execução não é benchmark profissional. Aquecimento, otimizações, GC e ambiente alteram o resultado; ferramentas próprias virão depois.</p></div></aside>
    </section>
  );
}

function BackendLab() {
  return (
    <section className="jvm62-backend-lab">
      <div className="jvm62-backend-flow" role="img" aria-label="Relação entre classes, JAR, JVM, Spring Boot e servidor">
        <article><FileCode2 size={27} /><strong>classes + recursos</strong><span>bytecode, metadados e configuração</span></article>
        <ChevronRight />
        <article><Package size={27} /><strong>minha-api.jar</strong><span>artefato empacotado para distribuição</span></article>
        <ChevronRight />
        <article><Cpu size={27} /><strong>java -jar</strong><span>inicia a JVM e abre o artefato</span></article>
        <ChevronRight />
        <article><Server size={27} /><strong>Spring Boot</strong><span>carrega classes, cria contexto e sobe servidor</span></article>
      </div>
      <div className="jvm62-command-compare">
        <article><small>Laboratório</small><code>java CalculadoraBytecode</code><p>Executa uma classe cujo <code>main</code> está no classpath.</p></article>
        <article><small>Aplicação empacotada</small><code>java -jar minha-api.jar</code><p>Executa o artefato usando metadados que indicam como iniciar.</p></article>
      </div>
      <p className="jvm62-evidence"><CheckCircle2 size={18} /><strong>O princípio não mudou:</strong> classes são encontradas, bytecode é carregado e uma JVM executa a aplicação. A escala e o empacotamento mudaram.</p>
    </section>
  );
}

const ERRORS = [
  ['Executar java Main.class', 'A JVM procura uma classe com nome binário incorreto.', 'Use java Main, sem extensão.'],
  ['Achar que .java sempre é executado', 'O fluxo clássico e o modo source-file são confundidos.', 'Pratique javac Main.java e java Main para observar o .class.'],
  ['Editar sem recompilar', 'A saída continua mostrando a versão anterior.', 'Recompile e confirme a data do .class antes de executar.'],
  ['Arquivo e public class divergem', 'javac informa que a classe deveria estar em outro arquivo.', 'Faça o nome do arquivo coincidir exatamente com a classe pública.'],
  ['Misturar fases do erro', 'A correção é tentada na ferramenta errada.', 'Identifique primeiro se falhou em javac, no launcher, no classloading ou dentro de main.'],
  ['Tratar .class como texto', 'O arquivo parece corrompido no editor.', 'Não edite binário; inspecione com javap e regenere pelo fonte.'],
  ['Chamar bytecode de nativo', 'Portabilidade fica inexplicável.', 'Separe bytecode portável de código nativo produzido/consumido no runtime.'],
  ['Dizer que Java é só interpretado', 'A explicação ignora otimizações dinâmicas.', 'Explique interpretação conceitual, observação de código quente e JIT.'],
  ['Ignorar versão do runtime', 'Surge UnsupportedClassVersionError.', 'Compare java -version, javac -version e a versão alvo do build.'],
  ['Ignorar classpath', 'Main ou uma dependência não é encontrada.', 'Confirme diretório, pacote, raiz de classes, JARs e opção -cp.'],
];

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const error = ERRORS[selected];
  return (
    <section className="jvm62-errors">
      <div>
        {ERRORS.map((item, index) => (
          <button type="button" key={item[0]} className={index === selected ? 'active' : ''} onClick={() => setSelected(index)}>
            <span>{index + 1}</span><span className="guided-error-label">{item[0]}</span>
          </button>
        ))}
      </div>
      <article>
        <header><AlertTriangle size={20} /><div><small>CASO {selected + 1} DE 10</small><h3>{error[0]}</h3></div></header>
        <p><strong>Sintoma / causa:</strong> {error[1]}</p>
        <p><Wrench size={16} /><strong>Como corrigir:</strong> {error[2]}</p>
      </article>
    </section>
  );
}

const CHECKS = [
  'dir mostra CalculadoraBytecode.java e CalculadoraBytecode.class',
  'java CalculadoraBytecode imprime Resultado: 30',
  'javap -c mostra main, somar, chamada e retorno',
  'ErroCompilacao falha no javac e não produz artefato válido',
  'ErroExecucao compila e falha somente dentro da JVM',
  'SemMain compila, mas não é executável como aplicação',
  'Sem Mensagem.class, a dependência falha no classloading',
  'A versão de java e javac foi registrada',
  'Step Into entrou em somar e voltou ao main',
  '.class está ignorado e o diff staged contém somente a aula',
];

function DeliveryLab() {
  const [checked, setChecked] = useState([]);
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  return (
    <section className="jvm62-delivery">
      <aside className="guided-note info"><Lightbulb size={20} /><div><strong>Laboratório nominal</strong><p>Crie <code>labs\m2\aula-062-jvm-bytecode-execucao</code>. Digite os exemplos, pare após cada comando, compare a saída e explique em voz alta qual camada acabou de agir.</p></div></aside>
      <div className="jvm62-command-sequence">
        {[
          ['Preparar', 'mkdir labs\\m2\\aula-062-jvm-bytecode-execucao\ncd labs\\m2\\aula-062-jvm-bytecode-execucao'],
          ['Construir e executar', 'javac CalculadoraBytecode.java\ndir\njava CalculadoraBytecode'],
          ['Inspecionar', 'javap CalculadoraBytecode\njavap -c CalculadoraBytecode\njava -version\njavac -version'],
          ['Versionar', 'git status\ngit diff\ngit add labs/m2/aula-062-jvm-bytecode-execucao docs/diario-de-bordo.md\ngit diff --staged\ngit commit -m "Aula 062: pratica JVM bytecode e execucao por baixo"'],
        ].map(item => <article key={item[0]}><header><Terminal size={15} />{item[0]}<CopyButton value={item[1]} /></header><pre>{item[1]}</pre></article>)}
      </div>
      <h3 className="jvm62-subtitle">Checklist de evidências</h3>
      <div className="jvm62-checks">
        {CHECKS.map((item, index) => (
          <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}>
            <span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}
          </button>
        ))}
      </div>
      <section className="guided-challenge">
        <div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio de transferência: duas versões, uma evidência</h3></div>
        <p>Crie <code>Recompilacao.java</code> com “Versão 1”, compile e execute. Troque apenas o fonte para “Versão 2” e prove por que a saída continua antiga. Depois recompile, use <code>javap -c</code>, execute novamente e registre em qual artefato cada versão existia.</p>
        <ul><li>Inclua comandos e saídas reais.</li><li>Explique a diferença entre fonte e artefato.</li><li>Não versione arquivos <code>.class</code>.</li></ul>
      </section>
      <section className="guided-file jvm62-code">
        <div className="guided-file-title"><Code2 size={16} />docs/diario-de-bordo.md<CopyButton value={EVIDENCE} label="Copiar evidências" /></div>
        <SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter>
      </section>
    </section>
  );
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'pipeline') return <PipelineLab />;
  if (block.type === 'toolkit') return <ToolkitLab />;
  if (block.type === 'terminal') return <TerminalLab />;
  if (block.type === 'bytecode') return <BytecodeLab />;
  if (block.type === 'loading') return <ClassLoadingLab />;
  if (block.type === 'failures') return <FailureLab />;
  if (block.type === 'runtime') return <RuntimeLab />;
  if (block.type === 'backend') return <BackendLab />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  return null;
}

const steps = [
  { id: 'pipeline', label: 'Mapa da Execução', duration: '8 min', eyebrow: 'DO FONTE À SAÍDA', title: 'Veja cada fronteira antes de nomear a plataforma', blocks: [{ type: 'lead', text: 'Comece pelo fenômeno observável: um arquivo de texto vira um artefato binário, uma JVM nasce, uma classe é carregada e o main produz saída.' }, { type: 'pipeline' }] },
  { id: 'toolkit', label: 'JDK, Runtime e JVM', duration: '9 min', eyebrow: 'RESPONSABILIDADES', title: 'Separe kit, ambiente, máquina virtual e comandos', blocks: [{ type: 'lead', text: 'Os nomes parecem próximos, mas respondem a perguntas diferentes: com o que desenvolvemos, onde executamos e qual mecanismo entende bytecode.' }, { type: 'toolkit' }] },
  { id: 'artifact', label: 'Fonte e Artefato', duration: '14 min', eyebrow: 'LABORATÓRIO DE TERMINAL', title: 'Compile, prove o .class e detecte bytecode desatualizado', blocks: [{ type: 'lead', text: 'Digite um programa pequeno, rode uma ação por vez e use arquivos e saídas como evidência. Nada precisa parecer mágico.' }, { type: 'terminal' }] },
  { id: 'javap', label: 'Bytecode com javap', duration: '13 min', eyebrow: 'INSPEÇÃO GUIADA', title: 'Ligue linhas Java a instruções sem decorar opcodes', blocks: [{ type: 'lead', text: 'javap -c permite olhar dentro da classe compilada. A leitura aqui é conceitual: carregar, chamar, somar, imprimir e retornar.' }, { type: 'bytecode' }] },
  { id: 'loading', label: 'main, Loader e Classpath', duration: '14 min', eyebrow: 'CARREGAMENTO DE CLASSES', title: 'Siga a JVM enquanto ela encontra a classe e sua dependência', blocks: [{ type: 'lead', text: 'Uma aplicação não começa apenas porque existe um .class: o launcher precisa encontrar a classe, o classloader resolve dependências e a JVM procura main.' }, { type: 'loading' }] },
  { id: 'failures', label: 'Fases da Falha', duration: '12 min', eyebrow: 'DIAGNÓSTICO POR CAMADA', title: 'Descubra quem falhou antes de tentar corrigir', blocks: [{ type: 'lead', text: 'Compare falhas do compilador, do launcher, do carregamento e do programa em execução. O comando que falhou reduz o espaço de investigação.' }, { type: 'failures' }] },
  { id: 'runtime', label: 'Portabilidade e JIT', duration: '11 min', eyebrow: 'RUNTIME ADAPTATIVO', title: 'Entenda bytecode portável, interpretação e código quente', blocks: [{ type: 'lead', text: 'O bytecode cria uma fronteira portável, desde que exista JVM compatível. Durante a execução, a JVM moderna pode observar e otimizar trechos muito usados.' }, { type: 'runtime' }] },
  { id: 'backend', label: 'JAR e Spring Boot', duration: '8 min', eyebrow: 'APLICAÇÃO PROFISSIONAL', title: 'Reconheça a mesma JVM por trás de java -jar', blocks: [{ type: 'lead', text: 'Spring Boot acrescenta muitas classes, recursos e inicialização, mas não abandona o mecanismo que você acabou de provar no terminal.' }, { type: 'backend' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'DEZ DIAGNÓSTICOS', title: 'Corrija os enganos que tornam a execução opaca', blocks: [{ type: 'lead', text: 'Leia o sintoma, identifique a camada e aplique uma correção verificável. Não troque vários elementos do ambiente ao mesmo tempo.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '18 min', eyebrow: 'PRÁTICA, DEBUG E GIT', title: 'Produza evidências suficientes para defender a execução', blocks: [{ type: 'lead', text: 'Execute o laboratório completo, use Step Into em somar, compare o fluxo com javap -c e entregue uma explicação que sobreviva sem esta página aberta.' }, { type: 'delivery' }] },
];

export default function GuidedJvmBytecodeLesson062({
  isCompleted,
  onToggleCompleted,
  onNextLesson,
  onPrevLesson,
  hasNextLesson,
  hasPrevLesson,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef(null);
  const completionNormalizedRef = useRef(false);
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const validIds = new Set(steps.map(step => step.id));
      return new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []);
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps]));
  }, [completedSteps]);

  useEffect(() => {
    if (!completionNormalizedRef.current && isCompleted && completedSteps.size !== steps.length) {
      completionNormalizedRef.current = true;
      onToggleCompleted();
    }
  }, [completedSteps.size, isCompleted, onToggleCompleted]);

  useEffect(() => {
    const activeButton = navRef.current?.querySelector('button.active');
    if (activeButton && window.matchMedia('(max-width: 900px)').matches) {
      activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeIndex]);

  const step = steps[activeIndex];
  const stepDone = completedSteps.has(step.id);
  const allStepsDone = completedSteps.size === steps.length;
  const lessonComplete = isCompleted && allStepsDone;

  const selectStep = index => {
    setActiveIndex(index);
    document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleStep = () => {
    if (stepDone && isCompleted) onToggleCompleted();
    setCompletedSteps(current => {
      const next = new Set(current);
      if (next.has(step.id)) next.delete(step.id);
      else next.add(step.id);
      return next;
    });
  };

  return (
    <article className="guided-git-lesson guided-jvm-bytecode-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker"><Cpu size={17} />Laboratório da plataforma Java</span>
          <p className="guided-sequence">062 · M2.01</p>
          <h1>JVM, bytecode e execução por baixo</h1>
          <p>Faça o caminho do fonte até o runtime ficar visível; depois diagnostique compilação, carregamento, execução e otimização com evidências.</p>
        </div>
        <div className="guided-hero-status">
          <Cpu size={42} />
          <strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong>
          <span>{completedSteps.size} de {steps.length} etapas concluídas</span>
        </div>
      </header>

      <GuidedLessonFacts
        ariaLabel="Resumo da aula 062"
        items={[
          { value: '1 pipeline', label: 'Fonte até runtime' },
          { value: '7 opcodes', label: 'Lidos com intenção' },
          { value: '10 falhas', label: 'Diagnosticadas por camada' },
        ]}
      />

      <div className="guided-layout">
        <nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 062">
          <div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>
          {steps.map((item, index) => (
            <button
              type="button"
              key={item.id}
              className={`${index === activeIndex ? 'active ' : ''}${completedSteps.has(item.id) ? 'done' : ''}`}
              onClick={() => selectStep(index)}
            >
              <span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span>
              <span><strong>{item.label}</strong><small>{item.duration}</small></span>
            </button>
          ))}
        </nav>

        <main className="guided-step-content">
          <div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>
          {step.blocks.map((block, index) => <ContentBlock key={`${block.type}-${index}`} block={block} />)}
          <div className="guided-step-actions">
            <button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button>
            <div className="guided-step-actions-main">
              <button type="button" className={`step-toggle ${stepDone ? 'undo' : 'complete'}`} onClick={toggleStep}>
                {stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}
              </button>
              {activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}
            </div>
          </div>
          {allStepsDone && (
            <section className="guided-finish">
              <CheckCircle2 size={30} />
              <div><h3>Execução explicada por evidências</h3><p>{lessonComplete ? 'Aula concluída e pronta para a próxima fronteira.' : 'Registre a conclusão geral depois de conferir sua entrega.'}</p></div>
              <button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button>
            </section>
          )}
        </main>
      </div>

      <footer className="guided-course-nav">
        <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 061</button>
        <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsDone ? 'ready' : ''}`}>
          <Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : `${completedSteps.size} de ${steps.length} etapas`}</strong><small>Fonte, bytecode, classloading e runtime</small></span>
        </div>
        <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 063<ArrowRight size={17} /></button>
      </footer>
    </article>
  );
}
