import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronRight,
  ClipboardCheck, Clock3, Code2, Copy, Database, FileCheck2, FileText,
  Gauge, GitCommit, HardDrive, Laptop, Layers3, ListChecks, LockKeyhole,
  Network, Play, RotateCcw,
  SearchCheck, Server, Settings2, ShieldCheck, Terminal, Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedEnvironmentGateLesson.css';

const STORAGE_KEY = 'guided-environment-gate-lesson-020-progress';
const EVIDENCE_KEY = 'guided-environment-gate-lesson-020-evidence';

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard?.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); };
  return <button type="button" className="gate20-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : 'Copiar'}</button>;
}

function CodePanel({ title, code, output, language = 'powershell', note, warning = false }) {
  return <section className="gate20-code"><header><span><Code2 size={16} />{title}</span><CopyButton value={code} /></header><SyntaxHighlighter style={vscDarkPlus} language={language} PreTag="div" customStyle={{ margin: 0, borderRadius: 0, fontSize: '.71rem', lineHeight: 1.65, padding: '16px' }}>{code}</SyntaxHighlighter>{output && <div className="gate20-output"><small>SAÍDA DE REFERÊNCIA · COMPARE COM A SUA</small><pre>{output}</pre></div>}{note && <footer className={warning ? 'warning' : ''}>{warning ? <AlertTriangle size={17} /> : <SearchCheck size={17} />}<span>{note}</span></footer>}</section>;
}

const PROOFS = [
  { id: 'paths', group: 'windows', critical: true, label: 'Pastas e localização', command: 'Get-Location\nGet-ChildItem C:\\dev -Directory', expected: 'Path: C:\\dev\\projects\\formacao-java-backend\nprojects · labs · tools · studies · temp', criteria: ['Projeto fora de Downloads/Área de Trabalho', 'Pasta base estável ou equivalente', 'Nomes técnicos sem bagunça'], recovery: 'Escolha um local estável e documente o equivalente; não mova repositório com mudanças sem revisar.' },
  { id: 'terminal', group: 'windows', critical: true, label: 'PowerShell operacional', command: 'Set-Location C:\\dev\\labs\nNew-Item -ItemType Directory -Path .\\validacao-terminal\nSet-Location .\\validacao-terminal\nNew-Item -ItemType File -Path .\\validacao.txt\nGet-ChildItem', expected: 'Directory: C:\\dev\\labs\\validacao-terminal\nMode   Name\n-a---  validacao.txt', criteria: ['Local atual conferido', 'Criação de pasta e arquivo compreendida', 'Terminal integrado também abre'], recovery: 'Volte um nível, confirme o alvo nominal e só remova o laboratório criado após inspecioná-lo.' },
  { id: 'terminal_cleanup', group: 'windows', critical: true, label: 'Recuperação controlada', command: 'Set-Location C:\\dev\\labs\nGet-ChildItem -LiteralPath .\\validacao-terminal -Force\nRemove-Item -LiteralPath .\\validacao-terminal -Recurse\nTest-Path .\\validacao-terminal', expected: 'validacao.txt\nFalse', criteria: ['Alvo exato inspecionado', 'Somente laboratório próprio removido', 'Test-Path confirma resultado'], recovery: 'Se o caminho não for exatamente o laboratório criado, pare. Não generalize o comando nem use variável não resolvida.' },

  { id: 'java_cli', group: 'java', critical: true, label: 'Java e javac', command: 'java -version\njavac -version', expected: 'openjdk version "<versão usada no curso>"\njavac <mesma família de versão>', criteria: ['Runtime responde', 'Compilador responde', 'Versões são coerentes'], recovery: 'Se apenas `java` responder, investigue instalação do JDK e PATH; um runtime isolado não fornece `javac`.' },
  { id: 'java_origin', group: 'java', critical: true, label: 'JAVA_HOME e origem', command: '$env:JAVA_HOME\nwhere.exe java\nwhere.exe javac', expected: 'C:\\Program Files\\Java\\jdk-<versão>\n...\\bin\\java.exe\n...\\bin\\javac.exe', criteria: ['JAVA_HOME aponta para raiz do JDK', 'Não termina em `bin`', 'Executáveis vêm da instalação esperada'], recovery: 'Corrija variável ou precedência do PATH, abra novo terminal e repita as três provas.' },
  { id: 'manual_compile', group: 'java', critical: true, label: 'Compilação manual', command: 'javac Main.java\njava Main\nGet-ChildItem Main.*', expected: 'Ambiente Java validado.\nMain.java\nMain.class', criteria: ['Fonte compila', 'Classe executa', '`.class` é reconhecido como gerado e ignorado'], recovery: 'Leia o primeiro diagnóstico do compilador, corrija uma causa e compile novamente antes de executar.' },
  { id: 'intellij', group: 'java', critical: true, label: 'IntelliJ e SDK', command: 'Ação real: File → Project Structure → Project SDK\nAção real: Run Main.main()', expected: 'Project SDK: JDK da formação\nRun: processo finalizado com saída esperada', criteria: ['Projeto abre pela raiz', 'SDK correto', 'Main executa pela IDE', 'Terminal integrado abre'], recovery: 'Se terminal funciona e IDE não, investigue Project SDK e Run Configuration; não altere PATH ao acaso.' },
  { id: 'debug', group: 'java', critical: true, label: 'Debug básico', command: 'Ação real: breakpoint → Debug → Step Over → Variables', expected: 'Execução pausa na linha marcada\nVariables exibe args\nStep Over avança uma linha', criteria: ['Breakpoint verificado', 'Step Over usado', 'Variables lido'], recovery: 'Confirme que executou em Debug, não Run, e que o breakpoint está em linha executável.' },

  { id: 'git_global', group: 'git', critical: true, label: 'Git global', command: 'git --version\ngit config --global user.name\ngit config --global user.email\ngit config --global init.defaultBranch\ngit config --global core.autocrlf', expected: 'git version <instalada>\n<nome observado>\n<email observado>\nmain\ntrue | input | false (decisão consciente)', criteria: ['Git encontrado', 'Identidade configurada', 'Branch main', 'Final de linha compreendido'], recovery: 'Configure somente a chave ausente, consulte a origem se houver conflito e repita a leitura.' },
  { id: 'git_local', group: 'git', critical: true, label: 'Git local e staged', command: 'git status --short\ngit diff\ngit diff --staged', expected: 'Mudanças locais e staged aparecem em áreas distintas; saída vazia também é interpretada.', criteria: ['Status lido', 'Diff unstaged lido', 'Staged diff lido', 'Nenhum commit cego'], recovery: 'Se estiver fora do repositório, prove a raiz. Se houver surpresa, não faça stage até identificar o arquivo.' },
  { id: 'github', group: 'git', critical: false, label: 'GitHub e origin', command: 'git remote -v\ngit branch --show-current\ngit status -sb', expected: 'origin  https://github.com/<conta>/<repositorio>.git (fetch/push)\nmain\n## main...origin/main', criteria: ['Origin correto', 'Branch identificada', 'Relação local/remoto lida', 'Push real não é presumido'], recovery: 'Corrija URL/autenticação conforme a Aula 11. Não crie outro remote nem faça push para alvo desconhecido.' },
  { id: 'repository', group: 'git', critical: true, label: 'Estrutura e ignore', command: 'Test-Path README.md, .gitignore, docs, src\\main\\java, src\\test\\java, labs\\README.md\ngit check-ignore -v -- target\\App.class .env', expected: 'True para todos os caminhos estruturais\nRegras de ignore identificadas para gerados e `.env`', criteria: ['README/docs/main/test/labs existem', 'target/build/.gradle/class ignorados', '`.env` real ignorado'], recovery: 'Volte à Aula 19 e adapte apenas o que falta; `.gitignore` não remove automaticamente arquivo já rastreado.' },
  { id: 'secrets', group: 'git', critical: true, label: 'Gate de segredos', command: 'git status --short\ngit diff -- . ":(exclude)package-lock.json"', expected: 'Nenhuma senha, token, chave, `.env` real ou export autenticado no diff.', criteria: ['Working tree inspecionado', 'Staged será revisto de novo', 'Credencial exposta seria revogada/rotacionada'], recovery: 'Pare a entrega. Contenha a exposição, revogue/rotacione e investigue histórico; apagar a linha não desfaz exposição anterior.' },

  { id: 'docs', group: 'docs', critical: true, label: 'Documentação mínima', command: 'Get-Item README.md, docs\\ambiente.md, docs\\atalhos.md, docs\\diario-de-bordo.md, docs\\checklist-ambiente.md', expected: 'Cinco arquivos encontrados no repositório.', criteria: ['README explica objetivo', 'Ambiente registra provas', 'Atalhos por ação', 'Checklist existe'], recovery: 'Crie ou atualize somente o documento responsável; não replique o mesmo conteúdo em todos.' },
  { id: 'markdown', group: 'docs', critical: true, label: 'Markdown operacional', command: 'Ação real: abrir preview de README.md e docs/checklist-ambiente.md', expected: 'Títulos, listas, checkboxes, blocos de código e tabelas renderizam corretamente.', criteria: ['Fonte e preview comparados', 'Cercas fechadas', 'Caminhos e comandos legíveis'], recovery: 'Corrija a menor unidade de markup e compare fonte/preview outra vez.' },
  { id: 'diary', group: 'docs', critical: true, label: 'Diário de bordo', command: 'Get-Content docs\\diario-de-bordo.md -Tail 30', expected: 'Entrada recente com decisão, prática, erro/prova e próxima revisão.', criteria: ['M0 registrado', 'Erro resolvido preservado', 'Revisão futura definida'], recovery: 'Registre o que realmente ocorreu. Diário não é lista de elogios nem cópia integral da aula.' },
  { id: 'ai_method', group: 'docs', critical: true, label: 'IA com método', command: 'Defesa: hipótese → escopo → permissão → diff → execução → explicação', expected: 'A pessoa continua responsável e não compartilha segredo ou contexto sem autorização.', criteria: ['Código lido', 'Resultado validado', 'Segredo protegido', 'Dúvida vira pergunta'], recovery: 'Reduza escopo, remova contexto sensível e exija evidência executável antes de aceitar.' },

  { id: 'maven_cli', group: 'maven', critical: true, label: 'Maven e origem', command: 'mvn -version\nwhere.exe mvn', expected: 'Apache Maven <versão>\nJava version: <JDK esperado>\n...\\bin\\mvn.cmd', criteria: ['Maven responde', 'Executável esperado', 'Java usado é coerente'], recovery: 'Separe problema do Maven de problema do Java, corrija PATH/origem e abra novo terminal.' },
  { id: 'maven_context', group: 'maven', critical: true, label: 'Instalação versus projeto', command: 'mvn -version\nTest-Path .\\pom.xml', expected: 'Versão pode responder sem projeto\nFalse nesta estrutura inicial, até uma aula criar `pom.xml`', criteria: ['Instalação validada sem pom', 'Build não é tentado sem projeto', 'Maven depende de Java'], recovery: 'Não gere `pom.xml` só para silenciar erro. O projeto Maven será criado quando houver contrato didático.' },

  { id: 'postgres', group: 'database', critical: false, label: 'Servidor PostgreSQL', command: 'Get-Service postgresql*\nGet-NetTCPConnection -State Listen | Where-Object LocalPort -eq 5432', expected: 'Serviço Running\nListener em 127.0.0.1 ou endereço configurado:5432', criteria: ['Serviço identificado', 'Porta provada', 'Usuário/database conhecidos', 'Senha fora do Git'], recovery: 'Diagnostique serviço e listener antes de alterar credencial ou reinstalar.' },
  { id: 'sql', group: 'database', critical: false, label: 'Identidade por SQL', command: 'SELECT version();\nSELECT current_database();', expected: 'PostgreSQL <versão observada>\nformacao_java', language: 'sql', criteria: ['Consulta executada', 'Servidor identificado', 'Database correto'], recovery: 'Se conecta mas database difere, pare e selecione o alvo correto; não trate conexão como prova de contexto.' },
  { id: 'dbeaver', group: 'database', critical: false, label: 'DBeaver e driver', command: 'Ação real: Test Connection → SQL Editor → executar consulta', expected: 'Conexão bem-sucedida\nDriver PostgreSQL carregado\nGrade com duas respostas', criteria: ['Cliente abre', 'Driver disponível', 'Test Connection', 'SQL executa'], recovery: 'Separe cliente, driver, rede, autenticação e database; DBeaver não é o servidor.' },

  { id: 'http_tool', group: 'http', critical: false, label: 'Cliente e workspace', command: 'Ação real: abrir collection, selecionar Environment Local e expandir `base_url`', expected: 'Collection de estudo\nEnvironment Local\nbase_url = http://localhost:<porta observada>', criteria: ['Ferramenta abre', 'Collection existe', 'Environment correto', 'URL final conferida'], recovery: 'Não envie antes de confirmar ambiente e URL resolvida; não copie token entre environments.' },
  { id: 'http_request', group: 'http', critical: false, label: 'GET, POST e JSON', command: 'GET {{base_url}}/health\nPOST {{base_url}}/clientes\nContent-Type: application/json\n{"nome":"Cliente Exemplo"}', expected: 'GET: response conforme contrato\nPOST: status e body lidos\nNenhuma rede é executada por esta simulação.', language: 'http', criteria: ['Método/URL', 'Header correto', 'JSON válido', 'Status/body interpretados'], recovery: 'Primeiro diferencie sem response de response HTTP; depois confronte método, URL, headers, body e contrato.' },
  { id: 'http_concepts', group: 'http', critical: false, label: 'Defesa HTTP', command: 'Explique: request, response, endpoint, path, query, headers, body, JSON e métodos', expected: '200/201/204 ≠ 400/401/403/404/409/500; status é evidência inicial, não causa completa.', criteria: ['Cinco métodos distinguidos', 'Path versus query', 'Content-Type versus Accept', 'Token fora da collection compartilhada'], recovery: 'Volte à Aula 17 e monte um exemplo por intenção; não memorize código sem cenário.' },

  { id: 'wsl', group: 'docker', critical: false, label: 'WSL2', command: 'wsl --status\nwsl -l -v', expected: 'Default Version: 2\nUbuntu  Stopped|Running  2', criteria: ['WSL responde', 'Distribuição existe', 'VERSION 2', 'Stopped não é falha por si só'], recovery: 'Separe software WSL, distribuição e versão; converta apenas o nome observado.' },
  { id: 'docker_engine', group: 'docker', critical: false, label: 'CLI e engine Docker', command: 'docker --version\ndocker version\ndocker info', expected: 'Cliente encontrado\nSeção Client e Server\nOperating System: Docker Desktop', criteria: ['Desktop aberto', 'CLI encontrada', 'Server responde', 'Info lido'], recovery: 'Se `--version` funciona e Server falha, abra Desktop, aguarde engine e repita `docker version`.' },
  { id: 'docker_run', group: 'docker', critical: false, label: 'Imagem e contêiner', command: 'docker run --name m0-hello hello-world\ndocker ps\ndocker ps -a --filter "name=m0-hello"\ndocker images hello-world', expected: 'Hello from Docker!\n`docker ps` pode ficar vazio\n`ps -a` mostra Exited (0)\nimagem permanece', criteria: ['Execução compreendida', 'Imagem versus contêiner', 'Porta/volume explicados', 'Imagem confiável'], recovery: 'Leia estados e objetos antes de remover. Não use prune nem remova volume para corrigir este teste.' },

  { id: 'routine', group: 'routine', critical: true, label: 'Rotina por aula', command: 'Ler → praticar → registrar → validar → status/diff → stage nominal → staged diff → commit → status', expected: 'Uma intenção por commit e evidência recuperável no diário/repositório.', criteria: ['Prática quando aplicável', 'Documentação atualizada', 'Diff revisado', 'Árvore limpa interpretada'], recovery: 'Se o ciclo estiver pesado, reduza escopo da aula; não elimine prova e revisão.' },
  { id: 'actions', group: 'routine', critical: true, label: 'Ações essenciais', command: 'Terminal · Project · buscar ação · recentes · reformatar · organizar imports · Run · Debug · Commit · Push', expected: 'A pessoa localiza cada ação; atalhos são referências sujeitas ao keymap.', criteria: ['Alt+F12/Terminal', 'Alt+1/Project', 'Ctrl+Shift+A/Search Action', 'Run e Debug distinguidos'], recovery: 'Busque a ação por nome e consulte o keymap; não trate combinação diferente como ambiente quebrado.' }
];

const GROUP_LABELS = { windows: 'Windows e terminal', java: 'Java e IntelliJ', git: 'Git, GitHub e repositório', docs: 'Documentação e IA', maven: 'Maven', database: 'PostgreSQL e DBeaver', http: 'Cliente e HTTP', docker: 'WSL2 e Docker', routine: 'Rotina e ações' };

function ReadinessModel() {
  const [active, setActive] = useState('proof');
  const model = {
    proof: ['Executar', 'Comando ou ação real produz observação. Instalação, lembrança e aparência não bastam.'],
    criterion: ['Interpretar', 'Compare saída, origem, contexto e contrato. Uma versão isolada raramente prova a cadeia inteira.'],
    result: ['Registrar', 'Use aprovado, falhou ou pendência formal, sempre com evidência ou observação real.'],
    action: ['Decidir', 'Falhou: corrigir uma camada e testar de novo. Pendente: dono, motivo, risco e prazo.']
  };
  const item = model[active];
  return <section className="gate20-model"><div>{Object.entries(model).map(([id, entry], index) => <React.Fragment key={id}><button type="button" className={active === id ? 'active' : ''} onClick={() => setActive(id)}><span>{index + 1}</span><strong>{entry[0]}</strong></button>{index < 3 && <ChevronRight />}</React.Fragment>)}</div><article><small>ETAPA DO CHECKLIST</small><h3>{item[0]}</h3><p>{item[1]}</p></article><div className="gate20-gates"><section><ShieldCheck /><strong>Gate do M1</strong><span>Organização, terminal, Java/javac, compilação, IntelliJ/debug, Git, repositório, docs/diário, segurança, Maven e rotina.</span></section><section><Clock3 /><strong>Pendência futura permitida</strong><span>Banco, cliente HTTP, WSL2/Docker e remoto podem ter plano formal antes do módulo que depende deles.</span></section></div></section>;
}

function EvidenceDesk({ ids, evidence, onUpdate }) {
  const [activeId, setActiveId] = useState(ids[0]);
  useEffect(() => { if (!ids.includes(activeId)) setActiveId(ids[0]); }, [activeId, ids]);
  const proof = PROOFS.find(item => item.id === activeId);
  const state = evidence[activeId] || { status: 'untested', note: '' };
  const canRecord = (state.note || '').trim().length >= 6;
  return <section className="gate20-desk"><aside>{ids.map(id => { const item = PROOFS.find(proofItem => proofItem.id === id); const current = evidence[id]?.status || 'untested'; return <button type="button" className={`${activeId === id ? 'active ' : ''}${current}`} onClick={() => setActiveId(id)} key={id}><span>{current === 'approved' ? <Check size={13} /> : current === 'failed' ? '!' : current === 'pending' ? '…' : '○'}</span><strong>{item.label}</strong><small>{item.critical ? 'GATE M1' : 'DEPENDÊNCIA FUTURA'}</small></button>; })}</aside><main><header><div><small>{GROUP_LABELS[proof.group]} · {proof.critical ? 'CRÍTICO' : 'ADIÁVEL COM PLANO'}</small><h3>{proof.label}</h3></div><span className={proof.critical ? 'critical' : 'future'}>{proof.critical ? 'Gate M1' : 'Prazo obrigatório'}</span></header><CodePanel title="Prova a executar" code={proof.command} output={proof.expected} language={proof.language || 'powershell'} note="Esta interface não executa comandos na sua máquina. Compare a saída real e registre abaixo sem colar senha, token ou dado sensível." /><div className="gate20-criteria"><strong>O professor espera que você prove</strong>{proof.criteria.map(item => <span key={item}><CheckCircle2 size={15} />{item}</span>)}</div><label className="gate20-note">Saída resumida ou observação real<textarea value={state.note || ''} onChange={event => onUpdate(activeId, { note: event.target.value })} placeholder="Ex.: javac 21 respondeu; java e javac vieram do mesmo JDK. Não registre credenciais." /></label><div className="gate20-verdict"><button type="button" className={state.status === 'approved' ? 'approved active' : 'approved'} disabled={!canRecord} onClick={() => onUpdate(activeId, { status: 'approved' })}><CheckCircle2 /> Aprovado</button><button type="button" className={state.status === 'failed' ? 'failed active' : 'failed'} disabled={!canRecord} onClick={() => onUpdate(activeId, { status: 'failed' })}><AlertTriangle /> Falhou</button><button type="button" className={state.status === 'pending' ? 'pending active' : 'pending'} disabled={!canRecord} onClick={() => onUpdate(activeId, { status: 'pending' })}><Clock3 /> Pendência</button></div>{state.status === 'failed' && <p className="gate20-recovery"><Wrench size={18} /><span><strong>Recuperação orientada:</strong> {proof.recovery}</span></p>}{state.status === 'pending' && <p className="gate20-recovery pending"><Clock3 size={18} /><span><strong>Formalize no texto acima:</strong> motivo, impacto, próxima prova e prazo antes do módulo dependente.</span></p>}</main></section>;
}

function WindowsLab(props) {
  return <div><section className="gate20-path-map"><span>C:\</span><ChevronRight /><span>dev</span><ChevronRight /><span>labs</span><ChevronRight /><span>validacao-terminal</span><ChevronRight /><span>validacao.txt</span></section><EvidenceDesk ids={['paths', 'terminal', 'terminal_cleanup']} {...props} /></div>;
}

const MAIN_CODE = `public class Main {
    public static void main(String[] args) {
        System.out.println("Ambiente Java validado.");
    }
}`;

function JavaLab(props) {
  const [mode, setMode] = useState('pipeline');
  return <div><section className="gate20-java-visual"><nav><button type="button" className={mode === 'pipeline' ? 'active' : ''} onClick={() => setMode('pipeline')}>Pipeline manual</button><button type="button" className={mode === 'ide' ? 'active' : ''} onClick={() => setMode('ide')}>IntelliJ e Debug</button></nav>{mode === 'pipeline' ? <div className="gate20-compile"><section><FileText /><strong>Main.java</strong><SyntaxHighlighter style={vscDarkPlus} language="java" PreTag="div" customStyle={{ margin: '8px 0 0', borderRadius: 5, fontSize: '.63rem' }}>{MAIN_CODE}</SyntaxHighlighter></section><ChevronRight /><section><Terminal /><strong>javac Main.java</strong><span>gera Main.class</span></section><ChevronRight /><section><Play /><strong>java Main</strong><span>Ambiente Java validado.</span></section></div> : <div className="gate20-ide"><header><span>IntelliJ IDEA · SIMULAÇÃO DIDÁTICA</span><b>Project SDK: JDK da formação</b></header><main><aside>Project<br />Main.java</aside><section><pre>{MAIN_CODE}</pre><div className="gate20-debug-line">● linha atual · System.out.println</div><footer>Variables: args = String[0] · Console: aguardando Step Over</footer></section></main></div>}</section><EvidenceDesk ids={['java_cli', 'java_origin', 'manual_compile', 'intellij', 'debug']} {...props} /></div>;
}

function GitLab(props) {
  return <div><section className="gate20-git-map"><span><FileText />Working tree</span><ChevronRight /><span><Layers3 />Staging</span><ChevronRight /><span><GitCommit />Commit local</span><ChevronRight /><span><Network />origin</span></section><EvidenceDesk ids={['git_global', 'git_local', 'github', 'repository', 'secrets']} {...props} /></div>;
}

function DocsAiLab(props) {
  const [decision, setDecision] = useState(0);
  const decisions = [
    ['IA sugere um código convincente', 'Ler diff, executar, testar bordas e explicar antes de aceitar.', true],
    ['Prompt pede token para “diagnosticar”', 'Não compartilhar; reduzir contexto e usar placeholder autorizado.', true],
    ['Resposta ficou bonita e longa', 'Aparência não é evidência. Exigir comando, teste, fonte ou reprodução.', true],
    ['Erro resolvido durante a aula', 'Registrar causa, correção e nova prova no diário.', true]
  ];
  const item = decisions[decision];
  return <div><section className="gate20-doc-workspace"><aside>{['README.md', 'ambiente.md', 'atalhos.md', 'diario-de-bordo.md', 'checklist-ambiente.md'].map(name => <span key={name}><FileText />{name}</span>)}</aside><main><small>DECISÃO DE RESPONSABILIDADE</small><h3>{item[0]}</h3><p>{item[1]}</p><nav>{decisions.map((_, index) => <button type="button" className={decision === index ? 'active' : ''} onClick={() => setDecision(index)} key={index}>{index + 1}</button>)}</nav></main></section><EvidenceDesk ids={['docs', 'markdown', 'diary', 'ai_method']} {...props} /></div>;
}

function MavenLab(props) {
  return <div><section className="gate20-chain"><span><HardDrive /><strong>mvn.cmd</strong><small>origem</small></span><ChevronRight /><span><Settings2 /><strong>Maven</strong><small>versão</small></span><ChevronRight /><span><Code2 /><strong>JDK</strong><small>Java usado</small></span><ChevronRight /><span><FileText /><strong>pom.xml</strong><small>somente para build</small></span></section><EvidenceDesk ids={['maven_cli', 'maven_context']} {...props} /></div>;
}

function DatabaseLab(props) {
  const [stage, setStage] = useState(0);
  const stages = [['Servidor', Server, 'Serviço e listener 5432'], ['Driver', Settings2, 'JDBC PostgreSQL carregado'], ['Cliente', Database, 'DBeaver conecta ao alvo'], ['SQL', Code2, 'Servidor e database respondem']];
  const item = stages[stage]; const Icon = item[1];
  return <div><section className="gate20-db"><nav>{stages.map((entry, index) => { const StageIcon = entry[1]; return <button type="button" className={stage === index ? 'active' : index < stage ? 'done' : ''} onClick={() => setStage(index)} key={entry[0]}><StageIcon /><strong>{entry[0]}</strong></button>; })}</nav><article><Icon size={35} /><div><small>CAMADA {stage + 1}</small><h3>{item[0]}</h3><p>{item[2]}</p></div></article></section><EvidenceDesk ids={['postgres', 'sql', 'dbeaver']} {...props} /></div>;
}

function HttpLab(props) {
  const [sent, setSent] = useState(false);
  return <div><section className="gate20-http"><header><span>Cliente HTTP · AUDITORIA DIDÁTICA</span><em>SEM REDE REAL</em></header><div className="gate20-request"><b>GET</b><code>{'{{base_url}}'}/health</code><button type="button" onClick={() => setSent(true)}><Play /> Send</button></div><main><section><small>REQUEST</small><code>Accept: application/json</code><span>Environment: Local</span><span>URL resolvida antes do envio</span></section><ChevronRight /><section className={sent ? 'received' : ''}><small>RESPONSE</small>{sent ? <><strong>200 OK</strong><code>{'{ "status": "UP" }'}</code><span>Status + headers + body lidos</span></> : <span>Envie a simulação</span>}</section></main></section><EvidenceDesk ids={['http_tool', 'http_request', 'http_concepts']} {...props} /></div>;
}

function DockerLab(props) {
  const [desktop, setDesktop] = useState(true);
  return <div><section className="gate20-docker"><label><input type="checkbox" checked={desktop} onChange={event => setDesktop(event.target.checked)} /> Docker Desktop aberto</label><div><span><Laptop /><strong>Windows</strong></span><ChevronRight /><span><Settings2 /><strong>WSL2</strong></span><ChevronRight /><span className={desktop ? 'ok' : 'failed'}><Server /><strong>Engine</strong></span><ChevronRight /><span className={desktop ? 'ok' : 'failed'}><Code2 /><strong>Contêiner</strong></span></div><p>{desktop ? 'Cliente e engine ainda precisam de `docker version`; estado visual sozinho não aprova.' : '`docker --version` pode continuar funcionando, mas Server falhará até o engine iniciar.'}</p></section><EvidenceDesk ids={['wsl', 'docker_engine', 'docker_run']} {...props} /></div>;
}

function RoutineLab(props) {
  const [active, setActive] = useState(0);
  const cycle = ['Ler', 'Praticar', 'Registrar', 'Validar', 'Revisar diff', 'Commitar', 'Recuperar'];
  return <div><section className="gate20-routine"><div>{cycle.map((item, index) => <button type="button" className={active === index ? 'active' : index < active ? 'done' : ''} onClick={() => setActive(index)} key={item}><span>{index + 1}</span>{item}</button>)}</div><article><small>ONBOARDING CORPORATIVO</small><p>Clonar → abrir no IntelliJ → conferir JDK/Maven → rodar teste → provar banco/HTTP/Docker → criar branch → revisar mudança → commit/push autorizado.</p></article></section><EvidenceDesk ids={['routine', 'actions']} {...props} /></div>;
}

const FAILURE_CASES = [
  ['Marcar sem testar', '“Deve estar funcionando” não produz evidência.', 'Execute a prova e registre saída/observação.'],
  ['Instalado = validado', 'Ícone no menu não prova PATH, engine, driver ou conexão.', 'Use a prova operacional da camada.'],
  ['IDE ≠ terminal', 'Um funciona e o outro usa configuração diferente.', 'Compare PATH/JAVA_HOME com Project SDK/Run Configuration.'],
  ['Erro não registrado', 'A correção some e o problema volta sem contexto.', 'Diário: sintoma, causa, correção e nova prova.'],
  ['Segredo no checklist', 'Senha/token vira parte do diff e possivelmente do histórico.', 'Pare, contenha, revogue/rotacione e use placeholder.'],
  ['Commit gigante', 'Checklist se mistura a código e mudanças não relacionadas.', 'Stage somente ambiente, diário e checklist.'],
  ['Apagar por ansiedade', 'Reorganização destrói trabalho útil.', 'Inventarie e faça mudança pequena/reversível.'],
  ['Ignorar o ignore', 'target, class, logs ou env entram no status.', 'Prove regra e trate rastreamento existente.'],
  ['Gate crítico quebrado', 'M1 começa com falha de base.', 'Não libere; corrija e repita a prova.'],
  ['Pronto = domínio', 'Operar o básico é confundido com especialização.', 'Continue praticando; o gate prova prontidão inicial.']
];

function FailureClinic({ evidence, onUpdate }) {
  const [active, setActive] = useState(0);
  const item = FAILURE_CASES[active];
  const failed = PROOFS.filter(proof => evidence[proof.id]?.status === 'failed');
  const pending = PROOFS.filter(proof => evidence[proof.id]?.status === 'pending');
  return <section className="gate20-failures"><div className="gate20-clinic"><nav>{FAILURE_CASES.map((entry, index) => <button type="button" className={active === index ? 'active' : ''} onClick={() => setActive(index)} key={entry[0]}><span>{index + 1}</span>{entry[0]}</button>)}</nav><article><header><AlertTriangle /><div><small>RISCO</small><h3>{item[1]}</h3></div></header><div><section><small>RESPOSTA PROFISSIONAL</small><p>{item[2]}</p></section><ChevronRight /><section><small>FECHAMENTO</small><p>Corrija uma camada, repita a prova e atualize o registro — nunca apenas o checkbox.</p></section></div></article></div><div className="gate20-open-items"><section><strong>Falhas abertas · {failed.length}</strong>{failed.length ? failed.map(proof => <button type="button" onClick={() => onUpdate(proof.id, { status: 'untested' })} key={proof.id}>{proof.label}<span>Retestar</span></button>) : <p>Nenhuma falha registrada.</p>}</section><section><strong>Pendências formais · {pending.length}</strong>{pending.length ? pending.map(proof => <div key={proof.id}><span>{proof.label}</span><small>{evidence[proof.id]?.note}</small></div>) : <p>Nenhuma pendência registrada.</p>}</section></div></section>;
}

function buildDossier(evidence) {
  const lines = ['# Checklist final do ambiente', ''];
  Object.entries(GROUP_LABELS).forEach(([group, label]) => {
    lines.push(`## ${label}`, '');
    PROOFS.filter(proof => proof.group === group).forEach(proof => {
      const state = evidence[proof.id] || {};
      const mark = state.status === 'approved' ? 'x' : ' ';
      const suffix = state.status === 'pending' ? ' — PENDÊNCIA' : state.status === 'failed' ? ' — FALHOU' : state.status === 'untested' || !state.status ? ' — NÃO TESTADO' : '';
      lines.push(`- [${mark}] ${proof.label}${suffix}`);
      if (state.note) lines.push(`  - Evidência: ${state.note.replace(/\n/g, ' ')}`);
    });
    lines.push('');
  });
  lines.push('## Resultado', '', '- [ ] Gate crítico aprovado para iniciar o Módulo 1.', '- [ ] Pendências futuras possuem responsável e prazo.', '- [ ] Nenhum segredo foi registrado ou versionado.');
  return lines.join('\n');
}

function FinalDossier({ evidence }) {
  const [preview, setPreview] = useState(false);
  const [delivery, setDelivery] = useState(0);
  const dossier = buildDossier(evidence);
  const critical = PROOFS.filter(proof => proof.critical);
  const gatePassed = critical.every(proof => evidence[proof.id]?.status === 'approved');
  const recorded = PROOFS.filter(proof => evidence[proof.id]?.status && evidence[proof.id]?.status !== 'untested').length;
  const deliverySteps = [
    ['Revisar', 'git status --short\ngit diff -- docs/checklist-ambiente.md docs/diario-de-bordo.md docs/ambiente.md'],
    ['Preparar', 'git add docs/checklist-ambiente.md docs/diario-de-bordo.md docs/ambiente.md\ngit diff --staged --check\ngit diff --staged'],
    ['Commitar', 'git commit -m "docs: valida ambiente para iniciar modulo 1"\ngit status --short']
  ];
  return <section className="gate20-final"><div className="gate20-final-summary"><section className={gatePassed ? 'passed' : 'blocked'}>{gatePassed ? <CheckCircle2 /> : <LockKeyhole />}<strong>{gatePassed ? 'Gate crítico liberado' : 'Gate crítico bloqueado'}</strong><span>{critical.filter(proof => evidence[proof.id]?.status === 'approved').length} de {critical.length} provas críticas aprovadas</span></section><section><ClipboardCheck /><strong>{recorded} de {PROOFS.length} provas registradas</strong><span>Pendência adiável ainda precisa de motivo e prazo.</span></section></div><div className="gate20-final-editor"><header><span><FileCheck2 /> docs/checklist-ambiente.md</span><div><button type="button" className={!preview ? 'active' : ''} onClick={() => setPreview(false)}>Markdown</button><button type="button" className={preview ? 'active' : ''} onClick={() => setPreview(true)}>Resumo</button><CopyButton value={dossier} /></div></header>{preview ? <article><h3>Resultado da banca</h3><p><strong>{recorded}/{PROOFS.length}</strong> provas registradas.</p><p><strong>{critical.filter(proof => evidence[proof.id]?.status === 'approved').length}/{critical.length}</strong> críticas aprovadas.</p><p className={gatePassed ? 'ok' : 'blocked'}>{gatePassed ? 'A base está liberada para a Aula 21.' : 'Não avance como se estivesse pronto: complete ou corrija o gate.'}</p><h4>Defesa oral</h4><p>Explique por que o M0 existiu, qual evidência diferencia instalação de validação e como uma pendência futura será fechada.</p></article> : <SyntaxHighlighter style={vscDarkPlus} language="markdown" PreTag="div" customStyle={{ margin: 0, borderRadius: 0, fontSize: '.66rem', maxHeight: 520 }}>{dossier}</SyntaxHighlighter>}</div><nav>{deliverySteps.map((item, index) => <button type="button" className={delivery === index ? 'active' : index < delivery ? 'done' : ''} onClick={() => setDelivery(index)} key={item[0]}><span>{index < delivery ? <Check size={12} /> : index + 1}</span>{item[0]}</button>)}</nav><CodePanel title={`PowerShell · ${deliverySteps[delivery][0]}`} code={deliverySteps[delivery][1]} note="A entrega final inclui somente checklist, diário e ambiente. Não faça push automaticamente; publicação depende do seu fluxo e autorização." /><button type="button" className="gate20-next" disabled={delivery === deliverySteps.length - 1} onClick={() => setDelivery(value => value + 1)}>Próximo estado <ArrowRight size={16} /></button></section>;
}

const groups = {
  windows: ['paths', 'terminal', 'terminal_cleanup'], java: ['java_cli', 'java_origin', 'manual_compile', 'intellij', 'debug'],
  git: ['git_global', 'git_local', 'github', 'repository', 'secrets'], docs: ['docs', 'markdown', 'diary', 'ai_method'],
  maven: ['maven_cli', 'maven_context'], database: ['postgres', 'sql', 'dbeaver'], http: ['http_tool', 'http_request', 'http_concepts'],
  docker: ['wsl', 'docker_engine', 'docker_run'], routine: ['routine', 'actions']
};

const steps = [
  { id: 'modelo', label: 'Entender o gate', duration: '9 min', eyebrow: 'CHECKLIST ≠ CONFIANÇA', title: 'Prontidão exige prova, critério, resultado e próxima ação', blocks: [{ type: 'lead', text: 'Antes de validar ferramentas, entenda a regra da banca. Um item não fica verde porque foi instalado nem porque funcionou semanas atrás.' }, { type: 'model' }] },
  { id: 'windows', label: 'Provar Windows e terminal', duration: '14 min', eyebrow: 'LOCALIZAÇÃO + OPERAÇÃO', title: 'Crie, inspecione e recupere um laboratório com alvo explícito', proofIds: groups.windows, blocks: [{ type: 'lead', text: 'Execute na sua máquina apenas depois de confirmar os caminhos. Registre a saída real de organização, criação e remoção controlada.' }, { type: 'windows' }] },
  { id: 'java', label: 'Provar Java e IntelliJ', duration: '20 min', eyebrow: 'JDK → BYTECODE → JVM → IDE', title: 'Terminal e IDE precisam concordar sobre qual Java está sendo usado', proofIds: groups.java, blocks: [{ type: 'lead', text: 'Compile um programa mínimo, execute, confira `.class`, rode pela IDE e pare no debugger. Cada superfície produz uma prova diferente.' }, { type: 'java' }] },
  { id: 'git', label: 'Provar Git e repositório', duration: '18 min', eyebrow: 'LOCAL → STAGE → HISTÓRICO → REMOTO', title: 'Configuração, estrutura, segurança e remoto não são a mesma prova', proofIds: groups.git, blocks: [{ type: 'lead', text: 'Audite identidade, mudanças, origin, árvore e segredos. Nenhum push real é necessário para fingir sucesso dentro da aula.' }, { type: 'git' }] },
  { id: 'docs', label: 'Provar docs, diário e IA', duration: '15 min', eyebrow: 'CONTEXTO + RESPONSABILIDADE', title: 'Documentação precisa renderizar, recuperar decisões e permanecer sem segredo', proofIds: groups.docs, blocks: [{ type: 'lead', text: 'Confira os arquivos, o preview e a última entrada do diário. Depois defenda decisões de uso responsável de IA.' }, { type: 'docs' }] },
  { id: 'maven', label: 'Provar Maven', duration: '11 min', eyebrow: 'EXECUTÁVEL + JAVA + CONTEXTO', title: 'Maven instalado não significa projeto Maven — e Maven usa um Java concreto', proofIds: groups.maven, blocks: [{ type: 'lead', text: 'Leia toda a saída de versão, prove a origem e explique por que esta estrutura ainda pode não possuir `pom.xml`.' }, { type: 'maven' }] },
  { id: 'database', label: 'Provar banco e DBeaver', duration: '14 min', eyebrow: 'SERVIDOR → DRIVER → CLIENTE → SQL', title: 'Conexão só está no alvo certo quando o SQL prova servidor e database', proofIds: groups.database, blocks: [{ type: 'lead', text: 'Banco é dependência futura: se sua máquina não permitir agora, registre pendência real com próxima prova e prazo.' }, { type: 'database' }] },
  { id: 'http', label: 'Provar cliente e HTTP', duration: '14 min', eyebrow: 'REQUEST + RESPONSE + CONTRATO', title: 'Ferramenta aberta não prova que você sabe montar e interpretar uma request', proofIds: groups.http, blocks: [{ type: 'lead', text: 'Confira collection, environment, URL resolvida, GET/POST e defenda os conceitos. A simulação visual não acessa rede real.' }, { type: 'http' }] },
  { id: 'docker', label: 'Provar WSL2 e Docker', duration: '15 min', eyebrow: 'WSL → CLIENTE → ENGINE → OBJETO', title: 'Cada camada precisa responder antes de o ambiente ser chamado de preparado', proofIds: groups.docker, blocks: [{ type: 'lead', text: 'Reaplique a cadeia da Aula 18. Se ficar pendente, registre por que e antes de qual módulo precisa ser resolvida.' }, { type: 'docker' }] },
  { id: 'routine', label: 'Ensaiar a rotina', duration: '11 min', eyebrow: 'SUSTENTABILIDADE DO ESTUDO', title: 'A base só ajuda se você conseguir repetir o ciclo em cada aula', proofIds: groups.routine, blocks: [{ type: 'lead', text: 'Percorra o ciclo e conecte-o a um onboarding corporativo. Ações importam mais que decorar teclas específicas.' }, { type: 'routine' }] },
  { id: 'falhas', label: 'Tratar falhas e pendências', duration: '15 min', eyebrow: 'NÃO FINJA CONCLUSÃO', title: 'Falhou: corrija e teste de novo. Adiável: formalize impacto e prazo', blocks: [{ type: 'lead', text: 'Passe pelos dez erros e revise os itens abertos. Retestar devolve a prova ao estado não testado; não a transforma automaticamente em aprovada.' }, { type: 'failures' }] },
  { id: 'dossie', label: 'Gerar o dossiê do M0', duration: '16 min', eyebrow: 'PASSAGEM PARA O M1', title: 'O documento final precisa refletir a realidade — inclusive falhas e pendências', finalGate: true, blocks: [{ type: 'lead', text: 'Revise o Markdown gerado, defenda o resultado e entregue somente documentos nominais. A próxima aula ensinará `Main.java`; esta apenas decide se a base está pronta.' }, { type: 'final' }, { type: 'challenge', title: 'Transferência: ambiente parcialmente pronto', text: 'Java, IntelliJ, Git, repositório, docs e Maven passaram. PostgreSQL falhou por serviço parado; Docker não pode ser instalado por política corporativa; HTTP ainda não foi testado. Decida o gate e produza um plano honesto.', acceptance: ['Você libera o M1 somente se todas as provas críticas estiverem aprovadas.', 'PostgreSQL fica como falha até serviço, porta e SQL serem retestados.', 'Docker vira pendência formal com política, responsável e prazo antes do módulo dependente.', 'HTTP não testado não vira aprovado; recebe próxima ação e prazo.', 'Nenhum segredo entra no dossiê.', 'O commit final contém somente documentação do fechamento.'] }] }
];

function ContentBlock({ block, evidence, onUpdate }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  const common = { evidence, onUpdate };
  const components = { model: ReadinessModel, windows: () => <WindowsLab {...common} />, java: () => <JavaLab {...common} />, git: () => <GitLab {...common} />, docs: () => <DocsAiLab {...common} />, maven: () => <MavenLab {...common} />, database: () => <DatabaseLab {...common} />, http: () => <HttpLab {...common} />, docker: () => <DockerLab {...common} />, routine: () => <RoutineLab {...common} />, failures: () => <FailureClinic {...common} />, final: () => <FinalDossier evidence={evidence} /> };
  if (components[block.type]) { const Component = components[block.type]; return <Component />; }
  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Wrench size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  return null;
}

export default function GuidedEnvironmentGateLesson020({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const normalized = useRef(false);
  const [completed, setCompleted] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return new Set(Array.isArray(saved) ? saved : []); } catch { return new Set(); } });
  const [evidence, setEvidence] = useState(() => { try { return JSON.parse(localStorage.getItem(EVIDENCE_KEY) || '{}'); } catch { return {}; } });
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed])), [completed]);
  useEffect(() => localStorage.setItem(EVIDENCE_KEY, JSON.stringify(evidence)), [evidence]);
  const updateEvidence = (id, patch) => setEvidence(previous => ({ ...previous, [id]: { status: 'untested', note: '', ...(previous[id] || {}), ...patch } }));
  const active = steps[activeIndex];
  const progress = Math.round((completed.size / steps.length) * 100);
  const allDone = completed.size === steps.length;
  const activeDone = completed.has(active.id);
  const lessonDone = isCompleted && allDone;
  const label = useMemo(() => `${completed.size} de ${steps.length} etapas concluídas`, [completed]);
  const recorded = id => evidence[id]?.status && evidence[id]?.status !== 'untested' && (evidence[id]?.note || '').trim().length >= 6;
  const allRecorded = PROOFS.every(proof => recorded(proof.id));
  const criticalPassed = PROOFS.filter(proof => proof.critical).every(proof => evidence[proof.id]?.status === 'approved');
  const activeEvidenceReady = active.proofIds ? active.proofIds.every(recorded) : active.finalGate ? allRecorded && criticalPassed : true;
  useEffect(() => { if (normalized.current) return; normalized.current = true; if (isCompleted && !allDone) onToggleCompleted(); }, [allDone, isCompleted, onToggleCompleted]);
  const select = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const toggle = () => { if (!activeDone && !activeEvidenceReady) return; if (activeDone && isCompleted) onToggleCompleted(); setCompleted(previous => { const next = new Set(previous); if (next.has(active.id)) next.delete(active.id); else next.add(active.id); return next; }); };
  const approvedProofs = PROOFS.filter(proof => evidence[proof.id]?.status === 'approved').length;
  return <article className="guided-git-lesson guided-environment-gate-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><ClipboardCheck size={17} /> Banca prática de prontidão</span><p className="guided-sequence">020 · M0.20</p><h1>Feche o Módulo 0 com provas — não com checkboxes decorativos</h1><p>Execute, interprete, registre e recupere cada camada do ambiente; libere o M1 somente quando a base crítica estiver realmente aprovada.</p></div><div className="guided-hero-status"><Gauge size={42} /><strong>{progress}%</strong><span>{label}</span></div><div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}><span style={{ width: `${progress}%` }} /></div></header><GuidedLessonFacts ariaLabel="Resultado da aula" items={[{ value: approvedProofs, label: 'provas aprovadas agora' }, { value: PROOFS.filter(proof => proof.critical).length, label: 'provas críticas no gate' }, { value: PROOFS.length, label: 'provas no dossiê' }]} /><div className="guided-layout"><nav className="guided-step-nav" aria-label="Etapas da aula 020"><div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>{steps.map((step, index) => <button type="button" key={step.id} className={`${index === activeIndex ? 'active ' : ''}${completed.has(step.id) ? 'done' : ''}`} onClick={() => select(index)}><span className="guided-step-number">{completed.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{active.eyebrow} · {active.duration}</span><h2>{active.title}</h2></div><div className="guided-blocks">{active.blocks.map((block, index) => <ContentBlock block={block} evidence={evidence} onUpdate={updateEvidence} key={`${active.id}-${block.type}-${index}`} />)}</div><div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => select(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${activeDone ? 'undo' : 'complete'}`} disabled={!activeDone && !activeEvidenceReady} onClick={toggle}>{activeDone ? <><RotateCcw size={16} /> Desmarcar etapa</> : activeEvidenceReady ? <><Check size={16} /> Concluir etapa</> : <><LockKeyhole size={16} /> Registre as provas</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeDone} onClick={() => select(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div></div>{allDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>{lessonDone ? 'Módulo 0 encerrado' : 'Banca concluída'}</h3><p>{lessonDone ? 'O dossiê crítico liberou a entrada no primeiro programa Java.' : 'Conclua a aula para liberar o Módulo 1.'}</p></div><button type="button" className={lessonDone ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonDone ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 019</button><div className={`guided-course-status ${lessonDone ? 'completed' : allDone ? 'ready' : ''}`}>{lessonDone ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonDone ? 'M0 concluído' : allDone ? 'Pronta para concluir' : `${completed.size} de ${steps.length} etapas`}</strong><small>{lessonDone ? 'Gate crítico provado' : allDone ? 'Use o botão acima' : `${approvedProofs}/${PROOFS.length} provas aprovadas`}</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonDone}>Aula 021 · M1 <ArrowRight size={17} /></button></footer></article>;
}
