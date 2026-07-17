import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleUserRound,
  ClipboardCheck,
  Clock3,
  Code2,
  Copy,
  Download,
  ExternalLink,
  FileCheck2,
  FileCog,
  FileText,
  FolderGit2,
  GitBranch,
  Globe2,
  HardDrive,
  KeyRound,
  Laptop,
  Layers3,
  Lightbulb,
  ListChecks,
  MonitorCheck,
  Play,
  RefreshCw,
  RotateCcw,
  Search,
  Settings2,
  ShieldCheck,
  TerminalSquare,
  UserCheck,
  Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedGitSetupLesson.css';

const LESSON_STORAGE_KEY = 'guided-git-setup-lesson-009-progress';

const AUDIT_REPORT = [
  '# Auditoria do Git — Aula 009',
  '',
  '## Instalação',
  '- git --version:',
  '- Get-Command git:',
  '- where.exe git:',
  '',
  '## Identidade de autoria',
  '- user.name:',
  '- user.email: não publique o valor real neste documento',
  '- git var GIT_AUTHOR_IDENT: validado / pendente',
  '',
  '## Padrões globais',
  '- init.defaultBranch: main',
  '- core.autocrlf: true (baseline Windows da formação)',
  '- core.editor:',
  '',
  '## Origem',
  '- arquivo global:',
  '- havia chave duplicada ou digitada incorretamente?',
  '',
  '## Diagnóstico realizado',
  '- sintoma:',
  '- comando de inspeção:',
  '- correção:',
  '- evidência final:',
  '',
  '## Limite desta aula',
  '- nenhum repositório foi criado',
  '- nenhum login remoto foi realizado',
  '- o primeiro commit será feito na Aula 010'
].join('\n');

const steps = [
  {
    id: 'mapa',
    label: 'Git, histórico e remoto',
    duration: '8 min',
    eyebrow: 'Comece aqui',
    title: 'Separe a ferramenta local da plataforma remota antes de instalar',
    blocks: [
      { type: 'lead', text: 'Hoje você não vai “subir código”. Vai preparar a ferramenta que registra mudanças no seu computador. Primeiro veja qual problema cada parte resolve; depois cada clique e comando terá uma intenção.' },
      { type: 'gitMap' },
      { type: 'note', tone: 'info', title: 'Resultado observável', text: 'Ao terminar, você terá uma auditoria com versão, executável, identidade, branch padrão, editor, política de quebra de linha e origem de cada configuração. O primeiro repositório continua reservado para a Aula 010.' }
    ]
  },
  {
    id: 'download',
    label: 'Baixar com segurança',
    duration: '9 min',
    eyebrow: 'Etapa 1',
    title: 'Chegue ao instalador oficial e escolha a arquitetura correta',
    blocks: [
      { type: 'lead', text: 'Não procure um arquivo aleatório em sites de download. A página oficial direciona para Git for Windows. A versão muda com o tempo; a origem e a arquitetura precisam estar corretas.' },
      { type: 'downloadPanel' },
      { type: 'note', tone: 'warning', title: '32 bits não é a escolha para uma máquina atual', text: 'O instalador interativo de 32 bits foi encerrado depois da série 2.48. Em Windows x64 moderno, use o instalador x64. ARM64 exige Windows 11 e deve ser uma escolha consciente.' }
    ]
  },
  {
    id: 'instalador',
    label: 'Percorrer o instalador',
    duration: '22 min',
    eyebrow: 'Etapa 2',
    title: 'Entenda cada escolha relevante do Git for Windows',
    blocks: [
      { type: 'lead', text: 'A aparência e a ordem podem variar entre versões. O simulador usa os nomes técnicos atuais das opções para você reconhecer o propósito de cada tela, sem fingir que é uma captura oficial.' },
      { type: 'installerWizard' },
      { type: 'note', tone: 'info', title: 'O que estamos deliberadamente adiando', text: 'Git Credential Manager, HTTPS e OpenSSH ficam instalados, mas autenticação, token, chave e login no navegador só serão usados quando chegar o repositório remoto.' }
    ]
  },
  {
    id: 'path',
    label: 'Validar no PowerShell',
    duration: '12 min',
    eyebrow: 'Etapa 3',
    title: 'Abra um terminal novo e prove qual executável será usado',
    blocks: [
      { type: 'lead', text: 'O instalador pode atualizar o PATH, mas um PowerShell que já estava aberto mantém o ambiente antigo. Feche-o, abra outro e faça três perguntas diferentes: existe Git, qual versão responde e de onde veio o executável.' },
      { type: 'pathAudit' },
      { type: 'note', tone: 'warning', title: 'No PowerShell, use where.exe', text: 'where é um alias de Where-Object. Para chamar o localizador do Windows, escreva where.exe git. Get-Command git é ainda mais claro porque mostra tipo e origem da aplicação.' }
    ]
  },
  {
    id: 'escopos',
    label: 'Ler os escopos',
    duration: '13 min',
    eyebrow: 'Etapa 4',
    title: 'Descubra onde a configuração vive e qual valor vence',
    blocks: [
      { type: 'lead', text: 'Configuração não é uma lista única. Git combina system, global e local. Um valor local pode sobrescrever o global; por isso uma auditoria profissional mostra valor, escopo e arquivo de origem.' },
      { type: 'scopeMap' },
      { type: 'command', title: 'Auditoria sem editar arquivos manualmente', command: 'git config --global --list --show-origin --show-scope', output: 'global  file:C:/Users/SEU_USUARIO/.gitconfig  user.name=Nome Sobrenome\nglobal  file:C:/Users/SEU_USUARIO/.gitconfig  user.email=email@exemplo.com', meaning: 'O caminho e os valores serão os seus. --show-origin revela o arquivo; --show-scope confirma que essas linhas são globais.' }
    ]
  },
  {
    id: 'identidade',
    label: 'Definir identidade',
    duration: '15 min',
    eyebrow: 'Etapa 5',
    title: 'Configure a autoria sem confundi-la com login',
    blocks: [
      { type: 'lead', text: 'user.name e user.email são gravados na autoria dos commits futuros. Eles não fornecem acesso ao GitHub. Use seus dados adequados no computador, mas mantenha exemplos e documentos públicos com placeholders.' },
      { type: 'identityLab' },
      { type: 'command', title: 'Comandos reais — substitua pelos seus dados', command: 'git config --global user.name "Nome Sobrenome"\ngit config --global user.email "email@exemplo.com"\ngit config --global user.name\ngit config --global user.email', output: 'Nome Sobrenome\nemail@exemplo.com', meaning: 'Os dois primeiros comandos normalmente não imprimem nada. As consultas seguintes são a evidência de que os valores foram gravados.' }
    ]
  },
  {
    id: 'padroes',
    label: 'Branch e editor',
    duration: '14 min',
    eyebrow: 'Etapa 6',
    title: 'Defina padrões que evitem surpresa no primeiro repositório',
    blocks: [
      { type: 'lead', text: 'Novos repositórios da formação começarão em main. O editor será usado quando Git precisar de texto sem -m, como em certas operações de commit, merge ou rebase.' },
      { type: 'defaultsLab' },
      { type: 'command', title: 'Configurar e confirmar', command: 'git config --global init.defaultBranch main\ngit config --global core.editor "notepad"\ngit config --global init.defaultBranch\ngit config --global core.editor\ngit var GIT_EDITOR', output: 'main\nnotepad\nnotepad', meaning: 'Uma chave digitada errado também é aceita como uma chave desconhecida. Por isso a consulta exata precisa devolver main.' }
    ]
  },
  {
    id: 'linhas',
    label: 'Decidir LF e CRLF',
    duration: '16 min',
    eyebrow: 'Etapa 7',
    title: 'Veja o que core.autocrlf muda — e o que ele não decide sozinho',
    blocks: [
      { type: 'lead', text: 'Quebra de linha é conteúdo invisível. No Windows, a baseline desta formação é core.autocrlf true: texto entra no índice normalizado em LF e pode voltar ao working tree como CRLF. Um projeto pode versionar outra política com .gitattributes.' },
      { type: 'lineEndingLab' },
      { type: 'command', title: 'Baseline do curso no Windows', command: 'git config --global core.autocrlf true\ngit config --global core.autocrlf', output: 'true', meaning: 'true é uma decisão adequada para este início no Windows, não uma lei universal. Siga a política versionada do projeto quando ela existir.' }
    ]
  },
  {
    id: 'auditoria',
    label: 'Executar a auditoria',
    duration: '20 min',
    eyebrow: 'Etapa 8',
    title: 'Monte a configuração um comando por vez e interprete cada saída',
    blocks: [
      { type: 'lead', text: 'Agora junte a instalação e as configurações em um terminal simulado. Cada execução acrescenta comando, saída e prova. Observe especialmente o silêncio dos comandos de escrita e a diferença entre valor ausente e erro.' },
      { type: 'terminalAudit' },
      { type: 'configRecovery' },
      { type: 'note', tone: 'warning', title: 'Não reinstale para corrigir uma chave', text: 'Rodar git config novamente sobrescreve o valor correto. --unset remove uma chave específica; use-o somente depois de consultar a chave e confirme que ela realmente desapareceu.' }
    ]
  },
  {
    id: 'diagnostico',
    label: 'Diagnosticar e provar',
    duration: '20 min',
    eyebrow: 'Etapa 9',
    title: 'Resolva sintomas reais e entregue uma prova reutilizável',
    blocks: [
      { type: 'lead', text: 'A aula termina quando você consegue investigar um estado diferente do exemplo. Escolha sintomas na clínica, siga inspeção → correção → confirmação e depois produza seu relatório sem expor dados pessoais.' },
      { type: 'diagnosisClinic' },
      { type: 'auditReport' },
      { type: 'result', title: 'Como esta preparação entra na formação', items: ['O diário explica o que você aprendeu; Git registrará a evolução dos arquivos', 'Commits futuros responderão quem, quando, o quê e por quê', 'Mensagens claras e mudanças pequenas facilitarão revisão e recuperação', 'Aula 010 transforma uma pasta comum no primeiro repositório local', 'Aula de GitHub tratará conta, remoto e autenticação sem misturar responsabilidades'] },
      { type: 'challenge', title: 'Desafio de transferência: máquina mal configurada', text: 'Você encontrou uma máquina em que git responde, mas a branch padrão está vazia, existe uma chave parecida chamada init.defaltbranch, o editor é desconhecido e where git não localiza nada. Sem criar repositório, produza uma auditoria corrigida.', acceptance: ['Get-Command git ou where.exe git mostra o executável', 'init.defaultBranch devolve main e a chave incorreta foi investigada', 'user.name e user.email existem sem serem publicados no relatório', 'git var GIT_AUTHOR_IDENT confirma uma identidade utilizável', '--show-origin e --show-scope identificam o arquivo global', 'Nenhum repositório, commit ou login remoto foi criado'] }
    ]
  }
];

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  return <button type="button" className="guided-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function CommandBlock({ title, command, output, meaning }) {
  return <section className="git9-command">
    <header><span><TerminalSquare size={17} /> {title}</span><CopyButton value={command} /></header>
    <SyntaxHighlighter language="powershell" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '16px', background: '#111827', fontSize: '.78rem', lineHeight: 1.65 }}>{command}</SyntaxHighlighter>
    {output && <div className="git9-command-output"><small>Saída esperada ou modelo</small><pre>{output}</pre></div>}
    <footer><CheckCircle2 size={16} /><span><strong>O que prova:</strong> {meaning}</span></footer>
  </section>;
}

function GitMap() {
  const [focus, setFocus] = useState('git');
  const items = {
    git: { title: 'Git — ferramenta local', icon: GitBranch, text: 'Observa arquivos, prepara mudanças e cria commits dentro da máquina.', proof: 'Funciona sem conta, internet ou servidor remoto.' },
    remote: { title: 'GitHub / GitLab — plataforma remota', icon: Globe2, text: 'Hospeda repositórios, colaboração, revisão, issues e automações.', proof: 'Exige conexão e autenticação quando houver push ou pull.' }
  };
  const current = items[focus];
  const Icon = current.icon;
  return <section className="git9-map">
    <div className="git9-copy-chaos"><small>Sem histórico</small><span>projeto</span><span>projeto-final</span><span>projeto-final-agora-vai</span><span>projeto-final-2</span></div>
    <ArrowRight aria-hidden="true" />
    <div className="git9-history"><small>Com Git</small><span><i /> estrutura inicial</span><span><i /> primeiro programa</span><span><i /> diário de bordo</span><span><i /> corrige validação</span></div>
    <div className="git9-map-controls" role="tablist">
      {Object.entries(items).map(([id, item]) => <button type="button" role="tab" aria-selected={focus === id} className={focus === id ? 'active' : ''} onClick={() => setFocus(id)} key={id}>{id === 'git' ? <GitBranch size={17} /> : <Globe2 size={17} />}{item.title}</button>)}
    </div>
    <article><Icon size={28} /><div><strong>{current.title}</strong><p>{current.text}</p><span><ShieldCheck size={15} /> {current.proof}</span></div></article>
  </section>;
}

function DownloadPanel() {
  const [architecture, setArchitecture] = useState('x64');
  return <section className="git9-download">
    <div className="git9-browser">
      <header><span /><span /><span /><code>git-scm.com/download/win</code><em>Simulação didática</em></header>
      <main><span className="git9-logo"><GitBranch size={32} /> git</span><small>Download for Windows</small><h3>Git for Windows</h3><p>Instalador oficial mantido pelo projeto Git for Windows.</p><div role="tablist"><button type="button" className={architecture === 'x64' ? 'active' : ''} onClick={() => setArchitecture('x64')}>x64</button><button type="button" className={architecture === 'arm64' ? 'active' : ''} onClick={() => setArchitecture('arm64')}>ARM64</button></div><button type="button" className="download"><Download size={17} /> Download {architecture === 'x64' ? '64-bit' : 'ARM64'}</button></main>
    </div>
    <article><h3><FileCheck2 size={20} /> Antes de executar</h3><ul><li><Check size={15} /> Domínio oficial: git-scm.com ou gitforwindows.org</li><li><Check size={15} /> Arquitetura: {architecture === 'x64' ? 'x64 para Windows comum em CPU Intel/AMD' : 'ARM64 apenas em equipamento compatível com Windows 11'}</li><li><Check size={15} /> Nome e número da versão podem mudar</li><li><Check size={15} /> Editor digital do arquivo deve ser verificável pelo Windows</li></ul><a href="https://git-scm.com/download/win" target="_blank" rel="noreferrer">Abrir página oficial <ExternalLink size={14} /></a></article>
  </section>;
}

const INSTALLER_STAGES = [
  { name: 'Destino', title: 'Select Destination Location', choice: 'C:\\Program Files\\Git', alternatives: ['Pasta padrão recomendada', 'Outro disco somente com motivo'], why: 'Mantém o executável em local previsível e protegido.' },
  { name: 'Componentes', title: 'Select Components', choice: 'Componentes padrão + Git LFS + integração do terminal', alternatives: ['Git Bash Here e Git GUI Here podem permanecer', 'Associações de arquivo são opcionais'], why: 'Os padrões entregam CLI, Git Bash, GUI, LFS e integração sem instalação mínima demais.' },
  { name: 'Editor', title: 'Choosing the default editor used by Git', choice: 'Notepad para esta formação', alternatives: ['VS Code se já estiver instalado', 'Vim apenas se você já souber sair e salvar'], why: 'Evita ficar preso em um editor desconhecido durante uma operação Git.' },
  { name: 'Branch', title: 'Adjusting the name of the initial branch', choice: 'Override: main', alternatives: ['Let Git decide pode continuar usando outro padrão', 'A Aula 010 espera main'], why: 'Novos repositórios começam com o nome adotado pela formação.' },
  { name: 'PATH', title: 'Adjusting your PATH environment', choice: 'Git from the command line and also from 3rd-party software', alternatives: ['Git Bash only não atende o PowerShell', 'Unix tools no PATH altera mais comandos do Windows'], why: 'Disponibiliza git no PowerShell, IntelliJ e outras ferramentas sem substituir utilitários do Windows.' },
  { name: 'SSH', title: 'Choosing the SSH executable', choice: 'Use bundled OpenSSH', alternatives: ['External OpenSSH exige ambiente já administrado', 'Plink é uma opção específica'], why: 'É o caminho previsível para uso futuro; nenhuma chave será criada nesta aula.' },
  { name: 'HTTPS', title: 'Choosing HTTPS transport backend', choice: 'Mantenha a opção padrão apresentada', alternatives: ['OpenSSL usa o bundle fornecido', 'Secure Channel usa a loja de certificados do Windows'], why: 'Ambas são válidas; políticas corporativas podem exigir uma delas.' },
  { name: 'Linhas', title: 'Configuring line ending conversions', choice: 'Checkout Windows-style, commit Unix-style', alternatives: ['Corresponde a core.autocrlf=true', 'Times podem impor .gitattributes'], why: 'Normaliza texto no índice e mantém working tree confortável no Windows.' },
  { name: 'Terminal', title: 'Terminal emulator and git pull behavior', choice: 'MinTTY + comportamento padrão de pull', alternatives: ['ConHost é válido para integração nativa', 'Pull será estudado com remoto'], why: 'Nenhuma dessas escolhas muda o uso de git no PowerShell desta aula.' },
  { name: 'Credenciais', title: 'Credential helper and extra options', choice: 'Git Credential Manager habilitado; defaults de segurança', alternatives: ['Não autentique agora', 'Symlinks exigem contexto e permissões'], why: 'Prepara autenticação segura futura sem armazenar senha em arquivo ou antecipar GitHub.' }
];

function InstallerWizard() {
  const [stage, setStage] = useState(0);
  const current = INSTALLER_STAGES[stage];
  return <section className="git9-installer">
    <nav aria-label="Telas do instalador">{INSTALLER_STAGES.map((item, index) => <button type="button" className={index === stage ? 'active' : index < stage ? 'done' : ''} onClick={() => setStage(index)} key={item.name}><span>{index < stage ? <Check size={13} /> : index + 1}</span>{item.name}</button>)}</nav>
    <div className="git9-installer-window">
      <header><GitBranch size={17} /><strong>Git Setup</strong><em>Simulação didática</em><span>— □ ×</span></header>
      <main><small>Tela {stage + 1} de {INSTALLER_STAGES.length}</small><h3>{current.title}</h3><div className="git9-selected-option"><CheckCircle2 size={20} /><span><small>Escolha acompanhada</small><strong>{current.choice}</strong></span></div><div className="git9-installer-options">{current.alternatives.map(item => <span key={item}><i />{item}</span>)}</div><p><strong>Por quê:</strong> {current.why}</p></main>
      <footer><button type="button" disabled={stage === 0} onClick={() => setStage(value => value - 1)}>Back</button><button type="button" className="primary" disabled={stage === INSTALLER_STAGES.length - 1} onClick={() => setStage(value => value + 1)}>{stage === INSTALLER_STAGES.length - 1 ? 'Install' : 'Next'}</button></footer>
    </div>
  </section>;
}

function PathAudit() {
  const [fresh, setFresh] = useState(false);
  return <section className="git9-path-audit">
    <div className="git9-terminal">
      <header><TerminalSquare size={16} /><strong>Windows PowerShell</strong><em>Simulação didática</em></header>
      <main>{fresh ? <><p><span>PS C:\Users\Aluno&gt;</span> git --version</p><pre>git version 2.x.y.windows.1</pre><p><span>PS C:\Users\Aluno&gt;</span> Get-Command git | Select-Object Name, Source</p><pre>Name     Source{'\n'}----     ------{'\n'}git.exe  C:\Program Files\Git\cmd\git.exe</pre><p><span>PS C:\Users\Aluno&gt;</span> where.exe git</p><pre>C:\Program Files\Git\cmd\git.exe</pre></> : <><p><span>PS C:\Users\Aluno&gt;</span> git --version</p><pre className="error">git : O termo 'git' não é reconhecido como nome de cmdlet...</pre></>}</main>
    </div>
    <article className={fresh ? 'success' : 'warning'}>{fresh ? <MonitorCheck size={30} /> : <RefreshCw size={30} />}<h3>{fresh ? 'Executável encontrado' : 'Terminal antigo ainda aberto'}</h3><p>{fresh ? 'Versão e caminho confirmam que o PATH escolheu o Git for Windows.' : 'Feche esta janela depois da instalação e abra um PowerShell novo.'}</p><button type="button" onClick={() => setFresh(value => !value)}>{fresh ? <><RotateCcw size={16} /> Simular terminal antigo</> : <><RefreshCw size={16} /> Abrir novo PowerShell</>}</button></article>
  </section>;
}

const SCOPES = {
  system: { label: 'system', file: 'C:\\ProgramData\\Git\\config', reach: 'Todos os usuários da máquina', command: 'git config --system --list', note: 'Normalmente exige privilégio administrativo. Não será alterado nesta aula.' },
  global: { label: 'global', file: 'C:\\Users\\SEU_USUARIO\\.gitconfig', reach: 'Seu usuário e seus repositórios', command: 'git config --global --list', note: 'É o escopo que configuraremos agora.' },
  local: { label: 'local', file: '.git\\config', reach: 'Somente o repositório atual', command: 'git config --local --list', note: 'Vence o global, mas só existe dentro de um repositório. Será usado quando necessário.' }
};

function ScopeMap() {
  const [scope, setScope] = useState('global');
  const current = SCOPES[scope];
  return <section className="git9-scopes">
    <div className="git9-scope-stack">
      {Object.entries(SCOPES).map(([id, item], index) => <button type="button" className={scope === id ? 'active' : ''} onClick={() => setScope(id)} key={id}><span>{index + 1}</span><strong>{item.label}</strong><small>{index === 0 ? 'base' : index === 1 ? 'sobrescreve system' : 'sobrescreve global'}</small></button>)}
      <ArrowDown aria-hidden="true" /><span className="git9-effective">Valor efetivo</span>
    </div>
    <article><header><Layers3 size={22} /><div><small>Escopo selecionado</small><h3>{current.label}</h3></div></header><dl><div><dt>Arquivo</dt><dd><code>{current.file}</code></dd></div><div><dt>Alcance</dt><dd>{current.reach}</dd></div><div><dt>Consulta</dt><dd><code>{current.command}</code></dd></div></dl><p>{current.note}</p>{scope === 'local' && <aside><AlertTriangle size={16} /> Fora de um repositório, a consulta local pode responder: fatal: --local can only be used inside a git repository.</aside>}</article>
  </section>;
}

function IdentityLab() {
  const [name, setName] = useState('Nome Sobrenome');
  const [email, setEmail] = useState('email@exemplo.com');
  const [view, setView] = useState('author');
  return <section className="git9-identity">
    <div className="git9-identity-form"><label>Nome de autoria<input value={name} onChange={event => setName(event.target.value)} /></label><label>E-mail de autoria<input value={email} onChange={event => setEmail(event.target.value)} /></label><small>Use dados adequados na configuração real. Estes valores são apenas didáticos.</small></div>
    <article>
      <div role="tablist"><button type="button" className={view === 'author' ? 'active' : ''} onClick={() => setView('author')}><CircleUserRound size={16} /> Autoria</button><button type="button" className={view === 'auth' ? 'active' : ''} onClick={() => setView('auth')}><KeyRound size={16} /> Autenticação</button></div>
      {view === 'author' ? <div className="git9-author-card"><small>Commit futuro</small><strong>Author: {name || 'valor ausente'} &lt;{email || 'valor ausente'}&gt;</strong><p>Fica gravado no objeto commit e participa da rastreabilidade.</p></div> : <div className="git9-author-card auth"><small>Acesso remoto futuro</small><strong>Navegador · token · SSH · Credential Manager</strong><p>Autoriza contato com uma plataforma. Não é configurado por user.email.</p></div>}
    </article>
  </section>;
}

function DefaultsLab() {
  const [branchKey, setBranchKey] = useState('correct');
  const [editor, setEditor] = useState('notepad');
  const correct = branchKey === 'correct';
  return <section className="git9-defaults">
    <article><header><GitBranch size={21} /><strong>Branch inicial</strong></header><div role="tablist"><button type="button" className={correct ? 'active' : ''} onClick={() => setBranchKey('correct')}>init.defaultBranch</button><button type="button" className={!correct ? 'active wrong' : ''} onClick={() => setBranchKey('wrong')}>init.defaltbranch</button></div><code>git config --global {correct ? 'init.defaultBranch' : 'init.defaltbranch'} main</code><div className={correct ? 'proof success' : 'proof warning'}>{correct ? <CheckCircle2 size={17} /> : <AlertTriangle size={17} />}<span><strong>{correct ? 'Consulta exata devolve main' : 'Git grava a chave desconhecida sem corrigir a ortografia'}</strong><small>{correct ? 'Novos git init usarão main.' : 'git config --global init.defaultBranch fica sem saída.'}</small></span></div></article>
    <article><header><FileCog size={21} /><strong>Editor do Git</strong></header><div role="tablist">{['notepad', 'code --wait', 'vim'].map(item => <button type="button" className={editor === item ? 'active' : ''} onClick={() => setEditor(item)} key={item}>{item}</button>)}</div><code>git config --global core.editor "{editor}"</code><div className="proof"><Settings2 size={17} /><span><strong>{editor === 'notepad' ? 'Baseline simples do curso' : editor === 'code --wait' ? 'Espera o VS Code fechar o arquivo' : 'Use somente se conhece os comandos do Vim'}</strong><small>git var GIT_EDITOR deve mostrar {editor}.</small></span></div></article>
  </section>;
}

const EOL_OPTIONS = {
  true: { label: 'true · Windows do curso', work: 'CRLF', index: 'LF', checkout: 'CRLF', note: 'Converte CRLF para LF ao adicionar texto e LF para CRLF no checkout.' },
  input: { label: 'input · Linux/macOS comum', work: 'LF', index: 'LF', checkout: 'LF', note: 'Converte CRLF para LF na entrada, mas não converte na saída.' },
  false: { label: 'false · sem conversão automática', work: 'como está', index: 'como está', checkout: 'como está', note: 'O Git não aplica a conversão automática desta opção.' },
  attributes: { label: '.gitattributes · política do projeto', work: 'por arquivo', index: 'LF para texto', checkout: 'eol definido', note: 'A regra versionada acompanha todos os colaboradores e pode tratar tipos diferentes.' }
};

function LineEndingLab() {
  const [mode, setMode] = useState('true');
  const current = EOL_OPTIONS[mode];
  return <section className="git9-eol">
    <div role="tablist">{Object.entries(EOL_OPTIONS).map(([id, item]) => <button type="button" className={mode === id ? 'active' : ''} onClick={() => setMode(id)} key={id}>{item.label}</button>)}</div>
    <div className="git9-eol-flow"><article><Laptop size={21} /><small>Working tree</small><strong>{current.work}</strong><code>linha 1{current.work === 'CRLF' ? '␍␊' : '␊'}linha 2</code></article><span><ArrowRight /> git add</span><article><FolderGit2 size={21} /><small>Index / repositório</small><strong>{current.index}</strong><code>linha 1␊linha 2</code></article><span><ArrowRight /> checkout</span><article><HardDrive size={21} /><small>Arquivo entregue</small><strong>{current.checkout}</strong></article></div>
    <p><Lightbulb size={16} /> {current.note}</p>
  </section>;
}

const AUDIT_COMMANDS = [
  { command: 'git --version', output: 'git version 2.x.y.windows.1', proof: 'O executável responde. O número varia com a versão instalada.' },
  { command: 'Get-Command git | Select-Object Name, Source', output: 'Name     Source\n----     ------\ngit.exe  C:\\Program Files\\Git\\cmd\\git.exe', proof: 'O PowerShell mostra qual aplicação o PATH escolheu.' },
  { command: 'git config --global user.name "Nome Sobrenome"', output: '(sem saída)', proof: 'Silêncio é normal para uma escrita bem-sucedida; ainda falta consultar.' },
  { command: 'git config --global user.email "email@exemplo.com"', output: '(sem saída)', proof: 'A autoria recebeu um e-mail didático; use o seu valor adequado fora da simulação.' },
  { command: 'git config --global init.defaultBranch main', output: '(sem saída)', proof: 'A chave correta define o padrão dos próximos repositórios.' },
  { command: 'git config --global core.autocrlf true', output: '(sem saída)', proof: 'A baseline Windows da formação foi registrada.' },
  { command: 'git config --global core.editor "notepad"', output: '(sem saída)', proof: 'Git tem um editor previsível quando precisar abrir texto.' },
  { command: 'git config --global --list --show-origin --show-scope', output: 'global  file:C:/Users/SEU_USUARIO/.gitconfig  user.name=Nome Sobrenome\nglobal  file:C:/Users/SEU_USUARIO/.gitconfig  user.email=email@exemplo.com\nglobal  file:C:/Users/SEU_USUARIO/.gitconfig  init.defaultbranch=main\nglobal  file:C:/Users/SEU_USUARIO/.gitconfig  core.autocrlf=true\nglobal  file:C:/Users/SEU_USUARIO/.gitconfig  core.editor=notepad', proof: 'Escopo, arquivo, chave e valor aparecem juntos. A exibição pode normalizar letras da chave.' },
  { command: 'git var GIT_AUTHOR_IDENT', output: 'Nome Sobrenome <email@exemplo.com> 1784304000 -0300', proof: 'Git consegue montar a identidade de autoria; timestamp e fuso variam.' }
];

function TerminalAudit() {
  const [done, setDone] = useState(0);
  const current = AUDIT_COMMANDS[done];
  const previous = done ? AUDIT_COMMANDS[done - 1] : null;
  return <section className="git9-terminal-audit">
    <div className="git9-terminal large"><header><TerminalSquare size={16} /><strong>Windows PowerShell</strong><em>Simulação didática</em></header><main>{AUDIT_COMMANDS.slice(0, done).map(item => <div className="git9-terminal-entry" key={item.command}><p><span>PS C:\Users\Aluno&gt;</span> {item.command}</p><pre>{item.output}</pre></div>)}{current ? <p className="cursor"><span>PS C:\Users\Aluno&gt;</span><i /></p> : <div className="git9-terminal-done"><CheckCircle2 size={18} /> Instalação e configuração auditadas sem criar repositório.</div>}</main></div>
    <aside>{current ? <><small>Comando {done + 1} de {AUDIT_COMMANDS.length}</small><CommandBlock title="Próxima ação" command={current.command} output={current.output} meaning={current.proof} /><button type="button" className="run" onClick={() => setDone(value => value + 1)}><Play size={16} /> Executar na simulação</button></> : <div className="git9-audit-success"><UserCheck size={30} /><strong>Identidade pronta</strong><span>Aula 010 poderá criar o primeiro commit.</span></div>}{previous && <p><strong>Última prova:</strong> {previous.proof}</p>}<button type="button" className="reset" disabled={done === 0} onClick={() => setDone(0)}><RotateCcw size={15} /> Reiniciar auditoria</button></aside>
  </section>;
}

function ConfigRecovery() {
  const [mode, setMode] = useState('overwrite');
  const cases = {
    overwrite: { title: 'Corrigir sobrescrevendo', command: 'git config --global user.name "Nome Corrigido"\ngit config --global user.name', output: 'Nome Corrigido', meaning: 'A mesma chave recebe o novo valor; reinstalar Git não participa da correção.' },
    unset: { title: 'Remover uma chave opcional', command: 'git config --global --unset core.editor\ngit config --global --get core.editor', output: '(sem saída na consulta; a chave não existe)', meaning: '--unset remove somente a chave indicada. Configure o editor novamente se ele continuar fazendo parte da sua baseline.' },
    typo: { title: 'Encontrar chave parecida', command: 'git config --global --get-regexp "^init\\."', output: 'init.defaltbranch main', meaning: 'A busca revela a grafia incorreta. Configure init.defaultBranch antes de remover a chave errada de forma consciente.' }
  };
  const current = cases[mode];
  return <section className="git9-recovery"><div role="tablist">{Object.entries(cases).map(([id, item]) => <button type="button" className={mode === id ? 'active' : ''} onClick={() => setMode(id)} key={id}>{item.title}</button>)}</div><CommandBlock title={current.title} command={current.command} output={current.output} meaning={current.meaning} /></section>;
}

const DIAGNOSIS_CASES = [
  { symptom: 'git não é reconhecido', inspect: 'Feche o terminal antigo; abra outro; use Get-Command git.', cause: 'PATH ainda não chegou a essa sessão ou instalação incompleta.', fix: 'Teste no terminal novo; só então revise a opção de PATH do instalador.', confirm: 'git --version e Get-Command git retornam versão e caminho.' },
  { symptom: 'where git não mostrou o executável', inspect: 'Execute Get-Alias where e depois where.exe git.', cause: 'No PowerShell, where é alias de Where-Object.', fix: 'Use where.exe ou Get-Command.', confirm: 'C:\\Program Files\\Git\\cmd\\git.exe aparece.' },
  { symptom: 'Author identity unknown', inspect: 'Consulte user.name e user.email com --global.', cause: 'Um ou ambos estão ausentes.', fix: 'Configure os dois valores e consulte novamente.', confirm: 'git var GIT_AUTHOR_IDENT monta nome e e-mail.' },
  { symptom: 'E-mail de autoria está errado', inspect: 'git config --global user.email', cause: 'Valor digitado incorretamente ou identidade diferente.', fix: 'Rode a mesma chave com o valor correto.', confirm: 'A consulta devolve somente o valor pretendido.' },
  { symptom: 'init.defaultBranch não imprime nada', inspect: 'git config --global --get-regexp "^init\\."', cause: 'Chave ausente ou parecida, como init.defaltbranch.', fix: 'Configure init.defaultBranch main e remova a chave errada somente após identificá-la.', confirm: 'A consulta exata devolve main.' },
  { symptom: 'Aparecem valores duplicados', inspect: 'Use --list --show-origin --show-scope.', cause: 'System, global e local podem declarar a mesma chave.', fix: 'Decida qual escopo deve controlar o projeto; não apague todos os valores às cegas.', confirm: 'O valor efetivo vem do escopo esperado.' },
  { symptom: 'Git abriu Vim inesperadamente', inspect: 'git var GIT_EDITOR e git config --global core.editor', cause: 'Editor padrão do instalador ou configuração ausente.', fix: 'Defina notepad ou outro editor instalado e que você saiba usar.', confirm: 'git var GIT_EDITOR mostra o comando escolhido.' },
  { symptom: 'Diff parece alterar o arquivo inteiro', inspect: 'Confira line endings e política .gitattributes.', cause: 'Conversão LF/CRLF ou editor regravou todas as linhas.', fix: 'Não commite no impulso; alinhe a política do projeto e revise o diff.', confirm: 'O diff volta a mostrar somente mudanças intencionais.' },
  { symptom: 'Configuração local falhou fora de repositório', inspect: 'Get-Location e procure .git com Get-ChildItem -Force.', cause: 'O escopo local pertence a .git/config.', fix: 'Use --global nesta aula; local será aplicado dentro de um repositório.', confirm: 'A configuração global aparece com --show-scope.' },
  { symptom: 'Achei que user.email faria login', inspect: 'Separe autoria de credencial remota.', cause: 'Identidade de commit não autentica em GitHub/GitLab.', fix: 'Mantenha a identidade; configure autenticação apenas na aula de remoto.', confirm: 'Git local funciona sem conta e sem internet.' }
];

function DiagnosisClinic() {
  const [selected, setSelected] = useState(0);
  const current = DIAGNOSIS_CASES[selected];
  return <section className="git9-diagnosis"><nav>{DIAGNOSIS_CASES.map((item, index) => <button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={item.symptom}><span>{index + 1}</span>{item.symptom}</button>)}</nav><article><header><Wrench size={24} /><div><small>Clínica de configuração</small><h3>{current.symptom}</h3></div></header><div><section><Search size={17} /><strong>Inspecione</strong><p>{current.inspect}</p></section><section><AlertTriangle size={17} /><strong>Causa provável</strong><p>{current.cause}</p></section><section><RefreshCw size={17} /><strong>Corrija</strong><p>{current.fix}</p></section><section><CheckCircle2 size={17} /><strong>Confirme</strong><p>{current.confirm}</p></section></div></article></section>;
}

function AuditReport() {
  return <section className="git9-report"><header><FileText size={19} /><strong>docs/auditoria-git.md</strong><CopyButton value={AUDIT_REPORT} label="Copiar modelo" /></header><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0d1726', fontSize: '.77rem', lineHeight: 1.65 }}>{AUDIT_REPORT}</SyntaxHighlighter><footer><ShieldCheck size={16} /> Preencha a evidência no seu computador, mas não publique e-mail, usuário ou caminho pessoal sem necessidade.</footer></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'gitMap') return <GitMap />;
  if (block.type === 'downloadPanel') return <DownloadPanel />;
  if (block.type === 'installerWizard') return <InstallerWizard />;
  if (block.type === 'pathAudit') return <PathAudit />;
  if (block.type === 'scopeMap') return <ScopeMap />;
  if (block.type === 'identityLab') return <IdentityLab />;
  if (block.type === 'defaultsLab') return <DefaultsLab />;
  if (block.type === 'lineEndingLab') return <LineEndingLab />;
  if (block.type === 'terminalAudit') return <TerminalAudit />;
  if (block.type === 'configRecovery') return <ConfigRecovery />;
  if (block.type === 'diagnosisClinic') return <DiagnosisClinic />;
  if (block.type === 'auditReport') return <AuditReport />;
  if (block.type === 'command') return <CommandBlock {...block} />;
  if (block.type === 'result') return <section className="guided-result"><h3><ClipboardCheck size={20} /> {block.title}</h3><ul>{block.items.map(item => <li key={item}><CheckCircle2 size={16} /> {item}</li>)}</ul></section>;
  if (block.type === 'note') {
    const Icon = block.tone === 'warning' || block.tone === 'danger' ? AlertTriangle : Lightbulb;
    return <aside className={'guided-note ' + (block.tone || 'info')}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>;
  }
  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Code2 size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  return null;
}

export default function GuidedGitSetupLesson009({
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

  return <article className="guided-git-lesson guided-git-setup-lesson">
    <header className="guided-hero">
      <div className="guided-hero-copy"><span className="guided-kicker"><GitBranch size={17} /> Oficina de instalação e auditoria</span><p className="guided-sequence">009 · M0.09</p><h1>Prepare o Git sem tratar configuração como magia</h1><p>Instale pelo caminho oficial, decida cada opção, configure sua autoria e prove no PowerShell qual valor e qual executável serão usados.</p></div>
      <div className="guided-hero-status"><FolderGit2 size={42} /><strong>{progress}%</strong><span>{completedLabel}</span></div>
      <div className="guided-progress-track" aria-label={'Progresso: ' + progress + '%'}><span style={{ width: progress + '%' }} /></div>
    </header>

    <GuidedLessonFacts ariaLabel="Resultado da aula" items={[{ value: 1, label: 'executável provado' }, { value: 5, label: 'chaves auditadas' }, { value: 10, label: 'diagnósticos praticáveis' }]} />

    <div className="guided-layout">
      <nav className="guided-step-nav" aria-label="Etapas da aula 009"><div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>{steps.map((step, index) => <button type="button" key={step.id} className={(index === activeIndex ? 'active ' : '') + (completedStepIds.has(step.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}</nav>
      <main className="guided-step-content"><div className="guided-step-heading"><span>{activeStep.eyebrow} · {activeStep.duration}</span><h2>{activeStep.title}</h2></div><div className="guided-blocks">{activeStep.blocks.map((block, index) => <ContentBlock block={block} key={activeStep.id + '-' + block.type + '-' + index} />)}</div>
        <div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (activeStepComplete ? 'undo' : 'complete')} onClick={toggleActiveStep}>{activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><Check size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div></div>
        {allStepsComplete && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>{lessonComplete ? 'Git preparado e registrado' : 'Auditoria completa'}</h3><p>{lessonComplete ? 'Etapas e conclusão geral estão registradas.' : 'Conclua a aula para liberar o primeiro repositório local.'}</p></div><button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}
      </main>
    </div>
    <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 008</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsComplete ? 'ready' : '')}>{lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : completedStepIds.size + ' de ' + steps.length + ' etapas'}</strong><small>{lessonComplete ? 'Configuração registrada' : allStepsComplete ? 'Use o botão acima' : 'Audite cada decisão'}</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas e a aula para avançar' : 'Criar o primeiro repositório'}>Aula 010 <ArrowRight size={17} /></button></footer>
  </article>;
}
