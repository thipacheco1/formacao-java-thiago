import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowDown, ArrowLeft, ArrowRight, Check, CheckCircle2, ClipboardCheck,
  Clock3, Cloud, Code2, Copy, Eye, EyeOff, FileText, FolderGit2, GitBranch,
  Globe2, KeyRound, Laptop, Lightbulb, ListChecks, LockKeyhole, Play, RefreshCw,
  RotateCcw, Search, ShieldCheck, UploadCloud, UserCheck, Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedGitHubRemoteLesson.css';

const STORAGE_KEY = 'guided-github-remote-lesson-011-progress';
const URL = 'https://github.com/SEU_USUARIO/formacao-java-backend.git';
const EVIDENCE = [
  '# Evidências — GitHub e remoto',
  '',
  '## Conta',
  '- E-mail verificado: sim / não',
  '- 2FA configurado: sim / não',
  '- Códigos de recuperação guardados fora do repositório: sim / não',
  '',
  '## Repositório',
  '- Nome: formacao-java-backend',
  '- Visibilidade escolhida:',
  '- Criado vazio: sim',
  '- URL HTTPS: use somente a URL pública do repositório',
  '',
  '## Provas locais',
  '- git remote -v:',
  '- git branch -vv:',
  '- git status -sb:',
  '',
  '## Provas remotas',
  '- main publicada:',
  '- README.md visível:',
  '- último commit visível:',
  '',
  '## Segurança',
  '- git diff --staged revisado antes do push',
  '- nenhum token, senha, chave privada ou .env real foi versionado'
].join('\n');

const steps = [
  { id: 'mapa', label: 'Mapear local e remoto', duration: '8 min', eyebrow: 'Comece aqui', title: 'Veja exatamente o que atravessa a internet — e o que continua local', blocks: [
    { type: 'lead', text: 'A Aula 010 criou commits locais. Agora você vai publicar esse histórico. GitHub recebe commits; ele não substitui status, diff, staging nem commit.' },
    { type: 'remoteMap' },
    { type: 'note', tone: 'info', title: 'Transformação desta aula', text: 'Você começa com main apenas na máquina e termina com main acompanhando origin/main, dois pushes confirmados e os mesmos arquivos visíveis no GitHub.' }
  ]},
  { id: 'conta', label: 'Criar e proteger conta', duration: '16 min', eyebrow: 'Etapa 1', title: 'Crie a conta sem deixar a segurança para “depois”', blocks: [
    { type: 'lead', text: 'Se já possui conta, use esta etapa como auditoria. Se não possui, acesse github.com, escolha Sign up, use senha exclusiva, confirme o e-mail e configure um segundo fator. Nunca coloque senha ou código de recuperação nesta aula.' },
    { type: 'accountWizard' },
    { type: 'note', tone: 'warning', title: 'Códigos de recuperação não são conteúdo do projeto', text: 'Guarde-os em um gerenciador de senhas ou local seguro fora do Git. Não copie para README, diário, print público ou pasta sincronizada sem proteção.' }
  ]},
  { id: 'prevoo', label: 'Auditar o projeto local', duration: '13 min', eyebrow: 'Etapa 2', title: 'Só crie o remoto depois de provar o estado local', blocks: [
    { type: 'lead', text: 'Entre na pasta criada na Aula 010. O projeto precisa ser um repositório, estar na main, possuir commits e não carregar arquivos sensíveis. Não faça push para “ver se dá certo”.' },
    { type: 'preflightLab' }
  ]},
  { id: 'criar-remoto', label: 'Criar remoto vazio', duration: '16 min', eyebrow: 'Etapa 3', title: 'Crie o repositório certo na interface do GitHub', blocks: [
    { type: 'lead', text: 'No canto superior direito do GitHub, escolha + e New repository. Como o projeto já nasceu localmente, deixe README, .gitignore e licença desmarcados para não criar um segundo histórico.' },
    { type: 'repoCreator' },
    { type: 'note', tone: 'warning', title: 'Privado não significa “segredo permitido”', text: 'Visibilidade controla quem vê o repositório. Senhas, tokens, chaves privadas, .env real e dados de cliente continuam proibidos.' }
  ]},
  { id: 'autenticacao', label: 'Escolher autenticação', duration: '14 min', eyebrow: 'Etapa 4', title: 'Use HTTPS com autenticação moderna — não a senha da conta', blocks: [
    { type: 'lead', text: 'O caminho inicial será HTTPS. Git for Windows inclui o Git Credential Manager, que pode abrir o navegador para você autorizar a operação. GitHub não aceita senha da conta como autenticação de operações Git HTTPS.' },
    { type: 'authChooser' },
    { type: 'note', tone: 'danger', title: 'Nunca coloque credencial dentro da URL', text: 'Não escreva https://TOKEN@github.com/... e não salve PAT em arquivo. Se um segredo aparecer em terminal, print ou commit, considere-o exposto e revogue-o.' }
  ]},
  { id: 'origin', label: 'Conectar origin', duration: '13 min', eyebrow: 'Etapa 5', title: 'Associe um apelido local à URL e confirme antes de enviar', blocks: [
    { type: 'lead', text: 'origin é apenas o nome local mais comum para a URL. Ele não é GitHub, produção nem branch principal. A URL de fetch e a de push precisam apontar para o repositório que você acabou de criar.' },
    { type: 'originLab' }
  ]},
  { id: 'primeiro-push', label: 'Publicar main', duration: '18 min', eyebrow: 'Etapa 6', title: 'Faça o primeiro push, autorize no navegador e prove o upstream', blocks: [
    { type: 'lead', text: 'O -u cria a relação de acompanhamento entre main e origin/main. Depois desta primeira publicação, git push e git pull sabem qual par usar por padrão.' },
    { type: 'pushLab' }
  ]},
  { id: 'segundo-ciclo', label: 'Repetir o ciclo', duration: '17 min', eyebrow: 'Etapa 7', title: 'Prove que commit local só aparece no GitHub depois do push', blocks: [
    { type: 'lead', text: 'Faça uma alteração pequena no README, revise apenas esse arquivo, crie um commit claro e observe a página remota antes e depois do push.' },
    { type: 'secondCycle' },
    { type: 'note', tone: 'info', title: 'Markdown vem na próxima aula', text: 'Aqui usamos um bloco mínimo para provar sincronização. Títulos, links, tabelas, imagens, preview e estrutura de README serão ensinados na Aula 012.' }
  ]},
  { id: 'baixar', label: 'Clone, fetch e pull', duration: '18 min', eyebrow: 'Etapa 8', title: 'Não misture três formas diferentes de trazer trabalho remoto', blocks: [
    { type: 'lead', text: 'Clone cria uma nova pasta e configura origin. Fetch atualiza referências remotas sem integrar seu arquivo. Pull executa busca e integração; antes dele, mantenha o trabalho local salvo e entenda o que será combinado.' },
    { type: 'syncLab' }
  ]},
  { id: 'diagnostico', label: 'Recuperar falhas', duration: '20 min', eyebrow: 'Etapa 9', title: 'Investigue a causa antes de alterar histórico ou credenciais', blocks: [
    { type: 'lead', text: 'Erro remoto não se resolve com tentativa aleatória. Leia a mensagem, confira pasta, branch, commits, URL, permissão e autenticação. Nesta fase, --force não é uma correção aceitável.' },
    { type: 'diagnosisClinic' }
  ]},
  { id: 'entrega', label: 'Provar e transferir', duration: '18 min', eyebrow: 'Etapa 10', title: 'Entregue evidências seguras e repita sem copiar o roteiro', blocks: [
    { type: 'lead', text: 'O GitHub pode servir a estudo, portfólio e colaboração, mas qualidade vem do histórico, estrutura, README e segurança. Pull requests, branches protegidas, review e CI entram depois.' },
    { type: 'evidenceDoc' },
    { type: 'result', title: 'Critérios profissionais que começam agora', items: ['Nome e descrição comunicam o objetivo', 'Commits pequenos formam uma história compreensível', 'README reduz atrito sem prometer o que o projeto não faz', 'Arquivo gerado e segredo ficam fora do histórico', 'Destino, branch e diff são conferidos antes do push'] },
    { type: 'challenge', title: 'Desafio: publique um laboratório separado', text: 'Crie localmente um repositório pequeno chamado labs-java-core com dois commits. Crie no GitHub um remoto vazio, conecte por HTTPS, publique main, faça uma terceira alteração e prove que ela só aparece após o segundo push.', acceptance: ['Conta verificada e autenticação segura', 'Remoto criado sem README, .gitignore ou licença', 'git remote -v aponta ao destino correto', 'git branch -vv mostra main acompanhando origin/main', 'Página remota mostra três commits', 'Nenhuma credencial ou dado pessoal sensível foi versionado'] }
  ]}
];

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); };
  return <button type="button" className="guided-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function CommandBlock({ title, command, output, meaning }) {
  return <section className="gh11-command"><header><span><Code2 size={16} /> {title}</span><CopyButton value={command} /></header><SyntaxHighlighter language="powershell" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '15px', background: '#0d1117', fontSize: '.76rem', lineHeight: 1.65 }}>{command}</SyntaxHighlighter>{output && <div><small>Saída esperada ou modelo</small><pre>{output}</pre></div>}<footer><CheckCircle2 size={16} /><span><strong>O que prova:</strong> {meaning}</span></footer></section>;
}

function RemoteMap() {
  const [action, setAction] = useState('push');
  const actions = {
    commit: { from: 'Working tree + staging', to: 'Repositório local', note: 'Registra um ponto do histórico sem internet.' },
    push: { from: 'main local', to: 'origin/main no GitHub', note: 'Publica commits que já existem.' },
    fetch: { from: 'GitHub', to: 'origin/main local', note: 'Atualiza referências sem alterar seu arquivo atual.' },
    pull: { from: 'GitHub', to: 'main + arquivos locais', note: 'Busca e integra na branch atual.' },
    clone: { from: 'Repositório no GitHub', to: 'Nova pasta local', note: 'Cria pasta, .git, origin, arquivos e histórico.' }
  };
  const current = actions[action];
  return <section className="gh11-map"><div role="tablist">{Object.keys(actions).map(id => <button type="button" className={action === id ? 'active' : ''} onClick={() => setAction(id)} key={id}>{id}</button>)}</div><div className="gh11-map-flow"><article><Laptop size={26} /><small>Origem</small><strong>{current.from}</strong></article><span><ArrowRight /><b>{action}</b></span><article><Cloud size={26} /><small>Destino</small><strong>{current.to}</strong></article></div><p><ShieldCheck size={16} /> {current.note}</p></section>;
}

const ACCOUNT_STEPS = [
  { label: 'Sign up', title: 'Crie uma conta pessoal', detail: 'Use e-mail acessível, username profissional e senha forte e exclusiva.', proof: 'Você consegue entrar no perfil sem compartilhar a senha.' },
  { label: 'E-mail', title: 'Verifique o endereço', detail: 'Abra a mensagem legítima enviada pelo GitHub e confirme o endereço.', proof: 'A conta deixa de exibir pendência de verificação e pode criar repositório.' },
  { label: '2FA', title: 'Configure segundo fator', detail: 'Prefira aplicativo TOTP como método principal e registre um backup adequado.', proof: 'Settings → Password and authentication mostra 2FA habilitado.' },
  { label: 'Recuperação', title: 'Guarde códigos fora do Git', detail: 'Salve os códigos em gerenciador de senhas ou armazenamento seguro offline.', proof: 'Você sabe onde recuperar a conta sem publicar nenhum código.' },
  { label: 'Passkey', title: 'Adicione passkey se desejar', detail: 'Windows Hello ou outro autenticador compatível pode oferecer login resistente a phishing.', proof: 'A passkey aparece em Settings; ela é complemento seguro e opcional nesta aula.' }
];

function AccountWizard() {
  const [stage, setStage] = useState(0);
  const current = ACCOUNT_STEPS[stage];
  return <section className="gh11-account"><nav>{ACCOUNT_STEPS.map((item, index) => <button type="button" className={index === stage ? 'active' : index < stage ? 'done' : ''} onClick={() => setStage(index)} key={item.label}><span>{index < stage ? <Check size={13} /> : index + 1}</span>{item.label}</button>)}</nav><div className="gh11-browser"><header><span /><span /><span /><code>github.com</code><em>Simulação didática</em></header><main><Globe2 size={31} /><small>Conta GitHub</small><h3>{current.title}</h3><p>{current.detail}</p><div><UserCheck size={18} /><span><strong>Evidência segura</strong>{current.proof}</span></div></main><footer><button type="button" disabled={stage === 0} onClick={() => setStage(value => value - 1)}>Voltar</button><button type="button" disabled={stage === ACCOUNT_STEPS.length - 1} onClick={() => setStage(value => value + 1)}>Continuar</button></footer></div></section>;
}

function PreflightLab() {
  const [risk, setRisk] = useState('clean');
  const cases = {
    clean: { title: 'Pronto para publicar', output: '## main\n\n8d42a91 (HEAD -> main) Explica as tres areas do Git\n4f2c8a1 Adiciona README inicial\n\nnothing to commit, working tree clean', verdict: 'Branch, histórico e arquivos estão coerentes.' },
    env: { title: '.env real encontrado', output: '?? .env\n?? README.md', verdict: 'Pare. Ignore o arquivo e confirme que nunca entrou em commit.' },
    generated: { title: 'Artefatos gerados', output: '?? out/Main.class\n?? target/app.jar', verdict: 'Pare. Corrija .gitignore e revise novamente.' }
  };
  const current = cases[risk];
  return <section className="gh11-preflight"><div role="tablist">{Object.keys(cases).map(id => <button type="button" className={risk === id ? 'active' : ''} onClick={() => setRisk(id)} key={id}>{cases[id].title}</button>)}</div><CommandBlock title="Execute dentro do projeto local" command={'Get-Location\ngit status -sb\ngit log --oneline -5\ngit diff\ngit diff --staged'} output={current.output} meaning={current.verdict} /><aside className={risk === 'clean' ? 'good' : 'danger'}>{risk === 'clean' ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}<span><strong>{current.title}</strong>{current.verdict}</span></aside></section>;
}

function RepoCreator() {
  const [name, setName] = useState('formacao-java-backend');
  const [visibility, setVisibility] = useState('private');
  const [initialized, setInitialized] = useState(false);
  const safeName = name.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  return <section className="gh11-repo-create"><div className="gh11-browser"><header><span /><span /><span /><code>github.com/new</code><em>Simulação didática</em></header><main><small>Create a new repository</small><label>Owner / Repository name<div><code>SEU_USUARIO /</code><input value={name} onChange={event => setName(event.target.value)} /></div></label><p className={name === safeName ? 'valid' : 'warning'}>{name === safeName ? <Check size={14} /> : <AlertTriangle size={14} />} URL prevista: github.com/SEU_USUARIO/{safeName || 'repositorio'}</p><label>Description <input value="Formação prática de Java Backend" readOnly /></label><div role="tablist"><button type="button" className={visibility === 'public' ? 'active' : ''} onClick={() => setVisibility('public')}><Eye size={16} /> Public</button><button type="button" className={visibility === 'private' ? 'active' : ''} onClick={() => setVisibility('private')}><EyeOff size={16} /> Private</button></div><label className="gh11-check"><input type="checkbox" checked={initialized} onChange={event => setInitialized(event.target.checked)} /> Add a README, .gitignore or license</label><button type="button" className="create">Create repository</button></main></div><article className={initialized ? 'danger' : 'good'}>{initialized ? <AlertTriangle size={28} /> : <CheckCircle2 size={28} />}<h3>{initialized ? 'Dois históricos podem nascer' : 'Remoto vazio: caminho coerente'}</h3><p>{initialized ? 'O GitHub criaria um commit que não existe na main local. Desmarque os inicializadores.' : 'O remoto não possui commit; o primeiro push publicará exatamente o histórico local.'}</p><span><LockKeyhole size={15} /> Visibilidade: {visibility}. Segredos continuam proibidos.</span></article></section>;
}

function AuthChooser() {
  const [method, setMethod] = useState('https');
  const methods = {
    https: { title: 'HTTPS + Git Credential Manager', url: URL, steps: ['Git inicia a operação HTTPS', 'GCM abre o navegador', 'Você entra e autoriza no domínio GitHub', 'Credencial fica no armazenamento protegido do sistema'], note: 'Recomendado para este primeiro fluxo.' },
    ssh: { title: 'SSH', url: 'git@github.com:SEU_USUARIO/formacao-java-backend.git', steps: ['Gerar par de chaves por máquina', 'Proteger a chave privada', 'Cadastrar somente a chave pública', 'Testar host e passphrase'], note: 'Excelente opção, mas exige preparação específica.' },
    pat: { title: 'Personal access token', url: URL, steps: ['Criar token com menor escopo e expiração', 'Usar no lugar da senha quando solicitado', 'Guardar em cofre/credential helper', 'Revogar se houver exposição'], note: 'Alternativa; nunca registre o valor na aula.' }
  };
  const current = methods[method];
  return <section className="gh11-auth"><nav>{Object.keys(methods).map(id => <button type="button" className={method === id ? 'active' : ''} onClick={() => setMethod(id)} key={id}>{id === 'https' ? <Globe2 size={17} /> : <KeyRound size={17} />}{id.toUpperCase()}</button>)}</nav><article><header><ShieldCheck size={25} /><div><small>Método selecionado</small><h3>{current.title}</h3></div></header><code>{current.url}</code><ol>{current.steps.map(item => <li key={item}>{item}</li>)}</ol><p>{current.note}</p></article></section>;
}

function OriginLab() {
  const [state, setState] = useState('empty');
  const command = state === 'empty' ? 'git remote -v' : state === 'added' ? 'git remote add origin ' + URL + '\ngit remote -v' : 'git remote set-url origin ' + URL + '\ngit remote -v';
  const output = state === 'empty' ? '(sem saída: nenhum remoto configurado)' : 'origin  ' + URL + ' (fetch)\norigin  ' + URL + ' (push)';
  return <section className="gh11-origin"><div className="gh11-origin-map"><article><Laptop size={23} /><strong>.git/config</strong><span>remoto local: {state === 'empty' ? 'nenhum' : 'origin'}</span></article><ArrowRight /><article><Cloud size={23} /><strong>GitHub</strong><span>{state === 'empty' ? 'ainda sem vínculo local' : URL}</span></article></div><div role="tablist"><button type="button" className={state === 'empty' ? 'active' : ''} onClick={() => setState('empty')}>Antes</button><button type="button" className={state === 'added' ? 'active' : ''} onClick={() => setState('added')}>Adicionar origin</button><button type="button" className={state === 'corrected' ? 'active' : ''} onClick={() => setState('corrected')}>Corrigir URL</button></div><CommandBlock title={state === 'corrected' ? 'Trocar endereço sem apagar o projeto' : 'Adicionar e verificar'} command={command} output={output} meaning={state === 'empty' ? 'Sem origin, Git não conhece um destino padrão.' : 'Fetch e push apontam ao repositório pretendido.'} /></section>;
}

const PUSH_STAGES = [
  { label: 'Pré-voo', command: 'git status\ngit branch --show-current\ngit remote -v', output: 'On branch main\nnothing to commit, working tree clean\nmain\norigin  ' + URL + ' (fetch)\norigin  ' + URL + ' (push)', proof: 'Estado, branch e destino foram conferidos.' },
  { label: 'Push', command: 'git push -u origin main', output: 'Enumerating objects: 12, done.\nCounting objects: 100% (12/12), done.\nWriting objects: 100% (12/12), done.\nTo https://github.com/SEU_USUARIO/formacao-java-backend.git\n * [new branch]      main -> main\nbranch main set up to track origin/main.', proof: 'Objetos foram enviados, main remota nasceu e o upstream foi configurado.' },
  { label: 'Tracking', command: 'git branch -vv\ngit status -sb', output: '* main 8d42a91 [origin/main] Explica as tres areas do Git\n## main...origin/main', proof: 'main acompanha origin/main e não há diferença de commits.' },
  { label: 'GitHub', command: '# Atualize a página do repositório no navegador', output: 'README.md   .gitignore   Main.class não aparece\nLatest commit: Explica as tres areas do Git', proof: 'Arquivos versionados e o commit local agora estão visíveis remotamente.' }
];

function PushLab() {
  const [stage, setStage] = useState(0);
  const current = PUSH_STAGES[stage];
  return <section className="gh11-push"><nav>{PUSH_STAGES.map((item, index) => <button type="button" className={stage === index ? 'active' : index < stage ? 'done' : ''} onClick={() => setStage(index)} key={item.label}><span>{index < stage ? <Check size={13} /> : index + 1}</span>{item.label}</button>)}</nav><div className="gh11-push-grid"><CommandBlock title={current.label} command={current.command} output={current.output} meaning={current.proof} /><div className="gh11-browser compact"><header><span /><span /><span /><code>github.com/SEU_USUARIO/formacao-java-backend</code><em>Simulação didática</em></header><main>{stage < 3 ? <><UploadCloud size={37} /><h3>{stage === 0 ? 'Remoto vazio' : stage === 1 ? 'Autorização no navegador' : 'Branch publicada'}</h3><p>{stage === 1 ? 'O Git Credential Manager pode abrir esta etapa. Confirme domínio, conta e repositório.' : current.proof}</p></> : <><FolderGit2 size={35} /><h3>formacao-java-backend</h3><div className="gh11-files"><span>docs/</span><span>src/</span><span>.gitignore</span><span>README.md</span></div></>}</main></div></div><button type="button" className="next" disabled={stage === PUSH_STAGES.length - 1} onClick={() => setStage(value => value + 1)}><Play size={16} /> Executar próxima evidência</button></section>;
}

function SecondCycle() {
  const [stage, setStage] = useState(0);
  const stages = [
    { title: 'Editar localmente', local: 'README.md modificado', remote: 'Último commit ainda é 8d42a91', command: 'git status --short\ngit diff README.md', output: ' M README.md\n+## Repositório remoto\n+Este projeto registra sua evolução no GitHub.' },
    { title: 'Criar commit local', local: 'main está 1 commit à frente', remote: 'GitHub ainda não mudou', command: 'git add README.md\ngit diff --staged\ngit commit -m "Documenta conexao com repositorio remoto"\ngit status -sb', output: '[main b6c2d10] Documenta conexao com repositorio remoto\n## main...origin/main [ahead 1]' },
    { title: 'Publicar', local: 'main sincronizada', remote: 'Novo commit e README atualizados', command: 'git push\ngit status -sb', output: 'To https://github.com/SEU_USUARIO/formacao-java-backend.git\n   8d42a91..b6c2d10  main -> main\n## main...origin/main' }
  ];
  const current = stages[stage];
  return <section className="gh11-cycle"><div className="gh11-cycle-state"><article><Laptop size={22} /><small>Local</small><strong>{current.local}</strong></article><ArrowRight /><article><Cloud size={22} /><small>GitHub</small><strong>{current.remote}</strong></article></div><CommandBlock title={current.title} command={current.command} output={current.output} meaning={stage === 0 ? 'Editar não publica.' : stage === 1 ? 'Commit continua local até o push.' : 'O remoto recebeu o novo commit e voltou a ficar alinhado.'} /><div className="gh11-cycle-controls"><button type="button" disabled={stage === 0} onClick={() => setStage(value => value - 1)}>Voltar</button><span>{stage + 1} de {stages.length}</span><button type="button" disabled={stage === stages.length - 1} onClick={() => setStage(value => value + 1)}>Avançar</button></div></section>;
}

function SyncLab() {
  const [mode, setMode] = useState('clone');
  const modes = {
    clone: { command: 'Set-Location C:\\dev\\projects\ngit clone ' + URL + '\nSet-Location formacao-java-backend\ngit remote -v', output: 'Cloning into \'formacao-java-backend\'...\norigin  ' + URL + ' (fetch)\norigin  ' + URL + ' (push)', before: 'Somente remoto existe para esta máquina', after: 'Nova pasta + .git + origin + histórico + arquivos', warning: 'Não execute git init depois: clone já criou o repositório.' },
    fetch: { command: 'git fetch origin\ngit log --oneline main..origin/main', output: 'From https://github.com/SEU_USUARIO/formacao-java-backend\n   b6c2d10..c31a820  main -> origin/main\nc31a820 Atualiza instrucoes', before: 'main local atrás; arquivos ainda iguais', after: 'origin/main atualizado; main e arquivos não integrados', warning: 'Fetch permite inspecionar antes de integrar.' },
    pull: { command: 'git status\ngit pull origin main', output: 'Updating b6c2d10..c31a820\nFast-forward\n README.md | 2 ++', before: 'main local atrás e working tree limpo', after: 'main e arquivos recebem a atualização', warning: 'Pull combina fetch e integração; conflito será estudado depois.' }
  };
  const current = modes[mode];
  return <section className="gh11-sync"><nav>{Object.keys(modes).map(id => <button type="button" className={mode === id ? 'active' : ''} onClick={() => setMode(id)} key={id}>{id}</button>)}</nav><div className="gh11-sync-state"><article><small>Antes</small><strong>{current.before}</strong></article><ArrowDown /><article><small>Depois</small><strong>{current.after}</strong></article></div><CommandBlock title={mode} command={current.command} output={current.output} meaning={current.warning} /></section>;
}

const ERRORS = [
  { symptom: 'remote origin already exists', inspect: 'git remote -v', cause: 'origin já foi criado.', fix: 'Se a URL está errada, use git remote set-url origin URL_CORRETA.', confirm: 'remote -v mostra apenas o destino correto.' },
  { symptom: 'No configured push destination', inspect: 'git remote -v e git branch -vv', cause: 'Não há remoto ou upstream.', fix: 'Adicione origin e use git push -u origin main.', confirm: 'main passa a acompanhar origin/main.' },
  { symptom: 'src refspec main does not match any', inspect: 'git branch --show-current e git log --oneline', cause: 'Branch tem outro nome ou ainda não existe commit.', fix: 'Confirme a branch e crie o commit local antes do push.', confirm: 'Log possui commit e push usa a branch real.' },
  { symptom: 'Repository not found', inspect: 'URL, owner, nome, visibilidade e conta autenticada.', cause: 'URL errada ou conta sem permissão.', fix: 'Copie a URL do botão Code e autentique na conta correta.', confirm: 'git ls-remote origin responde sem expor credencial.' },
  { symptom: 'Authentication failed', inspect: 'Método HTTPS/SSH e conta usada pelo credential helper.', cause: 'Senha da conta, credencial expirada ou autorização errada.', fix: 'Use GCM/navegador, PAT seguro ou SSH configurado; nunca inclua token na URL.', confirm: 'Push autentica e a credencial não aparece no histórico.' },
  { symptom: 'non-fast-forward', inspect: 'git fetch origin e compare main..origin/main.', cause: 'O remoto possui commits ausentes localmente.', fix: 'Entenda e integre; não use --force no impulso.', confirm: 'Históricos ficam compatíveis e push normal funciona.' },
  { symptom: 'Commit feito, GitHub não mudou', inspect: 'git status -sb e git branch -vv.', cause: 'Commit está apenas local; falta push.', fix: 'Revise o destino e execute git push.', confirm: 'Página mostra o hash e a mensagem novos.' },
  { symptom: 'git init depois de clone', inspect: 'Get-ChildItem -Force e git remote -v.', cause: 'Confusão entre publicar local e baixar remoto.', fix: 'Pare: clone já criou .git e origin; não reinicialize.', confirm: 'Status, log e origin já funcionam.' },
  { symptom: 'origin removido por engano', inspect: 'git remote -v', cause: 'git remote remove origin desvinculou apenas o local.', fix: 'Adicione novamente a URL correta.', confirm: 'O repositório no GitHub nunca foi apagado por esse comando.' },
  { symptom: 'Segredo apareceu em commit/push', inspect: 'Identifique tipo, arquivo, commit, alcance e provedor.', cause: 'Token, senha ou chave foi versionado.', fix: 'Revogue/rotacione imediatamente; depois avalie limpeza do histórico com ajuda.', confirm: 'Credencial antiga não funciona e o repositório não contém novas cópias.' }
];

function DiagnosisClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="gh11-errors"><nav>{ERRORS.map((error, index) => <button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={error.symptom}><span>{index + 1}</span>{error.symptom}</button>)}</nav><article><header><Wrench size={24} /><div><small>Diagnóstico remoto</small><h3>{item.symptom}</h3></div></header><div>{[['Inspecione', item.inspect, Search], ['Causa provável', item.cause, AlertTriangle], ['Corrija', item.fix, RefreshCw], ['Confirme', item.confirm, CheckCircle2]].map(([title, text, Icon]) => <section key={title}><Icon size={17} /><strong>{title}</strong><p>{text}</p></section>)}</div></article></section>;
}

function EvidenceDoc() {
  return <section className="gh11-evidence"><header><FileText size={18} /><strong>docs/evidencias-github.md</strong><CopyButton value={EVIDENCE} label="Copiar modelo" /></header><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0d1117', fontSize: '.76rem', lineHeight: 1.65 }}>{EVIDENCE}</SyntaxHighlighter><footer><ShieldCheck size={16} /> Registre estados e URLs públicas do projeto; nunca senha, token, chave, código 2FA ou código de recuperação.</footer></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  const map = { remoteMap: RemoteMap, accountWizard: AccountWizard, preflightLab: PreflightLab, repoCreator: RepoCreator, authChooser: AuthChooser, originLab: OriginLab, pushLab: PushLab, secondCycle: SecondCycle, syncLab: SyncLab, diagnosisClinic: DiagnosisClinic, evidenceDoc: EvidenceDoc };
  if (map[block.type]) { const Component = map[block.type]; return <Component />; }
  if (block.type === 'note') { const Icon = block.tone === 'warning' || block.tone === 'danger' ? AlertTriangle : Lightbulb; return <aside className={'guided-note ' + (block.tone || 'info')}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>; }
  if (block.type === 'result') return <section className="guided-result"><h3><ClipboardCheck size={20} /> {block.title}</h3><ul>{block.items.map(item => <li key={item}><CheckCircle2 size={16} /> {item}</li>)}</ul></section>;
  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><GitBranch size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  return null;
}

export default function GuidedGitHubRemoteLesson011({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-github-remote-lesson">
    <header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><UploadCloud size={17} /> Laboratório de publicação segura</span><p className="guided-sequence">011 · M0.11</p><h1>Leve seus commits ao GitHub sem pular nenhuma decisão</h1><p>Crie e proteja a conta, prepare um remoto vazio, autentique com segurança, publique main e prove que local e origin/main estão sincronizados.</p></div><div className="guided-hero-status"><Cloud size={42} /><strong>{progress}%</strong><span>{label}</span></div><div className="guided-progress-track" aria-label={'Progresso: ' + progress + '%'}><span style={{ width: progress + '%' }} /></div></header>
    <GuidedLessonFacts ariaLabel="Resultado da aula" items={[{ value: 2, label: 'pushes observados' }, { value: 3, label: 'formas de baixar' }, { value: 10, label: 'falhas recuperáveis' }]} />
    <div className="guided-layout"><nav className="guided-step-nav" aria-label="Etapas da aula 011"><div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>{steps.map((step, index) => <button type="button" key={step.id} className={(index === activeIndex ? 'active ' : '') + (completed.has(step.id) ? 'done' : '')} onClick={() => select(index)}><span className="guided-step-number">{completed.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}</nav>
      <main className="guided-step-content"><div className="guided-step-heading"><span>{active.eyebrow} · {active.duration}</span><h2>{active.title}</h2></div><div className="guided-blocks">{active.blocks.map((block, index) => <ContentBlock block={block} key={active.id + '-' + block.type + '-' + index} />)}</div><div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => select(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (activeDone ? 'undo' : 'complete')} onClick={toggle}>{activeDone ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><Check size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeDone} onClick={() => select(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div></div>{allDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>{lessonDone ? 'Publicação registrada' : 'Laboratório remoto completo'}</h3><p>{lessonDone ? 'Conta, origem, pushes e conclusão estão registrados.' : 'Conclua a aula para liberar Markdown técnico.'}</p></div><button type="button" className={lessonDone ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonDone ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}</main>
    </div>
    <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 010</button><div className={'guided-course-status ' + (lessonDone ? 'completed' : allDone ? 'ready' : '')}>{lessonDone ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonDone ? 'Aula concluída' : allDone ? 'Pronta para concluir' : completed.size + ' de ' + steps.length + ' etapas'}</strong><small>{lessonDone ? 'Remoto validado' : allDone ? 'Use o botão acima' : 'Conecte e confirme cada estado'}</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonDone}>Aula 012 <ArrowRight size={17} /></button></footer>
  </article>;
}
