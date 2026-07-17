import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Box,
  Braces,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Copy,
  Database,
  FileCode2,
  FileText,
  Folder,
  FolderGit2,
  FolderOpen,
  FolderTree,
  GitBranch,
  HardDrive,
  Lightbulb,
  ListChecks,
  Monitor,
  Package,
  RotateCcw,
  Search,
  ShieldAlert,
  Terminal,
  Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedWindowsWorkspaceLesson.css';

const LESSON_STORAGE_KEY = 'guided-windows-workspace-lesson-003-progress';

const FOLDERS = [
  {
    id: 'projects', label: 'projects', icon: FolderGit2,
    role: 'Projetos e repositórios que precisam de continuidade, histórico e cuidado.',
    examples: ['formacao-java-backend', 'api-pedidos', 'controle-os'],
    boundary: 'Se um estudo virou aplicação importante, ele deixa studies e vem para projects.'
  },
  {
    id: 'studies', label: 'studies', icon: FileText,
    role: 'Anotações, leituras e materiais de estudo ainda sem vida de projeto.',
    examples: ['java', 'sql', 'spring', 'arquitetura'],
    boundary: 'Não use studies como depósito de cópias de projetos importantes.'
  },
  {
    id: 'tools', label: 'tools', icon: Wrench,
    role: 'Ferramentas que você controla manualmente, como uma distribuição portátil do Maven.',
    examples: ['apache-maven', 'postgres-scripts', 'cli-utils'],
    boundary: 'JDK, Git, Docker e IntelliJ instalados normalmente não precisam ser copiados para cá.'
  },
  {
    id: 'labs', label: 'labs', icon: Braces,
    role: 'Experimentos descartáveis nos quais quebrar e reconstruir faz parte do aprendizado.',
    examples: ['teste-classpath', 'teste-git', 'teste-docker'],
    boundary: 'Lab preservado e ligado a um projeto pode viver dentro do próprio repositório.'
  },
  {
    id: 'temp', label: 'temp', icon: Package,
    role: 'Saídas temporárias, importações e arquivos que não precisam sobreviver.',
    examples: ['saida-teste.txt', 'json-exemplo.json', 'arquivo-importacao.csv'],
    boundary: 'Se ficou importante, mova para o destino correto; temp não é arquivo morto permanente.'
  }
];

const PATH_CASES = [
  {
    id: 'good', label: 'Projeto local simples', path: 'C:\\dev\\projects\\api-pedidos', verdict: 'Recomendado', tone: 'good',
    issue: 'Caminho curto, local, previsível e sem espaço ou acento.',
    consequence: 'Terminal, IDE, scripts e containers encontram o projeto com menos atrito.',
    fix: 'Mantenha nomes em minúsculo com hífen e um único repositório por projeto.'
  },
  {
    id: 'download', label: 'Dentro de Downloads', path: 'C:\\Users\\aluno\\Downloads\\spring-api', verdict: 'Frágil', tone: 'danger',
    issue: 'Downloads é uma pasta de passagem misturada com instaladores e arquivos descartáveis.',
    consequence: 'O projeto pode ser apagado, duplicado ou esquecido com facilidade.',
    fix: 'Mova o projeto para C:\\dev\\projects\\spring-api.'
  },
  {
    id: 'sync', label: 'Pasta sincronizada', path: 'C:\\Users\\aluno\\OneDrive\\Meus Projetos\\api', verdict: 'Evite no início', tone: 'warning',
    issue: 'Sincronização pode disputar arquivos durante build, alongar caminhos e interferir em .git.',
    consequence: 'Lentidão, arquivo bloqueado ou mudanças inesperadas parecem defeitos do Java.',
    fix: 'Use uma pasta local simples; mantenha backup pelo repositório remoto quando chegar o momento.'
  },
  {
    id: 'spaces', label: 'Espaços e acentos', path: 'C:\\Meus Projetos\\Formação Java Avançada', verdict: 'Funciona, mas cria atrito', tone: 'warning',
    issue: 'Espaços exigem aspas em comandos; acentos ainda expõem incompatibilidades de script e encoding.',
    consequence: 'Um comando copiado pode interpretar o caminho em partes ou funcionar diferente em outro ambiente.',
    fix: 'Prefira C:\\dev\\projects\\formacao-java-avancada.'
  },
  {
    id: 'permission', label: 'Program Files', path: 'C:\\Program Files\\meu-projeto-java', verdict: 'Destino incorreto', tone: 'danger',
    issue: 'Program Files é área de instalação e pode exigir permissão administrativa.',
    consequence: 'Criar, compilar, apagar ou gerar build pode resultar em acesso negado.',
    fix: 'Use C:\\dev ou, se houver política corporativa, C:\\Users\\aluno\\dev.'
  },
  {
    id: 'case', label: 'Caixa inconsistente', path: 'ProjetoJava / projetojava / ProjetoJAVA', verdict: 'Risco entre sistemas', tone: 'warning',
    issue: 'Windows costuma tolerar diferenças de maiúsculas, mas Git, Linux, Docker e servidores podem distingui-las.',
    consequence: 'Um arquivo funciona localmente e falha no pipeline ou container.',
    fix: 'Pasta: minusculo-com-hifen. Classe Java: NomeDaClasse.java.'
  }
];

const ROOT_STEPS = [
  {
    command: 'pwd', prompt: 'PS C:\\Users\\aluno>', promptAfter: 'PS C:\\Users\\aluno>',
    output: 'Path\n----\nC:\\Users\\aluno',
    meaning: 'Você confirmou a pasta atual antes de criar qualquer coisa.',
    variation: 'O nome do usuário será o da sua conta.'
  },
  {
    command: 'Test-Path C:\\dev', prompt: 'PS C:\\Users\\aluno>', promptAfter: 'PS C:\\Users\\aluno>',
    output: 'False',
    meaning: 'False significa que a raiz ainda não existe; True significa que você deve inspecioná-la antes de continuar.',
    variation: 'Se aparecer True, não apague. Use Get-ChildItem C:\\dev para ver o que já existe.'
  },
  {
    command: 'mkdir C:\\dev', prompt: 'PS C:\\Users\\aluno>', promptAfter: 'PS C:\\Users\\aluno>',
    output: '    Directory: C:\\\n\nMode   LastWriteTime       Name\n----   -------------       ----\nd----  16/07/2026 14:20   dev',
    meaning: 'A linha com modo d indica um diretório chamado dev.',
    variation: 'Data e hora variam. Se houver acesso negado, use uma raiz dentro do seu usuário.'
  },
  {
    command: 'cd C:\\dev', prompt: 'PS C:\\Users\\aluno>', promptAfter: 'PS C:\\dev>',
    output: '',
    meaning: 'cd muda a pasta. O sucesso aparece no novo prompt, não em uma mensagem.',
    variation: 'Se o prompt não mudar, leia o erro e confirme se a pasta existe.'
  },
  {
    command: 'mkdir projects, studies, tools, labs, temp', prompt: 'PS C:\\dev>', promptAfter: 'PS C:\\dev>',
    output: '    Directory: C:\\dev\n\nMode   Name\n----   ----\nd----  projects\nd----  studies\nd----  tools\nd----  labs\nd----  temp',
    meaning: 'O PowerShell criou cinco diretórios dentro da raiz atual.',
    variation: 'A apresentação de colunas muda entre Windows PowerShell e PowerShell 7.'
  },
  {
    command: 'ls', prompt: 'PS C:\\dev>', promptAfter: 'PS C:\\dev>',
    output: '    Directory: C:\\dev\n\nMode   Name\n----   ----\nd----  labs\nd----  projects\nd----  studies\nd----  temp\nd----  tools',
    meaning: 'A listagem confirma o estado final; a ordem pode ser alfabética.',
    variation: 'Datas e outras colunas podem aparecer. Os cinco nomes são a evidência importante.'
  }
];

const PROJECT_STEPS = [
  {
    command: 'cd C:\\dev\\projects', prompt: 'PS C:\\dev>', promptAfter: 'PS C:\\dev\\projects>', output: '',
    meaning: 'Você entrou no lugar reservado aos projetos importantes.', variation: 'Se sua raiz alternativa for usada, ajuste apenas o começo do caminho.'
  },
  {
    command: 'mkdir formacao-java-backend', prompt: 'PS C:\\dev\\projects>', promptAfter: 'PS C:\\dev\\projects>',
    output: '    Directory: C:\\dev\\projects\n\nMode   Name\n----   ----\nd----  formacao-java-backend',
    meaning: 'O contêiner do projeto foi criado com nome portátil.', variation: 'Data e hora podem aparecer.'
  },
  {
    command: 'cd formacao-java-backend', prompt: 'PS C:\\dev\\projects>', promptAfter: 'PS C:\\dev\\projects\\formacao-java-backend>', output: '',
    meaning: 'A partir daqui, caminhos relativos serão criados dentro do projeto.', variation: 'Observe o prompt antes do próximo comando.'
  },
  {
    command: 'mkdir docs, src, labs', prompt: 'PS C:\\dev\\projects\\formacao-java-backend>', promptAfter: 'PS C:\\dev\\projects\\formacao-java-backend>',
    output: 'Mode   Name\n----   ----\nd----  docs\nd----  src\nd----  labs',
    meaning: 'Documentação, fonte e experimentos preservados ganharam destinos separados.', variation: 'As colunas completas podem incluir diretório, data e hora.'
  },
  {
    command: 'New-Item -ItemType File -Path README.md, .gitignore', prompt: 'PS C:\\dev\\projects\\formacao-java-backend>', promptAfter: 'PS C:\\dev\\projects\\formacao-java-backend>',
    output: 'Mode   Length Name\n----   ------ ----\n-a---       0 README.md\n-a---       0 .gitignore',
    meaning: 'Dois arquivos vazios foram criados; Length 0 é esperado antes de preenchê-los.', variation: 'O modo e a ordem podem mudar.'
  },
  {
    command: 'pwd', prompt: 'PS C:\\dev\\projects\\formacao-java-backend>', promptAfter: 'PS C:\\dev\\projects\\formacao-java-backend>',
    output: 'Path\n----\nC:\\dev\\projects\\formacao-java-backend',
    meaning: 'A localização confirma que você não criou os arquivos fora do projeto.', variation: 'A raiz pode ser a alternativa dentro do usuário.'
  },
  {
    command: 'ls', prompt: 'PS C:\\dev\\projects\\formacao-java-backend>', promptAfter: 'PS C:\\dev\\projects\\formacao-java-backend>',
    output: 'Mode   Length Name\n----   ------ ----\nd----          docs\nd----          labs\nd----          src\n-a---       0 .gitignore\n-a---       0 README.md',
    meaning: 'Três pastas e dois arquivos confirmam a estrutura mínima.', variation: 'Arquivos podem aparecer antes ou depois das pastas conforme a formatação.'
  }
];

const README_CONTENT = `# Formação Java Backend

Repositório de estudos, práticas e evolução técnica em Java Backend.

## Estrutura

- docs: documentação e diário de bordo
- src: código-fonte
- labs: laboratórios preservados`;

const GITIGNORE_CONTENT = `*.class
out/
target/
.idea/
*.iml
.DS_Store
Thumbs.db`;

const ENVIRONMENT_DOCUMENT = `# Ambiente de desenvolvimento

## Organização local

- Pasta base: \`C:\\dev\`
- Projetos: \`C:\\dev\\projects\`
- Estudos: \`C:\\dev\\studies\`
- Ferramentas manuais: \`C:\\dev\\tools\`
- Laboratórios descartáveis: \`C:\\dev\\labs\`
- Temporários: \`C:\\dev\\temp\`

## Projeto principal

\`C:\\dev\\projects\\formacao-java-backend\`

## O que aprendi

Ambiente organizado reduz erro e melhora minha autonomia como desenvolvedor.

## Regras que vou seguir

- não criar projeto em Downloads ou na Área de Trabalho;
- não criar projeto em Program Files;
- evitar espaços e acentos em nomes de pastas;
- usar nomes de projeto em minúsculo com hífen;
- separar ferramenta de projeto;
- usar Git para histórico, não cópias “final-final”;
- usar .gitignore para arquivos gerados;
- criar e manter conteúdo em UTF-8.

## Evidências

- [ ] \`C:\\dev\` existe
- [ ] projects, studies, tools, labs e temp existem
- [ ] docs, src, labs, README.md e .gitignore existem no projeto
- [ ] consigo explicar o destino de cada item

## Dúvidas

-`;

const IMPACTS = [
  {
    id: 'java', label: 'Java', icon: Braces,
    before: 'Main.java, Main.class e terminal em lugares diferentes parecem um único “erro do Java”.',
    after: 'Você separa fonte, compilado, pasta atual, JDK e configuração e investiga a camada correta.',
    visual: 'src → fonte | out/target → gerado | JDK → ferramenta'
  },
  {
    id: 'maven', label: 'Maven', icon: Package,
    before: 'src e saída misturados tornam a estrutura do build incompreensível.',
    after: 'src/main/java e src/test/java são entrada; target é saída gerada e ignorada.',
    visual: 'src/main/java + src/test/java → Maven → target/'
  },
  {
    id: 'git', label: 'Git', icon: GitBranch,
    before: 'Fotos, zips, .class, out e target poluem status e commits.',
    after: 'Fonte e documentação aparecem; artefatos reproduzíveis ficam fora do histórico.',
    visual: 'src + docs + README → versionar | .class + target → ignorar'
  },
  {
    id: 'docker', label: 'Docker', icon: Box,
    before: 'Um volume aponta para uma pasta que ninguém consegue localizar.',
    after: 'O caminho relativo parte da raiz conhecida do projeto e pode ser explicado.',
    visual: './data → /var/lib/postgresql/data'
  },
  {
    id: 'database', label: 'Banco', icon: Database,
    before: 'CSV, scripts e dados temporários ficam misturados ao código.',
    after: 'Script preservado entra no projeto; importação descartável vai para temp; volume tem destino explícito.',
    visual: 'scripts preservados | temp descartável | volume operacional'
  }
];

const commonErrors = [
  ['Projeto em Downloads', 'Mova para projects e abra novamente pela nova localização. Confirme o caminho antes de apagar a cópia antiga.'],
  ['Projeto na Área de Trabalho', 'Use uma raiz dedicada. Atalhos podem ficar na área de trabalho; o repositório não precisa morar nela.'],
  ['Ferramentas dentro do projeto', 'Retire JDK, Maven manual e utilitários da árvore do repositório; mantenha apenas fonte, configuração e documentação necessárias.'],
  ['Caminho com espaço e acento', 'Para um projeto novo, escolha minusculo-com-hifen. Se o projeto já existe, mova com cuidado e reabra na IDE.'],
  ['Terminal na pasta errada', 'Pare antes de criar ou remover. Use pwd e ls; só continue quando o prompt e os nomes confirmarem o destino.'],
  ['Arquivo gerado no Git', 'Não apague às cegas. Identifique o que é reproduzível, ajuste .gitignore e aprenda a retirar do índice na aula de Git.'],
  ['Cópias final-final', 'Não produza mais uma cópia. Preserve o estado atual e use Git para criar histórico quando a formação chegar a essa etapa.'],
  ['Acesso negado em C:\\dev', 'Não execute tudo como administrador. Use C:\\Users\\seu-usuario\\dev e registre a alternativa no ambiente.md.']
];

const steps = [
  {
    id: 'mapa', label: 'Por que organizar', eyebrow: 'Comece aqui',
    title: 'Antes do código, separe o problema do lugar onde ele acontece', duration: '7 min',
    blocks: [
      { type: 'lead', text: 'Seu diagnóstico mostrou de onde você parte. Agora vamos preparar o terreno. Ao final, você não terá apenas pastas: terá um mapa que permite distinguir erro de código, caminho, permissão, ferramenta e configuração.' },
      { type: 'errorClassifier' },
      { type: 'result', title: 'A transformação desta aula', items: ['Projetos espalhados → uma raiz conhecida', 'Ferramentas misturadas → destinos com responsabilidades', 'Comandos sem confirmação → ação, saída e estado visível', 'Arquivos gerados misturados → fonte e documentação protegidas'] }
    ]
  },
  {
    id: 'pastas', label: 'Mapa de pastas', eyebrow: 'Etapa 1',
    title: 'Dê um endereço previsível para cada tipo de coisa', duration: '11 min',
    blocks: [
      { type: 'folderAtlas' },
      { type: 'separation' },
      { type: 'note', tone: 'info', title: 'Dois tipos de laboratório', text: 'C:\\dev\\labs guarda testes rápidos e descartáveis. A pasta labs dentro de um projeto guarda experimentos que ajudam a explicar ou preservar aquele repositório.' }
    ]
  },
  {
    id: 'caminhos', label: 'Clínica de caminhos', eyebrow: 'Etapa 2',
    title: 'Reconheça um caminho que funciona hoje e continua portátil amanhã', duration: '12 min',
    blocks: [
      { type: 'pathClinic' },
      { type: 'note', tone: 'warning', title: 'Espaço não é proibido', text: 'O Windows aceita espaços. O problema é o atrito: comandos precisam de aspas, scripts podem estar errados e o mesmo projeto seguirá para Linux, containers e pipelines.' }
    ]
  },
  {
    id: 'raiz', label: 'Criar C:\\dev', eyebrow: 'Etapa 3',
    title: 'Abra o PowerShell e construa a raiz vendo cada resultado', duration: '15 min',
    blocks: [
      { type: 'openPowerShell' },
      { type: 'terminalLab', mode: 'root' },
      { type: 'note', tone: 'danger', title: 'Se aparecer acesso negado', text: 'Não transforme executar como administrador na solução padrão. Use uma pasta sob seu usuário, como C:\\Users\\seu-usuario\\dev, e mantenha a mesma estrutura interna.' }
    ]
  },
  {
    id: 'projeto', label: 'Criar o projeto', eyebrow: 'Etapa 4',
    title: 'Monte a estrutura mínima e confirme onde cada item nasceu', duration: '16 min',
    blocks: [
      { type: 'terminalLab', mode: 'project' },
      { type: 'result', title: 'Estado final esperado', items: ['docs, src e labs são diretórios', 'README.md e .gitignore são arquivos inicialmente vazios', 'O prompt aponta para formacao-java-backend', 'A listagem não contém JDK, Maven, Git ou Docker dentro do projeto'] }
    ]
  },
  {
    id: 'arquivos', label: 'README e .gitignore', eyebrow: 'Etapa 5',
    title: 'Explique o projeto e proteja o histórico antes do primeiro código', duration: '13 min',
    blocks: [
      { type: 'fileKit' },
      { type: 'note', tone: 'info', title: 'O Git ainda será ensinado', text: 'Hoje você prepara o arquivo. Na aula de Git, verá exatamente como o histórico passa a respeitar essas regras e como confirmar o efeito.' }
    ]
  },
  {
    id: 'encoding', label: 'UTF-8 e nomes', eyebrow: 'Etapa 6',
    title: 'Use acentos no conteúdo sem colocá-los no caminho do projeto', duration: '8 min',
    blocks: [
      { type: 'encodingLab' },
      { type: 'result', title: 'Convenções diferentes para coisas diferentes', items: ['Projeto e pasta: formacao-java-backend', 'Classe Java: OrdemServico.java', 'Conteúdo em português: “ação”, “configuração” e “usuário” em UTF-8', 'Arquivos gerados: fora do histórico quando puderem ser reproduzidos'] }
    ]
  },
  {
    id: 'backend', label: 'Impacto no backend', eyebrow: 'Etapa 7',
    title: 'Veja por que esta árvore reaparecerá em todas as ferramentas', duration: '12 min',
    blocks: [
      { type: 'impactMap' },
      { type: 'note', tone: 'info', title: 'Em empresa séria, previsibilidade economiza suporte', text: 'Quando todos sabem onde estão projeto, build, scripts e configuração, rodar testes, validar branch, subir Docker e abrir logs deixa de ser caça ao arquivo.' }
    ]
  },
  {
    id: 'entrega', label: 'Diagnóstico e entrega', eyebrow: 'Etapa 8',
    title: 'Registre o ambiente e prove que consegue reconstruí-lo', duration: '15 min',
    blocks: [
      { type: 'errors' },
      { type: 'actions', title: 'Faça a verificação na sua máquina', items: ['Abra C:\\dev no Explorador de Arquivos e confirme as cinco pastas.', 'Abra formacao-java-backend e diferencie visualmente pastas de arquivos.', 'Abra README.md e .gitignore, cole os conteúdos da aula e salve.', 'Volte ao PowerShell, execute pwd e ls e compare com a árvore esperada.', 'Copie o registro abaixo para docs/ambiente.md e adapte a raiz se usou a alternativa do usuário.'] },
      { type: 'environmentDocument' },
      { type: 'challenge', title: 'Desafio: organize sem repetir o roteiro', text: 'Crie a estrutura de um segundo projeto chamado api-pedidos. Não copie ferramentas para dentro dele. Decida se um experimento de classpath deve ficar no labs global ou no labs do projeto e justifique no README.', acceptance: ['O projeto está em projects e não em Downloads, Desktop ou Program Files', 'O nome usa minúsculas e hífen', 'docs, src, labs, README.md e .gitignore existem', 'Você sabe explicar o destino de cada item', 'pwd e ls confirmam o lugar correto', 'A decisão sobre o laboratório possui uma justificativa'] },
      { type: 'note', tone: 'info', title: 'Próxima aula: autonomia no terminal', text: 'Na Aula 004 você praticará navegação, criação, cópia, movimento, remoção segura, histórico, autocomplete e diagnóstico de comandos. Aqui usamos o PowerShell com roteiro; lá você aprenderá a controlá-lo.' }
    ]
  }
];

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  return <button type="button" className="guided-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function ErrorClassifier() {
  const [selected, setSelected] = useState('path');
  const cases = [
    { id: 'path', symptom: 'javac diz que Main.java não existe', first: 'pwd e ls', diagnosis: 'O arquivo pode estar em outra pasta; ainda não culpe o Java.' },
    { id: 'permission', symptom: 'Acesso negado ao gerar arquivo', first: 'confirme o caminho', diagnosis: 'O projeto pode estar em uma pasta protegida como Program Files.' },
    { id: 'tool', symptom: 'java não é reconhecido', first: 'localize a ferramenta e o PATH', diagnosis: 'O sistema não encontrou o executável; o código nem começou a rodar.' },
    { id: 'encoding', symptom: '“ação” aparece como “aÃ§Ã£o”', first: 'confirme o encoding', diagnosis: 'Os bytes foram lidos com uma codificação diferente da usada na gravação.' }
  ];
  const current = cases.find(item => item.id === selected) || cases[0];
  return (
    <section className="workspace-classifier">
      <div role="tablist" aria-label="Sintomas de ambiente">{cases.map(item => <button type="button" role="tab" aria-selected={selected === item.id} className={selected === item.id ? 'active' : ''} onClick={() => setSelected(item.id)} key={item.id}>{item.symptom}</button>)}</div>
      <article role="tabpanel" aria-live="polite"><span>Sintoma</span><h3>{current.symptom}</h3><p><strong>Primeira inspeção:</strong> {current.first}.</p><p><strong>Leitura profissional:</strong> {current.diagnosis}</p></article>
    </section>
  );
}

function FolderAtlas() {
  const [selectedId, setSelectedId] = useState('projects');
  const selected = FOLDERS.find(folder => folder.id === selectedId) || FOLDERS[0];
  const Icon = selected.icon;
  return (
    <section className="workspace-explorer" aria-label="Simulação didática do Explorador de Arquivos">
      <header><div className="workspace-window-controls"><i /><i /><i /></div><div className="workspace-address"><FolderOpen size={15} /> Este Computador <ArrowRight size={13} /> Disco Local (C:) <ArrowRight size={13} /> dev</div><Search size={16} /></header>
      <div className="workspace-explorer-body">
        <aside><span><HardDrive size={16} /> Disco Local (C:)</span><strong><FolderOpen size={16} /> dev</strong>{FOLDERS.map(folder => <button type="button" className={selectedId === folder.id ? 'active' : ''} aria-pressed={selectedId === folder.id} onClick={() => setSelectedId(folder.id)} key={folder.id}><Folder size={15} />{folder.label}</button>)}</aside>
        <main><div className="workspace-folder-grid">{FOLDERS.map(folder => { const FolderIcon = folder.icon; return <button type="button" className={selectedId === folder.id ? 'active' : ''} aria-pressed={selectedId === folder.id} onClick={() => setSelectedId(folder.id)} key={folder.id}><FolderIcon size={29} /><span>{folder.label}</span></button>; })}</div><article aria-live="polite"><div><Icon size={22} /><span>C:\\dev\\{selected.label}</span></div><p>{selected.role}</p><strong>Exemplos</strong><ul>{selected.examples.map(item => <li key={item}>{item}</li>)}</ul><footer><AlertTriangle size={15} />{selected.boundary}</footer></article></main>
      </div>
      <footer>Simulação didática. Nomes e regiões correspondem ao Explorador; detalhes visuais podem variar por versão do Windows.</footer>
    </section>
  );
}

function SeparationDiagram() {
  const [selected, setSelected] = useState('project');
  const options = [
    { id: 'system', label: 'Sistema e instaladores', path: 'C:\\Program Files\\Eclipse Adoptium\\jdk-21', detail: 'O instalador controla a ferramenta. Seu projeto apenas a utiliza.' },
    { id: 'manual', label: 'Ferramenta manual', path: 'C:\\dev\\tools\\apache-maven', detail: 'Uma distribuição que você baixou e administra pode viver em tools.' },
    { id: 'project', label: 'Projeto', path: 'C:\\dev\\projects\\formacao-java-backend', detail: 'Código, configuração e documentação necessários para construir o projeto.' }
  ];
  const current = options.find(item => item.id === selected) || options[0];
  return (
    <section className="workspace-separation">
      <div>{options.map((item, index) => <React.Fragment key={item.id}><button type="button" className={selected === item.id ? 'active' : ''} aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}><span>{index + 1}</span>{item.label}</button>{index < options.length - 1 && <ArrowRight size={16} />}</React.Fragment>)}</div>
      <article aria-live="polite"><strong>{current.path}</strong><p>{current.detail}</p></article>
    </section>
  );
}

function PathClinic() {
  const [selectedId, setSelectedId] = useState('good');
  const current = PATH_CASES.find(item => item.id === selectedId) || PATH_CASES[0];
  return (
    <section className="workspace-path-clinic">
      <div className="workspace-path-list" role="tablist" aria-label="Casos de caminho">{PATH_CASES.map(item => <button type="button" role="tab" aria-selected={selectedId === item.id} className={selectedId === item.id ? 'active' : ''} onClick={() => setSelectedId(item.id)} key={item.id}><span className={item.tone} />{item.label}</button>)}</div>
      <article role="tabpanel" aria-live="polite"><header><code>{current.path}</code><span className={current.tone}>{current.verdict}</span></header><div><section><strong>O que observar</strong><p>{current.issue}</p></section><section><strong>Consequência provável</strong><p>{current.consequence}</p></section><section><strong>Decisão recomendada</strong><p>{current.fix}</p></section></div></article>
    </section>
  );
}

function OpenPowerShellMock() {
  const [route, setRoute] = useState('start');
  return (
    <section className="workspace-open-terminal">
      <div className="workspace-open-tabs" role="tablist" aria-label="Formas de abrir PowerShell"><button type="button" role="tab" aria-selected={route === 'start'} className={route === 'start' ? 'active' : ''} onClick={() => setRoute('start')}>Pelo menu Iniciar</button><button type="button" role="tab" aria-selected={route === 'folder'} className={route === 'folder' ? 'active' : ''} onClick={() => setRoute('folder')}>Pela pasta</button></div>
      {route === 'start' ? <div className="workspace-start-mock" role="tabpanel"><div className="workspace-start-search"><Search size={17} /><span>powershell</span></div><article><span><Terminal size={27} /></span><div><strong>Windows PowerShell</strong><small>Aplicativo</small></div><button type="button">Abrir</button></article><ol><li>Pressione a tecla Windows.</li><li>Digite <strong>PowerShell</strong>.</li><li>Escolha Windows PowerShell ou PowerShell.</li><li>Clique em <strong>Abrir</strong>; não use administrador para esta prática.</li></ol></div> : <div className="workspace-context-mock" role="tabpanel"><div className="workspace-folder-strip"><FolderOpen size={22} /><span>C:\\dev</span><i>···</i></div><div className="workspace-context-menu"><span><Terminal size={17} /> Abrir no Terminal</span><span>Copiar como caminho</span><span>Propriedades</span></div><p>No Windows 11, o menu de contexto pode oferecer “Abrir no Terminal”. O terminal normalmente começa na pasta escolhida; confirme com <code>pwd</code>.</p></div>}
      <footer><Monitor size={16} /> A aparência varia entre Windows 10, Windows 11, Windows PowerShell e PowerShell 7. Os nomes da ação e a confirmação com pwd são o que importa.</footer>
    </section>
  );
}

function TreePreview({ mode, stage }) {
  const rootMode = mode === 'root';
  const showDev = rootMode ? stage >= 3 : true;
  const showRootFolders = rootMode ? stage >= 5 : true;
  const showProject = !rootMode && stage >= 2;
  const showProjectFolders = !rootMode && stage >= 4;
  const showProjectFiles = !rootMode && stage >= 5;
  return (
    <div className="workspace-tree-preview" aria-label="Estado simulado do sistema de arquivos"><strong><HardDrive size={16} /> Disco Local (C:)</strong>{showDev && <div className="tree-level one"><span><FolderOpen size={15} /> dev</span>{showRootFolders && <div className="tree-level two"><span><Folder size={14} /> labs</span><span><FolderOpen size={14} /> projects</span>{showProject && <div className="tree-level three"><span><FolderOpen size={14} /> formacao-java-backend</span>{showProjectFolders && <div className="tree-level four"><span><Folder size={13} /> docs</span><span><Folder size={13} /> labs</span><span><Folder size={13} /> src</span>{showProjectFiles && <><span><FileCode2 size={13} /> .gitignore</span><span><FileText size={13} /> README.md</span></>}</div>}</div>}<span><Folder size={14} /> studies</span><span><Folder size={14} /> temp</span><span><Folder size={14} /> tools</span></div>}</div>}</div>
  );
}

function PowerShellLab({ mode }) {
  const commands = mode === 'root' ? ROOT_STEPS : PROJECT_STEPS;
  const [completed, setCompleted] = useState(0);
  const current = commands[completed];
  const prompt = completed ? commands[completed - 1].promptAfter : commands[0].prompt;
  const title = mode === 'root' ? 'Laboratório 1 · raiz de desenvolvimento' : 'Laboratório 2 · projeto principal';
  return (
    <section className="workspace-lab">
      <header><div><Terminal size={19} /><span>{title}</span></div><button type="button" onClick={() => setCompleted(0)} disabled={completed === 0}><RotateCcw size={15} /> Reiniciar</button></header>
      <div className="workspace-lab-body">
        <div className="workspace-terminal" aria-live="polite"><div className="workspace-terminal-bar"><span>PowerShell</span><i>—</i><i>□</i><i>×</i></div><div className="workspace-terminal-screen">{commands.slice(0, completed).map((item, index) => <div className="terminal-entry" key={`${item.command}-${index}`}><p><span>{item.prompt}</span> {item.command}</p>{item.output ? <pre>{item.output}</pre> : <small>Sem texto de saída — observe o prompt seguinte.</small>}</div>)}{current ? <p className="terminal-prompt"><span>{prompt}</span><i /></p> : <p className="terminal-success"><CheckCircle2 size={17} /> Estrutura confirmada.</p>}</div></div>
        <div className="workspace-lab-side"><div className="workspace-explorer-mini"><header><FolderTree size={16} /> Estado do disco</header><TreePreview mode={mode} stage={completed} /></div>{current ? <article className="workspace-next-command"><small>Próxima ação</small><code>{current.command}</code><CopyButton value={current.command} label="Copiar comando" /><button type="button" className="workspace-run" onClick={() => setCompleted(value => value + 1)}><Terminal size={16} /> Executar na simulação</button></article> : <article className="workspace-next-command done"><CheckCircle2 size={25} /><strong>Laboratório concluído</strong><p>A árvore e a última listagem representam o mesmo estado.</p></article>}</div>
      </div>
      {completed > 0 && <footer><div><ClipboardCheck size={17} /><span><strong>O que a última ação provou:</strong> {commands[completed - 1].meaning}</span></div><p><strong>O que pode variar:</strong> {commands[completed - 1].variation}</p></footer>}
    </section>
  );
}

function FileKit() {
  const [file, setFile] = useState('readme');
  const isReadme = file === 'readme';
  const content = isReadme ? README_CONTENT : GITIGNORE_CONTENT;
  const rules = isReadme ? [
    ['Título', 'Diz qual projeto a pasta representa.'],
    ['Descrição', 'Explica por que o repositório existe.'],
    ['Estrutura', 'Permite que outra pessoa encontre documentação, fonte e laboratórios.']
  ] : [
    ['*.class', 'Bytecode gerado pela compilação.'],
    ['out/ e target/', 'Saídas de IDE e Maven que podem ser reconstruídas.'],
    ['.idea/ e *.iml', 'Configuração local do IntelliJ.'],
    ['.DS_Store e Thumbs.db', 'Metadados criados por sistemas operacionais.']
  ];
  return (
    <section className="workspace-file-kit">
      <div className="workspace-file-tabs" role="tablist" aria-label="Arquivos iniciais"><button type="button" role="tab" aria-selected={isReadme} className={isReadme ? 'active' : ''} onClick={() => setFile('readme')}><FileText size={16} /> README.md</button><button type="button" role="tab" aria-selected={!isReadme} className={!isReadme ? 'active' : ''} onClick={() => setFile('gitignore')}><FileCode2 size={16} /> .gitignore</button></div>
      <div className="workspace-file-body" role="tabpanel"><div className="guided-file"><div className="guided-file-title"><FileCode2 size={17} /> {isReadme ? 'README.md' : '.gitignore'} <CopyButton value={content} label="Copiar conteúdo" /></div><SyntaxHighlighter language={isReadme ? 'markdown' : 'gitignore'} style={oneLight} wrapLongLines customStyle={{ margin: 0, padding: '20px', background: '#f8fafc', fontSize: '.84rem', lineHeight: 1.7 }}>{content}</SyntaxHighlighter></div><aside><h3>{isReadme ? 'Porta de entrada' : 'Fronteira do histórico'}</h3>{rules.map(([name, explanation]) => <article key={name}><code>{name}</code><p>{explanation}</p></article>)}</aside></div>
    </section>
  );
}

function EncodingLab() {
  const [correct, setCorrect] = useState(true);
  return (
    <section className="workspace-encoding">
      <div className="workspace-encoding-switch" role="group" aria-label="Interpretação do arquivo"><button type="button" aria-pressed={correct} className={correct ? 'active' : ''} onClick={() => setCorrect(true)}>Ler como UTF-8</button><button type="button" aria-pressed={!correct} className={!correct ? 'active danger' : ''} onClick={() => setCorrect(false)}>Ler com encoding errado</button></div>
      <div className={correct ? 'correct' : 'broken'} aria-live="polite"><small>Conteúdo do arquivo</small><strong>{correct ? 'ação · configuração · usuário · não' : 'aÃ§Ã£o · configuraÃ§Ã£o · usuÃ¡rio · nÃ£o'}</strong><p>{correct ? 'Os bytes foram interpretados com a mesma codificação usada na gravação.' : 'Isto é mojibake: os bytes existem, mas foram interpretados com outra codificação.'}</p></div>
      <footer><strong>Regra inicial:</strong> mantenha conteúdo em UTF-8; evite acentos em nomes de pasta por portabilidade, não porque o português esteja proibido.</footer>
    </section>
  );
}

function ImpactMap() {
  const [selectedId, setSelectedId] = useState('java');
  const selected = IMPACTS.find(item => item.id === selectedId) || IMPACTS[0];
  const Icon = selected.icon;
  const dockerYaml = `volumes:\n  - ./data:/var/lib/postgresql/data`;
  return (
    <section className="workspace-impact">
      <div className="workspace-impact-tabs" role="tablist" aria-label="Impacto da organização">{IMPACTS.map(item => { const ItemIcon = item.icon; return <button type="button" role="tab" aria-selected={selectedId === item.id} className={selectedId === item.id ? 'active' : ''} onClick={() => setSelectedId(item.id)} key={item.id}><ItemIcon size={17} />{item.label}</button>; })}</div>
      <div className="workspace-impact-detail" role="tabpanel" aria-live="polite"><header><Icon size={23} /><div><small>Estrutura aplicada a</small><h3>{selected.label}</h3></div></header><div><article className="before"><strong>Quando tudo está misturado</strong><p>{selected.before}</p></article><ArrowRight size={19} /><article className="after"><strong>Quando o ambiente tem fronteiras</strong><p>{selected.after}</p></article></div><p className="workspace-impact-visual">{selected.visual}</p>{selected.id === 'docker' && <div className="workspace-yaml"><SyntaxHighlighter language="yaml" style={oneLight} customStyle={{ margin: 0, padding: '15px', background: '#f8fafc', fontSize: '.82rem' }}>{dockerYaml}</SyntaxHighlighter><span>O ponto representa a pasta atual do projeto; por isso conhecer a raiz importa.</span></div>}</div>
    </section>
  );
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'errorClassifier') return <ErrorClassifier />;
  if (block.type === 'folderAtlas') return <FolderAtlas />;
  if (block.type === 'separation') return <SeparationDiagram />;
  if (block.type === 'pathClinic') return <PathClinic />;
  if (block.type === 'openPowerShell') return <OpenPowerShellMock />;
  if (block.type === 'terminalLab') return <PowerShellLab mode={block.mode} />;
  if (block.type === 'fileKit') return <FileKit />;
  if (block.type === 'encodingLab') return <EncodingLab />;
  if (block.type === 'impactMap') return <ImpactMap />;

  if (block.type === 'result') return <section className="guided-result"><h3><ClipboardCheck size={20} /> {block.title}</h3><ul>{block.items.map(item => <li key={item}><CheckCircle2 size={16} /> {item}</li>)}</ul></section>;

  if (block.type === 'note') {
    const Icon = block.tone === 'danger' ? ShieldAlert : block.tone === 'warning' ? AlertTriangle : Lightbulb;
    return <aside className={`guided-note ${block.tone || 'info'}`}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>;
  }

  if (block.type === 'errors') return <section className="guided-errors"><h3><RotateCcw size={20} /> Erros comuns e recuperação segura</h3><div className="guided-error-grid">{commonErrors.map(([title, fix]) => <article key={title}><code>{title}</code><p>{fix}</p></article>)}</div></section>;

  if (block.type === 'actions') return <section className="workspace-actions"><h3><BookOpenCheck size={20} /> {block.title}</h3><ol>{block.items.map((item, index) => <li key={item}><span>{index + 1}</span><p>{item}</p></li>)}</ol></section>;

  if (block.type === 'environmentDocument') return <div className="guided-file workspace-environment-document"><div className="guided-file-title"><FileText size={17} /> docs/ambiente.md <CopyButton value={ENVIRONMENT_DOCUMENT} label="Copiar documento" /></div><SyntaxHighlighter language="markdown" style={oneLight} wrapLongLines customStyle={{ margin: 0, padding: '20px', background: '#f8fafc', fontSize: '.84rem', lineHeight: 1.7 }}>{ENVIRONMENT_DOCUMENT}</SyntaxHighlighter></div>;

  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Compass size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;

  return null;
}

export default function GuidedWindowsWorkspaceLesson003({
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

  return (
    <article className="guided-git-lesson guided-windows-workspace-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker"><FolderTree size={17} /> Oficina de ambiente</span>
          <p className="guided-sequence">003 · M0.03</p>
          <h1>Organize o Windows para desenvolver</h1>
          <p>Construa uma raiz profissional, acompanhe cada comando no PowerShell e veja a árvore do disco mudar como se eu estivesse ao seu lado.</p>
        </div>
        <div className="guided-hero-status"><HardDrive size={42} /><strong>{progress}%</strong><span>{completedLabel}</span></div>
        <div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}><span style={{ width: `${progress}%` }} /></div>
      </header>

      <GuidedLessonFacts ariaLabel="Resultado da oficina" items={[{ value: 1, label: 'raiz conhecida' }, { value: 5, label: 'destinos claros' }, { value: 2, label: 'laboratórios guiados' }]} />

      <div className="guided-layout">
        <nav className="guided-step-nav" aria-label="Etapas da aula 003">
          <div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>
          {steps.map((step, index) => <button type="button" key={step.id} className={`${index === activeIndex ? 'active' : ''} ${completedStepIds.has(step.id) ? 'done' : ''}`} onClick={() => selectStep(index)}><span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}
        </nav>

        <main className="guided-step-content">
          <div className="guided-step-heading"><span>{activeStep.eyebrow} · {activeStep.duration}</span><h2>{activeStep.title}</h2></div>
          <div className="guided-blocks">{activeStep.blocks.map((block, index) => <ContentBlock block={block} key={`${activeStep.id}-${block.type}-${index}`} />)}</div>

          <div className="guided-step-actions">
            <button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button>
            <div className="guided-step-actions-main"><button type="button" className={`step-toggle ${activeStepComplete ? 'undo' : 'complete'}`} onClick={toggleActiveStep}>{activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><Check size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div>
          </div>

          {allStepsComplete && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>{lessonComplete ? 'Ambiente registrado' : 'Oficina concluída'}</h3><p>{lessonComplete ? 'Estrutura, critérios e conclusão da aula estão registrados.' : 'Conclua a aula para liberar a prática completa de PowerShell.'}</p></div><button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}
        </main>
      </div>

      <footer className="guided-course-nav">
        <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 002</button>
        <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>{lessonComplete ? <CheckCircle2 size={18} /> : <ListChecks size={18} />}<span><strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong><small>{lessonComplete ? 'Ambiente documentado' : allStepsComplete ? 'Use o botão acima' : 'Complete a oficina guiada'}</small></span></div>
        <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas e a aula para avançar' : 'Praticar terminal e PowerShell'}>Aula 004 <ArrowRight size={17} /></button>
      </footer>
    </article>
  );
}
