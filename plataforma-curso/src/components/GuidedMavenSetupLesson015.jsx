import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Boxes, Check, CheckCircle2, ChevronRight,
  CircleHelp, ClipboardCheck, Clock3, Code2, Copy, Download, ExternalLink,
  FileArchive, FileCheck2, FileCode2, FileText, Folder, FolderOpen, GitCommit,
  HardDriveDownload, Laptop, Lightbulb, ListChecks, PackageCheck, Play, RotateCcw,
  SearchCheck, Settings2, ShieldCheck, TerminalSquare, Workflow, Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedMavenSetupLesson.css';

const STORAGE_KEY = 'guided-maven-setup-lesson-015-progress';
const MAVEN_VERSION = '3.9.16';
const MAVEN_HOME = `C:\\dev\\tools\\apache-maven-${MAVEN_VERSION}`;
const DOWNLOAD_URL = 'https://maven.apache.org/download.cgi';

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard?.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  return <button type="button" className="maven15-copy" onClick={copy} aria-label={`${label}: ${value}`}>
    {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copiado' : label}
  </button>;
}

function CodeWindow({ title, code, output, language = 'powershell', interpretation, warning }) {
  return <section className="maven15-code-window" aria-label={title}>
    <header><span><TerminalSquare size={16} /> {title}</span><CopyButton value={code} /></header>
    <SyntaxHighlighter style={vscDarkPlus} language={language} PreTag="div" customStyle={{ margin: 0, borderRadius: 0, fontSize: '.74rem', lineHeight: 1.65, padding: '16px' }}>{code}</SyntaxHighlighter>
    {output && <div className="maven15-output"><small>SAÍDA ESPERADA — VALORES PODEM VARIAR</small><pre>{output}</pre></div>}
    {(interpretation || warning) && <footer className={warning ? 'warning' : ''}>{warning ? <AlertTriangle size={17} /> : <SearchCheck size={17} />}<span>{interpretation || warning}</span></footer>}
  </section>;
}

function BuildPipeline() {
  const [active, setActive] = useState(0);
  const stages = [
    { label: 'Código', command: 'src/main/java', proof: 'Seus arquivos-fonte continuam sendo Java. Maven não substitui linguagem, JDK nem raciocínio.' },
    { label: 'Compilar', command: 'mvn compile', proof: 'O plugin de compilação chama o compilador com regras declaradas pelo projeto.' },
    { label: 'Testar', command: 'mvn test', proof: 'Testes automatizados são executados de forma repetível; resultado continua precisando ser lido.' },
    { label: 'Empacotar', command: 'mvn package', proof: 'O artefato, como um JAR, é produzido em uma estrutura previsível.' },
    { label: 'Compartilhar', command: 'pom.xml + Wrapper', proof: 'Equipe e CI repetem a mesma intenção sem depender de cliques pessoais da IDE.' }
  ];
  const item = stages[active];
  return <section className="maven15-pipeline">
    <div className="maven15-pipeline-track" role="tablist" aria-label="Pipeline de build">
      {stages.map((stage, index) => <React.Fragment key={stage.label}>
        <button type="button" role="tab" aria-selected={active === index} className={active === index ? 'active' : ''} onClick={() => setActive(index)}><span>{index + 1}</span><strong>{stage.label}</strong></button>
        {index < stages.length - 1 && <ChevronRight aria-hidden="true" size={18} />}
      </React.Fragment>)}
    </div>
    <article><Workflow size={30} /><div><small>INTENÇÃO ATUAL</small><code>{item.command}</code><p>{item.proof}</p></div></article>
    <div className="maven15-boundaries"><span><Code2 size={18} /><strong>JDK</strong> compila e executa Java</span><span><Boxes size={18} /><strong>Maven</strong> orquestra o build declarado</span><span><Laptop size={18} /><strong>IDE</strong> oferece interface; não é a prova do ambiente</span></div>
  </section>;
}

function PrerequisiteAudit() {
  const [state, setState] = useState('ok');
  const cases = {
    ok: { output: 'openjdk version "21.0.8" 2025-07-15 LTS\njavac 21.0.8\nC:\\Program Files\\Eclipse Adoptium\\jdk-21.0.8.9-hotspot', result: 'Pronto: Java e javac pertencem a um JDK e JAVA_HOME aponta para a raiz dele.' },
    nojavac: { output: 'openjdk version "21.0.8" 2025-07-15 LTS\njavac : O termo \'javac\' não é reconhecido.\nC:\\Program Files\\Java\\jre...', result: 'Pare: há runtime ou PATH incompleto. Maven pode iniciar, mas seu ambiente de desenvolvimento não está íntegro.' },
    mismatch: { output: 'openjdk version "17.0.16" 2025-07-15 LTS\njavac 21.0.8\nC:\\Program Files\\Eclipse Adoptium\\jdk-21.0.8.9-hotspot', result: 'Pare: `java`, `javac` e JAVA_HOME contam histórias diferentes. Corrija a precedência antes do Maven.' }
  };
  return <section className="maven15-audit">
    <nav aria-label="Cenários do JDK">{[['ok', 'Ambiente coerente'], ['nojavac', 'Só runtime'], ['mismatch', 'Versões divergentes']].map(([id, label]) => <button type="button" className={state === id ? 'active' : ''} onClick={() => setState(id)} key={id}>{state === id ? <CheckCircle2 size={16} /> : <CircleHelp size={16} />}{label}</button>)}</nav>
    <CodeWindow title="PowerShell — auditoria antes do Maven" code={'java --version\njavac --version\n$env:JAVA_HOME'} output={cases[state].output} interpretation={cases[state].result} />
    <p className="maven15-mentor"><Lightbulb size={18} /><span><strong>Como seu mentor, eu não aceito “Java está instalado”.</strong> Quero três evidências coerentes. O Maven estável atual executa com JDK 8+, mas esta formação mantém o JDK LTS escolhido nas aulas anteriores.</span></p>
  </section>;
}

function DownloadLab() {
  const [artifact, setArtifact] = useState('binary');
  const [hash, setHash] = useState('pending');
  const file = `apache-maven-${MAVEN_VERSION}-bin.zip`;
  return <section className="maven15-download">
    <div className="maven15-browser-chrome"><span className="dots">● ● ●</span><span>maven.apache.org/download.cgi</span><span className="maven15-simulation">SIMULAÇÃO DIDÁTICA · FONTE OFICIAL</span></div>
    <div className="maven15-download-page">
      <header><div><span>APACHE MAVEN</span><h3>Download Apache Maven</h3><p>Current Maven {MAVEN_VERSION} · recomendado para todos os usuários</p></div><a href={DOWNLOAD_URL} target="_blank" rel="noreferrer">Abrir página oficial <ExternalLink size={15} /></a></header>
      <div className="maven15-artifact-choice">
        <button type="button" className={artifact === 'binary' ? 'selected' : ''} onClick={() => setArtifact('binary')}><FileArchive size={25} /><span><strong>Binary zip archive</strong><small>{file}</small></span>{artifact === 'binary' && <CheckCircle2 size={18} />}</button>
        <button type="button" className={artifact === 'source' ? 'selected danger' : ''} onClick={() => setArtifact('source')}><FileCode2 size={25} /><span><strong>Source zip archive</strong><small>Para compilar o próprio Maven; não é nossa instalação.</small></span></button>
      </div>
      <div className="maven15-checksum">
        <div><ShieldCheck size={22} /><span><strong>Checksum SHA-512</strong><small>Compare seu arquivo com o valor publicado ao lado do ZIP.</small></span></div>
        <div className="maven15-checksum-actions"><button type="button" onClick={() => setHash('match')}>Simular correspondente</button><button type="button" onClick={() => setHash('mismatch')}>Simular divergente</button></div>
        {hash !== 'pending' && <p className={hash}>{hash === 'match' ? '✓ Os dois valores são idênticos: prossiga para a extração.' : '✕ Valores diferentes: apague o ZIP e baixe novamente da origem oficial. Não extraia.'}</p>}
      </div>
    </div>
    <CodeWindow title="PowerShell — integridade do download" code={`Get-FileHash "$env:USERPROFILE\\Downloads\\${file}" -Algorithm SHA512`} output={`Algorithm  Hash                                                             Path\nSHA512    [128 CARACTERES HEXADECIMAIS]                                     C:\\Users\\...\\Downloads\\${file}`} interpretation="O comando calcula; a página oficial fornece o valor de comparação. 'O comando rodou' não significa que o hash corresponde." />
  </section>;
}

function ExtractionExplorer() {
  const [layout, setLayout] = useState('correct');
  const correct = layout === 'correct';
  return <section className="maven15-explorer">
    <header><FolderOpen size={17} /><strong>Explorador de Arquivos</strong><span>C:\dev\tools</span><em>SIMULAÇÃO DIDÁTICA</em></header>
    <div className="maven15-explorer-body">
      <aside><span>Este Computador</span><span>Windows (C:)</span><strong>› dev</strong><strong>› tools</strong></aside>
      <main>
        <div className="maven15-address">C: › dev › tools › apache-maven-{MAVEN_VERSION}</div>
        <div className="maven15-tree">
          <span><Folder size={17} /> apache-maven-{MAVEN_VERSION}</span>
          {correct ? <div><span>├─ <Folder size={15} /> bin</span><strong>│&nbsp;&nbsp; └─ mvn.cmd</strong><span>├─ <Folder size={15} /> conf</span><span>├─ <Folder size={15} /> lib</span><span>└─ README.txt</span></div> : <div className="wrong"><span>└─ <Folder size={15} /> apache-maven-{MAVEN_VERSION}</span><span>&nbsp;&nbsp;&nbsp; └─ <Folder size={15} /> apache-maven-{MAVEN_VERSION}</span><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; └─ bin\mvn.cmd</strong></div>}
        </div>
      </main>
    </div>
    <footer><button type="button" className={correct ? 'active' : ''} onClick={() => setLayout('correct')}>Estrutura correta</button><button type="button" className={!correct ? 'active' : ''} onClick={() => setLayout('nested')}>Pasta duplicada</button><span className={correct ? 'ok' : 'bad'}>{correct ? `Prova: ${MAVEN_HOME}\\bin\\mvn.cmd existe.` : 'Recuperação: mova a pasta interna para C:\\dev\\tools ou corrija o caminho. Não adicione bin\\bin ao PATH.'}</span></footer>
  </section>;
}

function EnvironmentLab() {
  const [pathState, setPathState] = useState('missing');
  const [process, setProcess] = useState('old');
  const ready = pathState === 'correct' && process === 'new';
  const pathValue = pathState === 'correct' ? `${MAVEN_HOME}\\bin` : pathState === 'root' ? MAVEN_HOME : '(Maven ainda não adicionado)';
  return <section className="maven15-env">
    <header><Settings2 size={18} /><strong>Variáveis de Ambiente</strong><em>SIMULAÇÃO DIDÁTICA DO WINDOWS</em></header>
    <div className="maven15-env-grid">
      <div className="maven15-env-dialog"><h4>Variáveis do usuário</h4><div className="env-row"><span>JAVA_HOME</span><code>C:\Program Files\Eclipse Adoptium\jdk-21...</code></div><div className={`env-row ${pathState === 'correct' ? 'selected' : ''}`}><span>Path</span><code>{pathValue}</code></div><div className="maven15-env-actions"><button type="button" onClick={() => setPathState('correct')}>Adicionar \bin correto</button><button type="button" onClick={() => setPathState('root')}>Simular raiz errada</button></div></div>
      <div className="maven15-env-rules"><h4>Obrigatório, opcional e legado</h4><p><CheckCircle2 size={17} /><span><strong>Obrigatório</strong><code>{MAVEN_HOME}\bin</code> no `PATH`.</span></p><p><CircleHelp size={17} /><span><strong>Opcional</strong>`MAVEN_HOME={MAVEN_HOME}` pode ajudar scripts próprios, mas a instalação oficial não exige.</span></p><p><AlertTriangle size={17} /><span><strong>Não criar por hábito</strong>`M2_HOME` é uma convenção legada e não é necessária aqui.</span></p></div>
    </div>
    <div className="maven15-process-line"><button type="button" className={process === 'old' ? 'active' : ''} onClick={() => setProcess('old')}><TerminalSquare size={18} /> Terminal aberto antes<span>mantém ambiente antigo</span></button><ArrowRight size={22} /><button type="button" className={process === 'new' ? 'active' : ''} onClick={() => setProcess('new')}><Play size={18} /> Novo PowerShell<span>herda o PATH salvo</span></button></div>
    <p className={`maven15-state ${ready ? 'ok' : 'waiting'}`}>{ready ? 'Ambiente pronto para a prova: PATH correto e um processo novo.' : pathState !== 'correct' ? 'Corrija o PATH: ele precisa terminar em \\bin.' : 'Agora feche o terminal antigo e abra um novo processo.'}</p>
  </section>;
}

const VERSION_LINES = [
  ['Apache Maven 3.9.16 (...)', 'Versão do executável encontrado. Em 17/07/2026, 3.9.16 é a versão estável recomendada; confira a página oficial quando instalar depois.'],
  [`Maven home: ${MAVEN_HOME}`, 'Raiz real da instalação usada. Deve combinar com a pasta que você escolheu.'],
  ['Java version: 21.0.8, vendor: Eclipse Adoptium', 'JDK usado por este processo Maven — não apenas o JDK configurado na IDE.'],
  ['Java home: C:\\Program Files\\Eclipse Adoptium\\jdk-21...', 'Caminho efetivo do Java. Divergência aqui explica builds diferentes.'],
  ['Default locale: pt_BR, platform encoding: UTF-8', 'Locale e encoding podem afetar texto, recursos e testes. Valores variam.'],
  ['OS name: "windows 11", arch: "amd64", family: "windows"', 'Sistema e arquitetura observados pelo Maven.']
];

function VersionProof() {
  const [line, setLine] = useState(0);
  const [multiple, setMultiple] = useState(false);
  return <section className="maven15-version-proof">
    <div className="maven15-terminal-split">
      <CodeWindow title="PowerShell novo — prova central" code={'mvn -v\nwhere.exe mvn\nGet-Command mvn -All | Select-Object CommandType, Source'} output={`Apache Maven ${MAVEN_VERSION} (2bdd9f...)\nMaven home: ${MAVEN_HOME}\nJava version: 21.0.8, vendor: Eclipse Adoptium\nJava home: C:\\Program Files\\Eclipse Adoptium\\jdk-21...\nDefault locale: pt_BR, platform encoding: UTF-8\nOS name: "windows 11", arch: "amd64", family: "windows"\n\n${MAVEN_HOME}\\bin\\mvn\n${MAVEN_HOME}\\bin\\mvn.cmd`} interpretation="`mvn -v` prova ferramenta e Java; os outros comandos provam a origem e todas as correspondências encontradas." />
      <aside><small>LEIA, NÃO APENAS CONFIRA O FINAL</small>{VERSION_LINES.map((item, index) => <button type="button" className={line === index ? 'active' : ''} onClick={() => setLine(index)} key={item[0]}><code>{item[0]}</code></button>)}<p><SearchCheck size={18} />{VERSION_LINES[line][1]}</p></aside>
    </div>
    <div className="maven15-precedence"><button type="button" onClick={() => setMultiple(value => !value)}><Wrench size={17} /> {multiple ? 'Mostrar instalação única' : 'Simular duas instalações no PATH'}</button>{multiple ? <div className="bad"><strong>1º C:\tools\apache-maven-3.8.8\bin\mvn.cmd</strong><span>2º {MAVEN_HOME}\bin\mvn.cmd</span><p>O primeiro caminho vence. Remova ou reordene a entrada antiga, abra outro PowerShell e repita as três provas.</p></div> : <div className="ok"><strong>{MAVEN_HOME}\bin\mvn.cmd</strong><p>Uma origem coerente. A versão, o home e o executável contam a mesma história.</p></div>}</div>
  </section>;
}

function IntelliJSync() {
  const [runner, setRunner] = useState('system');
  const options = {
    system: { label: 'Maven home path', value: MAVEN_HOME, note: 'A IDE aponta conscientemente para a mesma instalação provada no PowerShell.' },
    bundled: { label: 'Maven home path', value: 'Bundled (Maven 3)', note: 'Pode funcionar, mas é outra distribuição. Registre a escolha e não presuma a mesma versão.' },
    wrapper: { label: 'Maven home path', value: 'Use Maven wrapper', note: 'Preferível quando o projeto já traz `mvnw.cmd` e fixa uma versão. Não invente Wrapper nesta pasta de validação.' }
  };
  return <section className="maven15-intellij">
    <header><span>IntelliJ IDEA · Settings</span><em>SIMULAÇÃO DIDÁTICA · NOMES PODEM VARIAR POR VERSÃO</em></header>
    <div className="maven15-ide-body">
      <aside><span>Build, Execution, Deployment</span><strong>› Build Tools</strong><b>› Maven</b><span>&nbsp;&nbsp;Importing</span><span>&nbsp;&nbsp;Runner</span></aside>
      <main><h3>Maven</h3><label>{options[runner].label}<select value={runner} onChange={event => setRunner(event.target.value)}><option value="system">{MAVEN_HOME}</option><option value="bundled">Bundled (Maven 3)</option><option value="wrapper">Use Maven wrapper</option></select></label><label>JDK for importer<select defaultValue="project"><option value="project">Project SDK (Java 21)</option></select></label><div className="maven15-ide-note"><SearchCheck size={19} /><span><strong>{options[runner].value}</strong>{options[runner].note}</span></div></main>
    </div>
    <div className="maven15-ide-terminal"><span><TerminalSquare size={16} /> Terminal integrado — Alt + F12</span><code>PS C:\dev\formacao-java-thiago&gt; mvn -v</code><p>Fechar apenas a aba do terminal pode não bastar se o IntelliJ inteiro foi aberto antes da mudança. Reinicie a IDE e compare `Maven home` e `Java home`.</p></div>
  </section>;
}

function ExecutionLayers() {
  const [selected, setSelected] = useState('system');
  const layers = {
    system: { icon: HardDriveDownload, title: 'Maven do sistema', invoke: 'mvn -v', source: 'Primeiro `mvn.cmd` no PATH', use: 'Valida seu ambiente e funciona fora da IDE.' },
    bundled: { icon: Laptop, title: 'Maven incorporado', invoke: 'Run Maven goal na IDE', source: 'Distribuição fornecida pelo IntelliJ', use: 'Conveniência local; pode divergir do terminal e da CI.' },
    wrapper: { icon: PackageCheck, title: 'Maven Wrapper', invoke: '.\\mvnw.cmd -v', source: '.mvn/wrapper/maven-wrapper.properties', use: 'Projeto fixa e baixa a versão necessária; costuma ser a escolha reprodutível.' }
  };
  const current = layers[selected];
  const Icon = current.icon;
  return <section className="maven15-layers">
    <nav>{Object.entries(layers).map(([id, item]) => { const ItemIcon = item.icon; return <button type="button" className={selected === id ? 'active' : ''} onClick={() => setSelected(id)} key={id}><ItemIcon size={22} /><strong>{item.title}</strong><small>{item.invoke}</small></button>; })}</nav>
    <article><Icon size={34} /><div><small>QUEM DEFINE A VERSÃO?</small><h3>{current.title}</h3><p><strong>Invocação:</strong> <code>{current.invoke}</code></p><p><strong>Fonte:</strong> {current.source}</p><p>{current.use}</p></div></article>
    <div className="maven15-layer-boundary"><div><FileCheck2 size={20} /><strong>Ferramenta instalada</strong><span>`mvn -v` funciona em qualquer pasta.</span></div><div><FileText size={20} /><strong>Projeto Maven</strong><span>`mvn compile` precisa de `pom.xml`.</span></div><div><Download size={20} /><strong>Rede/repositório</strong><span>Dependências, proxy e `settings.xml` só entram quando há acesso remoto.</span></div></div>
    <CodeWindow title="Pasta sem pom.xml — erro útil" code={'Set-Location C:\\dev\\validacao-maven\nmvn compile'} output={'[INFO] Scanning for projects...\n[ERROR] The goal you specified requires a project to execute but there is no POM in this directory.'} interpretation="Isso não desfaz a instalação. O executável iniciou e explicou que falta um projeto. Nesta aula, valide com `mvn -v`; construiremos o primeiro POM no momento curricular correto." />
  </section>;
}

const ERRORS = [
  { title: 'mvn não é reconhecido', symptom: 'PowerShell não encontra o comando.', inspect: '$env:Path -split ";"\nTest-Path "C:\\dev\\tools\\apache-maven-3.9.16\\bin\\mvn.cmd"', fix: 'Adicione a pasta `bin` correta ao PATH e abra um novo processo.', proof: 'where.exe mvn\nmvn -v' },
  { title: 'JAVA_HOME inválido', symptom: 'Maven informa que JAVA_HOME não está definido corretamente.', inspect: '$env:JAVA_HOME\nTest-Path "$env:JAVA_HOME\\bin\\java.exe"', fix: 'Aponte JAVA_HOME para a raiz do JDK, nunca para `bin` nem para uma pasta removida.', proof: 'java --version\nmvn -v' },
  { title: 'Java inesperado', symptom: '`mvn -v` mostra Java diferente do projeto.', inspect: 'where.exe java\nGet-Command java -All\nmvn -v', fix: 'Corrija a precedência do PATH/JAVA_HOME e confira a seleção de JDK na IDE.', proof: 'As três origens agora contam a mesma história.' },
  { title: 'Pasta duplicada', symptom: 'O PATH parece correto, mas `bin\\mvn.cmd` não existe ali.', inspect: 'Get-ChildItem C:\\dev\\tools\\apache-maven-3.9.16', fix: 'Encontre a pasta interna real ou mova-a para eliminar o nível duplicado.', proof: 'Test-Path "C:\\dev\\tools\\apache-maven-3.9.16\\bin\\mvn.cmd"' },
  { title: 'Terminal ou IDE antigos', symptom: 'A variável foi salva, mas o processo ainda não a enxerga.', inspect: '$env:Path\n$env:JAVA_HOME', fix: 'Feche o processo antigo; se for terminal integrado, reinicie o IntelliJ.', proof: 'Novo processo retorna a origem esperada.' },
  { title: 'ZIP bloqueado ou sem permissão', symptom: 'Extração incompleta, acesso negado ou arquivos ausentes.', inspect: 'Get-Item "$env:USERPROFILE\\Downloads\\apache-maven-3.9.16-bin.zip"', fix: 'Use uma pasta sob seu controle, confirme integridade e propriedades do arquivo; não desative proteção global.', proof: '`bin`, `conf`, `lib` e `mvn.cmd` existem.' },
  { title: 'Sem pom.xml', symptom: '`mvn compile` diz que o goal requer um projeto.', inspect: 'Get-ChildItem -Force\nTest-Path .\\pom.xml', fix: 'Volte à prova `mvn -v`. Não crie um POM aleatório só para esconder a mensagem.', proof: 'A ferramenta responde; o projeto será criado em aula própria.' },
  { title: 'Proxy/repositório inacessível', symptom: 'Maven inicia, mas falha ao baixar artefatos.', inspect: 'mvn -v\n# depois, leia URL, status HTTP e causa do erro do build', fix: 'Siga a configuração autorizada da empresa em `settings.xml`; nunca grave senha em aula ou commit.', proof: 'Download autorizado funciona sem segredo versionado.' }
];

function ErrorClinic() {
  const [active, setActive] = useState(0);
  const error = ERRORS[active];
  return <section className="maven15-errors">
    <nav>{ERRORS.map((item, index) => <button type="button" className={active === index ? 'active' : ''} onClick={() => setActive(index)} key={item.title}><span>{index + 1}</span>{item.title}</button>)}</nav>
    <article><header><AlertTriangle size={22} /><div><small>SINTOMA</small><h3>{error.title}</h3><p>{error.symptom}</p></div></header><div className="maven15-diagnostic-grid"><section><small>1 · INSPECIONE</small><SyntaxHighlighter style={vscDarkPlus} language="powershell" PreTag="div" customStyle={{ margin: 0, borderRadius: 7, fontSize: '.68rem' }}>{error.inspect}</SyntaxHighlighter></section><section><small>2 · CORRIJA A CAUSA</small><p>{error.fix}</p></section><section><small>3 · CONFIRME</small><code>{error.proof}</code></section></div></article>
  </section>;
}

const ENV_DOC = `# Ambiente de desenvolvimento

## Java
- JDK: 21 LTS
- Evidência: \`java --version\` e \`javac --version\`

## Maven
- Distribuição: Apache Maven ${MAVEN_VERSION}
- Origem: https://maven.apache.org/download.cgi
- Instalação: \`${MAVEN_HOME}\`
- PATH: \`${MAVEN_HOME}\\bin\`
- Evidência: \`mvn -v\` e \`where.exe mvn\`

## IntelliJ
- Maven selecionado: instalação do sistema
- JDK de importação/execução: Project SDK 21

## Recuperação rápida
1. Abra um PowerShell novo.
2. Compare \`java --version\`, \`mvn -v\` e \`where.exe mvn\`.
3. Se o terminal integrado divergir, reinicie a IDE.`;

function EvidenceDocs() {
  const [view, setView] = useState('source');
  return <section className="maven15-docs">
    <header><span><FileText size={17} /> docs/ambiente.md</span><div><button type="button" className={view === 'source' ? 'active' : ''} onClick={() => setView('source')}>Editor</button><button type="button" className={view === 'preview' ? 'active' : ''} onClick={() => setView('preview')}>Preview</button><CopyButton value={ENV_DOC} /></div></header>
    {view === 'source' ? <SyntaxHighlighter style={vscDarkPlus} language="markdown" PreTag="div" customStyle={{ margin: 0, borderRadius: 0, fontSize: '.72rem', minHeight: 330 }}>{ENV_DOC}</SyntaxHighlighter> : <article className="maven15-doc-preview"><h2>Ambiente de desenvolvimento</h2><h3>Java</h3><ul><li>JDK: 21 LTS</li><li>Evidência: <code>java --version</code> e <code>javac --version</code></li></ul><h3>Maven</h3><ul><li>Distribuição: Apache Maven {MAVEN_VERSION}</li><li>Instalação: <code>{MAVEN_HOME}</code></li><li>Evidência: <code>mvn -v</code> e <code>where.exe mvn</code></li></ul><h3>Recuperação rápida</h3><ol><li>Abra um PowerShell novo.</li><li>Compare Java, Maven e origem.</li><li>Reinicie a IDE se o terminal integrado divergir.</li></ol></article>}
    <footer><ClipboardCheck size={20} /><span><strong>Registro não substitui prova.</strong> Anote versão e caminho somente depois de observar os comandos; não copie números de exemplo como se fossem os seus.</span></footer>
  </section>;
}

function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const delivery = [
    ['Criar evidência', 'New-Item -ItemType Directory -Force docs | Out-Null\n# crie/edite docs\\ambiente.md com seus valores reais', 'O documento descreve ambiente observado, não prometido.'],
    ['Revisar escopo', 'git status --short\ngit diff -- docs/ambiente.md', 'Somente a evidência desta aula deve aparecer.'],
    ['Preparar nominalmente', 'git add docs/ambiente.md\ngit diff --staged --check\ngit diff --staged', 'Nada de `git add .`: leia exatamente o que entrará no histórico.'],
    ['Registrar', 'git commit -m "docs: registra ambiente Java e Maven"\ngit status --short', 'Commit comunica a intenção; status sem saída confirma árvore limpa.']
  ];
  const item = delivery[stage];
  return <section className="maven15-delivery">
    <nav>{delivery.map((entry, index) => <button type="button" className={index === stage ? 'active' : index < stage ? 'done' : ''} onClick={() => setStage(index)} key={entry[0]}><span>{index < stage ? <Check size={13} /> : index + 1}</span>{entry[0]}</button>)}</nav>
    <CodeWindow title="PowerShell — entrega rastreável" code={item[1]} output={stage === 3 ? '[main abc1234] docs: registra ambiente Java e Maven\n(sem saída em git status --short)' : '[saída depende dos arquivos reais do seu repositório]'} interpretation={item[2]} />
    <div className="maven15-defense"><GitCommit size={28} /><div><small>DEFESA ORAL ANTES DE CONCLUIR</small><strong>Explique sem consultar</strong><span>Qual Maven está sendo chamado? Qual JDK ele usa? O que muda ao abrir outro terminal? Quando o Wrapper deve vencer? Como você prova cada resposta?</span></div></div>
    <button type="button" className="maven15-next-action" disabled={stage === delivery.length - 1} onClick={() => setStage(value => value + 1)}>Próximo estado <ArrowRight size={16} /></button>
  </section>;
}

const steps = [
  { id: 'papel', label: 'Entender o build', duration: '8 min', eyebrow: 'MAPA MENTAL', title: 'Maven organiza um build repetível — ele não faz mágica', blocks: [{ type: 'lead', text: 'Antes de instalar, quero que você veja a fronteira: o JDK fornece as ferramentas Java; o Maven lê uma descrição do projeto e orquestra etapas previsíveis; a IDE é apenas uma das interfaces possíveis.' }, { type: 'pipeline' }, { type: 'note', title: 'Hoje validamos a ferramenta, não construímos o primeiro projeto', text: 'Sem `pom.xml`, `mvn -v` continua sendo uma prova válida. `mvn compile` pertence a um projeto Maven e não será usado para mascarar essa diferença.' }] },
  { id: 'jdk', label: 'Auditar o JDK', duration: '9 min', eyebrow: 'PRÉ-REQUISITOS', title: 'Comece por três evidências coerentes do Java', blocks: [{ type: 'lead', text: 'Não avance com um ambiente contraditório. Execute os comandos no PowerShell que você realmente usará e compare executável, compilador e raiz do JDK.' }, { type: 'audit' }] },
  { id: 'download', label: 'Baixar e verificar', duration: '12 min', eyebrow: 'FONTE OFICIAL', title: 'Escolha o ZIP binário estável e prove sua integridade', blocks: [{ type: 'lead', text: `Em 17/07/2026, a Apache recomenda o Maven ${MAVEN_VERSION}. Versões mudam: quando você repetir a instalação, confirme a versão estável na página oficial em vez de copiar este número cegamente.` }, { type: 'download' }, { type: 'note', tone: 'warning', title: 'Release candidate não é nossa escolha padrão', text: 'Maven 3.10 e Maven 4 aparecem como previews na fonte oficial atual. Nesta formação, use a versão estável recomendada para todos os usuários.' }] },
  { id: 'extrair', label: 'Extrair corretamente', duration: '8 min', eyebrow: 'SISTEMA DE ARQUIVOS', title: 'A pasta certa contém bin, conf e lib diretamente', blocks: [{ type: 'lead', text: 'Extraia para um caminho estável, sem depender da pasta Downloads. Vamos reconhecer a árvore correta antes de tocar no PATH.' }, { type: 'explorer' }, { type: 'result', title: 'Critério objetivo', items: [`Existe ${MAVEN_HOME}\\bin\\mvn.cmd.`, 'A raiz não termina em `bin` e não contém outra raiz Maven duplicada.', 'Você sabe remover esta instalação apagando apenas a pasta e a entrada do PATH.'] }] },
  { id: 'ambiente', label: 'Configurar o Windows', duration: '12 min', eyebrow: 'PATH E PROCESSOS', title: 'Adicione apenas o bin ao PATH e abra um processo novo', blocks: [{ type: 'lead', text: 'Variável salva e variável vista pelo terminal são estados diferentes. Eu vou mostrar por que “já reiniciei a aba” às vezes não basta.' }, { type: 'environment' }] },
  { id: 'provar', label: 'Provar a instalação', duration: '12 min', eyebrow: 'TERMINAL COM EVIDÊNCIA', title: 'Leia versão, Maven home, Java home e origem do executável', blocks: [{ type: 'lead', text: 'A prova não é apenas aparecer “Apache Maven”. Cada linha responde uma pergunta de diagnóstico. Clique nelas e treine a leitura.' }, { type: 'version' }, { type: 'note', title: '`mvn -v`, `mvn --version` e `mvn -version`', text: 'As formas usuais exibem a versão. A documentação oficial usa `mvn -v`; adotamos essa forma curta na prova central.' }] },
  { id: 'intellij', label: 'Sincronizar o IntelliJ', duration: '11 min', eyebrow: 'IDE E TERMINAL', title: 'IntelliJ pode usar outro Maven e outro processo', blocks: [{ type: 'lead', text: 'Agora compare o que o terminal integrado executa com o que a interface Maven da IDE seleciona. Eles podem divergir sem que nenhum esteja “quebrado”.' }, { type: 'intellij' }] },
  { id: 'executores', label: 'Escolher o executor', duration: '12 min', eyebrow: 'SISTEMA · IDE · WRAPPER', title: 'Três caminhos válidos, três fontes de versão diferentes', blocks: [{ type: 'lead', text: 'O profissional pergunta “qual Maven executou?” antes de comparar builds. Sistema, incorporado e Wrapper não devem ser misturados em uma única ideia vaga.' }, { type: 'layers' }, { type: 'note', tone: 'warning', title: 'Proxy e credenciais ficam fora do Git', text: 'Em rede corporativa, siga a configuração autorizada de `settings.xml`. Nunca copie usuário, senha, token ou URL interna para a aula, o diário ou um commit.' }] },
  { id: 'falhas', label: 'Recuperar falhas', duration: '15 min', eyebrow: 'CLÍNICA DE DIAGNÓSTICO', title: 'Corrija a causa e repita a mesma prova', blocks: [{ type: 'lead', text: 'Escolha cada sintoma. A ordem é sempre a mesma: observar a mensagem, inspecionar o estado, corrigir uma causa e confirmar com evidência.' }, { type: 'errors' }] },
  { id: 'documentar', label: 'Registrar o ambiente', duration: '10 min', eyebrow: 'MEMÓRIA EXTERNA', title: 'Documente os valores que você observou — não os meus exemplos', blocks: [{ type: 'lead', text: 'Seu documento precisa permitir que você ou outra pessoa reproduza a escolha e diagnostique uma divergência sem transformar o arquivo em uma segunda apostila.' }, { type: 'docs' }] },
  { id: 'entregar', label: 'Entregar e defender', duration: '12 min', eyebrow: 'DESAFIO FINAL', title: 'Feche com evidência, Git limpo e explicação humana', blocks: [{ type: 'lead', text: 'Uma instalação local não pertence ao Git; a documentação reproduzível pertence. Prepare somente esse artefato e defenda o ambiente sem decorar.' }, { type: 'delivery' }, { type: 'challenge', title: 'Transferência: diagnostique uma máquina “quase igual”', text: 'Imagine que o PowerShell externo mostra Maven 3.9.16 com Java 21, mas o terminal do IntelliJ mostra outro Maven com Java 17. Escreva a sequência mínima de inspeção e a correção mais segura, sem reinstalar tudo.', acceptance: ['Você identifica o processo antigo e a origem de cada `mvn`.', 'Você compara Maven home e Java home nas duas superfícies.', 'Você verifica a escolha em Settings → Build Tools → Maven.', 'Você corrige uma configuração por vez e repete a prova.', 'Você sabe explicar quando manter o Maven incorporado ou preferir o Wrapper.'] }] }
];

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  const components = { pipeline: BuildPipeline, audit: PrerequisiteAudit, download: DownloadLab, explorer: ExtractionExplorer, environment: EnvironmentLab, version: VersionProof, intellij: IntelliJSync, layers: ExecutionLayers, errors: ErrorClinic, docs: EvidenceDocs, delivery: DeliveryLab };
  if (components[block.type]) { const Component = components[block.type]; return <Component />; }
  if (block.type === 'note') { const Icon = block.tone === 'warning' ? AlertTriangle : Lightbulb; return <aside className={`guided-note ${block.tone || 'info'}`}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>; }
  if (block.type === 'result') return <section className="guided-result"><h3><ClipboardCheck size={20} /> {block.title}</h3><ul>{block.items.map(item => <li key={item}><CheckCircle2 size={16} /> {item}</li>)}</ul></section>;
  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Wrench size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  return null;
}

export default function GuidedMavenSetupLesson015({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const normalized = useRef(false);
  const [completed, setCompleted] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return new Set(Array.isArray(saved) ? saved : []); } catch { return new Set(); } });
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed])), [completed]);
  const active = steps[activeIndex];
  const progress = Math.round((completed.size / steps.length) * 100);
  const allDone = completed.size === steps.length;
  const activeDone = completed.has(active.id);
  const lessonDone = isCompleted && allDone;
  const label = useMemo(() => `${completed.size} de ${steps.length} etapas concluídas`, [completed]);
  useEffect(() => { if (normalized.current) return; normalized.current = true; if (isCompleted && !allDone) onToggleCompleted(); }, [allDone, isCompleted, onToggleCompleted]);
  const select = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const toggle = () => { if (activeDone && isCompleted) onToggleCompleted(); setCompleted(previous => { const next = new Set(previous); if (next.has(active.id)) next.delete(active.id); else next.add(active.id); return next; }); };
  return <article className="guided-git-lesson guided-maven-setup-lesson">
    <header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><PackageCheck size={17} /> Oficina guiada de ambiente</span><p className="guided-sequence">015 · M0.15</p><h1>Instale o Maven e prove exatamente o que seu computador executará</h1><p>Baixe a distribuição oficial, valide o arquivo, configure o Windows e sincronize PowerShell e IntelliJ sem confundir ferramenta, projeto ou Wrapper.</p></div><div className="guided-hero-status"><HardDriveDownload size={42} /><strong>{progress}%</strong><span>{label}</span></div><div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}><span style={{ width: `${progress}%` }} /></div></header>
    <GuidedLessonFacts ariaLabel="Resultado da aula" items={[{ value: 3, label: 'origens comparadas' }, { value: 6, label: 'evidências do ambiente' }, { value: 8, label: 'falhas recuperáveis' }]} />
    <div className="guided-layout"><nav className="guided-step-nav" aria-label="Etapas da aula 015"><div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>{steps.map((step, index) => <button type="button" key={step.id} className={`${index === activeIndex ? 'active ' : ''}${completed.has(step.id) ? 'done' : ''}`} onClick={() => select(index)}><span className="guided-step-number">{completed.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}</nav>
      <main className="guided-step-content"><div className="guided-step-heading"><span>{active.eyebrow} · {active.duration}</span><h2>{active.title}</h2></div><div className="guided-blocks">{active.blocks.map((block, index) => <ContentBlock block={block} key={`${active.id}-${block.type}-${index}`} />)}</div><div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => select(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${activeDone ? 'undo' : 'complete'}`} onClick={toggle}>{activeDone ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><Check size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeDone} onClick={() => select(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div></div>{allDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>{lessonDone ? 'Ambiente Maven comprovado' : 'Oficina concluída'}</h3><p>{lessonDone ? 'Versão, Java, executável, IDE e recuperação foram defendidos com evidência.' : 'Conclua a aula para liberar PostgreSQL e DBeaver.'}</p></div><button type="button" className={lessonDone ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonDone ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}</main>
    </div>
    <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 014</button><div className={`guided-course-status ${lessonDone ? 'completed' : allDone ? 'ready' : ''}`}>{lessonDone ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonDone ? 'Aula concluída' : allDone ? 'Pronta para concluir' : `${completed.size} de ${steps.length} etapas`}</strong><small>{lessonDone ? 'Maven instalado com evidência' : allDone ? 'Use o botão acima' : 'Baixar, configurar, provar e registrar'}</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonDone}>Aula 016 <ArrowRight size={17} /></button></footer>
  </article>;
}
