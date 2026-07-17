import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2,
  ChevronRight, ClipboardCheck, Clock3, Code2, Copy, File, FileText,
  Folder, FolderOpen, GitBranch, GitCommit, Layers3, Lightbulb,
  ListChecks, LockKeyhole, RotateCcw, SearchCheck, ShieldCheck,
  Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedRepositoryStructureLesson.css';

const STORAGE_KEY = 'guided-repository-structure-lesson-019-progress';

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard?.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  return <button type="button" className="repo19-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : 'Copiar'}</button>;
}

function CodePanel({ title, code, output, language = 'powershell', note, warning = false }) {
  return <section className="repo19-code"><header><span><Code2 size={16} />{title}</span><CopyButton value={code} /></header><SyntaxHighlighter style={vscDarkPlus} language={language} PreTag="div" customStyle={{ margin: 0, borderRadius: 0, fontSize: '.72rem', lineHeight: 1.65, padding: '16px' }}>{code}</SyntaxHighlighter>{output && <div className="repo19-output"><small>SAÍDA ESPERADA · EXEMPLO DIDÁTICO</small><pre>{output}</pre></div>}{note && <footer className={warning ? 'warning' : ''}>{warning ? <AlertTriangle size={17} /> : <SearchCheck size={17} />}<span>{note}</span></footer>}</section>;
}

function RepositoryContrast() {
  const [mode, setMode] = useState('loose');
  const loose = ['ordem.java', 'teste novo.java', 'banco.sql', 'postman legal.json', 'print erro.png', 'final certo.java'];
  const trace = [
    ['README.md', 'explica o propósito e o caminho de entrada'],
    ['docs/', 'preserva contexto, decisões, ambiente e diário'],
    ['src/', 'separa código principal e testes'],
    ['labs/', 'contém experiências com limite'],
    ['commits', 'registram intenção, mudança e momento']
  ];
  return <section className="repo19-contrast"><nav><button type="button" className={mode === 'loose' ? 'active' : ''} onClick={() => setMode('loose')}>Pasta solta</button><button type="button" className={mode === 'repo' ? 'active' : ''} onClick={() => setMode('repo')}>Repositório profissional</button></nav>{mode === 'loose' ? <div className="repo19-loose"><FolderOpen size={42} /><div>{loose.map(name => <span key={name}><File size={15} />{name}</span>)}</div><p>Há arquivos, mas não há uma história recuperável: intenção, estado, evidência e relação entre eles estão escondidos.</p></div> : <div className="repo19-trace"><div className="repo19-history"><span>estrutura inicial</span><ChevronRight /><span>ambiente</span><ChevronRight /><span>HTTP</span><ChevronRight /><span>Docker</span><ChevronRight /><span>organização</span></div>{trace.map(item => <article key={item[0]}><CheckCircle2 size={17} /><strong>{item[0]}</strong><span>{item[1]}</span></article>)}</div>}<aside><Lightbulb size={19} /><span><strong>Organização não é enfeite.</strong> Ela reduz a pergunta “onde está?” e torna possível responder “o que mudou, por quê e com qual prova?”.</span></aside></section>;
}

const AUDIT_STATES = {
  unknown: { label: 'Ainda não sei onde estou', command: 'Get-Location\nGet-ChildItem -Force', output: 'Path\n----\nC:\\dev\\projects\n\nMode   Name\n----   ----\nd----  formacao-java-backend', note: 'Primeiro descubra o diretório e o conteúdo, incluindo itens ocultos. Não crie outra pasta com o mesmo propósito.' },
  existing: { label: 'A pasta já existe', command: 'Set-Location C:\\dev\\projects\\formacao-java-backend\nTest-Path .git\ngit rev-parse --show-toplevel\ngit status --short', output: 'True\nC:/dev/projects/formacao-java-backend\n M docs/ambiente.md\n?? anotacao-solta.txt', note: 'Há repositório e mudanças. Pare antes de mover arquivos: entenda o modificado e o não rastreado.' },
  new: { label: 'A pasta ainda não existe', command: 'Set-Location C:\\dev\\projects\nTest-Path .\\formacao-java-backend', output: 'False', note: 'Agora a criação é justificável. O resultado `False` é a prova de que o nome ainda está livre nesse local.' }
};

function SafeAudit() {
  const [state, setState] = useState('unknown');
  const item = AUDIT_STATES[state];
  return <section className="repo19-audit"><nav>{Object.entries(AUDIT_STATES).map(([id, entry]) => <button type="button" className={state === id ? 'active' : ''} onClick={() => setState(id)} key={id}>{entry.label}</button>)}</nav><CodePanel title="PowerShell · descoberta antes da mudança" code={item.command} output={item.output} note={item.note} warning={state === 'existing'} /><div className="repo19-audit-gates"><span><SearchCheck /> Local e raiz identificados</span><span><GitBranch /> Git existente ou ausente provado</span><span><FileText /> Mudanças atuais compreendidas</span><span><ShieldCheck /> Nenhum arquivo apagado ou sobrescrito</span></div></section>;
}

const TREE_INFO = {
  root: ['formacao-java-backend/', 'Raiz', 'Poucos arquivos de entrada e configuração. Não é depósito de toda a formação.'],
  readme: ['README.md', 'Entrada', 'Explica objetivo, stack, estrutura, validação e regra de estudo.'],
  ignore: ['.gitignore', 'Proteção', 'Evita que gerados, arquivos de IDE, temporários e segredos novos entrem no Git.'],
  docs: ['docs/', 'Contexto', 'Ambiente, atalhos, diário, checklists e explicações técnicas.'],
  main: ['src/main/java/', 'Código principal', 'Código que implementará o comportamento da aplicação.'],
  test: ['src/test/java/', 'Testes', 'Código que verifica o principal sem se misturar a ele.'],
  labs: ['labs/', 'Experimentos', 'Práticas isoladas com nome, propósito e regra de saída.']
};

function RepositoryTree({ compact = false, visibleStage = 6 }) {
  const [active, setActive] = useState('root');
  const info = TREE_INFO[active];
  const show = threshold => visibleStage >= threshold;
  return <section className={`repo19-tree ${compact ? 'compact' : ''}`}><div className="repo19-tree-list"><button type="button" className={active === 'root' ? 'active' : ''} onClick={() => setActive('root')}><FolderOpen /> formacao-java-backend/</button>{show(1) && <><button type="button" className={active === 'readme' ? 'active child' : 'child'} onClick={() => setActive('readme')}><FileText /> README.md</button><button type="button" className={active === 'ignore' ? 'active child' : 'child'} onClick={() => setActive('ignore')}><File /> .gitignore</button></>}{show(2) && <><button type="button" className={active === 'docs' ? 'active child' : 'child'} onClick={() => setActive('docs')}><Folder /> docs/</button><span className="grandchild">ambiente.md · atalhos.md · diario-de-bordo.md</span><span className="grandchild">checklist-ambiente.md · http-basico.md · docker-basico.md</span></>}{show(3) && <><button type="button" className={active === 'main' ? 'active child' : 'child'} onClick={() => setActive('main')}><Folder /> src/main/java/</button><button type="button" className={active === 'test' ? 'active child' : 'child'} onClick={() => setActive('test')}><Folder /> src/test/java/</button></>}{show(4) && <><button type="button" className={active === 'labs' ? 'active child' : 'child'} onClick={() => setActive('labs')}><Folder /> labs/</button><span className="grandchild">README.md</span></>}</div>{!compact && <article><small>{info[1]}</small><h3>{info[0]}</h3><p>{info[2]}</p></article>}</section>;
}

function TreeDesign() {
  return <div><RepositoryTree /><div className="repo19-future"><span>Agora</span><strong>README · docs · src · labs</strong><ChevronRight /><span>Depois, quando houver necessidade</span><strong>pom.xml · Dockerfile · compose.yml · migrations · collections · ADRs</strong></div><aside className="guided-note info"><Lightbulb size={21} /><div><strong>Preparar diretórios não é antecipar o projeto</strong><p>Hoje criamos lugares e responsabilidades. `pom.xml`, pacote Java, Dockerfile e estruturas avançadas entram quando uma aula ensinar seu contrato.</p></div></aside></div>;
}

const BUILD_STAGES = [
  ['Criar raiz', 'Set-Location C:\\dev\\projects\nNew-Item -ItemType Directory -Path .\\formacao-java-backend\nSet-Location .\\formacao-java-backend', 'Directory: C:\\dev\\projects\nMode   Name\n----   ----\nd----  formacao-java-backend', 0],
  ['Arquivos centrais', 'New-Item -ItemType File -Path .\\README.md\nNew-Item -ItemType File -Path .\\.gitignore', 'README.md e .gitignore criados vazios.', 1],
  ['Documentação', '$docs = @("ambiente.md", "atalhos.md", "diario-de-bordo.md", "checklist-ambiente.md", "http-basico.md", "docker-basico.md")\nNew-Item -ItemType Directory -Path .\\docs\n$docs | ForEach-Object { New-Item -ItemType File -Path ".\\docs\\$_" }', 'Pasta docs e seis arquivos criados.', 2],
  ['Código e testes', 'New-Item -ItemType Directory -Path .\\src\\main\\java\nNew-Item -ItemType Directory -Path .\\src\\test\\java\nNew-Item -ItemType File -Path .\\src\\main\\java\\.gitkeep\nNew-Item -ItemType File -Path .\\src\\test\\java\\.gitkeep', 'src/main/java e src/test/java preservados no Git por marcadores.', 3],
  ['Laboratórios', 'New-Item -ItemType Directory -Path .\\labs\nNew-Item -ItemType File -Path .\\labs\\README.md', 'labs criado com um README para declarar limites.', 4],
  ['Validar', 'Get-ChildItem -Recurse -Force | Select-Object FullName\nTest-Path .git', 'Árvore listada. `.git` ainda depende da resposta observada.', 6]
];

function BuildLab() {
  const [stage, setStage] = useState(0);
  const item = BUILD_STAGES[stage];
  return <section className="repo19-build"><nav>{BUILD_STAGES.map((entry, index) => <button type="button" className={stage === index ? 'active' : index < stage ? 'done' : ''} onClick={() => setStage(index)} key={entry[0]}><span>{index < stage ? <Check size={12} /> : index + 1}</span>{entry[0]}</button>)}</nav><div className="repo19-build-body"><CodePanel title={`PowerShell · ${item[0]}`} code={item[1]} output={item[2]} note={stage === 0 ? 'Execute esta rota somente se a auditoria mostrou que a pasta não existe. Se existe, adapte a estrutura dentro dela.' : stage === 5 ? 'Se `Test-Path .git` for False, `git init` poderá ser executado conscientemente. Se for True, não há motivo para reinicializar.' : 'Sem `-Force`: um caminho existente produz conflito visível em vez de ser sobrescrito silenciosamente.'} warning={stage === 0} /><RepositoryTree compact visibleStage={item[3]} /></div><button type="button" className="repo19-next" disabled={stage === BUILD_STAGES.length - 1} onClick={() => setStage(value => value + 1)}>Próximo grupo <ArrowRight size={16} /></button></section>;
}

const README_SOURCE = `# Formação Java Backend

Repositório de estudos, práticas e documentação da formação Java Backend.

## Estrutura

- \`docs/\` — contexto, diário, checklists e anotações.
- \`src/main/java/\` — código principal.
- \`src/test/java/\` — testes.
- \`labs/\` — experimentos isolados com limite.

## Ambiente

JDK, IntelliJ, Git/GitHub, Maven, PostgreSQL/DBeaver,
cliente HTTP e Docker/WSL2 foram preparados no Módulo 0.

## Validação rápida

\`git status --short\`

## Regra de estudo

Cada aula aplicável produz prática, documentação, diário e commit revisado.`;

function ReadmeLab() {
  const [preview, setPreview] = useState(false);
  return <section className="repo19-editor"><header><span><FileText size={16} /> README.md</span><div><button type="button" className={!preview ? 'active' : ''} onClick={() => setPreview(false)}>Editor</button><button type="button" className={preview ? 'active' : ''} onClick={() => setPreview(true)}>Preview</button><CopyButton value={README_SOURCE} /></div></header>{preview ? <article><h2>Formação Java Backend</h2><p>Repositório de estudos, práticas e documentação da formação Java Backend.</p><h3>Estrutura</h3><ul><li><code>docs/</code> — contexto e registros.</li><li><code>src/main/java/</code> — código principal.</li><li><code>src/test/java/</code> — testes.</li><li><code>labs/</code> — experimentos isolados.</li></ul><h3>Ambiente</h3><p>Ferramentas do Módulo 0 preparadas.</p><h3>Validação rápida</h3><code>git status --short</code><h3>Regra de estudo</h3><p>Prática, documentação, diário e commit revisado.</p></article> : <SyntaxHighlighter style={vscDarkPlus} language="markdown" PreTag="div" customStyle={{ margin: 0, borderRadius: 0, fontSize: '.7rem', minHeight: 430 }}>{README_SOURCE}</SyntaxHighlighter>}<footer><span><strong>Entrada:</strong> o que é e por onde começar</span><span><strong>Mapa:</strong> onde cada coisa vive</span><span><strong>Prova:</strong> como conferir o estado</span><span><strong>Rotina:</strong> como continuar sem bagunça</span></footer></section>;
}

const DOCS = {
  'ambiente.md': ['Estado técnico observável', '# Ambiente de desenvolvimento\n\n## Java\n- `java -version`: validado\n- `javac -version`: validado\n\n## PostgreSQL\n- Host: `localhost`\n- Porta: `5432`\n- Database: `formacao_java`\n- Senha: não documentada\n\n## Docker\n- WSL2 validado\n- `hello-world` executado'],
  'atalhos.md': ['Ações frequentes, sujeitas ao keymap', '# Atalhos úteis\n\n| Ferramenta | Ação | Referência |\n|---|---|---|\n| IntelliJ | Terminal | `Alt + F12` |\n| IntelliJ | Project | `Alt + 1` |\n| DBeaver | Executar SQL | `Ctrl + Enter` |\n\n> Confirme o keymap da sua instalação.'],
  'diario-de-bordo.md': ['Evolução, erro e prova por aula', '# Diário de bordo\n\n## Aula 019 — estrutura\n\n- Decisão: separar documentação, código e labs.\n- Prática: árvore inicial criada.\n- Erro encontrado: <preencher se houver>.\n- Prova: `git diff --staged`.\n- Próxima revisão: explicar a função de cada pasta.'],
  'checklist-ambiente.md': ['Lugar do checklist aprofundado na Aula 20', '# Checklist do ambiente\n\n- [ ] Windows e terminal\n- [ ] Java e Maven\n- [ ] Git e GitHub\n- [ ] Banco e cliente\n- [ ] HTTP\n- [ ] Docker e WSL2\n- [ ] Repositório\n\n> A validação completa acontece na Aula 020.'],
  'http-basico.md': ['Request, response e diagnóstico da Aula 17', '# HTTP básico\n\n- Método e URL resolvida\n- Headers e body\n- Status, headers e body da resposta\n- Nenhum token real'],
  'docker-basico.md': ['Cadeia de provas da Aula 18', '# Docker e WSL2\n\n- WSL2 e distribuição observados\n- Cliente e engine provados\n- `hello-world` executado\n- Nenhuma senha ou volume removido']
};

function DocsWorkspace() {
  const [active, setActive] = useState('ambiente.md');
  const item = DOCS[active];
  return <section className="repo19-docs"><header><span><FolderOpen size={16} /> docs/</span><em>DOCUMENTAÇÃO É CÓDIGO DE CONTEXTO</em></header><div><aside>{Object.keys(DOCS).map(name => <button type="button" className={active === name ? 'active' : ''} onClick={() => setActive(name)} key={name}><FileText size={14} />{name}</button>)}</aside><main><small>RESPONSABILIDADE</small><h3>{item[0]}</h3><SyntaxHighlighter style={vscDarkPlus} language="markdown" PreTag="div" customStyle={{ margin: '10px 0 0', borderRadius: 6, fontSize: '.67rem', minHeight: 310 }}>{item[1]}</SyntaxHighlighter></main></div><footer><LockKeyhole size={18} /><span><strong>Registre estado e procedimento; não registre credencial.</strong> Senha, token, `.env` real, `settings.xml` sensível e exportações autenticadas ficam fora da documentação e do Git.</span></footer></section>;
}

const ARTIFACTS = {
  'ClienteService.java': ['src/main/java/', 'Código principal que implementa comportamento.'],
  'ClienteServiceTest.java': ['src/test/java/', 'Teste automatizado do comportamento principal.'],
  'tentativa-streams.java': ['labs/java-basico/', 'Experimento isolado, nomeado pela intenção e ainda não oficial.'],
  'ordem-servico.md': ['docs/api/', 'Contrato ou explicação da API. Diretório futuro criado quando necessário.'],
  'adr-001-status-os.md': ['docs/decisoes/', 'Decisão arquitetural recuperável, não código-fonte.'],
  'ordem-servico.postman_collection.json': ['collections/postman/', 'Artefato de cliente HTTP sem segredo; estrutura futura.']
};

function BoundariesLab() {
  const [artifact, setArtifact] = useState('ClienteService.java');
  const item = ARTIFACTS[artifact];
  return <section className="repo19-boundaries"><label>Artefato para classificar<select value={artifact} onChange={event => setArtifact(event.target.value)}>{Object.keys(ARTIFACTS).map(name => <option key={name}>{name}</option>)}</select></label><div className="repo19-placement"><File size={28} /><code>{artifact}</code><ChevronRight /><FolderOpen size={28} /><strong>{item[0]}</strong><p>{item[1]}</p></div><div className="repo19-boundary-grid"><article><strong>main</strong><span>comportamento oficial</span></article><article><strong>test</strong><span>verificação automatizada</span></article><article><strong>labs</strong><span>experimento com limite</span></article><article><strong>docs</strong><span>contexto e decisão</span></article></div><aside className="guided-note warning"><AlertTriangle size={21} /><div><strong>`labs` não é lixeira</strong><p>Cada laboratório precisa de nome, objetivo e critério de saída. Se virar código oficial, mova em uma mudança revisada; se for descartável, não o versione sem necessidade.</p></div></aside><CodePanel title="Marcadores para diretórios vazios" code={'New-Item -ItemType File -Path .\\src\\main\\java\\.gitkeep\nNew-Item -ItemType File -Path .\\src\\test\\java\\.gitkeep'} note="`.gitkeep` é convenção, não recurso do Git. Remova o marcador quando o diretório ganhar arquivos reais." /></section>;
}

const IGNORE_RULES = [
  ['target/app.jar', 'target/', 'ignorado', 'saída Maven'], ['build/classes/App.class', 'build/', 'ignorado', 'saída de build'],
  ['.gradle/cache.bin', '.gradle/', 'ignorado', 'cache Gradle'], ['src/main/java/App.class', '*.class', 'ignorado', 'bytecode gerado'],
  ['out/production/App.class', 'out/', 'ignorado', 'saída de IDE'], ['.idea/workspace.xml', '.idea/', 'ignorado', 'estado local do IntelliJ'],
  ['curso.iml', '*.iml', 'ignorado', 'metadado local'], ['.env', '.env', 'ignorado', 'segredo/configuração local'],
  ['.env.local', '.env.*', 'ignorado', 'ambiente local'], ['.env.example', '!.env.example', 'permitido', 'modelo seguro'],
  ['logs/app.log', '*.log', 'ignorado', 'log gerado'], ['scratch.tmp', '*.tmp', 'ignorado', 'temporário'],
  ['Thumbs.db', 'Thumbs.db', 'ignorado', 'arquivo do Windows'], ['README.md', '(nenhuma)', 'permitido', 'documentação do projeto']
];

const IGNORE_SOURCE = `# Java / Maven / Gradle
target/
build/
.gradle/
*.class
out/

# IntelliJ
.idea/
*.iml

# Sistema operacional
.DS_Store
Thumbs.db

# Logs e temporários
*.log
*.tmp

# Ambiente e segredos
.env
.env.*
!.env.example`;

function GitignoreLab() {
  const [active, setActive] = useState(7);
  const [tracked, setTracked] = useState(false);
  const item = IGNORE_RULES[active];
  return <section className="repo19-ignore"><div className="repo19-ignore-body"><section><header><span><FileText size={15} /> .gitignore</span><CopyButton value={IGNORE_SOURCE} /></header><SyntaxHighlighter style={vscDarkPlus} language="gitignore" PreTag="div" customStyle={{ margin: 0, borderRadius: 0, fontSize: '.66rem', minHeight: 390 }}>{IGNORE_SOURCE}</SyntaxHighlighter></section><section><label>Caminho para testar<select value={active} onChange={event => setActive(Number(event.target.value))}>{IGNORE_RULES.map((entry, index) => <option value={index} key={entry[0]}>{entry[0]}</option>)}</select></label><div className={`repo19-ignore-result ${tracked ? 'tracked' : item[2]}`}><File size={30} /><code>{item[0]}</code><strong>{tracked ? 'JÁ RASTREADO' : item[2].toUpperCase()}</strong><span>{tracked ? 'Adicionar regra não retira automaticamente um arquivo que já entrou no histórico/índice.' : `${item[3]} · regra: ${item[1]}`}</span></div><label className="repo19-track-toggle"><input type="checkbox" checked={tracked} onChange={event => setTracked(event.target.checked)} /> Simular arquivo já rastreado</label><CodePanel title="Prova no Git" code={`git check-ignore -v -- ${item[0]}`} output={tracked ? '(sem saída útil para desfazer rastreamento; primeiro confirme o estado no índice)' : item[2] === 'ignorado' ? `.gitignore:<linha>:${item[1]}  ${item[0]}` : '(sem regra de exclusão efetiva)'} note="`git check-ignore -v` mostra arquivo, regra e origem. Não use limpeza ou remoção do índice sem compreender impacto e histórico." warning={tracked} /></section></div></section>;
}

const NAMES = [
  ['diário de bordo.md', 'diario-de-bordo.md', 'Remove espaço e acento; mantém intenção.'],
  ['novo documento.md', 'checklist-ambiente.md', 'Troca estado temporário pela responsabilidade.'],
  ['final certo.java', 'ProcessadorOrdem.java', 'Nomeia o comportamento, não a ansiedade.'],
  ['teste1.java', 'CalculadoraFreteTest.java', 'Explica qual unidade é verificada.'],
  ['docker agora vai.md', 'docker-basico.md', 'Torna o conteúdo previsível e recuperável.']
];

function NamingLab() {
  const [active, setActive] = useState(0);
  const item = NAMES[active];
  return <section className="repo19-naming"><nav>{NAMES.map((entry, index) => <button type="button" className={active === index ? 'active' : ''} onClick={() => setActive(index)} key={entry[0]}>{entry[0]}</button>)}</nav><article><div><small>ANTES</small><code>{item[0]}</code></div><ChevronRight /><div><small>DEPOIS</small><code>{item[1]}</code></div><p>{item[2]}</p></article><div className="repo19-name-rules"><span>minúsculas em arquivos técnicos</span><span>hífen em nomes compostos</span><span>sem espaços e acentos</span><span>responsabilidade explícita</span></div><BoundariesLab /></section>;
}

const GIT_STAGES = [
  ['Inspecionar', 'git status --short\ngit diff -- README.md .gitignore docs labs src', 'Working tree', 'Arquivos novos e alterações intencionais identificados; nada preparado ainda.'],
  ['Preparar nominalmente', 'git add README.md .gitignore docs labs src', 'Staging area', 'Somente caminhos revisados entram no próximo commit.'],
  ['Revisar staged', 'git diff --staged --check\ngit diff --staged', 'Staging area', 'Whitespace e conteúdo do snapshot são lidos antes do commit.'],
  ['Commitar intenção', 'git commit -m "docs: organiza estrutura inicial da formacao"', 'Repository', 'Um commit registra uma intenção principal e os arquivos conferidos.'],
  ['Confirmar', 'git status --short\ngit log -1 --oneline', 'Repository', 'Saída curta vazia indica working tree limpo; o log mostra o commit criado.']
];

function GitPipeline() {
  const [stage, setStage] = useState(0);
  const item = GIT_STAGES[stage];
  return <section className="repo19-git"><nav>{GIT_STAGES.map((entry, index) => <button type="button" className={stage === index ? 'active' : index < stage ? 'done' : ''} onClick={() => setStage(index)} key={entry[0]}><span>{index < stage ? <Check size={12} /> : index + 1}</span>{entry[0]}</button>)}</nav><div className="repo19-git-lanes"><section className={stage === 0 ? 'active' : ''}><FileText /><strong>Working tree</strong><span>edições locais</span></section><ChevronRight /><section className={stage === 1 || stage === 2 ? 'active' : ''}><Layers3 /><strong>Staging area</strong><span>próximo snapshot</span></section><ChevronRight /><section className={stage >= 3 ? 'active' : ''}><GitCommit /><strong>Repository</strong><span>histórico</span></section></div><CodePanel title={`PowerShell · ${item[0]}`} code={item[1]} output={`${item[2]}\n${item[3]}`} note={stage === 1 ? '`git add .` não é proibido, mas amplia o escopo. Nesta entrega, nomes explícitos deixam a intenção auditável.' : 'Leia o estado produzido antes de avançar; o próximo comando depende dessa evidência.'} warning={stage === 1} /><div className="repo19-commit-compare"><span><b>Vago</b><code>update</code><small>não revela intenção</small></span><span className="good"><b>Recuperável</b><code>docs: organiza estrutura inicial da formacao</code><small>uma mudança principal</small></span></div><button type="button" className="repo19-next" disabled={stage === GIT_STAGES.length - 1} onClick={() => setStage(value => value + 1)}>Próximo estado <ArrowRight size={16} /></button></section>;
}

const ERRORS = [
  ['Tudo na raiz', 'Código, prints, SQL e anotações competem no mesmo nível.', 'Classifique por responsabilidade e mova em uma mudança separada e revisada.'],
  ['Nome frágil', 'Espaço, acento, “novo”, “final2” ou “teste1” escondem intenção.', 'Escolha nome técnico descritivo e verifique referências antes de renomear.'],
  ['Commit sem revisão', '`git add .` seguido de commit vago captura surpresas.', 'Volte ao status/diff, prepare nominalmente e leia o staged.'],
  ['Gerado versionado', '`target`, `build`, `.class`, logs ou estado da IDE aparecem.', 'Identifique a origem, corrija `.gitignore` e trate rastreamento existente com cuidado.'],
  ['Segredo versionado', 'Senha, token, `.env` ou export autenticado entra no diff.', 'Pare, revogue/rotacione se exposto e substitua por exemplo seguro; não apenas apague o último arquivo.'],
  ['docs abandonado', 'Arquivos existem, mas não registram estado ou decisão.', 'Atualize o documento responsável junto da mudança técnica.'],
  ['labs virou lixeira', 'Experimentos não têm nome, objetivo ou saída.', 'Defina regra no README; promova, descarte ou organize cada item conscientemente.'],
  ['main e test misturados', 'Teste fica junto do código principal.', 'Separe `src/main/java` e `src/test/java`; ajuste referências quando houver projeto real.'],
  ['README obsoleto', 'A árvore mudou, mas a porta de entrada mente.', 'Atualize mapa e comandos no mesmo commit estrutural.'],
  ['Reorganização ansiosa', 'Arquivos existentes são movidos/apagados em massa.', 'Pare, inventarie, faça mudanças pequenas e preserve um diff revisável.']
];

function ErrorClinic() {
  const [active, setActive] = useState(0);
  const item = ERRORS[active];
  return <section className="repo19-errors"><nav>{ERRORS.map((entry, index) => <button type="button" className={active === index ? 'active' : ''} onClick={() => setActive(index)} key={entry[0]}><span>{index + 1}</span>{entry[0]}</button>)}</nav><article><header><AlertTriangle size={25} /><div><small>SINTOMA E CONSEQUÊNCIA</small><h3>{item[1]}</h3></div></header><div><section><small>CORREÇÃO CONTROLADA</small><p>{item[2]}</p></section><ChevronRight /><section><small>NOVA PROVA</small><p>Confira árvore, `git status`, diff nominal e staged antes do commit.</p></section></div><p><ShieldCheck size={18} />Organizar não autoriza apagar. Se o repositório já contém trabalho, adapte a referência ao contexto real.</p></article></section>;
}

const FINAL_CHECKS = [
  'README.md explica propósito e estrutura', '.gitignore protege gerados e segredos',
  'docs contém ambiente, atalhos, diário e checklist', 'src/main/java está separado de src/test/java',
  'labs possui README e limite', 'nomes são técnicos e recuperáveis',
  'nenhuma credencial aparece no diff', 'staged diff foi lido',
  'commit possui uma intenção', 'git status final foi conferido'
];

function DeliveryLab() {
  const [checked, setChecked] = useState(new Set());
  const toggle = index => setChecked(previous => { const next = new Set(previous); if (next.has(index)) next.delete(index); else next.add(index); return next; });
  return <section className="repo19-delivery"><div className="repo19-checklist">{FINAL_CHECKS.map((item, index) => <button type="button" className={checked.has(index) ? 'done' : ''} onClick={() => toggle(index)} key={item}><span>{checked.has(index) ? <Check size={13} /> : index + 1}</span>{item}</button>)}</div><div className="repo19-defense"><Wrench size={28} /><div><small>DEFESA ORAL</small><strong>Explique a estrutura sem depender da árvore pronta</strong><span>Por que README fica na raiz? O que pertence a docs? Qual diferença entre main, test e labs? O que `.gitignore` não faz com um arquivo já rastreado? Quando `.gitkeep` deixa de ser útil? Por que revisar o staged?</span></div></div><CodePanel title="PowerShell · critério operacional final" code={'git status --short\ngit diff --staged --check\ngit diff --staged'} note="Se o commit já foi criado, o staged pode estar vazio. Nesse caso, use `git show --stat --oneline HEAD` e `git show HEAD` para revisar o último commit." /><div className={`repo19-delivery-status ${checked.size === FINAL_CHECKS.length ? 'ready' : ''}`}><ClipboardCheck size={24} /><span><strong>{checked.size} de {FINAL_CHECKS.length} evidências conferidas</strong><small>{checked.size === FINAL_CHECKS.length ? 'Estrutura pronta para a defesa e para a Aula 20.' : 'Checklist não é clique decorativo: confira no repositório real.'}</small></span></div></section>;
}

const steps = [
  { id: 'sentido', label: 'Entender o repositório', duration: '8 min', eyebrow: 'MEMÓRIA TÉCNICA', title: 'Uma pasta guarda arquivos; um repositório conta uma história verificável', blocks: [{ type: 'lead', text: 'Alterne as duas organizações. O objetivo não é ter mais pastas, mas tornar propósito, estado, mudança e evidência recuperáveis por outra pessoa e por você no futuro.' }, { type: 'contrast' }] },
  { id: 'auditoria', label: 'Auditar antes de mudar', duration: '10 min', eyebrow: 'DESCOBERTA SEGURA', title: 'Descubra localização, raiz Git e mudanças antes de criar ou mover qualquer coisa', blocks: [{ type: 'lead', text: 'Escolha o cenário que corresponde à sua máquina. Um repositório existente deve ser adaptado; esta aula não autoriza apagar, sobrescrever ou criar uma cópia paralela sem necessidade.' }, { type: 'audit' }] },
  { id: 'arvore', label: 'Projetar a árvore', duration: '11 min', eyebrow: 'RESPONSABILIDADES', title: 'Raiz, docs, main, test e labs respondem perguntas diferentes', blocks: [{ type: 'lead', text: 'Clique em cada nó e explique o que deve entrar e o que deve ficar fora. A árvore é uma decisão de comunicação, não decoração.' }, { type: 'tree' }] },
  { id: 'construcao', label: 'Criar a estrutura', duration: '15 min', eyebrow: 'POWERSHELL + ÁRVORE', title: 'Crie somente o que falta e observe o resultado após cada grupo', blocks: [{ type: 'lead', text: 'A simulação mantém terminal e árvore sincronizados. Na máquina real, pare se um caminho já existir e leia o conteúdo antes de adaptar.' }, { type: 'build' }] },
  { id: 'readme', label: 'Escrever o README', duration: '11 min', eyebrow: 'PORTA DE ENTRADA', title: 'Propósito, mapa, validação e rotina precisam caber numa leitura rápida', blocks: [{ type: 'lead', text: 'Compare fonte e preview. Um README inicial deve orientar; não precisa duplicar todo o curso.' }, { type: 'readme' }] },
  { id: 'docs', label: 'Organizar documentação', duration: '14 min', eyebrow: 'CONTEXTO RECUPERÁVEL', title: 'Cada documento tem uma responsabilidade e nenhum deles é cofre de segredo', blocks: [{ type: 'lead', text: 'Abra os seis arquivos. As aulas anteriores já produziram conteúdo; agora você organiza o lugar e corrige o que estiver incompleto sem inventar versões ou resultados.' }, { type: 'docs' }] },
  { id: 'limites', label: 'Separar código e labs', duration: '12 min', eyebrow: 'MAIN · TEST · LABS · DOCS', title: 'Classifique cada artefato pelo papel que exerce', blocks: [{ type: 'lead', text: 'Troque o artefato e defenda seu destino. Estruturas futuras aparecem como direção, não como pastas obrigatórias hoje.' }, { type: 'boundaries' }] },
  { id: 'gitignore', label: 'Provar o gitignore', duration: '14 min', eyebrow: 'PROTEÇÃO VERIFICÁVEL', title: 'Uma regra só é compreendida quando você sabe qual caminho ela atinge', blocks: [{ type: 'lead', text: 'Teste gerados, arquivos da IDE, segredos e a exceção `.env.example`. Depois simule um arquivo que já havia sido rastreado.' }, { type: 'ignore' }] },
  { id: 'nomes', label: 'Escolher nomes', duration: '12 min', eyebrow: 'COMUNICAÇÃO PELO CAMINHO', title: 'Nome técnico descreve responsabilidade, não o humor do momento', blocks: [{ type: 'lead', text: 'Corrija nomes frágeis e aplique a mesma disciplina a um domínio corporativo de ordem de serviço.' }, { type: 'naming' }] },
  { id: 'git', label: 'Entregar pelo Git', duration: '14 min', eyebrow: 'WORKING TREE → STAGE → HISTÓRICO', title: 'Revise duas vezes antes de transformar mudança em história', blocks: [{ type: 'lead', text: 'Acompanhe os três estados. A lista nominal de caminhos reduz surpresa e o staged diff mostra exatamente o snapshot que será commitado.' }, { type: 'git' }] },
  { id: 'fechamento', label: 'Diagnosticar e defender', duration: '16 min', eyebrow: 'CLÍNICA + CHECKLIST', title: 'Organização profissional termina em prova, não em aparência', blocks: [{ type: 'lead', text: 'Passe pelos dez erros e depois confira cada evidência no repositório real. A Aula 20 aprofundará o checklist completo do ambiente.' }, { type: 'errors' }, { type: 'delivery' }, { type: 'challenge', title: 'Transferência: repositório existente e bagunçado', text: 'Você encontra `Main.java`, `.env`, `app.log`, `teste final.java` e `README.md` modificado na raiz. O projeto já possui commits e mudanças locais. Descreva uma reorganização segura.', acceptance: ['Você começa por `git status`, diff e inventário, sem apagar.', 'Você trata `.env` como possível incidente de segredo e verifica se já foi rastreado.', 'Você não presume que adicionar `.env` ao `.gitignore` remove histórico.', 'Você separa mudança estrutural de mudanças de conteúdo não relacionadas.', 'Você escolhe nomes e destinos pela responsabilidade.', 'Você revisa staged diff e cria commit pequeno e claro.'] }] }
];

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  const components = { contrast: RepositoryContrast, audit: SafeAudit, tree: TreeDesign, build: BuildLab, readme: ReadmeLab, docs: DocsWorkspace, boundaries: BoundariesLab, ignore: GitignoreLab, naming: NamingLab, git: GitPipeline, errors: ErrorClinic, delivery: DeliveryLab };
  if (components[block.type]) { const Component = components[block.type]; return <Component />; }
  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Wrench size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  return null;
}

export default function GuidedRepositoryStructureLesson019({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-repository-structure-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><FolderOpen size={17} /> Oficina de arquitetura do repositório</span><p className="guided-sequence">019 · M0.19</p><h1>Organize a formação para que cada mudança deixe uma história compreensível</h1><p>Construa raiz, documentação, código, testes e laboratórios com árvore visível, nomes recuperáveis, proteção contra segredos e Git revisado.</p></div><div className="guided-hero-status"><GitBranch size={42} /><strong>{progress}%</strong><span>{label}</span></div><div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}><span style={{ width: `${progress}%` }} /></div></header><GuidedLessonFacts ariaLabel="Resultado da aula" items={[{ value: 4, label: 'áreas separadas' }, { value: 14, label: 'regras de ignore provadas' }, { value: 10, label: 'falhas estruturais tratadas' }]} /><div className="guided-layout"><nav className="guided-step-nav" aria-label="Etapas da aula 019"><div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>{steps.map((step, index) => <button type="button" key={step.id} className={`${index === activeIndex ? 'active ' : ''}${completed.has(step.id) ? 'done' : ''}`} onClick={() => select(index)}><span className="guided-step-number">{completed.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{active.eyebrow} · {active.duration}</span><h2>{active.title}</h2></div><div className="guided-blocks">{active.blocks.map((block, index) => <ContentBlock block={block} key={`${active.id}-${block.type}-${index}`} />)}</div><div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => select(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${activeDone ? 'undo' : 'complete'}`} onClick={toggle}>{activeDone ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><Check size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeDone} onClick={() => select(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div></div>{allDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>{lessonDone ? 'Repositório estruturado' : 'Oficina concluída'}</h3><p>{lessonDone ? 'Árvore, documentos, proteção, nomes e histórico foram defendidos.' : 'Conclua a aula para liberar o checklist final do ambiente.'}</p></div><button type="button" className={lessonDone ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonDone ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 018</button><div className={`guided-course-status ${lessonDone ? 'completed' : allDone ? 'ready' : ''}`}>{lessonDone ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonDone ? 'Aula concluída' : allDone ? 'Pronta para concluir' : `${completed.size} de ${steps.length} etapas`}</strong><small>{lessonDone ? 'Estrutura recuperável e revisada' : allDone ? 'Use o botão acima' : 'Auditar, organizar, proteger e versionar'}</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonDone}>Aula 020 <ArrowRight size={17} /></button></footer></article>;
}
