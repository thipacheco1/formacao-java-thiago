import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowDown, ArrowLeft, ArrowRight, Box, Boxes, Check,
  CheckCircle2, ChevronRight, CircleDot, Clock3, Code2, Container,
  Copy, Cpu, Download, ExternalLink, FileText, FolderGit2,
  Gauge, HardDrive, KeyRound, Layers3, Lightbulb, ListChecks, LockKeyhole,
  MonitorCog, Network, Play, Power,
  RotateCcw, SearchCheck, Server, Settings2, ShieldCheck, Terminal,
  Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedDockerWslLesson.css';

const STORAGE_KEY = 'guided-docker-wsl-lesson-018-progress';
const DOCKER_WINDOWS = 'https://docs.docker.com/desktop/setup/install/windows-install/';
const DOCKER_WSL = 'https://docs.docker.com/desktop/features/wsl/';
const MICROSOFT_WSL = 'https://learn.microsoft.com/windows/wsl/install';

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard?.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  return <button type="button" className="docker18-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : 'Copiar'}</button>;
}

function CodePanel({ title, code, output, language = 'powershell', note, warning = false }) {
  return <section className="docker18-code">
    <header><span><Code2 size={16} />{title}</span><CopyButton value={code} /></header>
    <SyntaxHighlighter style={vscDarkPlus} language={language} PreTag="div" customStyle={{ margin: 0, borderRadius: 0, fontSize: '.72rem', lineHeight: 1.65, padding: '16px' }}>{code}</SyntaxHighlighter>
    {output && <div className="docker18-output"><small>SAÍDA ESPERADA · EXEMPLO DIDÁTICO</small><pre>{output}</pre></div>}
    {note && <footer className={warning ? 'warning' : ''}>{warning ? <AlertTriangle size={17} /> : <SearchCheck size={17} />}<span>{note}</span></footer>}
  </section>;
}

function ArchitectureMap() {
  const [active, setActive] = useState('engine');
  const layers = [
    { id: 'windows', label: 'Windows', icon: MonitorCog, detail: 'Host: interface, arquivos, portas e terminal PowerShell.' },
    { id: 'wsl', label: 'WSL2', icon: Cpu, detail: 'Ambiente Linux com kernel real integrado ao Windows.' },
    { id: 'desktop', label: 'Docker Desktop', icon: Settings2, detail: 'Empacota engine, integração, atualizações e interface de operação.' },
    { id: 'engine', label: 'Docker Engine', icon: Server, detail: 'Servidor que recebe comandos da CLI e gerencia objetos Docker.' },
    { id: 'container', label: 'Contêiner', icon: Container, detail: 'Processo isolado criado a partir de uma imagem; não é uma VM completa.' }
  ];
  const current = layers.find(item => item.id === active);
  const CurrentIcon = current.icon;
  return <section className="docker18-architecture">
    <div className="docker18-layer-stack" role="list" aria-label="Camadas da arquitetura Docker no Windows">
      {layers.map((item, index) => { const Icon = item.icon; return <React.Fragment key={item.id}>
        <button type="button" className={active === item.id ? 'active' : ''} onClick={() => setActive(item.id)}><Icon size={22} /><span>{item.label}</span></button>
        {index < layers.length - 1 && <ArrowDown size={16} aria-hidden="true" />}
      </React.Fragment>; })}
    </div>
    <article><CurrentIcon size={38} /><div><small>CAMADA SELECIONADA</small><h3>{current.label}</h3><p>{current.detail}</p></div></article>
    <div className="docker18-compare"><section><strong>Contêiner</strong><span>Compartilha o kernel disponibilizado pelo ambiente Linux, inicia como processo e carrega só o necessário.</span></section><section><strong>VM tradicional</strong><span>Em geral inclui sistema operacional convidado completo e virtualiza uma máquina inteira.</span></section></div>
    <p><Lightbulb size={18} /><span><strong>A CLI não é o engine.</strong> O comando que você digita atravessa um canal até o servidor Docker. Essa separação explicará várias falhas depois.</span></p>
  </section>;
}

const REQUIREMENTS = [
  ['Windows compatível', 'Abra `winver` e compare a edição/build com a página oficial atual.', 'Versão suportada'],
  ['8 GB de RAM', 'Gerenciador de Tarefas → Desempenho → Memória.', '8 GB ou mais'],
  ['Virtualização', 'Gerenciador de Tarefas → Desempenho → CPU → Virtualização.', 'Habilitada'],
  ['WSL moderno', 'Execute `wsl --version`; o Docker exige ao menos WSL 2.1.5 e recomenda a versão atual.', '2.1.5 ou superior']
];

function RequirementAudit() {
  const [states, setStates] = useState(['unknown', 'unknown', 'unknown', 'unknown']);
  const cycle = index => setStates(value => value.map((state, item) => item === index ? (state === 'unknown' ? 'ok' : state === 'ok' ? 'attention' : 'unknown') : state));
  const labels = { unknown: 'Ainda não provei', ok: 'Prova conferida', attention: 'Precisa corrigir' };
  return <section className="docker18-requirements">
    <div className="docker18-task-manager"><header><span>Gerenciador de Tarefas · Desempenho</span><em>SIMULAÇÃO DIDÁTICA</em></header><div><aside><strong>CPU</strong><span>Memória</span><span>Disco 0</span></aside><main><div className="docker18-cpu-chart" aria-label="Gráfico decorativo de uso da CPU"><i /><i /><i /><i /><i /><i /><i /><i /></div><dl><div><dt>Processador</dt><dd>64 bits</dd></div><div><dt>Memória</dt><dd>16,0 GB</dd></div><div><dt>Virtualização</dt><dd className="ok">Habilitada</dd></div></dl></main></div></div>
    <div className="docker18-requirement-grid">{REQUIREMENTS.map((item, index) => <button type="button" className={states[index]} onClick={() => cycle(index)} key={item[0]}><span>{states[index] === 'ok' ? <CheckCircle2 /> : states[index] === 'attention' ? <AlertTriangle /> : <CircleDot />}</span><strong>{item[0]}</strong><small>{item[1]}</small><b>{labels[states[index]]}</b><em>Meta: {item[2]}</em></button>)}</div>
    <aside className="guided-note warning"><AlertTriangle size={21} /><div><strong>Virtualização desabilitada não se corrige por tentativa</strong><p>Consulte a documentação do fabricante do computador ou da placa-mãe antes de alterar BIOS/UEFI. Registre o estado original e não mude outras opções.</p></div></aside>
  </section>;
}

const WSL_PATHS = {
  absent: {
    name: 'WSL ausente',
    command: 'wsl --install -d Ubuntu',
    output: 'Installing: Virtual Machine Platform\nInstalling: Windows Subsystem for Linux\nInstalling: Ubuntu\nThe requested operation is successful. A restart may be required.',
    action: 'Abra PowerShell como administrador somente para a instalação. Reinicie se solicitado; depois abra Ubuntu e crie usuário e senha Linux.'
  },
  outdated: {
    name: 'WSL instalado, mas antigo',
    command: 'wsl --version\nwsl --update',
    output: 'WSL version: <versão instalada>\nChecking for updates...\nThe most recent version of Windows Subsystem for Linux is already installed.',
    action: 'Atualize, reabra o terminal e execute `wsl --version` outra vez. A nova prova, não a mensagem de instalação, encerra o passo.'
  },
  wsl1: {
    name: 'Ubuntu ainda em WSL1',
    command: 'wsl -l -v\nwsl --set-version Ubuntu 2\nwsl -l -v',
    output: '  NAME      STATE           VERSION\n* Ubuntu    Stopped         1\nConversion in progress...\n  NAME      STATE           VERSION\n* Ubuntu    Stopped         2',
    action: 'Use exatamente o nome mostrado em `wsl -l -v`. Conversão pode demorar; não interrompa nem invente outro nome.'
  },
  ready: {
    name: 'WSL2 pronto',
    command: 'wsl --version\nwsl --status\nwsl -l -v',
    output: 'WSL version: <2.1.5 ou superior>\nDefault Distribution: Ubuntu\nDefault Version: 2\n\n  NAME      STATE           VERSION\n* Ubuntu    Stopped         2',
    action: 'Você provou software WSL, padrão e distribuição. Estado `Stopped` é normal quando a distribuição não está em uso.'
  }
};

function WslLab() {
  const [path, setPath] = useState('absent');
  const item = WSL_PATHS[path];
  return <section className="docker18-wsl">
    <nav>{Object.entries(WSL_PATHS).map(([id, entry]) => <button type="button" className={path === id ? 'active' : ''} onClick={() => setPath(id)} key={id}>{entry.name}</button>)}</nav>
    <CodePanel title={`PowerShell · rota: ${item.name}`} code={item.command} output={item.output} note={item.action} />
    <div className="docker18-linux-user"><Terminal size={28} /><div><small>PRIMEIRA ABERTURA DO UBUNTU</small><strong>Crie uma identidade Linux separada</strong><code>Enter new UNIX username: thiago</code><code>New password: </code><span>Nada aparece enquanto a senha é digitada; isso é comportamento normal, não travamento. Essa senha não precisa ser a do Windows.</span></div></div>
    <a className="docker18-official-link" href={MICROSOFT_WSL} target="_blank" rel="noreferrer">Instalação oficial do WSL <ExternalLink size={14} /></a>
  </section>;
}

function DockerInstaller() {
  const [stage, setStage] = useState(0);
  const stages = [
    ['Conferir licença', 'Uso pessoal, educacional e pequenos negócios pode ser gratuito dentro dos termos; organizações maiores e governo exigem assinatura apropriada.'],
    ['Baixar da fonte', 'Use a página oficial do Docker Desktop para Windows e escolha a arquitetura indicada para sua máquina.'],
    ['Escolher escopo', 'Instalação por usuário é adequada para a maioria. “Todos os usuários” altera caminho e privilégios e deve seguir a política da máquina.'],
    ['Usar backend WSL2', 'Mantenha o backend WSL2. Não instale outro Docker Engine dentro do Ubuntu para “ajudar”.'],
    ['Abrir o aplicativo', 'A instalação não significa engine iniciado: abra Docker Desktop, aceite os termos aplicáveis e aguarde o estado operacional.']
  ];
  const item = stages[stage];
  return <section className="docker18-installer">
    <header><span><Box size={18} /> Docker Desktop Installer</span><em>SIMULAÇÃO DIDÁTICA · A TELA REAL PODE VARIAR</em></header>
    <div className="docker18-installer-body"><aside>{stages.map((entry, index) => <button type="button" className={stage === index ? 'active' : index < stage ? 'done' : ''} onClick={() => setStage(index)} key={entry[0]}><span>{index < stage ? <Check size={12} /> : index + 1}</span>{entry[0]}</button>)}</aside><main><div className="docker18-window-logo"><Container size={54} /></div><small>PASSO {stage + 1} DE {stages.length}</small><h3>{item[0]}</h3><p>{item[1]}</p>{stage === 0 && <div className="docker18-license"><ShieldCheck size={20} /><span>Em empresa, não assuma gratuidade: confirme porte, receita, finalidade e contrato com o responsável.</span></div>}{stage === 2 && <div className="docker18-scope"><span className="selected">Instalar para este usuário <b>recomendado na maioria dos casos</b></span><span>Instalar para todos <b>exige decisão administrativa</b></span></div>}{stage === 4 && <div className="docker18-engine-state"><Power size={20} /><span><b>Engine starting…</b>Aguarde até a interface indicar que está em execução; depois prove no terminal.</span></div>}<button type="button" disabled={stage === stages.length - 1} onClick={() => setStage(value => value + 1)}>Continuar <ArrowRight size={16} /></button></main></div>
    <a className="docker18-official-link" href={DOCKER_WINDOWS} target="_blank" rel="noreferrer"><Download size={15} /> Instalação oficial do Docker Desktop <ExternalLink size={14} /></a>
  </section>;
}

function SettingsLab() {
  const [tab, setTab] = useState('general');
  const [engine, setEngine] = useState(true);
  const [integration, setIntegration] = useState(true);
  return <section className="docker18-settings">
    <header><span><Container size={17} /> Docker Desktop</span><span className="running"><i /> Engine running</span></header>
    <div><aside><button type="button">Containers</button><button type="button">Images</button><button type="button" className="active"><Settings2 size={15} /> Settings</button></aside><main><nav><button type="button" className={tab === 'general' ? 'active' : ''} onClick={() => setTab('general')}>General</button><button type="button" className={tab === 'wsl' ? 'active' : ''} onClick={() => setTab('wsl')}>Resources → WSL Integration</button></nav>{tab === 'general' ? <section><h3>General</h3><label><input type="checkbox" checked={engine} onChange={event => setEngine(event.target.checked)} /><span><strong>Use the WSL 2 based engine</strong><small>Pode já estar ativo ou não aparecer em algumas versões/configurações.</small></span></label><p className={!engine ? 'danger' : ''}>{engine ? 'Backend WSL2 selecionado. Salve/reinicie somente se a interface solicitar.' : 'Sem backend WSL2, esta aula não pode considerar o ambiente pronto.'}</p></section> : <section><h3>WSL Integration</h3><div className="docker18-distro"><span><Terminal size={19} /><b>Ubuntu</b><small>VERSION 2</small></span><label className="docker18-switch"><input type="checkbox" checked={integration} onChange={event => setIntegration(event.target.checked)} /><i /></label></div><p className={!integration ? 'danger' : ''}>{integration ? 'A CLI Docker ficará disponível dentro desta distribuição.' : 'PowerShell do Windows ainda pode acessar Docker Desktop; Ubuntu não terá integração desta distribuição.'}</p></section>}</main></div>
    <footer><Lightbulb size={18} /><span><strong>Dois contextos, uma distinção importante:</strong> PowerShell usa o Docker Desktop no Windows; o terminal Ubuntu precisa da integração da distribuição para usar a CLI por dentro do WSL.</span></footer>
    <a className="docker18-official-link" href={DOCKER_WSL} target="_blank" rel="noreferrer">Backend WSL oficial do Docker <ExternalLink size={14} /></a>
  </section>;
}

const PROOFS = [
  { label: 'CLI existe', command: 'docker --version', output: 'Docker version <versão instalada>, build <identificador>', verdict: 'Prova que o executável cliente foi encontrado. Não prova que o engine respondeu.' },
  { label: 'Cliente + servidor', command: 'docker version', output: 'Client:\n Version: <versão do cliente>\n\nServer: Docker Desktop\n Engine:\n  Version: <versão do engine>', verdict: 'As duas seções provam que o cliente alcançou o servidor. Se “Server” falhar, investigue Desktop/engine/canal.' },
  { label: 'Estado do engine', command: 'docker info', output: 'Client: Docker Engine - Community\n...\nServer:\n Containers: <quantidade>\n Images: <quantidade>\n Operating System: Docker Desktop', verdict: 'Detalha o engine. A saída é longa; procure primeiro seção Server e mensagem de erro, não copie tudo sem ler.' },
  { label: 'Compose', command: 'docker compose version', output: 'Docker Compose version v<versão instalada>', verdict: 'Prova o plugin Compose v2. O comando atual usa espaço: `docker compose`, não exige praticar Compose nesta aula.' }
];

function EngineProof() {
  const [active, setActive] = useState(0);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const item = PROOFS[active];
  const engineCommand = active === 1 || active === 2;
  const output = !desktopOpen && engineCommand ? 'Client:\n Version: <versão do cliente>\n\nERROR: Cannot connect to the Docker daemon.\nIs the Docker Desktop engine running?' : item.output;
  const note = !desktopOpen && engineCommand ? 'O cliente existe, mas o servidor não respondeu. Abra Docker Desktop, aguarde Engine running e repita exatamente esta prova.' : item.verdict;
  return <section className="docker18-proof">
    <div className="docker18-proof-toolbar"><nav>{PROOFS.map((proof, index) => <button type="button" className={active === index ? 'active' : ''} onClick={() => setActive(index)} key={proof.label}>{proof.label}</button>)}</nav><label><input type="checkbox" checked={desktopOpen} onChange={event => setDesktopOpen(event.target.checked)} /> Docker Desktop aberto</label></div>
    <div className="docker18-client-engine"><span><Terminal size={24} /><b>Docker CLI</b></span><ChevronRight /><span className={desktopOpen ? 'ok' : 'broken'}><Network size={24} /><b>Canal</b></span><ChevronRight /><span className={desktopOpen ? 'ok' : 'broken'}><Server size={24} /><b>Engine</b></span></div>
    <CodePanel title="PowerShell · cadeia de provas" code={item.command} output={output} note={note} warning={!desktopOpen && engineCommand} />
  </section>;
}

const OBJECTS = {
  registry: { icon: Box, title: 'Registry', subtitle: 'Catálogo remoto', text: 'Armazena e distribui imagens. Docker Hub é um exemplo; empresas podem exigir registry interno.', example: 'docker pull hello-world:latest' },
  image: { icon: Layers3, title: 'Imagem', subtitle: 'Pacote imutável em camadas', text: 'Contém arquivos, binários, bibliotecas e configuração necessários para criar contêineres.', example: 'hello-world:latest' },
  container: { icon: Container, title: 'Contêiner', subtitle: 'Instância/processo isolado', text: 'É criado a partir da imagem e pode estar criado, executando, parado ou removido.', example: 'curso-hello · exited' }
};

function ObjectLab() {
  const [active, setActive] = useState('image');
  const item = OBJECTS[active];
  const Icon = item.icon;
  return <section className="docker18-objects">
    <div className="docker18-object-flow"><button type="button" className={active === 'registry' ? 'active' : ''} onClick={() => setActive('registry')}><Box /><strong>Registry</strong><small>guarda imagens</small></button><ChevronRight /><button type="button" className={active === 'image' ? 'active' : ''} onClick={() => setActive('image')}><Layers3 /><strong>Imagem</strong><small>modelo em camadas</small></button><ChevronRight /><button type="button" className={active === 'container' ? 'active' : ''} onClick={() => setActive('container')}><Container /><strong>Contêiner</strong><small>processo isolado</small></button></div>
    <article><Icon size={40} /><div><small>{item.subtitle}</small><h3>{item.title}</h3><p>{item.text}</p><code>{item.example}</code></div></article>
    <div className="docker18-image-layers"><span>configuração</span><span>aplicação/binário</span><span>bibliotecas</span><span>sistema de arquivos base</span></div>
    <aside className="guided-note info"><Lightbulb size={21} /><div><strong>“Imagem é classe; contêiner é objeto” ajuda, mas tem limite</strong><p>A analogia explica modelo e instância. Não explica processo, filesystem em camadas, rede ou ciclo de vida; não a transforme em definição.</p></div></aside>
  </section>;
}

const HELLO_STAGES = [
  ['Comando', 'A CLI recebe a intenção', 'docker run --name curso-hello hello-world'],
  ['Procurar imagem', 'O engine verifica o cache local', 'Imagem hello-world não encontrada localmente.'],
  ['Pull', 'As camadas vêm do registry', 'latest: Pulling from library/hello-world\nStatus: Downloaded newer image for hello-world:latest'],
  ['Create + start', 'O engine cria e inicia o processo', 'Container curso-hello iniciado a partir de hello-world:latest.'],
  ['Saída', 'O processo escreve no terminal', 'Hello from Docker!\nA instalação conseguiu executar um contêiner.'],
  ['Exit', 'O processo termina normalmente', 'curso-hello   hello-world   Exited (0)']
];

function HelloWorldLab() {
  const [stage, setStage] = useState(0);
  const item = HELLO_STAGES[stage];
  return <section className="docker18-hello">
    <div className="docker18-hello-timeline">{HELLO_STAGES.map((entry, index) => <button type="button" className={stage === index ? 'active' : index < stage ? 'done' : ''} onClick={() => setStage(index)} key={entry[0]}><span>{index < stage ? <Check size={12} /> : index + 1}</span><b>{entry[0]}</b></button>)}</div>
    <CodePanel title={`PowerShell · ${item[0]}`} code={stage === 0 ? item[2] : 'docker run --name curso-hello hello-world'} output={stage === 0 ? undefined : item[2]} note={item[1]} />
    <button type="button" className="docker18-next" disabled={stage === HELLO_STAGES.length - 1} onClick={() => setStage(value => value + 1)}><Play size={15} /> Avançar execução</button>
    {stage === HELLO_STAGES.length - 1 && <div className="docker18-docker-ui"><header><span><Container size={16} /> Docker Desktop · Containers</span><em>SIMULAÇÃO DIDÁTICA</em></header><nav><button type="button" className="active">Containers</button><button type="button">Images</button><button type="button">Volumes</button></nav><main><div><span className="exited" /><strong>curso-hello</strong><code>hello-world:latest</code><b>Exited (0)</b></div></main><footer><code>docker ps</code><span>vazio: nenhum contêiner executando</span><code>docker ps -a</code><span>mostra curso-hello encerrado</span><code>docker images</code><span>mostra hello-world</span></footer></div>}
  </section>;
}

function RuntimeLab() {
  const [hostPort, setHostPort] = useState('5433');
  const [localPostgres, setLocalPostgres] = useState(true);
  const conflict = localPostgres && hostPort === '5432';
  return <section className="docker18-runtime">
    <div className="docker18-port-controls"><label>Porta no Windows<select value={hostPort} onChange={event => setHostPort(event.target.value)}><option value="5432">5432</option><option value="5433">5433</option><option value="15432">15432</option></select></label><label><input type="checkbox" checked={localPostgres} onChange={event => setLocalPostgres(event.target.checked)} /> PostgreSQL local já usa 5432</label></div>
    <div className="docker18-port-map"><section><MonitorCog size={28} /><small>WINDOWS · HOST</small><strong>localhost:{hostPort}</strong><span className={conflict ? 'danger' : 'ok'}>{conflict ? 'porta ocupada' : 'porta disponível'}</span></section><div><Network size={24} /><code>-p {hostPort}:5432</code><span>host : contêiner</span></div><section><Container size={28} /><small>CONTÊINER</small><strong>PostgreSQL :5432</strong><span>porta interna</span></section></div>
    <CodePanel title="Modelo conceitual · não execute com segredo real na linha de comando" code={`docker run --name postgres-lab -p ${hostPort}:5432 -e POSTGRES_PASSWORD=<defina-por-meio-seguro> -v dados-postgres:/var/lib/postgresql/data postgres:<tag-aprovada>`} language="powershell" output={conflict ? `Error: port ${hostPort} is already allocated` : `Mapeamento planejado: localhost:${hostPort} → container:5432`} note={conflict ? 'O PostgreSQL da Aula 16 já ocupa 5432. Não desligue ao acaso: publique o contêiner em 5433 e mantenha 5432 internamente.' : 'Porta, credencial, volume e tag devem ser decididos antes da execução real. Este comando contém placeholders deliberados.'} warning={conflict} />
    <div className="docker18-runtime-grid"><article><HardDrive size={25} /><strong>Volume nomeado</strong><p>`dados-postgres` sobrevive à remoção do contêiner. Isso protege persistência, mas não substitui backup.</p><span><AlertTriangle size={15} /> Não remova volume sem identificar dono, dados e recuperação.</span></article><article><KeyRound size={25} /><strong>Variável de ambiente</strong><p>`-e` injeta configuração; não transforma senha em segredo. Histórico, inspect e processos podem expor valores.</p><span><LockKeyhole size={15} /> Use o mecanismo seguro definido pelo projeto/time.</span></article><article><FileText size={25} /><strong>Depois, não agora</strong><p>Dockerfile descreve imagem; Compose descreve serviços relacionados. A prática profunda virá em aulas próprias.</p><span><FolderGit2 size={15} /> Versione exemplos, não `.env`, dados ou logs.</span></article></div>
  </section>;
}

const ERRORS = [
  ['WSL ausente', '`wsl` não existe ou oferece instalação', '`wsl --status` e Recursos do Windows', 'Instalar pela rota oficial, reiniciar se solicitado e repetir `wsl --version`.'],
  ['Distribuição WSL1', '`wsl -l -v` mostra VERSION 1', '`wsl -l -v` com o nome exato', '`wsl --set-version <nome> 2`; aguardar e provar VERSION 2.'],
  ['Desktop fechado', '`docker --version` funciona; `docker version` falha no Server', 'Interface e estado Engine running', 'Abrir Docker Desktop, aguardar e repetir `docker version`.'],
  ['Virtualização', 'WSL2/engine não inicia', 'Task Manager e documentação do fabricante', 'Habilitar somente a opção correta em BIOS/UEFI e repetir a prova.'],
  ['Integração ausente', 'Docker funciona no PowerShell, não no Ubuntu', 'Resources → WSL Integration e distro VERSION 2', 'Ativar a distribuição correta, aplicar e provar dentro do Ubuntu.'],
  ['Porta ocupada', '“port is already allocated”', '`Get-NetTCPConnection` e serviços conhecidos', 'Escolher porta host livre, por exemplo 5433:5432; não matar processo ao acaso.'],
  ['Objeto confundido', 'Tenta iniciar uma imagem ou apagar o item errado', '`docker images` versus `docker ps -a`', 'Identificar tipo, nome/ID e estado antes do comando.'],
  ['Volume em risco', 'Limpeza ameaça dados do banco', '`docker volume inspect <nome>` e documentação do projeto', 'Parar; confirmar dono, backup e autorização. Esta aula não remove volumes.'],
  ['Comando desconhecido', 'Tutorial pede `prune`, `--privileged` ou mount sensível', 'Fonte, cada flag, escopo e reversibilidade', 'Não executar até explicar consequência e obter autorização adequada.'],
  ['Serviço incompreendido', 'Contêiner está “Up”, mas aplicação não conecta', 'Logs, health, porta, credencial e protocolo', 'Diagnosticar o serviço; Docker não corrige contrato nem configuração interna.']
];

function ErrorClinic() {
  const [active, setActive] = useState(0);
  const item = ERRORS[active];
  return <section className="docker18-errors">
    <nav>{ERRORS.map((entry, index) => <button type="button" className={active === index ? 'active' : ''} onClick={() => setActive(index)} key={entry[0]}><span>{index + 1}</span>{entry[0]}</button>)}</nav>
    <article><header><AlertTriangle size={25} /><div><small>SINTOMA</small><h3>{item[1]}</h3></div></header><div className="docker18-diagnosis"><section><small>INSPECIONAR</small><p>{item[2]}</p></section><ChevronRight /><section><small>CORRIGIR + PROVAR</small><p>{item[3]}</p></section></div><div className="docker18-stop-rule"><ShieldCheck size={20} /><span><strong>Regra profissional:</strong> altere uma camada, repita a prova daquela camada e só então avance.</span></div></article>
    <div className="docker18-security"><section><LockKeyhole /><strong>Segurança</strong><span>Sem segredo em comando/documento; sem `--privileged`, socket Docker ou montagem ampla sem justificativa; não exponha serviço desnecessariamente.</span></section><section><Box /><strong>Empresa</strong><span>Confirme licença, registry interno, proxy, certificados, atualização, EDR e processo de aprovação.</span></section><section><Gauge /><strong>Recursos</strong><span>Contêiner não torna CPU, memória ou disco infinitos. Monitore consumo e limites.</span></section></div>
  </section>;
}

const DOCKER_DOC = `# Docker e WSL2 — ambiente observado

## WSL

- Versão do WSL: <preencher com saída observada>
- Distribuição: Ubuntu
- Versão da distribuição: WSL2

## Docker Desktop

- Origem: documentação oficial
- Backend: WSL2
- Integração: Ubuntu

## Cadeia de provas

- \`docker --version\`: cliente encontrado
- \`docker version\`: cliente e servidor responderam
- \`docker compose version\`: plugin Compose encontrado
- \`docker run hello-world\`: contêiner executado e encerrado

## Segurança

- Nenhuma senha, token ou dado local versionado.
- Volumes não são removidos sem identificação e backup.`;

function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const delivery = [
    ['Provar', 'Registre valores realmente observados; não copie versões da simulação.', 'wsl --version\nwsl --status\nwsl -l -v\ndocker --version\ndocker version\ndocker compose version'],
    ['Documentar', 'Crie documentos nominais e preserve apenas evidências não sensíveis.', 'docs/ambiente.md\ndocs/docker-basico.md\ndocs/diario-de-bordo.md\ndocs/atalhos.md'],
    ['Inspecionar', 'O contêiner conhecido terminou; a imagem continua disponível.', 'docker ps\ndocker ps -a --filter "name=curso-hello"\ndocker images hello-world'],
    ['Limpar conhecido', 'Remova somente `curso-hello` depois de confirmar nome e estado. Não remova imagem ou volume.', 'docker rm curso-hello\ndocker ps -a --filter "name=curso-hello"'],
    ['Revisar Git', 'Prepare somente os quatro documentos e leia o staged.', 'git status --short\ngit diff -- docs/ambiente.md docs/docker-basico.md docs/diario-de-bordo.md docs/atalhos.md\ngit add docs/ambiente.md docs/docker-basico.md docs/diario-de-bordo.md docs/atalhos.md\ngit diff --staged --check\ngit diff --staged'],
    ['Commitar', 'Registre a preparação e confirme a árvore.', 'git commit -m "docs: registra ambiente Docker e WSL2"\ngit status --short']
  ];
  const item = delivery[stage];
  const [preview, setPreview] = useState(false);
  return <section className="docker18-delivery">
    <nav>{delivery.map((entry, index) => <button type="button" className={stage === index ? 'active' : index < stage ? 'done' : ''} onClick={() => setStage(index)} key={entry[0]}><span>{index < stage ? <Check size={12} /> : index + 1}</span>{entry[0]}</button>)}</nav>
    {stage === 1 ? <section className="docker18-doc"><header><span><FileText size={16} /> docs/docker-basico.md</span><div><button type="button" className={!preview ? 'active' : ''} onClick={() => setPreview(false)}>Editor</button><button type="button" className={preview ? 'active' : ''} onClick={() => setPreview(true)}>Preview</button><CopyButton value={DOCKER_DOC} /></div></header>{preview ? <article><h2>Docker e WSL2 — ambiente observado</h2><h3>WSL</h3><ul><li>Versão observada, distribuição Ubuntu e WSL2.</li></ul><h3>Docker Desktop</h3><ul><li>Origem oficial, backend WSL2 e integração Ubuntu.</li></ul><h3>Cadeia de provas</h3><p>Cliente, servidor, Compose e hello-world documentados sem segredo.</p></article> : <SyntaxHighlighter style={vscDarkPlus} language="markdown" PreTag="div" customStyle={{ margin: 0, borderRadius: 0, fontSize: '.69rem', minHeight: 360 }}>{DOCKER_DOC}</SyntaxHighlighter>}</section> : <CodePanel title={stage < 4 ? 'PowerShell · evidência e objeto conhecido' : 'PowerShell · entrega nominal'} code={item[2]} note={item[1]} warning={stage === 3} />}
    <div className="docker18-defense"><Wrench size={27} /><div><small>DEFESA ORAL ANTES DE CONCLUIR</small><strong>Explique a cadeia inteira sem decorar</strong><span>O que cada comando prova? Por que CLI pode funcionar com engine parado? Onde WSL2 entra? Por que `docker ps` pode estar vazio após sucesso? Qual lado de `5433:5432` é o Windows? O que sobrevive quando um contêiner é removido?</span></div></div>
    <button type="button" className="docker18-next" disabled={stage === delivery.length - 1} onClick={() => setStage(value => value + 1)}>Próximo estado <ArrowRight size={16} /></button>
  </section>;
}

const steps = [
  { id: 'arquitetura', label: 'Montar o mapa', duration: '9 min', eyebrow: 'MODELO MENTAL', title: 'Windows, WSL2, Docker Desktop e engine são camadas diferentes', blocks: [{ type: 'lead', text: 'Comece pelo mapa que usaremos em todo diagnóstico. Clique nas camadas e explique o caminho entre seu comando e o processo isolado.' }, { type: 'architecture' }, { type: 'result', title: 'Usos que essa base vai sustentar', items: ['PostgreSQL, Redis, RabbitMQ, Kafka e Mongo reproduzíveis.', 'Serviços falsos e dependências locais para testes.', 'Aplicações Java e ferramentas de observabilidade em etapas futuras.', 'Ambientes consistentes sem confundir contêiner com máquina virtual.'] }] },
  { id: 'prequisitos', label: 'Auditar requisitos', duration: '10 min', eyebrow: 'ANTES DE INSTALAR', title: 'Pré-requisito precisa de prova, não de esperança', blocks: [{ type: 'lead', text: 'Use o mock como guia para localizar cada evidência na sua máquina. Marque mentalmente: ainda não provei, conferido ou precisa corrigir.' }, { type: 'requirements' }] },
  { id: 'wsl', label: 'Preparar o WSL2', duration: '14 min', eyebrow: 'LINUX INTEGRADO AO WINDOWS', title: 'Escolha a rota que corresponde ao estado real da sua máquina', blocks: [{ type: 'lead', text: 'Não execute todos os comandos em sequência. Selecione o cenário real, leia a saída esperada e só avance depois da nova prova.' }, { type: 'wsl' }, { type: 'note', title: 'Se `wsl --install` mostrar ajuda em vez de instalar', text: 'O WSL pode já existir. Use `wsl --list --online` e depois `wsl --install -d Ubuntu`; se o download ficar preso, consulte a opção oficial `--web-download` na documentação Microsoft.' }] },
  { id: 'instalacao', label: 'Instalar o Desktop', duration: '12 min', eyebrow: 'FONTE, ESCOPO E LICENÇA', title: 'Instalação termina quando o aplicativo abre e o engine fica pronto', blocks: [{ type: 'lead', text: 'Percorra as cinco decisões. Em máquina corporativa, política e licença vêm antes do clique.' }, { type: 'installer' }] },
  { id: 'integracao', label: 'Configurar integração', duration: '11 min', eyebrow: 'DOCKER DESKTOP SETTINGS', title: 'Backend WSL2 e integração da distribuição resolvem problemas diferentes', blocks: [{ type: 'lead', text: 'Navegue pela simulação das configurações. Compare o uso no PowerShell com o uso dentro do Ubuntu.' }, { type: 'settings' }, { type: 'note', tone: 'warning', title: 'Não instale outro engine dentro do Ubuntu por conta própria', text: 'Docker Desktop já fornece engine e integração. Uma instalação Linux separada pode criar dois contextos, conflitos e resultados contraditórios.' }] },
  { id: 'provas', label: 'Provar cliente e engine', duration: '13 min', eyebrow: 'CLI ≠ SERVIDOR', title: 'Cada comando responde a uma pergunta diferente', blocks: [{ type: 'lead', text: 'Alterne os comandos e feche virtualmente o Desktop. Observe qual prova continua funcionando e em qual ponto a cadeia quebra.' }, { type: 'proof' }] },
  { id: 'objetos', label: 'Distinguir objetos', duration: '10 min', eyebrow: 'VOCABULÁRIO OPERACIONAL', title: 'Registry guarda imagem; imagem cria contêiner; contêiner executa processo', blocks: [{ type: 'lead', text: 'Clique nos três objetos e diga qual comando ou tela prova a existência de cada um.' }, { type: 'objects' }] },
  { id: 'hello', label: 'Executar hello-world', duration: '14 min', eyebrow: 'PRIMEIRO CONTÊINER', title: 'Acompanhe pull, criação, execução, saída e encerramento', blocks: [{ type: 'lead', text: 'Avance um estado por vez. O objetivo não é apenas ver a frase de sucesso, mas reconstruir o que o engine fez.' }, { type: 'hello' }, { type: 'result', title: 'Três leituras que evitam confusão', items: ['`docker ps` lista somente contêineres em execução por padrão.', '`docker ps -a` também mostra o `curso-hello` encerrado.', '`docker images` mostra a imagem, que continua existindo após o processo terminar.'] }] },
  { id: 'runtime', label: 'Mapear recursos', duration: '15 min', eyebrow: 'PORTAS, VOLUMES E CONFIGURAÇÃO', title: 'Publicar, persistir e configurar são decisões independentes', blocks: [{ type: 'lead', text: 'Mude a porta no Windows e observe o conflito com o PostgreSQL local. Depois separe porta, volume e variável sem executar o modelo com placeholders.' }, { type: 'runtime' }] },
  { id: 'erros', label: 'Diagnosticar com segurança', duration: '16 min', eyebrow: 'CLÍNICA POR CAMADAS', title: 'Sintoma, inspeção, correção e nova prova — sem limpeza cega', blocks: [{ type: 'lead', text: 'Passe pelos dez cenários. Nenhum deles autoriza `docker system prune`, remoção de volume ou `wsl --unregister`.' }, { type: 'errors' }] },
  { id: 'entrega', label: 'Documentar e defender', duration: '15 min', eyebrow: 'EVIDÊNCIA RECUPERÁVEL', title: 'Feche com ambiente documentado, objeto conhecido e Git nominal', blocks: [{ type: 'lead', text: 'Registre somente valores observados, remova apenas o contêiner didático conhecido e revise cada arquivo antes do commit.' }, { type: 'delivery' }, { type: 'challenge', title: 'Transferência: “Docker está instalado, mas não funciona”', text: 'No PowerShell, `docker --version` mostra uma versão. `docker version` mostra Client e falha antes de Server. No Ubuntu, `docker` não é reconhecido. Explique dois problemas possíveis e a ordem de investigação.', acceptance: ['Você não reinstala tudo imediatamente.', 'Você identifica que a CLI do Windows existe, mas o engine ainda não foi provado.', 'Você abre Docker Desktop, aguarda Engine running e repete `docker version`.', 'Você trata a ausência dentro do Ubuntu como integração da distribuição separada.', 'Você confirma `wsl -l -v` e ativa somente a distribuição correta.', 'Você não instala um segundo Docker Engine dentro do Ubuntu.'] }] }
];

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  const components = { architecture: ArchitectureMap, requirements: RequirementAudit, wsl: WslLab, installer: DockerInstaller, settings: SettingsLab, proof: EngineProof, objects: ObjectLab, hello: HelloWorldLab, runtime: RuntimeLab, errors: ErrorClinic, delivery: DeliveryLab };
  if (components[block.type]) { const Component = components[block.type]; return <Component />; }
  if (block.type === 'note') { const Icon = block.tone === 'warning' ? AlertTriangle : Lightbulb; return <aside className={`guided-note ${block.tone || 'info'}`}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>; }
  if (block.type === 'result') return <section className="guided-result"><h3><SearchCheck size={20} />{block.title}</h3><ul>{block.items.map(item => <li key={item}><CheckCircle2 size={16} />{item}</li>)}</ul></section>;
  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Wrench size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  return null;
}

export default function GuidedDockerWslLesson018({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-docker-wsl-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Container size={17} /> Laboratório de infraestrutura local</span><p className="guided-sequence">018 · M0.18</p><h1>Prepare Docker Desktop e WSL2 com uma cadeia de provas</h1><p>Instale, configure, execute e diagnostique cada camada sem confundir cliente com engine, imagem com contêiner ou limpeza com correção.</p></div><div className="guided-hero-status"><Boxes size={42} /><strong>{progress}%</strong><span>{label}</span></div><div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}><span style={{ width: `${progress}%` }} /></div></header><GuidedLessonFacts ariaLabel="Resultado da aula" items={[{ value: 5, label: 'camadas distinguidas' }, { value: 4, label: 'provas do ambiente' }, { value: 10, label: 'falhas diagnosticadas' }]} /><div className="guided-layout"><nav className="guided-step-nav" aria-label="Etapas da aula 018"><div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>{steps.map((step, index) => <button type="button" key={step.id} className={`${index === activeIndex ? 'active ' : ''}${completed.has(step.id) ? 'done' : ''}`} onClick={() => select(index)}><span className="guided-step-number">{completed.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{active.eyebrow} · {active.duration}</span><h2>{active.title}</h2></div><div className="guided-blocks">{active.blocks.map((block, index) => <ContentBlock block={block} key={`${active.id}-${block.type}-${index}`} />)}</div><div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => select(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${activeDone ? 'undo' : 'complete'}`} onClick={toggle}>{activeDone ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><Check size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeDone} onClick={() => select(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div></div>{allDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>{lessonDone ? 'Ambiente Docker preparado' : 'Laboratório concluído'}</h3><p>{lessonDone ? 'WSL2, cliente, engine, primeiro contêiner e recuperação foram defendidos.' : 'Conclua a aula para liberar a estrutura profissional do repositório.'}</p></div><button type="button" className={lessonDone ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonDone ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 017</button><div className={`guided-course-status ${lessonDone ? 'completed' : allDone ? 'ready' : ''}`}>{lessonDone ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonDone ? 'Aula concluída' : allDone ? 'Pronta para concluir' : `${completed.size} de ${steps.length} etapas`}</strong><small>{lessonDone ? 'Infraestrutura provada por evidências' : allDone ? 'Use o botão acima' : 'Instalar, provar, executar e diagnosticar'}</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonDone}>Aula 019 <ArrowRight size={17} /></button></footer></article>;
}
