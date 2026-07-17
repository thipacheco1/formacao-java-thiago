import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleSlash2,
  Clock3,
  Code2,
  Compass,
  Copy,
  FileCode2,
  FileText,
  GitBranch,
  KeyRound,
  Lightbulb,
  ListChecks,
  MessageSquareCode,
  MonitorCog,
  RotateCcw,
  Search,
  ShieldAlert,
  Sparkles,
  Terminal,
  TriangleAlert,
  UserRoundSearch,
  Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedUsefulCommentsLesson.css';

const LESSON_STORAGE_KEY = 'guided-useful-comments-lesson-023-progress';

const COMMENT_EXAMPLES = {
  line: {
    label: 'Comentário de linha', marker: '//',
    code: 'public class Main {\n    public static void main(String[] args) {\n        // Mensagem inicial do laboratório.\n        System.out.println("Comentários úteis em Java");\n    }\n}',
    output: 'Comentários úteis em Java',
    meaning: 'Tudo depois de // naquela linha é ignorado pelo compilador. Use para uma observação local curta.'
  },
  inline: {
    label: 'No fim da linha', marker: '// ...',
    code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Status: ABERTA"); // validação temporária\n    }\n}',
    output: 'Status: ABERTA',
    meaning: 'É válido, mas textos longos no fim da linha disputam espaço com o código. Prefira acima quando a intenção exigir contexto.'
  },
  block: {
    label: 'Comentário de bloco', marker: '/* */',
    code: '/*\n Este programa demonstra comentário de bloco.\n O texto não é executado pela JVM.\n*/\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Comentário de bloco");\n    }\n}',
    output: 'Comentário de bloco',
    meaning: 'O compilador ignora tudo entre /* e */. Um bloco longo demais pode esconder documentação no lugar errado.'
  },
  javadoc: {
    label: 'Documentação', marker: '/** */',
    code: '/**\n * Programa simples para reconhecer documentação Java.\n */\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Documentação inicial");\n    }\n}',
    output: 'Documentação inicial',
    meaning: '/** ... */ é reconhecido pelo Javadoc. Nesta aula você identifica o formato; geração e tags de API ficam para depois.'
  }
};

const REVIEW_CASES = [
  { title: 'Repete a implementação', comment: '// imprime o texto', code: 'System.out.println("Olá");', verdict: 'remover', reason: 'O código já comunica a operação. O comentário acrescenta ruído, não intenção.' },
  { title: 'Preserva uma regra', comment: '// Regra: pedidos cancelados exigem análise manual.', code: 'System.out.println("Revisão manual obrigatória");', verdict: 'manter', reason: 'A razão de negócio não é óbvia na chamada e ajuda quem altera o fluxo.' },
  { title: 'Ficou desatualizado', comment: '// Status pendente', code: 'System.out.println("Status: APROVADO");', verdict: 'corrigir', reason: 'Código e comentário contam histórias diferentes. A divergência precisa ser resolvida antes do commit.' },
  { title: 'Nome ruim disfarçado', comment: '// quantidade de pedidos em aberto', code: 'int x = 10;', verdict: 'renomear', reason: 'Um nome que revela intenção acompanha o uso da informação e reduz dependência de texto paralelo.' },
  { title: 'Decisão técnica temporária', comment: '// Console usado somente antes da introdução de logging.', code: 'System.out.println("Processamento iniciado");', verdict: 'manter', reason: 'O comentário explica uma limitação consciente e possui horizonte claro.' },
  { title: 'Ataca uma pessoa', comment: '// gambiarra horrível do fulano', code: 'System.out.println("Formato legado");', verdict: 'reescrever', reason: 'Comentários descrevem contexto técnico com respeito; nunca servem para culpar pessoas.' }
];

const DOMAIN_PROGRAMS = [
  {
    name: 'Ordem de serviço', file: 'ComentarioOrdemServico.java',
    code: 'public class ComentarioOrdemServico {\n    public static void main(String[] args) {\n        // Regra didática: OS aberta ainda pode receber atividade.\n        System.out.println("OS: 1001");\n        System.out.println("Status: ABERTA");\n        System.out.println("Pode receber nova atividade: SIM");\n    }\n}',
    output: 'OS: 1001\nStatus: ABERTA\nPode receber nova atividade: SIM',
    lesson: 'O comentário explica a regra escolhida para o exemplo; não narra cada println.'
  },
  {
    name: 'Pedido', file: 'ComentarioPedido.java',
    code: 'public class ComentarioPedido {\n    public static void main(String[] args) {\n        /*\n         Fluxo didático: o pedido ainda é representado por textos fixos.\n         Variáveis serão introduzidas na próxima aula.\n        */\n        System.out.println("Pedido: PED-001");\n        System.out.println("Status: PENDENTE");\n        System.out.println("Pagamento: AGUARDANDO");\n    }\n}',
    output: 'Pedido: PED-001\nStatus: PENDENTE\nPagamento: AGUARDANDO',
    lesson: 'O bloco contextualiza uma limitação didática. Em produção, esse contexto provavelmente iria para documentação ou teste.'
  },
  {
    name: 'Auditoria', file: 'ComentarioAuditoria.java',
    code: 'public class ComentarioAuditoria {\n    public static void main(String[] args) {\n        // Regra: toda alteração relevante identifica o usuário responsável.\n        System.out.println("Evento: ALTERACAO_STATUS");\n        System.out.println("Usuario: usuario.exemplo");\n        System.out.println("Origem: SISTEMA");\n    }\n}',
    output: 'Evento: ALTERACAO_STATUS\nUsuario: usuario.exemplo\nOrigem: SISTEMA',
    lesson: 'A informação importante é o motivo de registrar autoria, não o fato óbvio de imprimir três linhas.'
  }
];

const DESTINATIONS = [
  { question: 'Por que esta regra local existe?', answer: 'Comentário próximo ao código', detail: 'Use somente quando a intenção não estiver clara em nomes e estrutura.' },
  { question: 'Como executar e quais arquivos existem?', answer: 'README.md', detail: 'Setup, comandos e visão do laboratório precisam ser encontrados sem abrir cada classe.' },
  { question: 'Qual decisão arquitetural foi tomada?', answer: 'docs/ ou ADR', detail: 'Decisões amplas, alternativas e consequências não cabem em uma linha local.' },
  { question: 'Qual versão antiga devo preservar?', answer: 'Histórico do Git', detail: 'Remova código morto; comentários não são um sistema de versionamento.' },
  { question: 'O que precisa ser feito depois?', answer: 'Issue/tarefa + TODO contextual', detail: 'TODO sem contexto, dono ou horizonte tende a envelhecer dentro do arquivo.' }
];

const SECURITY_CASES = [
  { label: 'Regra sem valor secreto', content: '// Usar variável de ambiente para configurar a senha.', safe: true, action: 'Pode permanecer: descreve o mecanismo sem revelar credencial.' },
  { label: 'Senha em comentário', content: '// senha do banco: 123456', safe: false, action: 'Remova e, se houve commit, trate como vazamento: revogue ou troque a credencial.' },
  { label: 'Token real', content: '// token: eyJhbGciOi...', safe: false, action: 'O histórico pode preservar o token mesmo após apagar. Rotacione antes de discutir limpeza.' },
  { label: 'Dado de cliente', content: '// João Silva, CPF 123...', safe: false, action: 'Substitua por dados fictícios e siga o processo de incidente se o dado real foi compartilhado.' },
  { label: 'Exemplo fictício', content: '// Cliente fictício usado apenas no laboratório.', safe: true, action: 'Seguro desde que os dados realmente não correspondam a uma pessoa ou ambiente real.' }
];

const ERRORS = [
  { title: 'Comentário óbvio', symptom: '// imprime mensagem', cause: 'Repete a sintaxe que o leitor já vê.', fix: 'Remova ou substitua por uma razão real.' },
  { title: 'Comentário desatualizado', symptom: '// PENDENTE + código APROVADO', cause: 'O código mudou e o texto paralelo não.', fix: 'Atualize ou remova; depois revise outros usos relacionados.' },
  { title: 'Código morto comentado', symptom: '// fluxo antigo', cause: 'Comentário está sendo usado como histórico.', fix: 'Remova o trecho e confie no Git para versões anteriores.' },
  { title: 'Segredo exposto', symptom: '// password, token ou secret real', cause: 'Credencial foi tratada como documentação.', fix: 'Revogue/rotacione, remova e siga o protocolo de incidente.' },
  { title: 'Nome ruim mascarado', symptom: '// quantidade + int x', cause: 'O comentário tenta compensar um identificador sem intenção.', fix: 'Renomeie com segurança; a Aula 024 aprofundará nomes.' },
  { title: 'Bloco sem fechamento', symptom: 'unclosed comment', cause: '/* foi aberto sem um */ correspondente.', fix: 'Localize o começo, feche o comentário e compile novamente.' },
  { title: 'Fechamento solto', symptom: '*/ antes do código', cause: 'Existe um terminador sem bloco aberto.', fix: 'Remova o terminador ou restaure a abertura correta.' },
  { title: 'Achar que executa', symptom: 'A linha comentada não aparece no console.', cause: 'Comentários são removidos da execução pelo compilador.', fix: 'Descomente conscientemente e repita a execução.' },
  { title: 'Contexto amplo no código', symptom: 'Setup e comandos ocupam dezenas de linhas de comentário.', cause: 'README ou docs foram colocados dentro da classe.', fix: 'Mova o contexto amplo e deixe no código apenas intenção local.' },
  { title: 'Comentário pessoal', symptom: 'culpa, ironia ou ataque nominal', cause: 'O texto descreve pessoas em vez do problema técnico.', fix: 'Reescreva com fato, restrição, decisão e próximo passo.' }
];

const README_MODEL = [
  '# Aula 023 — Comentários úteis e documentação inicial', '',
  '## Arquivos',
  '- `Main.java`',
  '- `ComentarioOrdemServico.java`',
  '- `ComentarioPedido.java`',
  '- `ComentarioAuditoria.java`', '',
  '## Cuidados',
  '- Não comentar o óbvio.',
  '- Não deixar código morto comentado.',
  '- Não colocar senha, token ou dado real em comentário.',
  '- Preferir nomes claros quando o comentário só explicar um nome ruim.'
].join('\n');

const EVIDENCE_DOC = [
  '# Aula 023 — comentários úteis', '',
  '## Sintaxe observada',
  '- [ ] Usei //, /* */ e reconheci /** */',
  '- [ ] Provei no console que comentário não executa', '',
  '## Critério',
  '- [ ] Removi comentário óbvio',
  '- [ ] Corrigi um comentário divergente',
  '- [ ] Removi código morto comentado',
  '- [ ] Separei comentário local, README e Git', '',
  '## Segurança',
  '- [ ] Procurei TODO, senha, token, password e secret',
  '- [ ] Usei somente dados fictícios', '',
  '## Entrega',
  '- [ ] Compilei e executei quatro classes',
  '- [ ] Revisei README.md e o staged diff',
  '- [ ] Nenhum .class entrou no commit', '',
  '## Minha regra de bolso',
  '- Eu mantenho um comentário quando:',
  '- Eu movo conteúdo para documentação quando:'
].join('\n');

const steps = [
  { id: 'mapa', label: 'Três camadas', duration: '10 min', eyebrow: 'Comece aqui', title: 'Escreva para a JVM sem abandonar quem lerá depois', blocks: [{ type: 'lead', text: 'O compilador ignora comentários, mas manutenção é feita por pessoas. Vamos separar três responsabilidades: código mostra comportamento, comentário preserva intenção local e documentação orienta contexto amplo.' }, { type: 'layers' }, { type: 'note', tone: 'info', title: 'Comentário é exceção consciente, não decoração', text: 'Primeiro tente código claro e nomes honestos. Comente quando ainda existe uma razão, regra, limitação ou contrato que o código não consegue revelar sozinho.' }] },
  { id: 'sintaxe', label: 'Sintaxe e execução', duration: '16 min', eyebrow: 'Etapa 1', title: 'Reconheça quatro formatos e observe o que chega ao console', blocks: [{ type: 'lead', text: 'Alterne comentários de linha, fim de linha, bloco e documentação. Em cada caso, compare fonte e saída: o comentário ajuda o leitor, mas não aparece durante a execução.' }, { type: 'syntaxLab' }] },
  { id: 'criterio', label: 'Revisão de comentários', duration: '18 min', eyebrow: 'Etapa 2', title: 'Decida manter, remover, corrigir, renomear ou reescrever', blocks: [{ type: 'lead', text: 'Comentários úteis explicam por quê. Comentários fracos repetem o quê. Faça a revisão como em um pull request e justifique cada decisão antes de ver a análise.' }, { type: 'reviewLab' }] },
  { id: 'verdade', label: 'Código e verdade', duration: '15 min', eyebrow: 'Etapa 3', title: 'Evite comentários que mentem e código morto que assombra o arquivo', blocks: [{ type: 'lead', text: 'Texto paralelo envelhece. Compare uma mudança de status, uma linha desativada e o histórico do Git para decidir onde a verdade deve morar.' }, { type: 'truthLab' }, { type: 'note', tone: 'warning', title: 'Durante o estudo, desativar uma linha pode ser uma experiência', text: 'Use Ctrl+/ para comparar o console, mas antes do commit pergunte se a linha comentada ainda ensina algo. Se for apenas resto de teste, remova.' }] },
  { id: 'dominio', label: 'Intenção no domínio', duration: '18 min', eyebrow: 'Etapa 4', title: 'Comente a regra, a limitação ou a decisão — nunca cada println', blocks: [{ type: 'lead', text: 'Ordem de serviço, pedido e auditoria usam comentários por motivos diferentes. Leia o comentário, preveja a saída e avalie se a intenção continuaria útil para outra pessoa.' }, { type: 'domainLab' }] },
  { id: 'destino', label: 'Destino correto', duration: '14 min', eyebrow: 'Etapa 5', title: 'Coloque cada explicação no código, README, docs, tarefa ou Git', blocks: [{ type: 'lead', text: 'Nem toda informação útil pertence a um comentário. Escolha o destino pelo alcance da pergunta: local, execução, decisão, histórico ou trabalho futuro.' }, { type: 'destinationLab' }] },
  { id: 'seguranca', label: 'Segredos e dados', duration: '14 min', eyebrow: 'Etapa 6', title: 'Trate comentário como conteúdo publicável e permanente no histórico', blocks: [{ type: 'lead', text: 'Senha, token, chave e dado real não ficam seguros só porque estão depois de //. Classifique os casos e aprenda a ordem de resposta quando algo sensível já foi commitado.' }, { type: 'securityLab' }] },
  { id: 'intellij', label: 'Revisão no IntelliJ', duration: '17 min', eyebrow: 'Etapa 7', title: 'Comente para experimentar, pesquise para limpar e revise antes do commit', blocks: [{ type: 'lead', text: 'A IDE acelera comentário de linha e busca no projeto. Use os atalhos para investigar, não para esconder código. A simulação mostra os estados que você deve reproduzir no arquivo real.' }, { type: 'ideaLab' }] },
  { id: 'erros', label: 'Clínica de comentários', duration: '22 min', eyebrow: 'Etapa 8', title: 'Diagnostique dez formas de um comentário prejudicar o código', blocks: [{ type: 'lead', text: 'Alguns problemas quebram a compilação; outros quebram confiança, segurança ou manutenção. Explore todos pelo mesmo protocolo: sintoma, causa, correção e nova revisão.' }, { type: 'errorClinic' }, { type: 'note', tone: 'warning', title: 'Comentários de bloco não se aninham normalmente', text: 'Em /* externo /* interno */ */, o primeiro */ encerra o comentário. Para trechos que já contêm blocos, prefira comentários de linha controlados pela IDE ou remova o código.' }] },
  { id: 'entrega', label: 'Laboratório e Git', duration: '24 min', eyebrow: 'Etapa final', title: 'Entregue quatro classes, um README útil e nenhum comentário suspeito', blocks: [{ type: 'lead', text: 'Crie os artefatos no repositório, compile, execute, revise os termos de risco e confira o staged diff. O roteiro mostra resultados esperados; registre apenas o que você realmente observar.' }, { type: 'delivery' }, { type: 'challenge', title: 'Revisão de comentários como em um pull request', text: 'Crie ComentarioAtendimento.java com um comentário útil de regra, um comentário óbvio proposital e uma linha temporariamente desativada. Execute a comparação e deixe no commit somente o que ajuda manutenção.', acceptance: ['O programa compila e a saída final foi prevista.', 'O comentário de regra explica por que, não o println.', 'O comentário óbvio e o código morto foram removidos.', 'Nenhuma credencial ou dado real aparece na busca ou no staged diff.', 'README explica arquivos e execução sem invadir a classe.', 'Você reconhece /** */ sem antecipar Javadoc profundo.', 'A próxima aula permanece responsável por variáveis e nomes profissionais.'] }] }
];

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  return <button type="button" className="uc23-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return <div className="guided-file uc23-code"><div className="guided-file-title"><FileCode2 size={17} /> {name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={lines} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#101827', fontSize: '.8rem', lineHeight: 1.65 }}>{code}</SyntaxHighlighter></div>;
}

function LayersMap() {
  const [selected, setSelected] = useState(0);
  const layers = [
    { icon: <Code2 size={22} />, title: 'Código', question: 'O que o programa faz?', example: 'nomes, estrutura, operações e testes', rule: 'É a primeira fonte de verdade.' },
    { icon: <MessageSquareCode size={22} />, title: 'Comentário', question: 'Por que esta decisão local existe?', example: 'regra, limitação, contrato ou cuidado', rule: 'Fica perto do ponto que precisa de contexto.' },
    { icon: <FileText size={22} />, title: 'Documentação', question: 'Como usar, operar ou entender o conjunto?', example: 'README, setup, ADR, runbook e diário', rule: 'Explica contexto maior e precisa ser encontrável.' }
  ];
  const layer = layers[selected];
  return <section className="uc23-layers"><div role="tablist">{layers.map((item, index) => <button type="button" role="tab" aria-selected={selected === index} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={item.title}>{item.icon}<span><strong>{item.title}</strong><small>{item.question}</small></span></button>)}</div><article role="tabpanel"><span>{layer.icon}</span><div><small>Responsabilidade</small><h3>{layer.title}</h3><p>{layer.rule}</p><code>{layer.example}</code></div></article></section>;
}

function SyntaxLab() {
  const [selected, setSelected] = useState('line');
  const item = COMMENT_EXAMPLES[selected];
  return <section className="uc23-syntax"><nav role="tablist">{Object.entries(COMMENT_EXAMPLES).map(([id, entry]) => <button type="button" role="tab" aria-selected={selected === id} className={selected === id ? 'active' : ''} onClick={() => setSelected(id)} key={id}><code>{entry.marker}</code>{entry.label}</button>)}</nav><div className="uc23-syntax-grid"><CodePanel name="Main.java" code={item.code} /><section className="uc23-console"><header><Terminal size={16} /> Console</header><pre>{item.output}</pre><p><CircleSlash2 size={18} />O comentário não aparece aqui.</p></section></div><aside><Lightbulb size={19} /><span><strong>{item.label}:</strong> {item.meaning}</span></aside></section>;
}

function ReviewLab() {
  const [selected, setSelected] = useState(0);
  const item = REVIEW_CASES[selected];
  return <section className="uc23-review"><nav>{REVIEW_CASES.map((entry, index) => <button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={entry.title}><span>{index + 1}</span>{entry.title}</button>)}</nav><article><header><MessageSquareCode size={22} /><div><small>Caso de revisão</small><h3>{item.title}</h3></div></header><div className="uc23-review-code"><code>{item.comment}</code><pre>{item.code}</pre></div><div className={'uc23-verdict ' + item.verdict}><strong>{item.verdict}</strong><p>{item.reason}</p></div></article></section>;
}

function TruthLab() {
  const [mode, setMode] = useState('aligned');
  const data = {
    aligned: { label: 'Coerente', comment: '// Status aprovado após validação manual.', code: 'System.out.println("Status: APROVADO");', output: 'Status: APROVADO', note: 'Texto e comportamento ainda contam a mesma história.' },
    stale: { label: 'Comentário envelheceu', comment: '// Status pendente.', code: 'System.out.println("Status: APROVADO");', output: 'Status: APROVADO', note: 'A execução prova o código; o comentário agora induz o leitor ao erro.' },
    graveyard: { label: 'Código morto', comment: '// System.out.println("Fluxo antigo");', code: 'System.out.println("Fluxo novo");', output: 'Fluxo novo', note: 'Se o fluxo antigo não faz parte de uma experiência documentada, remova. O Git já guarda a versão.' }
  }[mode];
  return <section className="uc23-truth"><nav>{[['aligned', 'Coerente'], ['stale', 'Desatualizado'], ['graveyard', 'Cemitério']].map(([id, label]) => <button type="button" className={mode === id ? 'active' : ''} onClick={() => setMode(id)} key={id}>{label}</button>)}</nav><div className="uc23-truth-flow"><section><small>Comentário</small><code>{data.comment}</code></section><ChevronRight size={19} /><section><small>Código executável</small><code>{data.code}</code></section><ChevronRight size={19} /><section><small>Console</small><code>{data.output}</code></section></div><p className={mode === 'aligned' ? 'ok' : 'warning'}>{mode === 'aligned' ? <CheckCircle2 size={18} /> : <TriangleAlert size={18} />}{data.note}</p><aside><GitBranch size={18} /><span><strong>Histórico recuperável:</strong> remover uma linha não apaga sua história quando a mudança foi revisada e commitada corretamente.</span></aside></section>;
}

function DomainLab() {
  const [selected, setSelected] = useState(0);
  const item = DOMAIN_PROGRAMS[selected];
  return <section className="uc23-domain"><nav role="tablist">{DOMAIN_PROGRAMS.map((entry, index) => <button type="button" role="tab" aria-selected={selected === index} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={entry.file}>{entry.name}</button>)}</nav><div className="uc23-domain-grid"><CodePanel name={item.file} code={item.code} /><section className="uc23-console"><header><Terminal size={16} /> Saída esperada</header><pre>{item.output}</pre><p><Sparkles size={18} />{item.lesson}</p></section></div></section>;
}

function DestinationLab() {
  const [selected, setSelected] = useState(0);
  const item = DESTINATIONS[selected];
  return <section className="uc23-destination"><div className="uc23-destination-list">{DESTINATIONS.map((entry, index) => <button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={entry.question}><span>{index + 1}</span>{entry.question}</button>)}</div><article><Compass size={25} /><div><small>Destino recomendado</small><h3>{item.answer}</h3><p>{item.detail}</p></div></article><div className="uc23-destination-map"><span><Code2 size={18} /><strong>Local</strong><small>comentário</small></span><ChevronRight size={18} /><span><FileText size={18} /><strong>Projeto</strong><small>README/docs</small></span><ChevronRight size={18} /><span><GitBranch size={18} /><strong>História</strong><small>Git</small></span></div></section>;
}

function SecurityLab() {
  const [selected, setSelected] = useState(0);
  const item = SECURITY_CASES[selected];
  return <section className="uc23-security"><nav>{SECURITY_CASES.map((entry, index) => <button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={entry.label}><span>{entry.safe ? <Check size={14} /> : <ShieldAlert size={14} />}</span>{entry.label}</button>)}</nav><article className={item.safe ? 'safe' : 'danger'}><header>{item.safe ? <CheckCircle2 size={25} /> : <KeyRound size={25} />}<div><small>{item.safe ? 'Conteúdo seguro para revisão' : 'Conteúdo sensível'}</small><h3>{item.label}</h3></div></header><code>{item.content}</code><p>{item.action}</p></article>{!item.safe && <aside><ShieldAlert size={19} /><span><strong>Ordem correta:</strong> contenha o incidente revogando ou rotacionando primeiro. Apagar a linha depois não torna a credencial antiga segura.</span></aside>}</section>;
}

function IdeaLab() {
  const [commented, setCommented] = useState(false);
  const [search, setSearch] = useState('TODO');
  const [clean, setClean] = useState(false);
  const code = ['public class Main {', '    public static void main(String[] args) {', '        System.out.println("Linha 1");', (commented ? '        // ' : '        ') + 'System.out.println("Linha 2");', '        System.out.println("Linha 3");', '    }', '}'].join('\n');
  const hits = clean ? 0 : search === 'TODO' ? 2 : search === 'token' ? 1 : 0;
  return <section className="uc23-idea"><header><span><MonitorCog size={16} /> aula-023-comentarios-documentacao</span><div><button type="button" className={commented ? 'active' : ''} onClick={() => setCommented(!commented)}>Ctrl + / · {commented ? 'Descomentar' : 'Comentar'}</button><button type="button" onClick={() => setClean(true)}><Sparkles size={14} /> Limpar achados</button></div></header><main><aside><strong>Project</strong><span><FileCode2 size={15} /> Main.java</span><span><FileText size={15} /> README.md</span><hr /><strong>Find in Files</strong>{['TODO', 'token', 'gambiarra'].map(term => <button type="button" className={search === term ? 'active' : ''} onClick={() => { setSearch(term); setClean(false); }} key={term}>{term}</button>)}<small>{hits} ocorrência(s)</small></aside><section><div className="uc23-editor-tab">Main.java</div><SyntaxHighlighter language="java" style={vscDarkPlus} showLineNumbers wrapLongLines customStyle={{ margin: 0, minHeight: '260px', padding: '18px', background: '#1f2530', fontSize: '.78rem', lineHeight: 1.65 }}>{code}</SyntaxHighlighter><footer><span>Run</span><pre>{commented ? 'Linha 1\nLinha 3' : 'Linha 1\nLinha 2\nLinha 3'}</pre></footer></section></main><p><UserRoundSearch size={18} /><span><strong>Ctrl+Shift+F pesquisa no projeto.</strong> Revise também senha, password, secret, remover e teste. Um resultado não é automaticamente um erro; abra o contexto antes de alterar.</span></p><small>Simulação didática do IntelliJ. Detalhes visuais e atalhos podem variar conforme versão e keymap.</small></section>;
}

function ErrorClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="uc23-errors"><nav>{ERRORS.map((entry, index) => <button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={entry.title}><span>{index + 1}</span>{entry.title}</button>)}</nav><article><header><AlertTriangle size={23} /><div><small>Caso {selected + 1} de {ERRORS.length}</small><h3>{item.title}</h3></div></header><section><small>Sintoma</small><code>{item.symptom}</code></section><div className="uc23-error-path"><span><Search size={18} /><strong>Causa</strong><p>{item.cause}</p></span><ChevronRight size={18} /><span><Wrench size={18} /><strong>Correção e nova revisão</strong><p>{item.fix}</p></span></div></article></section>;
}

function Delivery() {
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState(true);
  const terminal = [
    ['Criar pasta e arquivos', 'New-Item -ItemType Directory -Force labs\\m1\\aula-023-comentarios-documentacao\ncd labs\\m1\\aula-023-comentarios-documentacao\nNew-Item Main.java, ComentarioOrdemServico.java, ComentarioPedido.java, ComentarioAuditoria.java, README.md', 'Cinco arquivos criados na pasta nominal.', 'Digite os exemplos entendendo por que cada comentário existe.'],
    ['Compilar', 'javac Main.java\njavac ComentarioOrdemServico.java\njavac ComentarioPedido.java\njavac ComentarioAuditoria.java', '[nenhuma mensagem, se aceitos]', 'Silêncio do javac precisa ser confirmado pelos arquivos .class.'],
    ['Executar', 'java Main\njava ComentarioOrdemServico\njava ComentarioPedido\njava ComentarioAuditoria', 'Comentários úteis em Java\n[demais saídas previstas nos painéis]', 'Comentários não aparecem; somente instruções executáveis produzem saída.'],
    ['Auditar texto', '# no IntelliJ: Ctrl+Shift+F\n# procure TODO, senha, token, password, secret, gambiarra e teste', 'Revise cada ocorrência no contexto.', 'Não copie conteúdo sensível para o terminal ou para a documentação da aula.'],
    ['Revisar e versionar', 'git status\ngit diff\ngit add labs/m1/aula-023-comentarios-documentacao docs/diario-de-bordo.md\ngit diff --staged\ngit commit -m "Aula 023: pratica comentarios uteis em Java"\ngit status', 'On branch ...\nnothing to commit, working tree clean', 'Se .class aparecer, pare, ajuste *.class no .gitignore e revise novamente.']
  ];
  const current = terminal[step];
  return <section className="uc23-delivery"><nav>{terminal.map((entry, index) => <button type="button" className={(step === index ? 'active ' : '') + (index < step ? 'done' : '')} onClick={() => setStep(index)} key={entry[0]}><span>{index < step ? <Check size={13} /> : index + 1}</span>{entry[0]}</button>)}</nav><div className="uc23-terminal"><header><Terminal size={16} /> PowerShell <small>saída didática esperada</small></header><pre><strong>PS&gt; {current[1]}</strong>{'\n\n'}{current[2]}</pre><p><Lightbulb size={17} />{current[3]}</p></div><div className="uc23-step-buttons"><button type="button" disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowLeft size={15} /> Voltar</button><span>{step + 1} de {terminal.length}</span><button type="button" disabled={step === terminal.length - 1} onClick={() => setStep(step + 1)}>Próxima prova <ArrowRight size={15} /></button></div><div className="uc23-readme"><header><FileText size={17} /> README.md<div><button type="button" className={preview ? 'active' : ''} onClick={() => setPreview(true)}>Preview</button><button type="button" className={!preview ? 'active' : ''} onClick={() => setPreview(false)}>Markdown</button><CopyButton value={README_MODEL} /></div></header>{preview ? <article><h3>Aula 023 — Comentários úteis e documentação inicial</h3><h4>Arquivos</h4><ul><li>Main.java</li><li>ComentarioOrdemServico.java</li><li>ComentarioPedido.java</li><li>ComentarioAuditoria.java</li></ul><h4>Cuidados</h4><p>Não comentar o óbvio, não preservar código morto e nunca registrar segredo ou dado real.</p></article> : <SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#101827', fontSize: '.78rem', lineHeight: 1.65 }}>{README_MODEL}</SyntaxHighlighter>}</div><div className="guided-file uc23-evidence"><div className="guided-file-title"><BookOpenCheck size={17} /> docs/comentarios-uteis.md <CopyButton value={EVIDENCE_DOC} label="Copiar evidências" /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#101827', fontSize: '.78rem', lineHeight: 1.65 }}>{EVIDENCE_DOC}</SyntaxHighlighter></div></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'layers') return <LayersMap />;
  if (block.type === 'syntaxLab') return <SyntaxLab />;
  if (block.type === 'reviewLab') return <ReviewLab />;
  if (block.type === 'truthLab') return <TruthLab />;
  if (block.type === 'domainLab') return <DomainLab />;
  if (block.type === 'destinationLab') return <DestinationLab />;
  if (block.type === 'securityLab') return <SecurityLab />;
  if (block.type === 'ideaLab') return <IdeaLab />;
  if (block.type === 'errorClinic') return <ErrorClinic />;
  if (block.type === 'delivery') return <Delivery />;
  if (block.type === 'note') {
    const Icon = block.tone === 'warning' ? AlertTriangle : Lightbulb;
    return <aside className={'guided-note ' + (block.tone || 'info')}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>;
  }
  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Compass size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  return null;
}

export default function GuidedUsefulCommentsLesson023({
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

  return <article className="guided-git-lesson guided-useful-comments-lesson">
    <header className="guided-hero">
      <div className="guided-hero-copy"><span className="guided-kicker"><MessageSquareCode size={17} /> Oficina de comunicação no código</span><p className="guided-sequence">023 · M1.03</p><h1>Comentários que ajudam sem disputar a verdade com o código</h1><p>Reconheça a sintaxe, julgue intenção, elimine ruído, proteja segredos e entregue documentação no lugar certo.</p></div>
      <div className="guided-hero-status"><MessageSquareCode size={42} /><strong>{progress}%</strong><span>{completedLabel}</span></div>
      <div className="guided-progress-track" aria-label={'Progresso: ' + progress + '%'}><span style={{ width: progress + '%' }} /></div>
    </header>

    <GuidedLessonFacts ariaLabel="Resultado da aula" items={[{ value: 3, label: 'camadas separadas' }, { value: 4, label: 'programas executados' }, { value: 10, label: 'riscos revisáveis' }]} />

    <div className="guided-layout">
      <nav className="guided-step-nav" aria-label="Etapas da aula 023"><div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>{steps.map((step, index) => <button type="button" key={step.id} className={(index === activeIndex ? 'active ' : '') + (completedStepIds.has(step.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}</nav>
      <main className="guided-step-content"><div className="guided-step-heading"><span>{activeStep.eyebrow} · {activeStep.duration}</span><h2>{activeStep.title}</h2></div><div className="guided-blocks">{activeStep.blocks.map((block, index) => <ContentBlock block={block} key={activeStep.id + '-' + block.type + '-' + index} />)}</div>
        <div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (activeStepComplete ? 'undo' : 'complete')} onClick={toggleActiveStep}>{activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><Check size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div></div>
        {allStepsComplete && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>{lessonComplete ? 'Critério de comentário registrado' : 'Oficina concluída'}</h3><p>{lessonComplete ? 'Etapas, revisão e conclusão geral estão registradas.' : 'Conclua a aula para liberar variáveis e nomes profissionais.'}</p></div><button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}
      </main>
    </div>
    <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 022</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsComplete ? 'ready' : '')}>{lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : completedStepIds.size + ' de ' + steps.length + ' etapas'}</strong><small>{lessonComplete ? 'Comentários revisados com critério' : allStepsComplete ? 'Use o botão acima' : 'Leia, julgue e limpe'}</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas e a aula para avançar' : 'Abrir variáveis e nomes profissionais'}>Aula 024 <ArrowRight size={17} /></button></footer>
  </article>;
}
