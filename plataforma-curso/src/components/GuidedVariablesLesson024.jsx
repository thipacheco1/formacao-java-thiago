import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, BookOpenCheck, Box, Check, CheckCircle2,
  ChevronRight, Clock3, Copy, FileCode2, GitBranch, HelpCircle,
  Lightbulb, ListChecks, MonitorCog, PencilLine, RotateCcw, Search,
  Sparkles, Terminal, TriangleAlert, Type, Variable, Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedVariablesLesson.css';

const STORAGE_KEY = 'guided-variables-lesson-024-progress';

const TYPES = {
  string: { label: 'String', declaration: 'String nomeCliente = "Cliente Exemplo";', literal: '"Cliente Exemplo"', output: 'Cliente Exemplo', rule: 'Texto usa aspas duplas. String começa com maiúscula porque é uma classe; aprofundaremos texto depois.', wrong: "String nomeCliente = 'Cliente Exemplo';" },
  int: { label: 'int', declaration: 'int quantidadePedidos = 3;', literal: '3', output: '3', rule: 'Inteiro aparece sem aspas. Limites de byte, short, int, long e overflow pertencem à Aula 025.', wrong: 'int quantidadePedidos = "3";' },
  double: { label: 'double', declaration: 'double valorTotalPedido = 199.90;', literal: '199.90', output: '199.9', rule: 'Decimal em Java usa ponto. Precisão e dinheiro serão tratados nas aulas próprias.', wrong: 'double valorTotalPedido = 199,90;' },
  boolean: { label: 'boolean', declaration: 'boolean clienteAtivo = true;', literal: 'true', output: 'true', rule: 'Aceita true ou false, em minúsculas e sem aspas.', wrong: 'boolean clienteAtivo = "true";' },
  char: { label: 'char', declaration: "char categoria = 'A';", literal: "'A'", output: 'A', rule: 'Um único caractere usa aspas simples. "A" é String e \'AB\' não cabe em char.', wrong: 'char categoria = "A";' }
};

const NAME_CASES = [
  { bad: 'x', good: 'quantidadeProdutos', verdict: 'Sem intenção', reason: 'O leitor precisa adivinhar o que 10 representa.' },
  { bad: 'qtd', good: 'quantidadeTentativas', verdict: 'Abreviação vaga', reason: 'Clareza local vale mais que economizar poucas letras.' },
  { bad: 'flag', good: 'pagamentoAprovado', verdict: 'Boolean sem pergunta', reason: 'O nome bom pode ser lido como uma pergunta respondida por true ou false.' },
  { bad: 'status', good: 'statusPedido', verdict: 'Contexto ausente', reason: 'Status de quê? O domínio precisa acompanhar o valor.' },
  { bad: 'NomeCliente', good: 'nomeCliente', verdict: 'PascalCase', reason: 'Em Java, variável e método normalmente começam com minúscula.' },
  { bad: 'nome_cliente', good: 'nomeCliente', verdict: 'snake_case', reason: 'É válido em alguns contextos, mas não é o padrão de variável comum em Java.' },
  { bad: 'situaçãoPedido', good: 'situacaoPedido', verdict: 'Unicode evitável', reason: 'Java aceita muitos caracteres Unicode, mas o padrão técnico do curso evita acentos por compatibilidade e consistência.' },
  { bad: 'class', good: 'nomeClasse', verdict: 'Palavra reservada', reason: 'class pertence à linguagem e não pode ser identificador.' }
];

const DOMAIN_PROGRAMS = [
  {
    label: 'Main', file: 'Main.java',
    code: 'public class Main {\n    public static void main(String[] args) {\n        String nomeCliente = "Cliente Exemplo";\n        int quantidadePedidos = 3;\n        boolean clienteAtivo = true;\n\n        System.out.println("Nome: " + nomeCliente);\n        System.out.println("Pedidos: " + quantidadePedidos);\n        System.out.println("Ativo: " + clienteAtivo);\n    }\n}',
    output: 'Nome: Cliente Exemplo\nPedidos: 3\nAtivo: true', insight: 'O + junta o rótulo textual ao valor. Concatenação profunda fica para depois.'
  },
  {
    label: 'Ordem de serviço', file: 'OrdemServicoVariaveis.java',
    code: 'public class OrdemServicoVariaveis {\n    public static void main(String[] args) {\n        String numeroOrdemServico = "OS-1001";\n        String statusOrdemServico = "ABERTA";\n        String responsavel = "Backoffice";\n        boolean permiteNovaAtividade = true;\n\n        System.out.println("Ordem de Serviço: " + numeroOrdemServico);\n        System.out.println("Status: " + statusOrdemServico);\n        System.out.println("Responsável: " + responsavel);\n        System.out.println("Permite nova atividade: " + permiteNovaAtividade);\n    }\n}',
    output: 'Ordem de Serviço: OS-1001\nStatus: ABERTA\nResponsável: Backoffice\nPermite nova atividade: true', insight: 'Os nomes aproximam o código do vocabulário do domínio.'
  },
  {
    label: 'Pedido', file: 'PedidoVariaveis.java',
    code: 'public class PedidoVariaveis {\n    public static void main(String[] args) {\n        String codigoPedido = "PED-2026-001";\n        String nomeCliente = "Cliente Exemplo";\n        int quantidadeItens = 4;\n        double valorTotalPedido = 389.90;\n        boolean pagamentoAprovado = false;\n\n        System.out.println("Pedido: " + codigoPedido);\n        System.out.println("Cliente: " + nomeCliente);\n        System.out.println("Quantidade de itens: " + quantidadeItens);\n        System.out.println("Valor total: " + valorTotalPedido);\n        System.out.println("Pagamento aprovado: " + pagamentoAprovado);\n    }\n}',
    output: 'Pedido: PED-2026-001\nCliente: Cliente Exemplo\nQuantidade de itens: 4\nValor total: 389.9\nPagamento aprovado: false', insight: 'codigoPedido já elimina o comentário óbvio “código do pedido”.'
  },
  {
    label: 'Auditoria', file: 'AuditoriaVariaveis.java',
    code: 'public class AuditoriaVariaveis {\n    public static void main(String[] args) {\n        String usuarioResponsavel = "usuario.exemplo";\n        String eventoAuditoria = "ALTERACAO_STATUS";\n        String origemEvento = "SISTEMA";\n        boolean eventoCritico = true;\n\n        System.out.println("Usuário: " + usuarioResponsavel);\n        System.out.println("Evento: " + eventoAuditoria);\n        System.out.println("Origem: " + origemEvento);\n        System.out.println("Crítico: " + eventoCritico);\n    }\n}',
    output: 'Usuário: usuario.exemplo\nEvento: ALTERACAO_STATUS\nOrigem: SISTEMA\nCrítico: true', insight: 'usuarioResponsavel, eventoAuditoria e origemEvento sobrevivem melhor a uma revisão que u, e e o.'
  }
];

const ERRORS = [
  { title: 'Uso antes da declaração', code: 'System.out.println(nomeCliente);\nString nomeCliente = "Cliente";', symptom: 'cannot find symbol', cause: 'A leitura alcança o uso antes de o nome existir naquele bloco.', fix: 'Declare e inicialize antes do primeiro uso.' },
  { title: 'Local sem inicialização', code: 'String nomeCliente;\nSystem.out.println(nomeCliente);', symptom: 'variable nomeCliente might not have been initialized', cause: 'O nome foi declarado, mas ainda não existe valor seguro para ler.', fix: 'Inicialize antes do uso ou reorganize o fluxo.' },
  { title: 'Tipo incompatível', code: 'int quantidade = "10";', symptom: 'incompatible types: String cannot be converted to int', cause: 'Aspas transformam 10 em texto.', fix: 'Use 10 sem aspas ou escolha String se o domínio realmente for textual.' },
  { title: 'Aspas erradas', code: "String nome = 'Cliente';", symptom: 'unclosed character literal / too many characters', cause: 'Aspas simples delimitam char, não texto.', fix: 'Use "Cliente" para String e \'A\' para um char.' },
  { title: 'Redeclaração no bloco', code: 'String status = "PENDENTE";\nString status = "APROVADO";', symptom: 'variable status is already defined', cause: 'O mesmo nome local foi declarado duas vezes no mesmo bloco.', fix: 'Na segunda linha, reatribua: status = "APROVADO".' },
  { title: 'Nome sem intenção', code: 'int x = 10;\nString s = "ABERTA";\nboolean f = true;', symptom: 'Compila, mas exige adivinhação', cause: 'O compilador conhece tipos; o time precisa conhecer significado.', fix: 'Use quantidadePedidos, statusOrdemServico e permiteReagendamento.' },
  { title: 'Padrão inconsistente', code: 'String NomeCliente = "Cliente";\nString nome_cliente = "Cliente";', symptom: 'Compila, mas viola a convenção adotada', cause: 'PascalCase e snake_case confundem papéis no código Java.', fix: 'Adote nomeCliente em camelCase.' },
  { title: 'Acento no identificador', code: 'String situaçãoPedido = "PENDENTE";', symptom: 'Pode compilar, mas cria atrito de padrão e ferramenta', cause: 'Validade sintática não garante consistência profissional.', fix: 'Use situacaoPedido segundo o padrão técnico do time.' },
  { title: 'Palavra reservada', code: 'String class = "Teste";', symptom: "not a statement / ';' expected", cause: 'class já tem função na gramática Java.', fix: 'Escolha um identificador de domínio, como nomeClasse.' },
  { title: 'Igualdade conceitual', code: 'int quantidade = 10;', symptom: 'Leitura mental incorreta: “é igual”', cause: '= transfere o valor da direita para o nome à esquerda.', fix: 'Leia “quantidade recebe 10”; == será comparação em aula posterior.' }
];

const EVIDENCE = [
  '# Aula 024 — variáveis e nomes profissionais', '',
  '## Estado nomeado', '- [ ] Expliquei tipo, nome, valor e atribuição', '- [ ] Diferenciei declaração, inicialização e reatribuição', '- [ ] Provei que uma local precisa de valor antes do uso', '',
  '## Nomes', '- [ ] Usei camelCase e revelei intenção', '- [ ] Transformei booleanos em perguntas', '- [ ] Usei Shift + F6 para renomear declaração e usos', '',
  '## Evidências', '- [ ] Compilei e executei os cinco arquivos', '- [ ] Reproduzi e corrigi ao menos três erros', '- [ ] Revisei git diff --staged e mantive .class fora do commit', '',
  '## Decisão pessoal', '- Um nome que melhorei:', '- O que a nova versão revela:', '- Uma dúvida que levo para a Aula 025:'
].join('\n');

const steps = [
  { id: 'mapa', label: 'Estado com nome', duration: '11 min', eyebrow: 'Comece aqui', title: 'Troque valores soltos por informações que o código consegue explicar', blocks: [{ type: 'lead', text: 'Variável não é apenas uma caixa: é um valor disponível durante a execução com tipo e nome que comunicam intenção. Primeiro vamos desmontar uma declaração sem inventar detalhes de memória que ainda não precisamos.' }, { type: 'anatomy' }, { type: 'note', tone: 'info', title: 'Resultado observável', text: 'Ao final, você criará cinco programas, preverá as saídas, corrigirá falhas do compilador e defenderá cada nome escolhido.' }] },
  { id: 'ciclo', label: 'Ciclo de vida local', duration: '17 min', eyebrow: 'Etapa 1', title: 'Declare, inicialize, use e altere sem confundir os estados', blocks: [{ type: 'lead', text: 'Cada linha muda o que pode ser feito com a variável. Percorra os estados e observe quando o valor já pode ser lido pelo programa.' }, { type: 'lifecycle' }] },
  { id: 'tipos', label: 'Forma e tipo', duration: '17 min', eyebrow: 'Etapa 2', title: 'Reconheça cinco formas de valor sem antecipar as aulas de tipos', blocks: [{ type: 'lead', text: 'Aqui o foco é compatibilidade e leitura: texto, inteiro, decimal, verdadeiro/falso e caractere. Limites, precisão e operações profundas virão nas aulas específicas.' }, { type: 'types' }] },
  { id: 'nomes', label: 'Nomes profissionais', duration: '19 min', eyebrow: 'Etapa 3', title: 'Faça o identificador revelar domínio, unidade e intenção', blocks: [{ type: 'lead', text: 'Analise nomes como em uma revisão de código. Um identificador pode ser válido para o compilador e ainda assim ser fraco para o time.' }, { type: 'naming' }] },
  { id: 'booleanos', label: 'Booleanos legíveis', duration: '13 min', eyebrow: 'Etapa 4', title: 'Escreva nomes que soem como perguntas respondidas por true ou false', blocks: [{ type: 'lead', text: 'flag, status e retorno escondem significado. Transforme cada booleano em uma afirmação verificável do domínio.' }, { type: 'booleans' }] },
  { id: 'temporarias', label: 'Estado intermediário', duration: '14 min', eyebrow: 'Etapa 5', title: 'Use variável temporária quando ela dá nome a uma regra', blocks: [{ type: 'lead', text: 'Nem toda variável intermediária ajuda. Compare uma soma direta, um resultado nomeado e uma cópia sem intenção.' }, { type: 'temporary' }] },
  { id: 'dominio', label: 'Programas de domínio', duration: '21 min', eyebrow: 'Etapa 6', title: 'Leia cinco estados reais sem depender de comentários explicando nomes ruins', blocks: [{ type: 'lead', text: 'Main, ordem de serviço, pedido e auditoria mostram valores nomeados e saídas. O cálculo aparece na etapa anterior e completa o conjunto da atividade.' }, { type: 'domains' }] },
  { id: 'rename', label: 'Rename no IntelliJ', duration: '15 min', eyebrow: 'Etapa 7', title: 'Renomeie declaração e usos como uma única refatoração segura', blocks: [{ type: 'lead', text: 'Alterar texto manualmente pode esquecer usos ou atingir ocorrências erradas. Reproduza Shift + F6 no mock e confirme o preview antes de aplicar.' }, { type: 'rename' }] },
  { id: 'erros', label: 'Clínica de variáveis', duration: '23 min', eyebrow: 'Etapa 8', title: 'Diagnostique dez falhas de sintaxe, estado e comunicação', blocks: [{ type: 'lead', text: 'Algumas falhas impedem a compilação; outras compilam e prejudicam manutenção. Em todas, separe sintoma, causa, correção e nova prova.' }, { type: 'errors' }] },
  { id: 'entrega', label: 'Laboratório e Git', duration: '25 min', eyebrow: 'Etapa final', title: 'Compile cinco programas, registre evidências e entregue somente fontes revisadas', blocks: [{ type: 'lead', text: 'Agora execute o trabalho no repositório real. Cada comando vem com resultado esperado e leitura; registre somente aquilo que você realmente observar.' }, { type: 'delivery' }, { type: 'challenge', title: 'Modele o estado inicial de um atendimento', text: 'Crie AtendimentoVariaveis.java sem copiar os domínios anteriores. Represente protocolo, canal, tentativas, prioridade e se o atendimento está aberto; depois renomeie uma variável com Shift + F6.', acceptance: ['Todos os nomes usam camelCase e revelam o que o valor representa.', 'O booleano pode ser lido como pergunta e não se chama flag ou status.', 'Declaração, inicialização e uma reatribuição consciente aparecem no programa.', 'A saída antes e depois da reatribuição foi prevista e conferida.', 'String, int, char e boolean usam literais compatíveis.', 'Uma variável temporária só permanece se acrescentar intenção.', 'O programa compila, executa e não antecipa limites de inteiros.', 'O staged diff contém apenas fontes e o registro nominal da aula.'] }] }
];

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { setCopied(false); }
  };
  return <button type="button" className="var24-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return <div className="guided-file var24-code"><div className="guided-file-title"><FileCode2 size={17} /> {name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={lines} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#101827', fontSize: '.8rem', lineHeight: 1.65 }}>{code}</SyntaxHighlighter></div>;
}

function AnatomyLab() {
  const [selected, setSelected] = useState('nome');
  const pieces = {
    tipo: { token: 'int', title: 'Tipo', text: 'Define a categoria de valor aceita. Nesta linha, um inteiro.' },
    nome: { token: 'quantidadePedidos', title: 'Nome', text: 'Identifica o significado daquele valor durante o fluxo.' },
    recebe: { token: '=', title: 'Atribuição', text: 'Leia da direita para a esquerda: quantidadePedidos recebe 3.' },
    valor: { token: '3', title: 'Valor', text: 'É a informação guardada e disponível para usos posteriores.' },
    fim: { token: ';', title: 'Fim da instrução', text: 'O ponto e vírgula encerra esta instrução Java.' }
  };
  return <section className="var24-anatomy"><div className="var24-declaration" aria-label="Anatomia da declaração int quantidadePedidos recebe 3"><span>{Object.entries(pieces).map(([id, item]) => <button type="button" className={selected === id ? 'active' : ''} onClick={() => setSelected(id)} key={id}>{item.token}</button>)}</span><small>Selecione cada parte</small></div><article><Variable size={27} /><div><small>{pieces[selected].title}</small><h3>{pieces[selected].token}</h3><p>{pieces[selected].text}</p></div></article><div className="var24-state-map"><span><Type size={19} /><strong>int</strong><small>contrato</small></span><ChevronRight size={18} /><span><PencilLine size={19} /><strong>quantidadePedidos</strong><small>intenção</small></span><ChevronRight size={18} /><span><Box size={19} /><strong>3</strong><small>estado atual</small></span></div></section>;
}

function LifecycleLab() {
  const [stage, setStage] = useState(0);
  const states = [
    { label: 'Declarar', code: 'int quantidadePedidos;', state: 'Nome conhecido, sem valor utilizável', usable: false, console: '[não execute println ainda]', explanation: 'Tipo e nome existem no bloco, mas a local ainda não foi inicializada.' },
    { label: 'Inicializar', code: 'int quantidadePedidos = 3;', state: 'Valor atual: 3', usable: true, console: '[javac sem mensagens]', explanation: 'Declaração e primeira atribuição ocorreram juntas.' },
    { label: 'Usar', code: 'System.out.println(quantidadePedidos);', state: 'Leitura permitida', usable: true, console: '3', explanation: 'println lê o valor atual sem alterar a variável.' },
    { label: 'Reatribuir', code: 'quantidadePedidos = 5;', state: 'Valor atual: 5', usable: true, console: '5', explanation: 'O tipo não reaparece. A mesma variável recebe um novo valor.' }
  ];
  const item = states[stage];
  const fullCode = stage === 0 ? 'int quantidadePedidos;' : stage === 1 ? 'int quantidadePedidos = 3;' : stage === 2 ? 'int quantidadePedidos = 3;\nSystem.out.println(quantidadePedidos);' : 'int quantidadePedidos = 3;\nSystem.out.println(quantidadePedidos);\nquantidadePedidos = 5;\nSystem.out.println(quantidadePedidos);';
  return <section className="var24-lifecycle"><nav>{states.map((entry, index) => <button type="button" className={(stage === index ? 'active ' : '') + (index < stage ? 'done' : '')} onClick={() => setStage(index)} key={entry.label}><span>{index < stage ? <Check size={14} /> : index + 1}</span>{entry.label}</button>)}</nav><div className="var24-life-grid"><CodePanel name="Trecho dentro de main" code={fullCode} /><article className={item.usable ? 'ready' : 'waiting'}><header>{item.usable ? <CheckCircle2 size={23} /> : <Clock3 size={23} />}<div><small>Estado da variável</small><h3>{item.state}</h3></div></header><code>{item.code}</code><p>{item.explanation}</p><div><Terminal size={16} /><pre>{item.console}</pre></div></article></div><aside><Lightbulb size={18} /><span><strong>Escopo inicial:</strong> nesta aula, todas as variáveis ficam dentro das chaves de <code>main</code>. O local da declaração importa; atributos, parâmetros e escopo profundo virão depois.</span></aside></section>;
}

function TypesLab() {
  const [selected, setSelected] = useState('string');
  const [showWrong, setShowWrong] = useState(false);
  const item = TYPES[selected];
  return <section className="var24-types"><nav role="tablist">{Object.entries(TYPES).map(([id, entry]) => <button type="button" role="tab" aria-selected={selected === id} className={selected === id ? 'active' : ''} onClick={() => { setSelected(id); setShowWrong(false); }} key={id}>{entry.label}</button>)}</nav><div className="var24-type-grid"><CodePanel name="Main.java · trecho" code={showWrong ? item.wrong : item.declaration} /><article className={showWrong ? 'bad' : 'ok'}><header>{showWrong ? <TriangleAlert size={23} /> : <CheckCircle2 size={23} />}<div><small>{showWrong ? 'Forma incompatível' : 'Forma compatível'}</small><h3>{item.label} recebe {item.literal}</h3></div></header><p>{item.rule}</p><div><Terminal size={16} /><code>{showWrong ? 'javac → corrija antes de executar' : 'console → ' + item.output}</code></div><button type="button" onClick={() => setShowWrong(!showWrong)}>{showWrong ? 'Voltar ao exemplo válido' : 'Provocar erro de forma'}</button></article></div></section>;
}

function NamingLab() {
  const [selected, setSelected] = useState(0);
  const item = NAME_CASES[selected];
  const camelWords = ['valor', 'total', 'pedido'];
  return <section className="var24-naming"><div className="var24-name-list">{NAME_CASES.map((entry, index) => <button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={entry.bad}><code>{entry.bad}</code><ArrowRight size={14} /><code>{entry.good}</code></button>)}</div><article><header><PencilLine size={24} /><div><small>{item.verdict}</small><h3><code>{item.bad}</code> → <code>{item.good}</code></h3></div></header><p>{item.reason}</p><div className="var24-camel">{camelWords.map((word, index) => <span key={word}><small>{index === 0 ? 'minúscula' : 'inicial maiúscula'}</small><strong>{index === 0 ? word : word[0].toUpperCase() + word.slice(1)}</strong></span>)}<code>valorTotalPedido</code></div></article></section>;
}

function BooleanLab() {
  const [scenario, setScenario] = useState(0);
  const cases = [
    { bad: 'flag', good: 'clienteAtivo', value: true, question: 'O cliente está ativo?' },
    { bad: 'status', good: 'pagamentoAprovado', value: false, question: 'O pagamento foi aprovado?' },
    { bad: 'retorno', good: 'possuiPendencia', value: true, question: 'Possui pendência?' },
    { bad: 'tipo', good: 'permiteReagendamento', value: false, question: 'Permite reagendamento?' }
  ];
  const item = cases[scenario];
  return <section className="var24-booleans"><nav>{cases.map((entry, index) => <button type="button" className={scenario === index ? 'active' : ''} onClick={() => setScenario(index)} key={entry.good}>{entry.good}</button>)}</nav><div className="var24-question"><HelpCircle size={31} /><div><small>Pergunta de leitura</small><h3>{item.question}</h3><code>boolean {item.good} = {String(item.value)};</code></div><strong>{String(item.value)}</strong></div><div className="var24-boolean-compare"><span><TriangleAlert size={18} /><code>boolean {item.bad} = {String(item.value)};</code><small>O nome não revela a pergunta.</small></span><ChevronRight size={18} /><span><CheckCircle2 size={18} /><code>boolean {item.good} = {String(item.value)};</code><small>Nome e valor formam uma afirmação.</small></span></div><aside><strong>Status não é automaticamente booleano.</strong> <code>String statusPedido = "PENDENTE";</code> representa uma categoria; <code>boolean pedidoPendente = true;</code> representa uma resposta binária.</aside></section>;
}

function TemporaryLab() {
  const [mode, setMode] = useState('useful');
  const useful = 'double valorProduto = 100.00;\ndouble valorFrete = 25.00;\ndouble valorDesconto = 10.00;\n\ndouble valorTotalPedido = valorProduto + valorFrete - valorDesconto;\n\nSystem.out.println("Valor total do pedido: " + valorTotalPedido);';
  const direct = 'System.out.println("Valor total do pedido: " + (100.00 + 25.00 - 10.00));';
  const useless = 'String nomeCliente = "Cliente";\nString b = nomeCliente;\nSystem.out.println(b);';
  const code = mode === 'useful' ? useful : mode === 'direct' ? direct : useless;
  return <section className="var24-temporary"><nav>{[['useful', 'Resultado nomeado'], ['direct', 'Expressão direta'], ['useless', 'Cópia sem intenção']].map(([id, label]) => <button type="button" className={mode === id ? 'active' : ''} onClick={() => setMode(id)} key={id}>{label}</button>)}</nav><div className="var24-temp-grid"><CodePanel name={mode === 'useful' ? 'CalculoPedido.java · trecho' : 'Comparação didática'} code={code} /><article className={mode === 'useful' ? 'ok' : mode === 'direct' ? 'neutral' : 'bad'}>{mode === 'useful' ? <CheckCircle2 size={25} /> : mode === 'direct' ? <Search size={25} /> : <TriangleAlert size={25} />}<h3>{mode === 'useful' ? 'A regra ganhou nome' : mode === 'direct' ? 'Funciona, mas esconde as partes' : 'A nova variável não explica nada'}</h3><p>{mode === 'useful' ? 'valorTotalPedido permite discutir, imprimir e revisar o resultado da regra.' : mode === 'direct' ? 'Adequado para expressão muito simples; fica pior conforme surgem parcelas e regras.' : 'b só obriga o leitor a rastrear outro nome. Mantenha nomeCliente diretamente.'}</p><code>Saída: Valor total do pedido: 115.0</code></article></div></section>;
}

function DomainLab() {
  const [selected, setSelected] = useState(0);
  const item = DOMAIN_PROGRAMS[selected];
  return <section className="var24-domains"><nav role="tablist">{DOMAIN_PROGRAMS.map((entry, index) => <button type="button" role="tab" aria-selected={selected === index} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={entry.file}>{entry.label}</button>)}</nav><div className="var24-domain-grid"><CodePanel name={item.file} code={item.code} /><section className="var24-console"><header><Terminal size={16} /> Saída esperada</header><pre>{item.output}</pre><p><Sparkles size={18} />{item.insight}</p></section></div></section>;
}

function RenameLab() {
  const [name, setName] = useState('cliente');
  const [preview, setPreview] = useState(false);
  const target = preview ? 'nomeCliente' : name;
  const code = ['public class Main {', '    public static void main(String[] args) {', `        String ${target} = "Cliente Exemplo";`, `        System.out.println("Nome: " + ${target});`, `        System.out.println(${target});`, '    }', '}'].join('\n');
  const apply = () => { setName('nomeCliente'); setPreview(false); };
  return <section className="var24-idea"><header><span><MonitorCog size={16} /> aula-024-variaveis-nomes</span><div><button type="button" onClick={() => setPreview(true)}>Shift + F6 · Rename</button><button type="button" className={preview ? 'active' : ''} disabled={!preview} onClick={apply}><Check size={14} /> Aplicar refatoração</button></div></header><main><aside><strong>Project</strong><span><FileCode2 size={15} /> Main.java</span><hr /><strong>Rename preview</strong><span className={preview ? 'selected' : ''}>{preview ? '3 usos serão alterados' : 'Selecione cliente'}</span><small>Comentários e textos não são alterados sem revisão.</small></aside><section><div className="var24-editor-tab">Main.java <small>{preview ? 'Preview: cliente → nomeCliente' : name === 'nomeCliente' ? 'Refatoração aplicada' : 'Cursor em cliente'}</small></div><SyntaxHighlighter language="java" style={vscDarkPlus} showLineNumbers wrapLongLines customStyle={{ margin: 0, minHeight: '270px', padding: '18px', background: '#1f2530', fontSize: '.78rem', lineHeight: 1.65 }}>{code}</SyntaxHighlighter><footer><span>Run</span><pre>Nome: Cliente Exemplo{`\n`}Cliente Exemplo</pre></footer></section></main><p><GitBranch size={18} /><span><strong>Depois de aplicar:</strong> compile, execute e revise o diff. Rename reduz erro mecânico, mas você continua responsável pela qualidade do novo nome.</span></p><small>Simulação didática do IntelliJ. Aparência e atalhos podem variar conforme versão e keymap.</small></section>;
}

function ErrorClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="var24-errors"><nav>{ERRORS.map((entry, index) => <button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={entry.title}><span>{index + 1}</span>{entry.title}</button>)}</nav><article><header><AlertTriangle size={23} /><div><small>Caso {selected + 1} de {ERRORS.length}</small><h3>{item.title}</h3></div></header><CodePanel name="Trecho propositalmente problemático" code={item.code} /><section><small>Sintoma ou mensagem principal</small><code>{item.symptom}</code></section><div className="var24-error-path"><span><Search size={18} /><strong>Causa</strong><p>{item.cause}</p></span><ChevronRight size={18} /><span><Wrench size={18} /><strong>Correção e nova prova</strong><p>{item.fix}</p></span></div></article></section>;
}

function Delivery() {
  const [stage, setStage] = useState(0);
  const terminal = [
    ['Criar laboratório', 'New-Item -ItemType Directory -Force labs\\m1\\aula-024-variaveis-nomes\ncd labs\\m1\\aula-024-variaveis-nomes\nNew-Item Main.java, OrdemServicoVariaveis.java, PedidoVariaveis.java, AuditoriaVariaveis.java, CalculoPedido.java', 'Cinco arquivos criados na pasta nominal.', 'Abra cada arquivo no IntelliJ e digite os exemplos entendendo tipo, nome e valor.'],
    ['Compilar', 'javac Main.java\njavac OrdemServicoVariaveis.java\njavac PedidoVariaveis.java\njavac AuditoriaVariaveis.java\njavac CalculoPedido.java', '[nenhuma mensagem, se todos forem aceitos]', 'Silêncio do javac é sucesso apenas se o comando terminou normalmente e os .class foram criados.'],
    ['Executar', 'java Main\njava OrdemServicoVariaveis\njava PedidoVariaveis\njava AuditoriaVariaveis\njava CalculoPedido', 'Nome: Cliente Exemplo\nPedidos: 3\nAtivo: true\n[demais saídas previstas nas etapas]', 'Compare rótulo, valor e ordem. Não registre como observado algo que não executou.'],
    ['Provocar e reparar', '# altere uma cópia por vez\n# use antes de declarar; remova inicialização; troque tipo; redeclare\njavac Main.java', 'Uma mensagem por experimento; depois, compilação silenciosa.', 'Copie arquivo, linha e mensagem no diário. Restaure antes de provocar o erro seguinte.'],
    ['Revisar e versionar', 'git status\ngit diff\ngit add labs/m1/aula-024-variaveis-nomes docs/diario-de-bordo.md\ngit diff --staged\ngit commit -m "Aula 024: pratica variaveis e nomes profissionais"\ngit status', 'On branch ...\nnothing to commit, working tree clean', 'Se .class aparecer, pare, ajuste *.class no .gitignore e retire o artefato do stage antes do commit.']
  ];
  const current = terminal[stage];
  return <section className="var24-delivery"><nav>{terminal.map((entry, index) => <button type="button" className={(stage === index ? 'active ' : '') + (index < stage ? 'done' : '')} onClick={() => setStage(index)} key={entry[0]}><span>{index < stage ? <Check size={13} /> : index + 1}</span>{entry[0]}</button>)}</nav><div className="var24-terminal"><header><Terminal size={16} /> PowerShell <small>saída didática esperada</small></header><pre><strong>PS&gt; {current[1]}</strong>{'\n\n'}{current[2]}</pre><p><Lightbulb size={17} />{current[3]}</p></div><div className="var24-delivery-actions"><button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={15} /> Voltar</button><span>{stage + 1} de {terminal.length}</span><button type="button" disabled={stage === terminal.length - 1} onClick={() => setStage(stage + 1)}>Próxima prova <ArrowRight size={15} /></button></div><div className="guided-file var24-evidence"><div className="guided-file-title"><BookOpenCheck size={17} /> docs/variaveis-e-nomes.md <CopyButton value={EVIDENCE} label="Copiar evidências" /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#101827', fontSize: '.78rem', lineHeight: 1.65 }}>{EVIDENCE}</SyntaxHighlighter></div></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'anatomy') return <AnatomyLab />;
  if (block.type === 'lifecycle') return <LifecycleLab />;
  if (block.type === 'types') return <TypesLab />;
  if (block.type === 'naming') return <NamingLab />;
  if (block.type === 'booleans') return <BooleanLab />;
  if (block.type === 'temporary') return <TemporaryLab />;
  if (block.type === 'domains') return <DomainLab />;
  if (block.type === 'rename') return <RenameLab />;
  if (block.type === 'errors') return <ErrorClinic />;
  if (block.type === 'delivery') return <Delivery />;
  if (block.type === 'note') { const Icon = block.tone === 'warning' ? AlertTriangle : Lightbulb; return <aside className={'guided-note ' + (block.tone || 'info')}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>; }
  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  return null;
}

export default function GuidedVariablesLesson024({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const completionNormalizedRef = useRef(false);
  const [completedStepIds, setCompletedStepIds] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return new Set(Array.isArray(saved) ? saved : []); } catch { return new Set(); }
  });

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedStepIds])), [completedStepIds]);
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
      if (next.has(activeStep.id)) next.delete(activeStep.id); else next.add(activeStep.id);
      return next;
    });
  };

  return <article className="guided-git-lesson guided-variables-lesson">
    <header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Variable size={17} /> Oficina de estado nomeado</span><p className="guided-sequence">024 · M1.04</p><h1>Variáveis que guardam valores e nomes que explicam o domínio</h1><p>Declare, inicialize, altere, renomeie e diagnostique cada informação sem esconder intenção em letras soltas.</p></div><div className="guided-hero-status"><Variable size={42} /><strong>{progress}%</strong><span>{completedLabel}</span></div><div className="guided-progress-track" aria-label={'Progresso: ' + progress + '%'}><span style={{ width: progress + '%' }} /></div></header>
    <GuidedLessonFacts ariaLabel="Resultado da aula" items={[{ value: 4, label: 'estados explicáveis' }, { value: 5, label: 'programas executados' }, { value: 10, label: 'falhas diagnosticáveis' }]} />
    <div className="guided-layout"><nav className="guided-step-nav" aria-label="Etapas da aula 024"><div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>{steps.map((step, index) => <button type="button" key={step.id} className={(index === activeIndex ? 'active ' : '') + (completedStepIds.has(step.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{activeStep.eyebrow} · {activeStep.duration}</span><h2>{activeStep.title}</h2></div><div className="guided-blocks">{activeStep.blocks.map((block, index) => <ContentBlock block={block} key={activeStep.id + '-' + block.type + '-' + index} />)}</div><div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (activeStepComplete ? 'undo' : 'complete')} onClick={toggleActiveStep}>{activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><Check size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div></div>{allStepsComplete && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>{lessonComplete ? 'Estado nomeado com intenção' : 'Oficina concluída'}</h3><p>{lessonComplete ? 'Etapas, evidências e conclusão geral estão registradas.' : 'Conclua a aula para liberar os tipos inteiros.'}</p></div><button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}</main></div>
    <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 023</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsComplete ? 'ready' : '')}>{lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : completedStepIds.size + ' de ' + steps.length + ' etapas'}</strong><small>{lessonComplete ? 'Variáveis nomeadas com critério' : allStepsComplete ? 'Use o botão acima' : 'Declare, use e explique'}</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas e a aula para avançar' : 'Abrir tipos inteiros'}>Aula 025 <ArrowRight size={17} /></button></footer>
  </article>;
}
