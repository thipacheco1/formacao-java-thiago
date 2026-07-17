import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronRight,
  ClipboardCheck, Clock3, Copy, Database, Download,
  ExternalLink, Eye, EyeOff, GitCommit, KeyRound,
  Laptop, Lightbulb, ListChecks, Network, Play, Plug, RotateCcw, SearchCheck,
  Server, ShieldCheck, TerminalSquare, Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedPostgresDBeaverLesson.css';

const STORAGE_KEY = 'guided-postgres-dbeaver-lesson-016-progress';
const PG_VERSION = '18';
const DBEAVER_VERSION = '26.1.2';
const PG_DOWNLOAD = 'https://www.postgresql.org/download/windows/';
const DBEAVER_DOWNLOAD = 'https://dbeaver.io/download/';

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard?.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); };
  return <button type="button" className="pg16-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : 'Copiar'}</button>;
}

function CodeWindow({ title, code, output, language = 'powershell', note, error = false }) {
  return <section className="pg16-code"><header><span><TerminalSquare size={16} />{title}</span><CopyButton value={code} /></header><SyntaxHighlighter style={vscDarkPlus} language={language} PreTag="div" customStyle={{ margin: 0, borderRadius: 0, fontSize: '.73rem', lineHeight: 1.65, padding: '16px' }}>{code}</SyntaxHighlighter>{output && <div className="pg16-output"><small>SAÍDA ESPERADA · VALORES PODEM VARIAR</small><pre>{output}</pre></div>}{note && <footer className={error ? 'error' : ''}>{error ? <AlertTriangle size={17} /> : <SearchCheck size={17} />}<span>{note}</span></footer>}</section>;
}

function ArchitectureMap() {
  const [active, setActive] = useState(0);
  const nodes = [
    { icon: Laptop, label: 'DBeaver / psql', kind: 'cliente', text: 'O cliente envia comandos e mostra respostas. Fechá-lo não desliga o banco.' },
    { icon: Plug, label: 'Driver PostgreSQL', kind: 'tradutor', text: 'O driver implementa a comunicação. Driver ausente não significa servidor parado.' },
    { icon: Network, label: 'localhost:5432', kind: 'endereço', text: 'Host encontra a máquina; porta encontra o processo servidor nessa máquina.' },
    { icon: Server, label: 'Serviço PostgreSQL', kind: 'servidor', text: 'Processo do Windows que aceita conexões e administra vários bancos.' },
    { icon: Database, label: 'curso_java', kind: 'database', text: 'Um banco específico dentro da instância. Não é pasta nem aplicativo DBeaver.' }
  ];
  const selected = nodes[active]; const Icon = selected.icon;
  return <section className="pg16-architecture"><div className="pg16-flow" role="tablist">{nodes.map((node, index) => { const NodeIcon = node.icon; return <React.Fragment key={node.label}><button type="button" className={active === index ? 'active' : ''} onClick={() => setActive(index)}><NodeIcon size={23} /><strong>{node.label}</strong><small>{node.kind}</small></button>{index < nodes.length - 1 && <ChevronRight size={18} />}</React.Fragment>; })}</div><article><Icon size={32} /><div><small>{selected.kind.toUpperCase()}</small><h3>{selected.label}</h3><p>{selected.text}</p></div></article><div className="pg16-contract"><code>jdbc:postgresql://localhost:5432/curso_java</code><span><b>jdbc:postgresql</b> protocolo</span><span><b>localhost</b> host</span><span><b>5432</b> porta</span><span><b>curso_java</b> banco</span></div></section>;
}

function VersionChoice() {
  const [choice, setChoice] = useState('stable');
  return <section className="pg16-download"><div className="pg16-browser"><span>● ● ●</span><code>postgresql.org/download/windows</code><em>SIMULAÇÃO DIDÁTICA · FONTE OFICIAL</em></div><div className="pg16-download-body"><header><div><small>WINDOWS INSTALLERS</small><h3>Interactive installer by EDB</h3><p>Servidor, pgAdmin, StackBuilder e ferramentas de linha de comando.</p></div><a href={PG_DOWNLOAD} target="_blank" rel="noreferrer">Fonte oficial <ExternalLink size={15} /></a></header><div className="pg16-version-options"><button type="button" className={choice === 'stable' ? 'selected' : ''} onClick={() => setChoice('stable')}><ShieldCheck size={24} /><span><strong>PostgreSQL {PG_VERSION}</strong><small>Versão atual suportada e estável</small></span>{choice === 'stable' && <CheckCircle2 size={18} />}</button><button type="button" className={choice === 'beta' ? 'selected warning' : ''} onClick={() => setChoice('beta')}><AlertTriangle size={24} /><span><strong>PostgreSQL 19 Beta 2</strong><small>Desenvolvimento; não é nossa escolha de ambiente</small></span></button></div><p className={choice === 'stable' ? 'ok' : 'warn'}>{choice === 'stable' ? 'Escolha adequada: instalação suportada para o laboratório.' : 'Volte à estável. Beta serve para avaliação antecipada, não como base desta formação.'}</p></div><div className="pg16-dbeaver-download"><div><Database size={28} /><span><small>CLIENTE GRÁFICO</small><strong>DBeaver Community {DBEAVER_VERSION}</strong><p>Windows installer com OpenJDK incluído. Não instala o servidor PostgreSQL.</p></span></div><a href={DBEAVER_DOWNLOAD} target="_blank" rel="noreferrer"><Download size={16} /> Download oficial</a></div></section>;
}

const INSTALL_PAGES = [
  { title: 'Installation Directory', value: 'C:\\Program Files\\PostgreSQL\\18', text: 'Arquivos executáveis. Não é o local onde ficam seus bancos.' },
  { title: 'Select Components', value: 'PostgreSQL Server ✓ · Command Line Tools ✓ · pgAdmin opcional · StackBuilder opcional', text: 'Servidor e ferramentas de terminal são essenciais. DBeaver será nosso cliente principal; StackBuilder não é necessário agora.' },
  { title: 'Data Directory', value: 'C:\\Program Files\\PostgreSQL\\18\\data', text: 'Cluster: dados e configurações da instância. Não mova, sincronize ou edite arquivos internos manualmente.' },
  { title: 'Password', value: '••••••••••••', text: 'Senha do papel administrador `postgres`. Use valor forte e local; não coloque em código, print, diário ou Git.' },
  { title: 'Port', value: '5432', text: 'Porta padrão. Se estiver ocupada, escolha outra conscientemente e use a mesma em todos os clientes.' },
  { title: 'Advanced Options', value: 'Locale: Default locale', text: 'Mantenha o padrão neste preparo. Locale influencia ordenação e comportamento linguístico; não escolha ao acaso.' },
  { title: 'Pre Installation Summary', value: 'Server 18 · data · port 5432 · locale default', text: 'Antes de instalar, recite pasta, dados, usuário e porta. A senha deve estar guardada fora desta documentação.' }
];

function InstallerWizard() {
  const [page, setPage] = useState(0); const [show, setShow] = useState(false); const current = INSTALL_PAGES[page];
  return <section className="pg16-installer"><header><span>PostgreSQL Setup Wizard</span><em>SIMULAÇÃO DIDÁTICA DO INSTALADOR</em></header><div className="pg16-installer-body"><aside>{INSTALL_PAGES.map((item, index) => <button type="button" className={index === page ? 'active' : index < page ? 'done' : ''} onClick={() => setPage(index)} key={item.title}><span>{index < page ? <Check size={12} /> : index + 1}</span>{item.title}</button>)}</aside><main><div className="pg16-elephant"><Database size={45} /></div><small>ETAPA {page + 1} DE {INSTALL_PAGES.length}</small><h3>{current.title}</h3><label>Valor recomendado<div className="pg16-field"><code>{page === 3 && !show ? '••••••••••••' : current.value}</code>{page === 3 && <button type="button" onClick={() => setShow(value => !value)} aria-label={show ? 'Ocultar senha ilustrativa' : 'Mostrar que a senha não será registrada'}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>}</div></label><p><Lightbulb size={18} />{current.text}</p><button type="button" className="pg16-next" disabled={page === INSTALL_PAGES.length - 1} onClick={() => setPage(value => value + 1)}>Next <ArrowRight size={16} /></button></main></div></section>;
}

function ServiceProof() {
  const [state, setState] = useState('running');
  const output = state === 'running' ? 'Status   Name                 DisplayName\n------   ----                 -----------\nRunning  postgresql-x64-18    postgresql-x64-18\n\nLocalAddress LocalPort State  OwningProcess\n------------ --------- -----  -------------\n::           5432      Listen 8240' : 'Status   Name                 DisplayName\n------   ----                 -----------\nStopped  postgresql-x64-18    postgresql-x64-18\n\n(nenhuma conexão TCP na porta 5432)';
  return <section className="pg16-service"><nav><button type="button" className={state === 'running' ? 'active' : ''} onClick={() => setState('running')}><Play size={16} /> Serviço ativo</button><button type="button" className={state === 'stopped' ? 'active' : ''} onClick={() => setState('stopped')}><AlertTriangle size={16} /> Serviço parado</button></nav><CodeWindow title="PowerShell — duas provas diferentes" code={'Get-Service -Name "postgresql*"\nGet-NetTCPConnection -LocalPort 5432 -State Listen -ErrorAction SilentlyContinue'} output={output} note={state === 'running' ? 'Running prova o serviço; Listen prova que um processo aceita conexões na porta. Ainda falta autenticar e executar SQL.' : 'Abra Serviços do Windows ou use Start-Service em terminal administrativo autorizado. Depois repita as duas provas.'} error={state === 'stopped'} /><div className="pg16-proof-chain"><span className={state === 'running' ? 'done' : ''}>1 Serviço</span><ChevronRight /><span className={state === 'running' ? 'done' : ''}>2 Porta</span><ChevronRight /><span>3 Login</span><ChevronRight /><span>4 SQL</span></div></section>;
}

function PsqlLab() {
  const [stage, setStage] = useState(0);
  const stages = [
    { label: 'Localizar', code: 'where.exe psql\npsql --version', output: 'C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe\npsql (PostgreSQL) 18.x', note: 'Se não estiver no PATH, use o caminho absoluto. Isso não diz se o servidor está ativo.' },
    { label: 'Conectar', code: 'psql -h localhost -p 5432 -U postgres -d postgres', output: 'Senha para o usuário postgres: [digite; não aparece]\npsql (18.x)\npostgres=#', note: 'O prompt `postgres=#` prova rede e autenticação no banco postgres. `#` também indica sessão de superusuário: use com cuidado.' },
    { label: 'Criar banco', code: 'CREATE DATABASE curso_java;\n\\l curso_java', output: 'CREATE DATABASE\n                                                Lista de bancos de dados\n    Nome    |   Dono   | Codificação\n------------+----------+-------------\n curso_java | postgres | UTF8', note: 'Criamos somente o contêiner didático. Modelagem, tabelas e SQL profundo permanecem para as aulas próprias.' },
    { label: 'Provar identidade', code: '\\c curso_java\nSELECT version(), current_database(), current_user, inet_server_addr(), inet_server_port();', output: 'Você está conectado ao banco de dados "curso_java" como usuário "postgres".\n version       | current_database | current_user | inet_server_addr | inet_server_port\n---------------+------------------+--------------+------------------+-----------------\n PostgreSQL 18 | curso_java       | postgres     | ::1              | 5432\n(1 linha)', note: 'Uma linha prova versão, banco, usuário, endereço e porta observados pela própria sessão.' },
    { label: 'Sair', code: '\\q', output: 'PS C:\\dev\\formacao-java-thiago>', note: '`\\q` fecha apenas o cliente psql. O serviço PostgreSQL continua ativo.' }
  ]; const item = stages[stage];
  return <section className="pg16-psql"><nav>{stages.map((entry, index) => <button type="button" className={stage === index ? 'active' : index < stage ? 'done' : ''} onClick={() => setStage(index)} key={entry.label}><span>{index < stage ? <Check size={12} /> : index + 1}</span>{entry.label}</button>)}</nav><CodeWindow title={stage >= 2 && stage <= 3 ? 'psql — SQL e metacomandos' : 'PowerShell / psql'} code={item.code} output={item.output} language={stage === 2 || stage === 3 ? 'sql' : 'powershell'} note={item.note} /><button type="button" className="pg16-next" disabled={stage === stages.length - 1} onClick={() => setStage(value => value + 1)}>Próxima prova <ArrowRight size={16} /></button></section>;
}

function DBeaverInstall() {
  const [stage, setStage] = useState(0);
  const states = [
    { title: 'DBeaver Community Setup', text: 'Instale a Community Edition pelo executável oficial. A distribuição atual inclui OpenJDK; não aponte para seu JDK do curso sem necessidade.', action: 'Next' },
    { title: 'Choose Users', text: 'Instalar para o usuário atual reduz pedidos administrativos quando a política da máquina permitir.', action: 'Next' },
    { title: 'Choose Components', text: 'DBeaver Community e associação de arquivos SQL são suficientes. Atalhos são preferência pessoal.', action: 'Install' },
    { title: 'DBeaver Community', text: 'No primeiro início, mantenha o workspace padrão e não importe configurações desconhecidas.', action: 'Launch' },
    { title: 'Driver PostgreSQL', text: 'Ao criar a primeira conexão, o DBeaver pode baixar o driver JDBC. Isso exige rede, mas não instala nem inicia o servidor.', action: 'Download' }
  ]; const item = states[stage];
  return <section className="pg16-dbeaver-install"><header><span>DBeaver Community</span><em>SIMULAÇÃO DIDÁTICA · INTERFACE PODE VARIAR</em></header><div><aside><Database size={56} /><strong>{item.title}</strong><span>{stage + 1} / {states.length}</span></aside><main><h3>{item.title}</h3><p>{item.text}</p>{stage === 4 && <div className="pg16-driver"><Plug size={24} /><span><strong>PostgreSQL JDBC Driver</strong><small>Biblioteca cliente, obtida do repositório configurado.</small></span></div>}<button type="button" className="pg16-next" disabled={stage === states.length - 1} onClick={() => setStage(value => value + 1)}>{item.action} <ArrowRight size={16} /></button></main></div></section>;
}

function ConnectionWizard() {
  const [port, setPort] = useState('5432'); const [database, setDatabase] = useState('curso_java'); const [tested, setTested] = useState(false); const [password, setPassword] = useState('');
  const valid = port === '5432' && database === 'curso_java' && password.length > 0;
  return <section className="pg16-connection"><header><span><Plug size={17} /> Connect to a database · PostgreSQL</span><em>SIMULAÇÃO DIDÁTICA DO DBEAVER</em></header><div className="pg16-connection-body"><aside><strong>All</strong><span>Popular</span><b>PostgreSQL</b><span>MySQL</span><span>SQLite</span></aside><main><div className="pg16-form-grid"><label>Host<input value="localhost" readOnly /></label><label>Port<input value={port} onChange={event => { setPort(event.target.value); setTested(false); }} /></label><label>Database<input value={database} onChange={event => { setDatabase(event.target.value); setTested(false); }} /></label><label>Username<input value="postgres" readOnly /></label><label className="wide">Password<input type="password" value={password} placeholder="Digite sua senha local" onChange={event => { setPassword(event.target.value); setTested(false); }} /></label></div><div className="pg16-jdbc"><small>URL DERIVADA</small><code>jdbc:postgresql://localhost:{port}/{database}</code></div><div className="pg16-test-row"><button type="button" onClick={() => setTested(true)}>Test Connection...</button>{tested && <span className={valid ? 'ok' : 'bad'}>{valid ? '✓ Connected · PostgreSQL 18.x' : port !== '5432' ? '✕ Connection refused: confira a porta.' : database !== 'curso_java' ? `✕ database "${database}" does not exist` : '✕ informe a senha local para autenticar.'}</span>}</div><p><KeyRound size={17} />Durante o aprendizado, prefira não salvar a senha. Nunca use `postgres`/`postgres` e nunca registre a credencial em documentação.</p></main></div></section>;
}

function SqlEditor() {
  const [executed, setExecuted] = useState(false);
  const sql = 'SELECT\n    version() AS versao,\n    current_database() AS banco,\n    current_user AS usuario,\n    inet_server_port() AS porta;';
  return <section className="pg16-editor"><header><span>DBeaver · curso_java</span><em>SIMULAÇÃO DIDÁTICA</em></header><div className="pg16-editor-body"><aside><strong>Database Navigator</strong><span>▼ PostgreSQL local</span><span>&nbsp;&nbsp;▼ Databases</span><b>&nbsp;&nbsp;&nbsp;&nbsp;curso_java</b><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Schemas</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tables</span></aside><main><div className="pg16-editor-tabs"><span>Script-1.sql</span><button type="button" onClick={() => setExecuted(true)}><Play size={15} /> Executar instrução</button></div><SyntaxHighlighter style={vscDarkPlus} language="sql" PreTag="div" customStyle={{ margin: 0, borderRadius: 0, fontSize: '.74rem', minHeight: 170 }}>{sql}</SyntaxHighlighter><div className="pg16-results"><small>RESULTADOS {executed ? '· 1 LINHA' : '· AGUARDANDO EXECUÇÃO'}</small>{executed ? <table><thead><tr><th>versao</th><th>banco</th><th>usuario</th><th>porta</th></tr></thead><tbody><tr><td>PostgreSQL 18.x</td><td>curso_java</td><td>postgres</td><td>5432</td></tr></tbody></table> : <p>Selecione a instrução ou deixe o cursor nela e clique em Executar.</p>}</div></main></div><footer><SearchCheck size={18} /><span><strong>Leia o contexto antes do resultado.</strong> Uma consulta pode executar com sucesso no banco, usuário ou ambiente errado. Confira o seletor de conexão e a identidade retornada.</span></footer></section>;
}

const ERRORS = [
  ['Connection refused', 'Nada aceitou a conexão no host/porta.', 'Get-Service "postgresql*"\nGet-NetTCPConnection -LocalPort 5432', 'Inicie o serviço correto ou alinhe a porta do cliente; depois repita o teste.'],
  ['password authentication failed', 'Servidor foi alcançado, mas rejeitou a credencial.', 'Confirme usuário, Caps Lock e qual instalação criou a senha.', 'Digite novamente; se realmente esqueceu, siga recuperação administrativa oficial — não reinstale por impulso.'],
  ['database does not exist', 'Rede e autenticação podem estar corretas; o banco solicitado não existe nessa instância.', 'psql -h localhost -p 5432 -U postgres -d postgres -c "\\l"', 'Crie `curso_java` no servidor correto ou corrija o nome no cliente.'],
  ['Porta 5432 ocupada', 'Instalador ou servidor não consegue usar a porta padrão.', 'Get-NetTCPConnection -LocalPort 5432 | Select LocalAddress,OwningProcess\nGet-Process -Id <PID>', 'Identifique o processo. Não encerre algo desconhecido; escolha uma porta livre e documente-a.'],
  ['Driver download failed', 'DBeaver não obteve a biblioteca JDBC.', 'Verifique rede, proxy autorizado e Driver Manager.', 'Corrija acesso no DBeaver; isso não exige reinstalar PostgreSQL.'],
  ['psql não é reconhecido', 'O cliente CLI não está no PATH.', 'Test-Path "C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe"', 'Use caminho absoluto ou adicione o `bin` ao PATH e abra outro terminal. O serviço pode estar saudável.'],
  ['Servidor errado', 'A consulta funciona, mas retorna banco/porta/versão inesperados.', 'SELECT version(), current_database(), current_user, inet_server_addr(), inet_server_port();', 'Corrija host, porta e database; nomeie a conexão pelo ambiente real.'],
  ['Senha exposta', 'Credencial apareceu em print, arquivo, histórico ou Git.', 'Pare de compartilhar e identifique onde foi publicada.', 'Troque a senha, remova a exposição conforme política e evite comandos com senha literal.']
];

function ErrorClinic() {
  const [active, setActive] = useState(0); const item = ERRORS[active];
  return <section className="pg16-errors"><nav>{ERRORS.map((entry, index) => <button type="button" className={active === index ? 'active' : ''} onClick={() => setActive(index)} key={entry[0]}><span>{index + 1}</span>{entry[0]}</button>)}</nav><article><header><AlertTriangle size={23} /><div><small>SINTOMA</small><h3>{item[0]}</h3><p>{item[1]}</p></div></header><div><section><small>1 · PROVE A CAMADA</small><SyntaxHighlighter style={vscDarkPlus} language={item[0] === 'Servidor errado' ? 'sql' : 'powershell'} PreTag="div" customStyle={{ margin: 0, borderRadius: 7, fontSize: '.67rem' }}>{item[2]}</SyntaxHighlighter></section><section><small>2 · CORRIJA E CONFIRME</small><p>{item[3]}</p></section></div></article></section>;
}

const ENV_DOC = `## PostgreSQL e DBeaver

- PostgreSQL: 18.x (valor observado)
- Serviço: postgresql-x64-18
- Host: localhost
- Porta: 5432
- Banco didático: curso_java
- Usuário de laboratório: postgres
- DBeaver Community: ${DBEAVER_VERSION}
- Provas: serviço Running, porta Listen e consulta de identidade

> Senhas não são registradas neste repositório.`;

function Delivery() {
  const [stage, setStage] = useState(0);
  const states = [
    ['Registrar sem segredo', 'Adicione a seção PostgreSQL/DBeaver em docs/ambiente.md.', ENV_DOC],
    ['Revisar', 'Prove que não há senha, instalador ou arquivo de dados no diff.', 'git status --short\ngit diff -- docs/ambiente.md'],
    ['Preparar', 'Adicione somente o documento deliberado.', 'git add docs/ambiente.md\ngit diff --staged --check\ngit diff --staged'],
    ['Commitar', 'Registre a configuração reproduzível e confirme árvore limpa.', 'git commit -m "docs: registra ambiente PostgreSQL local"\ngit status --short']
  ]; const item = states[stage];
  return <section className="pg16-delivery"><nav>{states.map((entry, index) => <button type="button" className={stage === index ? 'active' : index < stage ? 'done' : ''} onClick={() => setStage(index)} key={entry[0]}><span>{index < stage ? <Check size={12} /> : index + 1}</span>{entry[0]}</button>)}</nav><div className="pg16-delivery-main"><article><small>{item[1]}</small><SyntaxHighlighter style={vscDarkPlus} language={stage === 0 ? 'markdown' : 'powershell'} PreTag="div" customStyle={{ margin: 0, borderRadius: 8, fontSize: '.69rem', minHeight: 200 }}>{item[2]}</SyntaxHighlighter></article><aside><GitCommit size={28} /><small>DEFESA ORAL</small><strong>Sem abrir a aula, explique:</strong><p>O que continua rodando quando o DBeaver fecha? Qual camada a porta identifica? Como provar banco e usuário atuais? Por que um driver ausente não significa serviço parado?</p></aside></div><button type="button" className="pg16-next" disabled={stage === states.length - 1} onClick={() => setStage(value => value + 1)}>Próximo estado <ArrowRight size={16} /></button></section>;
}

const steps = [
  { id: 'mapa', label: 'Mapear as camadas', duration: '8 min', eyebrow: 'MODELO MENTAL', title: 'Servidor, banco, cliente e driver são peças diferentes', blocks: [{ type: 'lead', text: 'Antes de instalar, vamos eliminar a confusão que mais atrapalha iniciantes: DBeaver não é o banco, porta não é database e driver não inicia servidor.' }, { type: 'architecture' }, { type: 'note', title: 'Um servidor, muitos bancos e clientes', text: 'A instância PostgreSQL pode administrar vários databases e atender simultaneamente `psql`, DBeaver e, futuramente, sua aplicação Java.' }] },
  { id: 'versoes', label: 'Escolher as versões', duration: '8 min', eyebrow: 'FONTES OFICIAIS', title: 'Use a versão estável do servidor e a Community Edition do cliente', blocks: [{ type: 'lead', text: 'Em 17/07/2026, PostgreSQL 18 é a versão atual suportada; PostgreSQL 19 ainda é beta. O DBeaver muda rapidamente, então confirme o instalador Community atual na fonte oficial quando repetir o processo.' }, { type: 'versions' }] },
  { id: 'instalar-pg', label: 'Instalar PostgreSQL', duration: '15 min', eyebrow: 'WIZARD DO WINDOWS', title: 'Cada tela do instalador cria uma decisão que você precisará lembrar', blocks: [{ type: 'lead', text: 'Percorra o instalador comigo. Não clique em Next mecanicamente: nomeie arquivos, dados, componentes, usuário, senha, porta e locale.' }, { type: 'installer' }, { type: 'note', tone: 'warning', title: 'A senha não entra em nenhum material do curso', text: 'Guarde-a em memória ou gerenciador seguro. Prints, `docs/ambiente.md`, código Java, terminal com argumento literal e Git não são cofres.' }] },
  { id: 'servico', label: 'Provar serviço e porta', duration: '10 min', eyebrow: 'WINDOWS + POWERSHELL', title: 'Instalado não significa iniciado — prove processo e listener', blocks: [{ type: 'lead', text: 'Vamos verificar duas camadas sem abrir interface: o serviço do Windows e o socket TCP que realmente escuta a porta.' }, { type: 'service' }] },
  { id: 'psql', label: 'Validar com psql', duration: '15 min', eyebrow: 'CLIENTE DE TERMINAL', title: 'Autentique, crie o banco didático e pergunte à própria sessão quem ela é', blocks: [{ type: 'lead', text: 'Agora completamos as quatro provas. Digite a senha apenas no prompt seguro; em seguida, crie o database do curso e execute uma consulta de identidade.' }, { type: 'psql' }] },
  { id: 'dbeaver', label: 'Instalar DBeaver', duration: '10 min', eyebrow: 'CLIENTE GRÁFICO', title: 'Instale a interface sem confundi-la com o servidor ou o JDK do curso', blocks: [{ type: 'lead', text: 'DBeaver é um aplicativo Java independente, com runtime incluído. O driver PostgreSQL será a biblioteca de comunicação; nenhum desses itens substitui o serviço já validado.' }, { type: 'dbeaverInstall' }] },
  { id: 'conexao', label: 'Criar a conexão', duration: '12 min', eyebrow: 'NEW DATABASE CONNECTION', title: 'Preencha o contrato de conexão e interprete o Test Connection', blocks: [{ type: 'lead', text: 'Cada campo precisa combinar com o ambiente que provamos no terminal. Digite qualquer valor no campo de senha desta simulação para testar os estados.' }, { type: 'connection' }, { type: 'note', title: 'Nomeie pelo ambiente', text: 'Use algo como `PostgreSQL local · curso_java`. Em projetos reais, distinguir local, desenvolvimento, homologação e produção evita operações no alvo errado.' }] },
  { id: 'sql', label: 'Executar o primeiro SQL', duration: '10 min', eyebrow: 'NAVIGATOR + SQL EDITOR', title: 'Uma grade verde não basta: confira a conexão e a identidade retornada', blocks: [{ type: 'lead', text: 'Abra o SQL Editor a partir da conexão `curso_java`, execute a consulta e leia banco, usuário e porta antes de comemorar o sucesso.' }, { type: 'editor' }, { type: 'result', title: 'Limite desta preparação', items: ['Você sabe conectar e observar contexto.', 'Ainda não estamos modelando tabelas nem estudando SQL profundamente.', 'O objetivo é deixar a ferramenta pronta e diagnosticável para o currículo posterior.'] }] },
  { id: 'erros', label: 'Recuperar falhas', duration: '14 min', eyebrow: 'CLÍNICA POR CAMADAS', title: 'A mensagem indica até onde a conexão chegou', blocks: [{ type: 'lead', text: 'Connection refused, senha rejeitada e banco inexistente não são o mesmo problema. Escolha cada cenário e pratique uma única correção baseada em evidência.' }, { type: 'errors' }] },
  { id: 'entrega', label: 'Documentar e defender', duration: '12 min', eyebrow: 'EVIDÊNCIA SEM SEGREDO', title: 'Registre o ambiente reproduzível, nunca a credencial', blocks: [{ type: 'lead', text: 'Feche a preparação com um documento curto, Git nominal e uma defesa oral capaz de diagnosticar sem depender dos cliques desta aula.' }, { type: 'delivery' }, { type: 'challenge', title: 'Transferência: descubra a camada quebrada', text: 'O DBeaver mostra `database curso_java does not exist`, enquanto `Get-Service` mostra Running. Explique o que já foi provado, o que ainda falta e os dois próximos comandos seguros.', acceptance: ['Você não manda reinstalar o PostgreSQL.', 'Você reconhece que o servidor foi alcançado.', 'Você lista os bancos na mesma instância e porta.', 'Você cria o banco somente se estiver no servidor correto e tiver autorização.', 'Você repete a consulta de identidade após corrigir.'] }] }
];

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  const components = { architecture: ArchitectureMap, versions: VersionChoice, installer: InstallerWizard, service: ServiceProof, psql: PsqlLab, dbeaverInstall: DBeaverInstall, connection: ConnectionWizard, editor: SqlEditor, errors: ErrorClinic, delivery: Delivery };
  if (components[block.type]) { const Component = components[block.type]; return <Component />; }
  if (block.type === 'note') { const Icon = block.tone === 'warning' ? AlertTriangle : Lightbulb; return <aside className={`guided-note ${block.tone || 'info'}`}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>; }
  if (block.type === 'result') return <section className="guided-result"><h3><ClipboardCheck size={20} />{block.title}</h3><ul>{block.items.map(item => <li key={item}><CheckCircle2 size={16} />{item}</li>)}</ul></section>;
  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Wrench size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  return null;
}

export default function GuidedPostgresDBeaverLesson016({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0); const normalized = useRef(false);
  const [completed, setCompleted] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return new Set(Array.isArray(saved) ? saved : []); } catch { return new Set(); } });
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed])), [completed]);
  const active = steps[activeIndex]; const progress = Math.round((completed.size / steps.length) * 100); const allDone = completed.size === steps.length; const activeDone = completed.has(active.id); const lessonDone = isCompleted && allDone; const label = useMemo(() => `${completed.size} de ${steps.length} etapas concluídas`, [completed]);
  useEffect(() => { if (normalized.current) return; normalized.current = true; if (isCompleted && !allDone) onToggleCompleted(); }, [allDone, isCompleted, onToggleCompleted]);
  const select = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const toggle = () => { if (activeDone && isCompleted) onToggleCompleted(); setCompleted(previous => { const next = new Set(previous); if (next.has(active.id)) next.delete(active.id); else next.add(active.id); return next; }); };
  return <article className="guided-git-lesson guided-postgres-dbeaver-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Database size={17} /> Laboratório de banco local</span><p className="guided-sequence">016 · M0.16</p><h1>Prepare PostgreSQL e DBeaver entendendo cada camada da conexão</h1><p>Instale servidor e cliente, prove serviço e porta, conecte com psql e DBeaver e diagnostique falhas sem expor credenciais.</p></div><div className="guided-hero-status"><Server size={42} /><strong>{progress}%</strong><span>{label}</span></div><div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}><span style={{ width: `${progress}%` }} /></div></header><GuidedLessonFacts ariaLabel="Resultado da aula" items={[{ value: 4, label: 'camadas comprovadas' }, { value: 2, label: 'clientes configurados' }, { value: 8, label: 'falhas diagnosticáveis' }]} /><div className="guided-layout"><nav className="guided-step-nav" aria-label="Etapas da aula 016"><div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>{steps.map((step, index) => <button type="button" key={step.id} className={`${index === activeIndex ? 'active ' : ''}${completed.has(step.id) ? 'done' : ''}`} onClick={() => select(index)}><span className="guided-step-number">{completed.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{active.eyebrow} · {active.duration}</span><h2>{active.title}</h2></div><div className="guided-blocks">{active.blocks.map((block, index) => <ContentBlock block={block} key={`${active.id}-${block.type}-${index}`} />)}</div><div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => select(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${activeDone ? 'undo' : 'complete'}`} onClick={toggle}>{activeDone ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><Check size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeDone} onClick={() => select(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div></div>{allDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>{lessonDone ? 'Ambiente PostgreSQL comprovado' : 'Laboratório concluído'}</h3><p>{lessonDone ? 'Servidor, porta, autenticação, banco e clientes foram validados.' : 'Conclua a aula para liberar as ferramentas HTTP.'}</p></div><button type="button" className={lessonDone ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonDone ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 015</button><div className={`guided-course-status ${lessonDone ? 'completed' : allDone ? 'ready' : ''}`}>{lessonDone ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonDone ? 'Aula concluída' : allDone ? 'Pronta para concluir' : `${completed.size} de ${steps.length} etapas`}</strong><small>{lessonDone ? 'Conexão compreendida e comprovada' : allDone ? 'Use o botão acima' : 'Servidor, cliente, conexão e prova'}</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonDone}>Aula 017 <ArrowRight size={17} /></button></footer></article>;
}
