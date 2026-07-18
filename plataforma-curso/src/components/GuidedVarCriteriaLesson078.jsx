import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, Copy, Eye, FileCode2, Lightbulb, ListChecks, Play, RotateCcw, Sparkles, Terminal, Wrench } from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLocaleNumberFormatLesson.css';
import './guidedVarCriteriaLesson.css';

const STORAGE_KEY = 'guided-var-criteria-lesson-078-progress';
const MAIN_PROGRAM = [
  'import java.math.BigDecimal;',
  'import java.time.Instant;',
  'import java.time.LocalDate;',
  'import java.util.ArrayList;',
  'import java.util.List;',
  'import java.util.Scanner;',
  '',
  'public class LaboratorioVar {',
  '    enum StatusPedido { PENDENTE, APROVADO, RECUSADO }',
  '    record ClienteResumo(String nome, String email) { }',
  '',
  '    public static void main(String[] args) {',
  '        var nome = "Ana";',
  '        var quantidade = 10;',
  '        var valorLong = 10L;',
  '        var media = 10.5;',
  '        var taxa = 10.5F;',
  '        var ativo = true;',
  '        var letra = \'A\';',
  '        System.out.println("primitivos: " + nome + " | " + quantidade',
  '                + " | " + valorLong + " | " + media + " | " + taxa',
  '                + " | " + ativo + " | " + letra);',
  '',
  '        var valor = new BigDecimal("10.00");',
  '        var desconto = new BigDecimal("2.50");',
  '        var total = valor.subtract(desconto);',
  '        System.out.println("total: " + total);',
  '',
  '        var cliente = new ClienteResumo("Ana", "ana@email.com");',
  '        var status = StatusPedido.APROVADO;',
  '        var hoje = LocalDate.of(2026, 7, 7);',
  '        var instante = Instant.parse("2026-07-07T13:00:00Z");',
  '        System.out.println("cliente: " + cliente.nome());',
  '        System.out.println("status: " + status);',
  '        System.out.println("hoje: " + hoje);',
  '        System.out.println("instant: " + instante);',
  '',
  '        var soma = 0;',
  '        for (var indice = 0; indice < 3; indice++) soma += indice;',
  '        System.out.println("soma for: " + soma);',
  '',
  '        var nomes = new ArrayList<String>();',
  '        nomes.add("Ana");',
  '        nomes.add("Bruno");',
  '        var texto = new StringBuilder();',
  '        for (var item : nomes) {',
  '            if (!texto.isEmpty()) texto.append(",");',
  '            texto.append(item.toUpperCase());',
  '        }',
  '        System.out.println("foreach: " + texto);',
  '',
  '        try (var scanner = new Scanner("Carla")) {',
  '            var lido = scanner.nextLine();',
  '            System.out.println("scanner: " + lido);',
  '        }',
  '',
  '        List<String> contrato = new ArrayList<>();',
  '        contrato.add("interface explicita");',
  '        System.out.println("list: " + contrato.get(0));',
  '',
  '        ClienteResumo encontrado = buscarClienteResumo();',
  '        System.out.println("metodo explicito: " + encontrado.email());',
  '    }',
  '',
  '    static ClienteResumo buscarClienteResumo() {',
  '        return new ClienteResumo("Davi", "davi@email.com");',
  '    }',
  '}',
].join('\n');
const EXPECTED_OUTPUT = [
  'primitivos: Ana | 10 | 10 | 10.5 | 10.5 | true | A',
  'total: 7.50',
  'cliente: Ana',
  'status: APROVADO',
  'hoje: 2026-07-07',
  'instant: 2026-07-07T13:00:00Z',
  'soma for: 3',
  'foreach: ANA,BRUNO',
  'scanner: Carla',
  'list: interface explicita',
  'metodo explicito: davi@email.com',
].join('\n');
const EVIDENCE = [
  '# Aula 078 — var com critério', '',
  '- [ ] Expliquei inferência local e tipo fixo',
  '- [ ] Diferenciei var de tipagem dinâmica',
  '- [ ] Mapeei onde var pode e não pode aparecer',
  '- [ ] Identifiquei tipos primitivos pelos literais',
  '- [ ] Usei var com BigDecimal, record, enum e tempo',
  '- [ ] Usei var em for, for-each e try-with-resources',
  '- [ ] Protegi abstração de interface em generics',
  '- [ ] Evitei var com null e sem inicialização',
  '- [ ] Explicitei retorno de método ambíguo',
  '- [ ] Melhorei nomes antes de reduzir caracteres',
  '- [ ] Apliquei o critério em sete domínios',
  '- [ ] Compilei, depurei e revisei o diff',
].join('\n');

function CopyButton({ value, label = 'Copiar' }) { const [copied, setCopied] = useState(false); const copy = async () => { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); }; return <button type="button" className="ln73-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>; }
function CodePanel({ name, code, language = 'java' }) { return <section className="guided-file ln73-code"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language === 'java'} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>; }

const EXPRESSIONS = [
  ['"Ana"', 'String', 'nome'],
  ['30', 'int', 'idade'],
  ['new BigDecimal("10.00")', 'BigDecimal', 'total'],
  ['new ClienteResumo(...)', 'ClienteResumo', 'cliente'],
  ['buscar()', '?', 'resultado'],
];
function InferenceLab() {
  const [selected, setSelected] = useState(0); const item = EXPRESSIONS[selected]; const clear = item[1] !== '?';
  return <section className="vr78-stack"><div className="vr78-expressions">{EXPRESSIONS.map((entry, index) => <button type="button" key={entry[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><code>{entry[0]}</code><small>{entry[2]}</small></button>)}</div><div className="vr78-compiler"><article><small>CÓDIGO-FONTE</small><strong>var {item[2]} = {item[0]};</strong></article><ArrowRight /><article className={clear ? 'safe' : 'warning'}><small>COMPILADOR INFERE</small><strong>{clear ? item[1] : 'tipo existe, mas leitor não vê'}</strong><span>o tipo fica fixo depois da declaração</span></article></div><CodePanel name="Inferência não é dinâmica" code={clear ? 'var valor = "Ana"; // String\n// valor = 10;     // não compila' : 'ClienteResumo cliente = buscarClienteResumo();\n// melhor que: var resultado = buscar();'} /><aside className="guided-note info"><Lightbulb size={20} /><div><strong>var não é um tipo</strong><p>É inferência de uma variável local. O compilador descobre o tipo uma vez e continua verificando todas as atribuições.</p></div></aside></section>;
}

const PLACES = [
  ['local', 'var nome = "Ana";', true],
  ['for', 'for (var i = 0; ...)', true],
  ['for-each', 'for (var nome : nomes)', true],
  ['recurso', 'try (var scanner = ...)', true],
  ['campo', 'class C { var nome; }', false],
  ['parâmetro', 'void usar(var valor)', false],
  ['retorno', 'public var buscar()', false],
  ['record', 'record C(var nome)', false],
  ['sem valor', 'var nome;', false],
  ['null', 'var valor = null;', false],
];
function ScopeLab() { const [selected, setSelected] = useState(0); const item = PLACES[selected]; return <section className="vr78-stack"><div className="vr78-scope">{PLACES.map((place, index) => <button type="button" key={place[0]} className={(selected === index ? 'active ' : '')+(place[2] ? 'allowed' : 'blocked')} onClick={() => setSelected(index)}><span>{place[2] ? <Check size={14} /> : '×'}</span><strong>{place[0]}</strong></button>)}</div><div className={'vr78-place '+(item[2] ? 'safe' : 'danger')}><small>{item[2] ? 'PERMITIDO' : 'NÃO COMPILA'}</small><code>{item[1]}</code><p>{item[2] ? 'Há contexto local e inicializador suficiente.' : 'var exige variável local com tipo inferível na declaração.'}</p></div></section>; }

const LITERALS = [
  ['10', 'int'], ['10L', 'long'], ['10.5', 'double'], ['10.5F', 'float'], ['true', 'boolean'], ['\'A\'', 'char'],
];
function TypesLab() {
  const [selected, setSelected] = useState(0); const item = LITERALS[selected];
  const code = ['var valor = ' + item[0] + '; // ' + item[1], 'var dinheiro = new BigDecimal("10.00");', 'var cliente = new ClienteResumo("Ana", "ana@email.com");', 'var status = StatusPedido.APROVADO;', 'var hoje = LocalDate.of(2026, 7, 7);', 'var agora = Instant.parse("2026-07-07T13:00:00Z");'].join('\n');
  return <section className="vr78-stack"><div className="vr78-literals">{LITERALS.map((literal, index) => <button type="button" key={literal[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><code>{literal[0]}</code><strong>{literal[1]}</strong></button>)}</div><CodePanel name="O lado direito determina o tipo real" code={code} /><p className="ln73-format-proof"><strong>var quantidade = 10</strong> produz int, não Integer. Sufixos e expressões continuam obedecendo todas as regras de tipos do Java.</p></section>;
}

const READABILITY = [
  ['new StringBuilder()', 'builder', 'var', 'construtor revela o tipo'],
  ['DateTimeFormatter.ofPattern(...)', 'formatador', 'var', 'fábrica e nome revelam a intenção'],
  ['buscar()', 'resultado', 'explícito', 'método e variável escondem tudo'],
  ['buscarClienteResumo()', 'clienteResumo', 'discutível', 'nomes ajudam, tipo pode reforçar'],
  ['calcularTotal(pedido)', 'total', 'explícito', 'BigDecimal pode ser relevante à regra'],
  ['StatusPedido.APROVADO', 'status', 'var', 'constante revela o enum'],
];
function ReadabilityLab() { const [selected, setSelected] = useState(0); const item = READABILITY[selected]; return <section className="vr78-stack"><div className="vr78-cases">{READABILITY.map((entry, index) => <button type="button" key={entry[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><code>{entry[0]}</code><small>{entry[1]}</small></button>)}</div><div className="vr78-verdict"><Eye size={31} /><div><small>DECISÃO DE LEITURA</small><strong>{item[2] === 'var' ? 'var melhora ou preserva clareza' : item[2] === 'explícito' ? 'tipo explícito devolve contexto' : 'decisão depende do escopo e padrão do time'}</strong><span>{item[3]}</span></div></div><p className="ln73-format-proof">Legibilidade vem antes de economia de caracteres. Quanto mais você usa <strong>var</strong>, melhores precisam ser os nomes e menor o escopo.</p></section>; }

function GenericsLab() {
  const [mode, setMode] = useState('interface');
  const cases = { interface: ['List<String> nomes = new ArrayList<>();', 'tipo da variável: List<String>', 'a abstração é parte do design'], concrete: ['var nomes = new ArrayList<String>();', 'tipo da variável: ArrayList<String>', 'bom se o concreto é deliberado'], diamond: ['var nomes = new ArrayList<>();', 'pode inferir ArrayList<Object>', 'sem alvo genérico, o contexto pode ser pobre'] }; const item = cases[mode];
  return <section className="vr78-stack"><div className="vr78-mode"><button type="button" className={mode === 'interface' ? 'active' : ''} onClick={() => setMode('interface')}>Interface explícita</button><button type="button" className={mode === 'concrete' ? 'active' : ''} onClick={() => setMode('concrete')}>var + tipo genérico</button><button type="button" className={mode === 'diamond' ? 'active danger' : ''} onClick={() => setMode('diamond')}>var + diamond</button></div><div className="vr78-generic"><code>{item[0]}</code><strong>{item[1]}</strong><span>{item[2]}</span></div><CodePanel name="Loops e recurso local" code={'for (var indice = 0; indice < 5; indice++) { }\nfor (var nome : nomes) { }\ntry (var scanner = new Scanner("Ana")) { }'} /><aside className="guided-note warning"><AlertTriangle size={20} /><div><strong>var não programa automaticamente para interface</strong><p>Se List é a abstração que o leitor deve enxergar, escreva <code>List&lt;String&gt;</code>.</p></div></aside></section>;
}

const REFACTORS = [
  ['var x = buscar();', 'ClienteResumo cliente = buscarClienteResumo();', 'tipo, nome e método ficaram claros'],
  ['BigDecimal total = new BigDecimal("10.00");', 'var total = new BigDecimal("10.00");', 'tipo continua visível no construtor'],
  ['var nomes = new ArrayList<>();', 'List<String> nomes = new ArrayList<>();', 'interface e elemento ficaram explícitos'],
  ['var resultado = processar();', 'PagamentoResumo pagamento = processarPagamento();', 'contrato importante reapareceu'],
];
function RefactorLab() { const [selected, setSelected] = useState(0); const item = REFACTORS[selected]; return <section className="vr78-stack"><div className="vr78-refactor-tabs">{REFACTORS.map((entry, index) => <button type="button" key={entry[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{index + 1}</button>)}</div><div className="vr78-refactor"><article><small>ANTES</small><code>{item[0]}</code></article><ArrowRight /><article className="safe"><small>DEPOIS</small><code>{item[1]}</code><span>{item[2]}</span></article></div></section>; }

const DOMAINS = [
  ['Cliente', 'var request = new CriarClienteRequest(...)', 'construtor e nome deixam o DTO claro'],
  ['Produto', 'var precoAjustado = produto.preco().setScale(...)', 'origem e nome preservam BigDecimal'],
  ['Pedido', 'BigDecimal total = calcularTotal(pedido)', 'tipo monetário pode merecer destaque'],
  ['Pagamento', 'var divisor = BigDecimal.valueOf(parcelas)', 'fábrica revela o tipo'],
  ['Ordem de serviço', 'var permiteReagendar = comparação de status', 'nome e expressão revelam boolean'],
  ['Mensageria', 'var builder = new StringBuilder()', 'uso clássico com tipo evidente'],
  ['Auditoria', 'var formatador = DateTimeFormatter.ofPattern(...)', 'API estática revela intenção'],
];
function DomainLab() { const [selected, setSelected] = useState(0); const item = DOMAINS[selected]; return <section className="ln73-domains"><div>{DOMAINS.map((domain, index) => <button type="button" key={domain[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{domain[0]}</strong></button>)}</div><article><small>VAR COM CRITÉRIO</small><h3>{item[0]}</h3><code>{item[1]}</code><p>{item[2]}.</p><div><strong>Teste do mentor</strong><span>Sem navegar para outro arquivo, um colega entende tipo, intenção e abstração?</span></div></article></section>; }

const ERRORS = [
  ['var é dynamic', 'Código tenta atribuir int depois de String.', 'O tipo inferido permanece fixo.'],
  ['Nome ruim', 'var x = buscar() esconde tipo e intenção.', 'Melhore variável, método e talvez explicite tipo.'],
  ['Tipo importante oculto', 'Regra monetária não mostra BigDecimal.', 'Escreva o tipo quando ele explica a regra.'],
  ['var com null', 'Compilador não tem tipo para inferir.', 'Use tipo explícito e questione o null.'],
  ['Sem inicialização', 'var nome; não fornece contexto.', 'Inicialize na declaração ou explicite tipo.'],
  ['var em campo', 'Inferência local foi usada na classe.', 'Declare o tipo do campo.'],
  ['var em parâmetro', 'Assinatura comum perde contrato.', 'Parâmetro deve ter tipo explícito.'],
  ['Generics sem pensar', 'var + diamond infere concreto/Object.', 'Declare elemento ou interface.'],
  ['var em todo lugar', 'Código curto exige mais navegação.', 'Escolha declaração por declaração.'],
  ['Economizar caracteres', 'A métrica virou quantidade de letras.', 'Otimize leitura, não digitação.'],
];
function ErrorsClinic() { const [selected, setSelected] = useState(0); const item = ERRORS[selected]; return <section className="ln73-errors vr78-errors"><div>{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article><header><AlertTriangle size={20} /><div><small>CASO {selected + 1} DE 10</small><h3>{item[0]}</h3></div></header><p><strong>Sintoma:</strong> {item[1]}</p><p><Wrench size={16} /><strong>Correção:</strong> {item[2]}</p></article></section>; }

const CHECKS = ['inferência manteve tipo fixo','locais loops e recursos foram permitidos','campos parâmetros retornos foram bloqueados','literais produziram tipos corretos','BigDecimal record enum e tempo ficaram claros','nomes compensaram o var','retorno ambíguo ganhou tipo explícito','List preservou abstração','diamond sem contexto foi evitado','sete domínios foram julgados'];
function DeliveryLab() { const [checked, setChecked] = useState([]); const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]); const commands = ['mkdir labs\\m2\\aula-078-var-com-criterio', 'cd labs\\m2\\aula-078-var-com-criterio', 'javac LaboratorioVar.java', 'java LaboratorioVar'].join('\n'); return <section className="ln73-delivery"><CodePanel name="LaboratorioVar.java" code={MAIN_PROGRAM} /><div className="ln73-terminal"><header><Terminal size={15} />Compilar e executar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS&gt; ')}{'\n\n'}<span>{EXPECTED_OUTPUT}</span></pre></div><section className="ln73-debug"><header><Play size={18} /><strong>Debug: var desaparece, o tipo real fica</strong></header><div><article><span>1</span><strong>Breakpoint</strong><p>Pare no cálculo total.</p></article><article><span>2</span><strong>valor</strong><p>BigDecimal 10.00.</p></article><article><span>3</span><strong>desconto</strong><p>BigDecimal 2.50.</p></article><article><span>4</span><strong>total</strong><p>BigDecimal 7.50, não “var”.</p></article></div></section><div className="ln73-checks">{CHECKS.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: revisão de legibilidade</h3></div><p>Crie um fluxo de pedido com dez variáveis locais e justifique, uma a uma, var ou tipo explícito.</p><ul><li>Inclua construtor óbvio, retorno ambíguo e BigDecimal.</li><li>Use for, for-each e try-with-resources.</li><li>Compare List explícita com ArrayList inferida.</li><li>Provoque null, sem inicialização e mudança de tipo em arquivos separados.</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>; }

function ContentBlock({ block }) { if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>; const map = { inference: InferenceLab, scope: ScopeLab, types: TypesLab, readability: ReadabilityLab, generics: GenericsLab, refactor: RefactorLab, domains: DomainLab, errors: ErrorsClinic, delivery: DeliveryLab }; const Component = map[block.type]; return Component ? <Component /> : null; }
const steps = [
  { id: 'inference', label: 'Inferência, não Dynamic', duration: '11 min', eyebrow: 'TIPO FIXO EM COMPILAÇÃO', title: 'Veja o compilador substituir var por um tipo real', blocks: [{ type: 'lead', text: 'var infere o tipo pelo inicializador local. A variável continua estaticamente tipada e rejeita valores incompatíveis.' }, { type: 'inference' }] },
  { id: 'scope', label: 'Onde var Existe', duration: '11 min', eyebrow: 'LOCAL COM INICIALIZADOR', title: 'Mapeie contextos permitidos e erros de compilação', blocks: [{ type: 'lead', text: 'Variável local, loops e try-with-resources aceitam var. Campo, retorno, parâmetro comum, componente de record, null e declaração vazia não.' }, { type: 'scope' }] },
  { id: 'types', label: 'Tipos Inferidos', duration: '11 min', eyebrow: 'LITERAIS E CONSTRUTORES', title: 'Leia primitivos e objetos no lado direito', blocks: [{ type: 'lead', text: 'Sufixos determinam primitivos. Construtores, enums e fábricas claras revelam BigDecimal, record, data e Instant.' }, { type: 'types' }] },
  { id: 'readability', label: 'Teste de Legibilidade', duration: '13 min', eyebrow: 'O LEITOR ENXERGA O TIPO?', title: 'Escolha var ou tipo explícito pelo contexto perdido', blocks: [{ type: 'lead', text: 'Construtor e constante tornam o tipo óbvio. Chamadas genéricas, nomes ruins e regras monetárias podem exigir tipo explícito.' }, { type: 'readability' }] },
  { id: 'generics', label: 'Loops e Generics', duration: '12 min', eyebrow: 'CONCRETO VERSUS INTERFACE', title: 'Não deixe var mudar a abstração sem perceber', blocks: [{ type: 'lead', text: 'var com ArrayList infere o concreto. var com diamond pode perder o tipo do elemento; List explícita pode ser parte do design.' }, { type: 'generics' }] },
  { id: 'refactor', label: 'Refatoração Crítica', duration: '10 min', eyebrow: 'NOMES, TIPO E ESCOPO', title: 'Melhore leitura em vez de contar caracteres', blocks: [{ type: 'lead', text: 'Às vezes a melhoria é var; às vezes é tipo explícito; frequentemente também exige nome de variável e método melhores.' }, { type: 'refactor' }] },
  { id: 'domains', label: 'Var no Backend', duration: '13 min', eyebrow: 'SETE DOMÍNIOS', title: 'Aplique o critério em código profissional', blocks: [{ type: 'lead', text: 'Cliente, produto, pedido, pagamento, OS, mensageria e auditoria mostram quando o tipo permanece evidente.' }, { type: 'domains' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'DEZ DIAGNÓSTICOS', title: 'Separe erro de compilação de erro de leitura', blocks: [{ type: 'lead', text: 'Dynamic, null, escopo, generics, nomes e uso excessivo exigem correções diferentes.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '27 min', eyebrow: 'CÓDIGO, DEBUG E GIT', title: 'Prove tipos inferidos e decisões legíveis', blocks: [{ type: 'lead', text: 'Compile, confira onze saídas, depure BigDecimal e entregue justificativas para var e tipos explícitos.' }, { type: 'delivery' }] },
];
export default function GuidedVarCriteriaLesson078({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) { const [activeIndex, setActiveIndex] = useState(0); const navRef = useRef(null); const completionNormalizedRef = useRef(false); const [completedSteps, setCompletedSteps] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); const validIds = new Set(steps.map(step => step.id)); return new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []); } catch { return new Set(); } }); useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps])), [completedSteps]); useEffect(() => { if (!completionNormalizedRef.current && isCompleted && completedSteps.size !== steps.length) { completionNormalizedRef.current = true; onToggleCompleted(); } }, [completedSteps.size, isCompleted, onToggleCompleted]); useEffect(() => { const button = navRef.current?.querySelector('button.active'); if (button && window.matchMedia('(max-width: 900px)').matches) button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }, [activeIndex]); const step = steps[activeIndex]; const stepDone = completedSteps.has(step.id); const allStepsDone = completedSteps.size === steps.length; const lessonComplete = isCompleted && allStepsDone; const selectStep = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }; const toggleStep = () => { if (stepDone && isCompleted) onToggleCompleted(); setCompletedSteps(current => { const next = new Set(current); if (next.has(step.id)) next.delete(step.id); else next.add(step.id); return next; }); }; return <article className="guided-git-lesson guided-var-criteria-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Eye size={17} />Oficina de legibilidade local</span><p className="guided-sequence">078 · M2.17</p><h1>Var com critério</h1><p>Use inferência quando o tipo já está visível e recupere o tipo explícito quando ele explica a regra.</p></div><div className="guided-hero-status"><Clock3 size={42} /><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 078" items={[{ value: '10 contextos', label: 'Permitidos ou bloqueados' }, { value: '7 domínios', label: 'Julgados pela clareza' }, { value: '10 falhas', label: 'Diagnosticadas pela causa' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 078"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item,index)=><button type="button" key={item.id} className={(index===activeIndex?'active ':'')+(completedSteps.has(item.id)?'done':'')} onClick={()=>selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id)?<Check size={14}/>:String(index+1).padStart(2,'0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block,index)=><ContentBlock key={block.type+'-'+index} block={block}/>)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex===0} onClick={()=>selectStep(activeIndex-1)}><ArrowLeft size={17}/>Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle '+(stepDone?'undo':'complete')} onClick={toggleStep}>{stepDone?<><RotateCcw size={16}/>Desmarcar etapa</>:<><CheckCircle2 size={16}/>Concluir etapa</>}</button>{activeIndex<steps.length-1&&<button type="button" className="primary" disabled={!stepDone} onClick={()=>selectStep(activeIndex+1)}>Próxima etapa<ArrowRight size={17}/></button>}</div></div>{allStepsDone&&<section className="guided-finish"><CheckCircle2 size={30}/><div><h3>Inferência com intenção</h3><p>{lessonComplete?'Aula concluída e pronta para Varargs.':'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete?'Reabrir aula':'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17}/>Aula 077</button><div className={'guided-course-status '+(lessonComplete?'completed':allStepsDone?'ready':'')}><Clock3 size={18}/><span><strong>{lessonComplete?'Aula concluída':completedSteps.size+' de '+steps.length+' etapas'}</strong><small>inferência, generics e legibilidade</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson||!lessonComplete}>Aula 079<ArrowRight size={17}/></button></footer></article>; }
