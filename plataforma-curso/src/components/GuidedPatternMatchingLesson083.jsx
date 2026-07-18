import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, Copy, FileCode2, Filter, GitBranch, Lightbulb, ListChecks, Play, RotateCcw, Sparkles, Terminal, Wrench, XCircle } from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLocaleNumberFormatLesson.css';
import './guidedPatternMatchingLesson.css';

const STORAGE_KEY = 'guided-pattern-matching-lesson-083-progress';
const MAIN_PROGRAM = [
  'public class LaboratorioPatternMatching {',
  '    public static void main(String[] args) {',
  '        Object valor = "Java Backend";',
  '        if (valor instanceof String texto) {',
  '            System.out.println("texto: " + texto.toUpperCase());',
  '        }',
  '        System.out.println("original: " + valor.getClass().getSimpleName());',
  '',
  '        System.out.println(tamanho("Java"));',
  '        System.out.println(tamanho(10));',
  '',
  '        Object ausente = null;',
  '        System.out.println("null combina: "',
  '                + (ausente instanceof String texto));',
  '',
  '        Object pedido = new PedidoResumo("PED-001", StatusPedido.APROVADO);',
  '        if (pedido instanceof PedidoResumo resumo',
  '                && resumo.status() == StatusPedido.APROVADO) {',
  '            System.out.println("pedido: " + resumo.codigo());',
  '        }',
  '',
  '        Pagamento[] pagamentos = {',
  '            new PagamentoPix("chave-pix"),',
  '            new PagamentoCartao("1234", 3),',
  '            new PagamentoBoleto("34191")',
  '        };',
  '        for (Pagamento pagamento : pagamentos) {',
  '            System.out.println(descrever(pagamento));',
  '        }',
  '    }',
  '',
  '    static String tamanho(Object valor) {',
  '        if (!(valor instanceof String texto)) {',
  '            return "nao texto";',
  '        }',
  '        return "tamanho: " + texto.length();',
  '    }',
  '',
  '    static String descrever(Pagamento pagamento) {',
  '        if (pagamento instanceof PagamentoPix pix) {',
  '            return "PIX: " + pix.chave();',
  '        }',
  '        if (pagamento instanceof PagamentoCartao cartao) {',
  '            return "Cartao: " + cartao.finalCartao()',
  '                    + " em " + cartao.parcelas() + "x";',
  '        }',
  '        if (pagamento instanceof PagamentoBoleto boleto) {',
  '            return "Boleto: " + boleto.codigoBarras();',
  '        }',
  '        throw new IllegalStateException("Pagamento nao tratado");',
  '    }',
  '}',
  '',
  'record PedidoResumo(String codigo, StatusPedido status) { }',
  'enum StatusPedido { PENDENTE, APROVADO, RECUSADO }',
  '',
  'sealed interface Pagamento',
  '        permits PagamentoPix, PagamentoCartao, PagamentoBoleto { }',
  'record PagamentoPix(String chave) implements Pagamento { }',
  'record PagamentoCartao(String finalCartao, int parcelas)',
  '        implements Pagamento { }',
  'record PagamentoBoleto(String codigoBarras) implements Pagamento { }',
].join('\n');

const EXPECTED_OUTPUT = [
  'texto: JAVA BACKEND',
  'original: String',
  'tamanho: 4',
  'nao texto',
  'null combina: false',
  'pedido: PED-001',
  'PIX: chave-pix',
  'Cartao: 1234 em 3x',
  'Boleto: 34191',
].join('\n');

const EVIDENCE = [
  '# Aula 083 — Pattern matching', '',
  '- [ ] Removi cast manual com instanceof moderno',
  '- [ ] Expliquei que o objeto original não muda',
  '- [ ] Respeitei o escopo da variável de padrão',
  '- [ ] Usei retorno antecipado com flow scoping',
  '- [ ] Provei que null não combina',
  '- [ ] Usei && somente após o teste de tipo',
  '- [ ] Expliquei por que || não garante a variável',
  '- [ ] Combinei record, enum e pattern',
  '- [ ] Tratei uma sealed hierarchy por subtipo',
  '- [ ] Comparei pattern matching e polimorfismo',
  '- [ ] Apliquei em sete domínios',
  '- [ ] Compilei, depurei e revisei o diff',
].join('\n');

function CopyButton({ value, label = 'Copiar' }) { const [copied, setCopied] = useState(false); const copy = async () => { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); }; return <button type="button" className="ln73-copy" onClick={copy}>{copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? 'Copiado' : label}</button>; }
function CodePanel({ name, code, language = 'java' }) { return <section className="guided-file ln73-code"><div className="guided-file-title"><FileCode2 size={16}/>{name}<CopyButton value={code}/></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language === 'java'} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>; }

function CastLab() { const [modern, setModern] = useState(true); return <section className="pm83-stack"><div className="pm83-mode"><button type="button" className={!modern ? 'active' : ''} onClick={() => setModern(false)}>instanceof + cast</button><button type="button" className={modern ? 'active' : ''} onClick={() => setModern(true)}>type pattern</button></div><div className="pm83-cast"><article><small>REFERÊNCIA ORIGINAL</small><strong>Object valor</strong><span>objeto real: String</span></article><ArrowRight/><article className="test"><small>TESTE</small><code>valor instanceof String{modern ? ' texto' : ''}</code></article><ArrowRight/><article className={modern ? 'safe' : 'manual'}><small>{modern ? 'VARIÁVEL TIPADA' : 'CAST MANUAL'}</small><code>{modern ? 'String texto' : 'String texto = (String) valor'}</code></article></div><CodePanel name={modern ? 'Instanceof moderno' : 'Forma antiga'} code={modern ? 'Object valor = "Java Backend";\n\nif (valor instanceof String texto) {\n    System.out.println(texto.toUpperCase());\n}' : 'Object valor = "Java Backend";\n\nif (valor instanceof String) {\n    String texto = (String) valor;\n    System.out.println(texto.toUpperCase());\n}'}/><aside className="guided-note info"><Lightbulb size={20}/><div><strong>Pattern matching não transforma o objeto</strong><p>valor continua declarado como Object. texto é uma nova variável local, criada apenas no caminho onde o teste confirmou String.</p></div></aside></section>; }

const FLOW_CASES = [
  ['inside', 'Dentro do if', true, 'o teste verdadeiro garante String'],
  ['outside', 'Depois do if', false, 'o fluxo pode ter passado pelo ramo falso'],
  ['return', 'Após retorno antecipado', true, 'o caminho não String já terminou'],
];
function ScopeLab() { const [selected, setSelected] = useState(0); const item = FLOW_CASES[selected]; return <section className="pm83-stack"><div className="pm83-flow-tabs">{FLOW_CASES.map((entry, index) => <button type="button" key={entry[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{entry[1]}</button>)}</div><div className="pm83-flow"><span>Object valor</span><ArrowRight/><span>instanceof String texto</span><ArrowRight/><article className={item[2] ? 'available' : 'blocked'}>{item[2] ? <CheckCircle2 size={21}/> : <XCircle size={21}/>}<div><strong>texto {item[2] ? 'disponível' : 'fora do escopo'}</strong><small>{item[3]}</small></div></article></div><CodePanel name="Flow scoping com retorno antecipado" code={'static void imprimirTamanho(Object valor) {\n    if (!(valor instanceof String texto)) {\n        System.out.println("Não é texto.");\n        return;\n    }\n\n    // Se chegou aqui, o pattern necessariamente combinou.\n    System.out.println("Tamanho: " + texto.length());\n}'}/><p className="ln73-format-proof">O escopo não depende apenas de chaves: depende de onde o <strong>compilador consegue provar</strong> que a variável existe.</p></section>; }

const LOGIC_CASES = [
  ['and', '&&', 'valor instanceof String texto && texto.length() > 3', true, 'curto-circuito: o segundo lado só roda após o pattern combinar'],
  ['or', '||', 'valor instanceof String texto || texto.length() > 3', false, 'se o primeiro lado for falso, texto nunca foi criada'],
  ['null', 'null', 'null instanceof String texto', true, 'resultado false; o corpo não executa'],
];
function LogicLab() { const [selected, setSelected] = useState(0); const item = LOGIC_CASES[selected]; return <section className="pm83-stack"><div className="pm83-logic-tabs">{LOGIC_CASES.map((entry, index) => <button type="button" key={entry[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{entry[1]}</button>)}</div><div className="pm83-logic"><code>{item[2]}</code><article className={item[3] ? 'valid' : 'invalid'}>{item[3] ? <Check size={19}/> : <XCircle size={19}/>}<div><strong>{item[3] ? 'expressão válida' : 'não compila'}</strong><span>{item[4]}</span></div></article></div><CodePanel name="Record, enum e curto-circuito" code={'Object valor = new PedidoResumo("PED-001", StatusPedido.APROVADO);\n\nif (valor instanceof PedidoResumo pedido\n        && pedido.status() == StatusPedido.APROVADO) {\n    System.out.println("Pedido aprovado: " + pedido.codigo());\n}\n\nrecord PedidoResumo(String codigo, StatusPedido status) { }\nenum StatusPedido { PENDENTE, APROVADO, RECUSADO }'}/><aside className="guided-note warning"><AlertTriangle size={20}/><div><strong>null não lança exceção no instanceof</strong><p>null instanceof Tipo é false. Isso evita o cast, mas a ausência ainda precisa fazer sentido no contrato do método.</p></div></aside></section>; }

function RecordLab() { const [kind, setKind] = useState('record'); const record = kind === 'record'; return <section className="pm83-stack"><div className="pm83-record-tabs"><button type="button" className={record ? 'active' : ''} onClick={() => setKind('record')}>record</button><button type="button" className={!record ? 'active' : ''} onClick={() => setKind('enum')}>enum dentro do record</button></div><div className="pm83-extraction"><article><small>TIPO BASE</small><strong>Object valor</strong></article><ArrowRight/><article className="match"><Filter size={22}/><strong>PedidoResumo pedido</strong><span>pattern combinou</span></article><ArrowRight/><div>{record ? <><span>pedido.codigo()</span><span>pedido.status()</span></> : <><span>status == APROVADO</span><span>acesso após &&</span></>}</div></div><CodePanel name="Dados específicos sem cast" code={'if (valor instanceof ClienteResumo cliente) {\n    System.out.println(cliente.nome());\n    System.out.println(cliente.email());\n}\n\nrecord ClienteResumo(String nome, String email) { }'}/><p className="ln73-format-proof">Pattern matching funciona porque record também é um tipo Java. Esta aula usa <strong>type patterns</strong>; record patterns avançados ficam para depois.</p></section>; }

const PAYMENT_TYPES = [
  ['pix', 'PagamentoPix', 'pix.chave()', 'PIX: chave-pix'],
  ['card', 'PagamentoCartao', 'cartao.finalCartao() · cartao.parcelas()', 'Cartão: 1234 em 3x'],
  ['boleto', 'PagamentoBoleto', 'boleto.codigoBarras()', 'Boleto: 34191'],
];
function SealedLab() { const [selected, setSelected] = useState(0); const [view, setView] = useState('if'); const item = PAYMENT_TYPES[selected]; return <section className="pm83-stack"><div className="pm83-sealed-controls"><div>{PAYMENT_TYPES.map((entry, index) => <button type="button" key={entry[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{entry[1]}</button>)}</div><select value={view} onChange={event => setView(event.target.value)}><option value="if">instanceof moderno</option><option value="switch">switch pattern conceitual</option></select></div><div className="pm83-sealed-tree"><strong>sealed Pagamento</strong>{PAYMENT_TYPES.map((entry, index) => <span key={entry[0]} className={selected === index ? 'active' : ''}>{entry[1]}</span>)}</div><div className="pm83-output"><code>{item[2]}</code><ArrowRight/><strong>{item[3]}</strong></div><CodePanel name={view === 'if' ? 'Tratamento estável no Java 17' : 'Evolução conceitual em Java moderno'} code={view === 'if' ? 'if (pagamento instanceof PagamentoPix pix) {\n    return "PIX: " + pix.chave();\n}\nif (pagamento instanceof PagamentoCartao cartao) {\n    return "Cartão: " + cartao.finalCartao();\n}\nif (pagamento instanceof PagamentoBoleto boleto) {\n    return "Boleto: " + boleto.codigoBarras();\n}' : 'return switch (pagamento) {\n    case PagamentoPix pix -> "PIX: " + pix.chave();\n    case PagamentoCartao cartao -> "Cartão: " + cartao.finalCartao();\n    case PagamentoBoleto boleto -> "Boleto: " + boleto.codigoBarras();\n};'}/>{view === 'switch' && <aside className="guided-note warning"><AlertTriangle size={20}/><div><strong>Confira a versão antes de copiar</strong><p>Os exemplos executáveis desta aula usam instanceof moderno no Java 17. Switch patterns variam conforme o JDK e são conceituais aqui.</p></div></aside>}</section>; }

const DECISIONS = [
  ['comportamento essencial do pagamento', 'polymorphism', 'pagamento.descrever()'],
  ['DTO de uma API externa', 'pattern', 'transformador trata os subtipos na borda'],
  ['linha específica de relatório', 'pattern', 'representação não pertence ao domínio'],
  ['mesma decisão repetida em cinco serviços', 'polymorphism', 'centralize comportamento ou serviço específico'],
  ['parâmetro Object sem justificativa', 'domain', 'receba o tipo base real do domínio'],
];
function DesignLab() { const [selected, setSelected] = useState(0); const item = DECISIONS[selected]; const labels = { polymorphism: 'Prefira polimorfismo', pattern: 'Pattern matching faz sentido', domain: 'Corrija o contrato primeiro' }; return <section className="pm83-stack"><div className="pm83-decisions">{DECISIONS.map((entry, index) => <button type="button" key={entry[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><strong>{entry[0]}</strong></button>)}</div><div className={'pm83-design ' + item[1]}><GitBranch size={25}/><div><small>DECISÃO DO MENTOR</small><strong>{labels[item[1]]}</strong><code>{item[2]}</code></div></div><CodePanel name="Comportamento no subtipo" code={'sealed interface Pagamento permits PagamentoPix, PagamentoCartao {\n    String descrever();\n}\n\nrecord PagamentoPix(String chave) implements Pagamento {\n    @Override\n    public String descrever() {\n        return "PIX: " + chave;\n    }\n}'}/><aside className="guided-note info"><Lightbulb size={20}/><div><strong>Pattern melhora casts necessários; não justifica if gigante</strong><p>Transformação externa, log, relatório, DTO ou integração podem usar patterns. Regra natural do subtipo costuma pedir polimorfismo.</p></div></aside></section>; }

const DOMAINS = [
  ['Cliente', 'PF | PJ', 'nome/CPF ou razão social/CNPJ'],
  ['Produto', 'Fisico | Digital', 'pesoKg ou tamanhoMb'],
  ['Pedido', 'Criado | Aprovado | Cancelado', 'usuário ou motivo específico'],
  ['Pagamento', 'Pix | Cartao | Boleto', 'chave, parcelas ou código'],
  ['Ordem de serviço', 'Reagendar | Concluir | Cancelar', 'data/hora ou motivo'],
  ['Mensageria', 'BoasVindas | Entrega | Nps', 'payload específico da mensagem'],
  ['Auditoria', 'Criacao | Edicao | Exclusao', 'campo alterado ou motivo'],
];
function DomainLab() { const [selected, setSelected] = useState(0); const item = DOMAINS[selected]; return <section className="pm83-stack"><div className="ln73-domains pm83-domains"><div>{DOMAINS.map((domain, index) => <button type="button" key={domain[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{domain[0]}</strong></button>)}</div><article><small>TYPE PATTERN NO BACKEND</small><h3>{item[0]}</h3><code>{item[1]}</code><p>A transformação externa acessa {item[2]} sem cast manual.</p><div><strong>Teste do mentor</strong><span>Essa decisão está numa borda ou deveria ser método do subtipo?</span></div></article></div><div className="pm83-refactor"><article><small>GENÉRICO DEMAIS</small><code>descrever(Object valor)</code><span>aceita qualquer objeto e perde o domínio</span></article><ArrowRight/><article className="after"><small>CONTRATO REAL</small><code>descrever(Pagamento pagamento)</code><span>sealed limita casos e melhora o compilador</span></article></div></section>; }

const ERRORS = [
  ['Achar que muda o objeto', 'A referência original continua com o tipo declarado.', 'Trate a pattern variable como nova variável local.'],
  ['Variável fora do escopo', 'O fluxo não garante que o teste passou.', 'Use-a apenas onde o compilador prova o tipo.'],
  ['Pattern com ||', 'O segundo lado pode rodar sem criar a variável.', 'Use && após o teste ou reestruture.'],
  ['Polimorfismo ignorado', 'If por tipo substitui comportamento natural.', 'Mova regra essencial para o subtipo.'],
  ['Object sem motivo', 'Qualquer valor entra no método.', 'Receba o tipo base do domínio.'],
  ['If gigante', 'Cada novo subtipo aumenta um método central.', 'Revise fronteira, serviço ou polimorfismo.'],
  ['Null esquecido', 'Nenhum pattern combina com null.', 'Defina contrato de ausência explicitamente.'],
  ['Switch confundido', 'Sintaxe depende da versão do JDK.', 'Use instanceof no Java 17 e valide o recurso.'],
  ['Sealed ignorado', 'Hierarquia aberta dificulta conhecer casos.', 'Feche apenas quando o domínio for realmente fechado.'],
  ['Lógica espalhada', 'Mesma decisão por tipo aparece em vários lugares.', 'Centralize transformação ou comportamento.'],
];
function ErrorsClinic() { const [selected, setSelected] = useState(0); const item = ERRORS[selected]; return <section className="ln73-errors pm83-errors"><div>{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article><header><AlertTriangle size={20}/><div><small>CASO {selected + 1} DE 10</small><h3>{item[0]}</h3></div></header><p><strong>Sintoma:</strong> {item[1]}</p><p><Wrench size={16}/><strong>Correção:</strong> {item[2]}</p></article></section>; }

const CHECKS = ['cast manual removido', 'objeto original não foi transformado', 'escopo dentro do if respeitado', 'retorno antecipado liberou texto', 'null produziu false', '&& protegeu acesso à variável', '|| inválido foi explicado', 'record e enum trabalharam juntos', 'sealed limitou três pagamentos', 'polimorfismo foi comparado'];
function DeliveryLab() { const [checked, setChecked] = useState([]); const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]); const commands = ['mkdir labs\\m2\\aula-083-pattern-matching', 'cd labs\\m2\\aula-083-pattern-matching', 'java -version', 'javac -version', 'javac LaboratorioPatternMatching.java', 'java LaboratorioPatternMatching'].join('\n'); return <section className="ln73-delivery"><CodePanel name="LaboratorioPatternMatching.java" code={MAIN_PROGRAM}/><div className="ln73-terminal"><header><Terminal size={15}/>Verificar, compilar e executar<CopyButton value={commands}/></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS&gt; ')}{ '\n\n' }<span>{EXPECTED_OUTPUT}</span></pre></div><section className="ln73-debug"><header><Play size={18}/><strong>Debug: referência, objeto e pattern variable</strong></header><div><article><span>1</span><strong>Breakpoint</strong><p>Pare no instanceof.</p></article><article><span>2</span><strong>Declarado</strong><p>valor aparece como Object.</p></article><article><span>3</span><strong>Real</strong><p>o objeto é ClienteResumo.</p></article><article><span>4</span><strong>Pattern</strong><p>cliente nasce já tipada.</p></article></div></section><div className="ln73-checks">{CHECKS.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14}/> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22}/><h3>Desafio: transformar ações de OS</h3></div><p>Receba uma sealed interface AcaoOs e gere uma resposta externa com patterns para Reagendar, Concluir e Cancelar.</p><ul><li>Use && para uma validação específica do subtipo.</li><li>Mostre o comportamento com null sem NullPointerException.</li><li>Compare sua transformação com um método polimórfico.</li><li>Não use Object quando AcaoOs expressa melhor o contrato.</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16}/>README.md · evidências<CopyButton value={EVIDENCE}/></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>; }

function ContentBlock({ block }) { if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>; const map = { cast: CastLab, scope: ScopeLab, logic: LogicLab, record: RecordLab, sealed: SealedLab, design: DesignLab, domains: DomainLab, errors: ErrorsClinic, delivery: DeliveryLab }; const Component = map[block.type]; return Component ? <Component/> : null; }
const steps = [
  { id: 'cast', label: 'Teste + Variável Tipada', duration: '11 min', eyebrow: 'INSTANCEOF MODERNO', title: 'Una verificação e extração sem cast manual', blocks: [{ type: 'lead', text: 'O type pattern confirma o subtipo e cria uma variável já tipada no caminho verdadeiro, reduzindo ruído e risco de cast incorreto.' }, { type: 'cast' }] },
  { id: 'scope', label: 'Flow Scoping', duration: '13 min', eyebrow: 'ESCOPO PELO FLUXO', title: 'Use a variável somente onde o compilador garante o tipo', blocks: [{ type: 'lead', text: 'Dentro do if o pattern vale; fora dele pode não valer. Um retorno antecipado elimina o caminho falso e amplia o uso seguro.' }, { type: 'scope' }] },
  { id: 'logic', label: 'Null, && e ||', duration: '13 min', eyebrow: 'CURTO-CIRCUITO E AUSÊNCIA', title: 'Faça a ordem lógica proteger a pattern variable', blocks: [{ type: 'lead', text: '&& avalia o segundo lado só depois do teste verdadeiro; || pode precisar do segundo lado exatamente quando a variável não existe.' }, { type: 'logic' }] },
  { id: 'record', label: 'Records e Enums', duration: '12 min', eyebrow: 'DADOS ESPECÍFICOS', title: 'Extraia um tipo rico e continue validando seu estado', blocks: [{ type: 'lead', text: 'Records também são tipos Java. Depois do pattern, accessors e enums do subtipo ficam disponíveis sem cast.' }, { type: 'record' }] },
  { id: 'sealed', label: 'Pattern + Sealed', duration: '15 min', eyebrow: 'CONJUNTO CONHECIDO', title: 'Trate cada possibilidade controlada na borda do sistema', blocks: [{ type: 'lead', text: 'Sealed restringe as possibilidades; type patterns acessam chave, parcelas ou código. Switch patterns aparecem apenas como evolução conceitual.' }, { type: 'sealed' }] },
  { id: 'design', label: 'Pattern ou Polimorfismo', duration: '14 min', eyebrow: 'DECISÃO DE DESIGN', title: 'Não transforme todo comportamento em decisão por tipo', blocks: [{ type: 'lead', text: 'Comportamento essencial pertence ao subtipo; transformação externa, log, DTO e relatório podem justificar pattern matching.' }, { type: 'design' }] },
  { id: 'domains', label: 'Refatoração no Backend', duration: '15 min', eyebrow: 'SETE DOMÍNIOS', title: 'Acesse dados específicos sem abandonar contratos fortes', blocks: [{ type: 'lead', text: 'Cliente, produto, pedido, pagamento, OS, mensageria e auditoria mostram patterns em bordas com tipos base de domínio.' }, { type: 'domains' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'DEZ DIAGNÓSTICOS', title: 'Encontre escopo falso, Object excessivo e ifs por tipo', blocks: [{ type: 'lead', text: 'O problema raramente é a sintaxe curta; é usar o recurso para mascarar contrato fraco, lógica espalhada ou hierarquia aberta.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '30 min', eyebrow: 'CÓDIGO, DEBUG E GIT', title: 'Prove escopo, curto-circuito e decisão por subtipo', blocks: [{ type: 'lead', text: 'Compile no Java 17+, confira nove saídas, provoque os erros de escopo e entregue a justificativa de design.' }, { type: 'delivery' }] },
];

export default function GuidedPatternMatchingLesson083({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) { const [activeIndex, setActiveIndex] = useState(0); const navRef = useRef(null); const completionNormalizedRef = useRef(false); const [completedSteps, setCompletedSteps] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); const validIds = new Set(steps.map(step => step.id)); return new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []); } catch { return new Set(); } }); useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps])), [completedSteps]); useEffect(() => { if (!completionNormalizedRef.current && isCompleted && completedSteps.size !== steps.length) { completionNormalizedRef.current = true; onToggleCompleted(); } }, [completedSteps.size, isCompleted, onToggleCompleted]); useEffect(() => { const button = navRef.current?.querySelector('button.active'); if (button && window.matchMedia('(max-width: 900px)').matches) button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }, [activeIndex]); const step = steps[activeIndex]; const stepDone = completedSteps.has(step.id); const allStepsDone = completedSteps.size === steps.length; const lessonComplete = isCompleted && allStepsDone; const selectStep = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }; const toggleStep = () => { if (stepDone && isCompleted) onToggleCompleted(); setCompletedSteps(current => { const next = new Set(current); if (next.has(step.id)) next.delete(step.id); else next.add(step.id); return next; }); }; return <article className="guided-git-lesson guided-pattern-matching-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Filter size={17}/>Oficina de fluxo tipado Java</span><p className="guided-sequence">083 · M2.22</p><h1>Pattern matching</h1><p>Remova casts manuais, domine o escopo pelo fluxo e trate subtipos sem abandonar polimorfismo e bons contratos.</p></div><div className="guided-hero-status"><Clock3 size={42}/><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 083" items={[{ value: '1 type pattern', label: 'Teste e variável tipada' }, { value: '3 fluxos', label: 'if, retorno, curto-circuito' }, { value: '10 falhas', label: 'Diagnosticadas pela causa' }]}/><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 083"><div className="guided-step-nav-title"><ListChecks size={18}/>Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? 'active ' : '') + (completedSteps.has(item.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14}/> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + '-' + index} block={block}/>)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17}/>Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (stepDone ? 'undo' : 'complete')} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16}/>Desmarcar etapa</> : <><CheckCircle2 size={16}/>Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17}/></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30}/><div><h3>Tipos específicos com fluxo comprovado</h3><p>{lessonComplete ? 'Aula concluída e pronta para text blocks.' : 'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17}/>Aula 082</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsDone ? 'ready' : '')}><Clock3 size={18}/><span><strong>{lessonComplete ? 'Aula concluída' : completedSteps.size + ' de ' + steps.length + ' etapas'}</strong><small>instanceof, escopo e design</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 084<ArrowRight size={17}/></button></footer></article>; }
