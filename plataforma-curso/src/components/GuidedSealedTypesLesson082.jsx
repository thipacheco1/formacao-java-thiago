import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, ArrowLeft, ArrowRight, Braces, Check, CheckCircle2, Clock3, Copy, FileCode2, GitBranch, Lightbulb, ListChecks, LockKeyhole, Play, RotateCcw, ShieldCheck, Sparkles, Terminal, Unlock, Wrench, XCircle } from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLocaleNumberFormatLesson.css';
import './guidedSealedTypesLesson.css';

const STORAGE_KEY = 'guided-sealed-types-lesson-082-progress';
const MAIN_PROGRAM = [
  'public class LaboratorioSealed {',
  '    public static void main(String[] args) {',
  '        Pagamento[] pagamentos = {',
  '            new PagamentoPix("chave-pix"),',
  '            new PagamentoCartao("1234", 3),',
  '            new PagamentoBoleto("34191")',
  '        };',
  '        for (Pagamento pagamento : pagamentos) {',
  '            System.out.println(descrever(pagamento));',
  '        }',
  '',
  '        System.out.println(descreverResultado(criarCliente("Ana")));',
  '        System.out.println(descreverResultado(criarCliente(" ")));',
  '',
  '        Notificacao notificacao = new NotificacaoEmail();',
  '        System.out.println("non-sealed: "',
  '                + notificacao.getClass().getSimpleName());',
  '',
  '        Evento evento = new PedidoCriado("PED-001");',
  '        System.out.println("dois niveis: "',
  '                + evento.getClass().getSimpleName());',
  '        System.out.println("enum: " + StatusPagamento.CONFIRMADO);',
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
  '        throw new IllegalStateException("Subtipo nao tratado");',
  '    }',
  '',
  '    static Resultado criarCliente(String nome) {',
  '        if (nome == null || nome.isBlank()) {',
  '            return new Erro("NOME_OBRIGATORIO", "Nome obrigatorio.");',
  '        }',
  '        return new Sucesso("Cliente " + nome + " criado.");',
  '    }',
  '',
  '    static String descreverResultado(Resultado resultado) {',
  '        if (resultado instanceof Sucesso sucesso) {',
  '            return "sucesso: " + sucesso.mensagem();',
  '        }',
  '        if (resultado instanceof Erro erro) {',
  '            return "erro: " + erro.codigo() + " - " + erro.mensagem();',
  '        }',
  '        throw new IllegalStateException("Resultado nao tratado");',
  '    }',
  '}',
  '',
  'sealed interface Pagamento',
  '        permits PagamentoPix, PagamentoCartao, PagamentoBoleto { }',
  'record PagamentoPix(String chave) implements Pagamento { }',
  'record PagamentoCartao(String finalCartao, int parcelas)',
  '        implements Pagamento { }',
  'record PagamentoBoleto(String codigoBarras) implements Pagamento { }',
  '',
  'sealed interface Resultado permits Sucesso, Erro { }',
  'record Sucesso(String mensagem) implements Resultado { }',
  'record Erro(String codigo, String mensagem) implements Resultado { }',
  '',
  'sealed interface Notificacao',
  '        permits NotificacaoInterna, NotificacaoExterna { }',
  'final class NotificacaoInterna implements Notificacao { }',
  'non-sealed class NotificacaoExterna implements Notificacao { }',
  'final class NotificacaoEmail extends NotificacaoExterna { }',
  '',
  'sealed interface Evento permits EventoPedido { }',
  'sealed abstract class EventoPedido implements Evento',
  '        permits PedidoCriado, PedidoCancelado { }',
  'final class PedidoCriado extends EventoPedido {',
  '    private final String codigo;',
  '    PedidoCriado(String codigo) { this.codigo = codigo; }',
  '    String codigo() { return codigo; }',
  '}',
  'final class PedidoCancelado extends EventoPedido { }',
  '',
  'enum StatusPagamento { PENDENTE, CONFIRMADO, RECUSADO }',
].join('\n');

const EXPECTED_OUTPUT = [
  'PIX: chave-pix',
  'Cartao: 1234 em 3x',
  'Boleto: 34191',
  'sucesso: Cliente Ana criado.',
  'erro: NOME_OBRIGATORIO - Nome obrigatorio.',
  'non-sealed: NotificacaoEmail',
  'dois niveis: PedidoCriado',
  'enum: CONFIRMADO',
].join('\n');

const EVIDENCE = [
  '# Aula 082 — Sealed classes e interfaces', '',
  '- [ ] Confirmei Java 17 ou superior',
  '- [ ] Diferenciei hierarquia aberta, final e sealed',
  '- [ ] Declarei permits com todos os subtipos diretos',
  '- [ ] Provoquei o erro de subtipo não permitido',
  '- [ ] Usei final, sealed e non-sealed conscientemente',
  '- [ ] Modelei dois níveis controlados',
  '- [ ] Combinei sealed interface com records',
  '- [ ] Modelei Resultado com Sucesso e Erro',
  '- [ ] Diferenciei enum de sealed',
  '- [ ] Refatorei campos opcionais para tipos válidos',
  '- [ ] Apliquei o recurso em sete domínios',
  '- [ ] Compilei, depurei e revisei o diff',
].join('\n');

function CopyButton({ value, label = 'Copiar' }) { const [copied, setCopied] = useState(false); const copy = async () => { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); }; return <button type="button" className="ln73-copy" onClick={copy}>{copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? 'Copiado' : label}</button>; }
function CodePanel({ name, code, language = 'java' }) { return <section className="guided-file ln73-code"><div className="guided-file-title"><FileCode2 size={16}/>{name}<CopyButton value={code}/></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language === 'java'} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>; }

function BoundaryLab() { const [sealed, setSealed] = useState(true); return <section className="sl82-stack"><div className="sl82-mode"><button type="button" className={!sealed ? 'active open' : ''} onClick={() => setSealed(false)}><Unlock size={17}/>Interface aberta</button><button type="button" className={sealed ? 'active sealed' : ''} onClick={() => setSealed(true)}><LockKeyhole size={17}/>Interface sealed</button></div><div className="sl82-boundary"><article><small>CONTRATO</small><strong>{sealed ? 'sealed interface Pagamento' : 'interface Pagamento'}</strong><span>{sealed ? 'permits Pix, Cartao, Boleto' : 'qualquer implementação compatível'}</span></article><ArrowRight/><div>{['PagamentoPix', 'PagamentoCartao', 'PagamentoBoleto', 'PagamentoCripto'].map((type, index) => { const allowed = !sealed || index < 3; return <span key={type} className={allowed ? 'allowed' : 'denied'}>{allowed ? <Check size={14}/> : <XCircle size={14}/>} {type}</span>; })}</div></div><div className={'sl82-verdict ' + (sealed ? 'controlled' : 'open')}><strong>{sealed ? 'O compilador conhece a fronteira da hierarquia' : 'Extensão é parte do contrato público'}</strong><span>{sealed ? 'PagamentoCripto falha porque não está em permits.' : 'Plugins e terceiros podem implementar sem alterar o tipo original.'}</span></div><aside className="guided-note info"><Lightbulb size={20}/><div><strong>Sealed ocupa o meio do caminho</strong><p>Não deixa tudo aberto e não bloqueia tudo como final: permite extensão apenas para subtipos conhecidos.</p></div></aside></section>; }

const CANDIDATES = ['PagamentoPix', 'PagamentoCartao', 'PagamentoBoleto', 'PagamentoCripto'];
function PermitsLab() { const [candidate, setCandidate] = useState('PagamentoPix'); const [inPermits, setInPermits] = useState(true); const allowed = candidate !== 'PagamentoCripto' && inPermits; return <section className="sl82-stack"><div className="sl82-compiler"><label>Subtipo<select value={candidate} onChange={event => { setCandidate(event.target.value); setInPermits(event.target.value !== 'PagamentoCripto'); }}>{CANDIDATES.map(item => <option key={item}>{item}</option>)}</select></label><label><input type="checkbox" checked={inPermits} onChange={event => setInPermits(event.target.checked)}/> listado em permits</label><article className={allowed ? 'success' : 'error'}>{allowed ? <ShieldCheck size={25}/> : <XCircle size={25}/>}<div><small>JAVAC</small><strong>{allowed ? 'subtipo direto aceito' : 'class is not allowed to extend sealed class'}</strong></div></article></div><CodePanel name="Contrato explícito e erro proposital" code={'sealed interface Pagamento\n        permits PagamentoPix, PagamentoCartao, PagamentoBoleto { }\n\nrecord PagamentoPix(String chave) implements Pagamento { }\nrecord PagamentoCartao(String finalCartao) implements Pagamento { }\nrecord PagamentoBoleto(String codigoBarras) implements Pagamento { }\n\n// Não compila: não aparece em permits\nrecord PagamentoCripto(String carteira) implements Pagamento { }'}/><div className="sl82-version"><Terminal size={18}/><div><strong>Verifique antes de compilar</strong><code>java -version</code><code>javac -version</code><span>Java 17 ou superior</span></div></div><p className="ln73-format-proof">Neste curso, <strong>permits fica explícito</strong>. Há situações em que o compilador pode inferir, mas a lista visível ensina e documenta melhor.</p></section>; }

const CONTINUATIONS = [
  ['final', 'Encerra', 'ninguém estende este subtipo', 'PedidoCriado'],
  ['sealed', 'Controla outro nível', 'nova lista permits continua a árvore', 'EventoPedido'],
  ['non-sealed', 'Reabre', 'qualquer classe pode estender dali em diante', 'NotificacaoExterna'],
];
function ContinuationLab() { const [selected, setSelected] = useState(0); const item = CONTINUATIONS[selected]; return <section className="sl82-stack"><div className="sl82-continuations">{CONTINUATIONS.map((entry, index) => <button type="button" key={entry[0]} className={selected === index ? 'active ' + entry[0] : ''} onClick={() => setSelected(index)}><code>{entry[0]}</code><strong>{entry[1]}</strong><small>{entry[2]}</small></button>)}</div><div className="sl82-tree"><div className="root"><GitBranch size={20}/><strong>sealed Evento</strong></div><ArrowRight/><div className={'branch ' + item[0]}><code>{item[0]}</code><strong>{item[3]}</strong><span>{item[2]}</span></div>{selected === 1 && <><ArrowRight/><div className="leaves"><span>final PedidoCriado</span><span>final PedidoCancelado</span></div></>}{selected === 2 && <><ArrowRight/><div className="leaves open"><span>NotificacaoEmail</span><span>qualquer novo subtipo</span></div></>}</div><CodePanel name="As três decisões obrigatórias" code={'sealed interface Notificacao\n        permits NotificacaoInterna, NotificacaoExterna { }\n\nfinal class NotificacaoInterna implements Notificacao { }\n\nnon-sealed class NotificacaoExterna implements Notificacao { }\nclass NotificacaoEmail extends NotificacaoExterna { }\n\nsealed interface Evento permits EventoPedido { }\nsealed class EventoPedido implements Evento\n        permits PedidoCriado, PedidoCancelado { }'}/><aside className="guided-note warning"><AlertTriangle size={20}/><div><strong>non-sealed não é só mais um modificador</strong><p>Ele remove o controle a partir daquele ramo. Use apenas quando essa abertura fizer parte do desenho.</p></div></aside></section>; }

function ShapeLab() { const [shape, setShape] = useState('interface'); const isInterface = shape === 'interface'; return <section className="sl82-stack"><div className="sl82-shape"><button type="button" className={isInterface ? 'active' : ''} onClick={() => setShape('interface')}>sealed interface</button><button type="button" className={!isInterface ? 'active' : ''} onClick={() => setShape('class')}>sealed abstract class</button></div><div className="sl82-shape-map"><article><small>{isInterface ? 'CONTRATO' : 'BASE ABSTRATA'}</small><strong>{isInterface ? 'Pagamento' : 'Evento'}</strong><span>{isInterface ? 'records implementam e carregam dados próprios' : 'subclasses herdam estado/comportamento comum'}</span></article><ArrowRight/><div>{isInterface ? <><span>record Pix</span><span>record Cartao</span><span>record Boleto</span></> : <><span>final PedidoCriado</span><span>final PedidoCancelado</span></>}</div></div><CodePanel name={isInterface ? 'Sealed interface com records' : 'Sealed class abstrata'} code={isInterface ? 'sealed interface Resultado permits Sucesso, Erro { }\n\nrecord Sucesso(String mensagem) implements Resultado { }\nrecord Erro(String codigo, String mensagem)\n        implements Resultado { }' : 'sealed abstract class Evento\n        permits EventoPedidoCriado, EventoPedidoCancelado {\n    public abstract String descricao();\n}\n\nfinal class EventoPedidoCriado extends Evento {\n    @Override\n    public String descricao() { return "Pedido criado"; }\n}'}/><p className="ln73-format-proof"><strong>Records são final por natureza.</strong> Por isso combinam muito bem com sealed interface quando cada possibilidade carrega dados diferentes.</p></section>; }

function ResultLab() { const [name, setName] = useState('Ana'); const valid = name.trim().length > 0; return <section className="sl82-stack"><div className="sl82-result"><label>Nome do cliente<input value={name} onChange={event => setName(event.target.value)}/></label><ArrowRight/><article className={valid ? 'success' : 'error'}><small>RESULTADO CONCRETO</small><strong>{valid ? 'Sucesso' : 'Erro'}</strong><span>{valid ? 'Cliente ' + name.trim() + ' criado.' : 'NOME_OBRIGATORIO · Nome obrigatório.'}</span></article></div><div className="sl82-result-tree"><strong>sealed Resultado</strong><span className={valid ? 'active' : ''}>record Sucesso(mensagem)</span><span className={!valid ? 'active error' : ''}>record Erro(codigo, mensagem)</span></div><CodePanel name="Resultado de operação sem null ou boolean solto" code={'sealed interface Resultado permits Sucesso, Erro { }\nrecord Sucesso(String mensagem) implements Resultado { }\nrecord Erro(String codigo, String mensagem) implements Resultado { }\n\nResultado criarCliente(String nome) {\n    if (nome == null || nome.isBlank()) {\n        return new Erro("NOME_OBRIGATORIO", "Nome obrigatório.");\n    }\n    return new Sucesso("Cliente criado.");\n}'}/><aside className="guided-note info"><Lightbulb size={20}/><div><strong>Conjunto conhecido prepara exaustividade</strong><p>O compilador sabe que Resultado só pode ser Sucesso ou Erro. Pattern matching em switch será aprofundado na próxima aula.</p></div></aside></section>; }

const OPTIONS = [
  ['status simples e fixo', 'enum', 'PENDENTE, CONFIRMADO, RECUSADO'],
  ['formas com dados diferentes', 'sealed', 'Pix(chave), Cartao(final, parcelas), Boleto(codigo)'],
  ['valor vem do banco', 'dynamic', 'cadastro não deve exigir recompilação'],
  ['plugins de terceiros', 'open', 'interface aberta é parte da extensibilidade'],
];
function ChoiceLab() { const [selected, setSelected] = useState(0); const item = OPTIONS[selected]; const labels = { enum: 'Use enum', sealed: 'Use sealed', dynamic: 'Modele como dado', open: 'Use interface aberta' }; return <section className="sl82-stack"><div className="sl82-options">{OPTIONS.map((entry, index) => <button type="button" key={entry[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><strong>{entry[0]}</strong><small>{entry[2]}</small></button>)}</div><div className={'sl82-choice ' + item[1]}><Braces size={25}/><div><small>DECISÃO</small><strong>{labels[item[1]]}</strong><span>{item[2]}</span></div></div><CodePanel name="Enum versus sealed" code={'enum StatusPagamento {\n    PENDENTE, CONFIRMADO, RECUSADO\n}\n\nsealed interface Pagamento permits Pix, Cartao, Boleto { }\nrecord Pix(String chave) implements Pagamento { }\nrecord Cartao(String finalCartao, int parcelas) implements Pagamento { }\nrecord Boleto(String codigoBarras) implements Pagamento { }'}/><p className="ln73-format-proof">Se as opções são <strong>valores simples</strong>, enum costuma bastar. Se cada opção exige <strong>estrutura própria</strong>, sealed pode representar estados válidos melhor.</p></section>; }

const DOMAINS = [
  ['Cliente', 'PessoaFisica | PessoaJuridica', 'CPF e CNPJ deixam de ser campos opcionais misturados'],
  ['Produto', 'Fisico | Digital', 'pesoKg e tamanhoMb pertencem ao subtipo correto'],
  ['Pedido', 'Criado | Aprovado | Cancelado', 'cada evento carrega seus dados e Instant'],
  ['Pagamento', 'Pix | Cartao | Boleto', 'forma determina chave, parcelas ou código'],
  ['Ordem de serviço', 'Reagendar | Concluir | Cancelar', 'ação controla data, hora ou motivo'],
  ['Mensageria', 'BoasVindas | Entrega | Nps', 'cada mensagem possui payload próprio'],
  ['Auditoria', 'Criacao | Edicao | Exclusao', 'eventos conhecidos preservam dados específicos'],
];
function DomainLab() { const [selected, setSelected] = useState(0); const item = DOMAINS[selected]; return <section className="sl82-stack"><div className="ln73-domains sl82-domains"><div>{DOMAINS.map((domain, index) => <button type="button" key={domain[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{domain[0]}</strong></button>)}</div><article><small>HIERARQUIA DO DOMÍNIO</small><h3>{item[0]}</h3><code>{item[1]}</code><p>{item[2]}.</p><div><strong>Teste do mentor</strong><span>O conjunto é fechado por regra ou precisa receber tipos de fora?</span></div></article></div><div className="sl82-refactor"><article><small>ANTES</small><strong>String tipo + muitos campos opcionais</strong><span>null, combinações inválidas e validação espalhada</span></article><ArrowRight/><article className="after"><small>DEPOIS</small><strong>sealed + records específicos</strong><span>cada subtipo só aceita os próprios dados</span></article></div><aside className="guided-note warning"><AlertTriangle size={20}/><div><strong>Sealed controla tipos, não valores</strong><p>CPF, preço, parcelas, datas e motivos ainda exigem validação de negócio. A palavra-chave não é uma barreira de segurança absoluta.</p></div></aside></section>; }

const ERRORS = [
  ['Sealed por moda', 'Enum ou classe simples já resolveria.', 'Escolha a estrutura mais simples.'],
  ['Esquecer permits', 'A fronteira fica ausente ou pouco clara.', 'Liste subtipos diretos explicitamente no curso.'],
  ['Subtipo sem decisão', 'Classe permitida não declara final, sealed ou non-sealed.', 'Decida como o ramo continua.'],
  ['Fora de permits', 'Novo implementador falha na compilação.', 'Inclua conscientemente ou mantenha proibido.'],
  ['non-sealed acidental', 'Ramo volta a aceitar extensões livres.', 'Reabra apenas por contrato explícito.'],
  ['Árvore profunda', 'Leitura e manutenção pioram.', 'Use poucos níveis com significado real.'],
  ['Segurança absoluta', 'Dados inválidos ainda entram no subtipo.', 'Valide invariantes separadamente.'],
  ['Interface inchada', 'Dados específicos viram contrato comum.', 'Mantenha apenas operações compartilhadas.'],
  ['Domínio dinâmico', 'Cadastro exige alterar e recompilar código.', 'Modele como dado ou interface aberta.'],
  ['Java incompatível', 'sealed não compila no JDK antigo.', 'Use Java 17+ e confira java/javac.'],
];
function ErrorsClinic() { const [selected, setSelected] = useState(0); const item = ERRORS[selected]; return <section className="ln73-errors sl82-errors"><div>{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article><header><AlertTriangle size={20}/><div><small>CASO {selected + 1} DE 10</small><h3>{item[0]}</h3></div></header><p><strong>Sintoma:</strong> {item[1]}</p><p><Wrench size={16}/><strong>Correção:</strong> {item[2]}</p></article></section>; }

const CHECKS = ['Java 17+ confirmado', 'aberto versus sealed explicado', 'permits protegeu três pagamentos', 'tipo não permitido falhou no javac', 'final encerrou um ramo', 'sealed controlou outro nível', 'non-sealed reabriu conscientemente', 'records carregaram dados distintos', 'Resultado eliminou null/boolean solto', 'enum versus sealed foi defendido'];
function DeliveryLab() { const [checked, setChecked] = useState([]); const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]); const commands = ['mkdir labs\\m2\\aula-082-sealed-classes-interfaces', 'cd labs\\m2\\aula-082-sealed-classes-interfaces', 'java -version', 'javac -version', 'javac LaboratorioSealed.java', 'java LaboratorioSealed'].join('\n'); return <section className="ln73-delivery"><CodePanel name="LaboratorioSealed.java" code={MAIN_PROGRAM}/><div className="ln73-terminal"><header><Terminal size={15}/>Verificar, compilar e executar<CopyButton value={commands}/></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS&gt; ')}{ '\n\n' }<span>{EXPECTED_OUTPUT}</span></pre></div><section className="ln73-debug"><header><Play size={18}/><strong>Debug: contrato estático e subtipo real</strong></header><div><article><span>1</span><strong>Breakpoint</strong><p>Pare no primeiro instanceof.</p></article><article><span>2</span><strong>Declarado</strong><p>pagamento tem tipo Pagamento.</p></article><article><span>3</span><strong>Runtime</strong><p>getClass mostra PagamentoPix.</p></article><article><span>4</span><strong>Pattern</strong><p>pix libera chave sem cast manual.</p></article></div></section><div className="ln73-checks">{CHECKS.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14}/> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22}/><h3>Desafio: ações controladas de uma OS</h3></div><p>Modele Reagendar, Concluir e Cancelar como records de uma sealed interface AcaoOs.</p><ul><li>Dê a cada ação apenas os dados necessários.</li><li>Provoque uma ação fora de permits e registre o erro do javac.</li><li>Crie um segundo nível sealed somente se houver agrupamento real.</li><li>Explique por que plugins externos pediriam interface aberta.</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16}/>README.md · evidências<CopyButton value={EVIDENCE}/></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>; }

function ContentBlock({ block }) { if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>; const map = { boundary: BoundaryLab, permits: PermitsLab, continuation: ContinuationLab, shape: ShapeLab, result: ResultLab, choice: ChoiceLab, domains: DomainLab, errors: ErrorsClinic, delivery: DeliveryLab }; const Component = map[block.type]; return Component ? <Component/> : null; }
const steps = [
  { id: 'boundary', label: 'Fronteira da Hierarquia', duration: '11 min', eyebrow: 'ABERTA, FINAL OU CONTROLADA', title: 'Deixe o domínio dizer quem pode participar', blocks: [{ type: 'lead', text: 'Sealed cria a alternativa intermediária: a hierarquia não é aberta a qualquer implementação nem bloqueada por completo.' }, { type: 'boundary' }] },
  { id: 'permits', label: 'Permits e Compilador', duration: '13 min', eyebrow: 'LISTA DE SUBTIPOS DIRETOS', title: 'Faça o javac rejeitar possibilidades não previstas', blocks: [{ type: 'lead', text: 'Permits transforma a fronteira em contrato compilável. Um subtipo direto ausente não entra silenciosamente no modelo.' }, { type: 'permits' }] },
  { id: 'continuation', label: 'Final, Sealed, Non-sealed', duration: '15 min', eyebrow: 'DESTINO DE CADA RAMO', title: 'Encerre, continue ou reabra com intenção explícita', blocks: [{ type: 'lead', text: 'Todo subtipo direto permitido precisa escolher final, sealed ou non-sealed. Cada palavra muda o futuro da árvore.' }, { type: 'continuation' }] },
  { id: 'shape', label: 'Classe, Interface e Records', duration: '14 min', eyebrow: 'DUAS FORMAS DE BASE', title: 'Escolha contrato ou base abstrata sem perder o controle', blocks: [{ type: 'lead', text: 'Sealed interface favorece records com dados distintos; sealed class pode compartilhar implementação e controlar subclasses.' }, { type: 'shape' }] },
  { id: 'result', label: 'Resultado Controlado', duration: '15 min', eyebrow: 'SUCESSO OU ERRO COM DADOS', title: 'Modele resultados válidos em vez de null e boolean soltos', blocks: [{ type: 'lead', text: 'Resultado fechado com records torna as duas saídas explícitas e prepara verificações de completude sem antecipar pattern matching avançado.' }, { type: 'result' }] },
  { id: 'choice', label: 'Enum, Sealed ou Aberto', duration: '13 min', eyebrow: 'DECISÃO DE MODELAGEM', title: 'Use a estrutura que corresponde à variabilidade real', blocks: [{ type: 'lead', text: 'Enum representa valores simples; sealed representa alternativas com estruturas próprias; dados e plugins dinâmicos pedem outros contratos.' }, { type: 'choice' }] },
  { id: 'domains', label: 'Refatoração no Backend', duration: '16 min', eyebrow: 'SETE DOMÍNIOS', title: 'Troque combinações inválidas por subtipos que fazem sentido', blocks: [{ type: 'lead', text: 'Cliente, produto, pedido, pagamento, OS, mensageria e auditoria mostram onde campos opcionais podem virar tipos controlados.' }, { type: 'domains' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'DEZ DIAGNÓSTICOS', title: 'Encontre fronteiras falsas, ramos abertos e complexidade inútil', blocks: [{ type: 'lead', text: 'Sealed melhora o compilador, mas não valida dados, não substitui enum e não combina com todo domínio extensível.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '30 min', eyebrow: 'CÓDIGO, DEBUG E GIT', title: 'Prove todos os destinos de uma hierarquia controlada', blocks: [{ type: 'lead', text: 'Compile o laboratório, confirme oito saídas, provoque erros do javac e entregue decisões justificadas.' }, { type: 'delivery' }] },
];

export default function GuidedSealedTypesLesson082({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) { const [activeIndex, setActiveIndex] = useState(0); const navRef = useRef(null); const completionNormalizedRef = useRef(false); const [completedSteps, setCompletedSteps] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); const validIds = new Set(steps.map(step => step.id)); return new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []); } catch { return new Set(); } }); useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps])), [completedSteps]); useEffect(() => { if (!completionNormalizedRef.current && isCompleted && completedSteps.size !== steps.length) { completionNormalizedRef.current = true; onToggleCompleted(); } }, [completedSteps.size, isCompleted, onToggleCompleted]); useEffect(() => { const button = navRef.current?.querySelector('button.active'); if (button && window.matchMedia('(max-width: 900px)').matches) button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }, [activeIndex]); const step = steps[activeIndex]; const stepDone = completedSteps.has(step.id); const allStepsDone = completedSteps.size === steps.length; const lessonComplete = isCompleted && allStepsDone; const selectStep = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }; const toggleStep = () => { if (stepDone && isCompleted) onToggleCompleted(); setCompletedSteps(current => { const next = new Set(current); if (next.has(step.id)) next.delete(step.id); else next.add(step.id); return next; }); }; return <article className="guided-git-lesson guided-sealed-types-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><LockKeyhole size={17}/>Oficina de hierarquias Java</span><p className="guided-sequence">082 · M2.21</p><h1>Sealed classes e interfaces</h1><p>Controle possibilidades do domínio, escolha o destino de cada ramo e deixe o compilador proteger a fronteira.</p></div><div className="guided-hero-status"><Clock3 size={42}/><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 082" items={[{ value: '3 destinos', label: 'final, sealed e non-sealed' }, { value: '7 domínios', label: 'Modelados sem campos soltos' }, { value: '10 falhas', label: 'Diagnosticadas pela causa' }]}/><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 082"><div className="guided-step-nav-title"><ListChecks size={18}/>Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? 'active ' : '') + (completedSteps.has(item.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14}/> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + '-' + index} block={block}/>)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17}/>Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (stepDone ? 'undo' : 'complete')} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16}/>Desmarcar etapa</> : <><CheckCircle2 size={16}/>Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17}/></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30}/><div><h3>Hierarquia fechada com intenção explícita</h3><p>{lessonComplete ? 'Aula concluída e pronta para pattern matching.' : 'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17}/>Aula 081</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsDone ? 'ready' : '')}><Clock3 size={18}/><span><strong>{lessonComplete ? 'Aula concluída' : completedSteps.size + ' de ' + steps.length + ' etapas'}</strong><small>sealed, permits e hierarquia</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 083<ArrowRight size={17}/></button></footer></article>; }
