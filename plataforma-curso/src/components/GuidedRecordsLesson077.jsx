import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, ArrowLeft, ArrowRight, Braces, Check, CheckCircle2, Clock3, Copy, FileCode2, Layers3, Lightbulb, ListChecks, Play, RotateCcw, Sparkles, Terminal, Wrench } from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLocaleNumberFormatLesson.css';
import './guidedRecordsLesson.css';

const STORAGE_KEY = 'guided-records-lesson-077-progress';
const MAIN_PROGRAM = [
  'import java.math.BigDecimal;',
  'import java.time.Instant;',
  'import java.util.Arrays;',
  'import java.util.Objects;',
  '',
  'public class LaboratorioRecords {',
  '    interface Identificavel { Long id(); }',
  '    enum StatusPedido { PENDENTE, APROVADO, RECUSADO }',
  '',
  '    record ClienteResumo(Long id, String nome, String email)',
  '            implements Identificavel {',
  '        public ClienteResumo {',
  '            Objects.requireNonNull(id, "Id obrigatorio.");',
  '            if (nome == null || nome.isBlank())',
  '                throw new IllegalArgumentException("Nome obrigatorio.");',
  '            if (email == null || email.isBlank())',
  '                throw new IllegalArgumentException("Email obrigatorio.");',
  '            nome = nome.trim();',
  '            email = email.trim().toLowerCase();',
  '        }',
  '        public static ClienteResumo of(Long id, String nome, String email) {',
  '            return new ClienteResumo(id, nome, email);',
  '        }',
  '        public String dominioEmail() {',
  '            return email.substring(email.indexOf(\'@\') + 1);',
  '        }',
  '    }',
  '',
  '    record PedidoResumo(String cliente, StatusPedido status,',
  '                         BigDecimal subtotal, BigDecimal desconto,',
  '                         Instant criadoEm) {',
  '        public PedidoResumo {',
  '            Objects.requireNonNull(status, "Status obrigatorio.");',
  '            Objects.requireNonNull(subtotal, "Subtotal obrigatorio.");',
  '            Objects.requireNonNull(desconto, "Desconto obrigatorio.");',
  '            Objects.requireNonNull(criadoEm, "Criado em obrigatorio.");',
  '            cliente = cliente.trim();',
  '        }',
  '        public BigDecimal totalFinal() {',
  '            return subtotal.subtract(desconto);',
  '        }',
  '    }',
  '',
  '    record ClienteTags(String nome, String[] tags) { }',
  '',
  '    public static void main(String[] args) {',
  '        ClienteResumo cliente = ClienteResumo.of(',
  '                1L, " Ana ", " ANA@EMAIL.COM ");',
  '        System.out.println("nome: " + cliente.nome());',
  '        System.out.println("email: " + cliente.email());',
  '        System.out.println("dominio: " + cliente.dominioEmail());',
  '        System.out.println("id interface: " + cliente.id());',
  '        System.out.println("toString: " + cliente);',
  '',
  '        ClienteResumo igual = new ClienteResumo(',
  '                1L, "Ana", "ana@email.com");',
  '        ClienteResumo atualizado = new ClienteResumo(',
  '                cliente.id(), "Bruno", cliente.email());',
  '        System.out.println("equals: " + cliente.equals(igual));',
  '        System.out.println("hash igual: "',
  '                + (cliente.hashCode() == igual.hashCode()));',
  '        System.out.println("original: " + cliente.nome());',
  '        System.out.println("novo: " + atualizado.nome());',
  '',
  '        PedidoResumo pedido = new PedidoResumo("Ana",',
  '                StatusPedido.APROVADO, new BigDecimal("100.00"),',
  '                new BigDecimal("10.00"),',
  '                Instant.parse("2026-07-07T13:00:00Z"));',
  '        System.out.println("pedido status: " + pedido.status());',
  '        System.out.println("pedido total: " + pedido.totalFinal());',
  '        System.out.println("pedido instant: " + pedido.criadoEm());',
  '',
  '        String[] tags = {"novo", "vip"};',
  '        ClienteTags comTags = new ClienteTags("Ana", tags);',
  '        tags[0] = "alterado";',
  '        System.out.println("shallow: " + Arrays.toString(comTags.tags()));',
  '',
  '        try { new ClienteResumo(2L, " ", "x@email.com"); }',
  '        catch (IllegalArgumentException erro) {',
  '            System.out.println("validacao: " + erro.getMessage());',
  '        }',
  '    }',
  '}',
].join('\n');
const EXPECTED_OUTPUT = [
  'nome: Ana',
  'email: ana@email.com',
  'dominio: email.com',
  'id interface: 1',
  'toString: ClienteResumo[id=1, nome=Ana, email=ana@email.com]',
  'equals: true',
  'hash igual: true',
  'original: Ana',
  'novo: Bruno',
  'pedido status: APROVADO',
  'pedido total: 90.00',
  'pedido instant: 2026-07-07T13:00:00Z',
  'shallow: [alterado, vip]',
  'validacao: Nome obrigatorio.',
].join('\n');
const EVIDENCE = [
  '# Aula 077 — Records', '',
  '- [ ] Reduzi classe de dados sem esconder seu contrato',
  '- [ ] Usei acessores nome() e email(), sem getters JavaBean',
  '- [ ] Provei toString, equals e hashCode gerados',
  '- [ ] Criei novo record em vez de usar setter',
  '- [ ] Diferenciei construtor canônico de compacto',
  '- [ ] Validei e normalizei no construtor compacto',
  '- [ ] Combinei record com BigDecimal, enum e Instant',
  '- [ ] Criei método pequeno, fábrica estática e interface',
  '- [ ] Demonstrei imutabilidade superficial',
  '- [ ] Diferenciei DTO de entidade com ciclo de vida',
  '- [ ] Apliquei records em sete domínios',
  '- [ ] Compilei, depurei e revisei o diff',
].join('\n');

function CopyButton({ value, label = 'Copiar' }) { const [copied, setCopied] = useState(false); const copy = async () => { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); }; return <button type="button" className="ln73-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>; }
function CodePanel({ name, code, language = 'java' }) { return <section className="guided-file ln73-code"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language === 'java'} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>; }

function BoilerplateLab() {
  const [recordMode, setRecordMode] = useState(true);
  const classic = ['class PedidoResumo {', '  private final String cliente;', '  private final String status;', '  private final BigDecimal total;', '  // construtor + 3 getters', '  // equals + hashCode + toString', '}'].join('\n');
  const record = ['public record PedidoResumo(', '    String cliente,', '    String status,', '    BigDecimal total', ') { }'].join('\n');
  return <section className="rc77-stack"><div className="rc77-mode"><button type="button" className={!recordMode ? 'active' : ''} onClick={() => setRecordMode(false)}>Classe tradicional</button><button type="button" className={recordMode ? 'active' : ''} onClick={() => setRecordMode(true)}>Record</button></div><div className="rc77-meter"><span style={{ width: recordMode ? '28%' : '100%' }} /><strong>{recordMode ? '5 linhas essenciais' : 'campos + construtor + métodos repetitivos'}</strong></div><CodePanel name={recordMode ? 'PedidoResumo.java' : 'PedidoResumo.java · boilerplate conceitual'} code={recordMode ? record : classic} /><div className="rc77-generated">{['campos private final','construtor canônico','acessores cliente()','equals e hashCode','toString'].map(item => <span key={item}><Check size={14} />{item}</span>)}</div><aside className="guided-note info"><Lightbulb size={20} /><div><strong>Record comunica intenção</strong><p>Ele representa dados simples e transparentes. Menos linhas é consequência, não o único critério.</p></div></aside></section>;
}

function ContractLab() {
  const [name, setName] = useState('Ana'); const original = { nome: 'Ana', email: 'ana@email.com' }; const same = name === 'Ana';
  const code = ['ClienteResumo primeiro = new ClienteResumo("Ana", "ana@email.com");', 'ClienteResumo segundo = new ClienteResumo("' + name + '", "ana@email.com");', '', 'primeiro.nome();       // não existe getNome()', 'primeiro.equals(segundo);', 'primeiro.hashCode();', 'primeiro.toString();'].join('\n');
  return <section className="rc77-stack"><div className="rc77-contract"><article><small>ORIGINAL</small><strong>{original.nome}</strong><span>{original.email}</span></article><ArrowRight /><article><small>NOVO OBJETO</small><select value={name} onChange={event => setName(event.target.value)}><option>Ana</option><option>Bruno</option></select><span>original continua Ana</span></article><article className={same ? 'safe' : 'different'}><small>COMPARAÇÃO ESTRUTURAL</small><strong>equals = {String(same)}</strong><span>todos os componentes participam</span></article></div><CodePanel name="Acessores e métodos gerados" code={code} /><p className="ln73-format-proof">Record não gera <strong>getNome()</strong> nem setter. Para “alterar”, construa outro valor usando os componentes preservados.</p></section>;
}

const INPUT_CASES = [
  [' Ana ', ' ANA@EMAIL.COM '],
  ['Ana', 'ana@email.com'],
  ['', 'ana@email.com'],
  ['Bruno', ''],
];
function ConstructorLab() {
  const [selected, setSelected] = useState(0); const input = INPUT_CASES[selected]; const valid = Boolean(input[0].trim() && input[1].trim());
  const compact = ['record ClienteResumo(String nome, String email) {', '    public ClienteResumo {', '        if (nome == null || nome.isBlank())', '            throw new IllegalArgumentException("Nome obrigatório.");', '        if (email == null || email.isBlank())', '            throw new IllegalArgumentException("E-mail obrigatório.");', '        nome = nome.trim();', '        email = email.trim().toLowerCase();', '    }', '}'].join('\n');
  return <section className="rc77-stack"><div className="ln73-parse-cases">{INPUT_CASES.map((item, index) => <button type="button" key={index} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{item[0] || '(nome vazio)'}</button>)}</div><div className="ln73-parse-flow"><article><small>ENTRADA</small><strong>{input[0] || '""'} · {input[1] || '""'}</strong></article><ArrowRight /><article><small>CONSTRUTOR COMPACTO</small><code>validar → trim → lowerCase</code></article><ArrowRight /><article className={valid ? 'safe' : 'danger'}><small>RECORD FINAL</small><strong>{valid ? input[0].trim() + ' · ' + input[1].trim().toLowerCase() : 'IllegalArgumentException'}</strong></article></div><CodePanel name="Validação e normalização compactas" code={compact} /><aside className="guided-note warning"><AlertTriangle size={20} /><div><strong>Canônico versus compacto</strong><p>No canônico explícito, atribua <code>this.nome</code>. No compacto, não há parâmetros declarados: ajuste <code>nome</code> e o Java atribui ao final. <code>Objects.requireNonNull</code> ajuda com null.</p></div></aside></section>;
}

const COMPOSITIONS = [
  ['BigDecimal', 'preço e total monetário', 'tipo imutável combina bem com record'],
  ['enum', 'status controlado', 'o componente preserva segurança do domínio'],
  ['Instant', 'timestamp global', 'DTO de evento ou auditoria fica determinístico'],
  ['método', 'totalFinal()', 'cálculo pequeno derivado dos componentes'],
  ['static of', 'fábrica simples', 'construção nomeada sem esconder validação'],
  ['interface', 'Identificavel.id()', 'record implementa interface, mas não estende classe'],
];
function CompositionLab() {
  const [selected, setSelected] = useState(0); const item = COMPOSITIONS[selected];
  const code = ['record PedidoResumo(', '    String cliente,', '    StatusPedido status,', '    BigDecimal subtotal,', '    BigDecimal desconto,', '    Instant criadoEm', ') {', '    BigDecimal totalFinal() {', '        return subtotal.subtract(desconto);', '    }', '}'].join('\n');
  return <section className="rc77-stack"><div className="rc77-compositions">{COMPOSITIONS.map((entry, index) => <button type="button" key={entry[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><strong>{entry[0]}</strong><small>{entry[1]}</small></button>)}</div><div className="ln73-showroom"><article><small>RECURSO</small><strong>{item[0]}</strong><span>{item[1]}</span></article><ArrowRight /><article className="active"><small>LEITURA CRÍTICA</small><strong>{item[2]}</strong><span>métodos devem permanecer coesos e pequenos</span></article></div><CodePanel name="Record composto por tipos profissionais" code={code} /></section>;
}

function ShallowLab() {
  const [mutated, setMutated] = useState(false); const tags = mutated ? ['alterado', 'vip'] : ['novo', 'vip'];
  const code = ['String[] tags = {"novo", "vip"};', 'ClienteTags cliente = new ClienteTags("Ana", tags);', 'tags[0] = "alterado";', 'System.out.println(Arrays.toString(cliente.tags()));', '// [alterado, vip]'].join('\n');
  return <section className="rc77-stack"><div className="rc77-alias"><article><small>ARRAY EXTERNO</small><strong>[{tags.join(', ')}]</strong><button type="button" onClick={() => setMutated(value => !value)}>{mutated ? 'Restaurar conteúdo' : 'Alterar tags[0]'}</button></article><div><span>mesma referência</span><ArrowRight /></div><article className="record"><small>COMPONENTE DO RECORD</small><strong>[{tags.join(', ')}]</strong><span>campo final; conteúdo ainda mutável</span></article></div><CodePanel name="Imutabilidade superficial" code={code} /><aside className="guided-note warning"><AlertTriangle size={20} /><div><strong>final protege a referência, não o objeto apontado</strong><p>Array e coleções mutáveis podem mudar por fora. Record não cria cópia defensiva automaticamente.</p></div></aside></section>;
}

const DECISIONS = [
  ['CriarClienteRequest', 'dados de entrada simples', 'record'],
  ['ClienteResponse', 'projeção de saída', 'record'],
  ['PedidoCriadoEvent', 'mensagem imutável', 'record'],
  ['ResultadoCalculo', 'valor derivado sem ciclo de vida', 'record'],
  ['Pedido', 'aprovar, cancelar e mudar status', 'classe'],
  ['Entidade JPA tradicional', 'identidade, proxies e persistência', 'classe'],
];
function DecisionLab() {
  const [selected, setSelected] = useState(0); const item = DECISIONS[selected];
  return <section className="rc77-stack"><div className="rc77-decision">{DECISIONS.map((entry, index) => <button type="button" key={entry[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><strong>{entry[0]}</strong><small>{entry[1]}</small></button>)}</div><div className={'rc77-verdict '+item[2]}><Layers3 size={32} /><div><small>ESCOLHA MAIS NATURAL</small><strong>{item[2] === 'record' ? 'record: pacote transparente de dados' : 'classe: objeto com ciclo de vida'}</strong><span>{item[1]}</span></div></div><p className="ln73-format-proof">DTO é um papel de transferência. Record é uma ferramenta adequada para muitos DTOs, mas não transforma automaticamente qualquer modelo em bom domínio.</p></section>;
}

const DOMAINS = [
  ['Cliente', 'request → response', 'normaliza entrada e projeta id, nome e email'],
  ['Produto', 'nome + BigDecimal + enum', 'valida preço e status; arredonda na fronteira'],
  ['Pedido', 'subtotal − desconto', 'método derivado simples sem mutar o resumo'],
  ['Pagamento', 'valor ÷ parcelas', 'BigDecimal, enum e Instant num payload estável'],
  ['Ordem de serviço', 'data + hora + status', 'resumo informa reagendamento sem virar entidade'],
  ['Mensageria', 'tipo + certificado + Instant', 'evento imutável com comportamento pequeno'],
  ['Auditoria', 'operação + entidade + id', 'linha simples derivada de dados globais'],
];
function DomainLab() { const [selected, setSelected] = useState(0); const item = DOMAINS[selected]; return <section className="ln73-domains"><div>{DOMAINS.map((domain, index) => <button type="button" key={domain[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{domain[0]}</strong></button>)}</div><article><small>RECORD NO BACKEND</small><h3>{item[0]}</h3><code>{item[1]}</code><p>{item[2]}.</p><div><strong>Pergunta do mentor</strong><span>Este objeto transporta um retrato de dados ou precisa controlar mudanças de estado ao longo do tempo?</span></div></article></section>; }

const ERRORS = [
  ['Esperar getNome', 'A chamada não compila porque o acessor é nome().', 'Use o nome exato do componente.'],
  ['Procurar setter', 'Record não oferece mutação de componentes.', 'Crie outro record com o novo valor.'],
  ['Ignorar validação', 'null e vazio entram normalmente.', 'Valide no construtor compacto.'],
  ['Entidade mutável como record', 'Aprovar e cancelar viram recriação artificial.', 'Use classe para ciclo de vida rico.'],
  ['Imutabilidade profunda', 'Array interno muda por uma referência externa.', 'Use componentes imutáveis ou cópia defensiva.'],
  ['Regra enorme no record', 'DTO passa a orquestrar serviço e persistência.', 'Mantenha apenas comportamento coeso.'],
  ['Usar por moda', 'Tipo curto esconde uma escolha inadequada.', 'Avalie papel, mutabilidade e identidade.'],
  ['equals parcial esperado', 'Todos os componentes entram na comparação.', 'Modele componentes conforme identidade estrutural.'],
  ['Array sem cuidado', 'equals de array também é por referência.', 'Prefira estrutura imutável e estratégia explícita.'],
  ['DTO como domínio rico', 'Transporte de dados não protege ciclo de vida.', 'Separe DTO de entidade quando necessário.'],
];
function ErrorsClinic() { const [selected, setSelected] = useState(0); const item = ERRORS[selected]; return <section className="ln73-errors rc77-errors"><div>{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article><header><AlertTriangle size={20} /><div><small>CASO {selected + 1} DE 10</small><h3>{item[0]}</h3></div></header><p><strong>Sintoma:</strong> {item[1]}</p><p><Wrench size={16} /><strong>Correção:</strong> {item[2]}</p></article></section>; }

const CHECKS = ['record substituiu boilerplate adequado','acessores não usaram get','equals e hashCode foram provados','novo objeto preservou o original','compact constructor normalizou','Objects.requireNonNull foi contextualizado','BigDecimal enum e Instant compuseram DTO','método interface e fábrica foram limitados','array provou imutabilidade superficial','sete domínios foram justificados'];
function DeliveryLab() {
  const [checked, setChecked] = useState([]); const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  const commands = ['mkdir labs\\m2\\aula-077-records', 'cd labs\\m2\\aula-077-records', 'javac LaboratorioRecords.java', 'java LaboratorioRecords'].join('\n');
  return <section className="ln73-delivery"><CodePanel name="LaboratorioRecords.java" code={MAIN_PROGRAM} /><div className="ln73-terminal"><header><Terminal size={15} />Compilar e executar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS&gt; ')}{'\n\n'}<span>{EXPECTED_OUTPUT}</span></pre></div><section className="ln73-debug"><header><Play size={18} /><strong>Debug: construtor compacto em quatro momentos</strong></header><div><article><span>1</span><strong>Breakpoint</strong><p>Pare em public ClienteResumo.</p></article><article><span>2</span><strong>Entrada</strong><p>nome tem espaços; email está maiúsculo.</p></article><article><span>3</span><strong>Normalização</strong><p>Observe trim e lowerCase nas variáveis.</p></article><article><span>4</span><strong>Record final</strong><p>Acessores e toString mostram valores limpos.</p></article></div></section><div className="ln73-checks">{CHECKS.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: contrato completo de um pedido</h3></div><p>Crie request, response e event como records; mantenha a entidade Pedido como classe com transição de estado.</p><ul><li>Normalize request no construtor compacto.</li><li>Use BigDecimal, StatusPedido e Instant.</li><li>Prove equals/toString e um erro de validação.</li><li>Demonstre por que um array quebra imutabilidade profunda.</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

function ContentBlock({ block }) { if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>; const map = { boilerplate: BoilerplateLab, contract: ContractLab, constructor: ConstructorLab, composition: CompositionLab, shallow: ShallowLab, decision: DecisionLab, domains: DomainLab, errors: ErrorsClinic, delivery: DeliveryLab }; const Component = map[block.type]; return Component ? <Component /> : null; }
const steps = [
  { id: 'boilerplate', label: 'Classe versus Record', duration: '11 min', eyebrow: 'DADOS SEM BOILERPLATE', title: 'Reduza código quando a intenção é transportar dados', blocks: [{ type: 'lead', text: 'Record declara componentes e gera campos finais, construtor, acessores, equals, hashCode e toString. Ele não é uma classe mágica para tudo.' }, { type: 'boilerplate' }] },
  { id: 'contract', label: 'Contrato Gerado', duration: '12 min', eyebrow: 'ACESSORES E VALOR ESTRUTURAL', title: 'Leia componentes diretamente e crie um novo valor', blocks: [{ type: 'lead', text: 'O acessor é nome(), não getNome(). Não há setter; equals e hashCode usam todos os componentes.' }, { type: 'contract' }] },
  { id: 'constructor', label: 'Construtores e Validação', duration: '14 min', eyebrow: 'CANÔNICO OU COMPACTO', title: 'Valide e normalize antes da atribuição automática', blocks: [{ type: 'lead', text: 'O construtor canônico explicita todos os parâmetros e atribuições. O compacto remove repetição e permite validar as variáveis dos componentes.' }, { type: 'constructor' }] },
  { id: 'composition', label: 'Tipos e Métodos', duration: '12 min', eyebrow: 'BIGDECIMAL, ENUM E INSTANT', title: 'Componha dados profissionais sem inflar o record', blocks: [{ type: 'lead', text: 'Records aceitam qualquer tipo, métodos pequenos, fábricas e interfaces. Eles não podem estender outra classe.' }, { type: 'composition' }] },
  { id: 'shallow', label: 'Imutabilidade Superficial', duration: '11 min', eyebrow: 'FINAL NÃO É CÓPIA PROFUNDA', title: 'Siga a referência mutável até dentro do record', blocks: [{ type: 'lead', text: 'O campo do componente é final, mas array ou coleção apontada ainda pode mudar. Record não produz cópia defensiva.' }, { type: 'shallow' }] },
  { id: 'decision', label: 'DTO ou Entidade', duration: '12 min', eyebrow: 'ESCOLHA COM CRITÉRIO', title: 'Separe retrato de dados de objeto com ciclo de vida', blocks: [{ type: 'lead', text: 'Request, response, evento e resultado combinam com record. Entidade mutável com aprovar/cancelar costuma pedir classe.' }, { type: 'decision' }] },
  { id: 'domains', label: 'Records no Backend', duration: '14 min', eyebrow: 'SETE DOMÍNIOS', title: 'Modele projeções, eventos e resultados imutáveis', blocks: [{ type: 'lead', text: 'Cliente, produto, pedido, pagamento, OS, mensageria e auditoria combinam tipos já estudados em records úteis.' }, { type: 'domains' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'DEZ DIAGNÓSTICOS', title: 'Encontre a suposição errada sobre records', blocks: [{ type: 'lead', text: 'Getter, setter, null, entidade, arrays, equals e domínio rico falham por razões diferentes.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '28 min', eyebrow: 'CÓDIGO, DEBUG E GIT', title: 'Prove valor estrutural, validação e limite de uso', blocks: [{ type: 'lead', text: 'Compile o laboratório, confira quatorze saídas, depure o construtor compacto e entregue DTOs sem transformar entidade em record.' }, { type: 'delivery' }] },
];
export default function GuidedRecordsLesson077({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0); const navRef = useRef(null); const completionNormalizedRef = useRef(false);
  const [completedSteps, setCompletedSteps] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); const validIds = new Set(steps.map(step => step.id)); return new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []); } catch { return new Set(); } });
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps])), [completedSteps]);
  useEffect(() => { if (!completionNormalizedRef.current && isCompleted && completedSteps.size !== steps.length) { completionNormalizedRef.current = true; onToggleCompleted(); } }, [completedSteps.size, isCompleted, onToggleCompleted]);
  useEffect(() => { const button = navRef.current?.querySelector('button.active'); if (button && window.matchMedia('(max-width: 900px)').matches) button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }, [activeIndex]);
  const step = steps[activeIndex]; const stepDone = completedSteps.has(step.id); const allStepsDone = completedSteps.size === steps.length; const lessonComplete = isCompleted && allStepsDone;
  const selectStep = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const toggleStep = () => { if (stepDone && isCompleted) onToggleCompleted(); setCompletedSteps(current => { const next = new Set(current); if (next.has(step.id)) next.delete(step.id); else next.add(step.id); return next; }); };
  return <article className="guided-git-lesson guided-records-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Braces size={17} />Laboratório de classes de dados</span><p className="guided-sequence">077 · M2.16</p><h1>Records</h1><p>Represente dados simples com menos repetição, valide no construtor compacto e escolha com senso crítico.</p></div><div className="guided-hero-status"><Clock3 size={42} /><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 077" items={[{ value: '6 membros', label: 'Gerados pelo record' }, { value: '7 domínios', label: 'Com DTOs responsáveis' }, { value: '10 falhas', label: 'Diagnosticadas pela causa' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 077"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item,index)=><button type="button" key={item.id} className={(index===activeIndex?'active ':'')+(completedSteps.has(item.id)?'done':'')} onClick={()=>selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id)?<Check size={14}/>:String(index+1).padStart(2,'0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block,index)=><ContentBlock key={block.type+'-'+index} block={block}/>)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex===0} onClick={()=>selectStep(activeIndex-1)}><ArrowLeft size={17}/>Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle '+(stepDone?'undo':'complete')} onClick={toggleStep}>{stepDone?<><RotateCcw size={16}/>Desmarcar etapa</>:<><CheckCircle2 size={16}/>Concluir etapa</>}</button>{activeIndex<steps.length-1&&<button type="button" className="primary" disabled={!stepDone} onClick={()=>selectStep(activeIndex+1)}>Próxima etapa<ArrowRight size={17}/></button>}</div></div>{allStepsDone&&<section className="guided-finish"><CheckCircle2 size={30}/><div><h3>Dados simples, contrato explícito</h3><p>{lessonComplete?'Aula concluída e pronta para var com critério.':'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete?'Reabrir aula':'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17}/>Aula 076</button><div className={'guided-course-status '+(lessonComplete?'completed':allStepsDone?'ready':'')}><Clock3 size={18}/><span><strong>{lessonComplete?'Aula concluída':completedSteps.size+' de '+steps.length+' etapas'}</strong><small>componentes, validação e DTOs</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson||!lessonComplete}>Aula 078<ArrowRight size={17}/></button></footer></article>;
}
